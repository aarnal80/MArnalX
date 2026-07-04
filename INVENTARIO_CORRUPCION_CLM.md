# Corrupción de extracción en CLM (✅ RESUELTO — commit 73b07c2, jun 2026)

> **RESUELTO.** Los 3 exámenes (clm-2018/2021/2024, 315 preguntas) se re-transcribieron
> verificados contra el cuadernillo escaneado oficial (fleet de agentes Sonnet:
> transcribir→verificar anti-pegado por página), con las respuestas fijadas desde la
> plantilla oficial leída columna a columna, la numeración desplazada recolocada y las
> explicaciones regeneradas. El texto siguiente queda como histórico de los errores que
> motivaron el trabajo.

Al trabajar las imágenes (categoría B) y los duplicados (categoría D) han aparecido
**errores de extracción más profundos** en los exámenes de Castilla-La Mancha, además de
las opciones duplicadas ya corregidas. No son de la categoría B; conviene una revisión
completa de los enunciados/opciones de CLM contra los cuadernillos oficiales.

## Tipos de error detectados
1. **Opciones mal pegadas entre preguntas** (las opciones de una pregunta aparecen en otra):
   - `clm-2021-042` (hipercalcemia por cáncer microcítico): sus 4 opciones son las de
     `clm-2021-020` (síncope) — terminan igual ("…se obtiene el electrocardiograma que se
     muestra. Entre las siguientes posibilidades de actuación, ¿cuál le parece más acertada?").
2. **Enunciado mal pegado** (el enunciado pertenece a otra pregunta):
   - `clm-2024-039`: el enunciado del db era de "diabetes/glucosa" pero las opciones (y la
     pregunta real) eran de la "Pentada de Reynolds / colangitis". (Ya corregido en D.)

## Recomendación
Verificar **todo** clm-2018, clm-2021 y clm-2024 pregunta a pregunta (enunciado + 4 opciones)
contra los cuadernillos oficiales de `Examenes/Examenes/Castilla-la Mancha/`, no solo las que
tenían duplicados. Probablemente haya más casos de desplazamiento de texto.

## Fuentes oficiales (en el repo)
- clm-2018: cuadernillo en imágenes `data/paginas/clmC_p*.png`; plantilla `10.1_plantilla_correctora_definitiva_ope_urgencias_2018.pdf`
- clm-2021: `cuestionario_medico_de_urgencias.pdf` (02-oct-2021); plantilla aportada por el usuario
- clm-2024: `m_urgencias_cuestionario_respuestas_alternativas.pdf` (14-abr-2024); plantilla `16.-plantilla_definitiva_m_urgencias.pdf`

## 3. Numeración del db DESCUADRADA respecto al cuadernillo oficial (clm-2021)
La pregunta del db `clm-2021-020` (síncope, "76 años… cola de un supermercado") es en
realidad la **pregunta 32** del cuadernillo oficial; `clm-2021-042` (hipercalcemia por
cáncer microcítico) es la **pregunta 48** oficial. Es decir, el campo `n` del db NO coincide
con el número de pregunta oficial en clm-2021 (al menos en parte del examen).
- Implicación: las correcciones de duplicados se hicieron emparejando por CONTENIDO (texto de
  opciones) y usando el número oficial leído en la página, por lo que las respuestas aplicadas
  son correctas. Pero conviene revisar el mapeo `n` ↔ número oficial en una pasada completa.
- `clm-2021-042` además arrastra texto mal pegado de `clm-2021-020` ("…se obtiene el
  electrocardiograma que se muestra…" + las mismas 4 opciones de síncope).
