/* Service worker: app disponible sin conexión.
 * Estrategia:
 *   - data/db.js (~4,8 MB): CACHE-FIRST. Solo se descarga cuando cambia la BD;
 *     el nombre de caché lleva el hash del contenido (lo reescribe build_db.py),
 *     así un cambio de BD invalida el caché y fuerza una única re-descarga.
 *   - resto del shell (html/css/js/iconos): NETWORK-FIRST. Con conexión sirve
 *     siempre lo último (y lo cachea); sin conexión, cae a la versión cacheada. */
const DB_HASH = "778f246b"; // build_db.py lo mantiene sincronizado con data/db.js
const SHELL_VER = "v50";     // súbelo al cambiar html/css/js para invalidar la caché del shell
const CACHE = "opeurg-" + DB_HASH + "-" + SHELL_VER;
const FICHEROS = [
  "./", "./index.html", "./styles.css", "./app.js", "./data/db.js",
  "./config.js", "./vendor/supabase.js", "./auth/gate.js",
  "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/favicon.ico",
  "./fonts/nunito-latin.woff2", "./fonts/nunito-latin-ext.woff2",
  "./img/andalucia-2023-027.png",
  "./img/andalucia-2023-113.png",
  "./img/andalucia-2023-139.png",
  "./img/andalucia-2023-148.png",
  "./img/andalucia-2023-149.png",
  "./img/andalucia-2023b-107.png",
  "./img/andalucia-2023b-109.png",
  "./img/andalucia-2023b-146.png",
  "./img/andalucia-2023b-148.png",
  "./img/clm-2021-010.png",
  "./img/clm-2021-020.png",
  "./img/clm-2024-024.png",
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHEROS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function guardarEnCache(req, resp) {
  const copia = resp.clone();
  caches.open(CACHE).then(c => c.put(req, copia));
  return resp;
}

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const esDB = new URL(e.request.url).pathname.endsWith("/data/db.js");

  if (esDB) {
    // Cache-first: la BD no se revalida; cambia solo al cambiar DB_HASH (nuevo caché).
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true })
        .then(hit => hit || fetch(e.request).then(resp => guardarEnCache(e.request, resp)))
    );
    return;
  }

  // Network-first para el resto del shell: si hay conexión sirve siempre lo último
  // (y lo guarda en caché); sin conexión, cae a la versión cacheada.
  e.respondWith(
    fetch(e.request)
      .then(resp => guardarEnCache(e.request, resp))
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
