# -*- coding: utf-8 -*-
"""Fusiona los batches enriquecidos en ficheros MUR* finales y reconstruye db.js."""
import json, sys, subprocess
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parents[1]
ENRIQ = ROOT / 'data' / 'enriquecido'
FUENTES = ROOT / 'data' / 'fuentes'

EXAMS = [
    ('andalucia2023',  7,  'MURandalucia2023.json'),
    ('andalucia2023b', 7,  'MURandalucia2023b.json'),
    ('canarias',       28, 'MURcanarias.json'),
]

problems = []

for tag, n_batches, out_fname in EXAMS:
    batches = []
    missing = []
    for n in range(1, n_batches + 1):
        fp = ENRIQ / f'{tag}_b{n}.json'
        if fp.exists():
            data = json.load(open(fp, encoding='utf-8'))
            batches.extend(data)
        else:
            missing.append(n)

    if missing:
        problems.append(f'{tag}: missing batches {missing}')

    # Validate
    sin_exp = sum(1 for q in batches if not isinstance(q.get('explicacion'), dict))
    sin_tema = sum(1 for q in batches if not (q.get('clasificacion_temario') or {}).get('id'))
    anuladas = sum(1 for q in batches if q.get('respuesta_correcta') == 'ANULADA')

    dest = FUENTES / out_fname
    json.dump(batches, open(dest, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'{out_fname}: {len(batches)}q, sin_exp={sin_exp}, sin_tema={sin_tema}, ANULADAS={anuladas}')
    if missing:
        print(f'  WARN: missing batches {missing}')

print()
if problems:
    print('PROBLEMAS:', problems)
else:
    print('Merge OK — reconstruyendo db.js...')
    result = subprocess.run(
        [sys.executable, str(ROOT / 'tools' / 'build_db.py')],
        capture_output=True, text=True, encoding='utf-8'
    )
    print(result.stdout)
    if result.returncode != 0:
        print('ERROR build_db:', result.stderr)
