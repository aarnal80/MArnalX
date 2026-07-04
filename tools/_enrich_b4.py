# -*- coding: utf-8 -*-
"""Enriquecimiento batch 4 (id_examen 67-88) del examen Aragón 2022."""
import json, sys, io

sys.path.insert(0, r"C:\Users\arnal\Desktop\Documentos\IA\opeurgencias\tools")
from temas import TEMAS

RAW = r"C:\Users\arnal\Desktop\Documentos\IA\opeurgencias\data\crudos\RAW_ar2022.json"
OUT = r"C:\Users\arnal\Desktop\Documentos\IA\opeurgencias\data\enriquecido\ar2022_b4.json"

ENRIQ = {
    67: {
        "tema": 100,
        "correcta": "El carbón activado actúa por ADsorción, es decir, fija el tóxico a su superficie, no lo 'absorbe'; además, su eficacia se concentra en el estómago y el intestino delgado proximal, no de manera uniforme en todo el tubo digestivo. Al ser una pregunta de respuesta INCORRECTA, hay que buscar el enunciado que distorsiona el mecanismo de acción, y esta opción lo hace doblemente (mecanismo y extensión del efecto).",
        "incorrectas": {
            "A": "Es una afirmación aceptada en los protocolos: el carbón activado puede administrarse a través de la propia sonda tras el lavado gástrico, por lo que no es la opción a marcar en una pregunta de INCORRECTA.",
            "B": "El estreñimiento (e incluso la impactación fecal en dosis repetidas) es un efecto secundario clásico del carbón activado; la afirmación es verdadera.",
            "D": "Es cierto: el carbón activado no adsorbe alcoholes (etanol, metanol, etilenglicol), metales pesados, litio, hierro ni cáusticos, por lo que es ineficaz en esas intoxicaciones."
        }
    },
    68: {
        "tema": 58,
        "correcta": "Un trasudado pleural es un líquido pobre en células: típicamente presenta menos de 1.000 leucocitos/ml. Una cifra de 2.000-5.000 leucocitos/ml orienta ya a exudado (criterios celulares), por lo que NO es un valor típico de trasudado. El enfoque de la pregunta es repasar los criterios de Light y las características macroscópicas y bioquímicas que separan trasudado de exudado.",
        "incorrectas": {
            "B": "El pH del trasudado es alcalino, habitualmente entre 7,45 y 7,55 (el exudado suele tener pH 7,30-7,45), por lo que sí es un valor típico de trasudado.",
            "C": "Las proteínas inferiores a 3 g/dl son uno de los criterios clásicos de trasudado (junto a los cocientes de Light), de modo que la afirmación es correcta.",
            "D": "El trasudado es característicamente un líquido claro, de color amarillo pálido (aspecto de 'agua de roca'), por lo que la descripción es típica."
        }
    },
    69: {
        "tema": 100,
        "correcta": "Nunca se recomienda combinar carbón activado con jarabe de ipecacuana: el vómito inducido por la ipecacuana impide retener el carbón y, a la inversa, el carbón adsorbe la propia ipecacuana anulando su efecto. Además, la ipecacuana está prácticamente abandonada en los protocolos actuales de descontaminación digestiva. Es la afirmación INCORRECTA que pide el enunciado.",
        "incorrectas": {
            "B": "Es cierto que la eficacia de la ipecacuana (como la de cualquier técnica de descontaminación gástrica) decae con el tiempo y se cuestiona pasados 60-120 minutos de la ingesta.",
            "C": "Afirmación verdadera: en la ingesta de cáusticos (álcalis y ácidos) la descontaminación gástrica está contraindicada por el riesgo de reexposición esofágica y perforación.",
            "D": "Es un principio básico correcto: si la descontaminación gástrica está indicada, su rentabilidad es máxima cuanto más precoz sea (idealmente en la primera hora)."
        }
    },
    70: {
        "tema": 96,
        "correcta": "El butilbromuro de hioscina (butilescopolamina) es un anticolinérgico antisecretor y antiespasmódico; en paliativos se usa para los estertores premortem, el dolor cólico y la reducción de secreciones en la oclusión intestinal, pero no es un antiemético de uso general para el tratamiento de los vómitos. En una pregunta de EXCEPTO hay que identificar el fármaco cuya indicación principal no es antiemética.",
        "incorrectas": {
            "A": "El ondansetrón es un antagonista 5-HT3 con clara indicación antiemética, especialmente en vómitos inducidos por quimioterapia o radioterapia en el paciente oncológico-paliativo.",
            "B": "La dexametasona es un antiemético adyuvante de primera línea en paliativos (vómitos por hipertensión intracraneal, oclusión intestinal o quimioterapia).",
            "C": "La metoclopramida, procinético y antidopaminérgico, es el antiemético de elección en muchos protocolos de paliativos (vómitos por estasis gástrica, de origen farmacológico o metabólico)."
        }
    },
    71: {
        "tema": 60,
        "correcta": "Un dolor súbito en hipocondrio derecho acompañado de dificultad respiratoria obliga a descartar causas extraabdominales graves, en particular el infarto agudo de miocardio de localización inferior y el tromboembolismo pulmonar, por lo que el electrocardiograma es obligado. La clave didáctica es recordar que el dolor abdominal alto puede ser la presentación atípica de patología cardiopulmonar.",
        "incorrectas": {
            "A": "Una hematimetría normal no descarta patología quirúrgica: hay abdómenes agudos quirúrgicos con hemograma normal, sobre todo en fases precoces, ancianos e inmunodeprimidos.",
            "B": "La radiografía de tórax está indicada en el estudio del dolor abdominal agudo: detecta neumoperitoneo bajo las cúpulas, neumonías basales y derrames que simulan abdomen agudo.",
            "D": "El sistemático de orina es muy útil en el dolor abdominal (hematuria en el cólico nefrítico, leucocituria/nitritos en la infección urinaria, test de gestación en mujer fértil)."
        }
    },
    72: {
        "tema": 56,
        "correcta": "La ecocardiografía con ausencia de signos de sobrecarga del ventrículo derecho NO permite excluir el TEP: hasta la mitad de los TEP confirmados cursan sin disfunción ecocardiográfica del VD, sobre todo los no masivos. La prueba de exclusión es el dímero D (en baja probabilidad) o el angio-TC; la ecocardiografía solo apoya el diagnóstico en el paciente inestable. Es, por tanto, la afirmación FALSA.",
        "incorrectas": {
            "A": "Es cierto: el dímero D tiene un valor predictivo negativo alto, lo que permite excluir TEP en pacientes con probabilidad clínica baja o intermedia cuando es negativo.",
            "B": "Afirmación verdadera: la especificidad del dímero D cae con la edad y se recomienda el punto de corte ajustado (edad x 10 µg/L en mayores de 50 años).",
            "D": "Correcto: en el paciente hemodinámicamente inestable con sospecha de TEP, la ecocardiografía a pie de cama es útil como apoyo diagnóstico (signos de sobrecarga del VD) cuando no puede realizarse angio-TC inmediato."
        }
    },
    73: {
        "tema": 76,
        "correcta": "La resonancia magnética NO se recomienda para el diagnóstico de litiasis: los cálculos (estructuras cálcicas) producen vacío de señal y la RM tiene baja sensibilidad para detectarlos; la prueba de elección para la litiasis es el TC helicoidal sin contraste. La RM se reserva para gestantes o situaciones en las que deba evitarse la radiación, y para estudiar el nivel de la obstrucción, no la litiasis en sí. Es la opción INCORRECTA.",
        "incorrectas": {
            "A": "Es correcto: la ecografía es la prueba inicial de elección para descartar obstrucción de la vía urinaria, pues detecta con alta sensibilidad la dilatación pielocalicial (hidronefrosis).",
            "B": "Afirmación verdadera en el planteamiento clásico de la pregunta: el TC abdomino-pélvico no es la prueba de inicio sistemática; se reserva para casos dudosos, complicados o con ecografía no concluyente.",
            "D": "Es cierto: la principal limitación de la ecografía es su baja sensibilidad para detectar la litiasis en sí (especialmente la ureteral), aunque detecte bien la dilatación que provoca."
        }
    },
    74: {
        "tema": 51,
        "correcta": "El test de la mesa basculante (tilt-test) está indicado principalmente para confirmar el síncope neuromediado (reflejo o vasovagal): reproduce, mediante ortostatismo pasivo prolongado, el reflejo cardioinhibidor y/o vasodepresor responsable del cuadro en pacientes con síncopes recurrentes de causa no aclarada. Es la prueba diagnóstica clásica de este tipo de síncope.",
        "incorrectas": {
            "A": "El vértigo periférico se diagnostica clínicamente y con maniobras vestibulares (Dix-Hallpike, HINTS), no con la mesa basculante.",
            "C": "El síncope ortostático se confirma con la medición de la presión arterial en decúbito y tras el ortostatismo activo (test de bipedestación de 3 minutos); aunque el tilt-test puede mostrar hipotensión ortostática, no es su indicación principal, que es el síncope reflejo.",
            "D": "La enfermedad de Ménière es un trastorno vestibular (vértigo, hipoacusia y acúfenos) cuyo diagnóstico es clínico y audiométrico, sin relación con la mesa basculante."
        }
    },
    75: {
        "tema": 109,
        "correcta": "El Conjunto Mínimo Básico de Datos de Urgencias (CMBDU), recogido en el Manual de organización y funcionamiento de los Servicios de Urgencia hospitalarios de Aragón, se compone de variables de filiación y registro, variables de triaje y variables asistenciales (motivo, diagnóstico, destino, etc.). Los protocolos y guías de actuación clínica son documentos de soporte asistencial, no variables del registro, por lo que NO forman parte del CMBDU.",
        "incorrectas": {
            "A": "Las variables de filiación y de registro (identificación del paciente, fechas y horas de admisión) son uno de los bloques que sí integran el CMBDU.",
            "B": "Las variables de triaje (nivel de prioridad asignado, hora de clasificación) forman parte del CMBDU como bloque propio.",
            "C": "Las variables asistenciales (motivo de consulta, diagnóstico, procedimientos, destino al alta) constituyen el tercer bloque del CMBDU."
        }
    },
    76: {
        "tema": 46,
        "correcta": "La CK-MB, por su cinética de normalización rápida (48-72 h), es el marcador útil para diagnosticar el reinfarto precoz (una nueva elevación tras haber descendido) y el infarto periprocedimiento tras intervencionismo coronario, situaciones en las que la troponina, que permanece elevada días, pierde capacidad discriminativa. Esta utilidad residual de la CK-MB es un clásico de examen.",
        "incorrectas": {
            "A": "Las isoformas de la troponina son I, T y C (no existe la 'troponina S'); además, solo las troponinas I y T son cardioespecíficas y útiles clínicamente, por lo que el enunciado es falso.",
            "B": "La mioglobina es justo lo contrario: muy sensible y precoz (se eleva a las 1-2 horas) pero muy poco específica, pues se libera también desde el músculo esquelético.",
            "C": "La CK es efectivamente poco específica, pero su pico se alcanza alrededor de las 24 horas, no a las 48-72 horas; a las 48-72 horas lo que ocurre es su normalización."
        }
    },
    77: {
        "tema": 71,
        "correcta": "En el síndrome hiperglucémico hiperosmolar la prioridad es la reposición de volumen: se recomienda suero salino a 15-20 ml/kg/h (aprox. 1-1,5 L) en la primera hora y continuar después a 250-500 ml/h, ajustando según comorbilidad cardiorrenal, diuresis y respuesta hemodinámica. Es la única opción que reproduce fielmente las pautas de los protocolos de descompensaciones hiperglucémicas.",
        "incorrectas": {
            "B": "Es al revés: ante hipopotasemia grave (K < 3,3 mEq/L) se debe RETRASAR o suspender la insulina y reponer primero el potasio, porque la insulina lo introduce en la célula y agravaría la hipopotasemia con riesgo de arritmias.",
            "C": "El bicarbonato no ha demostrado mejorar la evolución de la cetoacidosis y solo se plantea, de forma controvertida, con pH inferior a 6,9-7,0, no con pH menor de 7,20.",
            "D": "Durante la fase aguda el control de glucemia capilar debe ser horario (cada 1 hora) mientras dura la perfusión de insulina, no cada 4 horas."
        }
    },
    78: {
        "tema": 88,
        "correcta": "Las fracturas de pelvis tipo C de la clasificación de Tile son las producidas por cizallamiento vertical, con inestabilidad rotacional Y vertical por disrupción completa del arco posterior: son las más graves y prácticamente siempre requieren tratamiento quirúrgico (fijación). Por tanto, afirmar que 'rara vez requieren cirugía' es la característica falsa que pide la pregunta.",
        "incorrectas": {
            "A": "Es cierto: el mecanismo típico de las tipo C es el cizallamiento vertical (caídas de altura, atropellos), que desgarra por completo el complejo ligamentoso posterior.",
            "B": "Verdadero: las tipo C son inestables rotacionalmente (a diferencia de las tipo A, estables, y como las tipo B).",
            "D": "Verdadero: la inestabilidad vertical es precisamente el rasgo que define a las tipo C frente a las tipo B (inestables solo rotacionalmente)."
        }
    },
    79: {
        "tema": 57,
        "correcta": "La embolia pulmonar es la causa MENOS frecuente de hemoptisis masiva de las enumeradas: el TEP suele producir hemoptisis leve-moderada (por infarto pulmonar) y rara vez masiva. Las causas clásicas de hemoptisis masiva en nuestro medio son las bronquiectasias, el carcinoma broncogénico, la tuberculosis y los abscesos/cavidades pulmonares, por la hipertrofia de la circulación bronquial sistémica que conllevan.",
        "incorrectas": {
            "A": "El carcinoma broncogénico es una de las causas más frecuentes de hemoptisis masiva por invasión y necrosis de vasos bronquiales.",
            "B": "Las bronquiectasias son la causa clásica y más citada de hemoptisis masiva, por la marcada hipertrofia e hipervascularización de las arterias bronquiales.",
            "C": "El absceso pulmonar y las lesiones cavitadas pueden erosionar vasos y producir hemoptisis masiva con mayor frecuencia que el TEP."
        }
    },
    80: {
        "tema": 102,
        "correcta": "A diferencia de los habones de la urticaria, que son fugaces y desaparecen en menos de 24 horas, el angioedema afecta a dermis profunda y tejido celular subcutáneo y su resolución es LENTA, pudiendo tardar hasta 48-72 horas. Por eso la afirmación de que se resuelve en menos de 24 horas es la EXCEPCIÓN (falsa) que pide el enunciado.",
        "incorrectas": {
            "A": "Es característico del angioedema: instauración rápida (minutos-horas) y distribución asimétrica, típicamente en cara, labios, párpados, genitales y extremidades.",
            "C": "Verdadero: al asentar en dermis profunda y subcutáneo, el angioedema no suele presentar lesiones cutáneas superficiales (no hay habones ni eritema marcado, y el prurito es escaso, predominando la sensación de tensión o dolor).",
            "D": "Cierto: el angioedema puede afectar a mucosas digestivas (dolor abdominal, vómitos) y respiratorias (edema de glotis), siendo esta última la complicación más temida."
        }
    },
    81: {
        "tema": 103,
        "correcta": "La trombosis venosa asociada a catéter es una complicación TARDÍA o diferida, que se desarrolla días o semanas después de la inserción por la presencia mantenida del catéter en la luz vascular. Las complicaciones inmediatas de la canalización son las mecánicas: punción arterial, neumotórax, hemotórax, arritmias por la guía y embolismo aéreo.",
        "incorrectas": {
            "A": "El embolismo aéreo es una complicación inmediata clásica, que puede producirse durante la punción o la conexión del sistema si entra aire en la circulación venosa.",
            "C": "Las arritmias (extrasístoles, taquicardias) son complicaciones inmediatas típicas, provocadas por la estimulación endocárdica de la guía o el catéter al avanzar hacia la aurícula derecha.",
            "D": "El neumotórax es la complicación mecánica inmediata más característica de los abordajes subclavio y yugular, por punción pleural accidental."
        }
    },
    82: {
        "tema": 77,
        "correcta": "Un resultado combinado negativo de nitritos y esterasa leucocitaria reduce mucho la probabilidad de infección urinaria (alto valor predictivo negativo) pero NO la excluye: hay falsos negativos por orinas diluidas, gérmenes que no reducen nitratos (enterococo, Pseudomonas, estafilococos), micciones frecuentes o infecciones por microorganismos atípicos. Si la clínica es sugestiva debe cursarse urocultivo. Por eso es la afirmación INCORRECTA.",
        "incorrectas": {
            "A": "Es cierto: los nitritos positivos son muy específicos de bacteriuria por enterobacterias (especificidad >90%) pero poco sensibles, pues requieren tiempo de permanencia de la orina en la vejiga y gérmenes reductores de nitratos.",
            "C": "Verdadero: las orinas muy diluidas (poliuria, ingesta abundante de líquidos) pueden dar falsos negativos de leucocituria al diluir la esterasa leucocitaria.",
            "D": "Cierto: Chlamydia trachomatis (como otros patógenos atípicos) no crece en los medios habituales ni reduce nitratos, por lo que puede cursar con bacteriuria y nitritos negativos."
        }
    },
    83: {
        "tema": 86,
        "correcta": "La afirmación es incorrecta porque define mal la miosis: las pupilas mióticas son las menores de 2 mm, mientras que 3-4 mm corresponde a un tamaño pupilar medio o normal. En la valoración pupilar del TCE se distinguen pupilas puntiformes (<1 mm), mióticas (<2 mm), medias (2-5 mm) y midriáticas (>5 mm), además de su simetría y reactividad a la luz. El error numérico convierte a esta opción en la respuesta a marcar.",
        "incorrectas": {
            "B": "Es cierto: los vómitos son frecuentes tras un TCE y pueden aparecer tanto con hipertensión intracraneal como sin ella (origen vestibular o vagal), por lo que de forma aislada tienen valor limitado.",
            "C": "Afirmación correcta según el planteamiento clásico: en la fase inicial del TCE la paresia del VI par suele reflejar lesión directa (fractura de base, lesión orbitaria); como falso signo localizador de hipertensión intracraneal aparece de forma más tardía.",
            "D": "Verdadero: el edema de papila tarda horas-días en desarrollarse (signo tardío de hipertensión intracraneal), pero debe buscarse sistemáticamente en el fondo de ojo de la exploración neurológica."
        }
    },
    84: {
        "tema": 64,
        "correcta": "Ante una hernia inguinal dolorosa e irreductible, la aparición de fiebre es el dato que sugiere estrangulación con isquemia y necrosis del asa intestinal: la fiebre, junto con el dolor continuo intenso, los signos inflamatorios locales y la leucocitosis, traduce sufrimiento vascular del asa y posible translocación bacteriana, y obliga a cirugía urgente. La pregunta se enfoca diferenciando incarceración (obstrucción mecánica) de estrangulación (compromiso vascular).",
        "incorrectas": {
            "B": "La diarrea no es un signo de estrangulación; en todo caso puede verse de forma inespecífica al inicio de una obstrucción incompleta (diarrea paradójica), sin implicar isquemia.",
            "C": "El estreñimiento pertinaz orienta a obstrucción intestinal mecánica (incarceración), pero no diferencia por sí mismo la existencia de compromiso vascular del asa.",
            "D": "La distensión abdominal es propia de cualquier obstrucción intestinal establecida y no indica específicamente estrangulación ni isquemia."
        }
    },
    85: {
        "tema": 49,
        "correcta": "Según las guías de insuficiencia cardiaca (ESC), la determinación de péptidos natriuréticos (BNP/NT-proBNP) en todo paciente con disnea aguda y sospecha de ICA, para diferenciarla de la disnea no cardiaca, tiene grado de recomendación I con nivel de evidencia A. Es la única de las cuatro determinaciones que alcanza ese nivel de evidencia en el abordaje inicial en urgencias.",
        "incorrectas": {
            "B": "El ECG de 12 derivaciones está recomendado en todo paciente con sospecha de ICA, pero con clase I y nivel de evidencia C, no A.",
            "C": "La ecocardiografía inmediata solo se recomienda en pacientes hemodinámicamente inestables (recomendación I C); en el resto puede diferirse (precoz, en las primeras 48 h), por lo que el grado IA es incorrecto.",
            "D": "Las determinaciones de laboratorio básicas (troponinas, glucosa, función renal, iones, hemograma) se recomiendan con clase I pero nivel de evidencia C, no A."
        }
    },
    86: {
        "tema": 82,
        "correcta": "Los antiagregantes NO forman parte del tratamiento del shock séptico ni previenen la coagulación intravascular diseminada; la CID se maneja tratando la causa (la propia sepsis) y con soporte hemoterápico si hay sangrado. El tratamiento inicial del shock séptico se basa en la reanimación con cristaloides, antibioterapia precoz, control del foco y vasopresores (noradrenalina de elección). Es la medida EXCEPTO que pide el enunciado.",
        "incorrectas": {
            "A": "La administración de cargas de cristaloides (suero salino fisiológico o soluciones balanceadas, 30 ml/kg iniciales) es el primer pilar de la reanimación del shock séptico.",
            "B": "La primera dosis de antibiótico intravenoso debe administrarse lo antes posible, idealmente en la primera hora, tras extraer hemocultivos; cada hora de retraso aumenta la mortalidad.",
            "D": "Si la hipotensión persiste pese a la fluidoterapia, están indicados los vasopresores, siendo la noradrenalina el fármaco de elección para mantener una PAM ≥ 65 mmHg."
        }
    },
    87: {
        "tema": 60,
        "correcta": "En la peritonitis generalizada lo característico es el SILENCIO abdominal: la irritación peritoneal difusa provoca un íleo paralítico reflejo con abolición del peristaltismo ('abdomen en tabla' silente), no un peristaltismo aumentado. El peristaltismo aumentado o de lucha es propio de la obstrucción intestinal mecánica y de las gastroenteritis. Por eso esta es la afirmación FALSA.",
        "incorrectas": {
            "A": "Es cierto: la ictericia asociada a dolor abdominal orienta a patología biliopancreática (colecistitis, coledocolitiasis, colangitis, pancreatitis).",
            "B": "Verdadero: en mujer joven con amenorrea y metrorragia más dolor abdominal debe sospecharse siempre embarazo ectópico, primera causa obstétrica de abdomen agudo en edad fértil.",
            "D": "Correcto: la posición antiálgica con flexión de cadera y rodilla (signo del psoas) es característica de la apendicitis retrocecal, por la irritación del músculo psoas."
        }
    },
    88: {
        "tema": 84,
        "correcta": "Con más de 500 CD4/mm3 el paciente VIH se considera inmunocompetente o sin inmunodepresión significativa, no en 'inmunodepresión leve': las causas de fiebre a este nivel son las mismas que en la población general, no específicamente la neumonía neumocócica como infección oportunista. El esquema de examen vincula cada escalón de CD4 con sus infecciones oportunistas, y esta opción etiqueta mal el primer escalón, por lo que es la INCORRECTA.",
        "incorrectas": {
            "B": "Es correcto: entre 200 y 500 CD4/mm3 (inmunodepresión moderada) aumentan las neumonías bacterianas, la tuberculosis y las infecciones oportunistas menores (candidiasis oral, leucoplasia vellosa, herpes zóster).",
            "C": "Verdadero: por debajo de 200 CD4/mm3 aparecen las infecciones definitorias de SIDA (neumonía por Pneumocystis jirovecii, TBC diseminada, candidiasis esofágica, toxoplasmosis) y tumores asociados (linfoma no Hodgkin, sarcoma de Kaposi).",
            "D": "Cierto: con menos de 100 CD4/mm3 (inmunodepresión muy grave) son propias la enfermedad por CMV, las micobacterias atípicas, la criptococosis, la leucoencefalopatía multifocal progresiva y el linfoma cerebral primario."
        }
    },
}

with open(RAW, encoding="utf-8") as f:
    raw = json.load(f)

out = []
for q in raw:
    i = q.get("id_examen", -1)
    if not (67 <= i <= 88):
        continue
    e = ENRIQ[i]
    tid = e["tema"]
    out.append({
        "id_examen": i,
        "fuente": q["fuente"],
        "enunciado": q["enunciado"],
        "opciones": q["opciones"],
        "respuesta_correcta": q["respuesta_correcta"],
        "clasificacion_temario": {"id": tid, "tema": TEMAS[tid] if tid else "Clasificación no encontrada"},
        "explicacion": {"correcta": e["correcta"], "incorrectas": e["incorrectas"]},
    })

out.sort(key=lambda x: x["id_examen"])
assert len(out) == 22, len(out)

# sanity: incorrectas must be the 3 letters distinct from respuesta_correcta
for o in out:
    rc = o["respuesta_correcta"]
    letras = set(o["explicacion"]["incorrectas"].keys())
    assert rc not in letras and letras | {rc} == {"A", "B", "C", "D"}, (o["id_examen"], rc, letras)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print("OK", len(out))
