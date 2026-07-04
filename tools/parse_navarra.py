# -*- coding: utf-8 -*-
"""
Parser del examen de oposición Médico Adjunto de Urgencias SNS-Osasunbidea (Navarra, 2021).

Entradas:
  data/extraidos/Navarra__CARÁTULA_CON_EXAMEN_DE_OPOSICIÓN_MÉDICO_DE_URGENCIAS.txt
      -> 90 preguntas tipo test + 9 preguntas de reserva, 4 opciones (a-d).
  data/extraidos/Navarra__PLANTILLA_DE_RESPUESTAS.txt
      -> respuestas 1-90 (la 16 figura ANULADA) + reserva 1-9.
  data/extraidos/Navarra__CARÁTULA_CON_CASOS_CLÍNICOS_con_itemsCOPIA.txt
      -> 3 supuestos prácticos de desarrollo (sin ítems tipo test): NO los cubre
         la plantilla, por lo que se excluyen del banco y se reporta la incidencia.

Salida:
  data/crudos/RAW_navarra.json

Numeración: preguntas principales 1-90; preguntas de reserva N -> id_examen 90+N (91-99).
"""

import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DIR_EXTR = BASE / "data" / "extraidos"
F_EXAMEN = DIR_EXTR / "Navarra__CARÁTULA_CON_EXAMEN_DE_OPOSICIÓN_MÉDICO_DE_URGENCIAS.txt"
F_CASOS = DIR_EXTR / "Navarra__CARÁTULA_CON_CASOS_CLÍNICOS_con_itemsCOPIA.txt"
F_PLANTILLA = DIR_EXTR / "Navarra__PLANTILLA_DE_RESPUESTAS.txt"
F_SALIDA = BASE / "data" / "crudos" / "RAW_navarra.json"

FUENTE = "Examen Médico de Urgencias Navarra"

RE_PREGUNTA = re.compile(r"^\s*(\d+)\.\s*(.*)$")
RE_OPCION = re.compile(r"^\s*([a-e])\)\s*(.*)$")
RE_PAGINA = re.compile(r"^\s*\d+\s*$")  # líneas que solo contienen el nº de página
RE_RESERVA = re.compile(r"PREGUNTAS\s+DE\s+RESERVA", re.IGNORECASE)


def limpiar(texto: str) -> str:
    """Une saltos de línea internos y colapsa espacios; conserva tildes y erratas."""
    return re.sub(r"\s+", " ", texto).strip()


def parse_plantilla(path: Path):
    """Devuelve (respuestas_principales, respuestas_reserva) como dicts nº->letra|None."""
    principales, reserva = {}, {}
    en_reserva = False
    re_fila = re.compile(r"^\s*(\d+)\s+(A|B|C|D|E|ANULADA)\s*$", re.IGNORECASE)
    for linea in path.read_text(encoding="utf-8").splitlines():
        if RE_RESERVA.search(linea):
            en_reserva = True
            continue
        m = re_fila.match(linea)
        if not m:
            continue
        num = int(m.group(1))
        val = m.group(2).upper()
        resp = None if val == "ANULADA" else val
        (reserva if en_reserva else principales)[num] = resp
    return principales, reserva


def parse_examen(path: Path):
    """Devuelve (preguntas_principales, preguntas_reserva): listas de dicts
    {numero, enunciado, opciones} respetando la numeración de cada bloque."""
    principales, reserva = [], []
    en_reserva = False
    actual = None  # {numero, enunciado_lineas, opciones: {letra: [lineas]}, ultima_letra}
    esperado = 1

    def cerrar():
        nonlocal actual
        if actual is None:
            return
        q = {
            "numero": actual["numero"],
            "enunciado": limpiar(" ".join(actual["enunciado"])),
            "opciones": {
                letra.upper(): limpiar(" ".join(lineas))
                for letra, lineas in actual["opciones"].items()
            },
        }
        (reserva if actual["es_reserva"] else principales).append(q)
        actual = None

    for linea in path.read_text(encoding="utf-8").splitlines():
        if RE_RESERVA.search(linea):
            cerrar()
            en_reserva = True
            esperado = 1
            continue
        if not linea.strip() or RE_PAGINA.match(linea):
            continue  # líneas vacías y números de página

        m_p = RE_PREGUNTA.match(linea)
        if m_p and int(m_p.group(1)) == esperado:
            cerrar()
            actual = {
                "numero": esperado,
                "enunciado": [m_p.group(2)],
                "opciones": {},
                "ultima_letra": None,
                "es_reserva": en_reserva,
            }
            esperado += 1
            continue

        if actual is None:
            continue  # carátula / texto previo a la primera pregunta

        m_o = RE_OPCION.match(linea)
        if m_o:
            letra = m_o.group(1)
            letras_previas = list(actual["opciones"].keys())
            sig = chr(ord(letras_previas[-1]) + 1) if letras_previas else "a"
            if letra == sig:
                actual["opciones"][letra] = [m_o.group(2)]
                actual["ultima_letra"] = letra
                continue
            # letra fuera de secuencia: tratar como continuación de texto

        # continuación de enunciado u opción
        if actual["ultima_letra"]:
            actual["opciones"][actual["ultima_letra"]].append(linea.strip())
        else:
            actual["enunciado"].append(linea.strip())

    cerrar()
    return principales, reserva


def revisar_casos(path: Path):
    """Comprueba si el fichero de casos clínicos contiene ítems tipo test."""
    texto = path.read_text(encoding="utf-8")
    casos = len(re.findall(r"^\s*CASO CL[IÍ]NICO\s+\d+", texto, re.MULTILINE))
    # ítem tipo test = línea que empieza con "x." seguida más adelante de opciones a) b)...
    tiene_opciones = bool(re.search(r"^\s*[a-e]\)\s", texto, re.MULTILINE))
    return casos, tiene_opciones


def main():
    incidencias = []

    resp_main, resp_res = parse_plantilla(F_PLANTILLA)
    q_main, q_res = parse_examen(F_EXAMEN)
    n_casos, casos_con_items = revisar_casos(F_CASOS)

    if casos_con_items:
        incidencias.append(
            "ATENCIÓN: el fichero de casos clínicos parece contener opciones tipo test; revisar."
        )
    else:
        incidencias.append(
            f"Casos clínicos: {n_casos} supuestos prácticos de DESARROLLO (sin ítems tipo "
            "test ni cobertura en la plantilla) -> excluidos del banco."
        )

    # --- Validaciones ---
    errores = []
    if len(q_main) != len(resp_main):
        errores.append(
            f"Desajuste principales: {len(q_main)} preguntas vs {len(resp_main)} respuestas."
        )
    if len(q_res) != len(resp_res):
        errores.append(
            f"Desajuste reserva: {len(q_res)} preguntas vs {len(resp_res)} respuestas."
        )

    banco = []
    n_opciones_vistas = set()

    def procesar(preguntas, respuestas, offset, etiqueta):
        for q in preguntas:
            num = q["numero"]
            letras = list(q["opciones"].keys())
            n_opciones_vistas.add(len(letras))
            if letras != [chr(ord("A") + i) for i in range(len(letras))]:
                errores.append(f"{etiqueta} {num}: opciones no consecutivas {letras}.")
            if len(letras) < 4:
                errores.append(f"{etiqueta} {num}: solo {len(letras)} opciones.")
            if any(not v for v in q["opciones"].values()) or not q["enunciado"]:
                errores.append(f"{etiqueta} {num}: enunciado u opción vacíos.")
            if num not in respuestas:
                errores.append(f"{etiqueta} {num}: sin respuesta en plantilla.")
                continue
            resp = respuestas[num]
            if resp is not None and resp not in q["opciones"]:
                errores.append(f"{etiqueta} {num}: respuesta {resp} no está entre las opciones.")
            banco.append(
                {
                    "id_examen": offset + num,
                    "fuente": FUENTE,
                    "enunciado": q["enunciado"],
                    "opciones": q["opciones"],
                    "respuesta_correcta": resp,
                }
            )

    procesar(q_main, resp_main, 0, "Pregunta")
    procesar(q_res, resp_res, 90, "Reserva")

    banco.sort(key=lambda x: x["id_examen"])

    F_SALIDA.parent.mkdir(parents=True, exist_ok=True)
    F_SALIDA.write_text(
        json.dumps(banco, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    anuladas = [q["id_examen"] for q in banco if q["respuesta_correcta"] is None]

    print(f"Preguntas principales parseadas : {len(q_main)}")
    print(f"Preguntas de reserva parseadas  : {len(q_res)} (id_examen 91-99)")
    print(f"Total escritas en {F_SALIDA.name} : {len(banco)}")
    print(f"Nº de opciones por pregunta     : {sorted(n_opciones_vistas)}")
    print(f"Anuladas (respuesta_correcta=null): {anuladas or 'ninguna'}")
    dist = {}
    for q in banco:
        dist[q["respuesta_correcta"]] = dist.get(q["respuesta_correcta"], 0) + 1
    print(f"Distribución de respuestas      : {dist}")
    print("Incidencias:")
    for i in incidencias:
        print(f"  - {i}")
    if errores:
        print("ERRORES DE VALIDACIÓN:")
        for e in errores:
            print(f"  - {e}")
        sys.exit(1)
    print("Validación: OK (todas las preguntas con opciones completas y respuesta A-D o null).")


if __name__ == "__main__":
    main()
