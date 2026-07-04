# -*- coding: utf-8 -*-
"""
Parser del Listado definitivo de preguntas - Médica/o de Urgencia Hospitalaria
(Servicio Canario de la Salud, estabilización 2022).

Entrada : data/extraidos/Canarias__Certificación_Listado_Definitivo_Preguntas_Médica-o_de_Urgencia_Hospitalaria.txt
Salida  : data/crudos/RAW_canarias.json

Estructura del documento (texto extraído del PDF):
  N. Enunciado (puede ocupar varias líneas)
  A) opción ...
  B) opción ...
  C) opción ...
  D) opción ...
  Respuesta Correcta: X
con cabeceras/pies de página repetidos cada página, que se eliminan.
"""

import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
INPUT = BASE / "data" / "extraidos" / "Canarias__Certificación_Listado_Definitivo_Preguntas_Médica-o_de_Urgencia_Hospitalaria.txt"
OUTPUT = BASE / "data" / "crudos" / "RAW_canarias.json"

FUENTE = "Listado definitivo de preguntas Médico/a de Urgencia Hospitalaria Canarias"

# Líneas de cabecera/pie de página repetidas en cada página del PDF.
BOILERPLATE_PATTERNS = [
    r"^En la dirección https://sede\.gobiernodecanarias\.org/",
    r"^puede ser comprobada la autenticidad",
    r"^documento electrónico siguiente:",
    r"^\s*0lo_n_Hf1nGk-YziIOTnDmpsQIK5dfheZ\s*$",
    r"^Listado de preguntas definitivo\s*$",
    r"^Convocatoria: PROCESOS SELECTIVOS",
    r"^Categoría: MÉDICA/O DE URGENCIA HOSPITALARIA\s*$",
    r"^Nº de preguntas de reserva:",
    r"^Página \d+ de \d+\s*$",
    r"^Este documento ha sido firmado electrónicamente por:",
    r"^MARIA GLADIS PAJES ABREU",
    r"^Fecha: \d{2}/\d{2}/\d{4}",
    r"^El presente documento ha sido descargado",
]
BOILERPLATE_RE = re.compile("|".join(BOILERPLATE_PATTERNS))

ANSWER_RE = re.compile(r"^\s*Respuesta\s+Correcta:\s*([A-E])\s*$", re.IGNORECASE)
OPTION_RE = re.compile(r"^\s*([A-E])\)\s*(.*)$")


def question_re(num: int) -> re.Pattern:
    """Inicio de pregunta: solo se acepta el número esperado, para no
    confundir números dentro del texto con inicios de pregunta."""
    return re.compile(r"^\s*" + str(num) + r"\.\s*(.*)$")


def join_fragment(acc: str, frag: str) -> str:
    """Une un fragmento de línea al texto acumulado limpiando el salto de línea.
    Si el acumulado termina en guion (corte de palabra del PDF) se une sin
    espacio conservando el guion tal cual aparece en el documento."""
    frag = frag.strip()
    if not frag:
        return acc
    if not acc:
        return frag
    if acc.endswith("-"):
        return acc + frag
    return acc + " " + frag


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def main() -> int:
    raw = INPUT.read_text(encoding="utf-8")
    lines = raw.splitlines()

    # Filtrar cabeceras/pies de página y líneas vacías.
    clean = [ln for ln in lines if ln.strip() and not BOILERPLATE_RE.search(ln)]

    questions = []
    incidencias = []

    expected = 1
    state = "seek"          # seek -> enunciado -> opciones
    cur = None              # pregunta en construcción
    cur_letter = None       # letra de la opción en construcción

    def flush(answer):
        nonlocal cur, cur_letter, expected, state
        cur["respuesta_correcta"] = answer
        questions.append(cur)
        cur = None
        cur_letter = None
        expected += 1
        state = "seek"

    for ln in clean:
        # ¿Empieza la siguiente pregunta esperada?
        m = question_re(expected).match(ln)
        if m and state in ("seek",):
            cur = {
                "id_examen": expected,
                "fuente": FUENTE,
                "enunciado": m.group(1).strip(),
                "opciones": {},
                "respuesta_correcta": None,
            }
            state = "enunciado"
            cur_letter = None
            continue

        if state == "seek":
            # Texto fuera de pregunta (preámbulo del certificado, etc.)
            continue

        # ¿Línea de respuesta correcta? (solo si ya hay opciones: las frases
        # "señale la Respuesta Correcta:" del enunciado no llevan letra y no
        # casan con el patrón, pero por seguridad exigimos opciones).
        a = ANSWER_RE.match(ln)
        if a and cur["opciones"]:
            flush(a.group(1).upper())
            continue

        # ¿Inicio de opción?
        o = OPTION_RE.match(ln)
        if o:
            letter = o.group(1).upper()
            if letter in cur["opciones"]:
                incidencias.append(
                    f"Pregunta {cur['id_examen']}: opción {letter} duplicada; "
                    f"se trata como continuación."
                )
                cur["opciones"][letter] = join_fragment(
                    cur["opciones"][letter], ln.strip()
                )
            else:
                cur["opciones"][letter] = o.group(2).strip()
                cur_letter = letter
                state = "opciones"
            continue

        # Continuación de enunciado u opción.
        if state == "enunciado":
            cur["enunciado"] = join_fragment(cur["enunciado"], ln)
        else:
            cur["opciones"][cur_letter] = join_fragment(
                cur["opciones"][cur_letter], ln
            )

    if cur is not None:
        incidencias.append(
            f"Pregunta {cur['id_examen']} quedó sin línea 'Respuesta Correcta'."
        )
        questions.append(cur)

    # Normalización final de espacios.
    for q in questions:
        q["enunciado"] = normalize(q["enunciado"])
        q["opciones"] = {k: normalize(v) for k, v in sorted(q["opciones"].items())}

    # ---------- Validaciones ----------
    n = len(questions)
    print(f"Preguntas parseadas: {n}")

    ids = [q["id_examen"] for q in questions]
    missing = sorted(set(range(1, max(ids) + 1)) - set(ids)) if ids else []
    if missing:
        incidencias.append(f"Numeración incompleta, faltan: {missing}")
    else:
        print(f"Numeración completa: 1..{max(ids)} sin huecos.")

    opt_sets = {}
    for q in questions:
        keys = "".join(sorted(q["opciones"].keys()))
        opt_sets.setdefault(keys, []).append(q["id_examen"])
        if keys != "ABCD":
            incidencias.append(
                f"Pregunta {q['id_examen']}: opciones atípicas ({keys or 'ninguna'})."
            )
        if not q["enunciado"]:
            incidencias.append(f"Pregunta {q['id_examen']}: enunciado vacío.")
        for k, v in q["opciones"].items():
            if not v:
                incidencias.append(
                    f"Pregunta {q['id_examen']}: opción {k} con texto vacío."
                )
        rc = q["respuesta_correcta"]
        if rc is None:
            incidencias.append(
                f"Pregunta {q['id_examen']}: sin respuesta correcta marcada."
            )
        elif rc not in q["opciones"]:
            incidencias.append(
                f"Pregunta {q['id_examen']}: respuesta '{rc}' no está entre las opciones."
            )

    print(f"Conjuntos de opciones encontrados: "
          f"{ {k: len(v) for k, v in opt_sets.items()} }")

    answered = sum(1 for q in questions if q["respuesta_correcta"])
    print(f"Preguntas con respuesta correcta marcada: {answered}/{n}")

    from collections import Counter
    dist = Counter(q["respuesta_correcta"] for q in questions)
    print(f"Distribución de respuestas: {dict(sorted(dist.items(), key=str))}")

    if incidencias:
        print(f"\nIncidencias ({len(incidencias)}):")
        for inc in incidencias:
            print(f"  - {inc}")
    else:
        print("Sin incidencias.")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps(questions, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f"\nEscrito: {OUTPUT} ({n} preguntas)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
