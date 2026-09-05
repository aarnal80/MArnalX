# Banco de contenidos

`db.js` expone `window.DB` con tres colecciones:

- `fuentes`: materiales de origen (`id`, `nombre`, `idioma`, `descripcion` y `licencia`).
- `temas`: temas agrupados en asignaturas (`id`, `nombre`, `sistema` y `fuente`).
- `preguntas`: preguntas tipo test (`id`, `fuente`, `tema`, `q`, `o`, `r` y `e`).

Una pregunta usa `o` para sus opciones (`A`, `B`, `C`…), `r` para la opción
correcta y `e` para la explicación (`correcta` e `incorrectas`). `img` es
opcional y contiene la ruta de una imagen local.

<<<<<<< HEAD
La aplicación incluye el primer lote de Física y Química de 1.º de Bachillerato
(temas 0, 1 y 2). Cada lote debe revisarse antes de publicarlo.
