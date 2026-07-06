"""
Fusiona explicaciones reescritas (solo el campo "e") con el dataset de produccion
actual, IN-PLACE por id/anki -- no anade preguntas nuevas, solo sustituye "e" en
las que ya existen.

Uso:
    python tools/merge_explanation_fixes.py [--flagged flagged.json] [--dry-run]
                                             [--base otro_dataset.json] [--glob "data/anking/_fix_batches_out_v1/*.json"]

Salida (si no es --dry-run):
    - sobrescribe --base (mismo fichero, mismo total de preguntas)
    - app/data/db.js
    - data/anking/_fix_rejected_report.json
"""
import json
import glob
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_BASE = os.path.join(ROOT, "data", "anking", "step1_dataset_3728q.json")
DEFAULT_GLOB = os.path.join(ROOT, "data", "anking", "_fix_batches_out_v1", "*.json")
OUT_DB = os.path.join(ROOT, "app", "data", "db.js")

LETTERS = ["A", "B", "C", "D"]

def validate_e(entry, orig_r):
    errs = []
    for k in ("id", "anki", "e"):
        if k not in entry:
            errs.append(f"missing field {k}")
    if errs:
        return errs
    e = entry["e"]
    if not isinstance(e, dict) or "correcta" not in e or "incorrectas" not in e:
        return ["e missing correcta/incorrectas"]
    if not isinstance(e["correcta"], str) or len(e["correcta"].strip()) < 15:
        errs.append("correcta explanation too short/missing")
    inc = e["incorrectas"]
    expected_keys = set(LETTERS) - {orig_r}
    if not isinstance(inc, dict) or set(inc.keys()) != expected_keys:
        errs.append(f"incorrectas keys {list(inc.keys()) if isinstance(inc, dict) else type(inc)} != expected {sorted(expected_keys)}")
        return errs
    for k, v in inc.items():
        if not isinstance(v, str) or len(v.strip()) < 15 or v.strip().upper() in ("N/A", "NA"):
            errs.append(f"incorrectas[{k}] too short/missing")
    if "{{c" in e["correcta"] or "}}" in e["correcta"]:
        errs.append("cloze artifact leaked into correcta")
    return errs

def main():
    dry_run = "--dry-run" in sys.argv
    flagged_path = sys.argv[sys.argv.index("--flagged") + 1] if "--flagged" in sys.argv else None
    base_path = sys.argv[sys.argv.index("--base") + 1] if "--base" in sys.argv else DEFAULT_BASE
    glob_pattern = sys.argv[sys.argv.index("--glob") + 1] if "--glob" in sys.argv else DEFAULT_GLOB

    flagged_ids = set()
    if flagged_path and os.path.exists(flagged_path):
        flagged_ids = set(x["anki"] for x in json.load(open(flagged_path, encoding="utf-8")))

    current = json.load(open(base_path, encoding="utf-8"))
    by_id = {q["id"]: q for q in current["preguntas"]}
    by_anki = {q["anki"]: q for q in current["preguntas"]}

    batch_files = sorted(glob.glob(glob_pattern))
    print(f"Base: {base_path} ({len(current['preguntas'])} preguntas)")
    print(f"Encontrados {len(batch_files)} ficheros de lote de salida ({glob_pattern})")

    updated, rejected = [], []
    touched_ids = set()
    for bf in batch_files:
        try:
            items = json.load(open(bf, encoding="utf-8"))
        except Exception as ex:
            rejected.append({"batch": bf, "anki": None, "reason": f"JSON invalido: {ex}"})
            continue
        if not isinstance(items, list):
            rejected.append({"batch": bf, "anki": None, "reason": "el fichero no contiene un array"})
            continue
        for entry in items:
            anki = entry.get("anki") if isinstance(entry, dict) else None
            eid = entry.get("id") if isinstance(entry, dict) else None
            if anki in flagged_ids:
                rejected.append({"batch": bf, "anki": anki, "reason": "marcado por QA"})
                continue
            target = by_id.get(eid) or by_anki.get(anki)
            if target is None:
                rejected.append({"batch": bf, "anki": anki, "reason": f"id/anki no encontrado en base (id={eid})"})
                continue
            if target["anki"] != anki:
                rejected.append({"batch": bf, "anki": anki, "reason": f"anki no coincide con el id (esperado {target['anki']})"})
                continue
            if target["id"] in touched_ids:
                rejected.append({"batch": bf, "anki": anki, "reason": "id ya actualizado por otro lote (duplicado)"})
                continue
            errs = validate_e(entry, target["r"])
            if errs:
                rejected.append({"batch": bf, "anki": anki, "reason": "; ".join(errs)})
                continue
            target["e"] = entry["e"]
            touched_ids.add(target["id"])
            updated.append(target["id"])

    print(f"Actualizadas: {len(updated)}")
    print(f"Rechazadas: {len(rejected)}")
    by_reason = {}
    for r in rejected:
        by_reason[r["reason"]] = by_reason.get(r["reason"], 0) + 1
    for reason, n in sorted(by_reason.items(), key=lambda x: -x[1])[:20]:
        print(f"  {n:4d}  {reason}")

    if dry_run:
        print("\n--dry-run: no se ha escrito nada.")
        return

    with open(base_path, "w", encoding="utf-8") as f:
        json.dump(current, f, ensure_ascii=False, indent=1)
    with open(OUT_DB, "w", encoding="utf-8") as f:
        f.write("window.DB = ")
        json.dump(current, f, ensure_ascii=False)
        f.write(";\n")

    rej_path = os.path.join(ROOT, "data", "anking", "_fix_rejected_report.json")
    with open(rej_path, "w", encoding="utf-8") as f:
        json.dump(rejected, f, ensure_ascii=False, indent=1)

    print(f"\nEscrito {base_path}")
    print(f"Escrito {OUT_DB}")
    print(f"Informe de rechazadas: {rej_path}")

if __name__ == "__main__":
    main()
