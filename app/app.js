/* USMLE Step 1 · Study app
 * Data: window.DB (data/db.js). Progress: localStorage. */
"use strict";

const DB = window.DB;
const LS_KEY = "usmle_step1_v1";

/* ============ State / persistence ============ */
function cargarEstado() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
const ST = Object.assign({ attempts: {}, simulacros: [], simUsadas: [], marcadas: [], examenFecha: null }, cargarEstado());
if (!Array.isArray(ST.marcadas)) ST.marcadas = [];
function guardar() { localStorage.setItem(LS_KEY, JSON.stringify(ST)); }

/* ============ Indexes ============ */
const FUENTE = {}; DB.fuentes.forEach(f => FUENTE[f.id] = f);
const FUENTES = DB.fuentes.map(f => f.id);
const TEMA = {}; DB.temas.forEach(t => TEMA[t.id] = t);
const PREGUNTA = {}; DB.preguntas.forEach(q => PREGUNTA[q.id] = q);

// Default exam date: 1 year from now (YYYY-MM-DD).
function fechaMas1Anio() {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

function intentos(qid) { return ST.attempts[qid] || []; }
function vista(qid) { return intentos(qid).length > 0; }
function fallada(qid) {
  const a = intentos(qid);
  return a.length > 0 && a[a.length - 1][1] === 0; // last attempt failed
}
function registrar(qid, ok, modo) {
  (ST.attempts[qid] = ST.attempts[qid] || []).push([Date.now(), ok ? 1 : 0, modo]);
  guardar();
}
function estaMarcada(qid) { return ST.marcadas.includes(qid); }
function toggleMarcada(qid) {
  const i = ST.marcadas.indexOf(qid);
  if (i >= 0) ST.marcadas.splice(i, 1); else ST.marcadas.push(qid);
  guardar();
  return i < 0; // true if it's now flagged
}

/* ============ View navigation ============ */
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
function verVista(nombre) {
  $$(".view").forEach(v => v.classList.add("hidden"));
  $("#view-" + nombre).classList.remove("hidden");
  $$("#tabbar button").forEach(b => b.classList.toggle("on", b.dataset.view === nombre));
  if (nombre === "inicio") pintarInicio();
  if (nombre === "practica") pintarTemario();
  if (nombre === "temaConfig") pintarTemaConfig();
  if (nombre === "ajustes") pintarDbInfo();
  if (nombre === "stats") pintarStats();
  if (nombre === "simulacro") pintarHistorialSim();
  if (nombre === "buscar") pintarBuscar();
  window.scrollTo(0, 0);
}
$("#btn-buscar").onclick = () => {
  if (QUIZ.activo && !confirm("Exit the test? Your progress will be saved and you can resume it from Home.")) return;
  if (QUIZ.activo) { guardarQuizEnCurso(); QUIZ.activo = false; pararTimer(); }
  verVista("buscar");
};
$$("#tabbar button").forEach(b => b.onclick = () => {
  if (QUIZ.activo && !confirm("Exit the test? Your progress will be saved and you can resume it from Home.")) return;
  if (QUIZ.activo) { guardarQuizEnCurso(); QUIZ.activo = false; pararTimer(); }
  verVista(b.dataset.view);
});

/* ===== Gesture navigation: swipe between main tabs ===== */
const TABS_NAV = ["inicio", "practica", "simulacro", "stats", "ajustes"];
let _gesto = null;
document.addEventListener("touchstart", e => {
  if (e.touches.length !== 1) { _gesto = null; return; }
  const t = e.touches[0];
  _gesto = { x: t.clientX, y: t.clientY, t: Date.now() };
}, { passive: true });
document.addEventListener("touchend", e => {
  const s = _gesto; _gesto = null;
  if (!s || QUIZ.activo) return; // don't navigate mid-test
  const t = e.changedTouches[0];
  const dx = t.clientX - s.x, dy = t.clientY - s.y;
  if (Date.now() - s.t > 600) return;                       // too slow
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // not clearly horizontal
  const vis = document.querySelector(".view:not(.hidden)");
  if (!vis) return;
  const idx = TABS_NAV.indexOf(vis.id.replace("view-", ""));
  if (idx < 0) return;                                      // view without a tab (quiz, search, etc.)
  const dest = dx < 0 ? idx + 1 : idx - 1;
  if (dest < 0 || dest >= TABS_NAV.length) return;
  verVista(TABS_NAV[dest]);
}, { passive: true });

/* ============ Segments (mutually exclusive buttons) ============ */
function segValor(id) { return $("#" + id + " button.on").dataset.v; }
$$(".seg").forEach(seg => seg.addEventListener("click", ev => {
  const b = ev.target.closest("button"); if (!b) return;
  seg.querySelectorAll("button").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  actualizarPoolSim();
}));

/* ============ Subjects (accordion node path) ============ */
// Practice filter state.
const PF = {
  fuentes: new Set(FUENTES),
  temas: new Set(),                     // topic(s) to practice
  unidad: null,                         // set when practicing a whole subject
  todo: false,                          // set when practicing across every subject
  n: 25,
  falladas: false, marcadas: false, nuevas: false, soloImagen: false,
  barajar: true,
  expandidas: new Set()                 // expanded units (accordion)
};

// 3D color palette (same Duolingo-style design).
const PAL = {
  blue:   { c: "#1CB0F6", d: "#1899D6" }, green:  { c: "#58CC02", d: "#46A302" },
  purple: { c: "#CE82FF", d: "#A560E8" }, orange: { c: "#FF9600", d: "#E58600" },
  red:    { c: "#FF4B4B", d: "#EA2B2B" }, teal:   { c: "#1DD3B0", d: "#13B697" }
};
const PAL_ORDER = ["blue", "green", "purple", "orange", "red", "teal"];

// Icon guess for a subject/system name (keyword match, generic fallback).
function iconoSistema(nombre) {
  const n = (nombre || "").toLowerCase();
  const map = [
    [/cardio/, "❤️"], [/respirat|pulmon/, "🫁"], [/renal|kidney/, "🫘"],
    [/gastro|digest/, "🩺"], [/neuro/, "🧠"], [/endocrin/, "🦋"],
    [/hemat|oncol/, "🩸"], [/repro/, "🤰"], [/immun/, "🛡️"],
    [/musculoskel|skin|connective/, "🦴"], [/pharm/, "💊"], [/patholog/, "🔬"],
    [/psychiatr/, "💬"], [/public health|ethic/, "⚖️"], [/microbiol/, "🦠"],
    [/biochem/, "🧪"],
  ];
  for (const [re, ico] of map) if (re.test(n)) return ico;
  return "📘";
}

// Builds the unit list dynamically from DB.temas, grouped by "sistema".
let _unidades = null;
function unidadesActuales() {
  if (_unidades) return _unidades;
  const orden = [];
  const porSistema = {};
  DB.temas.forEach(t => {
    const key = t.sistema || "General";
    if (!porSistema[key]) { porSistema[key] = []; orden.push(key); }
    porSistema[key].push({ n: t.id, short: t.nombre.length > 40 ? t.nombre.slice(0, 38) + "…" : t.nombre });
  });
  _unidades = orden.map((title, i) => ({
    title, icon: iconoSistema(title), color: PAL_ORDER[i % PAL_ORDER.length], temas: porSistema[title]
  }));
  return _unidades;
}
function unidadDeTema(n) {
  for (const u of unidadesActuales()) if (u.temas.some(t => t.n === n)) return u;
  return null;
}
let _conPreguntas = null;
function temasConPreguntas() {
  if (!_conPreguntas) _conPreguntas = new Set(DB.preguntas.map(q => q.tema).filter(t => t != null));
  return _conPreguntas;
}

function poolPractica(opts = PF) {
  return DB.preguntas.filter(q => {
    if (!opts.fuentes.has(q.fuente)) return false;
    if (opts.temas.size && !opts.temas.has(q.tema)) return false;
    if (opts.falladas && !fallada(q.id)) return false;
    if (opts.marcadas && !estaMarcada(q.id)) return false;
    if (opts.nuevas && vista(q.id)) return false;
    if (opts.soloImagen && !q.img) return false;
    return true;
  });
}

// Topic -> question ids index, cached.
let _pregPorTema = null;
function pregPorTema() {
  if (!_pregPorTema) {
    _pregPorTema = {};
    DB.preguntas.forEach(q => {
      if (!q.r || q.tema == null) return;
      (_pregPorTema[q.tema] = _pregPorTema[q.tema] || []).push(q.id);
    });
  }
  return _pregPorTema;
}
// Stats from a raw list of question ids (history-based).
function statsDeIds(ids) {
  let vistas = 0, intentosTot = 0, aciertos = 0, falladas = 0;
  ids.forEach(id => {
    const a = intentos(id);
    if (!a.length) return;
    vistas++;
    a.forEach(x => { intentosTot++; aciertos += x[1]; });
    if (fallada(id)) falladas++;
  });
  const acc = intentosTot ? aciertos / intentosTot : null;
  const cobertura = ids.length ? vistas / ids.length : 0;
  const dominado = ids.length > 0 && cobertura >= 0.5 && acc != null && acc >= 0.7;
  return { total: ids.length, vistas, intentos: intentosTot, aciertos, falladas, acc, cobertura, dominado };
}
// Real stats for a topic based on history.
function statsTema(n) {
  return statsDeIds(pregPorTema()[n] || []);
}
// Aggregated stats across several topics (whole-subject practice).
function statsConjunto(ns) {
  const idx = pregPorTema();
  const ids = [];
  ns.forEach(n => (idx[n] || []).forEach(id => ids.push(id)));
  return statsDeIds(ids);
}
// Color of a topic node: green if mastered, its unit color if seen, gray if unseen.
function colorNodoTema(n) {
  const st = statsTema(n);
  if (st.dominado) return PAL.green;
  const u = unidadDeTema(n);
  if (st.vistas > 0 && u) return PAL[u.color];
  return { c: "#E5E5E5", d: "#CFCFCF" };
}

// --- Render the units accordion ---
function pintarTemario() {
  const cont = $("#temario-units");
  cont.innerHTML = "";
  const conP = temasConPreguntas();
  const units = unidadesActuales();
  const stMap = {};
  units.forEach(u => u.temas.forEach(t => { if (conP.has(t.n)) stMap[t.n] = statsTema(t.n); }));
  let domin = 0, totalTemas = 0;
  Object.values(stMap).forEach(st => { totalTemas++; if (st.dominado) domin++; });
  const sub = $("#temario-sub");
  if (sub) sub.textContent = `${domin}/${totalTemas} topics mastered · tap a unit to see its path`;
  units.forEach((u, ui) => {
    const pal = PAL[u.color];
    const uid = "u" + ui;
    const abierta = PF.expandidas.has(uid);
    const temasU = u.temas.filter(t => conP.has(t.n));
    const domU = temasU.filter(t => stMap[t.n].dominado).length;
    const pctU = temasU.length ? Math.round(domU / temasU.length * 100) : 0;
    const banner = document.createElement("button");
    banner.className = "unit-banner" + (abierta ? " open" : "");
    banner.style.background = pal.c;
    banner.style.boxShadow = "0 4px 0 " + pal.d;
    // Open: left side (icon/title) launches the whole subject, chevron collapses.
    const labelTxt = abierta ? `tap to practice all ${temasU.length} topics` : `${domU}/${temasU.length} mastered`;
    banner.innerHTML = `<span class="unit-ico">${u.icon}</span>
      <span class="unit-meta">
        <span class="unit-label">${labelTxt}</span>
        <span class="unit-title">${u.title}</span>
        <span class="unit-bar"><span style="width:${pctU}%"></span></span>
      </span>
      <span class="unit-chevron" role="button" aria-label="Collapse">${abierta ? "▾" : "▸"}</span>`;
    banner.onclick = (e) => {
      if (!abierta) { PF.expandidas.add(uid); pintarTemario(); return; }
      // Already open: chevron collapses, anywhere else starts the whole subject.
      if (e.target.closest(".unit-chevron")) { PF.expandidas.delete(uid); pintarTemario(); }
      else openUnidadConfig(u);
    };
    cont.appendChild(banner);
    if (!abierta) return;
    const path = document.createElement("div");
    path.className = "unit-path";
    u.temas.forEach((t, i) => {
      if (!conP.has(t.n)) return;
      const st = stMap[t.n];
      let bg, sh, icon, off = "";
      if (st.dominado) { bg = "#58CC02"; sh = "#46A302"; icon = "✓"; }
      else if (st.vistas > 0) { bg = pal.c; sh = pal.d; icon = "•"; }
      else { bg = "#E5E5E5"; sh = "#CFCFCF"; icon = "•"; off = " node-off"; }
      const wrap = document.createElement("div");
      wrap.className = "node-wrap";
      wrap.style.transform = `translateX(${Math.round(Math.sin(i * 0.9) * 36)}px)`;
      wrap.innerHTML = `<button class="node-circle${off}" style="background:${bg};box-shadow:0 5px 0 ${sh}">${icon}</button>
        <span class="node-label${off}">${t.short}</span>`;
      wrap.querySelector("button").onclick = () => openTemaConfig(t.n);
      path.appendChild(wrap);
    });
    cont.appendChild(path);
  });
}

// --- Topic setup screen ---
function openTemaConfig(n) {
  PF.temas = new Set([n]);
  PF.unidad = null;
  PF.todo = false;
  verVista("temaConfig");
}
// Whole-subject setup: load every topic of the unit into the same screen.
function openUnidadConfig(u) {
  const conP = temasConPreguntas();
  const ids = u.temas.map(t => t.n).filter(id => conP.has(id));
  if (!ids.length) return;
  PF.temas = new Set(ids);
  PF.unidad = u;
  PF.todo = false;
  verVista("temaConfig");
}
// All-subjects setup: no topic filter at all, every source available.
function openTodoConfig() {
  PF.temas = new Set();
  PF.unidad = null;
  PF.todo = true;
  verVista("temaConfig");
}
function pintarTemaConfig() {
  const enUnidad = !!PF.unidad;
  const n = [...PF.temas][0];
  const tema = TEMA[n];
  const u = enUnidad ? PF.unidad : unidadDeTema(n);
  const pal = u ? PAL[u.color] : PAL.green;
  const hero = $("#tc-hero");
  if (PF.todo) {
    hero.style.background = "var(--azul)";
    hero.style.boxShadow = "0 4px 0 var(--azul-osc)";
  } else {
    hero.style.background = pal.c;
    hero.style.boxShadow = "0 4px 0 " + pal.d;
  }
  if (PF.todo) {
    $("#tc-hero-ico").textContent = "📚";
    $("#tc-hero-label").textContent = "Whole question bank";
    $("#tc-hero-title").textContent = "All subjects";
  } else {
    $("#tc-hero-ico").textContent = u ? u.icon : "📘";
    if (enUnidad) {
      $("#tc-hero-label").textContent = `Whole subject · ${PF.temas.size} topics`;
      $("#tc-hero-title").textContent = u.title;
    } else {
      $("#tc-hero-label").textContent = u ? u.title : "Topic";
      $("#tc-hero-title").textContent = tema ? tema.nombre : "";
    }
  }
  // source chips
  const cont = $("#tc-comunidades");
  cont.innerHTML = "";
  FUENTES.forEach(f => {
    const b = document.createElement("button");
    b.textContent = FUENTE[f] ? FUENTE[f].nombre : f;
    b.classList.toggle("on", PF.fuentes.has(f));
    b.onclick = () => {
      if (PF.fuentes.has(f)) PF.fuentes.delete(f); else PF.fuentes.add(f);
      b.classList.toggle("on", PF.fuentes.has(f));
      actualizarTCPool();
    };
    cont.appendChild(b);
  });
  // number segment
  $$("#tc-n button").forEach(b => b.classList.toggle("on", parseInt(b.dataset.v) === PF.n));
  // advanced options reflect state
  $("#tc-falladas").checked = PF.falladas; $("#tc-marcadas").checked = PF.marcadas;
  $("#tc-nuevas").checked = PF.nuevas; $("#tc-solo-imagen").checked = PF.soloImagen;
  $("#tc-barajar").checked = PF.barajar;
  // topic mini-stats
  const s = PF.todo ? statsDeIds(DB.preguntas.map(q => q.id)) : (enUnidad ? statsConjunto(PF.temas) : statsTema(n));
  const accTxt = s.acc != null ? Math.round(s.acc * 100) + "%" : "—";
  const accCol = s.acc == null ? "var(--texto-suave)" : s.acc >= 0.7 ? "var(--ok)" : s.acc >= 0.5 ? "var(--aviso)" : "var(--mal)";
  $("#tc-stats").innerHTML =
    `<div class="tc-stat"><b>${s.vistas}/${s.total}</b><span>seen</span></div>` +
    `<div class="tc-stat"><b style="color:${accCol}">${accTxt}</b><span>accuracy</span></div>` +
    `<div class="tc-stat"><b style="color:${s.falladas ? "var(--mal)" : "var(--texto-suave)"}">${s.falladas}</b><span>to review</span></div>`;
  actualizarTCPool();
}
function actualizarTCPool() {
  const nF = PF.fuentes.size;
  const disp = poolPractica().length;
  $("#tc-pool-info").textContent = `${nF} source${nF !== 1 ? "s" : ""} · ${disp} questions available`;
  $("#tc-empezar").disabled = disp === 0;
}
function initTemaConfig() {
  $("#tc-back").onclick = () => verVista("practica");
  $("#btn-practicar-todo").onclick = openTodoConfig;
  $("#tc-todas").onclick = () => { PF.fuentes = new Set(FUENTES); pintarTemaConfig(); };
  $$("#tc-n button").forEach(b => b.onclick = () => {
    PF.n = parseInt(b.dataset.v);
    $$("#tc-n button").forEach(x => x.classList.remove("on"));
    b.classList.add("on"); actualizarTCPool();
  });
  const map = { "tc-falladas": "falladas", "tc-marcadas": "marcadas", "tc-nuevas": "nuevas", "tc-solo-imagen": "soloImagen", "tc-barajar": "barajar" };
  Object.keys(map).forEach(id => $("#" + id).addEventListener("change", e => {
    PF[map[id]] = e.target.checked; actualizarTCPool();
  }));
  $("#tc-empezar").onclick = startPracticaTema;
}
function startPracticaTema() {
  let pool = poolPractica();
  if (!pool.length) { alert("No questions match those filters."); return; }
  pool = construirLista(pool, PF.barajar, PF.n);
  QUIZ.activo = true; QUIZ.modo = "practica"; QUIZ.lista = pool;
  QUIZ.i = 0; QUIZ.respuestas = {};
  $("#quiz-timer").classList.add("hidden"); $("#quiz-mapa").classList.add("hidden");
  verVista("quiz"); pintarPregunta();
}

/* ============ Quiz (shared engine) ============ */
const QUIZ = { activo: false, modo: null, lista: [], i: 0, respuestas: {}, fin: null, timerInt: null };

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function construirLista(pool, mezclar, n) {
  let lista = pool.filter(Boolean);
  if (mezclar) lista = barajar(lista);
  if (n && n > 0) lista = lista.slice(0, n);
  return lista;
}

// Starts a test block with an already-built list (applies the chosen time).
function lanzarSimulacro(lista) {
  const t = parseInt(segValor("sim-t"));
  QUIZ.activo = true; QUIZ.modo = "simulacro"; QUIZ.lista = lista;
  QUIZ.i = 0; QUIZ.respuestas = {};
  if (t > 0) {
    QUIZ.fin = Date.now() + t * 60000;
    $("#quiz-timer").classList.remove("hidden");
    QUIZ.timerInt = setInterval(tickTimer, 1000); tickTimer();
  } else {
    QUIZ.fin = null; $("#quiz-timer").classList.add("hidden");
  }
  pintarGrid();
  verVista("quiz"); pintarPregunta();
}

/* ===== Test block source chips ===== */
const SIMF = { fuentes: new Set(FUENTES) };
let _simFuentesInit = false;
function initSimFuentes() {
  const cont = $("#sim-fuentes-chips"); if (!cont) return;
  cont.innerHTML = "";
  FUENTES.forEach(f => {
    const b = document.createElement("button");
    b.textContent = FUENTE[f] ? FUENTE[f].nombre : f;
    b.classList.toggle("on", SIMF.fuentes.has(f));
    b.onclick = () => {
      if (SIMF.fuentes.has(f)) SIMF.fuentes.delete(f); else SIMF.fuentes.add(f);
      b.classList.toggle("on", SIMF.fuentes.has(f));
      actualizarPoolSim();
    };
    cont.appendChild(b);
  });
  _simFuentesInit = true;
}

$("#btn-start-simulacro").onclick = () => {
  const n = parseInt(segValor("sim-n"));
  const pool = poolSimulacro();
  if (pool.length < n) {
    if (!confirm(`Only ${pool.length} questions are available (you asked for ${n}). Start anyway?`)) return;
  }
  const lista = barajar(pool).slice(0, Math.min(n, pool.length));
  if (!lista.length) { alert("No questions available."); return; }
  lanzarSimulacro(lista);
};

function poolSimulacro() {
  const noRep = $("#sim-norepetir").checked;
  const usadas = new Set(noRep ? ST.simUsadas : []);
  return DB.preguntas.filter(q => {
    if (!q.r || usadas.has(q.id)) return false;
    return SIMF.fuentes.has(q.fuente);
  });
}
function actualizarPoolSim() {
  if ($("#view-simulacro").classList.contains("hidden")) return;
  const info = $("#sim-pool-info");
  const btn = $("#btn-start-simulacro");
  info.textContent = `${poolSimulacro().length} questions available`;
  if (btn) btn.textContent = "Start test block";
}
$("#sim-norepetir").addEventListener("change", actualizarPoolSim);

function tickTimer() {
  const ms = QUIZ.fin - Date.now();
  if (ms <= 0) { pararTimer(); alert("⏱️ Time's up. Grading the test block."); finalizarSimulacro(); return; }
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  const el = $("#quiz-timer");
  el.textContent = `${m}:${String(s).padStart(2, "0")}`;
  el.classList.toggle("rojo", ms < 5 * 60000);
}
function pararTimer() { if (QUIZ.timerInt) { clearInterval(QUIZ.timerInt); QUIZ.timerInt = null; } }

$("#btn-quiz-salir").onclick = () => {
  if (!confirm("Exit the test? Your progress will be saved and you can resume it from Home.")) return;
  guardarQuizEnCurso(); QUIZ.activo = false; pararTimer();
  verVista("inicio");
};

function pintarGrid() {
  const mapa = $("#quiz-mapa");
  mapa.classList.remove("hidden");
  mapa.open = false; // collapsed by default (key on mobile)
  const g = $("#quiz-grid");
  g.innerHTML = "";
  QUIZ.lista.forEach((q, idx) => {
    const b = document.createElement("button");
    b.textContent = idx + 1;
    b.onclick = () => { QUIZ.i = idx; mapa.open = false; pintarPregunta(); };
    g.appendChild(b);
  });
  refrescarGrid();
}
function refrescarGrid() {
  if (QUIZ.modo !== "simulacro") return;
  let resp = 0;
  $$("#quiz-grid button").forEach((b, idx) => {
    const contestada = QUIZ.respuestas[QUIZ.lista[idx].id] !== undefined;
    if (contestada) resp++;
    b.classList.toggle("resp", contestada);
    b.classList.toggle("actual", idx === QUIZ.i);
  });
  const sum = $("#quiz-mapa-sum");
  if (sum) sum.textContent = `🗺️ Question map · ${resp}/${QUIZ.lista.length} answered`;
}

function pintarPregunta() {
  const q = QUIZ.lista[QUIZ.i];
  actualizarBotonMarcar(q.id);
  const total = QUIZ.lista.length;
  const pct = total ? ((QUIZ.i + 1) / total) * 100 : 0;
  const barEl = $("#quiz-bar");
  if (barEl) barEl.style.width = pct + "%";
  const cEl = $("#quiz-count");
  if (cEl) cEl.textContent = `${QUIZ.i + 1}/${total}`;
  $("#quiz-progreso").setAttribute("aria-label", `Question ${QUIZ.i + 1} of ${total}`);
  const tema = q.tema && TEMA[q.tema] ? ` · ${TEMA[q.tema].nombre}` : "";
  const fuenteNombre = q.fuente && FUENTE[q.fuente] ? FUENTE[q.fuente].nombre : "";
  $("#q-meta").textContent = `${fuenteNombre}${QUIZ.modo === "practica" ? tema : ""}`;
  $("#q-enunciado").textContent = q.q;
  pintarImagen(q);
  const cont = $("#q-opciones");
  cont.innerHTML = "";
  const sel = QUIZ.respuestas[q.id];
  ["A", "B", "C", "D", "E", "F", "G"].forEach(letra => {
    if (!(letra in q.o)) return;
    const b = document.createElement("button");
    b.className = "opcion";
    b.innerHTML = `<span class="letra">${letra}</span><span class="txt"></span>`;
    b.querySelector(".txt").textContent = q.o[letra];
    if (QUIZ.modo === "simulacro") {
      if (sel === letra) b.classList.add("sel");
      b.onclick = () => { QUIZ.respuestas[q.id] = letra; guardarQuizEnCurso(); refrescarGrid(); siguiente(); };
    } else {
      b.onclick = () => responderPractica(q, letra);
    }
    cont.appendChild(b);
  });
  $("#q-explicacion").classList.add("hidden");
  $("#q-explicacion").innerHTML = "";
  // Navigation buttons
  const esSim = QUIZ.modo === "simulacro";
  $("#btn-q-prev").classList.toggle("hidden", !esSim || QUIZ.i === 0);
  $("#btn-q-blanco").classList.toggle("hidden", !esSim);
  $("#btn-q-next").classList.add("hidden");
  $("#btn-q-fin").classList.toggle("hidden", !esSim);
  if (esSim) $("#btn-q-fin").textContent = `Finish (${Object.keys(QUIZ.respuestas).length}/${QUIZ.lista.length})`;
  // Practice: if the question was already answered (e.g. resuming mid-way),
  // show its state and the Next button so it doesn't stay blocked.
  if (!esSim && QUIZ.respuestas[q.id] !== undefined) mostrarRespuestaPractica(q);
  refrescarGrid();
}

// Shows the question image (ECG, X-ray, etc.) if it has one.
function pintarImagen(q) {
  const cont = $("#q-imagen");
  if (!cont) return;
  if (q.img) {
    cont.innerHTML = "";
    const img = document.createElement("img");
    img.src = q.img;
    img.alt = "Question image";
    img.loading = "lazy";
    img.onclick = () => abrirLightbox(q.img);
    const hint = document.createElement("div");
    hint.className = "img-hint";
    hint.textContent = "🔍 Tap the image to enlarge it";
    cont.appendChild(img);
    cont.appendChild(hint);
    cont.classList.remove("hidden");
  } else {
    cont.classList.add("hidden");
    cont.innerHTML = "";
  }
}

function abrirLightbox(src) {
  const lb = $("#lightbox");
  if (!lb) { window.open(src, "_blank"); return; }
  $("#lightbox-img").src = src;
  lb.classList.remove("hidden");
}
function cerrarLightbox() {
  const lb = $("#lightbox");
  if (lb) { lb.classList.add("hidden"); $("#lightbox-img").src = ""; }
}

function responderPractica(q, letra) {
  if (QUIZ.respuestas[q.id] !== undefined) return; // already answered
  QUIZ.respuestas[q.id] = letra;
  if (q.r) registrar(q.id, letra === q.r, "practica");
  guardarQuizEnCurso();
  mostrarRespuestaPractica(q);
  $("#q-explicacion").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Toggles the mini-explanation of ONE option (inside .txt, below the text).
function toggleExpOpcion(b, exp, forzar) {
  if (!exp) return;
  const txt = b.querySelector(".txt");
  const ya = txt.querySelector(".exp-op");
  if (ya) { if (!forzar) ya.remove(); return; }
  const s = document.createElement("span"); s.className = "exp-op"; s.textContent = exp;
  txt.appendChild(s);
}

function mostrarRespuestaPractica(q) {
  const letra = QUIZ.respuestas[q.id];
  if (letra === undefined) return;
  const ok = letra === q.r;
  $$("#q-opciones .opcion").forEach(b => {
    const l = b.querySelector(".letra").textContent;
    if (l === q.r) b.classList.add("correcta");
    if (l === letra && !ok) b.classList.add("incorrecta");
    const exp = (l === q.r) ? (q.e && q.e.correcta) : (q.e && q.e.incorrectas && q.e.incorrectas[l]);
    if (exp) b.classList.add("revisable");
    b.onclick = (ev) => { ev.preventDefault(); toggleExpOpcion(b, exp); };
    if (l === letra && !ok && exp) toggleExpOpcion(b, exp, true);
  });
  const box = $("#q-explicacion");
  box.classList.remove("hidden");
  box.innerHTML = "";
  const div = document.createElement("div");
  div.className = "exp-box" + (ok ? "" : " mal");
  const titulo = ok ? "✅ Correct!" : `❌ Incorrect. The correct answer is ${q.r ?? "—"}.`;
  const cuerpo = (q.e && q.e.correcta) || "No explanation available yet for this question.";
  div.innerHTML = `<div class="titulo"></div><div class="cuerpo"></div>`;
  div.querySelector(".titulo").textContent = titulo;
  div.querySelector(".cuerpo").textContent = cuerpo;
  box.appendChild(div);
  if (QUIZ.i < QUIZ.lista.length - 1) $("#btn-q-next").classList.remove("hidden");
  else { $("#btn-q-fin").classList.remove("hidden"); $("#btn-q-fin").textContent = "See summary"; }
}

function actualizarBotonMarcar(qid) {
  const b = $("#btn-q-marcar");
  const m = estaMarcada(qid);
  b.textContent = m ? "🚩" : "🏳️";
  b.classList.toggle("on", m);
  b.setAttribute("aria-pressed", m ? "true" : "false");
}
$("#btn-q-marcar").onclick = () => {
  if (!QUIZ.activo) return;
  const qid = QUIZ.lista[QUIZ.i].id;
  toggleMarcada(qid);
  actualizarBotonMarcar(qid);
};

function siguiente() {
  if (QUIZ.i < QUIZ.lista.length - 1) { QUIZ.i++; pintarPregunta(); }
}
$("#btn-q-next").onclick = siguiente;
$("#btn-q-prev").onclick = () => { if (QUIZ.i > 0) { QUIZ.i--; pintarPregunta(); } };
$("#btn-q-blanco").onclick = () => { delete QUIZ.respuestas[QUIZ.lista[QUIZ.i].id]; guardarQuizEnCurso(); refrescarGrid(); siguiente(); };
$("#btn-q-fin").onclick = () => {
  if (QUIZ.modo === "simulacro") {
    const sinResp = QUIZ.lista.length - Object.keys(QUIZ.respuestas).length;
    if (sinResp > 0 && !confirm(`You have ${sinResp} unanswered questions (they'll be left blank). Finish?`)) return;
    finalizarSimulacro();
  } else {
    finalizarPractica();
  }
};

function finalizarPractica() {
  QUIZ.activo = false; borrarQuizGuardado();
  const tot = Object.keys(QUIZ.respuestas).length;
  let ok = 0;
  const rev = [];
  QUIZ.lista.forEach(q => {
    const r = QUIZ.respuestas[q.id];
    if (r === undefined) rev.push({ q, r: null, estado: "blanco" });
    else if (r === q.r) { ok++; rev.push({ q, r, estado: "ok" }); }
    else rev.push({ q, r, estado: "mal" });
  });
  pintarResultado({
    titulo: "Practice finished",
    aciertos: ok, errores: tot - ok, blancos: QUIZ.lista.length - tot,
    n: QUIZ.lista.length, nota: null, revision: rev,
  });
  verVista("resultado");
}

function finalizarSimulacro() {
  QUIZ.activo = false; pararTimer(); borrarQuizGuardado();
  let ok = 0, mal = 0, blanco = 0;
  const rev = [];
  QUIZ.lista.forEach(q => {
    const r = QUIZ.respuestas[q.id];
    if (r === undefined) { blanco++; rev.push({ q, r: null, estado: "blanco" }); }
    else if (r === q.r) { ok++; registrar(q.id, true, "simulacro"); rev.push({ q, r, estado: "ok" }); }
    else { mal++; registrar(q.id, false, "simulacro"); rev.push({ q, r, estado: "mal" }); }
    ST.simUsadas.push(q.id);
  });
  const n = QUIZ.lista.length;
  const nota = n ? (ok / n) * 100 : 0;
  ST.simulacros.push({ ts: Date.now(), n, ok, mal, blanco, nota: +nota.toFixed(1) });
  guardar();
  pintarResultado({ titulo: "Test block graded", aciertos: ok, errores: mal, blancos: blanco, n, nota, revision: rev });
  verVista("resultado");
}

let _resultadoVolver = "inicio";
function pintarResultado(r) {
  const soloRev = !!r.soloRevision;
  _resultadoVolver = r.volver || (QUIZ.modo === "simulacro" ? "simulacro" : "practica");
  // Celebratory / encouraging header (not in review-only mode), tiered by score
  const nota = r.nota;
  let emoji = "🎉", titulo = "Nice work!", color = "var(--ok)";
  if (nota != null) {
    if (nota >= 70) { emoji = "🎉"; titulo = "Nice work!"; color = "var(--ok)"; }
    else if (nota >= 50) { emoji = "📚"; titulo = "Keep studying!"; color = "var(--aviso)"; }
    else { emoji = "💪"; titulo = "That was a tough one"; color = "var(--mal)"; }
  }
  const hero = $("#resultado-hero");
  if (hero) {
    if (soloRev) { hero.classList.add("hidden"); hero.innerHTML = ""; }
    else {
      hero.classList.remove("hidden");
      hero.innerHTML = `<div class="res-emoji">${emoji}</div>
        <div class="res-titulo" style="color:${color}">${titulo}</div>
        <div class="res-sub">You got ${r.aciertos} of ${r.n} questions right</div>`;
    }
  }
  const res = $("#resultado-resumen");
  res.innerHTML = "";
  const h = document.createElement("h3"); h.textContent = r.titulo; res.appendChild(h);
  if (soloRev) {
    const mini = document.createElement("div"); mini.className = "mini";
    mini.textContent = `${r.n} question${r.n !== 1 ? "s" : ""} · tap 🏳️ to remove one from your flagged list`;
    res.appendChild(mini);
    const inp = document.createElement("input");
    inp.type = "search"; inp.className = "guard-buscar";
    inp.placeholder = "🔎 Search a question…";
    inp.oninput = () => {
      const term = inp.value.trim().toLowerCase();
      let visibles = 0;
      $$("#resultado-revision .rev-item").forEach(it => {
        const ok = !term || it.textContent.toLowerCase().includes(term);
        it.style.display = ok ? "" : "none";
        if (ok) visibles++;
      });
      const vac = $("#rev-sin-resultados");
      if (vac) vac.classList.toggle("hidden", visibles > 0);
    };
    res.appendChild(inp);
  } else {
    if (r.nota != null) {
      const nd = document.createElement("div");
      nd.className = "nota-grande";
      nd.textContent = Math.round(r.nota) + "%";
      nd.style.color = r.nota >= 60 ? "var(--ok)" : "var(--mal)";
      res.appendChild(nd);
      const mini = document.createElement("div"); mini.className = "mini"; mini.style.textAlign = "center";
      mini.textContent = "Percent correct";
      res.appendChild(mini);
    }
    const det = document.createElement("div");
    det.className = "res-detalle";
    det.innerHTML = `<div><b>${r.aciertos}</b><span class="mini">correct</span></div>
      <div><b>${r.errores}</b><span class="mini">incorrect</span></div>
      <div><b>${r.blancos}</b><span class="mini">blank</span></div>
      <div><b>${r.n}</b><span class="mini">questions</span></div>`;
    res.appendChild(det);
  }

  const cont = $("#resultado-revision");
  cont.innerHTML = "";

  // Breakdown by subject (test block only)
  if (r.revision && r.nota != null) {
    const fallosSistema = {};
    r.revision.forEach(({ q, estado }) => {
      if (q.tema == null || estado === "blanco") return;
      if (estado === "mal") {
        const u = unidadDeTema(q.tema);
        const key = u ? u.title : "Other";
        fallosSistema[key] = (fallosSistema[key] || 0) + 1;
      }
    });
    const peores = Object.entries(fallosSistema).sort((a, b) => b[1] - a[1]).slice(0, 5);
    if (peores.length) {
      let desg = `<div class="card"><h3>Test block breakdown</h3>
        <div class="mini" style="font-weight:700;text-transform:uppercase;font-size:.72rem;">Subjects with most misses</div>`;
      peores.forEach(([sistema, nf]) => {
        desg += `<div class="tema-flojo-row"><div style="flex:1;min-width:0;font-size:.84rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <b>${sistema}</b></div>
          <span style="color:var(--mal);font-weight:700;flex-shrink:0;">${nf} miss${nf !== 1 ? "es" : ""}</span></div>`;
      });
      cont.innerHTML = desg + `</div>`;
    }
  }

  if (r.revision) {
    const card = document.createElement("div"); card.className = "card";
    const t = document.createElement("h3"); t.textContent = soloRev ? "Your flagged questions" : "Review"; card.appendChild(t);
    if (soloRev) {
      const vac = document.createElement("div");
      vac.id = "rev-sin-resultados"; vac.className = "mini hidden";
      vac.textContent = "No question matches your search.";
      card.appendChild(vac);
    }
    r.revision.forEach((item, idx) => {
      card.appendChild(tarjetaPregunta(item.q, idx, { estado: item.estado, tuRespuesta: item.r, soloLectura: soloRev }));
    });
    cont.appendChild(card);
  }
}

// Builds the (read-only or with-result) card of a question for the
// review/search screens. Shared design.
// opts: { estado:"ok"|"mal"|"blanco", tuRespuesta:letra|null, soloLectura:bool }
function tarjetaPregunta(q, idx, opts = {}) {
  const { estado, tuRespuesta = null, soloLectura = false } = opts;
  const div = document.createElement("div");
  div.className = "rev-item " + (soloLectura ? "rev-solo" : (estado || ""));
  const est = estado === "ok" ? "✓" : estado === "mal" ? "✗" : "—";
  const estHTML = soloLectura ? "" : `<span class="estado">${est}</span> `;
  const respHTML = soloLectura
    ? `<div class="mini rev-resp">Correct: ${q.r ?? "—"} · <span class="ver-exp">see explanation</span></div>`
    : `<div class="mini rev-resp">Your answer: ${tuRespuesta ?? "blank"} · Correct: ${q.r ?? "—"} · <span class="ver-exp">see explanation</span></div>`;
  div.innerHTML = `<div class="rev-cab">${estHTML}<b>${idx + 1}.</b> <span class="enun"></span>
    <button class="rev-flag" title="Save question" aria-label="Save question"></button></div>
    <div class="rev-opciones"></div>
    ${respHTML}
    <div class="exp hidden"></div>`;
  div.querySelector(".enun").textContent = q.q;
  const flag = div.querySelector(".rev-flag");
  const pintarFlag = () => {
    const m = estaMarcada(q.id);
    flag.textContent = m ? "🚩" : "🏳️";
    flag.classList.toggle("on", m);
    flag.setAttribute("aria-pressed", m ? "true" : "false");
  };
  pintarFlag();
  flag.onclick = () => { toggleMarcada(q.id); pintarFlag(); };
  const ops = div.querySelector(".rev-opciones");
  ["A", "B", "C", "D", "E", "F", "G"].forEach(letra => {
    if (!q.o || !(letra in q.o)) return;
    const esCorrecta = letra === q.r;
    const esElegida = letra === tuRespuesta;
    const cls = esCorrecta ? "correcta" : (esElegida ? "incorrecta" : "");
    const op = document.createElement("div");
    op.className = "rev-op " + cls;
    op.innerHTML = `<span class="letra">${letra}</span><span class="txt"></span>`;
    op.querySelector(".txt").textContent = q.o[letra];
    ops.appendChild(op);
  });
  div.querySelector(".ver-exp").onclick = () => {
    const e = div.querySelector(".exp");
    if (e.classList.contains("hidden")) {
      e.classList.remove("hidden");
      const txt = (q.e && q.e.correcta) || "No explanation available.";
      e.innerHTML = `<div class="exp-box"><div class="cuerpo"></div></div>`;
      e.querySelector(".cuerpo").textContent = txt;
    } else e.classList.add("hidden");
  };
  return div;
}
$("#btn-resultado-volver").onclick = () => verVista(_resultadoVolver);

// Read-only review of all flagged questions, with search.
function verRevisionGuardadas(lista) {
  const guardadas = (lista || (ST.marcadas || []).map(id => PREGUNTA[id]).filter(Boolean));
  if (!guardadas.length) { verVista("inicio"); return; }
  const rev = guardadas.map(q => ({ q, r: null, estado: "blanco" }));
  pintarResultado({
    titulo: "Flagged questions",
    aciertos: 0, errores: 0, blancos: guardadas.length, n: guardadas.length,
    nota: null, revision: rev, soloRevision: true, volver: "inicio",
  });
  verVista("resultado");
}

/* ============ Global question search ============ */
function normaliza(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
const BUSCAR = { init: false, MAX: 50, fuentes: new Set(), tema: null, ultimos: [] };

function pintarBuscar() {
  if (!BUSCAR.init) initBuscar();
  buscarPorTexto();
}

function initBuscar() {
  BUSCAR.init = true;
  construirChipsFuente();
  construirListaTemas();
  $("#buscar-q").addEventListener("input", buscarPorTexto);
  $("#buscar-tema-q").addEventListener("input", construirListaTemas);
  ["buscar-falladas", "buscar-guardadas"].forEach(id => $("#" + id).addEventListener("change", buscarPorTexto));
  $("#buscar-practicar").onclick = () => {
    if (BUSCAR.ultimos && BUSCAR.ultimos.length) iniciarSesion(barajar(BUSCAR.ultimos));
  };
}

// Source chips (multi-select). Empty set = all.
function construirChipsFuente() {
  const cont = $("#buscar-com-chips"); if (!cont) return;
  cont.innerHTML = "";
  const isOn = val => (val === "" ? BUSCAR.fuentes.size === 0 : BUSCAR.fuentes.has(val));
  const mk = (val, label) => {
    const b = document.createElement("button");
    b.dataset.val = val;
    b.className = "chip-flag" + (isOn(val) ? " on" : "");
    b.textContent = label;
    b.onclick = () => {
      if (val === "") BUSCAR.fuentes.clear();
      else if (BUSCAR.fuentes.has(val)) BUSCAR.fuentes.delete(val);
      else BUSCAR.fuentes.add(val);
      [...cont.children].forEach(c => c.classList.toggle("on", isOn(c.dataset.val)));
      buscarPorTexto();
    };
    return b;
  };
  cont.appendChild(mk("", "All"));
  FUENTES.forEach(f => cont.appendChild(mk(f, FUENTE[f] ? FUENTE[f].nombre : f)));
}

// Filterable topic list (buttons).
function construirListaTemas() {
  const cont = $("#buscar-tema-list"); if (!cont) return;
  const q = normaliza(($("#buscar-tema-q").value || "").trim());
  const temas = DB.temas.filter(t => !q || normaliza(t.nombre).includes(q));
  cont.innerHTML = "";
  const mk = (val, html) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.val = String(val);
    b.className = "tema-opt" + (String(BUSCAR.tema ?? "") === String(val) ? " on" : "");
    b.innerHTML = html;
    b.onclick = () => {
      BUSCAR.tema = (val === "") ? null : +val;
      [...cont.children].forEach(c => c.classList.toggle("on", c.dataset.val === String(val)));
      buscarPorTexto();
    };
    return b;
  };
  cont.appendChild(mk("", `<b>All topics</b>`));
  temas.forEach(t => {
    const row = mk(t.id, `<span class="tnom"></span>`);
    row.querySelector(".tnom").textContent = t.nombre;
    cont.appendChild(row);
  });
}

function buscarPorTexto() {
  const q = normaliza($("#buscar-q").value.trim());
  const fuentes = BUSCAR.fuentes;
  const temaId = BUSCAR.tema;
  const soloFall = $("#buscar-falladas").checked;
  const soloGuard = $("#buscar-guardadas").checked;
  const hayFiltro = q || fuentes.size || temaId != null || soloFall || soloGuard;

  if (!hayFiltro) {
    renderResultadosBuscar([], "Type a word or use the filters to search across the " + DB.preguntas.length + " questions.");
    return;
  }
  const res = DB.preguntas.filter(p => {
    if (fuentes.size && !fuentes.has(p.fuente)) return false;
    if (temaId != null && p.tema !== temaId) return false;
    if (soloFall && !fallada(p.id)) return false;
    if (soloGuard && !estaMarcada(p.id)) return false;
    if (q) {
      const enun = normaliza(p.q);
      const ops = p.o ? Object.values(p.o).map(normaliza).join(" ") : "";
      if (!enun.includes(q) && !ops.includes(q)) return false;
    }
    return true;
  });
  renderResultadosBuscar(res);
}

function renderResultadosBuscar(lista, mensajeVacio) {
  BUSCAR.ultimos = lista;
  const cont = $("#buscar-resultados");
  const info = $("#buscar-info");
  const btn = $("#buscar-practicar");
  cont.innerHTML = "";
  if (!lista.length) {
    info.textContent = mensajeVacio || "No results.";
    btn.style.display = "none";
    return;
  }
  const total = lista.length;
  const mostrados = lista.slice(0, BUSCAR.MAX);
  info.textContent = total > BUSCAR.MAX
    ? `${total} results · showing ${BUSCAR.MAX} (refine your search)`
    : `${total} result${total !== 1 ? "s" : ""}`;
  btn.style.display = "block";
  btn.textContent = `🎲 Practice ${total} result${total !== 1 ? "s" : ""}`;
  const card = document.createElement("div"); card.className = "card";
  mostrados.forEach((q, idx) => card.appendChild(tarjetaPregunta(q, idx, { soloLectura: true })));
  cont.appendChild(card);
}

/* ============ Test block history ============ */
function pintarHistorialSim() {
  if (!_simFuentesInit) initSimFuentes();
  actualizarPoolSim();
  const cont = $("#sim-historial");
  if (!ST.simulacros.length) { cont.innerHTML = '<div class="mini">You haven\'t done a test block yet.</div>'; return; }
  let html = '<table class="stats-tabla"><tr><th>Date</th><th>Q.</th><th>✓</th><th>✗</th><th>Score</th></tr>';
  [...ST.simulacros].reverse().forEach(s => {
    const f = new Date(s.ts).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    html += `<tr><td>${f}</td><td>${s.n}</td><td>${s.ok}</td><td>${s.mal}</td><td><b>${Math.round(s.nota)}%</b></td></tr>`;
  });
  cont.innerHTML = html + "</table>";
}

/* ============ Statistics ============ */
function pintarStats() {
  const cont = $("#stats-content");
  const ats = ST.attempts;
  const qids = Object.keys(ats);
  let tot = 0, ok = 0;
  const porTema = {}, porFuente = {}, porDia = {};
  qids.forEach(qid => {
    const q = PREGUNTA[qid]; if (!q) return;
    ats[qid].forEach(([ts, acierto]) => {
      tot++; ok += acierto;
      const dia = new Date(ts).toISOString().slice(0, 10);
      (porDia[dia] = porDia[dia] || [0, 0])[0]++;
      porDia[dia][1] += acierto;
      if (q.tema != null) {
        (porTema[q.tema] = porTema[q.tema] || [0, 0])[0]++;
        porTema[q.tema][1] += acierto;
      }
      (porFuente[q.fuente] = porFuente[q.fuente] || [0, 0])[0]++;
      porFuente[q.fuente][1] += acierto;
    });
  });

  if (!tot) {
    cont.innerHTML = '<div class="card"><p>You haven\'t answered any questions yet. Start a practice session!</p></div>';
    return;
  }

  const pct = x => Math.round(100 * x);
  const nFalladas = DB.preguntas.filter(q => fallada(q.id)).length;
  const totalDisponibles = DB.preguntas.filter(q => q.r).length;
  const vistas = qids.filter(id => PREGUNTA[id]).length;

  let html = `<div class="card"><h3>Summary</h3><div class="stat-grid">
    <div class="stat-box"><b>${tot}</b><span>answers given</span></div>
    <div class="stat-box"><b>${pct(ok / tot)}%</b><span>overall accuracy</span></div>
    <div class="stat-box"><b>${vistas}/${totalDisponibles}</b><span>questions seen</span></div>
    <div class="stat-box"><b>${nFalladas}</b><span>pending review</span></div>
  </div>
  <button class="btn primary" id="btn-repasar" ${nFalladas ? "" : "disabled"}>🔁 Review the ${nFalladas} missed</button>
  </div>`;

  // Recent activity (last 14 days)
  const dias = Object.keys(porDia).sort().slice(-14);
  html += `<div class="card"><h3>Recent activity</h3>`;
  const maxDia = Math.max(...dias.map(d => porDia[d][0]));
  dias.forEach(d => {
    const [n, a] = porDia[d];
    const fecha = new Date(d + "T12:00").toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short" });
    html += `<div class="tema-stat"><div class="fila"><span>${fecha} — ${n} questions</span>
      <span class="pct">${pct(a / n)}%</span></div>
      <div class="barra"><div style="width:${pct(n / maxDia)}%;background:var(--azul)"></div></div></div>`;
  });
  html += `</div>`;

  // By source
  html += `<div class="card"><h3>By source</h3>`;
  Object.entries(porFuente).sort((a, b) => b[1][0] - a[1][0]).forEach(([f, [n, a]]) => {
    const p = a / n;
    const col = p >= .7 ? "var(--ok)" : p >= .5 ? "var(--aviso)" : "var(--mal)";
    const nombre = FUENTE[f] ? FUENTE[f].nombre : f;
    html += `<div class="tema-stat"><div class="fila" style="align-items:center;gap:10px;">
        <span class="com-stat-nombre"><b>${nombre}</b></span>
        <span class="pct" style="color:${col}">${pct(p)}%</span></div>
      <div class="mini">${n} answer${n !== 1 ? "s" : ""}</div>
      <div class="barra"><div style="width:${pct(p)}%;background:${col}"></div></div></div>`;
  });
  html += `</div>`;

  // Accuracy by subject (system)
  html += `<div class="card"><h3>Accuracy by subject</h3>${htmlPorSistema()}</div>`;

  // By topic (weakest first)
  const temasOrd = Object.entries(porTema)
    .map(([t, [n, a]]) => ({ t: +t, n, p: a / n }))
    .sort((x, y) => x.p - y.p || y.n - x.n);
  html += `<div class="card"><h3>By topic (weakest first)</h3>`;
  temasOrd.forEach(({ t, n, p }) => {
    const tema = TEMA[t];
    const col = p >= .7 ? "var(--ok)" : p >= .5 ? "var(--aviso)" : "var(--mal)";
    html += `<div class="tema-stat"><div style="display:flex;gap:10px;align-items:center;">
      <div style="flex:1;min-width:0;">
        <div class="fila">
          <span>${tema ? tema.nombre.slice(0, 90) : "?"}</span>
          <span class="pct" style="color:${col}">${pct(p)}%</span></div>
        <div class="mini">${n} answers</div>
        <div class="barra"><div style="width:${pct(p)}%;background:${col}"></div></div>
      </div>
      <button class="btn btn-practicar-tema" data-tema="${t}"
        style="width:auto;margin:0;font-size:.78rem;padding:6px 10px;flex-shrink:0;">Practice</button>
    </div></div>`;
  });
  html += `</div>`;

  cont.innerHTML = html;
  $$(".btn-practicar-tema").forEach(b => b.onclick = () => openTemaConfig(+b.dataset.tema));
  const btnRep = $("#btn-repasar");
  if (btnRep) btnRep.onclick = () => {
    const pool = construirLista(barajar(DB.preguntas.filter(q => fallada(q.id))), false, 0);
    QUIZ.activo = true; QUIZ.modo = "practica"; QUIZ.lista = pool;
    QUIZ.i = 0; QUIZ.respuestas = {};
    $("#quiz-timer").classList.add("hidden");
    $("#quiz-mapa").classList.add("hidden");
    verVista("quiz"); pintarPregunta();
  };
}

/* ============ Settings ============ */
$("#btn-export").onclick = () => {
  const blob = new Blob([JSON.stringify(ST, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `usmle-step1-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};
$("#btn-import").onclick = () => $("#file-import").click();
$("#file-import").onchange = ev => {
  const f = ev.target.files[0]; if (!f) return;
  f.text().then(txt => {
    try {
      const data = JSON.parse(txt);
      if (!data.attempts) throw new Error("format");
      Object.keys(data.attempts || {}).forEach(qid => {
        const todos = [...(ST.attempts[qid] || []), ...(data.attempts[qid] || [])];
        todos.sort((a, b) => a[0] - b[0]);
        ST.attempts[qid] = todos.filter((a, i) => i === 0 || a[0] !== todos[i - 1][0]);
      });
      const tsExist = new Set((ST.simulacros || []).map(s => s.ts));
      (data.simulacros || []).forEach(s => { if (!tsExist.has(s.ts)) ST.simulacros.push(s); });
      ST.simulacros.sort((a, b) => a.ts - b.ts);
      const usSet = new Set(ST.simUsadas || []);
      (data.simUsadas || []).forEach(id => usSet.add(id));
      ST.simUsadas = [...usSet];
      const mSet = new Set(ST.marcadas || []);
      (data.marcadas || []).forEach(id => mSet.add(id));
      ST.marcadas = [...mSet];
      if (data.examenFecha) ST.examenFecha = data.examenFecha;
      guardar();
      alert("Progress imported successfully.");
      pintarStats();
    } catch { alert("That file doesn't look like a valid progress export."); }
  });
};
$("#btn-reset").onclick = () => {
  if (!confirm("Are you sure? This will erase ALL your history of correct/incorrect answers and test blocks.")) return;
  ST.attempts = {}; ST.simulacros = []; ST.simUsadas = []; ST.marcadas = [];
  guardar(); borrarQuizGuardado(); alert("Progress erased.");
};

function pintarDbInfo() {
  const nQ = DB.preguntas.length;
  const nAnul = DB.preguntas.filter(q => !q.r).length;
  $("#db-info").innerHTML = `Question bank version: <b>${DB.version}</b><br>
    ${nQ} questions · ${DB.temas.length} topics · ${DB.fuentes.length} source${DB.fuentes.length !== 1 ? "s" : ""}<br>
    ${nAnul} without an answer key`;
  $("#topbar-info").innerHTML = `🔥 <span>${calcularRacha()}</span>`;
  const cicloEl = $("#sim-ciclo-info");
  if (cicloEl) cicloEl.textContent = `${ST.simUsadas.length} questions already used in past test blocks`;
}

/* ============ Test blocks — reset cycle and exam date ============ */
$("#btn-reiniciar-ciclo").onclick = () => {
  if (!confirm(`Reset the cycle? The ${ST.simUsadas.length} questions already used will become available again in test blocks.`)) return;
  ST.simUsadas = []; guardar(); pintarDbInfo();
  actualizarPoolSim();
  alert("Test-block cycle reset.");
};

$("#fecha-examen").addEventListener("change", () => {
  ST.examenFecha = $("#fecha-examen").value || null;
  guardar();
});


/* ============ SRS — spaced repetition (for ALL questions, not just misses) ============ */
const INTERVALOS_SRS = [1, 3, 7, 15, 30];

// Consecutive correct answers at the end of the history (0 if the last attempt failed).
function rachaAciertos(qid) {
  const ats = ST.attempts[qid] || [];
  let s = 0;
  for (let i = ats.length - 1; i >= 0; i--) { if (ats[i][1] === 1) s++; else break; }
  return s;
}
// "Learned" = answered correctly at least 2 times in a row (consolidated).
function aprendida(qid) { return rachaAciertos(qid) >= 2; }

// Next review: every seen question enters the cycle; the interval grows
// with consecutive correct answers (1→3→7→15→30 days) and a miss resets it.
function srsProxima(qid) {
  const ats = ST.attempts[qid] || [];
  if (!ats.length) return null; // never seen: covered by the "new" pace
  const s = rachaAciertos(qid);
  const intervalo = s === 0 ? 1 : INTERVALOS_SRS[Math.min(s - 1, INTERVALOS_SRS.length - 1)];
  return ats[ats.length - 1][0] + intervalo * 86400000;
}

function srsDueHoy() {
  const now = Date.now();
  return DB.preguntas.filter(q => {
    if (!q.r) return false;
    const prox = srsProxima(q.id);
    return prox !== null && prox <= now;
  });
}

/* ============ Adaptive daily plan ============ */
// Study universe: all available questions across sources/topics.
function universoEstudio() {
  return poolPractica({
    fuentes: new Set(FUENTES), temas: new Set(),
    falladas: false, marcadas: false, nuevas: false
  });
}
function diasHastaExamen() {
  if (!ST.examenFecha) return 365;
  const d = Math.ceil((new Date(ST.examenFecha + "T12:00") - new Date()) / 86400000);
  return Math.max(1, d);
}
function preguntasHechasHoy() {
  const hoy = new Date().toISOString().slice(0, 10);
  let n = 0;
  Object.values(ST.attempts).forEach(ats => ats.forEach(([ts]) => {
    if (new Date(ts).toISOString().slice(0, 10) === hoy) n++;
  }));
  return n;
}
// Analyzes stats and designs today's plan.
function planDiario() {
  const universo = universoEstudio();
  const ids = new Set(universo.map(q => q.id));
  const nuevas = universo.filter(q => !vista(q.id));
  const due = srsDueHoy().filter(q => ids.has(q.id));
  const dias = diasHastaExamen();
  const nuevasPorDia = nuevas.length ? Math.ceil(nuevas.length / dias) : 0;
  // Goal = pace to see everything + reviews due today, with a MINIMUM of 30/day
  // (the idea isn't just to see them, it's to learn them through repetition).
  const RITMO_MINIMO = 30;
  const meta = Math.max(RITMO_MINIMO, Math.min(80, nuevasPorDia + due.length));
  return {
    universo, total: universo.length, vistas: universo.length - nuevas.length,
    nuevas, due, dias, nuevasPorDia, meta, hechoHoy: preguntasHechasHoy()
  };
}
// Builds today's session as a MIX of new + review (to learn them):
// 1) spaced reviews due today, 2) new questions at coverage pace,
// 3) reinforcement of what's been seen (misses first), 4) more new if material is short.
function sesionDiaria(plan) {
  const p = plan || planDiario();
  const total = p.hechoHoy >= p.meta ? Math.min(30, p.meta) : (p.meta - p.hechoHoy);
  const usados = new Set();
  const pool = [];
  const take = (arr, n) => {
    for (const q of arr) {
      if (n <= 0 || pool.length >= total) break;
      if (!usados.has(q.id)) { usados.add(q.id); pool.push(q); n--; }
    }
  };
  take(barajar(p.due), total);                                            // 1) spaced review
  take(barajar(p.nuevas), p.nuevasPorDia);                                // 2) new coverage (at pace)
  take(barajar(p.universo.filter(q => fallada(q.id))), total);            // 3) reinforcement: misses
  take(barajar(p.universo.filter(q => vista(q.id))), total);             // 3b) reinforcement: already seen
  take(barajar(p.nuevas), total);                                         // 4) more new if material is short
  return barajar(pool);
}
function iniciarSesion(pool) {
  if (!pool || !pool.length) { verVista("practica"); return; }
  pool = construirLista(pool, false, 0); // keep received order
  QUIZ.activo = true; QUIZ.modo = "practica"; QUIZ.lista = pool;
  QUIZ.i = 0; QUIZ.respuestas = {};
  $("#quiz-timer").classList.add("hidden"); $("#quiz-mapa").classList.add("hidden");
  verVista("quiz"); pintarPregunta();
}

// Forecast for the exam based on your actual pace (last 7 days).
function pronostico(plan) {
  const p = plan || planDiario();
  const total = p.total || 1;
  const ids = new Set(p.universo.map(q => String(q.id)));
  const hace7 = Date.now() - 7 * 86400000;
  let nuevas7 = 0;
  Object.keys(ST.attempts).forEach(qid => {
    if (!ids.has(String(qid))) return;
    const a = ST.attempts[qid];
    if (a && a.length && a[0][0] >= hace7) nuevas7++; // first seen in the last 7 days
  });
  const ritmoNuevas = nuevas7 / 7;
  const aprendidas = p.universo.filter(q => aprendida(q.id)).length;
  const coberturaPct = Math.round(p.vistas / total * 100);
  const dominioPct = Math.round(aprendidas / total * 100);
  const restantes = p.nuevas.length;
  const diasCubrir = ritmoNuevas > 0 ? Math.ceil(restantes / ritmoNuevas) : Infinity;
  const margen = p.dias - diasCubrir;
  let estado, tono;
  if (restantes === 0) { estado = "You've seen the whole question bank! Now consolidate it with review."; tono = "ok"; }
  else if (ritmoNuevas <= 0) { estado = `No measurable pace yet. At ${p.nuevasPorDia}/day new questions you'll have seen everything by exam day.`; tono = "info"; }
  else if (margen >= 0) { estado = `Good pace: at this rate you'll finish the bank ~${margen} day${margen !== 1 ? "s" : ""} before the exam. ✅`; tono = "ok"; }
  else { const faltan = Math.max(0, restantes - Math.floor(ritmoNuevas * p.dias)); estado = `Cutting it close: at this rate ~${faltan} questions would go unseen. Bump it up to ${p.nuevasPorDia}/day. ⚠️`; tono = "warn"; }
  return { coberturaPct, dominioPct, ritmoNuevas, estado, tono };
}

/* ============ Quiz autosave ============ */
const LS_QUIZ_KEY = "usmle_step1_quiz_v1";

function guardarQuizEnCurso() {
  if (!QUIZ.activo) return;
  localStorage.setItem(LS_QUIZ_KEY, JSON.stringify({
    modo: QUIZ.modo,
    lista: QUIZ.lista.map(q => q.id),
    i: QUIZ.i,
    respuestas: QUIZ.respuestas,
    fin: QUIZ.fin,
  }));
}

function borrarQuizGuardado() {
  localStorage.removeItem(LS_QUIZ_KEY);
}

function cargarQuizGuardado() {
  try { return JSON.parse(localStorage.getItem(LS_QUIZ_KEY)); }
  catch { return null; }
}

function reanudarQuiz() {
  const saved = cargarQuizGuardado();
  if (!saved || !saved.lista) return;
  const lista = saved.lista.map(id => PREGUNTA[id]).filter(Boolean);
  if (!lista.length) { borrarQuizGuardado(); return; }
  QUIZ.activo = true; QUIZ.modo = saved.modo; QUIZ.lista = lista;
  QUIZ.i = Math.min(saved.i, lista.length - 1);
  QUIZ.respuestas = saved.respuestas || {}; QUIZ.fin = saved.fin || null;
  if (QUIZ.fin && QUIZ.fin > Date.now()) {
    $("#quiz-timer").classList.remove("hidden");
    QUIZ.timerInt = setInterval(tickTimer, 1000); tickTimer();
  } else if (QUIZ.fin) {
    QUIZ.fin = null; finalizarSimulacro(); return;
  } else {
    $("#quiz-timer").classList.add("hidden");
  }
  if (QUIZ.modo === "simulacro") pintarGrid(); else $("#quiz-mapa").classList.add("hidden");
  verVista("quiz"); pintarPregunta();
}

/* ============ Streak ============ */
function calcularRacha() {
  const dias = new Set();
  Object.values(ST.attempts).forEach(ats =>
    ats.forEach(([ts]) => dias.add(new Date(ts).toISOString().slice(0, 10)))
  );
  if (!dias.size) return 0;
  let racha = 0;
  const hoy = new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(hoy); d.setDate(d.getDate() - i);
    if (dias.has(d.toISOString().slice(0, 10))) racha++;
    else if (i > 0) break;
  }
  return racha;
}

/* ============ Accuracy by subject (system) ============ */
function htmlPorSistema() {
  const porSistema = {};
  Object.keys(ST.attempts).forEach(qid => {
    const q = PREGUNTA[qid]; if (!q || q.tema == null) return;
    const u = unidadDeTema(q.tema);
    const key = u ? u.title : "Other";
    ST.attempts[qid].forEach(([, a]) => {
      (porSistema[key] = porSistema[key] || [0, 0]);
      porSistema[key][0]++; porSistema[key][1] += a;
    });
  });
  const entries = Object.entries(porSistema);
  if (!entries.length) return "";
  const row = (label, n, ok) => {
    const p = Math.round(100 * ok / n);
    const col = p >= 70 ? "var(--ok)" : p >= 50 ? "var(--aviso)" : "var(--mal)";
    return `<div class="cap-row"><div class="cap-head"><span><b>${label}</b></span>
      <span class="cap-pct" style="color:${col}">${p}%</span></div>
      <div class="barra"><div style="width:${p}%;background:${col};height:100%;border-radius:4px;"></div></div>
      <div class="mini">${n} answers · ${ok} correct</div></div>`;
  };
  return entries.sort((a, b) => (a[1][1] / a[1][0]) - (b[1][1] / b[1][0]))
    .map(([label, [n, ok]]) => row(label, n, ok)).join("");
}

/* ============ SVG chart of test block scores ============ */
function svgSimulacros(sims) {
  const W = 560, H = 90, base = 110, n = sims.length;
  const slot = W / n;
  const barW = Math.min(46, slot * 0.5);
  const y60 = base - 0.6 * H; // pass line (60%)
  let bars = "";
  sims.forEach((s, i) => {
    const cx = slot * i + slot / 2;
    const h = Math.max(3, s.nota / 100 * H);
    const y = base - h;
    const aprob = s.nota >= 60;
    const fill = aprob ? "#5DCAA5" : "#F09595";
    const txt = aprob ? "var(--ok)" : "var(--mal)";
    const f = new Date(s.ts).toLocaleDateString("en-US", { day: "2-digit", month: "short" });
    bars += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${fill}"/>
      <text x="${cx.toFixed(1)}" y="${(y - 6).toFixed(1)}" font-size="13" text-anchor="middle" font-weight="700" style="fill:${txt}">${Math.round(s.nota)}%</text>
      <text x="${cx.toFixed(1)}" y="${(base + 17).toFixed(1)}" font-size="11" text-anchor="middle" style="fill:var(--texto-suave)">${f}</text>`;
  });
  return `<svg viewBox="0 0 ${W} 135" width="100%" role="img" aria-label="Test block score trend, with a pass line at 60%">
    <line x1="0" y1="${y60}" x2="${W}" y2="${y60}" stroke-width="1" stroke-dasharray="5 5" style="stroke:var(--texto-suave)"/>
    ${bars}
  </svg>`;
}

/* ============ Home setup ============ */
function guardarSetupInicio() {
  ST.examenFecha = $("#setup-fecha").value || fechaMas1Anio();
  guardar();
  const fe = $("#fecha-examen"); if (fe) fe.value = ST.examenFecha;
  pintarInicio();
}

/* ============ Home screen ============ */
function pintarInicio() {
  const hora = new Date().getHours();
  const racha = calcularRacha();
  $("#inicio-saludo").textContent =
    hora < 7 ? "Good evening! 👋" : hora < 14 ? "Good morning! 👋" : hora < 21 ? "Good afternoon! 👋" : "Good evening! 👋";
  const fechaTxt = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
  $("#inicio-fecha").textContent = racha > 0
    ? `${fechaTxt} · keep your ${racha}-day streak going`
    : `${fechaTxt} · start your streak today`;
  $("#topbar-info").innerHTML = `🔥 <span>${racha}</span>`;

  // Initial setup card (exam date). Hidden once set.
  const setup = $("#inicio-setup");
  if (setup) {
    if (!ST.examenFecha) {
      $("#setup-fecha").value = fechaMas1Anio();
      setup.classList.remove("hidden");
    } else setup.classList.add("hidden");
  }

  const plan = planDiario();

  const cdEl = $("#inicio-countdown");
  if (cdEl) {
    const dias = diasHastaExamen();
    if (ST.examenFecha && dias > 0) {
      cdEl.innerHTML = `<div class="cd-ico">📅</div>
        <div>
          <div class="cd-num">${dias} day${dias !== 1 ? "s" : ""} left</div>
          <div class="cd-sub">Pace: ${plan.meta} questions/day to be ready for exam day</div>
        </div>`;
      cdEl.classList.remove("hidden");
    } else cdEl.classList.add("hidden");
  }

  const hoyStr = new Date().toISOString().slice(0, 10);
  let pregHoy = 0, tot7 = 0, ok7 = 0;
  const hace7 = Date.now() - 7 * 86400000;
  Object.values(ST.attempts).forEach(ats =>
    ats.forEach(([ts, ok]) => {
      if (new Date(ts).toISOString().slice(0, 10) === hoyStr) pregHoy++;
      if (ts >= hace7) { tot7++; ok7 += ok; }
    })
  );
  const ultSim = ST.simulacros.length ? ST.simulacros[ST.simulacros.length - 1] : null;

  const META = plan.meta;
  const hechoHoy = Math.min(pregHoy, META);
  const R = 34, C = 2 * Math.PI * R;
  const off = C * (1 - hechoHoy / META);
  const faltan = Math.max(0, META - pregHoy);
  const objTxt = faltan > 0
    ? `${faltan} question${faltan !== 1 ? "s" : ""} to reach today's goal`
    : "Today's goal complete! ✓";
  const sesion = sesionDiaria(plan);
  const nuevasEnSesion = sesion.filter(q => !vista(q.id)).length;
  const repasoEnSesion = sesion.length - nuevasEnSesion;
  const desglose = `${nuevasEnSesion} new + ${repasoEnSesion} review · ${plan.nuevas.length} left to see`;
  $("#inicio-objetivo").innerHTML = `
    <div class="obj-ring">
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r="${R}" fill="none" stroke="#F0F0F0" stroke-width="11"></circle>
        <circle cx="46" cy="46" r="${R}" fill="none" stroke="var(--azul)" stroke-width="11" stroke-linecap="round"
          stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 46 46)"></circle>
      </svg>
      <div class="obj-ring-txt"><b>${pregHoy}</b><span>/ ${META}</span></div>
    </div>
    <div class="obj-body">
      <div class="obj-label">Today's goal</div>
      <div class="obj-meta">${objTxt}</div>
      <div class="obj-desglose">${desglose}</div>
      <button class="btn primary" id="btn-repaso-dia">${faltan > 0 ? "Study now" : "Extra review"} · ${sesion.length} q.</button>
    </div>`;
  $("#btn-repaso-dia").onclick = () => iniciarSesion(sesion);

  const prevEl = $("#inicio-prevision");
  if (prevEl) {
    if (plan.vistas > 0) {
      const pr = pronostico(plan);
      prevEl.innerHTML = `
        <div class="prev-titulo">📈 Exam forecast</div>
        <div class="prev-estado prev-${pr.tono}">${pr.estado}</div>
        <div class="prev-barras">
          <div class="prev-b"><div class="prev-b-top"><span>Bank seen</span><b>${pr.coberturaPct}%</b></div><div class="barra"><div style="width:${pr.coberturaPct}%;background:var(--azul-claro)"></div></div></div>
          <div class="prev-b"><div class="prev-b-top"><span>Learned</span><b>${pr.dominioPct}%</b></div><div class="barra"><div style="width:${pr.dominioPct}%;background:var(--ok)"></div></div></div>
        </div>`;
      prevEl.classList.remove("hidden");
    } else prevEl.classList.add("hidden");
  }

  const saved = cargarQuizGuardado();
  const contEl = $("#inicio-continuar");
  if (saved && saved.lista && saved.lista.length) {
    const restante = saved.fin ? Math.max(0, saved.fin - Date.now()) : null;
    const minText = restante ? ` · ${Math.ceil(restante / 60000)} min left` : "";
    contEl.innerHTML = `<div style="flex:1"><b>${saved.modo === "simulacro" ? "Test block" : "Practice"} in progress</b>
      <div class="mini">Question ${saved.i + 1} of ${saved.lista.length}${minText}</div></div>
      <button class="btn primary" id="btn-reanudar" style="width:auto;margin:0;">Continue</button>`;
    contEl.classList.remove("hidden");
    $("#btn-reanudar").onclick = reanudarQuiz;
  } else contEl.classList.add("hidden");

  const chip = (ico, val, label, color) =>
    `<div class="stat-box"><div class="stat-top"><span class="stat-ico">${ico}</span>` +
    `<b style="color:${color}">${val}</b></div><span>${label}</span></div>`;
  $("#inicio-stats-grid").innerHTML =
    chip("🔥", racha, racha === 1 ? "Day streak" : "Day streak", "var(--aviso)") +
    chip("✅", pregHoy, "Questions today", "var(--ok)") +
    chip("🎯", tot7 ? Math.round(100 * ok7 / tot7) + "%" : "—", "7-day accuracy", "var(--azul-claro)") +
    chip("🏆", ultSim ? Math.round(ultSim.nota) + "%" : "—", "Last test block", "var(--morado)");

  const guardEl = $("#inicio-guardadas");
  if (guardEl) {
    const guardadas = (ST.marcadas || []).map(id => PREGUNTA[id]).filter(Boolean);
    const ng = guardadas.length;
    if (ng) {
      guardEl.innerHTML = `<div class="guard-head">
          <div class="guard-ico">🚩</div>
          <div style="flex:1;min-width:0;">
            <b>${ng} question${ng !== 1 ? "s" : ""} flagged</b>
            <div class="mini" style="margin:2px 0 0;">Tap to review or practice</div>
          </div>
        </div>
        <div class="guard-actions hidden">
          <button class="btn" id="btn-guard-revisar">📖 Review</button>
          <button class="btn" id="btn-guard-practicar">🎲 Practice</button>
        </div>`;
      const gHead = guardEl.querySelector(".guard-head");
      const gActions = guardEl.querySelector(".guard-actions");
      gHead.onclick = () => { gActions.classList.toggle("hidden"); guardEl.classList.toggle("abierto"); };
      guardEl.querySelector("#btn-guard-revisar").onclick = () => verRevisionGuardadas(guardadas);
      guardEl.querySelector("#btn-guard-practicar").onclick = () => iniciarSesion(barajar(guardadas));
      guardEl.classList.remove("hidden", "abierto");
    } else guardEl.classList.add("hidden");
  }

  // Weakest topics on Home: only the worst 2 (min. 3 answers) to keep it short.
  const porTema = {};
  Object.keys(ST.attempts).forEach(qid => {
    const q = PREGUNTA[qid]; if (!q || q.tema == null) return;
    ST.attempts[qid].forEach(([, a]) => {
      (porTema[q.tema] = porTema[q.tema] || [0, 0])[0]++;
      porTema[q.tema][1] += a;
    });
  });
  const temasFlojos = Object.entries(porTema)
    .filter(([, [n]]) => n >= 3)
    .map(([t, [n, a]]) => ({ t: +t, n, p: a / n }))
    .sort((x, y) => x.p - y.p).slice(0, 2);

  const temasCard = $("#inicio-temas-card");
  const temasEl = $("#inicio-temas");
  if (temasFlojos.length) {
    temasEl.innerHTML = "";
    temasFlojos.forEach(({ t, n, p }) => {
      const tema = TEMA[t]; const pct = Math.round(100 * p);
      const color = colorNodoTema(t).c;
      const row = document.createElement("div"); row.className = "flojo";
      row.innerHTML = `<div class="flojo-top">
          <span class="flojo-badge" style="background:${color}">•</span>
          <div class="flojo-nombre"></div>
          <span class="flojo-pct" style="color:${color}">${pct}%</span>
        </div>
        <div class="barra"><div style="width:${pct}%;background:${color}"></div></div>
        <div class="flojo-foot">
          <span class="mini" style="margin:0;">${n} answer${n !== 1 ? "s" : ""}</span>
          <button class="btn flojo-btn">Practice →</button>
        </div>`;
      row.querySelector(".flojo-nombre").textContent = tema ? tema.nombre : "Topic " + t;
      row.querySelector("button").onclick = () => openTemaConfig(t);
      temasEl.appendChild(row);
    });
    temasCard.classList.remove("hidden");
  } else temasCard.classList.add("hidden");

  const simsCard = $("#inicio-sims-card");
  const sims = ST.simulacros.slice(-6);
  if (sims.length >= 2) {
    $("#inicio-sims").innerHTML = svgSimulacros(sims) +
      `<div class="mini" style="margin-top:6px">Last ${sims.length} test blocks · percent correct · dashed line = pass (60%)</div>`;
    simsCard.classList.remove("hidden");
  } else simsCard.classList.add("hidden");
}

/* ============ Keyboard shortcuts (desktop) ============ */
document.addEventListener("keydown", ev => {
  if (!QUIZ.activo || $("#view-quiz").classList.contains("hidden")) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (ev.target instanceof Element && ev.target.matches("input, textarea, select")) return;
  const k = ev.key;
  const letra = k.length === 1 ? k.toUpperCase() : "";
  if (["A", "B", "C", "D", "E", "F", "G"].includes(letra)) {
    const b = $$("#q-opciones .opcion").find(x => x.querySelector(".letra").textContent === letra);
    if (b && !b.disabled) { b.click(); ev.preventDefault(); }
  } else if (letra === "M") {
    $("#btn-q-marcar").click(); ev.preventDefault();
  } else if (k === "ArrowRight") {
    if (!$("#btn-q-next").classList.contains("hidden")) $("#btn-q-next").click();
    else if (QUIZ.modo === "simulacro") siguiente();
  } else if (k === "ArrowLeft") {
    if (QUIZ.modo === "simulacro" && QUIZ.i > 0) { QUIZ.i--; pintarPregunta(); }
  } else if (k === " " || k === "Enter") {
    if (!$("#btn-q-next").classList.contains("hidden")) { $("#btn-q-next").click(); ev.preventDefault(); }
  } else if (k === "0" && QUIZ.modo === "simulacro") {
    $("#btn-q-blanco").click();
  }
});

/* ============ Service worker + update banner ============ */
function mostrarAvisoActualizar() {
  const b = $("#update-banner");
  if (b) b.classList.remove("hidden");
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").then(reg => {
    if (reg.waiting && navigator.serviceWorker.controller) mostrarAvisoActualizar();
    reg.addEventListener("updatefound", () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener("statechange", () => {
        if (nw.state === "installed" && navigator.serviceWorker.controller) mostrarAvisoActualizar();
      });
    });
  }).catch(() => {});
  const btnUpd = $("#btn-update");
  if (btnUpd) btnUpd.onclick = () => location.reload();
}

/* ============ Init ============ */
(function initLightbox() {
  const lb = $("#lightbox");
  if (!lb) return;
  $("#lightbox-close").onclick = cerrarLightbox;
  lb.addEventListener("click", ev => { if (ev.target === lb) cerrarLightbox(); });
  document.addEventListener("keydown", ev => {
    if (ev.key === "Escape" && !lb.classList.contains("hidden")) cerrarLightbox();
  });
})();
initTemaConfig();
const _setupBtn = $("#setup-guardar");
if (_setupBtn) _setupBtn.onclick = guardarSetupInicio;
pintarTemario();
pintarDbInfo();
if (ST.examenFecha) $("#fecha-examen").value = ST.examenFecha;
verVista("inicio");
