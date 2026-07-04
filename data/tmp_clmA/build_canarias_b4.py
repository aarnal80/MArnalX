import json, os

preguntas = [
 {
  "id_examen": 67,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Qué actividad puede demorarse no tiene que realizarse en el momento del triaje?",
  "opciones": {"A": "Glucemia en triaje caso de síndrome confusional agudo", "B": "Determinación de FR y saturación de O2 en triaje en caso de disnea", "C": "Todas las actividades mencionadas son necesarias que se realicen en el momento del triaje", "D": "ECG en triaje caso de síncope"},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "La respuesta C es la correcta porque todas las actividades mencionadas (glucemia en síndrome confusional, FR y saturación en disnea, y ECG en síncope) son maniobras diagnósticas que deben realizarse en el momento del triaje para una correcta asignación de prioridad. El triaje moderno contempla la realización de pruebas complementarias inmediatas para discriminar la urgencia vital.",
    "incorrectas": {
      "A": "La glucemia capilar en un paciente con síndrome confusional agudo sí debe realizarse en el triaje, ya que la hipoglucemia es una causa tratable e inmediata de alteración del nivel de consciencia que determina la prioridad asistencial.",
      "B": "La frecuencia respiratoria y la saturación de oxígeno en un paciente con disnea son parámetros vitales que deben medirse durante el triaje para identificar la insuficiencia respiratoria aguda y asignar correctamente el nivel de prioridad.",
      "D": "El ECG en el triaje de un paciente con síncope está indicado para detectar arritmias potencialmente letales o síndromes de preexcitación que expliquen el evento sincopal, y debe realizarse de forma inmediata."
    }
  }
 },
 {
  "id_examen": 68,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "El Consejo Español de Triage Prehospitalario y Hospitalario (CETPH) ha diseñado una cadena asistencial en incidentes con múltiples víctimas (IMV) ¿Cuál de los objetivos de los cuatro eslabones de la cadena NO es correcto?",
  "opciones": {"A": "Durante el triaje avanzado: realizar la derivación rápida y eficiente", "B": "En el área de rescate: proteger y alertar.", "C": "Durante el triaje básico: realizar las maniobras salvadoras.", "D": "Durante el triage avanzado: realizar la estabilización"},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "La opción A es incorrecta según el modelo CETPH porque el objetivo del triaje avanzado es realizar la estabilización de las víctimas, no la derivación. La derivación rápida y eficiente corresponde al eslabón de evacuación. El triaje avanzado implica una valoración más detallada y las primeras medidas terapéuticas.",
    "incorrectas": {
      "B": "El objetivo del área de rescate de proteger y alertar es correcto: se trata del primer eslabón donde se asegura la escena, se protege a los equipos intervinientes y se activa la cadena de respuesta.",
      "C": "El objetivo del triaje básico de realizar las maniobras salvadoras es correcto: en este nivel se aplican maniobras simples como apertura de vía aérea o control de hemorragia masiva para aumentar la supervivencia antes de la clasificación definitiva.",
      "D": "El objetivo del triaje avanzado de realizar la estabilización es correcto: en este eslabón se profundiza en la evaluación y se inician las medidas de estabilización hemodinámica y respiratoria necesarias."
    }
  }
 },
 {
  "id_examen": 69,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿De entre las siguientes víctimas cuál NO tiene riesgo de muerte inmediata (10 minutos) o precoz (2 horas)?",
  "opciones": {"A": "Hemoneumotórax", "B": "Laceración hepática", "C": "Contusión esplénica", "D": "Fractura de pelvis"},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "La contusión esplénica, a diferencia de la laceración, generalmente no produce hemorragia masiva de forma inmediata ni en las primeras 2 horas. Se trata de una lesión que puede manejarse de forma conservadora y cuyo sangrado, cuando se produce, suele ser más tardío (horas a días), por lo que no se considera de riesgo de muerte inmediata o precoz en la clasificación de triaje de catástrofes.",
    "incorrectas": {
      "A": "El hemoneumotórax tiene riesgo de muerte inmediata porque compromete simultáneamente la ventilación y la perfusión, pudiendo producir colapso cardiorrespiratorio en minutos si no se drena urgentemente.",
      "B": "La laceración hepática implica riesgo de muerte precoz por hemorragia intraabdominal masiva, dado que el hígado es un órgano muy vascularizado y las laceraciones pueden generar shock hipovolémico grave en menos de 2 horas.",
      "D": "La fractura de pelvis tiene riesgo de muerte precoz porque puede asociarse a hemorragia retroperitoneal masiva que cause shock hipovolémico refractario en las primeras horas del traumatismo."
    }
  }
 },
 {
  "id_examen": 70,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál es el objetivo principal del triaje en un incidente con múltiples víctimas según el Advanced Trauma Life Support (ATLS) del Comité de Trauma del Colegio Americano de Cirujanos?",
  "opciones": {"A": "Estabilizar las lesiones críticas de inmediato", "B": "Determinar la gravedad de las lesiones en cada víctima", "C": "Priorizar la atención médica basada en la gravedad de las lesiones", "D": "Coordinar la evacuación de las víctimas al centro de atención adecuado"},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "Según el ATLS, el objetivo principal del triaje en IMV es priorizar la atención médica en función de la gravedad de las lesiones, con el fin de hacer el mayor bien al mayor número de víctimas con los recursos disponibles. La priorización permite que los pacientes con lesiones graves pero supervivables reciban atención preferente frente a los que tienen lesiones menores o no supervivables.",
    "incorrectas": {
      "A": "Estabilizar las lesiones críticas de inmediato es una función terapéutica posterior al triaje; el triaje en sí es un proceso de clasificación y priorización, no de tratamiento definitivo.",
      "B": "Determinar la gravedad es una parte del proceso de triaje, pero no su objetivo final. El objetivo es usar esa determinación para establecer el orden de atención, no simplemente catalogar a las víctimas.",
      "D": "Coordinar la evacuación es una función logística que depende del triaje pero no constituye su objetivo principal; corresponde más a la fase de evacuación dentro de la cadena asistencial."
    }
  }
 },
 {
  "id_examen": 71,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál es el objetivo principal de la organización del incidente en un manejo efectivo de múltiples víctimas según el Advanced Trauma Life Support (ATLS) del Comité de Trauma del Colegio Americano de Cirujanos?",
  "opciones": {"A": "Proporcionar tratamiento definitivo a todas las víctimas en el lugar del incidente", "B": "Minimizar el tiempo de respuesta y evacuación de las víctimas", "C": "Establecer un área de triaje segura para la atención médica inicial", "D": "Coordinar la colaboración de los diferentes servicios de emergencia"},
  "respuesta_correcta": "B",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "Según el ATLS, el objetivo principal de la organización del incidente con múltiples víctimas es minimizar el tiempo de respuesta y evacuación, ya que en trauma grave cada minuto de retraso aumenta la mortalidad. Una organización eficiente del incidente busca acortar los tiempos desde el evento hasta el tratamiento definitivo en el centro adecuado.",
    "incorrectas": {
      "A": "Proporcionar tratamiento definitivo en el lugar del incidente no es el objetivo de la organización del incidente; el tratamiento definitivo se realiza en el hospital, y en el lugar solo se aplican medidas de estabilización.",
      "C": "Establecer un área de triaje segura es una medida operativa importante, pero es un medio para alcanzar el objetivo principal, no el objetivo en sí de la organización del incidente.",
      "D": "Coordinar los diferentes servicios de emergencia es necesario para la gestión del incidente, pero el ATLS identifica minimizar tiempos como el objetivo principal de la organización para mejorar el pronóstico de las víctimas."
    }
  }
 },
 {
  "id_examen": 72,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál es el principio básico en la distribución de recursos médicos limitados durante un incidente con múltiples víctimas según el Advanced Trauma Life Support (ATLS) del Comité de Trauma del Colegio Americano de Cirujanos?",
  "opciones": {"A": "Priorizar a los pacientes con lesiones más graves", "B": "Asignar recursos a los pacientes más jóvenes primero", "C": "Distribuir los recursos de manera equitativa entre todas las víctimas", "D": "Evaluar la capacidad de recuperación de cada paciente individualmente"},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "El ATLS establece que ante recursos limitados en un IMV, el principio básico es priorizar a los pacientes con lesiones más graves pero supervivables, concentrando los recursos disponibles en quienes más se pueden beneficiar de la atención médica inmediata. Esto maximiza el número de supervivientes con los recursos existentes.",
    "incorrectas": {
      "B": "La asignación de recursos basada en la edad del paciente no es un principio médico ni ético reconocido en el ATLS; la prioridad se basa en la gravedad y supervivabilidad de las lesiones, no en criterios demográficos.",
      "C": "Distribuir los recursos equitativamente entre todas las víctimas podría resultar en que ningún paciente reciba la atención suficiente; el triaje precisamente busca concentrar los recursos en quienes más los necesitan y pueden beneficiarse.",
      "D": "La evaluación individualizada de la capacidad de recuperación es parte del proceso de triaje, pero en situación de catástrofe el tiempo para evaluaciones individualizadas es muy limitado y no es el principio básico de distribución."
    }
  }
 },
 {
  "id_examen": 73,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Qué nivel PRIORIDAD se le asigna a un paciente varón de 80 años con un ICTUS TRANSITORIO en el servicio de urgencias hospitalario?",
  "opciones": {"A": "Nivel de PRIORIDAD 1", "B": "Nivel de PRIORIDAD 2", "C": "Nivel de PRIORIDAD 3", "D": "No es necesario su traslado al servicio de urgencias hospitalario"},
  "respuesta_correcta": "B",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "Un accidente isquémico transitorio (AIT) se clasifica como Prioridad 2 (urgente) en los sistemas de triaje hospitalario, ya que aunque los síntomas han cedido, el riesgo de ictus establecido en las primeras 48-72 horas es muy elevado (10-20%). Requiere evaluación médica en menos de 30 minutos pero no hay compromiso vital inmediato que justifique prioridad 1.",
    "incorrectas": {
      "A": "La Prioridad 1 se reserva para pacientes con compromiso vital inmediato como ictus activo con disminución del nivel de consciencia, no para un AIT en el que los síntomas ya han revertido.",
      "C": "La Prioridad 3 corresponde a urgencias menos graves que pueden esperar más tiempo; el AIT no puede esperar porque el riesgo de ictus establecido es máximo en las primeras horas.",
      "D": "El AIT siempre requiere evaluación hospitalaria urgente para estudio etiológico, inicio de antiagregación y medidas preventivas que reduzcan el riesgo de ictus establecido."
    }
  }
 },
 {
  "id_examen": 74,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Qué nivel PRIORIDAD se le asigna a un paciente varón de 80 años con ICTUS CON DISMINUCIÓN DEL NIVEL DE CONSCIENCIA en el servicio de urgencias hospitalario?",
  "opciones": {"A": "Nivel de PRIORIDAD 1", "B": "Nivel de PRIORIDAD 2", "C": "Nivel de PRIORIDAD 3", "D": "No es necesario su traslado al servicio de urgencias hospitalario"},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "El ictus activo con disminución del nivel de consciencia representa una emergencia neurológica con riesgo vital inmediato, lo que justifica la asignación de Prioridad 1 (emergencia). La alteración de la consciencia indica daño cerebral extenso o herniación inminente y requiere atención médica inmediata sin demora.",
    "incorrectas": {
      "B": "La Prioridad 2 sería insuficiente para un paciente con ictus activo y disminución del nivel de consciencia; este cuadro implica riesgo vital inmediato que exige atención emergente, no simplemente urgente.",
      "C": "La Prioridad 3 está reservada para situaciones menos graves; la disminución del nivel de consciencia en el ictus activo es una señal de alarma que invalida cualquier clasificación de menor urgencia.",
      "D": "Es imprescindible el traslado inmediato al servicio de urgencias hospitalario para valoración neurológica, neuroimagen urgente y posible tratamiento revascularizador dentro de la ventana terapéutica."
    }
  }
 },
 {
  "id_examen": 75,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Qué nivel PRIORIDAD se le asigna a un paciente varón de 80 años con ICTUS DE MÁS DE 24 HORAS DE EVOLUCIÓN CON SITUACIÓN VITAL PREVIA INDEPENDIENTE en el servicio de urgencias hospitalario?",
  "opciones": {"A": "Nivel de PRIORIDAD 1", "B": "Nivel de PRIORIDAD 2", "C": "Nivel de PRIORIDAD 3", "D": "No es necesario su traslado al servicio de urgencias hospitalario"},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 107, "tema": "Organización SUH. Sistemas de triaje. SUH en catástrofes."},
  "explicacion": {
    "correcta": "Un ictus de más de 24 horas de evolución en un paciente previamente independiente se clasifica como Prioridad 3 (urgencia menor) porque ya ha superado la ventana terapéutica para fibrinólisis o trombectomía mecánica, no hay compromiso vital inmediato y el paciente puede esperar para su evaluación y hospitalización programada.",
    "incorrectas": {
      "A": "La Prioridad 1 no está justificada porque no existe compromiso vital inmediato ni posibilidad de tratamiento revascularizador a las 24 horas de evolución; se reserva para emergencias con riesgo de muerte inmediata.",
      "B": "La Prioridad 2 tampoco es necesaria en este contexto; al haber superado la ventana terapéutica aguda, la urgencia disminuye y el paciente puede esperar más tiempo para ser atendido.",
      "D": "El traslado al servicio de urgencias sigue siendo necesario para confirmar el diagnóstico, descartar complicaciones, iniciar la prevención secundaria y coordinar la hospitalización para rehabilitación."
    }
  }
 },
 {
  "id_examen": 76,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "Ante una mujer de raza negra de 50 años con cefalea intensa de inicio súbito que presenta 15 puntos en la Escala de Coma de Glasgow, rigidez de nuca, sin déficit motor y que en el TC craneal no se evidencia una hemorragia subaracnoidea, ¿cuál es la primera prueba complementaria que realizaría de entre las siguientes?",
  "opciones": {"A": "Punción lumbar", "B": "Angio-TC", "C": "Arteriografía", "D": "RM cerebral y medular"},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "Ante una cefalea en trueno con TC craneal negativa para hemorragia subaracnoidea (HSA), la punción lumbar es la primera prueba a realizar para buscar xantocromía o eritrocitos en el LCR. Un TC normal no excluye la HSA en las primeras horas, y la punción lumbar es el gold standard en este escenario clínico con alta sospecha de HSA.",
    "incorrectas": {
      "B": "La Angio-TC estaría indicada si la punción lumbar confirma la HSA o si la sospecha de aneurisma es muy alta, pero no es la primera prueba ante un TC normal con sospecha de HSA: primero hay que confirmar el sangrado subaracnoideo.",
      "C": "La arteriografía cerebral es la prueba definitiva para caracterizar aneurismas, pero no se realiza de primera intención; se reserva para planificación terapéutica una vez confirmada la HSA.",
      "D": "La RM cerebral y medular no es la primera prueba en este contexto; aunque puede detectar sangre en el espacio subaracnoideo, es menos accesible en urgencias y la punción lumbar es más directa y disponible."
    }
  }
 },
 {
  "id_examen": 77,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "Ante una mujer de 78 años con aspecto mixedematoso, saturando 93%, TA 100/60, FC 60, GCS 12 puntos, sin rigidez de nuca, sin focalidad motora, glucemia 70 mg/dL, antes de administrar levotiroxina y actocortina ¿qué realizaría primero a la llegada al SUH?",
  "opciones": {"A": "Medir la temperatura corporal", "B": "Administrar precozmente ceftriaxona y aciclovir", "C": "Realizar electrocardiograma", "D": "Preparar para realizar punción lumbar"},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 73, "tema": "Crisis tirotóxica. Crisis addisoniana. Crisis mixedematosa."},
  "explicacion": {
    "correcta": "En la crisis mixedematosa, la hipotermia es el dato diagnóstico y pronóstico más relevante, pudiendo ser tan grave que no sea percibida por el paciente ni la familia. La medición de la temperatura corporal es la primera acción porque confirma el diagnóstico de coma mixedematoso (hipotermia < 35°C es característica), orienta la urgencia del tratamiento y determina la necesidad de medidas de recalentamiento activo.",
    "incorrectas": {
      "B": "Administrar ceftriaxona y aciclovir empírica estaría indicado si hubiera sospecha de meningoencefalitis, pero la ausencia de rigidez de nuca y el contexto clínico de hipotiroidismo severo con aspecto mixedematoso hacen que no sea la primera acción.",
      "C": "El ECG es importante en la crisis mixedematosa (puede mostrar bradicardia, bajo voltaje, bloqueos), pero la medición de temperatura tiene prioridad diagnóstica porque confirma la hipotermia característica del cuadro.",
      "D": "La punción lumbar no está indicada como primera medida sin datos de irritación meníngea; en este contexto clínico de sospecha de coma mixedematoso, primero hay que confirmar la hipotermia y estabilizar al paciente."
    }
  }
 },
 {
  "id_examen": 78,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "En caso de hipertensión intracraneal (HIC) ¿qué NO está indicado en el servicio de Urgencias hospitalario?",
  "opciones": {"A": "Realizar punción lumbar con fines terapéuticos.", "B": "Administrar dexametasona en bolo inicial de 20-40 mg y dosis posterior de 4-8 mg/12 h.", "C": "Descartar HIC si no hay bradicardia asociada a hipertensión arterial.", "D": "Utilizar sueros hipotónicos."},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "Los sueros hipotónicos (como el suero glucosado al 5% o el suero salino al 0,45%) están contraindicados en la HIC porque incrementan el edema cerebral al distribuirse libremente por el espacio intracelular. En la HIC se deben utilizar sueros isotónicos o hipertónicos (manitol, suero salino hipertónico) para reducir la presión intracraneal.",
    "incorrectas": {
      "A": "La punción lumbar con fines terapéuticos sí está indicada en algunos tipos de HIC, como la hipertensión intracraneal idiopática (pseudotumor cerebri), donde el drenaje de LCR puede aliviar la presión.",
      "B": "La dexametasona en las dosis mencionadas sí está indicada en la HIC secundaria a edema vasogénico (tumores, abscesos cerebrales), siendo una medida terapéutica eficaz y reconocida.",
      "C": "Aunque la tríada de Cushing (bradicardia, hipertensión y bradipnea) es una señal tardía de HIC grave, su ausencia no descarta la HIC; por tanto, es correcto no descartar la HIC solo por ausencia de bradicardia."
    }
  }
 },
 {
  "id_examen": 79,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "La crisis tónico-clónica generalizada es indicativa de GRAVEDAD en las siguientes circunstancias EXCEPTO en:",
  "opciones": {"A": "En el síndrome de embolia grasa asociado a traumatismos y en no asociado a traumatismos", "B": "Cuando aparece midriasis bilateral, síndrome confusional poscrítico y fiebre en lactantes.", "C": "Cuando la crisis dura más de 30 minutos.", "D": "Cuando entre las crisis repetidas no se recupera por más de 30 minutos el estado neurológico previo."},
  "respuesta_correcta": "B",
  "clasificacion_temario": {"id": 67, "tema": "Crisis epilépticas. Tratamiento urgente."},
  "explicacion": {
    "correcta": "La opción B no es un criterio de gravedad per se: la midriasis bilateral poscrítica y el síndrome confusional poscrítico son hallazgos esperados y normales tras una crisis tónico-clónica generalizada, y la fiebre en lactantes tras una convulsión febril simple no indica necesariamente gravedad. Estos signos son parte del período poscrítico normal y no implican per se un estado epiléptico grave.",
    "incorrectas": {
      "A": "El síndrome de embolia grasa, ya sea asociado o no a traumatismos, con crisis tónico-clónicas sí es indicativo de gravedad porque implica embolización de grasa al sistema nervioso central con daño neurológico secundario.",
      "C": "Una crisis tónico-clónica de más de 30 minutos define el estado epiléptico convulsivo, que es una emergencia neurológica con alta mortalidad y riesgo de daño cerebral permanente si no se trata de inmediato.",
      "D": "La no recuperación del estado neurológico previo durante más de 30 minutos entre crisis repetidas define el estado epiléptico no convulsivo, que también es una emergencia que requiere tratamiento urgente."
    }
  }
 },
 {
  "id_examen": 80,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "La intubación endotraqueal, como medida inmediata, puede evitarse EXCEPTO en uno de los siguientes casos de coma, ¿cuál es?",
  "opciones": {"A": "Paciente sin enfermedad terminal o avanzada y con GCS de 7 puntos.", "B": "Paciente en coma que no consigue una SatO2 > 90 % con oxígeno suplementario.", "C": "Paciente en coma que no se consigue una SatO2 > 90 % con oxígeno suplementario, con vómito reciente y reflejo tusígeno y faríngeo pobres.", "D": "Paciente en coma con gran infarto hemisférico."},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "En el paciente con coma por gran infarto hemisférico, la intubación endotraqueal puede evitarse (o estar contraindicada) porque se trata de una situación con pronóstico muy malo en la que la intubación solo prolongaría el proceso de muerte sin beneficio terapéutico real; la decisión debe considerar el contexto clínico, voluntades del paciente y limitación del esfuerzo terapéutico.",
    "incorrectas": {
      "A": "Un GCS de 7 puntos en un paciente sin enfermedad terminal sí indica necesidad de intubación inmediata para proteger la vía aérea, ya que un nivel de consciencia tan bajo implica incapacidad de mantener la vía aérea permeable.",
      "B": "No alcanzar una SatO2 > 90% con oxígeno suplementario en un paciente en coma es indicación absoluta de intubación endotraqueal para garantizar una oxigenación adecuada y prevenir daño hipóxico cerebral.",
      "C": "La combinación de hipoxemia refractaria, vómito reciente y reflejos protectores pobres representa la máxima indicación de intubación de secuencia rápida, ya que el riesgo de broncoaspiración es inmediato y potencialmente fatal."
    }
  }
 },
 {
  "id_examen": 81,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "Sobre el código ictus en Canarias ¿cuál afirmación es FALSA?",
  "opciones": {"A": "El código Ictus extrahospitalario está implantado en Canarias a través del teléfono de emergencias 112.", "B": "El código ictus extrahospitalario puede ser activado tras comunicarse con el 112, y tanto por personal sanitario como no sanitario.", "C": "El código Ictus intrahospitalario también se activa cuando el paciente está ingresado en planta de hospitalización.", "D": "El código Ictus intrahospitalario se produce como consecuencia de la aplicación del código extrahospitalario o a la llegada de un ictus a la puerta de urgencia del hospital."},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 68, "tema": "Accidente cerebrovascular agudo. Código ictus."},
  "explicacion": {
    "correcta": "La afirmación C es falsa porque el código ictus intrahospitalario clásico hace referencia a los casos que llegan a través del sistema extrahospitalario o a la puerta de urgencias, no a los pacientes ya ingresados en planta. Para pacientes ingresados que desarrollan un ictus existe un protocolo específico de ictus intrahospitalario de planta que es diferente al código ictus estándar.",
    "incorrectas": {
      "A": "Es cierto que el código ictus extrahospitalario en Canarias se gestiona a través del 112, que coordina la activación de los recursos sanitarios de emergencias y el traslado preferente al hospital de guardia.",
      "B": "Es correcto que cualquier ciudadano, sanitario o no sanitario, puede activar el código ictus extrahospitalario llamando al 112; la detección precoz por parte de la población general es un objetivo de salud pública.",
      "D": "Es cierto que el código ictus intrahospitalario se activa como consecuencia de la llegada de un paciente con ictus a urgencias (desde el sistema extrahospitalario o por llegada espontánea), lo que dispara el protocolo de atención urgente al ictus dentro del hospital."
    }
  }
 },
 {
  "id_examen": 82,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "Todas estas afirmaciones sobre el ictus son falsas EXCEPTO una, señálese:",
  "opciones": {"A": "Se define como accidente isquémico transitorio (AIT) el déficit neurológico focal que no deja evidencia en la neuroimagen, habitualmente sin que tenga importancia la duración del déficit en la evidencia en la neuroimagen.", "B": "El ictus hemorrágico tiene como etiología más frecuente es la hipertensión arterial y, por ello, es más frecuente que el ictus isquémico.", "C": "La anticoagulación terapéutica cuando está indicada, se inicia antes de las 48 horas.", "D": "En el ictus isquémico sin criterios de revascularización y riesgo de aspiración, se administra acetilsalicilato de lisina i.v. (450 mg/día; 1/2 ampolla) como alternativa al ácido acetilsalicílico vía oral y al clopidogrel vía oral."},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 68, "tema": "Accidente cerebrovascular agudo. Código ictus."},
  "explicacion": {
    "correcta": "La opción D es cierta: en el ictus isquémico sin criterios de revascularización y con riesgo de aspiración que impide la vía oral, el acetilsalicilato de lisina intravenoso (450 mg/día, media ampolla) es la alternativa validada al AAS oral o al clopidogrel oral para iniciar la antiagregación precoz dentro de las primeras 48 horas.",
    "incorrectas": {
      "A": "La afirmación sobre el AIT es imprecisa; la definición moderna de AIT es tisular (ausencia de infarto en neuroimagen) y la frase sugiere que la duración no importa en relación con la neuroimagen, lo cual puede inducir a error clínico.",
      "B": "Es falso que el ictus hemorrágico sea más frecuente que el isquémico; el ictus isquémico representa el 80-85% de todos los ictus, siendo el hemorrágico solo el 15-20%, aunque la HTA sea su causa más frecuente.",
      "C": "Es falso que la anticoagulación se inicie antes de las 48 horas en el ictus isquémico; las guías recomiendan esperar al menos 48-72 horas (o más según el tamaño del infarto) para evitar la transformación hemorrágica."
    }
  }
 },
 {
  "id_examen": 83,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál de las siguientes características NO define al síndrome confusional agudo?",
  "opciones": {"A": "Cursa con agitación psicomotriz pero no con somnolencia o letargo.", "B": "Su origen es orgánico y suele ser reversible.", "C": "Alteración aguda de déficit de atención y de evolución fluctuante.", "D": "Es sinónimo de delirio o encefalopatía tóxico-metabólica."},
  "respuesta_correcta": "A",
  "clasificacion_temario": {"id": 92, "tema": "Crisis de ansiedad. Agitación psicomotriz. Psicosis agudas. Síndrome confusional."},
  "explicacion": {
    "correcta": "La opción A es falsa porque el síndrome confusional agudo (SCA) puede cursar tanto con hiperactividad (agitación psicomotriz, hipervigilia) como con hipoactividad (somnolencia, letargo, apatía). La forma hipoactiva es de hecho la más frecuente y la más infradiagnosticada, especialmente en ancianos; afirmar que solo cursa con agitación es incorrecto.",
    "incorrectas": {
      "B": "El origen orgánico y la reversibilidad son características definitorias del SCA; a diferencia de las demencias, el delirio tiene causa identificable y suele resolverse al tratar la causa subyacente.",
      "C": "La alteración aguda de la atención con evolución fluctuante es el criterio nuclear del SCA según el DSM-5 y el instrumento CAM, siendo imprescindible para el diagnóstico.",
      "D": "El SCA es sinónimo de delirio (en terminología DSM-5) y de encefalopatía tóxico-metabólica (en terminología neurológica), siendo términos equivalentes que describen el mismo síndrome clínico."
    }
  }
 },
 {
  "id_examen": 84,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál de los siguientes síntomas o signos clínicos NO se corresponde con la posible neuralgia afectada?",
  "opciones": {"A": "Dolor retroocular con visión borrosa: Neuralgia del nervio oculomotor (par craneal III)", "B": "Dolor punzante y paroxístico en la región facial: Neuralgia del nervio trigémino (par craneal V)", "C": "Dolor intenso y pulsátil en la región occipital: Neuralgia occipital (generalmente relacionada con el nervio occipital mayor, que no es un par craneal)", "D": "Dolor en la mandíbula con dificultad para abrir la boca: Neuralgia del nervio glosofaríngeo (par craneal X)"},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "La opción D es incorrecta porque el dolor en la mandíbula con dificultad para abrir la boca (trismus) no corresponde al nervio glosofaríngeo (par IX, que inerva faringe, amígdalas y oído medio), sino al nervio trigémino (par V) en su rama mandibular, o puede ser de origen articular (ATM) o muscular. La neuralgia del glosofaríngeo produce dolor en la garganta, amígdalas y oído.",
    "incorrectas": {
      "A": "El dolor retroocular con visión borrosa puede asociarse a disfunción del nervio oculomotor (par III) por compresión de un aneurisma u otras causas; la asociación clínica es plausible y reconocida.",
      "B": "El dolor punzante, paroxístico y en la región facial es la presentación clásica de la neuralgia del trigémino (par V), el tipo de neuralgia craneal más frecuente, con desencadenantes como masticar, hablar o tocar la cara.",
      "C": "La neuralgia occipital producida por el nervio occipital mayor (rama del plexo cervical C2-C3) se manifiesta como dolor intenso y pulsátil en la región occipital, con posible irradiación al vértex, y es una entidad clínica bien reconocida."
    }
  }
 },
 {
  "id_examen": 85,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Sobre las cefaleas cuál es CIERTA?",
  "opciones": {"A": "Los síndromes de cefalea primaria son: migraña, cefalea de tensión y cefalea en racimos.", "B": "Las causas de cefaleas secundarias en Urgencias son: atribuida a infecciones fuera del SNC, atribuida a toxicidad por sustancia, abuso o abstinencia, a atribuida a emergencia hipertensiva, psicógena, después de la punción lumbar.", "C": "No solicitar una tomografía computarizada (TC) sin contraste urgente a un paciente con criterios de alarma en su presentación puede ser considerado como una mala praxis en la actuación médica, aunque una TC en solitario no excluye completamente la patología cerebral grave de riesgo vital.", "D": "Todas son ciertas."},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "La respuesta D es correcta porque las tres afirmaciones anteriores son verdaderas: las cefaleas primarias incluyen migraña, tensional y en racimos según la clasificación IHS; las causas de cefalea secundaria en urgencias incluyen infecciones extracraneales, intoxicaciones, emergencia hipertensiva, cefalea postpunción y psicógena; y omitir una TC urgente ante criterios de alarma puede constituir mala praxis aunque la TC no sea infalible.",
    "incorrectas": {
      "A": "La afirmación A es cierta por sí sola (migraña, tensional y en racimos son los tres síndromes de cefalea primaria principales), pero al ser todas las opciones ciertas, la respuesta completa es D.",
      "B": "La afirmación B es cierta al enumerar correctamente causas de cefalea secundaria en urgencias, pero al ser todas las opciones ciertas, la respuesta completa es D.",
      "C": "La afirmación C es cierta sobre la obligación de solicitar TC urgente ante criterios de alarma y sus limitaciones diagnósticas, pero al ser todas las opciones ciertas, la respuesta completa es D."
    }
  }
 },
 {
  "id_examen": 86,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "De los síntomas o signos indicativos de una posible cefalea secundaria y sus criterios de alarma cuáles no son criterios de solicitud de tomografía computarizada (TC) urgente?",
  "opciones": {"A": "Cefalea en pacientes que dudan del diagnóstico, en quienes existe una marcada ansiedad o que expresan temor ante un eventual proceso intracraneal grave", "B": "Cefalea refractaria a un tratamiento teóricamente correcto", "C": "Cefalea de presentación predominantemente nocturna", "D": "Todas las anteriores tienen criterios para solicitud de una TC urgente"},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 66, "tema": "Cefalea aguda. Coma. Diagnóstico diferencial."},
  "explicacion": {
    "correcta": "La respuesta D es correcta porque todos los escenarios mencionados (cefalea con ansiedad o duda diagnóstica, cefalea refractaria al tratamiento correcto y cefalea de predominio nocturno) constituyen criterios válidos para solicitar una TC craneal urgente, según las guías de la Sociedad Española y Americana de Neurología.",
    "incorrectas": {
      "A": "La ansiedad marcada y la duda diagnóstica son criterios reconocidos para solicitar TC; la exclusión de patología grave beneficia al paciente y al médico, y no solicitar la prueba en este contexto podría constituir mala praxis.",
      "B": "La refractariedad a un tratamiento teóricamente correcto es un criterio de alarma que obliga a descartar causa estructural; si la cefalea no responde al tratamiento esperado, hay que investigar por qué.",
      "C": "La cefalea de predominio nocturno es un criterio de alarma porque puede reflejar hipertensión intracraneal (que empeora en decúbito) o masas que aumentan la presión al estar tumbado, lo que justifica la TC urgente."
    }
  }
 },
 {
  "id_examen": 87,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál NO es cierta de las siguientes afirmaciones sobre el síndrome confusional agudo (SCA)?",
  "opciones": {"A": "A menudo en ancianos es infradiagnosticado en las formas hipoactivas (somnolencia o letargo).", "B": "Es habitual la fluctuación en cuestión de minutos u horas desde una presentación hiperactiva (agitación psicomotriz o hipervigilia) hacia la presentación hipoactiva (somnolencia o letargo).", "C": "Los cambios de ubicación, la realización de pruebas diagnósticas o la falta de acompañamiento familiar no se consideran un factor precipitante del SCA durante su estancia en Urgencias.", "D": "El tratamiento farmacológico es mejor evitar su uso, pues puede empeorar el SCA, y administrar como tratamiento sintomático en caso de que el comportamiento del paciente entrañe peligrosidad o interfiera con los cuidados médicos."},
  "respuesta_correcta": "C",
  "clasificacion_temario": {"id": 92, "tema": "Crisis de ansiedad. Agitación psicomotriz. Psicosis agudas. Síndrome confusional."},
  "explicacion": {
    "correcta": "La opción C es falsa porque los cambios de ubicación, la realización de pruebas diagnósticas estresantes y la falta de acompañamiento familiar son factores precipitantes bien reconocidos del SCA en el entorno hospitalario. El entorno desorientador y estresante de urgencias es un desencadenante importante del delirio en pacientes vulnerables, y su control forma parte del tratamiento no farmacológico.",
    "incorrectas": {
      "A": "Es cierto que el SCA hipoactivo (somnolencia, letargo) está infradiagnosticado en ancianos, ya que es menos llamativo clínicamente que la forma agitada y puede confundirse con cansancio, tristeza o demencia.",
      "B": "Es cierto que la fluctuación entre formas hiperactivas e hipoactivas es característica del SCA; esta variabilidad en minutos u horas es uno de los criterios diagnósticos del delirio según el DSM-5.",
      "D": "Es cierto que el tratamiento farmacológico del SCA debe evitarse siempre que sea posible (medidas no farmacológicas primero) y reservarse solo para cuando el comportamiento sea peligroso o interfiera con los cuidados."
    }
  }
 },
 {
  "id_examen": 88,
  "fuente": "Examen OPE Médico de Urgencias Hospitalarias Canarias",
  "enunciado": "¿Cuál de las siguientes afirmaciones sobre el síndrome meníngeo agudo es CIERTA?",
  "opciones": {"A": "El signo de la rigidez de nuca conlleva no solo rigidez sino también dolor a la flexión y a la rotación del cuello.", "B": "La tinción de Gram es una técnica de detección tardía por lo que no tiene relevancia en el tratamiento antibiótico en Urgencias", "C": "En una mujer de 18 años con síndrome meníngeo agudo, fiebre, rash y otalgia de 24 horas se puede esperar por el resultado del LCR antes de ponerle cefotaxima y vancomicina para evitar la yatrogenia.", "D": "Todas son falsas"},
  "respuesta_correcta": "D",
  "clasificacion_temario": {"id": 69, "tema": "Síndrome meníngeo. Encefalitis. Absceso cerebral."},
  "explicacion": {
    "correcta": "La opción D es correcta porque las tres afirmaciones previas son falsas: A es falsa porque la rigidez de nuca produce dolor a la flexión pero no necesariamente a la rotación; B es falsa porque la tinción de Gram del LCR es rápida y de gran valor diagnóstico para orientar el tratamiento antibiótico en urgencias; C es falsa y peligrosa porque ante sospecha de meningitis bacteriana con rash petequial, los antibióticos deben administrarse de inmediato sin esperar el LCR.",
    "incorrectas": {
      "A": "Es falsa porque la rigidez de nuca produce resistencia y dolor a la flexión del cuello (signo meníngeo clásico), pero no a la rotación; el dolor a la rotación es más propio de patología cervical degenerativa o muscular.",
      "B": "Es falsa porque la tinción de Gram del LCR es una técnica rápida (disponible en menos de 30 minutos) que puede identificar el germen causal en el 60-90% de las meningitis bacterianas, siendo fundamental para ajustar el tratamiento empírico.",
      "C": "Es falsa y clínicamente peligrosa: ante sospecha de meningitis bacteriana (especialmente con rash petequial sugestivo de meningococo), los antibióticos deben administrarse de inmediato sin esperar el resultado del LCR, ya que cada hora de retraso aumenta la mortalidad."
    }
  }
 }
]

output_path = "C:/Users/arnal/Desktop/Documentos/IA/opeurgencias/data/enriquecido/canarias_b4.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(preguntas, f, ensure_ascii=False, indent=1)

print(f"Written {len(preguntas)} questions to {output_path}")
