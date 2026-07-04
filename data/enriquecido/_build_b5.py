# -*- coding: utf-8 -*-
import json

RAW = r'C:\Users\arnal\Desktop\Documentos\IA\opeurgencias\data\crudos\RAW_ar2018.json'
OUT = r'C:\Users\arnal\Desktop\Documentos\IA\opeurgencias\data\enriquecido\ar2018_b5.json'

with open(RAW, encoding='utf-8') as f:
    data = json.load(f)

sel = sorted([q for q in data if 89 <= q.get('id_examen', 0) <= 110],
             key=lambda x: x['id_examen'])

# id_examen -> (tema_id, tema_nombre, correcta_expl, {letra: expl})
E = {
 89: (98, "Lesiones por agentes físicos y ambientales. Lesiones por electricidad y rayos. Hipotermia.",
   "La pregunta busca la afirmación FALSA. La opción C es incorrecta porque un arco eléctrico de alto voltaje puede producir quemaduras por fulguración o por ignición de la ropa aun sin contacto físico directo entre la víctima y el conductor; el arco voltaico salta la distancia y genera temperaturas de miles de grados. Enfoque: en quemaduras eléctricas hay que distinguir el mecanismo (contacto, arco, fulguración) y recordar que la ausencia de contacto NO descarta lesión.",
   {"A": "Es cierta: en las quemaduras electrotérmicas por contacto se identifican típicamente un punto de entrada y otro de salida de la corriente.",
    "B": "Es cierta: las quemaduras por llamarada o fulguración suelen ser superficiales porque el contacto con la energía es muy breve.",
    "D": "Es cierta: en el alto voltaje el daño profundo (muscular, óseo) hace poco fiables las escalas de superficie corporal, que infraestiman la lesión real."}),

 90: (51, "Síncope. Concepto y etiología del síncope. Valoración, diagnóstico y tratamiento en urgencias.",
   "Se pide la afirmación INCORRECTA. La opción B es falsa: el síncope neuromediado (reflejo/vasovagal) se caracteriza precisamente por presentar pródromos (náuseas, sudoración, visión borrosa, calor, mareo) antes de la pérdida de conciencia. La presencia de pródromos es un dato clave que lo diferencia del síncope cardiogénico, que suele ser brusco y sin aviso.",
   {"A": "Es cierta: el síncope neuromediado puede tener un componente vasopresor, cardioinhibidor o mixto según la respuesta autonómica predominante.",
    "C": "Es cierta: suele identificarse un desencadenante (bipedestación prolongada, dolor, calor, emoción, visión de sangre).",
    "D": "Es cierta: el síncope reflejo es frecuente tras el esfuerzo (el síncope DURANTE el esfuerzo orienta a causa cardiaca y obliga a estudio)."}),

 91: (81, "Síndrome febril del paciente adulto no inmunodeprimido. Valoración y actuación en urgencias. Resistencia bacteriana a antimicrobianos.",
   "La fiebre héctica o 'en agujas' es una forma extrema de fiebre intermitente, con oscilaciones muy amplias entre picos altos y temperaturas normales o subnormales en el mismo día, dando una gráfica en picos puntiagudos ('agujas'). Por eso la respuesta correcta es C. Enfoque: clasificar los patrones febriles (continua/sostenida, remitente, intermitente, recurrente) según la amplitud de las oscilaciones diarias.",
   {"A": "La fiebre sostenida o continua mantiene la temperatura elevada con oscilaciones diarias menores de 1 ºC, sin volver a la normalidad.",
    "B": "La fiebre recurrente alterna periodos de fiebre de días con periodos afebriles también de días, no las oscilaciones diarias de la héctica.",
    "D": "La fiebre remitente oscila más de 1 ºC al día pero sin alcanzar nunca la temperatura normal; la héctica es un subtipo de la intermitente, no de la remitente."}),

 92: (88, "Fracturas y luxaciones de pelvis y columna vertebral. Valoración, diagnóstico y tratamiento en urgencias.",
   "La respuesta correcta es A: las fracturas vertebrales osteoporóticas se producen con frecuencia tras traumatismos de baja energía (incluso espontáneamente o con esfuerzos mínimos como toser o levantar peso), debido a la fragilidad del hueso osteoporótico. Enfoque: el perfil típico es mujer posmenopáusica con fractura por aplastamiento dorsolumbar baja tras mínimo traumatismo.",
   {"B": "Falsa: el segmento más afectado es la unión dorsolumbar (T12-L1), no L3-L5.",
    "C": "Falsa: la incidencia es claramente mayor en mujeres (osteoporosis posmenopáusica), no en varones.",
    "D": "Falsa: el tratamiento inicial es conservador (analgesia, ortesis, movilización); la cirugía/vertebroplastia se reserva para casos seleccionados, no es la primera opción."}),

 93: (60, "Dolor abdominal agudo. Diagnóstico diferencial.",
   "Se pide la afirmación INCORRECTA. La opción C es falsa: en la isquemia mesentérica aguda la hiperlactacidemia tiene VALOR diagnóstico relevante, siendo un marcador de hipoperfusión y necrosis intestinal y un signo de gravedad/mal pronóstico. Enfoque: sospechar isquemia mesentérica ante dolor abdominal intenso desproporcionado en anciano con factores embolígenos, apoyándose en lactato y angio-TC.",
   {"A": "Es cierta: afecta predominantemente a pacientes ancianos, en la 7ª-8ª décadas de la vida.",
    "B": "Es cierta: la fibrilación auricular es factor de riesgo clásico por embolismo de la arteria mesentérica superior.",
    "D": "Es cierta: el dolor desproporcionado respecto a los hallazgos exploratorios (abdomen poco doloroso a la palpación) es el dato semiológico característico."}),

 94: (96, "Cuidados paliativos en urgencias.",
   "La respuesta correcta es D. La clorpromazina NO se administra por vía subcutánea en el paciente paliativo porque es muy irritante para el tejido subcutáneo y produce necrosis/induración en el punto de inyección; en sedación se prefieren levomepromazina o midazolam por vía SC. Enfoque: conocer qué fármacos son compatibles con la vía subcutánea, vía de elección en paliativos cuando falla la oral.",
   {"A": "La oxicodona (opioide) puede administrarse por vía subcutánea para el control del dolor en paliativos.",
    "B": "La ranitidina puede usarse por vía subcutánea sin problemas de tolerancia local.",
    "C": "La calcitonina puede administrarse por vía subcutánea (uso en hipercalcemia/dolor óseo)."}),

 95: (41, "Soporte vital básico y avanzado en el adulto y en el niño. Protocolos de actuación. Desfibrilación externa semiautomática.",
   "La respuesta correcta es B: en la parada cardiaca con ritmo NO desfibrilable (asistolia/AESP), las guías recomiendan administrar adrenalina lo antes posible, ya que no hay desfibrilación que priorizar. En los ritmos desfibrilables la adrenalina se administra tras el tercer choque. Enfoque: dominar el momento de administración de la adrenalina según el ritmo.",
   {"A": "Falsa: la vasopresina no ha demostrado superioridad sobre la adrenalina; ya no se recomienda de forma rutinaria.",
    "C": "Falsa: los vasopresores (adrenalina) están indicados en TODOS los ritmos de parada, especialmente en los no desfibrilables.",
    "D": "Falsa: la combinación de vasopresina y adrenalina no ha mostrado beneficio sobre la adrenalina sola a dosis estándar."}),

 96: (74, "Alteraciones de la hemostasia. Anticoagulación. Problemas trasfusionales y hemoderivados.",
   "La respuesta correcta es C: la dosis de idarucizumab es de 5 g por vía intravenosa, administrada en dos viales de 2,5 g cada uno. Enfoque: el idarucizumab es el agente reversor específico del dabigatrán (inhibidor directo de la trombina), útil ante hemorragia grave o cirugía urgente.",
   {"A": "Falsa: el idarucizumab revierte únicamente el dabigatrán, no todos los anticoagulantes directos (para los anti-Xa como rivaroxabán/apixabán se usa andexanet alfa).",
    "B": "Falsa: se utiliza tanto en hemorragia grave/no controlada como en cirugía o procedimientos urgentes, no solo en cirugía.",
    "D": "Falsa: no requiere obligatoriamente soporte con hemoderivados ni complejo protrombínico; es un reversor específico que actúa por sí mismo."}),

 97: (68, "Accidente cerebrovascular agudo. Código ictus en la CCAA de Aragón.",
   "La respuesta correcta es C: se activa código ictus y, en ausencia de contraindicaciones, la paciente es candidata a fibrinólisis intravenosa con alteplasa. La última vez vista asintomática fue hace 3 horas (dentro de la ventana de 4,5 h), el Rankin previo es bueno (1) y el INR de 1,6 está por debajo del límite que contraindica la trombólisis (>1,7). Enfoque: en el código ictus el tiempo de referencia es la última vez vista asintomática, no el momento del despertar.",
   {"A": "Falsa: el inicio no es desconocido a efectos prácticos; consta la última vez asintomática (3 h antes), que sí permite calcular la ventana terapéutica.",
    "B": "Falsa: el tratamiento con acenocumarol no contraindica la fibrinólisis por sí mismo si el INR es ≤1,7 (aquí 1,6).",
    "D": "Falsa: un NIHSS alto (16) no contraindica la fibrinólisis; el ictus grave es precisamente el que más se beneficia de reperfusión."}),

 98: (71, "Diabetes mellitus: Descompensación hiperglucémica hiperosmolar no cetósica. Cetoacidosis diabética. Hiperglucemia aislada. Hipoglucemia.",
   "Se pide la propiedad que NO corresponde a las sulfonilureas. La opción C es falsa: las sulfonilureas producen aumento de peso (al ser secretagogos de insulina), y la pioglitazona también favorece la ganancia ponderal; su asociación no disminuye el peso. Enfoque: las sulfonilureas son secretagogos con riesgo de hipoglucemia y aumento de peso como efectos adversos característicos.",
   {"A": "Es cierta: las sulfonilureas son secretagogos potentes, estimulan la liberación de insulina por la célula beta.",
    "B": "Es cierta: están contraindicadas en alérgicos a sulfamidas por reactividad cruzada (comparten el grupo sulfonilo).",
    "D": "Es cierta: las formulaciones de liberación prolongada tienen menor riesgo de hipoglucemia que las de acción rápida."}),

 99: (48, "Bradiarritmias. Bloqueos auriculoventriculares. Diagnóstico y tratamiento.",
   "Se pide el fármaco NO indicado en el algoritmo de bradicardia. La opción D es correcta: el bicarbonato sódico no forma parte del algoritmo de tratamiento de la bradicardia del adulto. Enfoque: el algoritmo de bradicardia inestable contempla atropina como primera línea y, si no responde, perfusión de adrenalina o dopamina y/o marcapasos transcutáneo.",
   {"A": "Sí está indicada: la dopamina en perfusión es una de las opciones de segunda línea cuando falla la atropina.",
    "B": "Sí está indicada: la adrenalina en perfusión es alternativa de segunda línea ante bradicardia refractaria.",
    "C": "Sí está indicada: la atropina 1 mg iv en bolo (repetible hasta 3 mg) es el fármaco de primera línea."}),

 100: (89, "Valoración y tratamiento de las heridas. Traumatismos tendinosos, vasculares y nerviosos. Quemaduras. Síndrome de aplastamiento.",
   "Se pide la actuación que NO procede (EXCEPTO). La opción D es la respuesta: es falso que no esté indicada la profilaxis antitetánica ni antibiótica; en el gran quemado SÍ debe valorarse la profilaxis antitetánica, y aunque la antibioterapia profiláctica sistemática es discutida, la afirmación tal como está redactada es incorrecta. Enfoque: el manejo del gran quemado prioriza vía aérea (riesgo de inhalación), analgesia iv y reposición agresiva con cristaloides.",
   {"A": "Es correcta: el control del dolor es prioritario, por vía intravenosa y con analgesia de tercer escalón (opioides) si es preciso.",
    "B": "Es correcta: garantizar la vía aérea es crucial por el riesgo de edema por inhalación, procediendo a intubación precoz si se requiere.",
    "C": "Es correcta: el shock hipovolémico es causa de muerte precoz; se realiza resucitación agresiva con cristaloides guiada por la diuresis."}),

 101: (85, "Tuberculosis. Botulismo. Tétanos. Rabia. Fiebre en el paciente procedente del trópico. Actuación en urgencias.",
   "Se pide el tratamiento NO indicado. La opción B es correcta: los purgantes con magnesio están contraindicados en el botulismo porque el magnesio potencia el bloqueo neuromuscular y agrava la parálisis producida por la toxina botulínica. Enfoque: el botulismo se trata con antitoxina equina, medidas de soporte ventilatorio y descontaminación digestiva, evitando fármacos que empeoren el bloqueo.",
   {"A": "Sí indicado: el lavado gástrico y el carbón activado se emplean para reducir la absorción de la toxina si la ingesta es reciente.",
    "C": "Sí indicado: la antitoxina equina trivalente es el tratamiento específico que neutraliza la toxina circulante.",
    "D": "Sí indicado: el metronidazol (o penicilina) se utiliza en el botulismo por heridas para erradicar Clostridium botulinum."}),

 102: (70, "Alteraciones del equilibrio ácido-base. Trastornos hidroelectrolíticos. Valoración, diagnóstico y tratamiento urgente.",
   "La respuesta correcta es D: las quemaduras provocan hiponatremia con sodio urinario < 20 mEq/l, porque corresponden a pérdidas extrarrenales de líquido (a través de la piel) con riñón sano que retiene sodio ávidamente. Enfoque: un sodio urinario bajo (<20) indica pérdida extrarrenal con respuesta renal conservadora; un sodio urinario alto (>20) orienta a pérdida renal.",
   {"A": "Los diuréticos causan pérdida renal de sodio, por lo que el sodio urinario sería > 20 mEq/l.",
    "B": "La bicarbonaturia arrastra sodio por el túbulo, produciendo natriuresis y sodio urinario elevado.",
    "C": "La nefropatía pierde-sal cursa con incapacidad renal para reabsorber sodio, dando sodio urinario alto (>20)."}),

 103: (62, "Ictericia. Colecistitis aguda. Cólico biliar. Colangitis aguda. Fracaso hepático agudo. Encefalopatía hepática aguda. Ascitis.",
   "Según las Guías de Tokio 2013, la colecistitis aguda moderada (grado II) incluye entre sus criterios la inflamación local marcada, en la que se engloba la peritonitis biliar, por lo que la respuesta correcta es C. Enfoque: el grado II se define por leucocitosis >18.000, masa palpable dolorosa en HCD, duración >72 h e inflamación local marcada (peritonitis biliar, absceso, colecistitis gangrenosa o enfisematosa).",
   {"A": "El criterio de leucocitosis del grado II es > 18.000/mm3; 15.000 no alcanza el umbral.",
    "B": "El criterio de duración es > 72 h; 48 h no cumple el criterio de moderada.",
    "D": "Las plaquetas < 100.000/mm3 reflejan disfunción hematológica, criterio de colecistitis GRAVE (grado III), no moderada."}),

 104: (82, "Sepsis. Valoración del paciente séptico. Normas de actuación. Shock séptico y fracaso multiorgánico. Código sepsis.",
   "Se pide el fenómeno que NO forma parte del SRIS. La respuesta correcta es D: la oliguria es un signo de disfunción orgánica (sepsis grave), no un criterio de síndrome de respuesta inflamatoria sistémica. Enfoque: los criterios de SRIS son temperatura (>38 o <36 ºC), frecuencia cardiaca (>90), frecuencia respiratoria (>20) o hipocapnia (PaCO2 <32) y alteración del recuento leucocitario.",
   {"A": "La temperatura (>38 ºC o <36 ºC) es uno de los cuatro criterios clásicos de SRIS.",
    "B": "La frecuencia respiratoria >20 rpm es criterio de SRIS.",
    "C": "La hipocapnia (PaCO2 < 32 mmHg) es la alternativa gasométrica al criterio de taquipnea dentro del SRIS."}),

 105: (98, "Lesiones por agentes físicos y ambientales. Lesiones por electricidad y rayos. Hipotermia.",
   "La respuesta correcta es A: en la hipotermia leve (32-35 ºC) el ECG muestra bradicardia sinusal con inversión de la onda T y prolongación de los intervalos (QT ancho). Enfoque: los cambios electrocardiográficos progresan con el descenso térmico; la onda J de Osborn y las arritmias graves aparecen en grados más profundos.",
   {"B": "La onda J de Osborn es característica de la hipotermia moderada-grave (típicamente <32-30 ºC), no de la leve.",
    "C": "La fibrilación auricular suele aparecer en la hipotermia moderada, conforme desciende más la temperatura.",
    "D": "Las arritmias ventriculares (incluida la fibrilación ventricular) son propias de la hipotermia grave (<28-30 ºC)."}),

 106: (47, "Arritmias cardiacas. Taquiarritmias auriculares y ventriculares: extrasistolia, TPSV, flutter, fibrilación auricular, taquicardia y fibrilación ventricular.",
   "La respuesta correcta es A: CHA2DS2-VASc de 5 y HAS-BLED de 2. CHA2DS2-VASc: edad ≥75 años (2) + sexo femenino (1) + diabetes (1) + enfermedad vascular/arterial periférica (1) = 5 puntos. HAS-BLED: edad >65 años (1) + uso de fármacos con riesgo hemorrágico, los antiagregantes (1) = 2 puntos. Enfoque: dominar la puntuación de ambas escalas para estratificar riesgo embólico y hemorrágico en la fibrilación auricular.",
   {"B": "Incorrecta: el CHA2DS2-VASc no llega a 6 (no hay insuficiencia cardiaca, HTA ni ictus previo) y el HAS-BLED no llega a 3.",
    "C": "Incorrecta: aunque el CHA2DS2-VASc es 5, el HAS-BLED es 2, no 3 (no hay HTA mal controlada ni otros factores adicionales).",
    "D": "Incorrecta: infravalora el CHA2DS2-VASc, que es 5 y no 4 (la edad ≥75 puntúa 2)."}),

 107: (80, "Atención inicial del niño traumatizado. Convulsiones, fiebre, laringitis, bronquiolitis, bronquitis, crisis asmática y neumonía en el niño.",
   "Se pide la afirmación FALSA. La opción C es falsa: los corticoides nebulizados (budesonida) NO han demostrado beneficio en la bronquiolitis aguda y no se recomiendan de forma rutinaria. Enfoque: el tratamiento de la bronquiolitis es fundamentalmente de soporte (hidratación, lavados nasales, oxígeno), sin eficacia demostrada de corticoides ni broncodilatadores.",
   {"A": "Es cierta: el virus respiratorio sincitial es el agente etiológico predominante de la bronquiolitis.",
    "B": "Es cierta: los lavados nasales con suero y la elevación de la cabecera son medidas de soporte que mejoran la sintomatología.",
    "D": "Es cierta: el salbutamol nebulizado tiene eficacia dudosa/no recomendada de rutina en la bronquiolitis."}),

 108: (98, "Lesiones por agentes físicos y ambientales. Lesiones por electricidad y rayos. Hipotermia.",
   "Se pide el parámetro que NO es típico observar. La respuesta correcta es A: en la hipotermia grave NO es típica la leucocitosis; lo característico es leucopenia por secuestro esplénico y depresión medular (y, además, la hemoconcentración puede enmascarar el recuento). Enfoque: la hipotermia grave cursa típicamente con hiperglucemia, hiperpotasemia, trombopenia y hemoconcentración.",
   {"B": "Sí es típica: la hiperglucemia por inhibición de la liberación de insulina y menor captación periférica de glucosa.",
    "C": "Sí es típica: la hiperpotasemia, especialmente en hipotermias profundas y con rabdomiólisis asociada.",
    "D": "Sí es típica: la trombopenia por secuestro esplénico y depresión medular."}),

 109: (69, "Síndrome meníngeo. Encefalitis. Absceso cerebral. Valoración y tratamiento urgente.",
   "Se pide la afirmación INCORRECTA. La opción C es falsa: un LCR con glucorraquia descendida (30% de la glucemia), pleocitosis y proteínas elevadas (80 mg/dl) corresponde a un patrón de meningitis BACTERIANA (o tuberculosa), no vírica; en la meningitis vírica la glucosa es normal. El predominio mononuclear con hipoglucorraquia debe hacer pensar en TBC/Listeria, no en virus. Enfoque: interpretar el patrón citobioquímico del LCR; la hipoglucorraquia descarta etiología vírica como primera posibilidad.",
   {"A": "Es cierta: ante sospecha de meningitis bacteriana el antibiótico no debe demorarse, idealmente en los primeros 30 minutos.",
    "B": "Es cierta: se realiza TC craneal previo a la punción lumbar si hay deterioro del nivel de conciencia, focalidad o sospecha de hipertensión intracraneal.",
    "D": "Es cierta: la presencia de diplococos gramnegativos en el LCR orienta como primera posibilidad a Neisseria meningitidis (meningococo)."}),

 110: (76, "Cólico nefrítico. Litiasis renoureteral. Retención aguda de orina. Uropatía obstructiva. Hematuria. Síndrome escrotal agudo.",
   "La respuesta correcta es C: la derivación urgente de la vía urinaria superior está indicada en el paciente con obstrucción ureteral y signos de sepsis urinaria (pionefrosis), pues constituye una urgencia que requiere descompresión inmediata mediante catéter doble J o nefrostomía percutánea. Enfoque: la combinación obstrucción + infección/sepsis obliga a derivar la vía sin demora.",
   {"A": "Falsa: la cistostomía suprapúbica (talla vesical) deriva la vejiga (vía urinaria inferior), no la vía urinaria superior.",
    "B": "Falsa: el catéter doble J deriva la pelvis renal hasta la vejiga por vía interna; la derivación percutánea directa al exterior es la nefrostomía.",
    "D": "Falsa: no siempre es programada; ante obstrucción con sepsis es un procedimiento de urgencia vital."}),
}

out = []
for q in sel:
    idx = q['id_examen']
    tid, tnom, corr, incs = E[idx]
    out.append({
        "id_examen": idx,
        "fuente": q['fuente'],
        "enunciado": q['enunciado'],
        "opciones": q['opciones'],
        "respuesta_correcta": q['respuesta_correcta'],
        "clasificacion_temario": {"id": tid, "tema": tnom},
        "explicacion": {"correcta": corr, "incorrectas": incs},
    })

with open(OUT, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=2)

print("escritas", len(out), "preguntas")
# chequeo: que cada incorrectas tenga las 3 letras restantes
for o in out:
    letras = set(o['opciones'].keys())
    corr = o['respuesta_correcta']
    inc = set(o['explicacion']['incorrectas'].keys())
    esperado = letras - {corr}
    if inc != esperado:
        print("AVISO id", o['id_examen'], "incorrectas", inc, "esperado", esperado)
