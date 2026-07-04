const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'app/data/db.js');
const raw = fs.readFileSync(dbPath, 'utf8');

const s = raw.indexOf('{');
const e = raw.lastIndexOf('}');
const prefix = raw.slice(0, s);
const suffix = raw.slice(e + 1);
const db = JSON.parse(raw.slice(s, e + 1));

const fixes = [
  {
    id: 'aragon-2024-099',
    find: 'administrar 10 mg se suero glucosado',
    replace: 'administrar 10 ml de suero glucosado',
  },
  {
    id: 'baleares-021',
    find: '0,1-0,15 mg/kg',
    replace: '0,1-0,3 mg/kg',
  },
  {
    id: 'aragon-topo-tc-029',
    find: 'Derecho necesario mínimo disponible.',
    replace: 'Derecho necesario mínimo indisponible.',
  },
];

let applied = 0;
for (const fx of fixes) {
  const q = db.preguntas.find((p) => p.id === fx.id);
  if (!q) { console.log('NO ENCONTRADA:', fx.id); continue; }
  const letra = q.r;
  const before = q.o[letra];
  if (!before.includes(fx.find)) {
    console.log('TEXTO NO COINCIDE en', fx.id, '(opcion', letra + '):', JSON.stringify(before));
    continue;
  }
  q.o[letra] = before.replace(fx.find, fx.replace);
  console.log('OK', fx.id, '(opcion', letra + ')');
  console.log('   antes:', before);
  console.log('   ahora:', q.o[letra]);
  applied++;
}

if (applied === fixes.length) {
  fs.copyFileSync(dbPath, dbPath + '.bak');
  const out = prefix + JSON.stringify(db) + suffix;
  fs.writeFileSync(dbPath, out, 'utf8');
  console.log('\nAplicadas', applied, 'correcciones. Backup en db.js.bak');
} else {
  console.log('\nNo se aplicaron cambios (solo', applied, 'de', fixes.length, 'coincidieron). Archivo intacto.');
  process.exitCode = 1;
}
