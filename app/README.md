# OPE Urgencias · App de estudio

PWA (HTML + CSS + JS sin dependencias) para preparar la oposición de Médico de
Urgencia Hospitalaria de Aragón: práctica con corrección y explicaciones,
simulacro con la estructura real del examen (110 preguntas, 120 min, 10 comunes
+ 100 específicas, los errores restan ⅓), repaso espaciado, marcado de preguntas
y estadísticas. Funciona sin conexión una vez instalada.

## Uso

Abre la URL en el navegador (móvil u ordenador). Para instalarla en el móvil:
«Añadir a pantalla de inicio» (iOS: Compartir → Añadir a inicio; Android: menú ⋮
→ Instalar aplicación). El progreso se guarda en el dispositivo (localStorage).

## Despliegue

Publicada con GitHub Pages desde la raíz de este repositorio. La base de datos
(`data/db.js`) se genera con el pipeline del proyecto (`tools/build_db.py`).
