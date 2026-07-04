const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'app/data/db.js');
const outDir = path.join(__dirname, 'batches');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

let content = fs.readFileSync(dbPath, 'utf8');
const start = content.indexOf('{');
const end = content.lastIndexOf('}');
const json = content.slice(start, end + 1);
const db = JSON.parse(json);
const preguntas = db.preguntas;

console.log('Total:', preguntas.length);

const batchSize = 150;
const batches = Math.ceil(preguntas.length / batchSize);
console.log('Batches:', batches);

for (let i = 0; i < batches; i++) {
  const batch = preguntas.slice(i * batchSize, (i + 1) * batchSize);
  const outPath = path.join(outDir, `batch_${i}.json`);
  fs.writeFileSync(outPath, JSON.stringify(batch, null, 2), 'utf8');
  process.stdout.write(`Batch ${i} saved (${batch.length} questions)\n`);
}

console.log('Done');
