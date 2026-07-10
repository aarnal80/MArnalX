# Plan: reconversión de la app a USMLE Step 1 (fuente AnKing)

> **Estado (2026-07-08, actualizado):** v1 en marcha. App migrada, traducida al inglés, tema visual rojo, icono propio, desplegada en Vercel. Datos en producción (`app/data/db.js`): **110 temas / 7.615 preguntas / 2 fuentes** (AnKing + cuadernillo oficial NBME/FSMB), de las cuales **81 llevan imagen** (21 del cuadernillo NBME + 60 de una tanda piloto de AnKing "con imagen" — ver §13, incluida una segunda pasada de reparación que recuperó 13 de las 14 descartadas inicialmente). Explicaciones de la cohorte antigua de AnKing (fase 1 + 1ª tanda hiperloop, prompt sin reforzar) ya corregidas casi al completo — ver §10.7. Esquema ampliado para soportar opciones de longitud variable (hasta G) e imágenes en el enunciado — ver §11. Nuevas features de práctica: "Practice all subjects" (sin filtro de tema) y filtro "solo preguntas con imagen" en Advanced Options — ver §12. **Séptima tanda de conversión de texto** (1.974/1.975, ver §15): 5.641 → 7.615, sin pasada de QA (cortada por límite de sesión, se fusionó solo con el validador estructural — ver §15 para riesgos). Quedan **~10.757** tarjetas limpias de AnKing (universo de solo texto) por convertir, más el universo de imagen/audio tratado en §13.
> ⚠️ **El `.apkg` usado a partir del 2026-07-07 NO es el mismo fichero que el documentado en §10.1-10.2.** Ver §13.1 — notetype distinto (`Cloze-AnKingMaster` en vez de `AnKingOverhaul`), tags sin `_v11`/`#FirstAid::`, y **menos notas en total** (22.878 vs 34.638). Los números de §10.2 corresponden al `.apkg` viejo; no se han vuelto a verificar sobre el nuevo.
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

- **Convertidas y en producción:** 3.728 preguntas / 65 temas (`data/anking/step1_dataset_3728q.json`, cargado en `app/data/db.js`).
  - 1.130 de la primera fase (documentada en el resto de este plan).
  - +1.563 de la 1ª tanda de hiperloop (2026-07-05, lotes de 35 tarjetas): 1.567 generadas, 5 descartadas tras QA + validación estructural (más 3 recuperadas de una tanda redundante, ver más abajo).
  - +518 de la 2ª tanda de hiperloop (2026-07-05, lotes de 25 tarjetas, esfuerzo alto y prompt reforzado para explicaciones más profundas — ver §10.5): 520 generadas, 2 descartadas.
  - +517 de la 3ª tanda de hiperloop (2026-07-05, mismo prompt/config que la 2ª): 525 generadas, 7 descartadas (ratio más alto, 1,3% — ver nota de clustering en §10.5).
- **Quedan por convertir: ~14.460** tarjetas del universo limpio (18.189 − ids únicos ya usados).
- **Sobre los lotes pre-cortados en disco (`_batches_in/`, `_batches_in_v2/`, `_batches_in_v3/`):** están en `.gitignore` (regenerables, no se suben a GitHub) y a estas alturas están parcialmente desincronizados entre sí (se cortaron en momentos distintos, con tamaños de lote distintos, sobre "lo que quedaba" en cada momento). **No merece la pena intentar llevar la cuenta de qué sub-rango de qué carpeta está ya usado.** Para la próxima tanda, simplemente: recalcula "lo que falta" restando los `anki` ids del dataset de producción actual del universo limpio (`_raw_all.json`), y vuelve a cortar en lotes frescos en una carpeta nueva (p. ej. `_batches_in_v4`) — es un script de Python local, no cuesta tokens (ver receta en §10.4).
- ⚠️ **`args` de `Workflow` no fiable en este entorno — usar valores fijos en el script, no `args`:** se intentó dos veces pasar el rango de lotes vía `args: {startBatch, nBatches, ...}` a `Workflow({scriptPath, args})` sin `resumeFromRunId`, y **las dos veces el script ejecutó con los valores por defecto de las constantes, ignorando el `args` pasado** — reprocesando lotes ya hechos en vez de los nuevos indicados. Causa no confirmada (posible peculiaridad de cómo esta build de `Workflow` resuelve `args` en scripts con `scriptPath` ya usado antes). **Solución adoptada:** en `tools/anking_convert.workflow.js`, `START_BATCH`/`N_BATCHES`/`IN_DIR`/`OUT_DIR`/`QA_GROUP`/`GEN_EFFORT` son ahora **constantes hardcodeadas al principio del fichero** (no leen `args`) — edítalas a mano para cada tanda nueva. **Además, verifica siempre el primer agente real antes de dejar correr el resto:** espera ~20s tras lanzar, lee el primer mensaje de `subagents/workflows/<runId>/agent-*.jsonl` y confirma que la ruta `batch_NNNN.json` que pide leer es la que esperabas — si no, para con `TaskStop` inmediatamente (así se hizo la segunda vez: solo se gastaron 2 agentes en el error, no 32).

### 10.4 Receta exacta para continuar

1. **Recalcular qué falta y cortar lotes frescos** (no reutilices las carpetas `_batches_in*` antiguas, ver aviso de §10.3):
   ```python
   import json, os
   raw = json.load(open('data/anking/_raw_all.json', encoding='utf-8'))          # si no existe: tools/anki_extract.py "<ruta al .apkg>" data/anking/_raw_all.json
   done = json.load(open('data/anking/step1_dataset_3211q.json', encoding='utf-8'))  # usa siempre el fichero de dataset MÁS RECIENTE
   done_ids = set(q['anki'] for q in done['preguntas'])
   remaining = [r for r in raw if r['anki'] not in done_ids]
   BATCH = 25   # tamaño de lote; más pequeño = más atención por pregunta del agente
   os.makedirs('data/anking/_batches_in_v3', exist_ok=True)   # sube el sufijo _vN cada vez, para no pisar carpetas anteriores
   chunks = [remaining[i:i+BATCH] for i in range(0, len(remaining), BATCH)]
   NEEDED = 20  # cuantos lotes quieras lanzar esta vez
   for i in range(NEEDED):
       json.dump(chunks[i], open(f'data/anking/_batches_in_v3/batch_{i:04d}.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
   ```

2. **Editar las constantes al principio de `tools/anking_convert.workflow.js`** (NO uses `args` de `Workflow` — ver aviso de §10.3, no es fiable en este entorno):
   ```js
   const START_BATCH = 0
   const N_BATCHES = 20          // = NEEDED de arriba
   const QA_GROUP = 7            // 1 agente de QA cada N lotes
   const IN_DIR = '_batches_in_v3'
   const OUT_DIR = '_batches_out_v3'
   const GEN_EFFORT = 'high'
   ```
   Total agentes ≈ `N_BATCHES + ceil(N_BATCHES / QA_GROUP)`.

   **Importante — concurrencia real:** el tope es `min(16, núcleos de CPU de esta máquina - 2)`. Esta máquina tiene 4 núcleos → **solo 2 agentes a la vez**, no 16. Calcula el tiempo/coste con eso en mente, no con el máximo teórico.

3. **Lanzar y verificar INMEDIATAMENTE:**
   ```
   Workflow({ scriptPath: "tools/anking_convert.workflow.js" })
   ```
   A los ~20s, lee el primer mensaje de `subagents/workflows/<runId>/agent-*.jsonl` (el `runId`/`Transcript dir` que devuelve la llamada) y confirma que la ruta `batch_NNNN.json` que pide leer es la de la carpeta nueva (`IN_DIR`) y el número esperado (`0000`, no algo ya hecho). Si no coincide, `TaskStop` inmediatamente — así se limita el desperdicio a 1-2 agentes en vez de una tanda entera.

4. **Si hay que cortar por presupuesto de tokens a mitad de una tanda:** usar `TaskStop` con el `task_id` que devuelve `Workflow` al lanzarlo. Los lotes que ya hayan escrito su fichero de salida en `OUT_DIR` son válidos y se pueden fusionar igualmente — no se pierde el trabajo ya hecho.

5. **Fusionar y reconstruir la base de datos** (usa siempre el dataset más reciente como `--base`):
   ```
   "/c/Python313/python.exe" tools/merge_anking_batches.py --base data/anking/step1_dataset_3211q.json --glob "data/anking/_batches_out_v3/*.json" --flagged <fichero-de-flagged-si-lo-hay>.json
   ```
   Esto valida estructuralmente cada pregunta (opciones A-D distintas y no vacías, `r` válido, `incorrectas` con las 3 claves correctas y explicaciones no vacías/no "N/A", sin artefactos `{{c1::` filtrados), asigna/reutiliza el id de `tema` por nombre, y escribe `data/anking/step1_dataset_full.json` + `app/data/db.js` directamente (no hay paso de build separado, se sustituye `window.DB = {...}` tal cual). Recuerda **renombrar** el fichero de salida (`step1_dataset_full.json` → `step1_dataset_<total>q.json`) para mantener la convención de nombres, y borrar el `step1_dataset_<N>q.json` anterior de git (`git rm --cached`) si lo reemplazas.

6. **Bump `DB_HASH` en `app/sw.js`** cada vez que cambie el contenido de `app/data/db.js`. El service worker cachea la BD *cache-first* por ese hash; si no se sube, los usuarios que ya tengan la app instalada se quedan con los datos viejos indefinidamente (este bug llevaba desde la POC sin corregirse — el comentario del fichero decía que `build_db.py` lo reescribía solo, pero el pipeline de AnKing nunca ha usado `build_db.py`, así que nadie lo estaba subiendo).
7. **Verifica en el preview** (limpiar service worker/caches con `caches.keys()`+`unregister()` antes de comprobar `window.DB.preguntas.length`, si no puede seguir sirviendo la versión cacheada vieja).
8. **Commit + push:** `app/data/db.js`, el nuevo `data/anking/step1_dataset_<N>q.json`, `app/sw.js` (DB_HASH), y esta actualización del plan. Vercel redespliega solo al hacer push a `main`.

### 10.5 Calidad observada en las tandas de hiperloop

**1ª tanda** (2026-07-05, lotes de 35 tarjetas, prompt original): de 1.567 preguntas generadas, el agente de QA marcó **8** (0,5%) con un patrón consistente: **claves de letra desalineadas** en `e.incorrectas` (la explicación de una opción aparece bajo la letra equivocada, o falta la de una opción y sobra una con la propia letra de la respuesta correcta). El validador estructural de `tools/merge_anking_batches.py` detecta este mismo patrón automáticamente (comprueba que las claves de `incorrectas` sean exactamente las 3 letras que no son `r`).

Nota: de esas 8, **3 se recuperaron** — una tanda accidentalmente redundante (ver aviso de §10.3) regeneró de cero los lotes `0010`, `0023` y otros, y por azar esas 3 preguntas concretas salieron bien formadas la segunda vez, así que se readmitieron al fusionar. Las otras 5 (lotes `0036`, `0037`, `0039`) siguen descartadas.

**2ª tanda** (2026-07-05, lotes de 25 tarjetas, `effort: 'high'`, prompt reforzado explícitamente contra explicaciones superficiales — ver el requisito #4 y el ejemplo de estilo cardiovascular en `tools/anking_convert.workflow.js`): de 520 preguntas generadas, solo **2** (0,4%) marcadas, con explicaciones sensiblemente más largas y con más contenido de mecanismo/razonamiento que la 1ª tanda (verificado leyendo muestras reales, no solo el ratio de descarte). **Si se hacen más tandas, usar este prompt (ya es el que queda en el repo) y no el original.**

**3ª tanda** (2026-07-05, misma config exacta que la 2ª): de 525 preguntas generadas, **7** marcadas (1,3% — más que la 2ª). Importante: **5 de las 7 venían del mismo lote** (`batch_0019`), todas con el mismo patrón de letra desalineada — es decir, no es un 1,3% de error uniforme por pregunta, es más bien "la mayoría de los agentes salen limpios, pero de vez en cuando un agente entero se desalinea en varias preguntas seguidas". Si un grupo de QA marca ≥3 preguntas del mismo fichero de lote, probablemente valga la pena relanzar ese lote entero en vez de solo descartar las marcadas (no se hizo esta vez por ser pocas preguntas, pero considéralo si vuelve a pasar con más volumen).

**Mantén siempre la etapa de QA del workflow** — es barata (1 agente cada 7-9 lotes) y es la que atrapa estos fallos de forma fiable; el validador estructural por sí solo no detecta explicaciones superficiales pero sí correctas, solo la letra-desalineación. El bug de `args` (§10.3) no ha vuelto a aparecer usando constantes hardcodeadas — confirmado limpio en 2 tandas seguidas (2ª y 3ª).

### 10.6 Scripts que quedan en el repo para esto

- [`tools/anki_extract.py`](tools/anki_extract.py) — extrae del `.apkg` el universo limpio Step 1 (maneja esquema legacy y moderno de Anki, zstd, filtra Step 2/3 y multi-cloze/imagen).
- [`tools/anking_convert.workflow.js`](tools/anking_convert.workflow.js) — workflow de conversión por lotes (generación + QA). Parámetros de la tanda como **constantes hardcodeadas al principio del fichero** (`START_BATCH`/`N_BATCHES`/`IN_DIR`/`OUT_DIR`/`QA_GROUP`/`GEN_EFFORT`) — edítalas a mano, no uses `args` de `Workflow` (no fiable, ver §10.3).
- [`tools/merge_anking_batches.py`](tools/merge_anking_batches.py) — valida y fusiona los lotes de salida en el dataset de producción + reconstruye `app/data/db.js`. Acepta `--base <dataset.json>` y `--glob "<patrón de lotes>"` para no tener que editar el script en cada tanda.

### 10.7 Corrección retroactiva de explicaciones flojas (2026-07-06)

Con las 3.728 preguntas ya en producción, se detectó que la cohorte convertida con el **prompt antiguo** (fase 1 + 1ª tanda hiperloop = **2.693 preguntas**) tenía explicaciones sensiblemente más flojas que las de la 2ª/3ª tanda (prompt reforzado, **1.035 preguntas**) — media de 680 caracteres de explicación frente a 1.185 (~74% más cortas). Se hizo una pasada de **corrección retroactiva** que reescribe solo el campo `e` (no toca `q`/`o`/`r`), reutilizando el mismo pipeline de agentes en paralelo.

**Herramientas nuevas** (paralelas a las de conversión, mismo patrón):
- [`tools/anking_fix_explanations.workflow.js`](tools/anking_fix_explanations.workflow.js) — workflow de reescritura de explicaciones (fases Rewrite + QA). Mismas constantes hardcodeadas (`N_BATCHES`/`IN_DIR`/`OUT_DIR`) que `anking_convert.workflow.js`, mismo motivo (no fiar `args` de `Workflow`).
- [`tools/merge_explanation_fixes.py`](tools/merge_explanation_fixes.py) — fusiona `e` in-place por `id`/`anki` (no añade preguntas nuevas). *Nota: en la sesión real se ejecutó una versión Node equivalente porque esta máquina no tenía Python instalado; el script `.py` queda en el repo como referencia para máquinas que sí lo tengan.*
- [`tools/repair_batch_json.mjs`](tools/repair_batch_json.mjs) — repara un bug recurrente de los agentes: comillas literales sin escapar dentro de una explicación (p. ej. `la "luteal-placental shift"`), que rompen el JSON del lote entero si no se arreglan.

**Selección de candidatos:** en vez de identificar por procedencia de lote (imposible, los datasets intermedios no se guardaron), se puntuó cada pregunta por longitud total de `e.correcta` + las 3 `e.incorrectas` — proxy que correlaciona bien con la cohorte (corte en las 500 más flojas cayó en 436 caracteres, muy por debajo de la mediana global de 828).

**Resultado, en 3 tandas sucesivas (500 + 1.000 + 1.198 = 2.693, toda la cohorte vieja):**
- Tanda 1 (500 objetivo): 500 fusionadas, 0 perdidas.
- Tanda 2 (1.000 objetivo): 995 fusionadas; 5 perdidas (letra desalineada / contenido contradictorio marcado por QA) — se reintentaron en la tanda 3 junto con el resto.
- Tanda 3 (1.198 objetivo = todo lo que quedaba, incluidas las 5 anteriores): 1.188 fusionadas, 10 perdidas definitivamente (9 por letra desalineada, 1 por calidad de contenido).
- **Total: 2.683 / 2.693 corregidas (99,6%)**; 10 preguntas se quedan con su explicación original (mismo criterio de descarte que en las tandas de conversión — no merece la pena perseguir el último 0,4%).

**Bug nuevo detectado en esta pasada (no documentado antes):** en la tanda 3, 17 preguntas salieron con el campo `anki` de eco **desplazado al vecino** dentro del mismo lote (el contenido de `e` era correcto para su `id`, pero el `anki` echoed pertenecía a la pregunta anterior o siguiente del lote) — se verificó caso por caso que el contenido sí correspondía al `id` declarado, y se corrigió confiando en `id` (más fiable, es la clave de búsqueda) y resincronizando `anki` contra el dataset base antes de fusionar. Si vuelve a pasar, `merge_explanation_fixes.py`/su equivalente Node ya lo detecta solo (compara `anki` esperado vs recibido) — solo falta automatizar la resincronización en vez de hacerla a mano.

Tras cada tanda: `DB_HASH` en `app/sw.js` se bumpeó (`fix1` → `fix2` → `fix3`) y se verificó en preview limpiando `caches`/`serviceWorker` antes de comprobar `window.DB.preguntas.length`.

---

## 11. Segunda fuente: cuadernillo oficial NBME/FSMB (2026-07-07)

Se añadió la **primera fuente distinta de AnKing**, validando por fin el diseño "fuentes" del §3 (hasta ahora solo había una). Origen: `Step_1_Sample_Items.pdf` (el cuadernillo gratuito **"USMLE Step 1 Sample Test Questions"**, de dominio público — "For Public Release" en la portada —, publicado conjuntamente por la FSMB y la NBME). No es contenido de terceros con licencia restringida como el mazo AnKing; es el material oficial de práctica que la propia NBME distribuye a los candidatos.

### 11.1 Qué tiene el documento

- 119 preguntas reales, 6 bloques, con clave de respuestas al final (sin explicaciones — las escribe la IA, igual que con AnKing).
- **Opciones de longitud variable:** no siempre 4. Distribución real: 12 con 4, 91 con 5, 13 con 6, 3 con 7 (letras hasta G).
- **21 preguntas con imagen** (fotos clínicas, cortes anatómicos, ECG, histología, radiografías, pedigrí, gráficas).
- El PDF de origen vive fuera del repo (`C:\Users\ca-urgencias\Desktop\Step_1_Sample_Items.pdf` en esta máquina) — no se versiona, igual que el `.apkg` de AnKing.

### 11.2 Extracción (sin librerías dedicadas de PDF — no había `pypdf`/`pdfplumber` instalados)

Se encontró un Python portable ya instalado en esta máquina (`C:\Users\ca-urgencias\tools\python\python.exe`, con **PyMuPDF/`fitz`** disponible) — usarlo si se retoma esto en esta misma máquina. Extracción hecha con scripts ad-hoc (no quedaron como `tools/`, fueron exploratorios):
1. Texto completo por página con `fitz`, detectando límites de cada ítem 1-119 con una regex secuencial (`\d+\.\s`) — **cuidado**: hacerlo sobre un blob concatenado de todas las páginas desplaza el número de página si el corte del blob no incluye el primer marcador de página completo (bug real que apareció y se corrigió cortando desde el marcador de la página 11, no desde el texto "BLOCK 1, ITEMS").
2. Clave de respuestas parseada programáticamente de la página de respuestas (no a mano — transcribir a mano un layout en columnas es un riesgo real de error, aunque en este caso la transcripción manual coincidió).
3. **Imágenes:** extraídas por página con `page.get_images()` + `doc.extract_image(xref)`. El emparejamiento imagen↔pregunta **no es fiable por heurística** (ni por palabras clave en el enunciado tipo "shown"/"photograph", ni por posición vertical del bbox vs. el marcador "N." de cada ítem — se probaron ambos métodos y los dos fallaron en varios casos, incluida una imagen que evidentemente correspondía a un ítem distinto del asignado). **Lo que funcionó: inspección visual directa de cada una de las 21 imágenes** (leerlas con la herramienta de lectura de imágenes) contrastando el contenido real contra el enunciado de los ítems candidatos de esa página. Si se añaden más documentos con imágenes en el futuro, no fiarse de heurísticas automáticas de emparejamiento — verificar cada imagen a ojo, son pocas.
4. **2 preguntas con opciones en tabla** (#15: curvas cimetidina/omeprazol; #87: fremitus/percusión/ruidos respiratorios; también aplica a #90: tensión de O2/osmolalidad) — la regex de opciones `\(([A-G])\)\s*([^\n]+)` solo capturaba la primera celda de cada fila de la tabla, no la fila completa. Se detectan buscando valores de opción duplicados entre letras (`new Set(valores).size < valores.length`) y se reconstruyen a mano leyendo el texto crudo de la página.
5. **1 pregunta no convertible sin más** (#43): en el examen real es una imagen con regiones etiquetadas A-E directamente (el estudiante hace clic en la imagen), sin texto de opciones independiente. Se resolvió preguntando al usuario qué estructura anatómica correspondía a cada letra (él conocía la respuesta) en vez de inventarlo — **no adivinar contenido médico sin confirmación cuando no hay forma de verificarlo por texto**.

### 11.3 Esquema: cambios mínimos, sin refactor

- **Opciones variables:** el renderizado de `app.js` ya iteraba con un guard `if (!(letra in q.o)) return`, tolerando menos de 4 opciones — el único bloqueo real era que el array de letras estaba hardcodeado a `["A","B","C","D"]` en 3 sitios. Se amplió a `["A","B","C","D","E","F","G"]` en [`app/app.js:523`](app/app.js) (render del quiz), [`app/app.js:830`](app/app.js) (tarjeta de revisión) y [`app/app.js:1615`](app/app.js) (atajo de teclado). Sin cambios de CSS (las opciones ya usaban `flex` en columna, no `grid` de 4 columnas).
- **Imagen en el enunciado:** **ya estaba implementado end-to-end** desde antes (función `pintarImagen(q)`, contenedor `#q-imagen`, lightbox), sin usarse por ninguna pregunta existente. Solo hizo falta añadir `img: "img/official/official-NNN.ext"` a las preguntas nuevas — cero cambios de código.
- **Nueva fuente:** `{id: "nbme-official", nombre: "USMLE Step 1 Sample Test Questions (NBME/FSMB)", ...}` añadida a `fuentes[]`. Los `temas[]` nuevos (43 al principio, 42 tras fusionar un duplicado, ver más abajo) llevan `fuente: "nbme-official"` — mismo patrón que AnKing, cada tema pertenece a una única fuente aunque el nombre se reutilice entre fuentes (p. ej. "Cardiovascular Pathology" existe como tema separado para AnKing y para NBME).
- **Bug propio cometido y corregido en esta pasada:** al crear los `temas[]` nuevos se puso `sistema: nombre` (en vez del sistema padre real, p. ej. "Cardiovascular" para "Cardiovascular Pathology") — esto rompía el agrupamiento por sistema en la pantalla "Subjects" (cada tema de NBME aparecía como su propio "sistema" de un solo tema, en vez de agruparse junto con los de AnKing). Se corrigió mapeando cada nombre contra la tabla `Nombre → [Sistema]` de la taxonomía (la misma que ya se le da a la IA en el prompt). **Si se añade otra fuente en el futuro, no usar el nombre del tema como `sistema` — mapear siempre contra la taxonomía real.**
- También se fusionó un tema casi-duplicado: la corrección manual del ítem #43 había clasificado en "Pulmonary Pathology" en vez de reutilizar "Respiratory Pathology" (ya existente en la taxonomía) — reasignado y el tema sobrante eliminado.

### 11.4 Pipeline de generación (solo explicaciones, no distractores)

A diferencia de AnKing (donde había que inventar 3 distractores por cloze), aquí el enunciado/opciones/respuesta ya son oficiales y finales — el único trabajo de IA es **escribir la explicación** + **clasificar el tema** (reutilizando la taxonomía de 65 nombres cuando encaja). Nuevo workflow: [`tools/nbme_official_convert.workflow.js`](tools/nbme_official_convert.workflow.js) (6 lotes de ~20 preguntas + 2 de QA, mismo patrón de constantes hardcodeadas que los otros workflows).

- 6/6 lotes generados; **1 lote (`batch_0005`, ítems 101-119) se perdió por un error transitorio de la API** (`Overloaded`) — el workflow reportó `batchesWritten: 6` pero el fichero de salida no existía realmente en disco. **Lección: no fiarse solo del recuento que devuelve el `Workflow`, comprobar que los ficheros de salida existen de verdad en disco antes de dar por buena una tanda.** Se relanzó ese lote con un agente suelto.
- QA marcó 1 pregunta (#87) por explicaciones circulares/placeholder — causa raíz: las opciones de esa pregunta estaban rotas por el bug de tabla del §11.2 (arregladas después de lanzar la generación). La #90 tenía el mismo bug de tabla pero QA no la marcó — **el validador estructural no detecta "opciones duplicadas / sin sentido semántico", solo lo detecta el escaneo de duplicados exactos hecho a mano.** Ambas se regeneraron con un agente suelto tras arreglar las opciones.
- Fusión final: **119/119 preguntas** pasan la validación estructural (letra de respuesta presente, claves de `incorrectas` exactas, tema válido, fichero de imagen existente) — 0 rechazadas.

### 11.5 Verificación

Probado en preview con datos reales (no sintéticos): pregunta con 7 opciones + imagen (`official-060`, respuesta G) renderiza y se corrige bien; pregunta de 4 opciones de AnKing sigue funcionando sin regresión; la pantalla "Subjects" agrupa ahora los temas de ambas fuentes bajo el mismo sistema (p. ej. "Respiratory" muestra "2 sources · 81 questions available" con el selector de fuente listando AnKing y NBME). `DB_HASH` bumpeado a `step1-3847q-nbme`.

### 11.6 Ficheros de esta pasada

- [`data/anking/_official_items_final.json`](data/anking/_official_items_final.json) — checkpoint verificado de la extracción (119 ítems con stem/opciones/respuesta/imagen ya correctos tras las correcciones manuales). Se conserva en el repo porque regenerarlo exige repetir la verificación visual manual de las 21 imágenes.
- [`tools/nbme_official_convert.workflow.js`](tools/nbme_official_convert.workflow.js) — workflow de generación de explicaciones + clasificación de tema.
- `app/img/official/` — las 21 imágenes de preguntas, con nombre `official-NNN.ext`.

---

## 12. Cuarta tanda de conversión AnKing (1.000 preguntas) + mejoras de práctica (2026-07-07)

### 12.1 Conversión

Misma receta de siempre (§10.4): recalculado lo que faltaba sobre `_raw_all.json` (18.189 universo limpio) menos los `anki` ya usados en el dataset de producción, cortado en `_batches_in_v4` (40 lotes de 25), lanzado `tools/anking_convert.workflow.js` (BASE actualizado a la ruta de esta máquina, ya no la de casa).

- **40/40 lotes generados**, pero **1 lote (`batch_0027`) se perdió por el mismo error transitorio de la API** (`Overloaded`) que ya pasó con la tanda NBME — el workflow reportó éxito pero el fichero no existía en disco. Ya es un patrón recurrente: **verificar siempre con un script que los ficheros de `_batches_out*` existen de verdad y parsean, no fiarse del resumen que devuelve `Workflow`.** Se regeneró con un agente suelto.
- Fusión: **994 / 997 aceptadas** (3 rechazadas: 2 por texto de opción duplicado, 1 por desalineación de letras en `incorrectas` — mismo perfil de error de siempre, se descartan sin más).
- **Total tras esta tanda: 4.841 preguntas / 107 temas.** Quedan **~13.468** tarjetas limpias de AnKing por convertir.
- **Bug de entorno nuevo (no relacionado con el contenido):** `Workflow({scriptPath})` falló dos veces seguidas con `"script contains control characters that would be hidden in the approval dialog"` al intentar lanzar `anking_convert.workflow.js`. Causa: el fichero tenía finales de línea **CRLF** (`\r\n`) — el diálogo de aprobación del harness trata el `\r` suelto como carácter de control oculto y rechaza el script. **Solución: normalizar el fichero a LF** (`content.replace(/\r\n/g, '\n')`) antes de lanzar `Workflow`. Si un workflow se edita en Windows y vuelve a fallar con este mismo mensaje, es casi seguro esto.

### 12.2 Nuevas features de práctica (sin relación con el pipeline de datos)

A petición del usuario, dos añadidos a la pantalla de configuración de práctica (`pintarTemaConfig()` / estado `PF` en `app.js`):

- **"📚 Practice all subjects"** — botón nuevo en la pantalla "Subjects" (`#btn-practicar-todo`), abre la misma pantalla de configuración (selector de fuentes, número de preguntas, opciones avanzadas) pero con `PF.temas` vacío (sin filtro de tema) y un flag nuevo `PF.todo = true` que cambia la cabecera a "Whole question bank / All subjects". `poolPractica()` ya soportaba de forma nativa "sin filtro de tema" cuando `PF.temas.size === 0`, así que no hizo falta tocar la función de filtrado para esto.
- **Filtro "Only questions with an image"** — nuevo checkbox en "Advanced options" (`#tc-solo-imagen` → `PF.soloImagen`), añadido a `poolPractica()` como una línea más de filtro (`if (opts.soloImagen && !q.img) return false;`). Nota: este filtro y el modo "Test block" (`SIMF`/`poolSimulacro()`) usan estado y funciones de pool **separadas** de `PF`/`poolPractica()` — si se quiere el mismo filtro ahí, hay que duplicarlo.
- Ambas verificadas en preview con datos reales (no sintéticos): "Practice all subjects" mostró "2 sources · 3847 questions available" (antes de la tanda de conversión); el filtro de imagen redujo el pool exactamente a 21 (las mismas 21 preguntas con imagen del cuadernillo NBME).

### 12.3 Otros cambios pequeños de esta sesión

- **Nombres de fuentes acortados** para que quepan mejor en los chips de la UI: "AnKing Overhaul — Step 1 (v11)" → **"AnKing"**, "USMLE Step 1 Sample Test Questions (NBME/FSMB)" → **"USMLE Sample 2026"**. Solo cambia `fuentes[].nombre`; `descripcion`/`licencia` se conservan con el detalle completo.
- **Mensaje final de práctica escalonado por nota** (antes siempre "Nice work!" si ≥60%, "Keep going!" si no): ahora ≥70% → 🎉 "Nice work!" (verde), 50-69% → 📚 "Keep studying!" (naranja), &lt;50% → 💪 "That was a tough one" (rojo). Ver `pintarResultado()` en `app.js`.
- **Botón "Practice all subjects":** se probó primero en azul (`--azul-claro`) pero coincidía con el color del primer subject de la lista (Public Health & Ethics); se cambió a `.btn.primary` (rojo de marca `--azul`/`--azul-osc`, el mismo que "START"/"SAVE"), y la cabecera de esa pantalla (`#tc-hero`) se ajustó a juego cuando `PF.todo` está activo (antes usaba `PAL.blue`, un azul distinto del botón).

### 12.4 Quinta tanda de conversión AnKing (500 preguntas, 2026-07-07)

Misma receta de §12.1: **491 / 498 aceptadas** (7 rechazadas: 3+2 por desalineación de letras en `incorrectas`, 2 por texto de opción duplicado). Total: **5.332 preguntas / 114 temas**. Quedan **~12.977** tarjetas limpias de AnKing por convertir. Sin incidencias nuevas de pipeline (los 20 lotes se escribieron y parsearon a la primera).

---

## 13. Tanda piloto "con imagen/audio" (2026-07-07)

Primer intento de atacar el universo de tarjetas AnKing que llevan imagen o audio en el enunciado (aparcado desde §2/§4 como "1.312 notas, pospuesto a v2"). Se hizo como **prueba piloto de 64 preguntas** antes de comprometerse a una tanda completa, a petición del usuario ("para ver cómo quedan").

### 13.1 El `.apkg` de esta sesión no es el de §10.1

El usuario añadió un `Anking_Step-1.apkg` nuevo a la raíz del repo (250 MB — se renombró desde `ANKIng_.apkg` para que coincidiera con el patrón ya excluido en `.gitignore`). Al inspeccionarlo con `tools/anki_extract_media.py` resultó ser **una exportación distinta** del mazo AnKing a la documentada en §10.1-10.2:

| | `.apkg` viejo (§10.1) | `.apkg` de esta sesión |
|---|---|---|
| Notetype | `AnKingOverhaul` | `Cloze-AnKingMaster` |
| Notas totales | 34.638 | 22.878 |
| Esquema de tags | `#AK_Step1_v11::#FirstAid::NN_Sistema::NN_Subtema` | `#AK_Step1::Sistema::Subtema` (sin versión, sin capa `#FirstAid::`) |

El usuario confirmó que cree que es el mazo correcto ("yo creo que es la misma"), así que se adaptó la extracción al nuevo esquema de tags en vez de bloquear. **Si se retoma el universo de solo-texto de §10 con este fichero, los números de §10.2 (34.638/25.949/24.177/18.189...) no aplican** — habría que re-extraer y re-contar desde cero con el nuevo esquema de tags (`tools/anki_extract.py` también necesitaría el mismo ajuste que se le hizo a `anki_extract_media.py`, ver más abajo).

### 13.2 Extracción: bug de multimedia faltante en el export

`tools/anki_extract_media.py` (nuevo, variante de `anki_extract.py` para el subconjunto con imagen/audio) extrae notas cloze de un solo hueco **con** `<img>`/`[sound:]` en el campo `Text`, y copia el fichero multimedia referenciado resolviendo el manifiesto `media` del `.apkg` (índice numérico → nombre real).

Hallazgo importante: de los candidatos con imagen/audio + un solo cloze + tag `#AK_Step1` (~428), **solo 66 tenían su fichero multimedia realmente presente** en el paquete `media` de este `.apkg` — el resto (362, incluidas **las 23 notas de audio de sonidos cardíacos "University of Michigan Heart Sound and Murmur Library" y su imagen genérica compartida**) referencian ficheros que faltan por completo en el export. **No se pudo generar ninguna pregunta de audio en esta pasada** — si se quiere ese contenido, hay que conseguir un `.apkg`/paquete de medios que sí incluya esos ficheros (probablemente un export con "incluir media" mal configurado, o un add-on de audio distribuido aparte).

De las 66 con imagen resuelta, se descartaron 2 más por ser tarjetas "resumen visual" sin respuesta real (cloze relleno con un emoji `:)`, ej. "Actions of Thyroid Hormone Summary: No answer") — quedaron **64 utilizables**. Un sub-caso interesante detectado: **5 notas tienen la respuesta correcta *dentro* de la imagen** (`{{c1::<img src="...">}}`, ej. "According to Fick's law... {{c1::}}" con la fórmula solo en la imagen) — el extractor las marca con `_answer_in_image: true` para que el agente generador sepa que debe leer la imagen para determinar la respuesta, no solo para dar contexto.

### 13.3 Generación: agentes con lectura real de imagen

A diferencia del pipeline de solo texto, aquí cada agente generador tuvo que **leer de verdad el fichero de imagen** (herramienta `Read`, que soporta imágenes) antes de escribir la pregunta — el enunciado, la respuesta correcta y los distractores dependen de lo que la imagen muestra realmente (foto de pieza quirúrgica, ECG, corte histológico, diagrama anatómico etiquetado, angiografía...). Se lanzaron 8 agentes en paralelo (lotes de 8, vía `Agent` normal — **no** se usó la herramienta `Workflow`, al no haber opt-in explícito del usuario para orquestación multiagente) más una segunda ronda de 4 agentes de QA que también releen cada imagen para verificar que la pregunta encaja con lo mostrado.

**Bug de formato nuevo detectado:** un lote (8/64 preguntas) escribió `e.B`/`e.C`/`e.D` como claves sueltas dentro de `e` en vez de anidarlas en `e.incorrectas.{letra}` — el propio agente reportó en su resumen final que "incorrectas cubre las otras 3 letras" cuando en realidad 7 de sus 8 preguntas no lo hacían. **Lección reforzada:** no fiarse del resumen que da el agente, validar siempre la estructura del JSON de salida por código (igual que ya advertía §11.4/§12.1 sobre no fiarse del recuento de `Workflow`). Se corrigió con un script de 10 líneas moviendo las claves sueltas a `incorrectas` — el contenido en sí era correcto, solo la forma del JSON estaba mal.

### 13.4 QA: tasa de descarte mucho más alta que en texto

**14 de 64 marcadas por QA (22%)**, muy por encima del ~0,5-1,5% típico de las tandas de solo texto (§10.5). Patrones de fallo reales, más allá del bug de formato de §13.3:

- **2 preguntas** sobre una imagen que en realidad era solo un fragmento de texto recortado (sin contenido visual real) — falso positivo del filtro "tiene `<img>`" del extractor.
- **5 preguntas** construidas sobre un diagrama base compartido por varias tarjetas (cortes de tronco encefálico, mapa de la corteza cerebral) donde una flechita genérica "ID" señala una posición entre varias estructuras densamente agrupadas — el agente generador no pudo determinar con fiabilidad a cuál de las estructuras cercanas apunta cada tarjeta individual, y en al menos 2 casos dos tarjetas "hermanas" sobre el mismo dibujo dieron respuestas mutuamente excluyentes.
- **1 pregunta** con las explicaciones de dos opciones intercambiadas entre sí (bug de contenido, no de formato).
- **1 pregunta** de fórmula (`_answer_in_image`) donde la imagen no reflejaba fielmente lo que pedía el enunciado.
- Resto: dudas puntuales de correspondencia imagen↔respuesta.

**Conclusión para retomar esto:** antes de lanzar una tanda grande, el extractor debería (a) descartar imágenes por debajo de un tamaño mínimo (los casos de "solo texto recortado" eran de ~20-60px de alto) y (b) detectar y agrupar notas que comparten el mismo fichero de imagen base, para poder decidir explícitamente si generarlas todas juntas (dándole al agente las N preguntas hermanas a la vez, no una por una) o descartar el patrón entero.

### 13.5 Fusión a producción

Las 50 preguntas limpias se fusionaron con `tools/merge_anking_batches.py` (parcheado para conservar el campo `img` en el objeto final — antes solo lo llevaban las preguntas del cuadernillo NBME, añadidas a mano). Total tras esta pasada: **5.382 preguntas / 114 temas / 71 con imagen**. `DB_HASH` bumpeado a `step1-5382q-img-trial`. Verificado en preview: `window.DB.preguntas.length === 5382`, el filtro "Only questions with an image" + "All sources" muestra "71 questions available", y una pregunta real (Fick's law, `_answer_in_image`) renderiza su imagen y corrige correctamente.

Ficheros de esta pasada conservados en el repo como checkpoint (el resto — lotes crudos, QA — está en `.gitignore`, regenerable repitiendo el proceso): [`data/anking/_media_trial_clean_50q.json`](data/anking/_media_trial_clean_50q.json), [`data/anking/_media_trial_dropped_14q.json`](data/anking/_media_trial_dropped_14q.json) (las 14 descartadas, con motivo de QA — útil para no repetir los mismos errores), [`data/anking/_media_trial_merged_64q.json`](data/anking/_media_trial_merged_64q.json) (las 64 antes de filtrar). Script nuevo: [`tools/anki_extract_media.py`](tools/anki_extract_media.py).

### 13.6 Segunda pasada: recuperar las 14 descartadas (2026-07-07, mismo día)

A petición del usuario ("todas tienen que salir"), en vez de conformarse con el 78% se intentó recuperar las 14 rechazadas por QA. Hallazgo clave que abarató mucho el reintento: **el propio campo cloze de la tarjeta Anki original ya da la respuesta correcta verificada por el autor del mazo** (quien sí veía la imagen a resolución completa al crear la tarjeta) — así que reintentar no significa "adivinar de nuevo desde la imagen", sino "escribir una pregunta bien anclada dado que ya se sabe la respuesta correcta". Esto redujo drásticamente el riesgo de la regeneración.

Resultado: **13 de 14 recuperadas**, la 14ª se descartó definitivamente:
- **4 arregladas directamente** (sin agente, con un script): 2 preguntas de "célula lábil/estable/permanente" cuyo enunciado ya incluía la lista completa en texto (la imagen era pura redundancia — bastó con quitar el campo `img`); 1 con las explicaciones de dos opciones (fóvea/ora serrata) intercambiadas entre sí (swap de claves); 1 reescrita como vignette de texto (hipertensión + diabetes → IECA/ARA-II) porque su imagen era solo una lista genérica de 4 clases de fármacos sin ningún detalle distintivo — mismo patrón que las 2 de células.
- **9 arregladas por agentes** dándoles la respuesta-verdad ya conocida + la imagen a releer: el trío de nervios craneales del tronco encefálico compartiendo diagrama base (CN VIII, oliva, CN XI), un núcleo del tronco (núcleo trigeminal espinal), una arteria cerebral (arteria cerebelosa superior — el "QA que se equivocó": el propio pixel-trace del reviewer anterior había confundido el origen de la SCA con el de la ACP, pero la tarjeta original confirmaba SCA), una fórmula de farmacocinética (Vd = F×dosis/Cp0, tomada literalmente del campo `Extra` de la tarjeta), un esquizonte de Plasmodium, y una pregunta de NRTI reescrita para quitar una afirmación falsa sobre sufijo compartido "-vudine" que el intento original había inventado (el propio `Extra` de la tarjeta ya advertía que NO hay un sufijo único).
- **1 descartada definitivamente**: el par "frontal eye field" (BA8) vs "premotor cortex" (BA6) — un pixel-diff confirmó que ambas imágenes, pese a ser ficheros distintos, tienen la flecha "ID" apuntando al **mismo punto exacto** tras el recorte/exportación del `.apkg`; son dos tarjetas Anki reales con respuestas-verdad distintas pero indistinguibles visualmente en este export. El usuario decidió quedarse con una y dejó la elección abierta; se conservó "premotor cortex" (región más amplia y de tarjeta más fácil de defender con la imagen disponible) y se descartó "frontal eye field".

**Bug operativo detectado:** al limpiar imágenes "no usadas" tras la primera fusión (50/64), se borraron por error los ficheros de las 14 preguntas ya descartadas — que resultaron ser necesarios minutos después para la pasada de reparación. Se recuperaron desde la copia intermedia en el directorio de scratch de la sesión (aún no purgada). **Lección: no borrar ficheros de origen de un pipeline en curso solo por no estar referenciados en el estado actual — podrían hacer falta en la siguiente iteración.** Varios agentes de reparación, además, generaron imágenes de zoom/diff de depuración (`*_zoom.png`, `diff_*.png`) directamente dentro de `app/img/anking/` (la carpeta de producción) en vez de un scratch — hubo que limpiarlas a mano antes de commitear; si se automatiza este patrón de reparación en el futuro, decirle explícitamente al agente dónde NO guardar ficheros intermedios.

**Total final: 63 preguntas nuevas de AnKing con imagen (50 + 13), + 21 del NBME = 5.395 preguntas / 114 temas / 81 con imagen.** `DB_HASH` bumpeado a `step1-5395q-img-trial-fixed`. Ficheros añadidos: [`data/anking/_media_trial_clean_63q.json`](data/anking/_media_trial_clean_63q.json) (dataset final de esta tanda), [`data/anking/_media_trial_fixed_10q.json`](data/anking/_media_trial_fixed_10q.json) (las 10 reparadas por agente antes de descartar la de frontal eye field).

### 13.7 Pendiente si se continúa

Refinar el extractor con los dos filtros de §13.4 (tamaño mínimo de imagen, agrupación de diagramas compartidos para generarlos juntos desde el principio en vez de descubrir el conflicto en QA) y repetir sobre el universo completo de imagen. El problema del audio (§13.2) sigue sin resolver — requiere localizar los ficheros de media que faltan en el `.apkg` actual (probablemente un add-on de audio distribuido aparte del mazo principal). **Nota de diseño aclarada con el usuario:** el concepto de "casos clínicos" (una viñeta/imagen compartida con varias sub-preguntas mostradas consecutivamente, con desplegable superior) de la app original OPE-Urgencias **se eliminó deliberadamente** en el fork a Step 1 (§3: "Fuera: exámenes, casos...") y hoy no existe en `app.js` ni en el esquema — además el barajado (`barajar`, activado por defecto) dispersaría cualquier grupo aunque estuvieran contiguos en el dataset. Si en el futuro se convierte contenido que SÍ sea un caso real (viñeta compartida + varias preguntas dependientes, a diferencia de las tarjetas de este §13 que son cada una autónoma), habrá que reconstruir ese mecanismo desde cero.

---

## 14. Sexta tanda de conversión AnKing de texto (250 preguntas, 2026-07-07)

Misma receta de siempre (§10.4), retomando el universo de **solo texto** (no el de imagen de §13 — pipelines independientes, `.apkg` de origen distinto para cada uno). El usuario pidió inicialmente 1000 preguntas; se acordó bajar a 250 para esta tanda.

- Recalculado lo que faltaba sobre `data/anking/_raw_all.json` (18.189 universo limpio, extraído del `.apkg` viejo documentado en §10.1 — sigue siendo válido, es independiente del `.apkg` nuevo de §13.1) menos los `anki` ya usados en producción: **12.977 restantes**. Cortado en `_batches_in_v6` (40 lotes de 25 preparados, solo se lanzaron los 10 primeros = 250 preguntas; **quedan 30 lotes ya cortados y listos** para la próxima tanda sin tener que recalcular).
- **Se pidió confirmación explícita antes de usar la herramienta `Workflow`** (política del entorno: solo se invoca con opt-in claro del usuario) — el usuario confirmó. Se lanzó `tools/anking_convert.workflow.js` con `BASE` actualizado a la ruta de esta máquina y `TAXONOMY` ampliada con 2 temas que faltaban (`Respiratory Pharmacology`, `Congenital Lung Malformations` — existían ya en producción pero no en la lista hardcodeada del script, riesgo de que el agente inventase un nombre casi-duplicado).
- **Mismo bug de CRLF que en §12.1** al reeditar el script en esta máquina — normalizado a LF antes de lanzar, sin incidencias.
- **10/10 lotes generados y verificados en disco** (no fiarse solo del resumen de `Workflow`, ver §11.4/§12.1). QA marcó 2 preguntas (letra desalineada en un caso, explicación incoherente en otro); el validador estructural del merge descartó 2 más por texto de opción duplicado. **Total aceptado: 246/250.**
- Fusión: **5.395 → 5.641 preguntas, 114 temas** (sin temas nuevos — la ampliación de `TAXONOMY` evitó duplicados). `DB_HASH` bumpeado a `step1-5641q`. Verificado en preview: `window.DB.preguntas.length === 5641`.
- **Quedan ~12.731 tarjetas limpias de AnKing (texto) por convertir**, con 30 lotes ya cortados en `_batches_in_v6` (índices 10-39) listos para usar sin recortar de nuevo — solo hay que ajustar `START_BATCH`/`N_BATCHES` en `tools/anking_convert.workflow.js`.

---

## 16. Octava tanda de conversión AnKing de texto (500 preguntas, 2026-07-09)

Misma receta de §10.4. El usuario pidió 500 preguntas. Se recalculó lo que faltaba sobre `data/anking/_raw_all.json` (18.189 universo limpio) menos los `anki` ya usados en producción (7.495) → **10.757 restantes**; se cortaron 20 lotes de 25 en `_batches_in_v7`. `BASE` del workflow actualizado a la ruta de esta máquina (`C:/Users/ca-urgencias/Desktop/Arnal Config/Documentos IA/USMLE_step_1/data/anking`), taxonomía ampliada con el tema `Neurology & Special Senses Embryology` (id 68 en la lista, ya existía en producción como id 117 pero no en la lista hardcodeada), y **reforzada la instrucción de `tema_nombre`** en `genPrompt()` para que sea SOLO el nombre (sin `"45. "` ni `"[System]"`) — la lección pendiente de §15.2. Mismo bug de CRLF que §12.1, normalizado a LF antes de lanzar.

### 16.1 El bug de "batchesWritten miente" volvió a pasar — y se resolvió con resume

- Primera ejecución del `Workflow`: **el agente `gen:5` (batch_0005) murió con "API Error: Server error mid-response"** a mitad de generación (mismo tipo de error transitorio que §15.1). El workflow reportó `batchesWritten: 20` y listó `batch_0005.json` en `outFiles`, **pero el fichero NO existía en disco** — exactamente el patrón de §11.4/§12.1. La verificación con script (contar ficheros + parsear) lo detectó: 19 ficheros reales, no 20. **Refuerzo de la lección: no fiarse jamás del recuento ni de la lista `outFiles` del `Workflow`; contar y parsear los ficheros en disco.**
- **Solución nueva y limpia: reanudar el workflow con `resumeFromRunId`** (`Workflow({scriptPath, resumeFromRunId: 'wf_...'})`). Los 19 lotes buenos + los agentes de QA replicaron de caché al instante (0 coste), y solo se re-ejecutó el `gen:5` fallido con el prompt idéntico. Segunda pasada: 0 errores, batch_0005 escrito. **Esta es mejor vía que regenerar con un `Agent` suelto** (que era lo que decían §11.4/§12.1) — es más fiel (mismo prompt exacto) y más barato (el resto va de caché). Anótalo como la forma preferida de recuperar un lote perdido a partir de ahora.
- Nota sobre QA en el resume: el resumen final solo mostró 1 flagged, pero **ambas flagged (de las dos ejecuciones) están en `journal.jsonl`** — recógelas de ahí con `grep -o '"anki":"[0-9]*"'` sobre el journal, no solo del resultado final del `Workflow`.

### 16.2 Fusión y resultado

- 20/20 lotes verificados en disco (500 preguntas, todas 25 salvo batch_0018 con 24 — un agente soltó una). Flagged por QA: 2 (anki `1481513305585` A/B intercambiadas; `1481944681612` orden de frecuencia de metástasis cerebrales factualmente erróneo con próstata). Fichero de flagged en `data/anking/_flagged_v7.json`.
- Fusión con `merge_anking_batches.py` (`--base step1_dataset_7615q.json --glob "_batches_out_v7/*.json" --flagged _flagged_v7.json`): **496 aceptadas / 4 rechazadas** (2 texto de opción duplicado + 2 flagged). Total: **7.615 → 8.111 preguntas, 110 temas** (sin temas nuevos — la ampliación de la taxonomía + la instrucción reforzada de `tema_nombre` evitaron duplicados). 81 con imagen (sin cambio).
- **Auditoría de `temas[]` tras la fusión (recordatorio de §15.2): limpia** — 0 nombres duplicados por fuente, 0 nombres corruptos con corchete/número (la instrucción reforzada funcionó), sistemas consistentes. El único "Respiratory Pharmacology" como *sistema* sigue siendo el defecto histórico del tema id=2 (preexistente, fuera de alcance).
- `DB_HASH` → `step1-8111q`. Verificado en preview (cachés/SW limpiados): `window.DB.preguntas.length === 8111`, `temas === 110`, app arranca sin errores de consola. Commit `94dfffa` pusheado a `main`.
- **Quedan ~10.257 tarjetas limpias de AnKing (texto) por convertir** (10.757 − 500). Para la próxima tanda: cortar `_batches_in_v8` recalculando sobre `step1_dataset_8111q.json`.

---

## 17. Novena tanda de conversión AnKing de texto (500 preguntas, 2026-07-09)

Misma receta de §10.4, sin incidencias nuevas. `python.exe` ya no está en `C:/Python313/` en esta máquina — la ruta real ahora es `C:/Users/ca-urgencias/tools/python/python.exe` (anotado por si vuelve a pasar).

- Recalculado sobre `_raw_all.json` menos los `anki` ya usados en `step1_dataset_8111q.json` (7.995) → **10.261 restantes**; se cortaron 20 lotes de 25 en `_batches_in_v8`.
- **20/20 lotes verificados en disco** (500 preguntas, todos completos). QA marcó 4 preguntas (mezcla de estadística en Warthin tumor, discrepancia SCC-vs-both en achalasia, CagA/VacA con roles de citotoxina invertidos, y una distinción intestinal-vs-difuso de nódulos de Sister Mary Joseph no respaldada) — las 4 en `data/anking/_flagged_v8.json`.
- Fusión (`--base step1_dataset_8111q.json --glob "_batches_out_v8/*.json" --flagged _flagged_v8.json`): **496 aceptadas / 4 rechazadas** (todas por QA, sin rechazos estructurales esta vez). Total: **8.111 → 8.607 preguntas, 111 temas** (1 tema nuevo: `Gastrointestinal Embryology`).
- Auditoría de `temas[]`: los ~41 nombres "duplicados" son homónimos legítimos entre `fuente: "anking"` y `fuente: "nbme-official"` (mismo patrón que la base, no un bug nuevo); 0 nombres corruptos con corchete/número.
- `DB_HASH` → `step1-8607q`. Verificado en preview (cachés/SW limpiados): `window.DB.preguntas.length === 8607`, `temas === 111`, sin errores de consola.
- **Quedan ~9.757 tarjetas limpias de AnKing (texto) por convertir** (10.257 − 500). Para la próxima tanda: cortar `_batches_in_v9` recalculando sobre `step1_dataset_8607q.json`.

---

## 18. Décima tanda de conversión AnKing de texto — solo Microbiology (1.000 preguntas pedidas, 2026-07-09)

El usuario pidió esta vez 1.000 preguntas **filtradas a un solo sistema** (Microbiology, el que más tarjetas pendientes tenía: 2.854 de las 9.765 restantes). Misma receta de §10.4, con un único cambio: el corte de lotes filtra `_raw_all.json` por `r.sistema === 'Microbiology'` antes de trocear, en vez de tomar el remanente completo en orden. `N_BATCHES` a 40 (40×25=1.000) en vez del habitual 20.

- Recalculado sobre `_raw_all.json` menos los `anki` ya usados en `step1_dataset_8607q.json`, filtrado a Microbiology → 2.854 restantes de ese sistema; se cortaron 40 lotes de 25 en `_batches_in_v9` (quedan 75 lotes de Microbiology sin cortar para el futuro).
- **40/40 lotes verificados en disco** (998 preguntas, no 1.000 — 2 agentes soltaron 1 pregunta cada uno, `batch_0012` y `batch_0024` con 24). QA marcó 3 (EMB agar con opciones que no responden lo que pregunta el enunciado; localización pulmonar de TB primaria invertida con la de reactivación, contradiciendo otra tarjeta del mismo lote; mecanismo de resistencia a ampicilina en *Enterococcus* con PBP5 alterada vs. β-lactamasa invertidos) — en `data/anking/_flagged_v9.json`. El validador estructural rechazó 1 más por claves de `incorrectas` desalineadas (`anki` 1503183498029).
- Fusión (`--base step1_dataset_8607q.json --glob "_batches_out_v9/*.json" --flagged _flagged_v9.json`): **994 aceptadas / 4 rechazadas**. Total bruto: **8.607 → 9.601 preguntas, 115 temas** (4 temas nuevos: `Mycology`, `Basic Microbiology`, `Bacterial Growth & Genetics`, `Bacterial Genetics`).
- **Corrección manual post-fusión**: `Bacterial Growth & Genetics` (12 preguntas, curva de crecimiento bacteriano) y `Bacterial Genetics` (12 preguntas, transferencia de genes — transducción/conjugación) tenían contenido genuinamente distinto pero nombres casi idénticos que habrían fragmentado la pantalla "Subjects" sin razón (mismo criterio que §15.2). Se fusionaron a mano en un solo tema (`Bacterial Growth & Genetics`, id conservado), reasignando las 12 preguntas del tema descartado. **Nota para el pipeline**: `merge_anking_batches.py` no hace esta clase de detección de near-duplicados semánticos entre sistemas ya existentes en la misma tanda — sigue siendo necesario auditar `temas[]` a mano tras cada fusión grande (ver §15.2/§16.2). Tras la corrección: **114 temas, 9.601 preguntas**, `app/data/db.js` y `data/anking/step1_dataset_full.json` regenerados a mano con el mismo formato que escribe el script Python (incluyendo el campo `version`).
- Auditoría final de `temas[]`: 0 nombres corruptos con corchete/número, 0 duplicados reales por `fuente`+`nombre`, 0 temas huérfanos sin preguntas.
- `DB_HASH` → `step1-9601q`. Verificado en preview (cachés/SW limpiados): `window.DB.preguntas.length === 9601`, `temas === 114`, sin errores de consola.
- **Quedan ~1.856 tarjetas de Microbiology sin convertir** (2.854 − 998) y **~8.767 en total** de todos los sistemas. Para la próxima tanda de Microbiology: cortar `_batches_in_v10` recalculando (con el mismo filtro `sistema === 'Microbiology'`) sobre `step1_dataset_9601q.json`.

---

## 15. Séptima tanda de conversión AnKing de texto (2.000 preguntas pedidas, 2026-07-07/08)

Misma receta de §10.4. El usuario pidió 2.000 preguntas; dado que ya había 30 lotes cortados sin usar en `_batches_in_v6` (índices 10-39, 750 preguntas), solo hizo falta cortar **50 lotes nuevos** (índices 40-89) para llegar a 80 lotes = 2.000 preguntas. Se pidió confirmación explícita antes de usar `Workflow` (igual que en §14) — el usuario confirmó el alcance (~96 agentes, 1-2h en esta máquina de 4 núcleos/2 agentes concurrentes).

### 15.1 Incidencias durante la generación

- **`gen:0` (batch_0010) falló por un corte de conexión transitorio** ("Connection closed mid-response") — ese lote no se generó en absoluto. No se reintentó (ver §15.3, el usuario pidió no generar más en esta sesión); queda pendiente para la próxima tanda.
- **La mayoría de los agentes de QA (13 de 16 grupos) fallaron por límite de sesión** ("session limit · resets 2:30am Europe/Madrid") — solo se completó QA de los lotes 0010-0024 (3 primeros grupos). Los lotes 0025-0089 (55 lotes, ~1.375 preguntas) **se fusionaron a producción sin pasar por el QA semántico**, solo con el validador estructural de `merge_anking_batches.py` (letra/opciones/estructura, pero no detecta explicaciones superficiales, contradicciones de contenido, ni distractores accidentalmente correctos — ver §10.5/§10.6 sobre qué detecta cada capa). **Si en el futuro aparecen preguntas de baja calidad reportadas por usuarios, revisar primero esta franja de anki ids** (se puede identificar por rango de `_batches_out_v6/batch_0025.json` a `batch_0089.json`, conservados en disco aunque gitignored).

### 15.2 Fusión: 2 bugs nuevos de taxonomía detectados y corregidos

A diferencia de tandas anteriores, esta vez se hizo una auditoría explícita de `temas[]` tras la fusión (antes de darla por buena) y aparecieron dos problemas nuevos, ninguno atrapado por el validador estructural (que no mira `temas[]`, solo cada pregunta):

1. **5 temas creados con el nombre completo de la taxonomía en vez de solo el nombre** — algunos agentes generadores devolvieron `tema_nombre` como `"Genetics [Biochemistry]"` (el formato literal `"id. Name [System]"` que se les da como referencia en el prompt) en vez de solo `"Genetics"`, creando temas duplicados de otros ya existentes (`Toxicities & Side Effects`, `Respiratory Pharmacology`, `Genetics`, `Clinical Bacteriology`, `Nutrition`). **Y no era solo de esta tanda**: al investigar se confirmó que estos 5 temas corruptos **ya llevaban en producción desde una tanda anterior** (estaban en el dataset base `step1_dataset_5641q.json`, ids 111-115) sin que nadie lo hubiera notado — esta pasada los arregló de forma retroactiva para todas las preguntas afectadas (24 en total, no solo las nuevas), no solo las de esta tanda. **Lección para el prompt del workflow**: si se retoma esto, aclarar explícitamente en `genPrompt()` que `tema_nombre` debe ser SOLO el nombre (sin corchetes ni el número de la lista), para evitar que se repita.
2. **2 temas nuevos legítimos casi-duplicados con `sistema` inconsistente**: `"Neuroembryology"` y `"Neurology & Special Senses Embryology"` (23 y 8 preguntas), ambos con `sistema: "Neuro & Special Senses"` en vez de `"Neurology & Special Senses"` (el nombre real usado por el resto de temas de ese grupo) — esto fragmentaba la pantalla "Subjects" en dos grupos separados para el mismo sistema. Se fusionaron en uno solo (`"Neurology & Special Senses Embryology"`, `sistema: "Neurology & Special Senses"`), mismo criterio que el caso "Pulmonary Pathology" → "Respiratory Pathology" de §11.3.

Tras ambas correcciones: **110 temas** (114 base − 5 corregidos − 2 fusionados en 1 + 2 nuevos de esta tanda ya contados = cuentas cuadran, ver commit). Nota aparte, sin tocar: el tema histórico `id=2` ("Histamine & Antihistamines", de la POC original) tiene `sistema: "Respiratory Pharmacology"` en vez de un sistema real — es un defecto preexistente desde el principio del proyecto, fuera del alcance de esta pasada, no se ha tocado.

**Recordatorio para próximas fusiones**: el script `merge_anking_batches.py` NO valida `temas[]` (solo valida cada pregunta individualmente) — conviene, tras cada fusión grande, correr una comprobación rápida de nombres duplicados/casi-duplicados y de `sistema` consistente antes de dar por buena la tanda, como se hizo aquí.

### 15.3 Resultado y ficheros

- **Fusión final: 1.974 aceptadas / 1 lote perdido (batch_0010, ~25 preguntas) / algunas rechazadas por el validador estructural** (2 por texto de opción duplicado, 1 por letra desalineada). Total: **5.641 → 7.615 preguntas, 110 temas** (tras las correcciones de §15.2). `data/anking/step1_dataset_7615q.json` es el nuevo checkpoint; `step1_dataset_5641q.json` puede borrarse de disco si se quiere (ya no estaba trackeado en git). `DB_HASH` bumpeado a `step1-7615q`.
- Verificado en preview: `window.DB.preguntas.length === 7615`, `window.DB.temas.length === 110`, pantalla "Subjects" sin sistemas fragmentados, una pregunta nueva (tema 117, "Neurology & Special Senses Embryology") renderiza y corrige bien.
- **A petición del usuario, esta vez NO se reintentó el lote perdido (`batch_0010`) ni se completó el QA pendiente de los lotes 0025-0089** (el usuario no iba a tener el ordenador encendido el tiempo necesario) — queda pendiente para la próxima sesión. El workflow se paró con `TaskStop` en cuanto se pidió esto.
- **Quedan ~10.757 tarjetas limpias de AnKing (texto) por convertir** (12.731 anteriores − 1.974 usadas). El lote `batch_0010.json` sigue en `_batches_in_v6` sin generar — puede reusarse tal cual en la próxima tanda (no hace falta recortarlo de nuevo).
