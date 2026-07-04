# Plan de mejora · OPE Urgencias (oposición Aragón)

> Estado de la app a 2026-06-12: PWA sin dependencias (HTML+CSS+JS vanilla), 3.177 preguntas
> de 21 exámenes y 10 comunidades, 109 temas (40 común / 69 específico), todas con explicación
> de la respuesta correcta y 2.886 con explicación de las incorrectas. Progreso en localStorage.

## 1. Diagnóstico

### Lo que ya funciona bien
- Motor de quiz sólido con dos modos bien diferenciados (práctica con corrección inmediata, simulacro tipo examen real de Aragón: 110 preguntas / 120 min / errores restan ⅓).
- Filtros potentes en práctica (comunidad, tema, falladas, nunca vistas, duplicadas, anuladas).
- Estadísticas por tema ordenadas por debilidad, por comunidad y por día.
- PWA instalable y offline. Exportar/importar progreso.

### Debilidades detectadas (código)
| # | Problema | Dónde |
|---|----------|-------|
| D1 | **Una recarga o cierre accidental pierde todo el test en curso** (incluido un simulacro de 110 preguntas a medias). No hay autoguardado ni "reanudar". | `app.js` — `QUIZ` solo vive en memoria |
| D2 | Al terminar una **práctica no hay revisión de fallos** (`revision: false`); solo el simulacro la tiene. | `finalizarPractica()` |
| D3 | `simUsadas` crece sin límite: con "evitar repetidas" activado el pool de simulacro se agota con el tiempo y **no hay forma de reiniciar el ciclo** salvo borrar todo el progreso. | `poolSimulacro()` / Ajustes |
| D4 | **Importar progreso sobrescribe** en vez de fusionar (`Object.assign`): importar una copia vieja pisa los intentos nuevos. | `#file-import` handler |
| D5 | El SW es *network-first*: estando online **re-descarga db.js (4,8 MB) en cada arranque**. En móvil con datos es lento y caro. | `sw.js` |
| D6 | `esComun = t <= 40` hardcodea la frontera común/específico; debería derivarse de `DB.temas[].grupo`. | `app.js:23-24` |
| D7 | Stats con muchos días/temas se recalculan en cada visita recorriendo todos los intentos; aún rápido, pero crecerá. | `pintarStats()` |
| D8 | Accesibilidad: corrección solo por color (sin `aria-live`), sin atajos de teclado en escritorio. | quiz |

### Debilidades detectadas (datos)
- **5 temas comunes sin ninguna pregunta**: 7 (Ley 39/2015 ámbito/principios), 13 (Ley 9/2013 autoridad profesionales), 22 (identidad/expresión de género), 23 (diversidad cultural), 31 (cartera de servicios). Son temas del programa de Aragón que pueden caer.
- **14 temas con menos de 5 preguntas** — cobertura insuficiente para detectar debilidad real.
- Solo 440 de 3.177 preguntas son de Aragón; el resto sirve de volumen, pero la parte común de otras CCAA ya se excluye por defecto (bien resuelto).

## 2. Mejoras priorizadas

### P1 — Máximo impacto para preparar el examen
1. **Repaso espaciado (SRS ligero)** — la mejora de estudio más rentable. Cola diaria de repaso: una pregunta fallada reaparece a 1 → 3 → 7 → 15 días según racha de aciertos; con un fallo vuelve al inicio. Se calcula con los datos que ya existen en `ST.attempts` (timestamps + acierto), sin migración. Botón "Repaso del día (N)" como acción principal.
2. **Autoguardado y reanudación del test en curso** (resuelve D1). Serializar `QUIZ` (lista de ids, índice, respuestas, fin del timer) en localStorage en cada respuesta; al abrir la app, ofrecer "Continuar simulacro (43/110, quedan 51 min)".
3. **Revisión de fallos al acabar la práctica** (resuelve D2). Reutilizar el componente de revisión del simulacro, mostrando solo falladas.
4. **Pantalla de Inicio / panel "Hoy"** — la mejora de interfaz propuesta, detallada en §3.
5. **Práctica dirigida desde Estadísticas**: en "Por tema (los más flojos primero)", botón por fila → lanza práctica solo de ese tema. Cierra el ciclo detectar-debilidad → atacarla.

### P2 — Calidad de estudio
6. **Resultado de simulacro enriquecido**: desglose de la nota por tema/grupo (común vs específico) y gráfica de evolución de notas de simulacros anteriores (línea simple en el historial).
7. **Marcar preguntas** (🚩 dudas/favoritas) durante cualquier test + filtro "Solo marcadas" en práctica. Campo nuevo `ST.marcadas: []`.
8. **Atajos de teclado** en escritorio: `A–D` responder, `←/→` navegar, `Espacio` siguiente, `B` en blanco.
9. **Gestión del ciclo de simulacros** (resuelve D3): en Ajustes mostrar "N preguntas usadas en simulacros" + botón "Reiniciar ciclo"; avisar en la config de simulacro cuando el pool baje del tamaño pedido.
10. **Importación con fusión** (resuelve D4): unir `attempts` por pregunta (concatenar y ordenar por timestamp, dedupe), concatenar simulacros, unión de `simUsadas`.

### P3 — Técnico / rendimiento
11. **Carga de la BD** (resuelve D5): cambiar el SW a *cache-first* para `db.js` con nombre versionado (`db.<version>.js` generado por `build_db.py`), y precomprimir si se sirve desde un hosting estático (gzip/brotli reduce ~4,8 MB → ~1 MB).
12. **Derivar común/específico de `DB.temas[].grupo`** (resuelve D6) en vez del umbral `t <= 40`.
13. **Accesibilidad** (resuelve D8): `aria-live="polite"` en la corrección, iconos ✓/✗ además del color, `:focus-visible` en opciones.

### P4 — Datos (pipeline en `tools/`)
14. **Cubrir los 5 temas sin preguntas y los 14 con <5**: generar preguntas propias (estilo examen, con explicación) sobre Ley 39/2015, Ley 9/2013, temas 22/23/31, marcándolas con `ex: "propias"` para distinguirlas de las oficiales.
15. **Señalar en la UI los temas sin cobertura** en el selector de temas ("0 preguntas") para que no den falsa sensación de dominio.

## 3. Mejora de interfaz propuesta: pantalla «Inicio»

Hoy la app abre directamente en el formulario de configuración de práctica: cada día hay que decidir qué estudiar desde cero, y los datos que ya guarda la app (fallos, temas flojos, notas de simulacro) están enterrados en la pestaña Estadísticas.

**Propuesta**: una quinta pestaña «Inicio» (🏠), que pasa a ser la vista por defecto, con:

1. **Tarjeta "Continuar"** (solo si hay test en curso guardado — depende de P1.2): "Simulacro a medias · 43/110 · quedan 51 min → Continuar".
2. **Acción principal: "Repaso del día"** — botón grande con el nº de preguntas que tocan hoy según el SRS (P1.1). Si no hay pendientes: "Al día ✓ — empieza una práctica nueva".
3. **Fila de indicadores**: racha de días estudiando · preguntas respondidas hoy · % acierto últimos 7 días · nota del último simulacro.
4. **"Tus 3 temas más flojos"** con barra de acierto y botón directo "Practicar" por tema (P1.5).
5. **Mini-gráfica de evolución de simulacros** (últimas 5 notas) con la línea del 5 marcada — de un vistazo: ¿estaría aprobando?
6. **Cuenta atrás hasta el examen** (fecha configurable en Ajustes): "Faltan 87 días · ritmo necesario: 32 preguntas/día para completar el temario".

Sin librerías nuevas: las gráficas son barras/SVG simples como las que ya existen en Estadísticas. Todo se alimenta de `ST.attempts` y `ST.simulacros`, ya disponibles.

## 4. Orden de implementación sugerido

| Fase | Contenido | Esfuerzo aprox. |
|------|-----------|-----------------|
| 1 | P1.2 autoguardado + P1.3 revisión en práctica + P3.12 (`grupo`) | pequeño |
| 2 | P1.1 SRS + P1.4 pantalla Inicio + P1.5 practicar desde stats | medio (el grueso del valor) |
| 3 | P2.6–P2.10 | pequeño-medio |
| 4 | P3.11 carga BD + P3.13 accesibilidad | pequeño |
| 5 | P4 datos (generar preguntas de temas huérfanos) | aparte, pipeline |
