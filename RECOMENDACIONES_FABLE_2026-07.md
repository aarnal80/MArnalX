# Recomendaciones · Análisis del proyecto (julio 2026)

> **Autor**: Claude **Fable 5** (Anthropic), análisis realizado el 2026-07-01 a petición
> de Alberto. Este documento recoge el estado verificado del proyecto y las mejoras
> pendientes, priorizadas, para retomarlas en sesiones posteriores.
> Sustituye en la práctica a `PLAN_MEJORA.md` (2026-06-12), que quedó casi completado.

## 1. Valoración general

Proyecto sano y bien llevado. Las decisiones técnicas son las correctas para una app
personal de estudio: PWA vanilla sin dependencias ni build, base de datos generada por
pipeline reproducible (`tools/build_db.py`), progreso en localStorage y despliegue
estático (Vercel, root=`app`). Cero mantenimiento de tooling, funciona offline, y con
~3.200 preguntas el rendimiento no es problema.

## 2. Estado verificado del plan anterior (PLAN_MEJORA.md)

Comprobado punto por punto en el código el 2026-07-01 — **ya implementado**:

- ✅ SRS / repaso espaciado (intervalos 1/3/7/15/30) — `app.js` §SRS
- ✅ Autoguardado y reanudación del test en curso (D1)
- ✅ Pantalla de Inicio con "Estudiar hoy", temas flojos, reanudar
- ✅ Preguntas marcadas 🚩 + revisión desde Inicio
- ✅ Atajos de teclado
- ✅ Importación con fusión, no sobrescribe (D4)
- ✅ SW cache-first para `db.js` con hash de versión `DB_HASH` (D5)
- ✅ Común/específico derivado de `TEMAS_COMUN`, sin umbral hardcodeado (D6)
- ✅ Accesibilidad básica: hay `aria-live` / `aria-label` en app e index (D8, parcial)

**Pendiente del plan anterior**: solo P4 (temas sin preguntas) — ver punto 3.2.

## 3. Recomendaciones pendientes, por prioridad

### 3.1 ⭐ Proteger el progreso del usuario (riesgo más serio)

Todo el progreso (intentos, SRS, simulacros) vive **solo en localStorage**. Safari/iOS
purga datos de webs sin uso reciente, y "liberar espacio" en Android también puede
hacerlo. Perderlo = perder meses de estudio. Dos mitigaciones baratas:

1. Llamar a `navigator.storage.persist()` al arrancar la app (verificado: **no está**
   en `app.js`). Una línea; pide al navegador no purgar los datos del origen.
2. Recordatorio automático de exportar copia: si hace más de N días (p. ej. 7) desde
   la última exportación, mostrar aviso en Inicio. La exportación manual ya existe;
   solo falta guardar el timestamp de la última y avisar.

### 3.2 ⭐ Temas sin preguntas (P4 del plan anterior — único punto de estudio pendiente)

Verificado en `db.js`: no existe ninguna pregunta con `ex: "propias"`. Siguen a cero
los 5 temas comunes del programa de Aragón sin cobertura:

- Tema 7 — Ley 39/2015 (ámbito/principios)
- Tema 13 — Ley 9/2013 (autoridad profesionales)
- Tema 22 — identidad/expresión de género
- Tema 23 — diversidad cultural
- Tema 31 — cartera de servicios

Y ~14 temas con menos de 5 preguntas. **Acción**: generar preguntas propias estilo
examen con explicación (correcta + incorrectas), marcadas con `ex: "propias"` para
distinguirlas de las oficiales, e integrarlas vía el pipeline (`tools/build_db.py`).
Es lo de más valor si el examen se acerca.

### 3.3 Limpieza de la raíz del repo

Restos de trabajos ya terminados, versionados en la raíz:

- `sub.json`, `fix_grupoB.js`, `split_batches.js`, `temas_observados.txt` — mover los
  que sigan siendo útiles a `tools/`, borrar el resto (git conserva el historial).
- `ANALISIS-CALIDAD-PREGUNTAS.md`, `INVENTARIO_CORRUPCION_CLM.md`,
  `INVENTARIO_PREGUNTAS_PROBLEMATICAS.md` — inventarios de problemas ya resueltos;
  archivar en `docs/` o borrar.
- `PLAN_MEJORA.md` — marcar como completado/archivado (este documento lo releva).
- `app/data/db.js.bak` existe en disco (ya ignorado por `.gitignore`, solo estorba).

### 3.4 Corregir el README de la app

`app/README.md` dice que se publica con **GitHub Pages**, pero el despliegue real es
**Vercel** (root = `app/`). Actualizar para no crear confusión en unos meses.

### 3.5 Peso del repo (no urgente)

El pack de git pesa ~247 MB, sobre todo por los PDFs de exámenes fuente en
`Examenes/`. Todo funciona; solo si los clones se hacen molestos: Git LFS para los
PDFs o sacarlos a una carpeta sincronizada fuera del repo.

### 3.6 Modularizar `app.js` (solo si sigue creciendo)

~1.940 líneas en un solo archivo, hoy manejable y bien seccionado con comentarios.
No tocar todavía. Si se añade funcionalidad grande, partirlo entonces en módulos ES
(quiz, SRS, stats, UI).

## 4. Orden sugerido de ejecución

| Paso | Contenido | Esfuerzo |
|------|-----------|----------|
| 1 | 3.1 — `storage.persist()` + aviso de copia de seguridad | pequeño |
| 2 | 3.2 — generar preguntas de temas huérfanos (pipeline) | medio |
| 3 | 3.3 + 3.4 — limpieza raíz y README | pequeño |
| 4 | 3.5 / 3.6 — solo si llegan a molestar | opcional |
