# -*- coding: utf-8 -*-
"""Extrae el texto de todos los PDF de Examenes/ a data/extraidos/<comunidad>__<nombre>.txt
Informa de cuáles no tienen capa de texto (necesitan OCR)."""
import fitz, sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "Examenes" / "Examenes"
OUT = ROOT / "data" / "extraidos"
OUT.mkdir(parents=True, exist_ok=True)

for pdf in sorted(SRC.rglob("*.pdf")):
    com = pdf.parent.name
    if com in ("Aragón", "MUok"):
        continue
    dest = OUT / f"{com}__{pdf.stem}.txt".replace(" ", "_")
    try:
        doc = fitz.open(pdf)
        txt = chr(12).join(p.get_text() for p in doc)
        estado = "OK" if len(txt) > 200 * doc.page_count * 0.3 else ("ESCASO" if len(txt) > 100 else "SIN-TEXTO(OCR)")
        if estado != "SIN-TEXTO(OCR)":
            dest.write_text(txt, encoding="utf-8")
        print(f"{estado:14} {doc.page_count:3}p {len(txt):7}ch  {com}/{pdf.name}")
    except Exception as e:
        print(f"ERROR          {com}/{pdf.name}: {e}")
