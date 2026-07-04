/* OPE Urgencias · App de estudio
 * Datos: window.DB (data/db.js). Progreso: localStorage. */
"use strict";

const DB = window.DB;
const LS_KEY = "opeurg_v1";

/* ============ Estado / persistencia ============ */
function cargarEstado() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; }
  catch { return {}; }
}
const ST = Object.assign({ attempts: {}, simulacros: [], simUsadas: [], marcadas: [], examenFecha: null, comunidad: null }, cargarEstado());
if (!Array.isArray(ST.marcadas)) ST.marcadas = [];
function guardar() { localStorage.setItem(LS_KEY, JSON.stringify(ST)); }

/* ============ Índices ============ */
const EXAMEN = {}; DB.examenes.forEach(e => EXAMEN[e.id] = e);
const TEMA = {}; DB.temas.forEach(t => TEMA[t.id] = t);
const COMUNIDADES = [...new Set(DB.examenes.map(e => e.comunidad))];
const PREGUNTA = {}; DB.preguntas.forEach(q => PREGUNTA[q.id] = q);

const comunidadDe = q => EXAMEN[q.ex].comunidad;
// Comunidad de la oposición del usuario (elegida en el Home/Ajustes). Aragón por defecto.
function comunidadPrincipal() {
  return ST.comunidad || (COMUNIDADES.includes("Aragón") ? "Aragón" : COMUNIDADES_OPOSICION[0]);
}
// Fecha por defecto del examen: dentro de 1 año (formato YYYY-MM-DD).
function fechaMas1Anio() {
  const d = new Date(); d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().slice(0, 10);
}
// "IA" = banco de preguntas generado por IA sobre el mismo temario (Aragón):
// su parte común cuenta como propia sea cual sea la comunidad del usuario.
const COM_IA = "IA";
// "España" = comunidad especial que incluye todas (sin filtrar por comunidad).
const COMUNIDAD_TODAS = "España";
// Comunidades elegibles como oposición propia (setup/Ajustes): no incluye "IA",
// que es un banco de refuerzo, no una comunidad real sobre la que basar el
// temario común del usuario.
const COMUNIDADES_OPOSICION = COMUNIDADES.filter(c => c !== COM_IA);
function esTodasComunidades() { return comunidadPrincipal() === COMUNIDAD_TODAS; }

// Rellena un <select> con las comunidades disponibles (+ España = todas).
function poblarSelectComunidades(sel, selected, placeholder) {
  if (!sel) return;
  let html = placeholder ? `<option value="">${placeholder}</option>` : "";
  html += `<option value="${COMUNIDAD_TODAS}"${selected === COMUNIDAD_TODAS ? " selected" : ""}>España (todas)</option>`;
  COMUNIDADES_OPOSICION.forEach(c => {
    if (c === COMUNIDAD_TODAS) return;
    const on = c === selected ? " selected" : "";
    html += `<option value="${c}"${on}>${c}</option>`;
  });
  sel.innerHTML = html;
}
// Mini bandera SVG de una comunidad (viewBox 30x20).
function bandera(name, w = 26, h = 18) {
  const uid = 'fb' + (bandera._seq = (bandera._seq || 0) + 1);
  const R='#C8102E', GOLD='#FCDD09', GRN='#009A4E', BLU='#0050A0', YEL='#FFC400', PUR='#7C2A86', MAR='#9B1C2E', WHT='#ffffff', OUT='#6E5A00';
  const r=(x,y,wd,ht,f)=>`<rect x="${x}" y="${y}" width="${wd}" height="${ht}" fill="${f}"/>`;
  const c=(cx,cy,rad,f)=>`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="${f}"/>`;
  const ln=(x1,y1,x2,y2,sw)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${GOLD}" stroke-width="${sw}" stroke-linecap="round"/>`;
  const castle=(x,y,s,f)=>`<g>${r(x,y+s*0.35,s,s*0.65,f)}${r(x,y,s*0.24,s*0.45,f)}${r(x+s*0.38,y,s*0.24,s*0.45,f)}${r(x+s*0.76,y,s*0.24,s*0.45,f)}</g>`;
  const aragon=()=>{
    const SH='M10.2 5 H19.8 V11 C19.8 13.8 17.2 15.5 15 16.6 C12.8 15.5 10.2 13.8 10.2 11 Z';
    const CR='M11.8 4.4 L12.9 2.9 L14 4.4 L15 2.6 L16 4.4 L17.1 2.9 L18.2 4.4 L18.2 5 L11.8 5 Z';
    return r(0,0,30,20,GOLD)+r(0,2.222,30,2.222,R)+r(0,6.667,30,2.222,R)+r(0,11.111,30,2.222,R)+r(0,15.556,30,2.222,R)
      +`<g><defs><clipPath id="${uid}ar"><path d="${SH}"/></clipPath></defs><g clip-path="url(#${uid}ar)">`
      +r(10.2,5,4.8,5.5,GOLD)+r(15,5,4.8,5.5,BLU)+r(10.2,10.5,4.8,6.1,WHT)+r(15,10.5,4.8,6.1,GOLD)
      +c(12.6,8.8,1.2,GRN)+r(12.38,5.7,0.45,1.6,R)+r(11.83,6.28,1.55,0.45,R)
      +r(17.05,6.3,0.7,3,WHT)+r(16.2,7.45,2.4,0.7,WHT)+r(12.25,11.9,0.7,3,R)+r(11.4,13.05,2.4,0.7,R)
      +r(15.9,10.5,0.65,6.1,R)+r(17.45,10.5,0.65,6.1,R)
      +`</g><path d="${SH}" fill="none" stroke="${OUT}" stroke-width="0.45"/>`
      +`<path d="${CR}" fill="${GOLD}" stroke="${OUT}" stroke-width="0.3" stroke-linejoin="round"/></g>`;
  };
  const stars=[[8,6],[14,6],[20,6],[11,11],[17,11],[8,15],[20,15]].map(p=>c(p[0],p[1],1.3,WHT)).join('');
  // Destello de 4 puntas (icono clásico de IA) con lados cóncavos.
  const sp=(cx,cy,s,f)=>`<path d="M${cx} ${cy-s} C${cx+s*0.16} ${cy-s*0.3} ${cx+s*0.3} ${cy-s*0.16} ${cx+s} ${cy} C${cx+s*0.3} ${cy+s*0.16} ${cx+s*0.16} ${cy+s*0.3} ${cx} ${cy+s} C${cx-s*0.16} ${cy+s*0.3} ${cx-s*0.3} ${cy+s*0.16} ${cx-s} ${cy} C${cx-s*0.3} ${cy-s*0.16} ${cx-s*0.16} ${cy-s*0.3} ${cx} ${cy-s} Z" fill="${f}"/>`;
  const M = {
    'España': r(0,0,30,20,YEL)+r(0,0,30,5,R)+r(0,15,30,5,R),
    'Andalucía': r(0,0,30,20,WHT)+r(0,0,30,6.67,GRN)+r(0,13.33,30,6.67,GRN),
    'Canarias': r(0,0,10,20,WHT)+r(10,0,10,20,BLU)+r(20,0,10,20,YEL),
    'Cantabria': r(0,0,30,10,WHT)+r(0,10,30,10,R),
    'Cataluña': r(0,0,30,20,GOLD)+r(0,2.22,30,2.22,R)+r(0,6.67,30,2.22,R)+r(0,11.11,30,2.22,R)+r(0,15.56,30,2.22,R),
    'Baleares': r(0,0,30,20,GOLD)+r(0,2.222,30,2.222,R)+r(0,6.667,30,2.222,R)+r(0,11.111,30,2.222,R)+r(0,15.556,30,2.222,R)+r(0,0,11.5,11,'#4E2A84')+castle(3,3,5.2,WHT),
    'Aragón': aragon(),
    'Castilla-La Mancha': r(0,0,15,20,MAR)+r(15,0,15,20,WHT)+castle(4.5,6.5,6,GOLD),
    'Castilla y León': r(0,0,15,10,R)+r(15,10,15,10,R)+r(15,0,15,10,WHT)+r(0,10,15,10,WHT)+castle(3.5,2.8,5,GOLD)+castle(18.5,12.8,5,GOLD)+c(22.5,5,2.4,PUR)+c(7.5,15,2.4,PUR),
    'Madrid': r(0,0,30,20,'#C2002F')+stars,
    'Murcia': r(0,0,30,20,R)+castle(3,3,4,GOLD)+castle(8.5,3,4,GOLD)+c(20,13,1.1,GOLD)+c(24,13,1.1,GOLD)+c(22,16,1.1,GOLD)+c(26,16,1.1,GOLD),
    'Navarra': r(0,0,30,20,R)+ln(15,3,15,17,1.4)+ln(7,10,23,10,1.4)+ln(9,5,21,15,1.4)+ln(21,5,9,15,1.4)+c(15,10,2.1,GOLD)+c(15,10,1.2,GRN),
    'IA': r(0,0,30,20,'#312E81')+sp(13,10.5,6.2,WHT)+sp(21.5,5.5,3,'#7DF0E0')+c(23.5,14.5,1,'#7DF0E0')
  };
  const inner = M[name] || M['España'];
  return `<svg width="${w}" height="${h}" viewBox="0 0 30 20" style="display:block;border-radius:3px;box-shadow:0 0 0 1px rgba(0,0,0,.12)"><defs><clipPath id="${uid}"><rect x="0" y="0" width="30" height="20" rx="3"/></clipPath></defs><g clip-path="url(#${uid})">${inner}</g></svg>`;
}

// Actualiza las etiquetas que mencionan la comunidad (botones de filtro).
function actualizarEtiquetasComunidad() {
  const c = comunidadPrincipal();
  const todas = c === COMUNIDAD_TODAS;
  const soloTxt = todas ? "España (todas)" : "Solo " + c;
  const tcA = $("#tc-aragon"); if (tcA) tcA.textContent = soloTxt;
  const sa = $('#sim-fuente button[data-v="aragon"]'); if (sa) sa.textContent = soloTxt;
  const sm = $('#sim-fuente button[data-v="mixto"]'); if (sm) sm.textContent = todas ? "Común + específico (todas)" : "Común " + c + " + específico de todas";
}
const TEMAS_COMUN = new Set(DB.temas.filter(t => t.grupo === "comun").map(t => t.id));
const esComun = q => q.t != null && TEMAS_COMUN.has(q.t);
const esEspecifico = q => q.t != null && !TEMAS_COMUN.has(q.t);

function intentos(qid) { return ST.attempts[qid] || []; }
function vista(qid) { return intentos(qid).length > 0; }
function fallada(qid) {
  const a = intentos(qid);
  return a.length > 0 && a[a.length - 1][1] === 0; // último intento fallado
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
  return i < 0; // true si ha quedado marcada
}

/* ============ Navegación de vistas ============ */
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
  if (QUIZ.activo && !confirm("¿Salir del test? Tu progreso quedará guardado y podrás retomarlo desde Inicio.")) return;
  if (QUIZ.activo) { guardarQuizEnCurso(); QUIZ.activo = false; pararTimer(); }
  verVista("buscar");
};
$$("#tabbar button").forEach(b => b.onclick = () => {
  if (QUIZ.activo && !confirm("¿Salir del test? Tu progreso quedará guardado y podrás retomarlo desde Inicio.")) return;
  if (QUIZ.activo) { guardarQuizEnCurso(); QUIZ.activo = false; pararTimer(); }
  verVista(b.dataset.view);
});

/* ===== Navegación por gesto: deslizar entre las pestañas principales ===== */
// Arrastrar de derecha a izquierda -> pestaña siguiente (Inicio→Temario→…);
// de izquierda a derecha -> anterior (como arrastrar el contenido).
const TABS_NAV = ["inicio", "practica", "simulacro", "stats", "ajustes"];
let _gesto = null;
document.addEventListener("touchstart", e => {
  if (e.touches.length !== 1) { _gesto = null; return; }
  const t = e.touches[0];
  _gesto = { x: t.clientX, y: t.clientY, t: Date.now() };
}, { passive: true });
document.addEventListener("touchend", e => {
  const s = _gesto; _gesto = null;
  if (!s || QUIZ.activo) return; // no navegar en mitad de un test
  const t = e.changedTouches[0];
  const dx = t.clientX - s.x, dy = t.clientY - s.y;
  if (Date.now() - s.t > 600) return;                       // gesto demasiado lento
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return; // no es horizontal claro
  const vis = document.querySelector(".view:not(.hidden)");
  if (!vis) return;
  const idx = TABS_NAV.indexOf(vis.id.replace("view-", ""));
  if (idx < 0) return;                                      // vista sin pestaña (quiz, buscar, etc.)
  const dest = dx < 0 ? idx + 1 : idx - 1;
  if (dest < 0 || dest >= TABS_NAV.length) return;
  verVista(TABS_NAV[dest]);
}, { passive: true });

/* ============ Segmentos (botones excluyentes) ============ */
function segValor(id) { return $("#" + id + " button.on").dataset.v; }
$$(".seg").forEach(seg => seg.addEventListener("click", ev => {
  const b = ev.target.closest("button"); if (!b) return;
  seg.querySelectorAll("button").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  actualizarPoolInfo(); actualizarPoolSim();
}));

/* ============ Temario (camino de nodos en acordeón) ============ */
// Estado de filtros de práctica (sustituye al antiguo formulario).
const PF = {
  grupo: "comun",                       // grupo mostrado en el Temario
  comunidades: new Set(COMUNIDADES),
  temas: new Set(),                     // tema(s) a practicar
  n: 25,
  falladas: false, marcadas: false, nuevas: false,
  comunOtras: false, dups: false, anuladas: false,
  barajar: true,
  expandidas: new Set()                 // unidades desplegadas (acordeón)
};

// Paleta de colores 3D (igual que el diseño Duolingo).
const PAL = {
  blue:   { c: "#1CB0F6", d: "#1899D6" }, green:  { c: "#58CC02", d: "#46A302" },
  purple: { c: "#CE82FF", d: "#A560E8" }, orange: { c: "#FF9600", d: "#E58600" },
  red:    { c: "#FF4B4B", d: "#EA2B2B" }, teal:   { c: "#1DD3B0", d: "#13B697" }
};

// Unidades del temario. El número de cada tema coincide con su id en la BD.
const UNIDADES_COMUN = [
  { title: "Marco jurídico", icon: "⚖️", color: "blue", temas: [
    {n:1,short:"Constitución y Estatuto"},{n:2,short:"Cortes y Gobierno de Aragón"},{n:3,short:"EBEP: deberes"},{n:4,short:"Negociación colectiva"},{n:5,short:"Protección de datos I"},{n:6,short:"Protección de datos II"},{n:7,short:"Ley 39/2015: ámbito"},{n:8,short:"Procedimiento y recursos"}] },
  { title: "Legislación sanitaria", icon: "🏥", color: "green", temas: [
    {n:9,short:"Ley General de Sanidad"},{n:10,short:"Cohesión del SNS"},{n:11,short:"Profesiones sanitarias"},{n:12,short:"Autonomía del paciente"},{n:13,short:"Ley 9/2013 autoridad"}] },
  { title: "Personal estatutario", icon: "👔", color: "purple", temas: [
    {n:14,short:"Estatuto Marco I"},{n:15,short:"Clasificación y derechos"},{n:16,short:"Provisión y movilidad"},{n:17,short:"Retribuciones"},{n:18,short:"Jornada y permisos"},{n:19,short:"Régimen disciplinario"}] },
  { title: "Igualdad y diversidad", icon: "🤝", color: "orange", temas: [
    {n:20,short:"Igualdad mujeres-hombres"},{n:21,short:"Violencia de género"},{n:22,short:"Identidad de género"},{n:23,short:"Diversidad cultural"}] },
  { title: "Organización sanitaria", icon: "🗂️", color: "teal", temas: [
    {n:24,short:"Niveles asistenciales"},{n:25,short:"SALUD y sectores"}] },
  { title: "Investigación", icon: "🔬", color: "blue", temas: [
    {n:26,short:"Método científico"},{n:27,short:"Epidemiología"},{n:28,short:"Riesgo y sesgos"},{n:29,short:"Ensayos clínicos"},{n:30,short:"Cartera de servicios"},{n:31,short:"Cartera de Aragón"},{n:32,short:"Medicina basada en evidencia"},{n:33,short:"Guías clínicas"}] },
  { title: "Seguridad y calidad", icon: "🛡️", color: "green", temas: [
    {n:34,short:"Seguridad del paciente"},{n:35,short:"Mejora de seguridad"},{n:36,short:"Uso racional del medicamento"},{n:37,short:"Calidad asistencial"}] },
  { title: "Bioética", icon: "🧭", color: "purple", temas: [
    {n:38,short:"Bioética y consentimiento"},{n:39,short:"Comités de bioética"},{n:40,short:"Gobierno clínico"}] }
];
const UNIDADES_ESP = [
  { title: "Soporte vital", icon: "🫀", color: "red", temas: [
    {n:41,short:"SVB y SVA"},{n:42,short:"Politrauma y shock"},{n:43,short:"Vía aérea e intubación"},{n:44,short:"Fármacos y fluidos"}] },
  { title: "Cardiología", icon: "❤️", color: "red", temas: [
    {n:45,short:"Dolor torácico"},{n:46,short:"Síndrome coronario"},{n:47,short:"Taquiarritmias"},{n:48,short:"Bradiarritmias"},{n:49,short:"Insuf. cardíaca y EAP"},{n:50,short:"Shock"},{n:51,short:"Síncope"},{n:52,short:"Urgencias vasculares"}] },
  { title: "Respiratorio", icon: "🫁", color: "blue", temas: [
    {n:53,short:"Disnea e IRA"},{n:54,short:"EPOC"},{n:55,short:"Asma"},{n:56,short:"TEP y TVP"},{n:57,short:"Hemoptisis"},{n:58,short:"Derrame y neumotórax"},{n:59,short:"Neumonía"}] },
  { title: "Digestivo", icon: "🩺", color: "green", temas: [
    {n:60,short:"Dolor abdominal"},{n:61,short:"Hemorragia digestiva"},{n:62,short:"Patología biliar y hepática"},{n:63,short:"Pancreatitis"},{n:64,short:"Oclusión y apendicitis"},{n:65,short:"Diarrea aguda"}] },
  { title: "Neurología", icon: "🧠", color: "purple", temas: [
    {n:66,short:"Cefalea y coma"},{n:67,short:"Crisis epilépticas"},{n:68,short:"Ictus y código ictus"},{n:69,short:"Meningitis y encefalitis"}] },
  { title: "Medio interno", icon: "🧪", color: "orange", temas: [
    {n:70,short:"Ácido-base e iones"},{n:71,short:"Descompensación diabética"},{n:72,short:"Insulina hospitalaria"},{n:73,short:"Crisis endocrinas"},{n:74,short:"Hemostasia y anticoagulación"}] },
  { title: "Nefro-urología", icon: "🫘", color: "teal", temas: [
    {n:75,short:"Insuf. renal aguda"},{n:76,short:"Cólico y retención"},{n:77,short:"Infección urinaria"},{n:78,short:"Urgencias obstétricas"},{n:79,short:"Urgencias ginecológicas"}] },
  { title: "Pediatría", icon: "🧸", color: "orange", temas: [
    {n:80,short:"Urgencias pediátricas"}] },
  { title: "Infecciosas", icon: "🦠", color: "green", temas: [
    {n:81,short:"Síndrome febril"},{n:82,short:"Sepsis y código sepsis"},{n:83,short:"Inmunodeprimido"},{n:84,short:"VIH y SIDA"},{n:85,short:"TBC y tropicales"}] },
  { title: "Trauma", icon: "🦴", color: "red", temas: [
    {n:86,short:"TCE y torácico"},{n:87,short:"Fracturas de extremidades"},{n:88,short:"Pelvis y columna"},{n:89,short:"Heridas y quemaduras"}] },
  { title: "ORL y Oftalmología", icon: "👁️", color: "purple", temas: [
    {n:90,short:"Urgencias ORL"},{n:91,short:"Ojo rojo y pérdida visión"}] },
  { title: "Psiquiatría", icon: "💬", color: "blue", temas: [
    {n:92,short:"Ansiedad y agitación"},{n:93,short:"Suicidio y TCA"}] },
  { title: "Oncológicas y paliativos", icon: "🎗️", color: "orange", temas: [
    {n:94,short:"Dolor oncológico"},{n:95,short:"Compresión medular y VCS"},{n:96,short:"Cuidados paliativos"}] },
  { title: "Geriatría y ambiente", icon: "🌡️", color: "green", temas: [
    {n:97,short:"Anciano en urgencias"},{n:98,short:"Hipotermia y físicos"},{n:99,short:"Hipertermia"}] },
  { title: "Toxicología y alergia", icon: "⚗️", color: "purple", temas: [
    {n:100,short:"Intoxicaciones generales"},{n:101,short:"Intoxicaciones específicas"},{n:102,short:"Picaduras y anafilaxia"}] },
  { title: "Técnicas y SUH", icon: "🛠️", color: "teal", temas: [
    {n:103,short:"Vías venosas e intraósea"},{n:104,short:"Técnicas invasivas"},{n:105,short:"VMNI"},{n:106,short:"Ecografía y FAST"},{n:107,short:"Triaje y catástrofes"},{n:108,short:"Transporte interhospitalario"},{n:109,short:"Manual SUH Aragón"}] }
];
function unidadesActuales() { return PF.grupo === "comun" ? UNIDADES_COMUN : UNIDADES_ESP; }
function unidadDeTema(n) {
  for (const U of [UNIDADES_COMUN, UNIDADES_ESP])
    for (const u of U) if (u.temas.some(t => t.n === n)) return u;
  return null;
}
let _conPreguntas = null;
function temasConPreguntas() {
  if (!_conPreguntas) _conPreguntas = new Set(DB.preguntas.map(q => q.t).filter(t => t != null));
  return _conPreguntas;
}

function poolPractica(opts = PF) {
  return DB.preguntas.filter(q => {
    if (!opts.dups && q.dup) return false;
    if (!opts.anuladas && !q.r) return false;
    if (!opts.comunidades.has(comunidadDe(q))) return false;
    if (!opts.comunOtras && !esTodasComunidades() && esComun(q) && comunidadDe(q) !== comunidadPrincipal() && comunidadDe(q) !== COM_IA) return false;
    if (opts.temas.size && !opts.temas.has(q.t)) return false;
    if (opts.falladas && !fallada(q.id)) return false;
    if (opts.marcadas && !estaMarcada(q.id)) return false;
    if (opts.nuevas && vista(q.id)) return false;
    return true;
  });
}
function actualizarPoolInfo() { /* sin formulario global: no-op (compatibilidad) */ }

// Índice tema -> ids de preguntas válidas (no duplicadas, no anuladas), cacheado.
let _pregPorTema = null;
function pregPorTema() {
  if (!_pregPorTema) {
    _pregPorTema = {};
    DB.preguntas.forEach(q => {
      if (q.dup || !q.r || q.t == null) return;
      (_pregPorTema[q.t] = _pregPorTema[q.t] || []).push(q.id);
    });
  }
  return _pregPorTema;
}
// Estadísticas reales de un tema a partir del historial.
function statsTema(n) {
  const ids = pregPorTema()[n] || [];
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
// Color de un tema igual que su nodo en el Temario: verde si dominado,
// el color de su unidad si está visto, gris si no se ha visto.
function colorNodoTema(n) {
  const st = statsTema(n);
  if (st.dominado) return PAL.green;
  const u = unidadDeTema(n);
  if (st.vistas > 0 && u) return PAL[u.color];
  return { c: "#E5E5E5", d: "#CFCFCF" };
}

// --- Render del acordeón de unidades ---
function pintarTemario() {
  $("#tg-comun").classList.toggle("on", PF.grupo === "comun");
  $("#tg-esp").classList.toggle("on", PF.grupo === "especifico");
  const cont = $("#temario-units");
  cont.innerHTML = "";
  const conP = temasConPreguntas();
  const units = unidadesActuales();
  // Stats por tema (una sola vez para todo el render)
  const stMap = {};
  units.forEach(u => u.temas.forEach(t => { if (conP.has(t.n)) stMap[t.n] = statsTema(t.n); }));
  // Subtítulo: temas dominados / total del grupo
  let domin = 0, totalTemas = 0;
  Object.values(stMap).forEach(st => { totalTemas++; if (st.dominado) domin++; });
  const sub = $("#temario-sub");
  if (sub) sub.textContent = `${domin}/${totalTemas} temas dominados · toca una unidad para ver el camino`;
  units.forEach((u, ui) => {
    const pal = PAL[u.color];
    const uid = PF.grupo + ui;
    const abierta = PF.expandidas.has(uid);
    const temasU = u.temas.filter(t => conP.has(t.n));
    const domU = temasU.filter(t => stMap[t.n].dominado).length;
    const pctU = temasU.length ? Math.round(domU / temasU.length * 100) : 0;
    const banner = document.createElement("button");
    banner.className = "unit-banner" + (abierta ? " open" : "");
    banner.style.background = pal.c;
    banner.style.boxShadow = "0 4px 0 " + pal.d;
    banner.innerHTML = `<span class="unit-ico">${u.icon}</span>
      <span class="unit-meta">
        <span class="unit-label">Unidad ${ui + 1} · ${domU}/${temasU.length} dominados</span>
        <span class="unit-title">${u.title}</span>
        <span class="unit-bar"><span style="width:${pctU}%"></span></span>
      </span>
      <span class="unit-chevron">${abierta ? "▾" : "▸"}</span>`;
    banner.onclick = () => {
      abierta ? PF.expandidas.delete(uid) : PF.expandidas.add(uid);
      pintarTemario();
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
      else if (st.vistas > 0) { bg = pal.c; sh = pal.d; icon = String(t.n); }
      else { bg = "#E5E5E5"; sh = "#CFCFCF"; icon = String(t.n); off = " node-off"; }
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

// --- Pantalla de configuración de un tema ---
function openTemaConfig(n) {
  PF.temas = new Set([n]);
  verVista("temaConfig");
}
function pintarTemaConfig() {
  const n = [...PF.temas][0];
  const tema = TEMA[n];
  const u = unidadDeTema(n);
  const pal = u ? PAL[u.color] : PAL.green;
  const hero = $("#tc-hero");
  hero.style.background = pal.c;
  hero.style.boxShadow = "0 4px 0 " + pal.d;
  $("#tc-hero-ico").textContent = u ? u.icon : "📘";
  $("#tc-hero-label").textContent = `Tema ${n}${u ? " · " + u.title : ""}`;
  $("#tc-hero-title").textContent = tema ? tema.nombre : "";
  // chips de comunidades
  const cont = $("#tc-comunidades");
  cont.innerHTML = "";
  COMUNIDADES.forEach(c => {
    const b = document.createElement("button");
    b.textContent = c;
    b.classList.toggle("on", PF.comunidades.has(c));
    b.onclick = () => {
      if (PF.comunidades.has(c)) PF.comunidades.delete(c); else PF.comunidades.add(c);
      b.classList.toggle("on", PF.comunidades.has(c));
      actualizarTCPool();
    };
    cont.appendChild(b);
  });
  // segmento de número
  $$("#tc-n button").forEach(b => b.classList.toggle("on", parseInt(b.dataset.v) === PF.n));
  // avanzadas reflejan estado
  $("#tc-falladas").checked = PF.falladas; $("#tc-marcadas").checked = PF.marcadas;
  $("#tc-nuevas").checked = PF.nuevas; $("#tc-comun-otras").checked = PF.comunOtras;
  $("#tc-dups").checked = PF.dups; $("#tc-anuladas").checked = PF.anuladas;
  $("#tc-barajar").checked = PF.barajar;
  // mini-estadísticas del tema
  const s = statsTema(n);
  const accTxt = s.acc != null ? Math.round(s.acc * 100) + "%" : "—";
  const accCol = s.acc == null ? "var(--texto-suave)" : s.acc >= 0.7 ? "var(--ok)" : s.acc >= 0.5 ? "var(--aviso)" : "var(--mal)";
  $("#tc-stats").innerHTML =
    `<div class="tc-stat"><b>${s.vistas}/${s.total}</b><span>vistas</span></div>` +
    `<div class="tc-stat"><b style="color:${accCol}">${accTxt}</b><span>aciertos</span></div>` +
    `<div class="tc-stat"><b style="color:${s.falladas ? "var(--mal)" : "var(--texto-suave)"}">${s.falladas}</b><span>a repasar</span></div>`;
  actualizarTCPool();
}
function actualizarTCPool() {
  const nCom = PF.comunidades.size;
  const disp = poolPractica().length;
  $("#tc-pool-info").textContent = `${nCom} comunidad${nCom !== 1 ? "es" : ""} · ${disp} preguntas disponibles`;
  $("#tc-empezar").disabled = disp === 0;
}
function initTemaConfig() {
  $("#tc-back").onclick = () => verVista("practica");
  $("#tg-comun").onclick = () => { PF.grupo = "comun"; pintarTemario(); };
  $("#tg-esp").onclick = () => { PF.grupo = "especifico"; pintarTemario(); };
  $("#tc-todas").onclick = () => { PF.comunidades = new Set(COMUNIDADES); pintarTemaConfig(); };
  $("#tc-aragon").onclick = () => {
    PF.comunidades = esTodasComunidades() ? new Set(COMUNIDADES) : new Set([comunidadPrincipal()]);
    pintarTemaConfig();
  };
  $$("#tc-n button").forEach(b => b.onclick = () => {
    PF.n = parseInt(b.dataset.v);
    $$("#tc-n button").forEach(x => x.classList.remove("on"));
    b.classList.add("on"); actualizarTCPool();
  });
  const map = { "tc-falladas": "falladas", "tc-marcadas": "marcadas", "tc-nuevas": "nuevas",
    "tc-comun-otras": "comunOtras", "tc-dups": "dups", "tc-anuladas": "anuladas", "tc-barajar": "barajar" };
  Object.keys(map).forEach(id => $("#" + id).addEventListener("change", e => {
    PF[map[id]] = e.target.checked; actualizarTCPool();
  }));
  $("#tc-empezar").onclick = startPracticaTema;
}
function startPracticaTema() {
  let pool = poolPractica();
  if (!pool.length) { alert("No hay preguntas con esos filtros."); return; }
  pool = construirLista(pool, PF.barajar, PF.n);
  QUIZ.activo = true; QUIZ.modo = "practica"; QUIZ.lista = pool;
  QUIZ.i = 0; QUIZ.respuestas = {};
  $("#quiz-timer").classList.add("hidden"); $("#quiz-mapa").classList.add("hidden");
  verVista("quiz"); pintarPregunta();
}

/* ============ Quiz (motor común) ============ */
const QUIZ = { activo: false, modo: null, lista: [], i: 0, respuestas: {}, fin: null, timerInt: null };

function barajar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lista de práctica respetando los bloques de caso clínico (categoría A):
// si entra cualquier pregunta de un caso, se trae el bloque ENTERO y consecutivo
// (en orden de pregunta) para no perder el contexto. Las unidades (bloque de caso
// o pregunta suelta) se barajan juntas y el recorte por nº no parte bloques.
function construirLista(pool, mezclar, n) {
  const vistos = new Set();
  let unidades = [];
  for (const q of pool) {
    if (!q) continue;
    if (q.caso) {
      if (vistos.has(q.caso)) continue;
      vistos.add(q.caso);
      unidades.push(DB.preguntas.filter(p => p.caso === q.caso).sort((a, b) => a.n - b.n));
    } else {
      unidades.push([q]);
    }
  }
  if (mezclar) unidades = barajar(unidades);
  if (n && n > 0) {
    const out = []; let cnt = 0;
    for (const u of unidades) { if (cnt >= n) break; out.push(u); cnt += u.length; }
    unidades = out;
  }
  return unidades.flat();
}

// Arranca un simulacro con una lista ya construida (aplica el tiempo elegido).
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

function simModoEs(m) { const b = $("#sim-modo button.on"); return b && b.dataset.v === m; }

$("#btn-start-simulacro").onclick = () => {
  if (simModoEs("real")) { empezarExamenReal(); return; }
  const n = parseInt(segValor("sim-n"));
  const pool = poolSimulacro();
  if (pool.length < n) {
    if (!confirm(`Solo hay ${pool.length} preguntas disponibles (pediste ${n}). ¿Empezar igualmente?`)) return;
  }
  const lista = muestraSimulacro(pool, Math.min(n, pool.length));
  if (!lista.length) { alert("No hay preguntas disponibles."); return; }
  lanzarSimulacro(lista);
};

// Modo "Examen real": hace un examen existente completo, en su orden original.
const SIMREAL = { com: "", ex: "" };
let _simRealInit = false;
function initSimReal() {
  if (_simRealInit) return; _simRealInit = true;
  construirChipsComunidad("#simr-com-chips", "com", onSimComChange, false, SIMREAL);
  construirChipsExamen("#simr-ex-chips", "#simr-ex-hint", "com", "ex", actualizarPoolSim, false, SIMREAL);
  $$("#sim-modo button").forEach(b => b.addEventListener("click", () => {
    const modo = b.dataset.v;
    $("#sim-aleatorio").classList.toggle("hidden", modo !== "aleatorio");
    $("#sim-real").classList.toggle("hidden", modo !== "real");
  }));
}
function onSimComChange() {
  SIMREAL.ex = "";
  construirChipsExamen("#simr-ex-chips", "#simr-ex-hint", "com", "ex", actualizarPoolSim, false, SIMREAL);
  actualizarPoolSim();
}
// Preguntas evaluables de un examen, en su orden original.
function preguntasDeExamen(exId) {
  return DB.preguntas.filter(p => p.ex === exId && p.r).sort((a, b) => a.n - b.n);
}
function empezarExamenReal() {
  const ex = EXAMEN[SIMREAL.ex];
  if (!ex) { alert("Elige una comunidad y un examen."); return; }
  let lista = preguntasDeExamen(ex.id); // completo, en orden
  const n = parseInt(segValor("simr-n")) || 0;
  if (n > 0) lista = barajar(lista).slice(0, Math.min(n, lista.length)); // media/rápido: al azar
  if (!lista.length) { alert("Ese examen no tiene preguntas disponibles."); return; }
  lanzarSimulacro(lista);
}

function poolSimulacro() {
  const fuente = segValor("sim-fuente");
  const noRep = $("#sim-norepetir").checked;
  const usadas = new Set(noRep ? ST.simUsadas : []);
  return DB.preguntas.filter(q => {
    // Las preguntas de caso clínico (categoría A) NO entran en simulacros: solo
    // tienen sentido consecutivas con su bloque, y el examen aleatorio no lo garantiza.
    if (q.dup || !q.r || q.caso || usadas.has(q.id)) return false;
    const com = comunidadDe(q);
    const principal = comunidadPrincipal();
    const todas = esTodasComunidades();
    if (fuente === "aragon") return todas || com === principal;
    if (fuente === "mixto") return esEspecifico(q) || todas || com === principal || com === COM_IA;
    return todas || !(esComun(q) && com !== principal && com !== COM_IA); // 'todas': la parte común de tu comunidad (+ banco IA)
  });
}
function actualizarPoolSim() {
  if ($("#view-simulacro").classList.contains("hidden")) return;
  const info = $("#sim-pool-info");
  const btn = $("#btn-start-simulacro");
  if (simModoEs("real")) {
    const ex = EXAMEN[SIMREAL.ex];
    if (ex) {
      const total = preguntasDeExamen(ex.id).length;
      const n = parseInt(segValor("simr-n")) || 0;
      const cuantas = n > 0 ? Math.min(n, total) : total;
      const comoTxt = n > 0 ? "al azar" : "completo";
      info.textContent = `${nombreExamen(ex)} · ${cuantas} preguntas (${comoTxt})`;
      if (btn) btn.textContent = `Empezar examen (${cuantas} preg.)`;
    } else {
      info.textContent = SIMREAL.com ? "Elige un examen." : "Elige comunidad y examen.";
      if (btn) btn.textContent = "Empezar examen";
    }
  } else {
    info.textContent = `${poolSimulacro().length} preguntas disponibles`;
    if (btn) btn.textContent = "Empezar simulacro";
  }
}
$("#sim-norepetir").addEventListener("change", actualizarPoolSim);

function muestraSimulacro(pool, n) {
  // Estructura real del examen de Aragón: 110 preguntas = 10 comunes + 100
  // específicas (90 evaluables + 10 de reserva). La parte común es fija: 10 de
  // cada 110. Se escala proporcionalmente en los simulacros más cortos.
  const PROP_COMUN = 10 / 110;
  const nCom = Math.round(n * PROP_COMUN);
  const comunes = barajar(pool.filter(esComun)).slice(0, nCom);
  const resto = barajar(pool.filter(q => !esComun(q))).slice(0, n - comunes.length);
  return barajar(comunes.concat(resto));
}

function tickTimer() {
  const ms = QUIZ.fin - Date.now();
  if (ms <= 0) { pararTimer(); alert("⏱️ Tiempo agotado. Se corrige el simulacro."); finalizarSimulacro(); return; }
  const m = Math.floor(ms / 60000), s = Math.floor((ms % 60000) / 1000);
  const el = $("#quiz-timer");
  el.textContent = `${m}:${String(s).padStart(2, "0")}`;
  el.classList.toggle("rojo", ms < 5 * 60000);
}
function pararTimer() { if (QUIZ.timerInt) { clearInterval(QUIZ.timerInt); QUIZ.timerInt = null; } }

$("#btn-quiz-salir").onclick = () => {
  if (!confirm("¿Salir del test? Tu progreso quedará guardado y podrás retomarlo desde Inicio.")) return;
  guardarQuizEnCurso(); QUIZ.activo = false; pararTimer();
  verVista("inicio");
};

function pintarGrid() {
  const mapa = $("#quiz-mapa");
  mapa.classList.remove("hidden");
  mapa.open = false; // plegado por defecto (clave en móvil)
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
  if (sum) sum.textContent = `🗺️ Mapa de preguntas · ${resp}/${QUIZ.lista.length} contestadas`;
}

function pintarPregunta() {
  const q = QUIZ.lista[QUIZ.i];
  const ex = EXAMEN[q.ex];
  actualizarBotonMarcar(q.id);
  const total = QUIZ.lista.length;
  const pct = total ? ((QUIZ.i + 1) / total) * 100 : 0;
  const barEl = $("#quiz-bar");
  if (barEl) barEl.style.width = pct + "%";
  const cEl = $("#quiz-count");
  if (cEl) cEl.textContent = `${QUIZ.i + 1}/${total}`;
  $("#quiz-progreso").setAttribute("aria-label", `Pregunta ${QUIZ.i + 1} de ${total}`);
  const tema = q.t && TEMA[q.t] ? ` · Tema ${q.t}` : "";
  $("#q-meta").textContent = `${ex.nombre}${QUIZ.modo === "practica" ? tema : ""}${q.r ? "" : " · ANULADA"}`;
  pintarCaso(q);
  $("#q-enunciado").textContent = q.q;
  pintarImagen(q);
  const cont = $("#q-opciones");
  cont.innerHTML = "";
  const sel = QUIZ.respuestas[q.id];
  ["A", "B", "C", "D"].forEach(letra => {
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
  // Botones de navegación
  const esSim = QUIZ.modo === "simulacro";
  $("#btn-q-prev").classList.toggle("hidden", !esSim || QUIZ.i === 0);
  $("#btn-q-blanco").classList.toggle("hidden", !esSim);
  $("#btn-q-next").classList.add("hidden");
  $("#btn-q-fin").classList.toggle("hidden", !esSim);
  if (esSim) $("#btn-q-fin").textContent = `Finalizar (${Object.keys(QUIZ.respuestas).length}/${QUIZ.lista.length})`;
  // Práctica: si la pregunta ya estaba respondida (p.ej. al reanudar a medias),
  // mostrar su estado y el botón Siguiente para no quedar bloqueado.
  if (!esSim && QUIZ.respuestas[q.id] !== undefined) mostrarRespuestaPractica(q);
  refrescarGrid();
}

// Recuerda si el usuario dejó desplegado el enunciado del caso, para mantenerlo
// abierto/cerrado al navegar por las preguntas del bloque.
let CASO_ABIERTO = false;

// Muestra la introducción/contexto del caso clínico (categoría A) si la pregunta
// pertenece a un caso con intro registrada en DB.casos. Va plegada tras un botón
// (como la lupa de las imágenes) para no ocupar al repetirse en cada pregunta.
function pintarCaso(q) {
  const cont = $("#q-caso");
  if (!cont) return;
  const intro = q.caso && DB.casos ? DB.casos[q.caso] : null;
  if (!intro) {
    cont.classList.add("hidden");
    cont.innerHTML = "";
    return;
  }
  cont.innerHTML =
    `<button type="button" class="caso-btn" aria-expanded="false">` +
    `<span class="caso-ico">🩺</span>` +
    `<span class="caso-btn-txt"></span>` +
    `<span class="caso-chevron">▾</span></button>` +
    `<div class="caso-texto hidden"></div>`;
  const btn = cont.querySelector(".caso-btn");
  const texto = cont.querySelector(".caso-texto");
  const rotulo = cont.querySelector(".caso-btn-txt");
  texto.textContent = intro;
  const aplicar = abierto => {
    CASO_ABIERTO = abierto;
    texto.classList.toggle("hidden", !abierto);
    btn.classList.toggle("abierto", abierto);
    btn.setAttribute("aria-expanded", abierto ? "true" : "false");
    rotulo.textContent = abierto ? "Ocultar enunciado del caso" : "Ver enunciado del caso";
  };
  btn.onclick = () => aplicar(!CASO_ABIERTO);
  aplicar(CASO_ABIERTO);
  cont.classList.remove("hidden");
}

// Muestra la imagen asociada a la pregunta (ECG, radiografía, etc.) si la tiene.
function pintarImagen(q) {
  const cont = $("#q-imagen");
  if (!cont) return;
  if (q.img) {
    cont.innerHTML = "";
    const img = document.createElement("img");
    img.src = q.img;
    img.alt = "Imagen de la pregunta";
    img.loading = "lazy";
    img.onclick = () => abrirLightbox(q.img);
    const hint = document.createElement("div");
    hint.className = "img-hint";
    hint.textContent = "🔍 Toca la imagen para ampliarla";
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
  if (QUIZ.respuestas[q.id] !== undefined) return; // ya respondida
  QUIZ.respuestas[q.id] = letra;
  if (q.r) registrar(q.id, letra === q.r, "practica");
  guardarQuizEnCurso();
  mostrarRespuestaPractica(q);
  $("#q-explicacion").scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Pinta el estado "respondida" de una pregunta de práctica. Se usa al responder
// y también al REANUDAR una práctica dejada a medias (si no, quedaba bloqueada).
// Alterna la mini-explicación de UNA opción (dentro de .txt, debajo del texto).
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
    // explicación de ESA opción: la incorrectas[l] si es errónea, o la general si es la correcta
    const exp = (l === q.r) ? (q.e && q.e.correcta) : (q.e && q.e.incorrectas && q.e.incorrectas[l]);
    if (exp) b.classList.add("revisable");
    // Pulsar una opción muestra/oculta SU explicación, sin cambiar tu respuesta elegida
    b.onclick = (ev) => { ev.preventDefault(); toggleExpOpcion(b, exp); };
    // La opción que elegiste se queda abierta con su explicación (si era errónea)
    if (l === letra && !ok && exp) toggleExpOpcion(b, exp, true);
  });
  const box = $("#q-explicacion");
  box.classList.remove("hidden");
  box.innerHTML = "";
  const div = document.createElement("div");
  div.className = "exp-box" + (ok ? "" : " mal");
  const titulo = ok ? "✅ ¡Correcto!" : `❌ Incorrecto. La respuesta correcta es la ${q.r ?? "—"}.`;
  const cuerpo = (q.e && q.e.correcta) || "Sin explicación disponible todavía para esta pregunta.";
  div.innerHTML = `<div class="titulo"></div><div class="cuerpo"></div>`;
  div.querySelector(".titulo").textContent = titulo;
  div.querySelector(".cuerpo").textContent = cuerpo;
  box.appendChild(div);
  if (QUIZ.i < QUIZ.lista.length - 1) $("#btn-q-next").classList.remove("hidden");
  else { $("#btn-q-fin").classList.remove("hidden"); $("#btn-q-fin").textContent = "Ver resumen"; }
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
    if (sinResp > 0 && !confirm(`Tienes ${sinResp} preguntas sin responder (quedarán en blanco). ¿Finalizar?`)) return;
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
    titulo: "Práctica terminada",
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
  const neto = ok - mal / 3;
  const nota = Math.max(0, (neto / n) * 10);
  ST.simulacros.push({ ts: Date.now(), n, ok, mal, blanco, nota: +nota.toFixed(2) });
  guardar();
  pintarResultado({ titulo: "Simulacro corregido", aciertos: ok, errores: mal, blancos: blanco, n, nota, revision: rev });
  verVista("resultado");
}

let _resultadoVolver = "inicio";
function pintarResultado(r) {
  const soloRev = !!r.soloRevision;
  _resultadoVolver = r.volver || (QUIZ.modo === "simulacro" ? "simulacro" : "practica");
  // Cabecera celebratoria (no en modo solo-revisión)
  const aprobado = r.nota == null || r.nota >= 5;
  const hero = $("#resultado-hero");
  if (hero) {
    if (soloRev) { hero.classList.add("hidden"); hero.innerHTML = ""; }
    else {
      hero.classList.remove("hidden");
      hero.innerHTML = `<div class="res-emoji">${aprobado ? "🎉" : "💪"}</div>
        <div class="res-titulo" style="color:${aprobado ? "var(--aviso)" : "var(--azul-claro)"}">${aprobado ? "¡Bien hecho!" : "¡A seguir!"}</div>
        <div class="res-sub">Has acertado ${r.aciertos} de ${r.n} preguntas</div>`;
    }
  }
  const res = $("#resultado-resumen");
  res.innerHTML = "";
  const h = document.createElement("h3"); h.textContent = r.titulo; res.appendChild(h);
  if (soloRev) {
    const mini = document.createElement("div"); mini.className = "mini";
    mini.textContent = `${r.n} pregunta${r.n !== 1 ? "s" : ""} · toca la 🏳️ para quitar una de guardadas`;
    res.appendChild(mini);
    const inp = document.createElement("input");
    inp.type = "search"; inp.className = "guard-buscar";
    inp.placeholder = "🔎 Buscar una pregunta…";
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
      nd.textContent = r.nota.toFixed(2);
      nd.style.color = r.nota >= 5 ? "var(--ok)" : "var(--mal)";
      res.appendChild(nd);
      const mini = document.createElement("div"); mini.className = "mini"; mini.style.textAlign = "center";
      mini.textContent = "Nota sobre 10 (los errores restan ⅓ de acierto)";
      res.appendChild(mini);
    }
    const det = document.createElement("div");
    det.className = "res-detalle";
    det.innerHTML = `<div><b>${r.aciertos}</b><span class="mini">aciertos</span></div>
      <div><b>${r.errores}</b><span class="mini">errores</span></div>
      <div><b>${r.blancos}</b><span class="mini">en blanco</span></div>
      <div><b>${r.n}</b><span class="mini">preguntas</span></div>`;
    res.appendChild(det);
  }

  const cont = $("#resultado-revision");
  cont.innerHTML = "";

  // Desglose por parte del temario (solo simulacro)
  if (r.revision && r.nota != null) {
    let comN = 0, comOk = 0, espN = 0, espOk = 0;
    const fallosTema = {};
    r.revision.forEach(({ q, estado }) => {
      if (q.t == null || estado === "blanco") return;
      const acierto = estado === "ok" ? 1 : 0;
      if (esComun(q)) { comN++; comOk += acierto; } else { espN++; espOk += acierto; }
      if (estado === "mal") fallosTema[q.t] = (fallosTema[q.t] || 0) + 1;
    });
    const fila = (label, n, ok) => {
      if (!n) return "";
      const p = Math.round(100 * ok / n);
      const col = p >= 70 ? "var(--ok)" : p >= 50 ? "var(--aviso)" : "var(--mal)";
      return `<div class="cap-row"><div class="cap-head"><span><b>${label}</b></span>
        <span class="cap-pct" style="color:${col}">${p}%</span></div>
        <div class="barra"><div style="width:${p}%;background:${col};height:100%;border-radius:4px;"></div></div>
        <div class="mini">${ok} aciertos de ${n} contestadas</div></div>`;
    };
    const peores = Object.entries(fallosTema).sort((a, b) => b[1] - a[1]).slice(0, 5);
    let desg = `<div class="card"><h3>Desglose del simulacro</h3>${fila("Temario común", comN, comOk)}${fila("Temario específico", espN, espOk)}`;
    if (peores.length) {
      desg += `<div class="mini" style="margin-top:10px;font-weight:700;text-transform:uppercase;font-size:.72rem;">Temas con más fallos</div>`;
      peores.forEach(([t, nf]) => {
        const tema = TEMA[t];
        desg += `<div class="tema-flojo-row"><div style="flex:1;min-width:0;font-size:.84rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <b>${t}.</b> ${tema ? tema.nombre : "?"}</div>
          <span style="color:var(--mal);font-weight:700;flex-shrink:0;">${nf} fallo${nf !== 1 ? "s" : ""}</span></div>`;
      });
    }
    cont.innerHTML = desg + `</div>`;
  }

  if (r.revision) {
    const card = document.createElement("div"); card.className = "card";
    const t = document.createElement("h3"); t.textContent = soloRev ? "Tus preguntas guardadas" : "Revisión"; card.appendChild(t);
    if (soloRev) {
      const vac = document.createElement("div");
      vac.id = "rev-sin-resultados"; vac.className = "mini hidden";
      vac.textContent = "Ninguna pregunta coincide con la búsqueda.";
      card.appendChild(vac);
    }
    r.revision.forEach((item, idx) => {
      card.appendChild(tarjetaPregunta(item.q, idx, { estado: item.estado, tuRespuesta: item.r, soloLectura: soloRev }));
    });
    cont.appendChild(card);
  }
}

// Construye la tarjeta (solo lectura o con resultado) de una pregunta para
// las pantallas de revisión y de búsqueda. Reutiliza el mismo diseño.
// opts: { estado:"ok"|"mal"|"blanco", tuRespuesta:letra|null, soloLectura:bool }
function tarjetaPregunta(q, idx, opts = {}) {
  const { estado, tuRespuesta = null, soloLectura = false } = opts;
  const div = document.createElement("div");
  div.className = "rev-item " + (soloLectura ? "rev-solo" : (estado || ""));
  const est = estado === "ok" ? "✓" : estado === "mal" ? "✗" : "—";
  const estHTML = soloLectura ? "" : `<span class="estado">${est}</span> `;
  const respHTML = soloLectura
    ? `<div class="mini rev-resp">Correcta: ${q.r ?? "—"} · <span class="ver-exp">ver explicación</span></div>`
    : `<div class="mini rev-resp">Tu respuesta: ${tuRespuesta ?? "en blanco"} · Correcta: ${q.r ?? "—"} · <span class="ver-exp">ver explicación</span></div>`;
  div.innerHTML = `<div class="rev-cab">${estHTML}<b>${idx + 1}.</b> <span class="enun"></span>
    <button class="rev-flag" title="Guardar pregunta" aria-label="Guardar pregunta"></button></div>
    <div class="rev-opciones"></div>
    ${respHTML}
    <div class="exp hidden"></div>`;
  div.querySelector(".enun").textContent = q.q;
  // Bandera para guardar/quitar la pregunta desde la propia tarjeta
  const flag = div.querySelector(".rev-flag");
  const pintarFlag = () => {
    const m = estaMarcada(q.id);
    flag.textContent = m ? "🚩" : "🏳️";
    flag.classList.toggle("on", m);
    flag.setAttribute("aria-pressed", m ? "true" : "false");
  };
  pintarFlag();
  flag.onclick = () => { toggleMarcada(q.id); pintarFlag(); };
  // Opciones completas: marca la correcta y, si fallaste, también la que elegiste
  const ops = div.querySelector(".rev-opciones");
  ["A", "B", "C", "D"].forEach(letra => {
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
      const txt = (q.e && q.e.correcta) || "Sin explicación disponible.";
      e.innerHTML = `<div class="exp-box"><div class="cuerpo"></div></div>`;
      e.querySelector(".cuerpo").textContent = txt;
    } else e.classList.add("hidden");
  };
  return div;
}
$("#btn-resultado-volver").onclick = () => verVista(_resultadoVolver);

// Revisión (solo lectura) de todas las preguntas guardadas, con buscador.
function verRevisionGuardadas(lista) {
  const guardadas = (lista || (ST.marcadas || []).map(id => PREGUNTA[id]).filter(Boolean));
  if (!guardadas.length) { verVista("inicio"); return; }
  const rev = guardadas.map(q => ({ q, r: null, estado: "blanco" }));
  pintarResultado({
    titulo: "Preguntas guardadas",
    aciertos: 0, errores: 0, blancos: guardadas.length, n: guardadas.length,
    nota: null, revision: rev, soloRevision: true, volver: "inicio",
  });
  verVista("resultado");
}

/* ============ Buscador global de preguntas ============ */
// Normaliza texto: minúsculas y sin acentos, para buscar "vias" y encontrar "vías".
function normaliza(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}
const BUSCAR = { modo: "texto", init: false, MAX: 50, com: new Set(), ex: "", tema: null, idCom: "", idEx: "", ultimos: [] };

function pintarBuscar() {
  if (!BUSCAR.init) initBuscar();
  // Cada vez que se entra, refresca por si cambiaron guardadas/falladas
  if (BUSCAR.modo === "texto") buscarPorTexto(); else buscarPorId();
}

function initBuscar() {
  BUSCAR.init = true;
  // Chips del modo TEXTO (comunidad multi-selección)
  construirChipsComunidad("#buscar-com-chips", "com", onTextoComChange, true);
  construirChipsExamen("#buscar-ex-chips", "#buscar-ex-hint", "com", "ex", buscarPorTexto, true);
  construirListaTemas();
  // Chips del modo ID (comunidad única)
  construirChipsComunidad("#bid-com-chips", "idCom", onIdComChange, false);
  construirChipsExamen("#bid-ex-chips", "#bid-ex-hint", "idCom", "idEx", onIdExamenPick, false);

  // Cambio de modo (texto / id)
  $$("#buscar-modo button").forEach(b => b.addEventListener("click", () => {
    BUSCAR.modo = b.dataset.v;
    $("#buscar-texto-panel").classList.toggle("hidden", BUSCAR.modo !== "texto");
    $("#buscar-id-panel").classList.toggle("hidden", BUSCAR.modo !== "id");
    pintarBuscar();
  }));

  // Modo TEXTO
  $("#buscar-q").addEventListener("input", buscarPorTexto);
  // El handler global de .seg actualiza ".on" durante el bubbling; diferimos con
  // queueMicrotask para leer ya el grupo correcto.
  $$("#buscar-grupo button").forEach(b => b.addEventListener("click", () => queueMicrotask(() => {
    BUSCAR.tema = null; construirListaTemas(); buscarPorTexto();
  })));
  $("#buscar-tema-q").addEventListener("input", construirListaTemas);
  ["buscar-falladas", "buscar-guardadas"].forEach(id => $("#" + id).addEventListener("change", buscarPorTexto));

  // Modo ID: el número de pregunta
  $("#bid-numero").addEventListener("input", buscarPorId);

  // Practicar los resultados actuales
  $("#buscar-practicar").onclick = () => {
    if (BUSCAR.ultimos && BUSCAR.ultimos.length) iniciarSesion(barajar(BUSCAR.ultimos));
  };
}

function onTextoComChange() {
  BUSCAR.ex = "";
  construirChipsExamen("#buscar-ex-chips", "#buscar-ex-hint", "com", "ex", buscarPorTexto, true);
  buscarPorTexto();
}
function onIdComChange() {
  BUSCAR.idEx = "";
  $("#bid-numero").value = ""; $("#bid-numero").disabled = true; actualizarHintNumero(null);
  construirChipsExamen("#bid-ex-chips", "#bid-ex-hint", "idCom", "idEx", onIdExamenPick, false);
  buscarPorId();
}
function onIdExamenPick() {
  const ex = EXAMEN[BUSCAR.idEx];
  const num = $("#bid-numero");
  num.value = "";
  num.disabled = !ex;
  if (ex) { num.max = ex.n || 200; num.placeholder = `Del 1 al ${ex.n}`; }
  else num.placeholder = "Ej. 12";
  actualizarHintNumero(ex);
  buscarPorId();
}

// Año del examen para mostrar (los que no tienen año salen como "S/A").
function anioExamenTxt(e) { return e.anio == null ? "S/A" : e.anio; }
// Nombre del examen limpio (sin la coletilla "(TOPO Enfermero)").
function nombreExamen(e) { return (e.nombre || "").replace(/\s*\(TOPO Enfermero\)/i, ""); }
// Nombre del examen sin el prefijo de comunidad (para los chips).
function examenCorto(e) { return nombreExamen(e).replace(/^[^·]*·\s*/, ""); }
// Ordena exámenes por año descendente; los sin año van al final.
function ordenExamenes(a, b) { return (b.anio || 0) - (a.anio || 0); }
// Pista del paso 3: indica cuántas preguntas tiene el examen elegido.
function actualizarHintNumero(ex) {
  const el = $("#bid-num-hint"); if (!el) return;
  el.textContent = ex ? `Este examen tiene ${ex.n} preguntas (escribe del 1 al ${ex.n}).` : "";
}

// Chips de comunidad (estilo botón). multi=true permite varias (modo texto);
// "Todas" = sin filtro (lleva la bandera de España).
function construirChipsComunidad(contSel, campo, onChange, multi, state = BUSCAR) {
  const cont = $(contSel); if (!cont) return;
  cont.innerHTML = "";
  const isOn = val => multi
    ? (val === "" ? state[campo].size === 0 : state[campo].has(val))
    : state[campo] === val;
  const mk = (val, label) => {
    const b = document.createElement("button");
    b.dataset.val = val;
    b.className = "chip-flag" + (isOn(val) ? " on" : "");
    b.innerHTML = `<span class="cf">${bandera(val || "España", 22, 15)}</span><span>${label}</span>`;
    b.onclick = () => {
      if (multi) {
        if (val === "") state[campo].clear();
        else if (state[campo].has(val)) state[campo].delete(val);
        else state[campo].add(val);
      } else state[campo] = val;
      [...cont.children].forEach(c => c.classList.toggle("on", isOn(c.dataset.val)));
      onChange();
    };
    return b;
  };
  cont.appendChild(mk("", "Todas"));
  COMUNIDADES.forEach(c => cont.appendChild(mk(c, c)));
}

// Chips de examen de la comunidad elegida. incluirTodos añade un chip "Todos".
// Solo se muestran si hay exactamente una comunidad seleccionada.
function construirChipsExamen(contSel, hintSel, campoCom, campoEx, onChange, incluirTodos, state = BUSCAR) {
  const cont = $(contSel); if (!cont) return;
  const hint = hintSel ? $(hintSel) : null;
  cont.innerHTML = "";
  const sel = state[campoCom];
  const varias = sel instanceof Set && sel.size > 1;
  const com = sel instanceof Set ? (sel.size === 1 ? [...sel][0] : "") : sel;
  if (!com) {
    cont.classList.add("hidden");
    if (hint) hint.textContent = varias
      ? "Para filtrar por examen, elige una sola comunidad."
      : "Elige una comunidad para ver sus exámenes.";
    state[campoEx] = "";
    return;
  }
  cont.classList.remove("hidden");
  if (hint) hint.textContent = "";
  const exs = DB.examenes.filter(e => e.comunidad === com).sort(ordenExamenes);
  const mk = (val, label) => {
    const b = document.createElement("button");
    b.dataset.val = val;
    b.className = state[campoEx] === val ? "on" : "";
    b.textContent = label;
    b.onclick = () => {
      state[campoEx] = val;
      [...cont.children].forEach(c => c.classList.toggle("on", c.dataset.val === val));
      onChange();
    };
    return b;
  };
  if (incluirTodos) cont.appendChild(mk("", "Todos"));
  exs.forEach(e => cont.appendChild(mk(e.id, `${anioExamenTxt(e)} · ${examenCorto(e)} · ${e.n}p`)));
}

// Lista de temas filtrable (botones), según parte del temario y texto del filtro.
function construirListaTemas() {
  const cont = $("#buscar-tema-list"); if (!cont) return;
  const grupo = segValor("buscar-grupo");
  const q = normaliza(($("#buscar-tema-q").value || "").trim());
  const temas = DB.temas
    .filter(t => grupo === "todo" || t.grupo === (grupo === "comun" ? "comun" : "especifico"))
    .filter(t => !q || normaliza(t.id + ". " + t.nombre).includes(q));
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
  cont.appendChild(mk("", `<b>Todos los temas</b>`));
  temas.forEach(t => {
    const row = mk(t.id, `<span class="tnum">${t.id}.</span> <span class="tnom"></span>`);
    row.querySelector(".tnom").textContent = t.nombre;
    cont.appendChild(row);
  });
}

function buscarPorTexto() {
  const q = normaliza($("#buscar-q").value.trim());
  const grupo = segValor("buscar-grupo");
  const coms = BUSCAR.com; // Set de comunidades (vacío = todas)
  const exId = BUSCAR.ex;
  const temaId = BUSCAR.tema;
  const soloFall = $("#buscar-falladas").checked;
  const soloGuard = $("#buscar-guardadas").checked;
  const hayFiltro = q || grupo !== "todo" || coms.size || exId || temaId != null || soloFall || soloGuard;

  if (!hayFiltro) {
    renderResultadosBuscar([], "Escribe una palabra o usa los filtros para buscar entre las " + DB.preguntas.length + " preguntas.");
    return;
  }
  const res = DB.preguntas.filter(p => {
    if (grupo === "comun" && !esComun(p)) return false;
    if (grupo === "especifico" && !esEspecifico(p)) return false;
    if (coms.size && !coms.has(comunidadDe(p))) return false;
    if (exId && p.ex !== exId) return false;
    if (temaId != null && p.t !== temaId) return false;
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

function buscarPorId() {
  const exId = BUSCAR.idEx;
  const numStr = $("#bid-numero").value.trim();
  if (!BUSCAR.idCom) { renderResultadosBuscar([], "Elige comunidad, examen y número de pregunta."); return; }
  if (!exId) { renderResultadosBuscar([], "Ahora elige el examen."); return; }
  if (!numStr) { renderResultadosBuscar([], "Escribe el número de pregunta."); return; }
  const n = parseInt(numStr, 10);
  const res = DB.preguntas.filter(p => p.ex === exId && p.n === n);
  if (!res.length) { renderResultadosBuscar([], `No hay pregunta nº ${n} en ese examen.`); return; }
  renderResultadosBuscar(res);
}

function renderResultadosBuscar(lista, mensajeVacio) {
  BUSCAR.ultimos = lista;
  const cont = $("#buscar-resultados");
  const info = $("#buscar-info");
  const btn = $("#buscar-practicar");
  cont.innerHTML = "";
  if (!lista.length) {
    info.textContent = mensajeVacio || "Sin resultados.";
    btn.style.display = "none";
    return;
  }
  const total = lista.length;
  const mostrados = lista.slice(0, BUSCAR.MAX);
  info.textContent = total > BUSCAR.MAX
    ? `${total} resultados · mostrando ${BUSCAR.MAX} (afina la búsqueda)`
    : `${total} resultado${total !== 1 ? "s" : ""}`;
  btn.style.display = "block";
  btn.textContent = `🎲 Practicar ${total} resultado${total !== 1 ? "s" : ""}`;
  const card = document.createElement("div"); card.className = "card";
  mostrados.forEach((q, idx) => card.appendChild(tarjetaPregunta(q, idx, { soloLectura: true })));
  cont.appendChild(card);
}

/* ============ Historial simulacros ============ */
function pintarHistorialSim() {
  initSimReal();
  actualizarPoolSim();
  const cont = $("#sim-historial");
  if (!ST.simulacros.length) { cont.innerHTML = '<div class="mini">Aún no has hecho ningún simulacro.</div>'; return; }
  let html = '<table class="stats-tabla"><tr><th>Fecha</th><th>Preg.</th><th>✓</th><th>✗</th><th>Nota</th></tr>';
  [...ST.simulacros].reverse().forEach(s => {
    const f = new Date(s.ts).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    html += `<tr><td>${f}</td><td>${s.n}</td><td>${s.ok}</td><td>${s.mal}</td><td><b>${s.nota.toFixed(2)}</b></td></tr>`;
  });
  cont.innerHTML = html + "</table>";
}

/* ============ Estadísticas ============ */
function pintarStats() {
  const cont = $("#stats-content");
  const ats = ST.attempts;
  const qids = Object.keys(ats);
  let tot = 0, ok = 0;
  const porTema = {}, porCom = {}, porDia = {};
  qids.forEach(qid => {
    const q = PREGUNTA[qid]; if (!q) return;
    ats[qid].forEach(([ts, acierto]) => {
      tot++; ok += acierto;
      const dia = new Date(ts).toISOString().slice(0, 10);
      (porDia[dia] = porDia[dia] || [0, 0])[0]++;
      porDia[dia][1] += acierto;
      if (q.t != null) {
        (porTema[q.t] = porTema[q.t] || [0, 0])[0]++;
        porTema[q.t][1] += acierto;
      }
      const c = comunidadDe(q);
      (porCom[c] = porCom[c] || [0, 0])[0]++;
      porCom[c][1] += acierto;
    });
  });

  if (!tot) {
    cont.innerHTML = '<div class="card"><p>Todavía no has respondido ninguna pregunta. ¡Empieza una práctica!</p></div>';
    return;
  }

  const pct = x => Math.round(100 * x);
  const nFalladas = DB.preguntas.filter(q => fallada(q.id)).length;
  const totalDisponibles = DB.preguntas.filter(q => !q.dup && q.r).length;
  const vistas = qids.filter(id => PREGUNTA[id]).length;

  let html = `<div class="card"><h3>Resumen</h3><div class="stat-grid">
    <div class="stat-box"><b>${tot}</b><span>respuestas dadas</span></div>
    <div class="stat-box"><b>${pct(ok / tot)}%</b><span>acierto global</span></div>
    <div class="stat-box"><b>${vistas}/${totalDisponibles}</b><span>preguntas vistas</span></div>
    <div class="stat-box"><b>${nFalladas}</b><span>pendientes de repasar</span></div>
  </div>
  <button class="btn primary" id="btn-repasar" ${nFalladas ? "" : "disabled"}>🔁 Repasar las ${nFalladas} falladas</button>
  </div>`;

  // 2) Actividad reciente (últimos 14 días)
  const dias = Object.keys(porDia).sort().slice(-14);
  html += `<div class="card"><h3>Actividad reciente</h3>`;
  const maxDia = Math.max(...dias.map(d => porDia[d][0]));
  dias.forEach(d => {
    const [n, a] = porDia[d];
    const fecha = new Date(d + "T12:00").toLocaleDateString("es-ES", { weekday: "short", day: "2-digit", month: "short" });
    html += `<div class="tema-stat"><div class="fila"><span>${fecha} — ${n} preguntas</span>
      <span class="pct">${pct(a / n)}%</span></div>
      <div class="barra"><div style="width:${pct(n / maxDia)}%;background:var(--azul)"></div></div></div>`;
  });
  html += `</div>`;

  // 3) Por comunidad autónoma (con banderita), más respondidas primero
  html += `<div class="card"><h3>Por comunidad autónoma</h3>`;
  Object.entries(porCom).sort((a, b) => b[1][0] - a[1][0]).forEach(([c, [n, a]]) => {
    const p = a / n;
    const col = p >= .7 ? "var(--ok)" : p >= .5 ? "var(--aviso)" : "var(--mal)";
    html += `<div class="tema-stat"><div class="fila" style="align-items:center;gap:10px;">
        <span class="com-stat-nombre"><span class="com-stat-flag">${bandera(c)}</span><b>${c}</b></span>
        <span class="pct" style="color:${col}">${pct(p)}%</span></div>
      <div class="mini">${n} respuesta${n !== 1 ? "s" : ""}</div>
      <div class="barra"><div style="width:${pct(p)}%;background:${col}"></div></div></div>`;
  });
  html += `</div>`;

  // 4) Aciertos por parte del temario (común / específico)
  html += `<div class="card"><h3>Aciertos por parte del temario</h3>${htmlCapTemario()}</div>`;

  // 5) Por tema (más flojos primero)
  const temasOrd = Object.entries(porTema)
    .map(([t, [n, a]]) => ({ t: +t, n, p: a / n }))
    .sort((x, y) => x.p - y.p || y.n - x.n);
  html += `<div class="card"><h3>Por tema (los más flojos primero)</h3>`;
  temasOrd.forEach(({ t, n, p }) => {
    const tema = TEMA[t];
    const col = p >= .7 ? "var(--ok)" : p >= .5 ? "var(--aviso)" : "var(--mal)";
    html += `<div class="tema-stat"><div style="display:flex;gap:10px;align-items:center;">
      <div style="flex:1;min-width:0;">
        <div class="fila">
          <span><b>${t}.</b> ${tema ? tema.nombre.slice(0, 90) : "?"}</span>
          <span class="pct" style="color:${col}">${pct(p)}%</span></div>
        <div class="mini">${n} respuestas</div>
        <div class="barra"><div style="width:${pct(p)}%;background:${col}"></div></div>
      </div>
      <button class="btn btn-practicar-tema" data-tema="${t}"
        style="width:auto;margin:0;font-size:.78rem;padding:6px 10px;flex-shrink:0;">Practicar</button>
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

/* ============ Ajustes ============ */
$("#btn-export").onclick = () => {
  const blob = new Blob([JSON.stringify(ST, null, 1)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `progreso-ope-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
};
$("#btn-import").onclick = () => $("#file-import").click();
$("#file-import").onchange = ev => {
  const f = ev.target.files[0]; if (!f) return;
  f.text().then(txt => {
    try {
      const data = JSON.parse(txt);
      if (!data.attempts) throw new Error("formato");
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
      if (data.comunidad) ST.comunidad = data.comunidad;
      guardar(); actualizarEtiquetasComunidad();
      alert("Progreso importado correctamente.");
      pintarStats();
    } catch { alert("El fichero no parece un progreso válido."); }
  });
};
$("#btn-reset").onclick = () => {
  if (!confirm("¿Seguro? Se borrará TODO tu historial de aciertos, errores y simulacros.")) return;
  ST.attempts = {}; ST.simulacros = []; ST.simUsadas = []; ST.marcadas = [];
  guardar(); borrarQuizGuardado(); alert("Progreso borrado.");
};

function pintarDbInfo() {
  const nQ = DB.preguntas.length;
  const nDup = DB.preguntas.filter(q => q.dup).length;
  const nAnul = DB.preguntas.filter(q => !q.r).length;
  $("#db-info").innerHTML = `Versión de la base de datos: <b>${DB.version}</b><br>
    ${nQ} preguntas · ${DB.examenes.length} exámenes · ${COMUNIDADES.length} comunidades<br>
    ${nDup} duplicadas (ocultas por defecto) · ${nAnul} anuladas`;
  $("#topbar-info").innerHTML = `🔥 <span>${calcularRacha()}</span>`;
  const cicloEl = $("#sim-ciclo-info");
  if (cicloEl) cicloEl.textContent = `${ST.simUsadas.length} preguntas ya usadas en simulacros anteriores`;
  pintarAjustesComunidad();
}

// Selector de comunidad en Ajustes, con banderas (chips).
function pintarAjustesComunidad() {
  const cont = $("#ajustes-comunidad");
  if (!cont) return;
  const actual = comunidadPrincipal();
  const lista = [COMUNIDAD_TODAS, ...COMUNIDADES_OPOSICION.filter(c => c !== COMUNIDAD_TODAS)];
  cont.innerHTML = "";
  lista.forEach(c => {
    const b = document.createElement("button");
    b.className = "com-flag" + (c === actual ? " on" : "");
    b.innerHTML = `${bandera(c, 26, 18)}<span>${c === COMUNIDAD_TODAS ? "España (todas)" : c}</span>`;
    b.onclick = () => {
      ST.comunidad = c; guardar();
      actualizarEtiquetasComunidad(); actualizarPoolSim();
      pintarAjustesComunidad();
    };
    cont.appendChild(b);
  });
}

/* ============ Simulacros — reiniciar ciclo y fecha examen ============ */
$("#btn-reiniciar-ciclo").onclick = () => {
  if (!confirm(`¿Reiniciar el ciclo? Las ${ST.simUsadas.length} preguntas ya usadas volverán a estar disponibles en simulacros.`)) return;
  ST.simUsadas = []; guardar(); pintarDbInfo();
  actualizarPoolSim();
  alert("Ciclo de simulacros reiniciado.");
};

$("#fecha-examen").addEventListener("change", () => {
  ST.examenFecha = $("#fecha-examen").value || null;
  guardar();
});


/* ============ SRS — repaso espaciado (de TODAS las preguntas, no solo fallos) ============ */
const INTERVALOS_SRS = [1, 3, 7, 15, 30];

// Aciertos consecutivos al final del historial (0 si el último intento fue fallo).
function rachaAciertos(qid) {
  const ats = ST.attempts[qid] || [];
  let s = 0;
  for (let i = ats.length - 1; i >= 0; i--) { if (ats[i][1] === 1) s++; else break; }
  return s;
}
// "Aprendida" = acertada al menos 2 veces seguidas (consolidada en memoria).
function aprendida(qid) { return rachaAciertos(qid) >= 2; }

// Próxima revisión: toda pregunta vista entra en el ciclo; el intervalo crece
// con los aciertos seguidos (1→3→7→15→30 días) y un fallo lo reinicia.
function srsProxima(qid) {
  const ats = ST.attempts[qid] || [];
  if (!ats.length) return null; // nunca vista: la cubre el ritmo de "nuevas"
  const s = rachaAciertos(qid);
  const intervalo = s === 0 ? 1 : INTERVALOS_SRS[Math.min(s - 1, INTERVALOS_SRS.length - 1)];
  return ats[ats.length - 1][0] + intervalo * 86400000;
}

function srsDueHoy() {
  const now = Date.now();
  return DB.preguntas.filter(q => {
    if (!q.r || q.dup) return false;
    const prox = srsProxima(q.id);
    return prox !== null && prox <= now;
  });
}

/* ============ Plan diario adaptativo ============ */
// Universo de estudio: preguntas relevantes para tu comunidad (común de tu
// comunidad + específico de todas), sin filtros extra. Es lo que hay que "saberse".
function universoEstudio() {
  return poolPractica({
    comunidades: new Set(COMUNIDADES), temas: new Set(),
    falladas: false, marcadas: false, nuevas: false,
    comunOtras: false, dups: false, anuladas: false
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
// Analiza las estadísticas y diseña el plan de hoy.
function planDiario() {
  const universo = universoEstudio();
  const ids = new Set(universo.map(q => q.id));
  const nuevas = universo.filter(q => !vista(q.id));
  const due = srsDueHoy().filter(q => ids.has(q.id));
  const dias = diasHastaExamen();
  const nuevasPorDia = nuevas.length ? Math.ceil(nuevas.length / dias) : 0;
  // Meta = ritmo para verlo todo + repasos que tocan hoy, con un MÍNIMO de 30/día
  // (la idea no es solo verlas, es aprenderlas con repetición).
  const RITMO_MINIMO = 30;
  const meta = Math.max(RITMO_MINIMO, Math.min(80, nuevasPorDia + due.length));
  return {
    universo, total: universo.length, vistas: universo.length - nuevas.length,
    nuevas, due, dias, nuevasPorDia, meta, hechoHoy: preguntasHechasHoy()
  };
}
// Construye la sesión del día como MEZCLA nuevas + repaso (para aprenderlas):
// 1) repasos espaciados que tocan hoy, 2) preguntas nuevas al ritmo de cobertura,
// 3) refuerzo de lo ya visto (falladas primero), 4) más nuevas si falta material.
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
  take(barajar(p.due), total);                                            // 1) repaso espaciado
  take(barajar(p.nuevas), p.nuevasPorDia);                                // 2) cobertura nueva (al ritmo)
  take(barajar(p.universo.filter(q => fallada(q.id))), total);            // 3) refuerzo: falladas
  take(barajar(p.universo.filter(q => vista(q.id))), total);             // 3b) refuerzo: ya vistas
  take(barajar(p.nuevas), total);                                         // 4) más nuevas si falta material
  return barajar(pool);
}
function iniciarSesion(pool) {
  if (!pool || !pool.length) { verVista("practica"); return; }
  pool = construirLista(pool, false, 0); // respeta el orden recibido; agrupa casos consecutivos
  QUIZ.activo = true; QUIZ.modo = "practica"; QUIZ.lista = pool;
  QUIZ.i = 0; QUIZ.respuestas = {};
  $("#quiz-timer").classList.add("hidden"); $("#quiz-mapa").classList.add("hidden");
  verVista("quiz"); pintarPregunta();
}

// Previsión de cara al examen según tu ritmo real (últimos 7 días).
function pronostico(plan) {
  const p = plan || planDiario();
  const total = p.total || 1;
  const ids = new Set(p.universo.map(q => String(q.id)));
  const hace7 = Date.now() - 7 * 86400000;
  let nuevas7 = 0;
  Object.keys(ST.attempts).forEach(qid => {
    if (!ids.has(String(qid))) return;
    const a = ST.attempts[qid];
    if (a && a.length && a[0][0] >= hace7) nuevas7++; // primera vez vista en los últimos 7 días
  });
  const ritmoNuevas = nuevas7 / 7;
  const aprendidas = p.universo.filter(q => aprendida(q.id)).length;
  const coberturaPct = Math.round(p.vistas / total * 100);
  const dominioPct = Math.round(aprendidas / total * 100);
  const restantes = p.nuevas.length;
  const diasCubrir = ritmoNuevas > 0 ? Math.ceil(restantes / ritmoNuevas) : Infinity;
  const margen = p.dias - diasCubrir;
  let estado, tono;
  if (restantes === 0) { estado = "¡Ya has visto todo el temario! Ahora a consolidarlo con el repaso."; tono = "ok"; }
  else if (ritmoNuevas <= 0) { estado = `Aún sin ritmo medible. Con ${p.nuevasPorDia}/día nuevas llegas al examen habiéndolo visto todo.`; tono = "info"; }
  else if (margen >= 0) { estado = `Vas a buen ritmo: a este paso verás todo el temario ~${margen} día${margen !== 1 ? "s" : ""} antes del examen. ✅`; tono = "ok"; }
  else { const faltan = Math.max(0, restantes - Math.floor(ritmoNuevas * p.dias)); estado = `Vas algo justo: a este ritmo te quedarían ~${faltan} preguntas sin ver. Sube a ${p.nuevasPorDia}/día. ⚠️`; tono = "warn"; }
  return { coberturaPct, dominioPct, ritmoNuevas, estado, tono };
}

/* ============ Autoguardado del quiz en curso ============ */
const LS_QUIZ_KEY = "opeurg_quiz_v1";

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

/* ============ Racha de días ============ */
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

/* ============ Aciertos por parte del temario (común / específico) ============ */
function htmlCapTemario() {
  let comN = 0, comOk = 0, espN = 0, espOk = 0;
  Object.keys(ST.attempts).forEach(qid => {
    const q = PREGUNTA[qid]; if (!q || q.t == null) return;
    ST.attempts[qid].forEach(([, a]) => {
      if (esComun(q)) { comN++; comOk += a; } else { espN++; espOk += a; }
    });
  });
  if (!comN && !espN) return "";
  const row = (label, n, ok) => {
    if (!n) return `<div class="cap-row"><div class="cap-head"><span><b>${label}</b></span>
      <span class="mini">sin respuestas todavía</span></div></div>`;
    const p = Math.round(100 * ok / n);
    const col = p >= 70 ? "var(--ok)" : p >= 50 ? "var(--aviso)" : "var(--mal)";
    return `<div class="cap-row"><div class="cap-head"><span><b>${label}</b></span>
      <span class="cap-pct" style="color:${col}">${p}%</span></div>
      <div class="barra"><div style="width:${p}%;background:${col};height:100%;border-radius:4px;"></div></div>
      <div class="mini">${n} respuestas · ${ok} aciertos</div></div>`;
  };
  return row("Temario común", comN, comOk) + row("Temario específico", espN, espOk);
}

/* ============ Gráfica SVG de evolución de simulacros ============ */
function svgSimulacros(sims) {
  const W = 560, H = 90, base = 110, n = sims.length;
  const slot = W / n;
  const barW = Math.min(46, slot * 0.5);
  const y5 = base - 0.5 * H; // línea de aprobado (nota 5 sobre 10)
  let bars = "";
  sims.forEach((s, i) => {
    const cx = slot * i + slot / 2;
    const h = Math.max(3, s.nota / 10 * H);
    const y = base - h;
    const aprob = s.nota >= 5;
    const fill = aprob ? "#5DCAA5" : "#F09595";
    const txt = aprob ? "var(--ok)" : "var(--mal)";
    const f = new Date(s.ts).toLocaleDateString("es-ES", { day: "2-digit", month: "short" });
    bars += `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${fill}"/>
      <text x="${cx.toFixed(1)}" y="${(y - 6).toFixed(1)}" font-size="13" text-anchor="middle" font-weight="700" style="fill:${txt}">${s.nota.toFixed(2)}</text>
      <text x="${cx.toFixed(1)}" y="${(base + 17).toFixed(1)}" font-size="11" text-anchor="middle" style="fill:var(--texto-suave)">${f}</text>`;
  });
  return `<svg viewBox="0 0 ${W} 135" width="100%" role="img" aria-label="Evolución de las notas de simulacros, con línea de aprobado en 5">
    <line x1="0" y1="${y5}" x2="${W}" y2="${y5}" stroke-width="1" stroke-dasharray="5 5" style="stroke:var(--texto-suave)"/>
    ${bars}
  </svg>`;
}

/* ============ Configuración inicial desde el Home ============ */
function guardarSetupInicio() {
  // Si no elige nada, por defecto España (incluye todas las comunidades).
  ST.comunidad = $("#setup-comunidad").value || COMUNIDAD_TODAS;
  ST.examenFecha = $("#setup-fecha").value || fechaMas1Anio();
  guardar();
  actualizarEtiquetasComunidad();
  const fe = $("#fecha-examen"); if (fe) fe.value = ST.examenFecha;
  pintarInicio();
}

/* ============ Pantalla Inicio ============ */
function pintarInicio() {
  // Saludo y fecha
  const hora = new Date().getHours();
  const racha = calcularRacha();
  $("#inicio-saludo").textContent =
    hora < 7 ? "¡Buenas noches! 👋" : hora < 14 ? "¡Buenos días! 👋" : hora < 21 ? "¡Buenas tardes! 👋" : "¡Buenas noches! 👋";
  const fechaTxt = new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
  const fechaCap = fechaTxt.charAt(0).toUpperCase() + fechaTxt.slice(1);
  $("#inicio-fecha").textContent = racha > 0
    ? `${fechaCap} · sigue tu racha de ${racha} día${racha !== 1 ? "s" : ""}`
    : `${fechaCap} · empieza hoy tu racha`;
  // Chip de racha en la barra superior
  $("#topbar-info").innerHTML = `🔥 <span>${racha}</span>`;
  // Bandera de la comunidad junto al saludo
  $("#inicio-bandera").innerHTML = ST.comunidad ? bandera(comunidadPrincipal()) : "";

  // Tarjeta de configuración inicial (comunidad + fecha). Se oculta al elegir comunidad.
  const setup = $("#inicio-setup");
  if (setup) {
    if (!ST.comunidad) {
      poblarSelectComunidades($("#setup-comunidad"), "", "— Elige tu comunidad —");
      $("#setup-fecha").value = ST.examenFecha || fechaMas1Anio();
      setup.classList.remove("hidden");
    } else setup.classList.add("hidden");
  }

  // Plan adaptativo del día (lo usan el objetivo y la cuenta atrás)
  const plan = planDiario();

  // Cuenta atrás (tarjeta grande al final)
  const cdEl = $("#inicio-countdown");
  if (cdEl) {
    const dias = diasHastaExamen();
    if (ST.examenFecha && dias > 0) {
      cdEl.innerHTML = `<div class="cd-ico">📅</div>
        <div>
          <div class="cd-num">Faltan ${dias} día${dias !== 1 ? "s" : ""}</div>
          <div class="cd-sub">Ritmo: ${plan.meta} preguntas/día para llegar al examen</div>
        </div>`;
      cdEl.classList.remove("hidden");
    } else cdEl.classList.add("hidden");
  }

  // Indicadores (se calculan primero: alimentan el anillo y los chips)
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

  // Tarjeta de objetivo del día — plan adaptativo según tus estadísticas
  const META = plan.meta;
  const hechoHoy = Math.min(pregHoy, META);
  const R = 34, C = 2 * Math.PI * R;
  const off = C * (1 - hechoHoy / META);
  const faltan = Math.max(0, META - pregHoy);
  const objTxt = faltan > 0
    ? `${faltan} pregunta${faltan !== 1 ? "s" : ""} para tu meta`
    : "¡Meta de hoy completada! ✓";
  const sesion = sesionDiaria(plan);
  const nuevasEnSesion = sesion.filter(q => !vista(q.id)).length;
  const repasoEnSesion = sesion.length - nuevasEnSesion;
  const desglose = `${nuevasEnSesion} nueva${nuevasEnSesion !== 1 ? "s" : ""} + ${repasoEnSesion} repaso · te faltan ${plan.nuevas.length} por ver`;
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
      <div class="obj-label">Objetivo de hoy</div>
      <div class="obj-meta">${objTxt}</div>
      <div class="obj-desglose">${desglose}</div>
      <button class="btn primary" id="btn-repaso-dia">${faltan > 0 ? "Estudiar hoy" : "Repaso extra"} · ${sesion.length} preg.</button>
    </div>`;
  $("#btn-repaso-dia").onclick = () => iniciarSesion(sesion);

  // Previsión de cara al examen (solo si ya has empezado a estudiar)
  const prevEl = $("#inicio-prevision");
  if (prevEl) {
    if (plan.vistas > 0) {
      const pr = pronostico(plan);
      prevEl.innerHTML = `
        <div class="prev-titulo">📈 Previsión para el examen</div>
        <div class="prev-estado prev-${pr.tono}">${pr.estado}</div>
        <div class="prev-barras">
          <div class="prev-b"><div class="prev-b-top"><span>Temario visto</span><b>${pr.coberturaPct}%</b></div><div class="barra"><div style="width:${pr.coberturaPct}%;background:var(--azul-claro)"></div></div></div>
          <div class="prev-b"><div class="prev-b-top"><span>Aprendido</span><b>${pr.dominioPct}%</b></div><div class="barra"><div style="width:${pr.dominioPct}%;background:var(--ok)"></div></div></div>
        </div>`;
      prevEl.classList.remove("hidden");
    } else prevEl.classList.add("hidden");
  }

  // Continuar quiz guardado
  const saved = cargarQuizGuardado();
  const contEl = $("#inicio-continuar");
  if (saved && saved.lista && saved.lista.length) {
    const restante = saved.fin ? Math.max(0, saved.fin - Date.now()) : null;
    const minText = restante ? ` · quedan ${Math.ceil(restante / 60000)} min` : "";
    contEl.innerHTML = `<div style="flex:1"><b>${saved.modo === "simulacro" ? "Simulacro" : "Práctica"} a medias</b>
      <div class="mini">Pregunta ${saved.i + 1} de ${saved.lista.length}${minText}</div></div>
      <button class="btn primary" id="btn-reanudar" style="width:auto;margin:0;">Continuar</button>`;
    contEl.classList.remove("hidden");
    $("#btn-reanudar").onclick = reanudarQuiz;
  } else contEl.classList.add("hidden");

  // Chips de estadísticas (2×2 con iconos)
  const chip = (ico, val, label, color) =>
    `<div class="stat-box"><div class="stat-top"><span class="stat-ico">${ico}</span>` +
    `<b style="color:${color}">${val}</b></div><span>${label}</span></div>`;
  $("#inicio-stats-grid").innerHTML =
    chip("🔥", racha, racha === 1 ? "Día de racha" : "Días de racha", "var(--aviso)") +
    chip("✅", pregHoy, "Preguntas hoy", "var(--ok)") +
    chip("🎯", tot7 ? Math.round(100 * ok7 / tot7) + "%" : "—", "Aciertos 7 días", "var(--azul-claro)") +
    chip("🏆", ultSim ? ultSim.nota.toFixed(2).replace(".", ",") : "—", "Último simulacro", "var(--morado)");

  // Banner de preguntas guardadas (marcadas con 🚩) — se revisan desde aquí
  const guardEl = $("#inicio-guardadas");
  if (guardEl) {
    const guardadas = (ST.marcadas || []).map(id => PREGUNTA[id]).filter(Boolean);
    const ng = guardadas.length;
    if (ng) {
      guardEl.innerHTML = `<div class="guard-head">
          <div class="guard-ico">🚩</div>
          <div style="flex:1;min-width:0;">
            <b>${ng} pregunta${ng !== 1 ? "s" : ""} guardada${ng !== 1 ? "s" : ""}</b>
            <div class="mini" style="margin:2px 0 0;">Toca para revisar o practicar</div>
          </div>
        </div>
        <div class="guard-actions hidden">
          <button class="btn" id="btn-guard-revisar">📖 Revisar</button>
          <button class="btn" id="btn-guard-practicar">🎲 Practicar</button>
        </div>`;
      const gHead = guardEl.querySelector(".guard-head");
      const gActions = guardEl.querySelector(".guard-actions");
      gHead.onclick = () => { gActions.classList.toggle("hidden"); guardEl.classList.toggle("abierto"); };
      guardEl.querySelector("#btn-guard-revisar").onclick = () => verRevisionGuardadas(guardadas);
      guardEl.querySelector("#btn-guard-practicar").onclick = () => iniciarSesion(barajar(guardadas));
      guardEl.classList.remove("hidden", "abierto");
    } else guardEl.classList.add("hidden");
  }

  // Temas más flojos en el Inicio: solo los 2 peores (mínimo 3 respuestas)
  // para no alargar la pantalla. El detalle completo está en Estadísticas.
  const porTema = {};
  Object.keys(ST.attempts).forEach(qid => {
    const q = PREGUNTA[qid]; if (!q || q.t == null) return;
    ST.attempts[qid].forEach(([, a]) => {
      (porTema[q.t] = porTema[q.t] || [0, 0])[0]++;
      porTema[q.t][1] += a;
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
      const color = colorNodoTema(t).c; // mismo color que el nodo del Temario
      const row = document.createElement("div"); row.className = "flojo";
      row.innerHTML = `<div class="flojo-top">
          <span class="flojo-badge" style="background:${color}">${t}</span>
          <div class="flojo-nombre"></div>
          <span class="flojo-pct" style="color:${color}">${pct}%</span>
        </div>
        <div class="barra"><div style="width:${pct}%;background:${color}"></div></div>
        <div class="flojo-foot">
          <span class="mini" style="margin:0;">${n} respuesta${n !== 1 ? "s" : ""}</span>
          <button class="btn flojo-btn">Practicar →</button>
        </div>`;
      row.querySelector(".flojo-nombre").textContent = tema ? tema.nombre : "Tema " + t;
      row.querySelector("button").onclick = () => openTemaConfig(t);
      temasEl.appendChild(row);
    });
    temasCard.classList.remove("hidden");
  } else temasCard.classList.add("hidden");

  // Evolución de simulacros (últimos 6)
  const simsCard = $("#inicio-sims-card");
  const sims = ST.simulacros.slice(-6);
  if (sims.length >= 2) {
    $("#inicio-sims").innerHTML = svgSimulacros(sims) +
      `<div class="mini" style="margin-top:6px">Últimos ${sims.length} simulacros · nota sobre 10 · línea discontinua = aprobado (5)</div>`;
    simsCard.classList.remove("hidden");
  } else simsCard.classList.add("hidden");
}

/* ============ Atajos de teclado (escritorio) ============ */
document.addEventListener("keydown", ev => {
  if (!QUIZ.activo || $("#view-quiz").classList.contains("hidden")) return;
  if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
  if (ev.target instanceof Element && ev.target.matches("input, textarea, select")) return;
  const k = ev.key;
  const letra = k.length === 1 ? k.toUpperCase() : "";
  if (["A", "B", "C", "D"].includes(letra)) {
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

/* ============ Service worker + aviso de actualización ============ */
function mostrarAvisoActualizar() {
  const b = $("#update-banner");
  if (b) b.classList.remove("hidden");
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("sw.js").then(reg => {
    // Si ya hay una versión esperando al cargar
    if (reg.waiting && navigator.serviceWorker.controller) mostrarAvisoActualizar();
    // Detectar una versión nueva mientras la app está abierta
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
// Lightbox de imágenes (cerrar con ✕, clic en el fondo o Escape)
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
actualizarEtiquetasComunidad();
const _setupBtn = $("#setup-guardar");
if (_setupBtn) _setupBtn.onclick = guardarSetupInicio;
pintarTemario();
pintarDbInfo();
if (ST.examenFecha) $("#fecha-examen").value = ST.examenFecha;
verVista("inicio");
