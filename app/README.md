# USMLE Step 1 · Study

PWA (HTML + CSS + JS, sin dependencias) para preparar el USMLE Step 1: banco de
preguntas tipo test generado a partir del mazo AnKing Overhaul, práctica con
corrección y explicaciones, bloques de test cronometrados, repaso espaciado,
marcado de preguntas y estadísticas por sistema/tema. Funciona sin conexión una
vez instalada.

## Uso

Abre la URL en el navegador (móvil u ordenador). Para instalarla en el móvil:
«Añadir a pantalla de inicio» (iOS: Compartir → Añadir a inicio; Android: menú ⋮
→ Instalar aplicación). El progreso se guarda en el dispositivo (localStorage).

## Despliegue

Desplegada en Vercel desde la raíz de este repositorio (ver `vercel.json`). La
base de datos (`data/db.js`) se genera con el pipeline del proyecto
(`tools/build_db.py`).
