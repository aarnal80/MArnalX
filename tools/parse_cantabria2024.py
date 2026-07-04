# -*- coding: utf-8 -*-
"""Parsea el examen de Médico/a de Urgencia Hospitalaria Cantabria 2024 (estabilización)
y su plantilla de respuestas, generando data/crudos/RAW_cantabria2024.json.

Estructura del cuestionario (texto PyMuPDF):
  - El enunciado va PRIMERO, seguido de líneas marcador "A", "B", "C", "D"
    (solas en su línea) con el texto de cada opción debajo.
  - El número de pregunta va AL FINAL del bloque, como " 1 .-" / "104 .-".
  - Pies de página "Página X de 20", cabeceras repetidas y form feeds intercalados.

Estructura de la plantilla: la letra de respuesta va ANTES del número de
pregunta; las preguntas 101-110 llevan además una "R" (reserva).
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
EXAM_TXT = BASE / "data" / "extraidos" / "Cantabria__1729426679-Examen_Medico_urgencias.txt"
PLANTILLA_TXT = BASE / "data" / "extraidos" / "Cantabria__1729426693-Plantilla_Medico_Urgencias.txt"
OUT_JSON = BASE / "data" / "crudos" / "RAW_cantabria2024.json"

FUENTE = "Examen Médico/a de Urgencia Hospitalaria Cantabria 2024 (estabilización)"

HEADER_FOOTER_RE = re.compile(
    r"^\s*(Página\s+\d+\s+de\s+\d+|MÉDICO/A DE URGENCIA HOSPITALARIA|OPE SCS 2022|EJERCICIO ÚNICO TIPO TEST)\s*$"
)
NUM_MARKER_RE = re.compile(r"^\s*(\d{1,3})\s*\.-\s*$")
OPT_MARKER_RE = re.compile(r"^\s*([ABCD])\s*$")


def clean_text(parts):
    """Une líneas en texto corrido y normaliza espacios (conserva tildes/erratas)."""
    text = " ".join(parts)
    text = text.replace("\x0c", " ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def parse_exam(path):
    raw = path.read_text(encoding="utf-8")
    lines = []
    started = False
    for line in raw.splitlines():
        line = line.replace("\x0c", "").rstrip()
        if not started:
            # El contenido real empieza tras la primera cabecera "EJERCICIO ÚNICO TIPO TEST"
            if line.strip() == "EJERCICIO ÚNICO TIPO TEST":
                started = True
            continue
        if HEADER_FOOTER_RE.match(line):
            continue
        if line.strip() == "":
            continue
        lines.append(line)

    # Dividir en bloques: cada bloque termina en el marcador de número " N .-"
    questions = {}
    block = []
    for line in lines:
        m = NUM_MARKER_RE.match(line)
        if m:
            num = int(m.group(1))
            q = parse_block(num, block)
            if num in questions:
                raise ValueError(f"Pregunta {num} duplicada")
            questions[num] = q
            block = []
        else:
            block.append(line)
    if block:
        leftover = clean_text(block)
        if leftover:
            raise ValueError(f"Texto sobrante sin marcador de número: {leftover[:200]!r}")
    return questions


def parse_block(num, block):
    """Separa enunciado y opciones A-D dentro de un bloque de pregunta."""
    enunciado_parts = []
    opciones = {}
    current = None  # None = enunciado; 'A'..'D' = opción en curso
    for line in block:
        m = OPT_MARKER_RE.match(line)
        if m:
            letter = m.group(1)
            expected = "ABCD"[len(opciones)] if len(opciones) < 4 else None
            if letter == expected:
                opciones[letter] = []
                current = letter
                continue
            # Letra suelta que no es el siguiente marcador esperado: es contenido
        if current is None:
            enunciado_parts.append(line)
        else:
            opciones[current].append(line)

    enunciado = clean_text(enunciado_parts)
    opts = {k: clean_text(v) for k, v in opciones.items()}
    return {"id_examen": num, "enunciado": enunciado, "opciones": opts}


def parse_plantilla(path):
    raw = path.read_text(encoding="utf-8")
    answers = {}
    pending_letter = None
    for line in raw.splitlines():
        tok = line.replace("\x0c", "").strip()
        if not tok:
            continue
        if re.fullmatch(r"[ABCD]", tok):
            pending_letter = tok
        elif re.fullmatch(r"\d{1,3}", tok):
            num = int(tok)
            if pending_letter is None:
                raise ValueError(f"Número {num} en plantilla sin letra previa")
            if num in answers:
                raise ValueError(f"Respuesta duplicada para pregunta {num}")
            answers[num] = pending_letter
            pending_letter = None
        elif tok == "R":
            continue  # marca de reserva (preguntas 101-110)
        else:
            continue  # cabecera de la plantilla
    return answers


def main():
    questions = parse_exam(EXAM_TXT)
    answers = parse_plantilla(PLANTILLA_TXT)

    errors = []

    # Validación 1: numeración 1..110 sin huecos
    expected = set(range(1, 111))
    got = set(questions)
    if got != expected:
        errors.append(f"Numeración preguntas: faltan {sorted(expected - got)}, sobran {sorted(got - expected)}")

    # Validación 2: 4 opciones por pregunta, sin textos vacíos
    for num in sorted(questions):
        q = questions[num]
        if sorted(q["opciones"].keys()) != ["A", "B", "C", "D"]:
            errors.append(f"Pregunta {num}: opciones {sorted(q['opciones'].keys())}")
        for k, v in q["opciones"].items():
            if not v:
                errors.append(f"Pregunta {num}: opción {k} vacía")
        if not q["enunciado"]:
            errors.append(f"Pregunta {num}: enunciado vacío")

    # Validación 3: plantilla cubre 1..110 con letras A-D
    got_ans = set(answers)
    if got_ans != expected:
        errors.append(f"Numeración plantilla: faltan {sorted(expected - got_ans)}, sobran {sorted(got_ans - expected)}")
    for num, letter in answers.items():
        if letter not in "ABCD":
            errors.append(f"Plantilla pregunta {num}: respuesta inválida {letter!r}")

    if errors:
        print("VALIDACIÓN FALLIDA:")
        for e in errors:
            print(" -", e)
        sys.exit(1)

    out = []
    for num in sorted(questions):
        q = questions[num]
        out.append({
            "id_examen": num,
            "fuente": FUENTE,
            "enunciado": q["enunciado"],
            "opciones": q["opciones"],
            "respuesta_correcta": answers[num],
        })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"OK: {len(out)} preguntas escritas en {OUT_JSON}")
    print("Validaciones pasadas: numeración 1..110 sin huecos, 4 opciones por pregunta, respuesta A-D para todas.")


if __name__ == "__main__":
    main()
