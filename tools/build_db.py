# -*- coding: utf-8 -*-
"""Construye app/data/db.js a partir de los bancos enriquecidos en data/fuentes/.

Cada banco es un JSON (lista de preguntas) con el formato MUok:
  id_examen, fuente, enunciado, opciones{A..D}, respuesta_correcta,
  clasificacion_temario{id, tema}, explicacion{correcta, incorrectas{}}

El manifiesto MANIFEST asigna metadatos de examen a cada fichero.
Detecta duplicados por hash del texto normalizado (enunciado + opciones).
"""
import json, re, sys, hashlib, unicodedata, datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
FUENTES = ROOT / "data" / "fuentes"
OUT = ROOT / "app" / "data" / "db.js"
SW = ROOT / "app" / "sw.js"


def sincronizar_sw(db_path):
    """Reescribe DB_HASH en sw.js con el hash del contenido de db.js.

    El service worker sirve db.js cache-first; al ligar el nombre del caché a
    este hash, una BD nueva invalida el caché y fuerza una única re-descarga."""
    if not SW.exists():
        return
    h = hashlib.sha1(db_path.read_bytes()).hexdigest()[:8]
    texto = SW.read_text(encoding="utf-8")
    nuevo, n = re.subn(r'const DB_HASH = "[^"]*";',
                       f'const DB_HASH = "{h}";', texto, count=1)
    if n and nuevo != texto:
        SW.write_text(nuevo, encoding="utf-8")
        print(f"sw.js -> DB_HASH={h}")
    elif n:
        print(f"sw.js sin cambios (DB_HASH={h})")

sys.path.insert(0, str(Path(__file__).parent))
from temas import TEMAS, grupo

# (fichero, id examen, comunidad, año de examen, etiqueta)
MANIFEST = [
    # Aragón
    ("MURaragon2024.json", "aragon-2024", "Aragón", 2024, "Aragón · OPE 2022 (examen 2024)"),
    ("MURaragon2025.json", "aragon-2025", "Aragón", 2025, "Aragón · OPE 2023 (examen 2025)"),
    ("MURar2022.json",     "aragon-2022", "Aragón", 2022, "Aragón · OPE 2017-19 (examen 2022)"),
    ("MURar2018.json",     "aragon-2018", "Aragón", 2018, "Aragón · OPE (examen 2018)"),
    # Andalucía
    ("MURandalucia2021.json",  "andalucia-2021",  "Andalucía", 2021, "Andalucía · OPE (examen 2021)"),
    ("MURandalucia2018.json",  "andalucia-2018",  "Andalucía", 2018, "Andalucía · OPE 2016 (examen 2018)"),
    ("MURandaluciaMFUUH.json", "andalucia-mfuuh", "Andalucía", None, "Andalucía · OPE Médico Familia UUH"),
    ("MURandalucia2023.json",  "andalucia-2023",  "Andalucía", 2023, "Andalucía · OPE (examen 2023)"),
    ("MURandalucia2023b.json", "andalucia-2023b", "Andalucía", 2023, "Andalucía · OPE 2023 (prueba aplazada)"),
    # Cantabria
    ("MURcantabria2017.json", "cantabria-2017", "Cantabria", 2017, "Cantabria · OPE (examen 2017)"),
    ("MURcantabria2024.json", "cantabria-2024", "Cantabria", 2024, "Cantabria · OPE (examen 2024)"),
    # Baleares
    ("MURbaleares.json", "baleares", "Baleares", None, "Baleares · OPE Medicina de Urgencias"),
    # Canarias
    ("MURcanarias.json", "canarias", "Canarias", None, "Canarias · OPE Médico de Urgencia Hospitalaria"),
    # Castilla-La Mancha
    ("MURclmC.json", "clm-2018", "Castilla-La Mancha", 2018, "Castilla-La Mancha · OPE Urgencias (abril 2018)"),
    ("MURclmA.json", "clm-2021", "Castilla-La Mancha", 2021, "Castilla-La Mancha · OPE Urgencias (oct 2021)"),
    ("MURclmB.json", "clm-2024", "Castilla-La Mancha", 2024, "Castilla-La Mancha · OPE Urgencias SESCAM (abril 2024)"),
    # Castilla y León
    ("MURcyl2020.json", "cyl-2020", "Castilla y León", 2020, "Castilla y León · OPE Urgencias 156-2020"),
    ("MURcyl2024.json", "cyl-2024", "Castilla y León", 2024, "Castilla y León · OPE Urgencias (examen 2024)"),
    # Madrid
    ("MURmadrid2021.json", "madrid-2021", "Madrid", 2021, "Madrid · OPE 2021 (FEA M. Interna)"),
    # Murcia
    ("MURmurcia.json", "murcia", "Murcia", None, "Murcia · OPE Urgencia Hospitalaria"),
    # Navarra
    ("MURnavarra.json", "navarra", "Navarra", None, "Navarra · OPE Médico de Urgencias"),
    # Recopilatorios de temario común (Aragón) — válidos para la parte común
    ("MURtopoTCaragon.json", "aragon-topo-tc", "Aragón", None, "Aragón · Recopilatorio temario común (TOPO Enfermero)"),
    # Banco generado por IA para completar temas con pocas preguntas (mín. 20)
    ("MURia2026.json", "ia-2026", "IA", 2026, "IA · Examen generado por IA (2026)"),
]


def norm_text(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"[^a-z0-9 ]+", " ", s.lower())
    return re.sub(r"\s+", " ", s).strip()


def qhash(q):
    ops = q.get("opciones") or {}
    base = norm_text(q.get("enunciado")) + "||" + "||".join(
        sorted(norm_text(v) for v in ops.values()))
    return hashlib.sha1(base.encode()).hexdigest()[:16]


def main():
    preguntas, examenes = [], []
    casos = {}  # id de caso clínico -> texto de introducción (contexto compartido)
    seen = {}  # hash -> id pregunta canónica
    stats = {"total": 0, "dups": 0, "sin_explicacion": 0, "anuladas": 0}

    for fname, exid, comunidad, anio, etiqueta in MANIFEST:
        path = FUENTES / fname
        if not path.exists():
            continue
        data = json.load(open(path, encoding="utf-8"))
        examenes.append({"id": exid, "comunidad": comunidad, "anio": anio,
                         "nombre": etiqueta, "n": len(data)})
        for q in data:
            n = q.get("id_examen")
            qid = f"{exid}-{int(n):03d}" if isinstance(n, int) else f"{exid}-x{len(preguntas)}"
            tema_raw = (q.get("clasificacion_temario") or {}).get("id")
            tema_id = tema_raw if isinstance(tema_raw, int) and tema_raw in TEMAS else None
            resp = q.get("respuesta_correcta")
            anulada = resp not in ("A", "B", "C", "D")
            h = qhash(q)
            dup_de = seen.get(h)
            if dup_de:
                stats["dups"] += 1
            else:
                seen[h] = qid
            exp = q.get("explicacion")
            if not isinstance(exp, dict):
                exp = None
                stats["sin_explicacion"] += 1
            if anulada:
                stats["anuladas"] += 1
            preg = {
                "id": qid, "ex": exid, "n": n,
                "q": (q.get("enunciado") or "").strip(),
                "o": q.get("opciones") or {},
                "r": resp if not anulada else None,
                "t": tema_id,
                "e": exp,
                "dup": dup_de,
            }
            img = q.get("imagen")
            if img:
                preg["img"] = img  # ECG/radiografía/figura asociada (categoría B)
            caso = q.get("caso")
            if caso:
                preg["caso"] = caso  # id de bloque de caso clínico consecutivo (categoría A)
                intro = (q.get("caso_intro") or "").strip()
                if intro:
                    casos[caso] = intro  # introducción/contexto compartido del caso
            preguntas.append(preg)
            stats["total"] += 1

    temas_out = [{"id": k, "nombre": v, "grupo": grupo(k)} for k, v in sorted(TEMAS.items())]
    db = {
        "version": datetime.date.today().isoformat(),
        "temas": temas_out,
        "examenes": examenes,
        "casos": casos,
        "preguntas": preguntas,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write("window.DB = ")
        json.dump(db, f, ensure_ascii=False, separators=(",", ":"))
        f.write(";\n")
    sincronizar_sw(OUT)
    print(f"OK -> {OUT}")
    print(stats)
    print(f"examenes: {len(examenes)}  | tamaño: {OUT.stat().st_size/1024:.0f} KB")


if __name__ == "__main__":
    main()
