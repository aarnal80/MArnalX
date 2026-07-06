// Repairs a common LLM-output JSON bug: unescaped literal quotes used for
// emphasis inside a string value (e.g. "...the "luteal-placental shift"...").
// Walks the raw text tracking string context; when inside a string and a `"`
// is followed (after whitespace) by something other than a JSON delimiter
// (,  }  ]  :  or newline-then-one-of-those), treats it as an inline quote
// and escapes it instead of closing the string.
import fs from 'node:fs'

const file = process.argv[2]
if (!file) { console.error('usage: node repair_batch_json.mjs <file.json>'); process.exit(1) }

const raw = fs.readFileSync(file, 'utf8')

function isDelimAhead(s, i) {
  let j = i
  while (j < s.length && /\s/.test(s[j])) j++
  return j >= s.length || [',', '}', ']', ':'].includes(s[j])
}

let out = ''
let inString = false
let escaped = false
for (let i = 0; i < raw.length; i++) {
  const c = raw[i]
  if (!inString) {
    out += c
    if (c === '"') inString = true
    continue
  }
  // inString
  if (escaped) { out += c; escaped = false; continue }
  if (c === '\\') { out += c; escaped = true; continue }
  if (c === '"') {
    if (isDelimAhead(raw, i + 1)) {
      out += c
      inString = false
    } else {
      out += '\\"'
    }
    continue
  }
  out += c
}

try {
  const parsed = JSON.parse(out)
  fs.writeFileSync(file, out)
  console.log('repaired OK, entries:', Array.isArray(parsed) ? parsed.length : 'n/a')
} catch (e) {
  console.log('still broken after repair pass:', e.message)
  fs.writeFileSync(file + '.repair_attempt', out)
  console.log('wrote attempt to', file + '.repair_attempt', 'for inspection')
}
