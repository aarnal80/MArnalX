# Análisis de calidad de preguntas — estado y handoff

Documento de seguimiento del trabajo de detección de errores en el banco de preguntas
(`app/data/db.js`, 3398 preguntas). Sirve para **retomar el trabajo desde otro ordenador**:
basta con `git pull` y leer este archivo.

## Contexto / criterio acordado

- **NO** se cuestiona la respuesta oficial del examen (la marcada es la que es).
- **NO** importan los errores en las opciones incorrectas (pueden decir cualquier cosa).
- **SÍ** se corrige: cuando la **opción correcta** (o su clave `r`) tiene un **error de transcripción**
  que la distorsiona — número/unidad/palabra/negación mal copiada, o texto corrupto.
- Señal de detección: la **explicación del propio item** (`e.correcta` / `e.incorrectas`)
  contradice el texto de la opción correcta o nombra otra letra.

## Hecho ✅

### Grupo B — corregido el texto de la opción correcta (NO cambia qué respuesta es válida)
Aplicado el 2026-06-30 con `fix_grupoB.js`. Backup en `app/data/db.js.bak` (no versionado).

| ID | Opción | Antes | Ahora |
|---|---|---|---|
| `aragon-2024-099` | C | "administrar 10 **mg se** suero glucosado" | "10 **ml de** suero glucosado" |
| `baleares-021` | C | etomidato "0,1-**0,15** mg/kg" | "0,1-**0,3** mg/kg" |
| `aragon-topo-tc-029` | C | "Derecho necesario mínimo **disponible**" | "**indisponible**" |

## Pendiente ⏳

### Grupo A — la clave `r` apunta a la letra equivocada (CAMBIA la respuesta válida)
No aplicado todavía: requiere confirmación porque cambia qué respuesta es correcta.
La evidencia es inequívoca (la explicación nombra la letra correcta).

| ID | `r` actual | Debería ser | Evidencia |
|---|---|---|---|
| `cantabria-2017-024` | B | **C** | `e.correcta`: "La respuesta correcta es la C" (art. 54 Ley 9/2010) |
| `cantabria-2017-047` | A | **C** | `e.correcta`: "La respuesta correcta es C" (síncope cardiogénico) |
| `cantabria-2017-048` | C | **D** | `e.correcta`: "La respuesta correcta es D" (variabilidad arteriografía) |

### Castilla-La Mancha — excluido a propósito
Los exámenes `clm-2018`, `clm-2021`, `clm-2024` se dejaron fuera del análisis a petición.
En la primera pasada (informe amplio) salían como los más problemáticos (textos corruptos,
opciones duplicadas, preguntas sin respuesta). Pendiente de revisar en otra sesión.

### Descartado
- `canarias-546` (D): se valoró cambiar "taquicardia" por "hipotensión" en la tríada de Beck,
  pero la propia explicación acepta la redacción con taquicardia → **no es error de transcripción**, no se toca.

## Cómo retomar (en cualquier ordenador)

1. `git pull`
2. Regenerar los lotes de trabajo: `node split_batches.js` (crea `batches/`, regenerable, no versionado).
3. Para detección enfocada en errores de transcripción de la opción correcta, se usó un
   workflow multi-agente (23 agentes, uno por lote) que cruza `o[r]` contra `e.correcta`.
4. Para aplicar correcciones de texto puntuales, usar `fix_grupoB.js` como plantilla
   (carga db.js, busca por `id`, verifica el texto antiguo, reescribe preservando `window.DB = …;`).

## Ficheros
- `app/data/db.js` — banco de preguntas (editado).
- `split_batches.js` — divide db.js en lotes de 150 preguntas para análisis.
- `fix_grupoB.js` — script de corrección puntual (plantilla para Grupo A).
- `batches/`, `app/data/db.js.bak` — regenerables / backup, **no versionados**.
