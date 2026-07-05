"""
Extrae del mazo AnKing Overhaul Step 1 (.apkg) las notas "cloze" de texto
limpio, con un solo hueco, listas para el pipeline de conversión a MCQ.

Uso:
    python tools/anki_extract.py <ruta-al-.apkg> <salida.json>

Salida: lista de objetos
    { "anki": "<note id>", "tema_raw": "<tag FirstAid completo>",
      "sistema": "<capitulo First Aid>", "subtema": "<subtema>",
      "stem": "<Text con {{c1::...}} intacto>", "extra": "<campo Extra>" }

Solo se incluyen notas del notetype AnKingOverhaul (o variante con nombre
renombrado por Anki al importar, se detecta por los campos Text/Extra +
tag "#AK_Step1" o "AnKing"), sin <img>/[sound:] y con un único cloze c1
(mismo filtro "universo limpio" que describe PLAN_ANKING_STEP1.md §4 Fase A).
"""
import sys
import re
import json
import sqlite3
import zipfile
import tempfile
import os

def unicase(a, b):
    a = (a or "").lower()
    b = (b or "").lower()
    return (a > b) - (a < b)

def open_collection(apkg_path):
    """Unzip the .apkg and return a sqlite3 connection to whichever
    collection file it contains (legacy .anki2, or newer .anki21/.anki21b
    which may be zstd-compressed)."""
    tmpdir = tempfile.mkdtemp(prefix="anki_extract_")
    with zipfile.ZipFile(apkg_path) as z:
        names = z.namelist()
        candidates = [n for n in names if n in ("collection.anki2", "collection.anki21", "collection.anki21b")]
        if not candidates:
            raise SystemExit(f"No collection.anki2* found in {apkg_path}. Contents: {names[:20]}")
        # Prefer plain anki2/anki21 (uncompressed) if present; else the zstd one.
        src = next((n for n in candidates if not n.endswith("b")), candidates[0])
        z.extract(src, tmpdir)
    raw_path = os.path.join(tmpdir, src)
    if src.endswith("b"):
        import zstandard
        out_path = raw_path + ".sqlite"
        with open(raw_path, "rb") as f_in, open(out_path, "wb") as f_out:
            dctx = zstandard.ZstdDecompressor()
            dctx.copy_stream(f_in, f_out)
        raw_path = out_path
    con = sqlite3.connect(raw_path)
    con.create_collation("unicase", unicase)
    return con

def get_notetype_map(con):
    """Returns {mid: name} whether the schema uses the legacy col.models
    JSON blob or the newer notetypes table."""
    cur = con.cursor()
    cur.execute("select name from sqlite_master where type='table'")
    tables = {r[0] for r in cur.fetchall()}
    if "notetypes" in tables:
        cur.execute("select id, name from notetypes")
        return {mid: name for mid, name in cur.fetchall()}
    cur.execute("select models from col")
    models = json.loads(cur.fetchone()[0])
    return {int(mid): m["name"] for mid, m in models.items()}

def get_field_map(con, mid):
    """Returns list of field names in order for a given notetype id,
    for either schema version."""
    cur = con.cursor()
    cur.execute("select name from sqlite_master where type='table'")
    tables = {r[0] for r in cur.fetchall()}
    if "fields" in tables:
        cur.execute("select name from fields where ntid=? order by ord", (mid,))
        rows = cur.fetchall()
        if rows:
            return [r[0] for r in rows]
    cur.execute("select models from col")
    models = json.loads(cur.fetchone()[0])
    m = models[str(mid)]
    return [f["name"] for f in m["flds"]]

CLOZE_RE = re.compile(r"\{\{c(\d+)::(.*?)(::.*?)?\}\}", re.DOTALL)
HTML_TAG_RE = re.compile(r"<[^>]+>")
IMG_RE = re.compile(r"<img\b|\[sound:", re.IGNORECASE)

SOUND_REF_RE = re.compile(r"\[sound:[^\]]*\]", re.IGNORECASE)

def strip_html(s):
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"</div>", "\n", s)
    s = SOUND_REF_RE.sub("", s)
    s = HTML_TAG_RE.sub("", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\n{3,}", "\n\n", s).strip()

def parse_tags(tags):
    # This deck is the combined AnKing megadeck (Step 1 + Step 2 in one
    # notetype). We only want Step 1 material, identified by tags in the
    # "AK_Step1_v11" namespace, and specifically its "#FirstAid::..."
    # sub-hierarchy for system/subtopic classification, e.g.:
    #   " #AK_Step1_v11::#FirstAid::07_Cardiovascular::03_Physiology::... "
    out = {"sistema": None, "subtema": None, "raw": tags.strip(), "is_step1": False}
    for tag in tags.split():
        if "AK_Step1_v11" not in tag:
            continue
        out["is_step1"] = True
        if "FirstAid" in tag:
            parts = tag.split("::")
            fa_idx = next((i for i, p in enumerate(parts) if "FirstAid" in p), None)
            if fa_idx is not None:
                rest = parts[fa_idx + 1:]
                if len(rest) >= 1:
                    out["sistema"] = re.sub(r"^\d+_", "", rest[0]).replace("_", " ")
                if len(rest) >= 2:
                    out["subtema"] = re.sub(r"^\d+_", "", rest[1]).replace("_", " ")
    return out

def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    apkg_path, out_path = sys.argv[1], sys.argv[2]
    con = open_collection(apkg_path)
    ntmap = get_notetype_map(con)

    target_mids = [mid for mid, name in ntmap.items()
                   if "anking" in name.lower() or "overhaul" in name.lower()]
    cur = con.cursor()
    if not target_mids:
        # Fall back: any cloze notetype whose notes carry an AK_Step1/FirstAid tag.
        cur.execute("select id from notetypes") if _has_table(con, "notetypes") else None
        target_mids = list(ntmap.keys())

    results = []
    skipped_media, skipped_multi, skipped_step2, skipped_no_fa = 0, 0, 0, 0
    for mid in target_mids:
        fields = get_field_map(con, mid)
        if "Text" not in fields:
            continue
        text_i = fields.index("Text")
        extra_i = fields.index("Extra") if "Extra" in fields else None
        cur.execute("select id, flds, tags from notes where mid=?", (mid,))
        for note_id, flds, tags in cur.fetchall():
            parts = flds.split("\x1f")
            text = parts[text_i]
            extra = parts[extra_i] if extra_i is not None and extra_i < len(parts) else ""
            # Only the question stem (Text) needs to be image/audio-free for v1
            # (no rendering support yet). Extra commonly has supporting images
            # even for text-only questions — that's fine, we only mine it for
            # explanation content, never render it verbatim.
            if IMG_RE.search(text):
                skipped_media += 1
                continue
            clozes = set(m.group(1) for m in CLOZE_RE.finditer(text))
            if len(clozes) != 1:
                skipped_multi += 1
                continue
            tag_info = parse_tags(tags)
            if not tag_info["is_step1"]:
                skipped_step2 += 1  # Step 2/3-only content, out of scope
                continue
            if not tag_info["sistema"]:
                skipped_no_fa += 1  # Step 1 but no #FirstAid subtag (parked for v2)
                continue
            results.append({
                "anki": str(note_id),
                "tema_raw": tag_info["raw"],
                "sistema": tag_info["sistema"],
                "subtema": tag_info["subtema"],
                "stem": strip_html(text),
                "extra": strip_html(extra),
            })

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)

    print(f"Extraidas: {len(results)}")
    print(f"Descartadas por imagen/audio (en Text): {skipped_media}")
    print(f"Descartadas por multi-cloze: {skipped_multi}")
    print(f"Descartadas por ser Step 2/3 (fuera de alcance): {skipped_step2}")
    print(f"Descartadas Step 1 sin subtag FirstAid (aparcadas v2): {skipped_no_fa}")

def _has_table(con, name):
    cur = con.cursor()
    cur.execute("select 1 from sqlite_master where type='table' and name=?", (name,))
    return cur.fetchone() is not None

if __name__ == "__main__":
    main()
