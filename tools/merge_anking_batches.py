"""
Valida estructuralmente y fusiona los lotes generados en data/anking/_batches_out/
con el dataset de produccion actual (step1_dataset_1130q.json), asignando ids de
tema por nombre (reutilizando los existentes cuando el nombre coincide, creando
nuevos al final cuando no).

Uso:
    python tools/merge_anking_batches.py [--flagged flagged.json] [--dry-run]

Salida (si no es --dry-run):
    - data/anking/step1_dataset_full.json  (dataset fusionado completo)
    - app/data/db.js                        (window.DB = {...}; para servir en la app)
    - imprime un resumen + lista de anki ids descartados por validacion estructural
"""
import json
import glob
import os
import sys
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CURRENT_DATASET = os.path.join(ROOT, "data", "anking", "step1_dataset_1130q.json")
BATCHES_OUT_GLOB = os.path.join(ROOT, "data", "anking", "_batches_out", "*.json")
OUT_DATASET = os.path.join(ROOT, "data", "anking", "step1_dataset_full.json")
OUT_DB = os.path.join(ROOT, "app", "data", "db.js")

LETTERS = ["A", "B", "C", "D"]

def validate(q, seen_anki):
    errs = []
    if not isinstance(q, dict):
        return ["not a dict"]
    for k in ("anki", "q", "o", "r", "e"):
        if k not in q:
            errs.append(f"missing field {k}")
    if errs:
        return errs
    if q["anki"] in seen_anki:
        errs.append("duplicate anki id")
    o = q["o"]
    if not isinstance(o, dict) or set(o.keys()) != set(LETTERS):
        errs.append(f"o keys != A-D (got {list(o.keys()) if isinstance(o, dict) else type(o)})")
        return errs
    texts = [o[l].strip() if isinstance(o[l], str) else "" for l in LETTERS]
    if any(not t for t in texts):
        errs.append("empty option text")
    if len(set(t.lower() for t in texts)) != 4:
        errs.append("duplicate option text")
    if q["r"] not in LETTERS:
        errs.append(f"r not in A-D: {q['r']}")
        return errs
    e = q["e"]
    if not isinstance(e, dict) or "correcta" not in e or "incorrectas" not in e:
        errs.append("e missing correcta/incorrectas")
        return errs
    if not isinstance(e["correcta"], str) or len(e["correcta"].strip()) < 15:
        errs.append("correcta explanation too short/missing")
    inc = e["incorrectas"]
    expected_keys = set(LETTERS) - {q["r"]}
    if not isinstance(inc, dict) or set(inc.keys()) != expected_keys:
        errs.append(f"incorrectas keys {list(inc.keys()) if isinstance(inc, dict) else type(inc)} != expected {sorted(expected_keys)}")
        return errs
    for k, v in inc.items():
        if not isinstance(v, str) or len(v.strip()) < 15 or v.strip().upper() in ("N/A", "NA"):
            errs.append(f"incorrectas[{k}] too short/missing")
    stem = q.get("q", "")
    if "{{c" in stem or "}}" in stem:
        errs.append("cloze artifact leaked into q")
    return errs

def main():
    flagged_path = None
    dry_run = "--dry-run" in sys.argv
    if "--flagged" in sys.argv:
        flagged_path = sys.argv[sys.argv.index("--flagged") + 1]

    flagged_ids = set()
    if flagged_path and os.path.exists(flagged_path):
        flagged_ids = set(x["anki"] for x in json.load(open(flagged_path, encoding="utf-8")))

    current = json.load(open(CURRENT_DATASET, encoding="utf-8"))
    temas = current["temas"]
    name_to_id = {t["nombre"].strip().lower(): t["id"] for t in temas}
    next_tema_id = max(t["id"] for t in temas) + 1
    seen_anki = set(q["anki"] for q in current["preguntas"])

    batch_files = sorted(glob.glob(BATCHES_OUT_GLOB))
    print(f"Encontrados {len(batch_files)} ficheros de lote de salida")

    accepted, rejected = [], []
    for bf in batch_files:
        try:
            items = json.load(open(bf, encoding="utf-8"))
        except Exception as ex:
            rejected.append({"batch": bf, "anki": None, "reason": f"JSON invalido: {ex}"})
            continue
        if not isinstance(items, list):
            rejected.append({"batch": bf, "anki": None, "reason": "el fichero no contiene un array"})
            continue
        for q in items:
            anki = q.get("anki") if isinstance(q, dict) else None
            if anki in flagged_ids:
                rejected.append({"batch": bf, "anki": anki, "reason": "marcado por QA"})
                continue
            errs = validate(q, seen_anki)
            if errs:
                rejected.append({"batch": bf, "anki": anki, "reason": "; ".join(errs)})
                continue
            seen_anki.add(anki)

            tema_nombre = (q.get("tema_nombre") or "Uncategorized").strip()
            key = tema_nombre.lower()
            if key not in name_to_id:
                name_to_id[key] = next_tema_id
                temas.append({
                    "id": next_tema_id,
                    "nombre": tema_nombre,
                    "sistema": q.get("sistema") or "Uncategorized",
                    "fuente": "anking",
                })
                next_tema_id += 1
            tema_id = name_to_id[key]

            idx = len(current["preguntas"]) + len(accepted) + 1
            slug = re.sub(r"[^a-z0-9]+", "-", tema_nombre.lower()).strip("-")
            accepted.append({
                "id": f"anking-{slug}-{idx:04d}",
                "fuente": "anking",
                "tema": tema_id,
                "anki": anki,
                "q": q["q"],
                "o": q["o"],
                "r": q["r"],
                "e": q["e"],
            })

    print(f"Aceptadas: {len(accepted)}")
    print(f"Rechazadas: {len(rejected)}")
    by_reason = {}
    for r in rejected:
        by_reason[r["reason"]] = by_reason.get(r["reason"], 0) + 1
    for reason, n in sorted(by_reason.items(), key=lambda x: -x[1])[:20]:
        print(f"  {n:4d}  {reason}")

    if dry_run:
        print("\n--dry-run: no se ha escrito nada.")
        return

    current["preguntas"].extend(accepted)
    current["temas"] = temas
    current["version"] = f"anking-step1-{len(temas)}topics-{len(current['preguntas'])}q"

    with open(OUT_DATASET, "w", encoding="utf-8") as f:
        json.dump(current, f, ensure_ascii=False, indent=1)
    with open(OUT_DB, "w", encoding="utf-8") as f:
        f.write("window.DB = ")
        json.dump(current, f, ensure_ascii=False)
        f.write(";\n")

    rej_path = os.path.join(ROOT, "data", "anking", "_rejected_report.json")
    with open(rej_path, "w", encoding="utf-8") as f:
        json.dump(rejected, f, ensure_ascii=False, indent=1)

    print(f"\nEscrito {OUT_DATASET}")
    print(f"Escrito {OUT_DB}")
    print(f"Informe de rechazadas: {rej_path}")
    print(f"Total preguntas: {len(current['preguntas'])} / Total temas: {len(temas)}")

if __name__ == "__main__":
    main()
