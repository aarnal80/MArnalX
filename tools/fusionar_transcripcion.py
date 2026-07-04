# -*- coding: utf-8 -*-
"""Fusiona los bloques transcritos de un examen escaneado con su plantilla de
respuestas y genera un banco crudo data/crudos/RAW_<tag>.json con el formato:
  {id_examen, fuente, enunciado, opciones, respuesta_correcta}
Valida: numeración 1..N sin huecos ni repetidos, 4 opciones por pregunta.

Uso: python tools/fusionar_transcripcion.py ar2022 "Examen Médico Urgencia Hospitalaria Aragón 2022 (OPE 2017-19)"
"""
import json, sys, glob
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
EXT = ROOT / "data" / "extraidos"
OUT = ROOT / "data" / "crudos"
OUT.mkdir(parents=True, exist_ok=True)

tag, fuente = sys.argv[1], sys.argv[2]

qs = {}
for f in sorted(EXT.glob(f"{tag}_q_*.json")):
    for q in json.load(open(f, encoding="utf-8")):
        n = q["n"]
        if n in qs and qs[n] != q:
            # quedarse con la versión no incompleta
            if q.get("incompleta"):
                continue
        qs[n] = q

resp = json.load(open(EXT / f"{tag}_respuestas.json", encoding="utf-8"))

problemas = []
nums = sorted(qs)
esperado = list(range(1, max(nums) + 1))
faltan = sorted(set(esperado) - set(nums))
if faltan:
    problemas.append(f"FALTAN preguntas: {faltan}")
salida = []
for n in nums:
    q = qs[n]
    ops = q.get("opciones") or {}
    if sorted(ops.keys()) != ["A", "B", "C", "D"]:
        problemas.append(f"P{n}: opciones {sorted(ops.keys())}")
    if q.get("incompleta"):
        problemas.append(f"P{n}: marcada incompleta")
    r = resp.get(str(n))
    if r not in ("A", "B", "C", "D", None):
        problemas.append(f"P{n}: respuesta rara {r!r}")
    salida.append({
        "id_examen": n, "fuente": fuente,
        "enunciado": q["enunciado"].strip(),
        "opciones": {k: v.strip() for k, v in ops.items()},
        "respuesta_correcta": r,
    })

dest = OUT / f"RAW_{tag}.json"
json.dump(salida, open(dest, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{dest}: {len(salida)} preguntas, respuestas asignadas: {sum(1 for s in salida if s['respuesta_correcta'])}")
print("PROBLEMAS:" if problemas else "Sin problemas.")
for p in problemas:
    print(" -", p)
