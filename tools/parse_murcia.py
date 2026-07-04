# -*- coding: utf-8 -*-
"""Parsea el examen de Médico de Urgencia Hospitalaria de Murcia (turno libre, modelo A)
y su plantilla de respuestas, generando data/crudos/RAW_murcia.json."""

import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
EXAM_TXT = BASE / "data" / "extraidos" / "Murcia__URG_HOS__LB_____A.txt"
ANSW_TXT = BASE / "data" / "extraidos" / "Murcia__URG_HOS_plantilla_RESPUESTAS_150_LB_A.txt"
OUT_JSON = BASE / "data" / "crudos" / "RAW_murcia.json"

FUENTE = "Examen Médico de Urgencia Hospitalaria Murcia"

RE_PAGE = re.compile(r"^\s*Página \d+ de \d+\s*$")
RE_HEADER = re.compile(r"^\s*URG_HOS__LB_____A\s*$")
RE_ARTIFACT = re.compile(r"^\s*\d{1,3}\s*$")  # números sueltos tipo "472", "011"
RE_QNUM = re.compile(r"^\s*(\d{1,3})\.\s*(.*)$")  # "1." o "146.  texto..."
RE_OPT = re.compile(r"^\s*([A-D])\)\s*(.*)$")


def clean_text(parts):
    """Une fragmentos de líneas en texto corrido, normalizando espacios."""
    text = " ".join(p.strip() for p in parts if p.strip())
    return re.sub(r"\s+", " ", text).strip()


def parse_exam(path):
    raw = path.read_text(encoding="utf-8")
    lines = raw.replace("\x0c", "\n").split("\n")

    questions = []
    cur = None          # dict de pregunta en curso
    cur_opt = None      # letra de opción en curso
    buf_enun = []       # buffer enunciado
    buf_opt = []        # buffer opción

    def flush_opt():
        nonlocal cur_opt, buf_opt
        if cur is not None and cur_opt is not None:
            cur["opciones"][cur_opt] = clean_text(buf_opt)
        cur_opt = None
        buf_opt = []

    def flush_question():
        nonlocal cur, buf_enun
        flush_opt()
        if cur is not None:
            cur["enunciado"] = clean_text(buf_enun)
            questions.append(cur)
        cur = None
        buf_enun = []

    expected_next = 1
    for line in lines:
        if RE_PAGE.match(line) or RE_HEADER.match(line):
            continue
        if not line.strip():
            continue

        m = RE_QNUM.match(line)
        if m and int(m.group(1)) == expected_next:
            flush_question()
            cur = {"id_examen": int(m.group(1)), "opciones": {}}
            buf_enun = [m.group(2)] if m.group(2).strip() else []
            expected_next += 1
            continue

        # Artefactos numéricos sueltos solo se ignoran fuera de texto inicial
        if RE_ARTIFACT.match(line):
            # número suelto: artefacto de extracción, se descarta
            continue

        m = RE_OPT.match(line)
        if m and cur is not None:
            flush_opt()
            cur_opt = m.group(1)
            buf_opt = [m.group(2)] if m.group(2).strip() else []
            continue

        # Línea de continuación
        if cur is None:
            continue  # texto previo a la primera pregunta
        if cur_opt is not None:
            buf_opt.append(line)
        else:
            buf_enun.append(line)

    flush_question()
    return questions


def parse_answers(path):
    raw = path.read_text(encoding="utf-8")
    lines = [l.strip() for l in raw.replace("\x0c", "\n").split("\n")]
    answers = {}
    for i, line in enumerate(lines):
        if re.fullmatch(r"\d{1,3}", line):
            num = int(line)
            # buscar la siguiente línea no vacía
            j = i + 1
            while j < len(lines) and not lines[j]:
                j += 1
            if j < len(lines) and re.fullmatch(r"[A-D]", lines[j]):
                if num in answers and answers[num] != lines[j]:
                    print(f"AVISO: respuesta duplicada y distinta para {num}")
                answers[num] = lines[j]
    return answers


def main():
    incidencias = []
    questions = parse_exam(EXAM_TXT)
    answers = parse_answers(ANSW_TXT)

    n = len(questions)
    print(f"Preguntas parseadas: {n}")
    print(f"Respuestas parseadas: {len(answers)}")

    # Validación 1: numeración consecutiva completa
    ids = [q["id_examen"] for q in questions]
    expected = list(range(1, n + 1))
    if ids != expected:
        missing = sorted(set(expected) - set(ids))
        incidencias.append(f"Numeración no consecutiva. Faltan: {missing}")

    # Validación 2: 4 opciones por pregunta y no vacías
    for q in questions:
        keys = sorted(q["opciones"].keys())
        if keys != ["A", "B", "C", "D"]:
            incidencias.append(f"Pregunta {q['id_examen']}: opciones {keys}")
        for k, v in q["opciones"].items():
            if not v:
                incidencias.append(f"Pregunta {q['id_examen']}: opción {k} vacía")
        if not q["enunciado"]:
            incidencias.append(f"Pregunta {q['id_examen']}: enunciado vacío")

    # Validación 3: respuesta A-D para todas
    for q in questions:
        resp = answers.get(q["id_examen"])
        if resp is None:
            incidencias.append(f"Pregunta {q['id_examen']}: sin respuesta en plantilla")
        q["respuesta_correcta"] = resp
    extra = sorted(set(answers) - set(ids))
    if extra:
        incidencias.append(f"Respuestas en plantilla sin pregunta: {extra}")

    out = [
        {
            "id_examen": q["id_examen"],
            "fuente": FUENTE,
            "enunciado": q["enunciado"],
            "opciones": q["opciones"],
            "respuesta_correcta": q["respuesta_correcta"],
        }
        for q in questions
    ]

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Escrito: {OUT_JSON}")

    if incidencias:
        print("INCIDENCIAS:")
        for inc in incidencias:
            print(f"  - {inc}")
        sys.exit(1)
    else:
        print("Validaciones OK: numeración 1..%d consecutiva, 4 opciones/pregunta, respuesta A-D en todas." % n)


if __name__ == "__main__":
    main()
