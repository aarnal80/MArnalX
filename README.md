# MarnalX · Estudios

MarnalX es una PWA de estudio con una experiencia inspirada en Duolingo:
sesiones cortas, práctica guiada, repasos espaciados, simulacros y progreso
visible.

La primera versión conserva el motor de práctica de la aplicación original,
pero ya no contiene preguntas ni materiales médicos. El banco está preparado
para incorporar el módulo de 1.º de ESO a partir de los libros que se procesen
y revisen.

## Ejecutar en local

Desde esta carpeta se puede servir la aplicación estática con cualquier servidor
HTTP. Por ejemplo, con Python:

```powershell
python -m http.server 8080 --directory app
```

Después abre `http://localhost:8080`.

## Contenido

El banco que consume la aplicación vive en `app/data/db.js`. Su estructura está
documentada en [`app/data/README.md`](app/data/README.md). Los libros personales
de `Libros/` quedan fuera del repositorio mediante `.gitignore`.
