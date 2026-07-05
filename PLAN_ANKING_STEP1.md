# Plan: reconversión de la app a USMLE Step 1 (fuente AnKing)

> **Estado (2026-07-05, actualizado):** v1 en marcha. App migrada, traducida al inglés, tema visual rojo, icono propio, desplegada en Vercel. Datos en producción (`app/data/db.js`): **65 temas / 2.693 preguntas**.
> **Autor del plan:** Opus (2026-07-04). Implementación: Sonnet.
> Login desactivado temporalmente (`GATE_DISABLED_FOR_TESTING` en `app/auth/gate.js`) mientras dura la fase de pruebas.
> Prueba de concepto original: [`data/anking/muestra_step1.json`](data/anking/muestra_step1.json) — 3 temas, 33 preguntas (ya incluidos en el dataset actual).
>
> ⚠️ **Los números de universo/pipeline de §4 de más abajo (26.844, 25.700, etc.) eran una ESTIMACIÓN inicial y resultaron incorrectos una vez se construyó de verdad el extractor.** Los números reales, verificados, están en **[§10 — Estado real y cómo retomarlo](#10-estado-real-y-cómo-retomarlo-rápido-2026-07-05)** al final de este documento. Empieza por ahí si vas a continuar la conversión.

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

---

## 10. Estado real y cómo retomarlo rápido (2026-07-05)

Todo lo de abajo está **verificado ejecutando el pipeline de verdad** (no estimado). Si vuelves a esto en otro chat, empieza aquí.

### 10.1 El mazo no es solo Step 1

El `.apkg` que se usa (`Anking_Step-1.apkg`, ~27 MB) es en realidad el **megamazo combinado AnKing Overhaul** (Step 1 + Step 2 + algo de Step 3 en un único notetype `AnKingOverhaul`, 34.638 notas). Las notas llevan tags de **dos namespaces distintos**: `#AK_Step1_v11::...` y `#AK_Step2_v11::...` (a veces ambos en la misma nota). Hay que filtrar explícitamente por `AK_Step1_v11` — si no, se cuelan preguntas de rotaciones clínicas (ObGyn, Medicina de Familia…) que no son Step 1.

- **Ubicación del `.apkg`:** en esta máquina vive en `C:\Users\arnal\Desktop\Anking_Step-1.apkg` (fuera del repo — es contenido de terceros, ver `.gitignore`). **Si no está ahí en una sesión futura, pregunta al usuario dónde está antes de intentar nada** — no se puede regenerar sin él y no debe descargarse de internet por cuenta propia (licencia de terceros).

### 10.2 Números reales del universo (verificados con `tools/anki_extract.py`)

| Filtro | Notas |
|---|---|
| Total notetype `AnKingOverhaul` | 34.638 |
| ...con tag `AK_Step1_v11` (cualquiera) | 25.949 |
| ...de esas, con subtag `#FirstAid::...` (clasificables por sistema) | 24.177 |
| ...de esas, texto plano + 1 solo cloze (**universo limpio convertible v1**) | **18.189** |
| Step 2/3 (fuera de alcance, descartadas) | 8.688 |
| Step 1 sin subtag FirstAid (aparcadas para v2 — sin taxonomía clara) | 1.772 |
| Multi-cloze (aparcadas para v2) | 6.482 |
| Con imagen/audio en el enunciado (aparcadas para v2) | 1.312 |

Los números de la cabecera de este documento (26.844 / 25.700 / 6.500 / 1.300) eran una estimación previa a construir el extractor real — **descártalos, usa la tabla de arriba.**

### 10.3 Progreso de conversión

- **Convertidas y en producción:** 2.693 preguntas / 65 temas (`data/anking/step1_dataset_2693q.json`, cargado en `app/data/db.js`).
  - 1.130 de la primera fase (documentada en el resto de este plan).
  - +1.563 de una tanda de hiperloop de agentes (2026-07-05, ver §10.5), sobre los lotes `batch_0000`–`batch_0044` (35 tarjetas/lote): 1.567 generadas, 5 descartadas tras QA + validación estructural.
- **Quedan por convertir: ~15.500** tarjetas del universo limpio (18.189 − 2.696 ids únicos usados, incluyendo los 3 descartados que se recuperaron al regenerarse — ver aviso de §10.5).
- Ya hay **488 lotes de 35 tarjetas pre-cortados** en `data/anking/_batches_in/batch_0000.json`…`batch_0487.json` (el extractor ya se ejecutó y los cortó todos). **Los lotes `0000`–`0044` ya están procesados**; quedan `0045`–`0487` (443 lotes) listos para lanzar sin más preparación — **pero ojo:** esta carpeta está en `.gitignore` (son datos regenerables, no se suben a GitHub), así que si trabajas desde otra máquina/clon del repo no van a estar ahí — hay que regenerarlos (§10.4, paso 1).
- ⚠️ **Cuidado al lanzar una tanda nueva con `args.startBatch`:** el 2026-07-05 se lanzó una segunda tanda con `{startBatch:45, nBatches:45}` esperando que atacara `batch_0045`-`batch_0089`, pero sus agentes reales pidieron `batch_0000`-`batch_0031` — **reprocesó lotes ya hechos en vez de nuevos** (causa no confirmada: posible problema de cómo se resolvió `args` en esa invocación de `Workflow`, no reproducido a fondo). Se perdió ~1h de tokens en trabajo redundante antes de pararla con `TaskStop`. **Antes de dar por bueno un rango nuevo, comprueba el prompt real del primer agente lanzado** (mira su transcript en `subagents/workflows/<runId>/agent-*.jsonl`, busca la ruta `batch_NNNN.json` que de verdad pidió leer) **en vez de asumir que el `args` pasado se aplicó.**

### 10.4 Receta exacta para continuar

1. **(Solo si `data/anking/_batches_in/` no existe o está vacía)** Regenerar la extracción cruda y los lotes:
   ```
   "/c/Python313/python.exe" tools/anki_extract.py "<ruta al .apkg>" data/anking/_raw_all.json
   ```
   y luego re-cortar en lotes de 35 excluyendo los `anki` ids ya presentes en `data/anking/step1_dataset_2690q.json` (mismo patrón que se usó la primera vez; no hay un script dedicado para el recorte, se hizo con un one-liner de Python — ver el historial de este chat o reescribirlo, es trivial: `raw` menos `done_ids`, en trozos de 35, escritos a `_batches_in/batch_NNNN.json`).

2. **Lanzar el workflow** (ya soporta rango parametrizado, no relanza lo ya hecho):
   ```
   Workflow({ scriptPath: "tools/anking_convert.workflow.js", args: { startBatch: 45, nBatches: N } })
   ```
   Sube `N` según cuánto presupuesto de tokens haya. Cada agente de generación convierte 1 lote (35 preguntas); cada 9 lotes se lanza 1 agente de QA. Total agentes ≈ `N + ceil(N/9)`.

   **Importante — concurrencia real:** el tope es `min(16, núcleos de CPU de esta máquina - 2)`. Esta máquina tiene 4 núcleos → **solo 2 agentes a la vez**, no 16. Calcula el tiempo/coste con eso en mente, no con el máximo teórico.

3. **Si hay que cortar por presupuesto de tokens a mitad de una tanda:** usar `TaskStop` con el `task_id` que devuelve `Workflow` al lanzarlo. Los lotes que ya hayan escrito su fichero de salida en `data/anking/_batches_out/` son válidos y se pueden fusionar igualmente — no se pierde el trabajo ya hecho.

4. **Fusionar y reconstruir la base de datos:**
   ```
   "/c/Python313/python.exe" tools/merge_anking_batches.py --flagged <fichero-de-flagged-si-lo-hay>.json
   ```
   Esto valida estructuralmente cada pregunta (opciones A-D distintas y no vacías, `r` válido, `incorrectas` con las 3 claves correctas y explicaciones no vacías/no "N/A", sin artefactos `{{c1::` filtrados), asigna/reutiliza el id de `tema` por nombre, y escribe `data/anking/step1_dataset_<N>q.json` + `app/data/db.js` directamente (no hay paso de build separado, se sustituye `window.DB = {...}` tal cual, igual que en las tandas anteriores). Recuerda **renombrar** el fichero de salida (`step1_dataset_full.json` → `step1_dataset_<total>q.json`) para mantener la convención de nombres.

5. **Bump `DB_HASH` en `app/sw.js`** cada vez que cambie el contenido de `app/data/db.js`. El service worker cachea la BD *cache-first* por ese hash; si no se sube, los usuarios que ya tengan la app instalada se quedan con los datos viejos indefinidamente (este bug llevaba desde la POC sin corregirse — el comentario del fichero decía que `build_db.py` lo reescribía solo, pero el pipeline de AnKing nunca ha usado `build_db.py`, así que nadie lo estaba subiendo).
6. **Commit + push:** `app/data/db.js`, el nuevo `data/anking/step1_dataset_<N>q.json`, `app/sw.js` (DB_HASH), y esta actualización del plan. Vercel redespliega solo al hacer push a `main`.

### 10.5 Calidad observada en la primera tanda de hiperloop

De 1.567 preguntas generadas (lotes 0-44), el agente de QA marcó **8** (0,5%) con un patrón consistente: **claves de letra desalineadas** en `e.incorrectas` (la explicación de una opción aparece bajo la letra equivocada, o falta la de una opción y sobra una con la propia letra de la respuesta correcta). El validador estructural de `tools/merge_anking_batches.py` detecta este mismo patrón automáticamente (comprueba que las claves de `incorrectas` sean exactamente las 3 letras que no son `r`). **Mantén la etapa de QA del workflow** — es barata (1 agente cada 9 lotes) y es la que atrapa este fallo de forma fiable.

Nota: de esas 8, **3 se recuperaron** — la tanda accidentalmente redundante de §10.3 regeneró de cero los lotes `0010`, `0023` y (parcialmente) otros, y por azar esas 3 preguntas concretas salieron bien formadas la segunda vez, así que se readmitieron al fusionar. Las otras 5 (lotes `0036`, `0037`, `0039`, no tocados por la tanda redundante) siguen descartadas.

### 10.6 Scripts que quedan en el repo para esto

- [`tools/anki_extract.py`](tools/anki_extract.py) — extrae del `.apkg` el universo limpio Step 1 (maneja esquema legacy y moderno de Anki, zstd, filtra Step 2/3 y multi-cloze/imagen).
- [`tools/anking_convert.workflow.js`](tools/anking_convert.workflow.js) — workflow de conversión por lotes (generación + QA), parametrizado por `args.startBatch`/`args.nBatches`.
- [`tools/merge_anking_batches.py`](tools/merge_anking_batches.py) — valida y fusiona los lotes de salida en el dataset de producción + reconstruye `app/data/db.js`.
