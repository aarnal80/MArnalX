"""
Extrae del mazo AnKing (.apkg) las notas cloze con imagen o audio en el
enunciado (campo Text), con un solo hueco -- variante de anki_extract.py
para el subconjunto "con imagen/audio", en vez del universo de solo texto.

Este .apkg concreto usa el notetype "Cloze-AnKingMaster" y el esquema de
tags "#AK_Step1::Sistema::Subtema" (sin "_v11" ni capa "#FirstAid::" --
distinto del mazo "AnKingOverhaul" documentado en versiones previas del
plan). El sistema/subtema se toma de la primera tag "#AK_Step1::X::Y" cuyo
X no empiece por '#' (las tags que empiezan por '#' tras el namespace son
reflejo de la fuente, p.ej. "#AK_Step1::#SketchyPath::...", no la
clasificacion por sistema).

Uso:
    python tools/anki_extract_media.py <ruta-al-.apkg> <salida.json> <dir-media-salida> [max_n]

Salida JSON: lista de objetos
    { "anki": "<note id>", "sistema_raw": "...", "subtema_raw": "...",
      "tags_raw": "...", "stem": "<Text con {{c1::...}} y <img>/[sound:] intactos>",
      "extra": "<campo Extra>",
      "media": [{"tipo": "img"|"audio", "ref_original": "...", "archivo_copiado": "...",
                 "path_absoluto": "..."}] }

Copia a <dir-media-salida> los ficheros multimedia referenciados.
"""
import sys
import re
import json
import sqlite3
import zipfile
import tempfile
import os
import shutil

def unicase(a, b):
    a = (a or "").lower()
    b = (b or "").lower()
    return (a > b) - (a < b)

def open_collection_and_media(apkg_path, tmpdir):
    with zipfile.ZipFile(apkg_path) as z:
        names = z.namelist()
        candidates = [n for n in names if n in ("collection.anki2", "collection.anki21", "collection.anki21b")]
        if not candidates:
            raise SystemExit(f"No collection.anki2* found in {apkg_path}. Contents: {names[:20]}")
        src = next((n for n in candidates if not n.endswith("b")), candidates[0])
        z.extract(src, tmpdir)
        media_manifest = {}
        if "media" in names:
            z.extract("media", tmpdir)
            with open(os.path.join(tmpdir, "media"), encoding="utf-8") as f:
                media_manifest = json.load(f)
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
    return con, media_manifest

def get_notetype_map(con):
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
IMG_SRC_RE = re.compile(r'<img[^>]+src=["\']([^"\']+)["\']', re.IGNORECASE)
SOUND_REF_RE = re.compile(r"\[sound:([^\]]*)\]", re.IGNORECASE)

def strip_html_keep_media_markers(s):
    s = SOUND_REF_RE.sub(lambda m: f"[AUDIO: {m.group(1)}]", s)
    s = re.sub(r"<br\s*/?>", "\n", s)
    s = re.sub(r"</div>", "\n", s)
    s = HTML_TAG_RE.sub("", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&")
    return re.sub(r"\n{3,}", "\n\n", s).strip()

def parse_tags(tags):
    out = {"sistema_raw": None, "subtema_raw": None, "raw": tags.strip(), "is_step1": False}
    for tag in tags.split():
        if not tag.startswith("#AK_Step1::"):
            continue
        out["is_step1"] = True
        rest = tag.split("::")[1:]
        if rest and not rest[0].startswith("#") and out["sistema_raw"] is None:
            out["sistema_raw"] = rest[0]
            if len(rest) >= 2:
                out["subtema_raw"] = rest[1]
    return out

def main():
    if len(sys.argv) not in (4, 5):
        print(__doc__)
        sys.exit(1)
    apkg_path, out_path, media_out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
    max_n = int(sys.argv[4]) if len(sys.argv) == 5 else None
    os.makedirs(media_out_dir, exist_ok=True)
    tmpdir = tempfile.mkdtemp(prefix="anki_extract_media_")
    con, media_manifest = open_collection_and_media(apkg_path, tmpdir)
    name_to_num = {}
    for num, real_name in media_manifest.items():
        name_to_num.setdefault(real_name, num)

    ntmap = get_notetype_map(con)
    target_mids = list(ntmap.keys())
    cur = con.cursor()
    zf = zipfile.ZipFile(apkg_path)

    results = []
    seen_media_files = {}
    skipped_no_media, skipped_multi, skipped_step2, skipped_bad_ref = 0, 0, 0, 0
    counter = 0

    for mid in target_mids:
        fields = get_field_map(con, mid)
        if "Text" not in fields:
            continue
        text_i = fields.index("Text")
        extra_i = fields.index("Extra") if "Extra" in fields else None
        cur.execute("select id, flds, tags from notes where mid=?", (mid,))
        for note_id, flds, tags in cur.fetchall():
            if max_n is not None and len(results) >= max_n:
                break
            parts = flds.split("\x1f")
            text = parts[text_i]
            extra = parts[extra_i] if extra_i is not None and extra_i < len(parts) else ""

            has_img = "<img" in text.lower()
            has_snd = "[sound:" in text.lower()
            if not (has_img or has_snd):
                skipped_no_media += 1
                continue
            clozes = set(m.group(1) for m in CLOZE_RE.finditer(text))
            if len(clozes) != 1:
                skipped_multi += 1
                continue
            tag_info = parse_tags(tags)
            if not tag_info["is_step1"]:
                skipped_step2 += 1
                continue

            media_list = []
            img_refs = IMG_SRC_RE.findall(text)
            snd_refs = SOUND_REF_RE.findall(text)
            ok = True
            for ref in img_refs + snd_refs:
                ref = ref.strip()
                num = name_to_num.get(ref)
                if num is None:
                    ok = False
                    break
                if ref in seen_media_files:
                    archivo_copiado = seen_media_files[ref]
                else:
                    ext = os.path.splitext(ref)[1].lower() or ".bin"
                    counter += 1
                    archivo_copiado = f"anking-{counter:04d}{ext}"
                    with zf.open(num) as src_f, open(os.path.join(media_out_dir, archivo_copiado), "wb") as dst_f:
                        shutil.copyfileobj(src_f, dst_f)
                    seen_media_files[ref] = archivo_copiado
                media_list.append({
                    "tipo": "audio" if ref in snd_refs else "img",
                    "ref_original": ref,
                    "archivo_copiado": archivo_copiado,
                    "path_absoluto": os.path.abspath(os.path.join(media_out_dir, archivo_copiado)),
                })
            if not ok or not media_list:
                skipped_bad_ref += 1
                continue

            results.append({
                "anki": str(note_id),
                "tags_raw": tag_info["raw"],
                "sistema_raw": tag_info["sistema_raw"],
                "subtema_raw": tag_info["subtema_raw"],
                "stem": strip_html_keep_media_markers(text),
                "extra": strip_html_keep_media_markers(extra) if extra else "",
                "media": media_list,
            })
        if max_n is not None and len(results) >= max_n:
            break

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=1)

    print(f"Extraidas: {len(results)}")
    print(f"Descartadas sin imagen/audio en Text: {skipped_no_media}")
    print(f"Descartadas por multi-cloze: {skipped_multi}")
    print(f"Descartadas sin tag AK_Step1: {skipped_step2}")
    print(f"Descartadas por referencia de media no encontrada en manifest: {skipped_bad_ref}")
    print(f"Ficheros multimedia copiados a {media_out_dir}: {len(seen_media_files)}")

if __name__ == "__main__":
    main()
