# Plan: reconversión de la app a USMLE Step 1 (fuente AnKing)

> **Estado (2026-07-07, actualizado):** v1 en marcha. App migrada, traducida al inglés, tema visual rojo, icono propio, desplegada en Vercel. Datos en producción (`app/data/db.js`): **114 temas / 5.332 preguntas / 2 fuentes** (AnKing + cuadernillo oficial NBME/FSMB). Explicaciones de la cohorte antigua de AnKing (fase 1 + 1ª tanda hiperloop, prompt sin reforzar) ya corregidas casi al completo — ver §10.7. Esquema ampliado para soportar opciones de longitud variable (hasta G) e imágenes en el enunciado — ver §11. Nuevas features de práctica: "Practice all subjects" (sin filtro de tema) y filtro "solo preguntas con imagen" en Advanced Options — ver §12. Quedan **~12.977** tarjetas limpias de AnKing por convertir (18.189 − 5.212 ya usadas).
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
