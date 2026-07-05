# Plan: reconversión de la app a USMLE Step 1 (fuente AnKing)

> **Estado:** v1 en marcha. App migrada, traducida al inglés y funcionando en local con **65 temas / 1.130 preguntas** (2026-07-05).
> **Autor del plan:** Opus (2026-07-04). Implementación: Sonnet.
> **Datos en producción (`app/data/db.js`):** [`data/anking/step1_dataset_1130q.json`](data/anking/step1_dataset_1130q.json) — 65 temas (16 sistemas de First Aid × ~4 subtemas cada uno de media), 1.130 preguntas generadas en dos tandas de workflow (16 + 46 agentes en paralelo) a partir de tarjetas cloze "normales" de AnKing (limpias, un solo hueco). 0 preguntas descartadas por malformadas en ninguna tanda.
> Universo de tarjetas "normales" convertibles con el pipeline actual: 26.844. Quedan ~25.700 sin convertir dentro de ese universo (más ~6.500 multi-hueco y ~1.300 con imagen/audio, aparcadas para v2 — ver §7).
> Login desactivado temporalmente (`GATE_DISABLED_FOR_TESTING` en `app/auth/gate.js`) mientras dura la fase de pruebas.
> Prueba de concepto original: [`data/anking/muestra_step1.json`](data/anking/muestra_step1.json) — 3 temas, 33 preguntas (ya incluidos en el dataset actual).

---

## 1. Objetivo

Reutilizar la app actual (PWA de estudio tipo test, hoy orientada a la OPE de Urgencias) para **preparar el USMLE Step 1**, con las preguntas generadas a partir del mazo Anki **AnKing Overhaul Step 1 v11**.

Cambio conceptual central: **ya no hay "comunidades autónomas"; hay "fuentes"**. Hoy la única fuente es AnKing; el diseño debe permitir **añadir más fuentes en el futuro** (otros mazos, bancos de preguntas propios, etc.) sin refactor.

Además, **la app pasa a estar en inglés** (el contenido del Step 1 es en inglés; la interfaz debe ser coherente).

---

## 2. Qué hay hoy (punto de partida)

- **App:** PWA estática en `app/`. Sin build. Carga `app/data/db.js` (`window.DB`) y `app.js` (2056 líneas) maneja todo. Auth con Supabase (`config.js`, `auth/gate.js`).
- **Modelo de datos actual** (`window.DB`):
  ```
  { version, temas[], examenes[], casos{}, preguntas[] }
  ```
  Cada pregunta:
  ```
  { id, ex(examen), n, q(enunciado), o:{A,B,C,D}, r(correcta),
    t(tema), e:{correcta, incorrectas:{...}}, dup }
  ```
- **Acoplamiento a la OPE** (a desmontar): en `app.js` hay ~75 referencias a `comunidad`, ~51 a `examen`, ~50 a `simulacro`, ~30 a `caso`. La UI (`index.html`) tiene: selector de comunidad autónoma, temario Común/Específico, filtros "¿de qué comunidades?", simulacro "examen real 110 preguntas", banderas de comunidad, casos clínicos.

- **El mazo Anki** (`Anki/Anking_Step-1.apkg`, 27 MB): es un ZIP con `collection.anki2` (SQLite) + media.
  - **34.639 notas**, prácticamente todas del notetype **AnKingOverhaul** (tipo **cloze**).
  - Campos: `Text` (con huecos `{{c1::...}}`), `Extra` (explicación), + campos de fuente (First Aid, Pathoma, Boards & Beyond, Sketchy, Pixorize, Physeo, OME…).
  - **Tags** = jerarquía de First Aid: `#AK_Step1_v11::#FirstAid::07_Cardiovascular::03_Physiology::...`
  - **33.326 notas son solo texto** (sin imagen ni audio); 1.302 con imagen, 41 con audio.
  - Densidad de huecos: ~28.000 con 1 solo cloze, ~5.200 con 2, el resto más.

---

## 3. Nuevo modelo de datos

Mantener el esquema lo más parecido posible al actual (para minimizar cambios en `app.js`), pero sustituyendo la dimensión "comunidad/examen" por **"fuente"**:

```jsonc
window.DB = {
  "version": "...",
  "fuentes": [
    { "id": "anking", "nombre": "AnKing Overhaul — Step 1 (v11)", "idioma": "en",
      "descripcion": "...", "licencia": "..." }
    // futuras fuentes se añaden aquí
  ],
  "temas": [
    { "id": 1, "nombre": "Medical Ethics", "sistema": "Public Health & Ethics", "fuente": "anking" }
    // "sistema" = capítulo First Aid (organ system / subject) para agrupar en la UI
  ],
  "preguntas": [
    { "id": "anking-ethics-001", "fuente": "anking", "tema": 1,
      "anki": "1521934672882",           // trazabilidad a la nota Anki original
      "q": "...", "o": {"A":"...","B":"...","C":"...","D":"..."},
      "r": "A",
      "e": { "correcta": "...", "incorrectas": {"B":"...","C":"...","D":"..."} } }
  ]
}
```

Cambios respecto al actual:
- **Fuera:** `examenes`, `casos`, y en cada pregunta `ex`, `n`, `dup`.
- **Dentro:** `fuentes[]`; en cada pregunta `fuente` y `anki` (id de la nota original, para depurar/regenerar).
- `temas[]` se conserva pero ahora sale de la jerarquía First Aid; se le añade `sistema` (agrupador) y `fuente`.

> La taxonomía de temas propuesta = los 16 capítulos First Aid del mazo (Microbiology, Biochemistry, Neuro, Cardiovascular, Endocrine, GI, Heme/Onc, Repro, Renal, Immunology, MSK/Skin, Pharmacology, Respiratory, Pathology, Psychiatry, Public Health), subdivididos por el 3.er nivel de tag cuando convenga.

---

## 4. Pipeline de datos (extracción + conversión)

### Fase A — Extracción (determinista, sin IA)
1. Descomprimir el `.apkg` → leer `collection.anki2` con SQLite (en Node 24 sirve `node:sqlite`, ya probado).
2. Por cada nota AnKingOverhaul:
   - `Text` → limpiar HTML → detectar respuesta(s) cloze `{{c1::...}}` (quitar sufijo `::hint`).
   - Enunciado = `Text` con el hueco marcado; `Extra` = explicación.
   - Tags → mapear a `tema`/`sistema` (regex sobre `#FirstAid::NN_Sistema::NN_Subtema`).
3. **Filtros de calidad para el primer volcado:** solo texto (sin `<img>`/`[sound:]`) **y** 1 solo cloze → subconjunto limpio (~28.000 notas). Imagen/audio se posponen (ver §7).
4. Salida: JSON crudo `{ id, tema, sistema, stem, answer, extra }` por nota.

> El script de extracción probado en la POC vive en el scratchpad; Sonnet debe recrearlo en `tools/` (p. ej. `tools/anki_extract.mjs`).

### Fase B — Conversión cloze → test (con IA, por lotes)
El reto real: una cloze da **enunciado + respuesta correcta**, pero **no los 3 distractores**. Hay que generarlos.

- **Enfoque recomendado (A):** pasar cada tarjeta (enunciado + respuesta + `Extra`) a un modelo que devuelva, en el **JSON exacto** de §3: enunciado reformulado como pregunta limpia + 3 distractores clínicamente plausibles + explicación de la correcta y de cada incorrecta.
- **Reaprovechar la tubería existente:** en `data/crudos/` ya hay `_slice_*.json` y `_prompt_*.txt` — el mismo patrón de lotes que se usó para la OPE. Replicarlo: trocear en lotes, generar, reensamblar.
- **QA obligatorio** (el punto débil es que la IA cuele un distractor accidentalmente correcto):
  - Verificar que `r` existe en `o` y que las 4 opciones son distintas.
  - Segundo pase de IA "adversario": ¿hay más de una opción correcta? ¿el distractor contradice la explicación?
  - Registrar en un inventario de calidad (como los `INVENTARIO_*.md` existentes).

> Estándar de calidad de la POC (a replicar): distractores del mismo "tipo" que la respuesta (p. ej. si la respuesta es un receptor, los distractores son otros receptores), explicación de por qué cada uno es incorrecto, y anclaje a First Aid.

---

## 5. Traducción de la app al inglés

`index.html`, `app.js` (strings) y `auth/gate.js` están en español. Hay que traducir **toda la UI** y, de paso, **renombrar los conceptos OPE → Step 1**. Tabla de referencia (concepto ES → EN + remapeo):

| Español (actual) | Inglés (nuevo) | Nota de remapeo |
|---|---|---|
| Médico de Urgencias / OPE Urgencias | USMLE Step 1 | marca, `<title>`, badges |
| Comunidad autónoma | **Source** | ahora "fuente" (AnKing…) |
| ¿De qué comunidades? | Which sources? | filtro de pool |
| Temario | Subjects / Topics | |
| Común / Específico | (eliminar) → agrupar por **organ system** | ya no aplica común/específico |
| Tema | Topic | |
| Temas más flojos | Weakest topics | |
| Simulacro de examen | Practice exam / Test block | ver §6 |
| Examen real (110 preguntas) | Real exam block | 40 Q/bloque en Step 1 (ver §6) |
| Casos clínicos | (posponer) | el AnKing base no trae vignettes MCQ |
| Inicio | Home | |
| Ajustes | Settings | |
| Estadísticas / Stats | Statistics / Stats | |
| Buscar preguntas | Search questions | |
| Entrar / Crear cuenta / Cerrar sesión | Log in / Sign up / Log out | `auth/gate.js` |
| Cuenta pendiente de aprobación | Account pending approval | |
| Empezar / Siguiente / Anterior / Finalizar | Start / Next / Previous / Finish | |
| Dejar en blanco | Leave blank | |
| Marcar pregunta 🚩 | Flag question | |
| Preguntas falladas / marcadas / nunca vistas | Incorrect / flagged / unseen questions | |
| Barajar el orden | Shuffle order | |
| Exportar / Importar / Borrar progreso | Export / Import / Reset progress | |
| Fecha del examen / cuenta atrás | Exam date / countdown | |
| `<html lang="es">` | `<html lang="en">` | |

> Recomendación para Sonnet: extraer los strings a un pequeño diccionario/objeto `I18N` en lugar de esparcirlos, para dejar la puerta abierta a multi-idioma. No es imprescindible en v1.

---

## 6. Remapeo del "simulacro" a Step 1

El USMLE Step 1 real ≈ 280 preguntas en 7 bloques de 40 (≈1 min/pregunta), aprobado/no aprobado. Propuesta:
- Renombrar "Simulacro" → **"Practice block" / "Test block"**.
- Modos: **Timed block** (40 Q / 40 min, sin corrección hasta el final) y **Tutor** (corrección inmediata, como la práctica actual).
- **Origen** = por **fuente** y/o por **organ system**, en lugar de por comunidad.
- Quitar la penalización "⅓ por error" (no aplica al Step 1).

---

## 7. Alcance y fases

1. **v1 (MVP):** modelo `fuentes`; app en inglés; solo tarjetas limpias 1-cloze; temas por organ system; práctica + test block. **Fuente única: AnKing.**
2. **v2:** tarjetas con 2 huecos; imágenes (1.302 notas → copiar media del `.apkg` a `app/img/`); búsqueda por tag.
3. **v3:** más fuentes; modo flashcard/cloze opcional (para quien prefiera el formato Anki original); estadísticas por sistema.

**Decidido con el usuario:**
- ❌ No usar comunidades autónomas. ✅ Solo "fuentes" (hoy AnKing; más en el futuro).
- ✅ App en inglés.
- ✅ Enfoque test (single best answer), no flashcard, para v1.

**Pendiente de decidir** (para cuando entre Sonnet):
- ¿Cuántas preguntas por tema en el primer volcado completo? (coste de IA sobre ~28.000 notas — probablemente empezar por N sistemas de alto rendimiento).
- ¿Formato de bloque exacto (40/40) o configurable?

---

## 8. Entregables de esta planificación

- ✅ [`PLAN_ANKING_STEP1.md`](PLAN_ANKING_STEP1.md) — este documento.
- ✅ [`data/anking/muestra_step1.json`](data/anking/muestra_step1.json) — POC: 3 temas (Medical Ethics, Histamine & Antihistamines, Reproductive Pharmacology), 33 preguntas convertidas y con `anki` de trazabilidad. Sirve de **contrato de esquema** y **patrón de calidad** para la Fase B.

## 9. Primeros pasos para Sonnet (orden sugerido)
1. Crear `tools/anki_extract.mjs` (Fase A) → volcar el JSON crudo de N sistemas.
2. Montar el pipeline de conversión por lotes (Fase B) reutilizando el patrón de `data/crudos/`.
3. Migrar `app/data/db.js` al nuevo esquema (§3) y adaptar `app.js` (quitar comunidad/examen/caso → fuente/tema/sistema).
4. Traducir UI al inglés (§5) y remapear el simulacro (§6).
5. Validar con la POC como test de humo.
