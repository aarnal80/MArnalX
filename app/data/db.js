/* Banco de contenidos de Estudios.
 * Preguntas elaboradas a partir del libro de Física y Química de 1.º de
 * Bachillerato (temas 0, 1 y 2). */
"use strict";

function pregunta(id, tema, q, o, r, explicacion) {
  return { id, fuente: "fyq-santillana", tema, q, o, r,
    e: { correcta: explicacion, incorrectas: {} } };
}

window.DB = {
  version: "estudios-fyq-v1",
  fuentes: [
    {
      id: "fyq-santillana",
      nombre: "Física y Química · libro de 1.º de Bachillerato",
      idioma: "es",
      descripcion: "Preguntas elaboradas a partir de los temas 0, 1 y 2 del libro de Física y Química.",
      licencia: "Uso personal y educativo"
    }
  ],
  temas: [
    { id: 0, nombre: "La medida", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 1, nombre: "El átomo y la tabla periódica", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 2, nombre: "El enlace químico", sistema: "Física y Química", fuente: "fyq-santillana" }
  ],
  preguntas: [
    /* ============================== TEMA 0 ============================== */
    pregunta("fyq-t0-001", 0, "¿Qué deben hacer las teorías y los modelos científicos para considerarse válidos?", {
      A: "Coincidir siempre con la primera observación realizada",
      B: "Confrontarse con datos obtenidos mediante observaciones o experimentos",
      C: "Ser aceptados por la mayoría antes de hacer predicciones",
      D: "Explicar únicamente fenómenos que ya se conozcan"
    }, "B", "La ciencia relaciona teoría y experimentación: los modelos deben contrastarse con datos y hacer predicciones comprobables. Además, sus conclusiones son revisables."),
    pregunta("fyq-t0-002", 0, "¿Qué es una magnitud física?", {
      A: "Una propiedad de un sistema que puede medirse y expresarse con un número y una unidad",
      B: "Cualquier número sin unidad que aparezca en un cálculo",
      C: "Solo una propiedad que tenga dirección y sentido",
      D: "El instrumento utilizado para comparar dos objetos"
    }, "A", "Medir consiste en asignar un número a una propiedad mediante su comparación con un patrón, que es la unidad de medida."),
    pregunta("fyq-t0-003", 0, "¿Cuál de las siguientes es una magnitud vectorial?", {
      A: "La temperatura",
      B: "La energía",
      C: "La velocidad del viento",
      D: "La concentración de una disolución"
    }, "C", "Una magnitud vectorial necesita módulo, dirección y sentido. Por eso no basta con decir, por ejemplo, 35 km/h para describir completamente el viento."),
    pregunta("fyq-t0-004", 0, "¿Cuál es la diferencia entre una magnitud discreta y una continua?", {
      A: "La discreta tiene unidad y la continua no",
      B: "La discreta solo se mide en el laboratorio",
      C: "La discreta toma valores separados, mientras la continua puede tomar valores reales dentro de un intervalo",
      D: "La continua siempre es vectorial y la discreta siempre escalar"
    }, "C", "El número de partículas de un sistema es un ejemplo de magnitud discreta; la temperatura o la posición pueden representarse mediante números reales y son magnitudes continuas."),
    pregunta("fyq-t0-005", 0, "¿Qué son las magnitudes fundamentales del Sistema Internacional?", {
      A: "Las que se obtienen combinando otras magnitudes",
      B: "Las aceptadas por convenio como funcionalmente independientes",
      C: "Las que solo se utilizan en Física",
      D: "Las que no tienen unidad de medida"
    }, "B", "Las magnitudes derivadas se obtienen combinando las fundamentales. El SI establece siete magnitudes fundamentales."),
    pregunta("fyq-t0-006", 0, "¿Cuál de las siguientes listas contiene solo unidades fundamentales del SI?", {
      A: "Metro, kilogramo, segundo, amperio, kelvin, mol y candela",
      B: "Metro, litro, segundo, julio, kelvin, mol y newton",
      C: "Kilómetro, gramo, hora, amperio, grado Celsius, mol y lumen",
      D: "Metro, kilogramo, segundo, vatio, kelvin, culombio y candela"
    }, "A", "Las siete unidades fundamentales son m, kg, s, A, K, mol y cd. El litro, el julio, el newton y el vatio son unidades derivadas o aceptadas para usos concretos."),
    pregunta("fyq-t0-007", 0, "La velocidad es una magnitud derivada porque su unidad en el SI se obtiene como…", {
      A: "kg · m",
      B: "m/s",
      C: "mol/s",
      D: "K · m"
    }, "B", "La velocidad es el espacio recorrido dividido entre el tiempo empleado, por lo que su unidad es metro por segundo (m/s)."),
    pregunta("fyq-t0-008", 0, "¿Qué significa el prefijo kilo- en una unidad?", {
      A: "Multiplicar por 10⁻³",
      B: "Multiplicar por 10²",
      C: "Multiplicar por 10³",
      D: "Dividir entre 10⁶"
    }, "C", "El prefijo kilo (k) representa un factor 10³. Por ejemplo, 1 km equivale a 1000 m."),
    pregunta("fyq-t0-009", 0, "¿A qué velocidad equivale 120 km/h expresada en unidades del SI?", {
      A: "3,33 m/s",
      B: "33,3 m/s",
      C: "120 m/s",
      D: "432 m/s"
    }, "B", "Se convierten kilómetros a metros y horas a segundos: 120 · 1000/3600 = 33,3 m/s aproximadamente."),
    pregunta("fyq-t0-010", 0, "¿Cuál es la equivalencia aproximada de 1 eV en unidades del SI?", {
      A: "1,602 · 10⁻¹⁹ J",
      B: "1,602 · 10¹⁹ J",
      C: "6,022 · 10²³ J",
      D: "9,81 J"
    }, "A", "El electronvoltio es una unidad de energía muy utilizada en física atómica y de partículas: 1 eV = 1,602 · 10⁻¹⁹ J aproximadamente."),
    pregunta("fyq-t0-011", 0, "¿Qué indica la sensibilidad de un instrumento?", {
      A: "Lo cerca que está una medida del valor verdadero",
      B: "La diferencia más pequeña que puede distinguir entre dos medidas próximas",
      C: "El número de veces que se ha calibrado",
      D: "La cantidad de cifras que tiene una medida exacta"
    }, "B", "La sensibilidad está relacionada con la división más pequeña apreciable. No debe confundirse con la exactitud, que indica la proximidad al valor real."),
    pregunta("fyq-t0-012", 0, "Un instrumento es exacto cuando…", {
      A: "Repite siempre el mismo resultado, aunque sea incorrecto",
      B: "Tiene muchas divisiones, aunque esté mal calibrado",
      C: "Su medida está próxima al valor verdadero",
      D: "Da resultados diferentes cada vez"
    }, "C", "La exactitud describe la cercanía al valor real. La precisión o fiabilidad describe la capacidad de repetir un resultado bajo las mismas condiciones."),
    pregunta("fyq-t0-013", 0, "¿Cómo se pueden reducir los efectos aleatorios de una medida?", {
      A: "Repitiendo muchas veces la medida y tratando estadísticamente los datos",
      B: "Eliminando todas las cifras decimales",
      C: "Usando siempre una unidad distinta",
      D: "Tomando solo la primera medida"
    }, "A", "Los efectos aleatorios son variaciones imprevisibles. La repetición permite estimar el valor más probable y la incertidumbre mediante métodos estadísticos."),
    pregunta("fyq-t0-014", 0, "¿Qué caracteriza a un error sistemático?", {
      A: "Cambia de signo al azar en cada medida",
      B: "Se debe a una tendencia constante del instrumento, del método o de la calibración",
      C: "Solo aparece al calcular una media",
      D: "Siempre desaparece al aumentar el número de medidas"
    }, "B", "Los efectos sistemáticos se relacionan, por ejemplo, con el diseño, el funcionamiento o la calibración del instrumento. No se eliminan simplemente repitiendo medidas."),
    pregunta("fyq-t0-015", 0, "Se mide una magnitud tres veces y se obtienen 2,2; 2,4 y 2,6. ¿Cuál es su media aritmética?", {
      A: "2,2",
      B: "2,3",
      C: "2,4",
      D: "2,6"
    }, "C", "La media es (2,2 + 2,4 + 2,6)/3 = 2,4. En muchas medidas, la media se usa como mejor estimación del valor central."),
    pregunta("fyq-t0-016", 0, "¿Qué informa principalmente la desviación típica de un conjunto de medidas?", {
      A: "La unidad fundamental utilizada",
      B: "La dispersión de los resultados alrededor de la media",
      C: "El número atómico de la muestra",
      D: "La exactitud absoluta del instrumento"
    }, "B", "Una desviación típica pequeña indica resultados agrupados cerca de la media; una grande indica mayor dispersión y, por tanto, mayor incertidumbre asociada."),
    pregunta("fyq-t0-017", 0, "En una distribución aproximadamente gaussiana, ¿qué porcentaje de resultados cae aproximadamente entre la media menos una desviación típica y la media más una desviación típica?", {
      A: "18 %",
      B: "50 %",
      C: "68 %",
      D: "99,9 %"
    }, "C", "Para una distribución normal y un número elevado de observaciones, cerca del 68 % de los resultados queda dentro del intervalo media ± una desviación típica."),
    pregunta("fyq-t0-018", 0, "La notación x = 23,738(31) m equivale a…", {
      A: "x = (23,738 ± 0,031) m",
      B: "x = (23,738 ± 0,31) m",
      C: "x = (23,738 ± 31) m",
      D: "x = (23,738 ± 0,0031) m"
    }, "A", "Los dígitos entre paréntesis expresan la incertidumbre en las últimas cifras: 23,738(31) m significa 23,738 ± 0,031 m."),
    pregunta("fyq-t0-019", 0, "Se mide el lado de un cubo como L = 14,9 cm. ¿Cuál es la forma más razonable de expresar su volumen calculado?", {
      A: "V = 3307,949 cm³, con todas las cifras de la calculadora",
      B: "V ≈ 3,31 · 10³ cm³, respetando las cifras significativas del dato",
      C: "V = 14,9 cm³, porque el volumen tiene el mismo valor que el lado",
      D: "V = 331 cm³, eliminando siempre dos ceros"
    }, "B", "El cálculo da 14,9³ = 3307,949 cm³, pero el dato inicial tiene tres cifras significativas. El resultado debe redondearse coherentemente: aproximadamente 3,31 · 10³ cm³."),
    pregunta("fyq-t0-020", 0, "Si un lado medido de un cubo puede estar entre 14,85 cm y 14,95 cm, el volumen estará aproximadamente entre…", {
      A: "14,85 y 14,95 cm³",
      B: "3275 y 3341 cm³",
      C: "220 y 240 cm³",
      D: "3308 y 3310 cm³ exactamente"
    }, "B", "Como V = L³, se calculan los extremos del intervalo: 14,85³ ≈ 3275 cm³ y 14,95³ ≈ 3341 cm³."),
    pregunta("fyq-t0-021", 0, "¿Para qué se utiliza el método de los mínimos cuadrados?", {
      A: "Para escoger la unidad fundamental más pequeña",
      B: "Para ajustar una relación matemática a datos experimentales minimizando las distancias a la curva",
      C: "Para eliminar todos los datos que no coincidan con la teoría",
      D: "Para convertir cualquier gráfica en una tabla"
    }, "B", "El ajuste por mínimos cuadrados busca la curva que representa mejor la tendencia de los datos, haciendo mínima la discrepancia global entre puntos y modelo."),
    pregunta("fyq-t0-022", 0, "En una gráfica que estudia cómo depende el período T de la masa m de un sistema, ¿qué variable debe aparecer normalmente en el eje horizontal?", {
      A: "La masa m, variable independiente",
      B: "El período T, variable dependiente",
      C: "La incertidumbre, siempre",
      D: "La unidad de medida"
    }, "A", "En una representación de una dependencia T frente a m, la variable que se controla o modifica, m, se coloca en el eje horizontal; la respuesta T, en el vertical."),
    pregunta("fyq-t0-023", 0, "¿Cuál es la finalidad principal de un artículo científico?", {
      A: "Mostrar los resultados de una investigación a especialistas mediante una revista científica",
      B: "Sustituir todas las observaciones por opiniones personales",
      C: "Ser un libro extenso con conclusiones ya aceptadas por todo el mundo",
      D: "Presentar únicamente imágenes sin metodología"
    }, "A", "El artículo o paper permite compartir con rapidez resultados de investigación, contrastarlos y establecer referencias entre equipos científicos."),
    pregunta("fyq-t0-024", 0, "Al buscar información científica en internet, ¿qué práctica recomienda el libro?", {
      A: "Usar siempre el primer resultado del buscador",
      B: "Preferir fuentes reconocidas y concretar los términos de búsqueda",
      C: "Copiar literalmente el texto sin comprobarlo",
      D: "Evitar citar las páginas consultadas"
    }, "B", "Conviene usar fuentes fiables, como instituciones científicas, y búsquedas concretas. La información debe comprenderse, contrastarse y citarse."),
    pregunta("fyq-t0-025", 0, "¿Qué debe incluir un trabajo de investigación para que otras personas puedan identificar las fuentes utilizadas?", {
      A: "Solo el nombre del autor del trabajo",
      B: "Una bibliografía con los libros y enlaces consultados",
      C: "Únicamente las imágenes del experimento",
      D: "Una lista de opiniones sin referencias"
    }, "B", "La bibliografía permite localizar las fuentes y reconocer el trabajo de sus autores. Si se usan imágenes, vídeos o animaciones también debe citarse su procedencia."),

    /* ============================== TEMA 1 ============================== */
    pregunta("fyq-t1-001", 1, "¿Qué es el espectro de una radiación?", {
      A: "La masa total de la fuente luminosa",
      B: "El conjunto ordenado de las radiaciones simples que forman una radiación compleja",
      C: "La temperatura de un átomo excitado",
      D: "El número de electrones de un ion"
    }, "B", "Al descomponer una radiación compleja, como la luz solar, se obtiene el conjunto ordenado de sus radiaciones simples: su espectro."),
    pregunta("fyq-t1-002", 1, "¿Cómo se obtiene un espectro de emisión atómico?", {
      A: "Iluminando la muestra con luz blanca y observando lo que no absorbe",
      B: "Excitando la muestra y analizando la radiación que emiten sus átomos al volver a estados de menor energía",
      C: "Enfriando la muestra hasta cero kelvin",
      D: "Midiendo únicamente su número atómico"
    }, "B", "Al calentar una muestra o someterla a una descarga eléctrica, sus átomos se excitan. Cuando los electrones vuelven a estados de menor energía, emiten radiación característica."),
    pregunta("fyq-t1-003", 1, "¿Por qué el espectro de absorción de un elemento es complementario de su espectro de emisión?", {
      A: "Porque absorbe precisamente las radiaciones que puede emitir",
      B: "Porque todos los elementos absorben las mismas radiaciones",
      C: "Porque la absorción solo depende de la temperatura ambiente",
      D: "Porque los espectros de absorción no contienen líneas"
    }, "A", "Las líneas que aparecen en absorción corresponden a las mismas diferencias de energía entre niveles que originan las líneas emitidas por el elemento."),
    pregunta("fyq-t1-004", 1, "Cuando un electrón pasa de una órbita o nivel exterior a otro interior, ¿qué ocurre?", {
      A: "Absorbe un fotón siempre",
      B: "Emite un fotón cuya energía es igual a la diferencia entre ambos niveles",
      C: "Desaparece del átomo sin intercambiar energía",
      D: "Aumenta el número atómico del elemento"
    }, "B", "Un salto a un nivel de menor energía libera la diferencia energética en forma de un fotón. Un salto hacia un nivel superior requiere absorber esa energía."),
    pregunta("fyq-t1-005", 1, "¿Por qué el espectro sirve para identificar un elemento químico?", {
      A: "Porque cada elemento tiene un conjunto característico de diferencias de energía entre sus niveles",
      B: "Porque todos los elementos tienen el mismo número de líneas",
      C: "Porque el espectro solo depende del estado físico de la muestra",
      D: "Porque el color de la muestra indica directamente su símbolo"
    }, "A", "La estructura electrónica de cada elemento es particular, por lo que sus transiciones producen líneas de emisión y absorción características, como una huella dactilar."),
    pregunta("fyq-t1-006", 1, "Según el modelo de Bohr, si un electrón excitado llega hasta n = 4 y puede volver al estado fundamental mediante todas las transiciones posibles, ¿cuántas líneas de emisión pueden aparecer?", {
      A: "2",
      B: "4",
      C: "6",
      D: "8"
    }, "C", "Desde el nivel n = 4 pueden producirse las transiciones 4→3, 4→2, 4→1, 3→2, 3→1 y 2→1: seis diferencias de energía y, por tanto, seis líneas posibles."),
    pregunta("fyq-t1-007", 1, "¿Qué indica que un espectro se desdoble en más líneas al aplicar un campo magnético?", {
      A: "Que los electrones han desaparecido",
      B: "Que existen subniveles u orbitales con energías que pueden diferenciarse",
      C: "Que todos los átomos se han convertido en iones positivos",
      D: "Que el núcleo ha dejado de tener carga"
    }, "B", "El estudio de los espectros mostró que los niveles se dividen en subniveles y que estos pueden desdoblarse en presencia de un campo magnético."),
    pregunta("fyq-t1-008", 1, "¿Qué afirma el principio de dualidad onda-corpúsculo de de Broglie?", {
      A: "Solo la luz puede comportarse como partícula",
      B: "Toda partícula en movimiento lleva asociada una onda",
      C: "Un electrón siempre se mueve en una órbita circular fija",
      D: "La masa de una partícula depende de su grupo periódico"
    }, "B", "La dualidad onda-corpúsculo permite describir el comportamiento ondulatorio de partículas muy pequeñas, como los electrones atómicos."),
    pregunta("fyq-t1-009", 1, "¿Qué establece el principio de incertidumbre de Heisenberg?", {
      A: "No se puede conocer a la vez y con exactitud la posición y el momento lineal del electrón",
      B: "Los electrones no tienen energía",
      C: "El número de protones y neutrones siempre es igual",
      D: "Todo átomo tiene exactamente ocho electrones"
    }, "A", "El principio de incertidumbre impide asignar simultáneamente valores exactos a la posición y al momento lineal del electrón."),
    pregunta("fyq-t1-010", 1, "¿Qué representa un orbital en el modelo mecanocuántico?", {
      A: "Una órbita circular por la que pasa exactamente el electrón",
      B: "Una región del espacio donde hay una probabilidad elevada de encontrar al electrón",
      C: "El núcleo del átomo",
      D: "Una trayectoria que todos los electrones comparten"
    }, "B", "El modelo mecanocuántico no asigna una trayectoria exacta al electrón; un orbital es una región espacial de alta probabilidad de encontrarlo."),
    pregunta("fyq-t1-011", 1, "¿Cuántos electrones caben como máximo en un orbital?", {
      A: "1",
      B: "2",
      C: "6",
      D: "8"
    }, "B", "El principio de exclusión de Pauli permite como máximo dos electrones por orbital, y deben tener espines opuestos."),
    pregunta("fyq-t1-012", 1, "¿Cuál es la capacidad máxima del subnivel 2p?", {
      A: "2 electrones",
      B: "4 electrones",
      C: "6 electrones",
      D: "10 electrones"
    }, "C", "Un subnivel p tiene tres orbitales y en cada orbital caben dos electrones: 3 · 2 = 6 electrones."),
    pregunta("fyq-t1-013", 1, "¿Qué indica el principio de mínima energía al escribir una configuración electrónica?", {
      A: "Que se llenan primero los orbitales disponibles de menor energía",
      B: "Que todos los electrones deben estar en el mismo orbital",
      C: "Que se ocupan primero los orbitales más alejados del núcleo",
      D: "Que cada subnivel debe tener un solo electrón"
    }, "A", "Los electrones se colocan siguiendo el orden creciente de energía de los orbitales, que se recuerda mediante el diagrama de Möller."),
    pregunta("fyq-t1-014", 1, "¿Cuál es la consecuencia del principio de exclusión de Pauli?", {
      A: "Un orbital puede contener cuatro electrones si tienen distinta energía",
      B: "En un orbital solo puede haber dos electrones con espines diferentes",
      C: "Los electrones de un átomo siempre tienen el mismo espín",
      D: "Los electrones se distribuyen sin seguir ningún orden"
    }, "B", "Dos electrones no pueden tener el mismo estado cuántico; por eso un orbital admite como máximo dos y sus espines deben ser opuestos."),
    pregunta("fyq-t1-015", 1, "¿Cómo se aplica el principio de máxima multiplicidad de Hund?", {
      A: "Los orbitales de igual energía se llenan primero con un electrón en cada uno",
      B: "Se coloca toda la pareja en un orbital antes de ocupar otro",
      C: "Solo se pueden ocupar orbitales s",
      D: "Los electrones deben tener siempre espines opuestos, aunque estén en orbitales distintos"
    }, "A", "Cuando hay orbitales de igual energía, los electrones ocupan primero orbitales separados con espines paralelos y después se aparean."),
    pregunta("fyq-t1-016", 1, "Un átomo está en estado fundamental cuando…", {
      A: "Tiene el mayor número posible de electrones excitados",
      B: "Todos sus electrones ocupan los orbitales de menor energía posible",
      C: "Ha perdido todos sus electrones de valencia",
      D: "Tiene ocho electrones en cualquier orbital"
    }, "B", "El estado fundamental es la distribución de mínima energía compatible con los principios de Pauli y Hund."),
    pregunta("fyq-t1-017", 1, "¿Cuál de estas configuraciones es imposible?", {
      A: "1s² 2s² 2p⁶",
      B: "1s² 2s³",
      C: "1s² 2s² 2p⁴",
      D: "1s² 2s² 2p⁶ 3s¹"
    }, "B", "La configuración 2s³ es prohibida porque un orbital s solo puede contener dos electrones."),
    pregunta("fyq-t1-018", 1, "¿Según qué criterio se ordenan los elementos en la tabla periódica actual?", {
      A: "Por masa atómica decreciente",
      B: "Por número atómico creciente",
      C: "Por densidad creciente",
      D: "Por número de neutrones creciente"
    }, "B", "La tabla periódica moderna organiza los elementos en orden creciente de número atómico, es decir, de número de protones."),
    pregunta("fyq-t1-019", 1, "¿Qué hizo Mendeleiev al elaborar su tabla periódica?", {
      A: "Dejó huecos para elementos todavía no descubiertos y predijo algunas de sus propiedades",
      B: "Ordenó los elementos exclusivamente por densidad",
      C: "Eliminó los elementos que no eran metales",
      D: "Colocó todos los gases nobles en el mismo periodo"
    }, "A", "Mendeleiev ordenó los elementos conocidos por masa atómica y propiedades, dejando huecos donde esperaba elementos aún no descubiertos."),
    pregunta("fyq-t1-020", 1, "¿Cómo se denominan las filas y las columnas de la tabla periódica?", {
      A: "Las filas son grupos y las columnas son periodos",
      B: "Las filas son periodos y las columnas son grupos",
      C: "Ambas se llaman bloques",
      D: "Las filas son orbitales y las columnas son niveles"
    }, "B", "La tabla tiene siete periodos, que son sus filas, y dieciocho grupos, que son sus columnas."),
    pregunta("fyq-t1-021", 1, "¿Qué elementos pertenecen al bloque d de la tabla periódica?", {
      A: "Los grupos 1 y 2",
      B: "Los grupos 3 al 12, llamados elementos de transición",
      C: "Los grupos 13 al 18 exclusivamente",
      D: "Solo los gases nobles"
    }, "B", "En los elementos de transición el último electrón se sitúa en un orbital d; ocupan los grupos 3 a 12."),
    pregunta("fyq-t1-022", 1, "¿Qué son los electrones de valencia?", {
      A: "Todos los electrones del núcleo",
      B: "Los electrones del último nivel principal ocupado, responsables en gran medida del comportamiento químico",
      C: "Solo los electrones que tienen espín positivo",
      D: "Los electrones que forman los neutrones"
    }, "B", "Los electrones de la capa más externa participan en la formación de enlaces y ayudan a explicar la posición y las propiedades químicas de los elementos."),
    pregunta("fyq-t1-023", 1, "¿Cuál es la configuración abreviada del calcio (Z = 20) y su valencia iónica más habitual?", {
      A: "[Ar] 4s² y +2",
      B: "[Ne] 3s¹ y -1",
      C: "[Ar] 3d² y +4",
      D: "[Kr] 5s² y 0"
    }, "A", "El calcio es [Ar] 4s². Al perder sus dos electrones de valencia adquiere la configuración del argón y forma Ca²⁺."),
    pregunta("fyq-t1-024", 1, "¿Cómo varía generalmente el radio atómico al avanzar en un periodo de izquierda a derecha?", {
      A: "Aumenta porque aparecen más capas electrónicas",
      B: "Disminuye porque aumenta la carga nuclear mientras los electrones de valencia permanecen en la misma capa",
      C: "No cambia nunca",
      D: "Se hace igual al número atómico"
    }, "B", "En un periodo los electrones de valencia ocupan la misma capa, pero el núcleo tiene más protones y los atrae con mayor fuerza; el tamaño disminuye."),
    pregunta("fyq-t1-025", 1, "¿Cómo varía generalmente el radio atómico al bajar en un grupo?", {
      A: "Aumenta porque se añaden capas electrónicas",
      B: "Disminuye porque hay menos electrones",
      C: "Se hace cero en el último periodo",
      D: "Aumenta solo en los gases nobles"
    }, "A", "Al bajar en un grupo aumenta el número de capas electrónicas y los electrones de valencia quedan más alejados del núcleo."),
    pregunta("fyq-t1-026", 1, "¿Qué es la primera energía de ionización?", {
      A: "La energía liberada al añadir un electrón a un átomo aislado",
      B: "La energía necesaria para arrancar un electrón exterior de un átomo aislado y gaseoso",
      C: "La energía de un enlace entre dos moléculas",
      D: "La energía total del núcleo"
    }, "B", "La primera energía de ionización se define para el proceso de arrancar el primer electrón de valencia de un átomo aislado en estado gaseoso y se mide en kJ/mol."),
    pregunta("fyq-t1-027", 1, "¿Cuál es el elemento más electronegativo según la escala de Pauling estudiada en el tema?", {
      A: "El flúor",
      B: "El francio",
      C: "El sodio",
      D: "El helio"
    }, "A", "El flúor tiene la electronegatividad máxima de la escala indicada, aproximadamente 4. La electronegatividad mide la tendencia a atraer el par electrónico de un enlace."),
    pregunta("fyq-t1-028", 1, "¿Cómo varía generalmente el carácter metálico en la tabla periódica?", {
      A: "Aumenta hacia arriba y hacia la derecha",
      B: "Aumenta hacia abajo y hacia la izquierda",
      C: "Aumenta solo en los gases nobles",
      D: "No depende de la posición en la tabla"
    }, "B", "El carácter metálico es la tendencia a formar iones positivos y varía de forma opuesta a la electronegatividad: aumenta al bajar en un grupo y al avanzar hacia la izquierda."),

    /* ============================== TEMA 2 ============================== */
    pregunta("fyq-t2-001", 2, "¿Qué se entiende por enlace químico?", {
      A: "La fuerza o conjunto de fuerzas que mantiene unidos a los átomos o a las moléculas",
      B: "Solo la fuerza que mantiene unido el núcleo",
      C: "La masa de una molécula",
      D: "Una unidad fundamental del SI"
    }, "A", "El enlace químico mantiene unidos los átomos en moléculas o cristales y también puede referirse a las fuerzas que mantienen unidas moléculas en líquidos y sólidos."),
    pregunta("fyq-t2-002", 2, "¿Cuál es la naturaleza fundamental del enlace químico?", {
      A: "Nuclear",
      B: "Eléctrica: las cargas positivas atraen a las negativas",
      C: "Magnética exclusivamente",
      D: "Gravitatoria en todos los casos"
    }, "B", "Los enlaces se originan en interacciones eléctricas. La situación estable aparece cuando las atracciones entre núcleos y electrones compensan las repulsiones."),
    pregunta("fyq-t2-003", 2, "¿Qué afirma la regla del octeto de Lewis?", {
      A: "Los átomos tienden a alcanzar ocho electrones en su capa de valencia o la configuración de un gas noble",
      B: "Todos los átomos tienen exactamente ocho protones",
      C: "Solo los metales pueden compartir electrones",
      D: "Las moléculas siempre tienen ocho átomos"
    }, "A", "La regla del octeto resume la tendencia de muchos átomos a ganar, perder o compartir electrones para alcanzar una configuración electrónica estable."),
    pregunta("fyq-t2-004", 2, "¿Entre qué tipos de elementos se forma normalmente un enlace iónico?", {
      A: "Entre dos gases nobles",
      B: "Entre un metal y un no metal con electronegatividades muy diferentes",
      C: "Entre dos no metales de electronegatividad parecida y alta",
      D: "Solo entre dos metales líquidos"
    }, "B", "El metal tiende a perder electrones y forma un catión; el no metal tiende a ganarlos y forma un anión. La atracción entre ambos origina el enlace iónico."),
    pregunta("fyq-t2-005", 2, "En la formación de NaCl, ¿qué sucede con los electrones de valencia?", {
      A: "El sodio gana uno y el cloro pierde uno",
      B: "El sodio pierde uno y el cloro gana uno",
      C: "Ambos átomos comparten tres electrones",
      D: "Ninguno de los átomos cambia su configuración"
    }, "B", "El Na pierde su electrón 3s¹ y se convierte en Na⁺, mientras que el Cl gana un electrón y se convierte en Cl⁻. Ambos alcanzan configuración de gas noble."),
    pregunta("fyq-t2-006", 2, "¿Qué es una red cristalina iónica?", {
      A: "Una molécula aislada de dos átomos",
      B: "Una estructura ordenada y estable en la que los iones se rodean de iones de signo contrario",
      C: "Una nube formada únicamente por electrones libres",
      D: "Un conjunto desordenado de átomos neutros"
    }, "B", "En un cristal iónico, cada ion queda rodeado por iones de signo contrario en una estructura tridimensional que maximiza las atracciones y minimiza las repulsiones."),
    pregunta("fyq-t2-007", 2, "¿Qué indica una energía de red elevada?", {
      A: "Una red cristalina menos estable",
      B: "Una mayor estabilidad de la red iónica y más energía necesaria para separarla",
      C: "Que el compuesto es necesariamente un gas",
      D: "Que los iones no tienen carga"
    }, "B", "La energía de red es la energía asociada a la formación de la red; cuanto mayor es, más estable resulta y más difícil es romperla."),
    pregunta("fyq-t2-008", 2, "¿Cuál es el índice de coordinación del NaCl para el Na⁺ y para el Cl⁻?", {
      A: "2 para ambos",
      B: "4 para el Na⁺ y 8 para el Cl⁻",
      C: "6 para ambos",
      D: "8 para ambos"
    }, "C", "El NaCl es una estructura del tipo AB: cada ion está rodeado por seis iones del signo contrario, por lo que ambos índices son 6."),
    pregunta("fyq-t2-009", 2, "¿Por qué los sólidos iónicos suelen ser duros y frágiles?", {
      A: "Porque sus iones no interaccionan entre sí",
      B: "Porque la red es estable y, al desplazar planos, quedan enfrentados iones del mismo signo que se repelen",
      C: "Porque contienen moléculas elásticas",
      D: "Porque sus electrones se mueven libremente por todo el sólido"
    }, "B", "La red resiste el rayado, pero un golpe puede desplazar los planos y enfrentar cargas iguales; la repulsión rompe el cristal y produce fragilidad."),
    pregunta("fyq-t2-010", 2, "¿Cuándo conduce la electricidad un compuesto iónico?", {
      A: "Siempre en estado sólido",
      B: "Cuando está fundido o disuelto, porque sus iones pueden moverse",
      C: "Nunca, porque los iones no tienen carga",
      D: "Solo cuando está a temperatura inferior a 0 °C"
    }, "B", "En el sólido los iones están fijos en la red. Al fundirse o disolverse, quedan libres para desplazarse y transportar carga eléctrica."),
    pregunta("fyq-t2-011", 2, "Al disolver un cristal iónico en agua, ¿cómo se orientan las moléculas de agua?", {
      A: "Los átomos de H rodean a los cationes y los de O a los aniones",
      B: "Los átomos de O rodean a los cationes y los de H a los aniones",
      C: "Todas se colocan al azar sin interacción eléctrica",
      D: "Las moléculas de agua se convierten en electrones"
    }, "B", "El oxígeno de H₂O es el extremo parcialmente negativo y se orienta hacia los cationes; los hidrógenos, parcialmente positivos, hacia los aniones."),
    pregunta("fyq-t2-012", 2, "¿Cuándo se forma normalmente un enlace covalente?", {
      A: "Cuando se combinan no metales de electronegatividad parecida y alta",
      B: "Cuando un metal cede todos sus protones",
      C: "Cuando se combinan exclusivamente metales",
      D: "Cuando no hay electrones de valencia"
    }, "A", "Los átomos no metálicos tienden a ganar electrones, pero al tener electronegatividades parecidas suelen compartirlos para alcanzar configuraciones estables."),
    pregunta("fyq-t2-013", 2, "En una estructura de Lewis, ¿qué representa una pareja de electrones compartidos entre dos átomos?", {
      A: "Un protón",
      B: "Un enlace covalente",
      C: "Un neutrón",
      D: "Una capa electrónica completa del núcleo"
    }, "B", "Cada pareja de electrones compartidos constituye un enlace covalente y puede representarse mediante un segmento entre los símbolos de los átomos."),
    pregunta("fyq-t2-014", 2, "¿Qué caracteriza a un enlace covalente triple?", {
      A: "Comparte un par de electrones",
      B: "Comparte dos pares de electrones",
      C: "Comparte tres pares de electrones",
      D: "Transfiere tres protones"
    }, "C", "En un enlace triple se comparten tres pares de electrones entre los mismos átomos."),
    pregunta("fyq-t2-015", 2, "¿Qué diferencia hay entre una fórmula molecular y una fórmula empírica?", {
      A: "La molecular indica los átomos de una molécula; la empírica, la proporción más sencilla entre ellos",
      B: "La molecular solo sirve para sólidos y la empírica solo para gases",
      C: "La empírica siempre contiene más átomos que la molecular",
      D: "No hay ninguna diferencia"
    }, "A", "H₂O₂ es una fórmula molecular y HO es su fórmula empírica: la primera da el número real de átomos de la molécula y la segunda su proporción mínima."),
    pregunta("fyq-t2-016", 2, "¿Cuál es la estructura de Lewis simplificada del CO₂?", {
      A: "O—C—O, con un enlace sencillo a cada oxígeno",
      B: "O=C=O, con dos enlaces dobles",
      C: "C≡O—O, con un enlace triple y uno sencillo",
      D: "C—O, sin segundo átomo de oxígeno"
    }, "B", "El carbono comparte dos pares de electrones con cada oxígeno: O=C=O. Así, el C y los O completan sus capas de valencia."),
    pregunta("fyq-t2-017", 2, "En un enlace covalente dativo, ¿qué hace la especie dadora?", {
      A: "Aporta el par de electrones que se comparte",
      B: "Aporta un protón al núcleo",
      C: "Recibe el par de electrones y no participa más",
      D: "Pierde todos sus neutrones"
    }, "A", "En el enlace dativo o dador-aceptor, una especie aporta los dos electrones del par compartido y la otra proporciona un orbital o sitio donde aceptarlo; se representa con una flecha."),
    pregunta("fyq-t2-018", 2, "¿Por qué el enlace H—O del agua es covalente polar?", {
      A: "Porque H y O tienen exactamente la misma electronegatividad",
      B: "Porque el oxígeno es más electronegativo y atrae más hacia sí los electrones compartidos",
      C: "Porque el oxígeno transfiere sus protones al hidrógeno",
      D: "Porque el agua es un compuesto metálico"
    }, "B", "En un enlace polar los electrones se comparten de forma desigual. En H₂O, el O atrae más el par electrónico y adquiere carga parcial negativa."),
    pregunta("fyq-t2-019", 2, "¿De qué depende que una molécula con enlaces polares sea polar o apolar?", {
      A: "Solo del número total de átomos",
      B: "De cómo se distribuyen espacialmente los enlaces y de si sus dipolos se compensan",
      C: "Únicamente de su estado físico",
      D: "De que contenga siempre un metal"
    }, "B", "La geometría molecular puede hacer que los dipolos se sumen, como en el agua, o se cancelen, como en el CO₂ lineal."),
    pregunta("fyq-t2-020", 2, "¿Qué propiedad es típica de las sustancias covalentes moleculares?", {
      A: "Pueden ser sólidos, líquidos o gases y suelen tener puntos de fusión relativamente bajos",
      B: "Siempre son sólidos muy duros y con puntos de fusión altísimos",
      C: "Conducen bien la electricidad en estado sólido",
      D: "Están formadas por una red de cationes y electrones libres"
    }, "A", "Las moléculas se mantienen unidas por fuerzas intermoleculares, generalmente más débiles que los enlaces covalentes internos, por lo que pueden presentarse en los tres estados."),
    pregunta("fyq-t2-021", 2, "¿Qué distingue a un cristal covalente como el diamante o la sílice?", {
      A: "Está formado por moléculas independientes unidas débilmente",
      B: "Muchos átomos están unidos por enlaces covalentes formando una red extensa, generalmente dura y frágil",
      C: "Contiene iones libres que conducen la corriente",
      D: "Es necesariamente líquido a temperatura ambiente"
    }, "B", "En un cristal covalente los enlaces se extienden por toda la red. Romperla exige vencer enlaces covalentes fuertes, por eso suele ser duro y frágil."),
    pregunta("fyq-t2-022", 2, "¿Por qué el grafito conduce la electricidad si es una sustancia covalente?", {
      A: "Porque sus protones se desplazan entre las capas",
      B: "Porque queda un electrón por átomo que no forma parte de enlaces covalentes localizados y puede moverse",
      C: "Porque se disuelve espontáneamente en agua",
      D: "Porque sus enlaces son iónicos"
    }, "B", "En el grafito, la estructura de los átomos de carbono deja electrones deslocalizados que pueden transportar carga a través del material."),
    pregunta("fyq-t2-023", 2, "¿Cómo se describe el enlace metálico?", {
      A: "Como una red de cationes metálicos inmersa en una nube de electrones deslocalizados",
      B: "Como moléculas de metal unidas por puentes de hidrógeno",
      C: "Como aniones unidos por protones",
      D: "Como electrones encerrados en un único átomo"
    }, "A", "Los átomos metálicos ceden o deslocalizan sus electrones de valencia; los cationes quedan inmersos en una nube electrónica común."),
    pregunta("fyq-t2-024", 2, "¿Por qué los metales son dúctiles y maleables?", {
      A: "Porque al desplazar sus capas la nube electrónica sigue manteniendo unida la estructura",
      B: "Porque sus iones se repelen y el cristal se pulveriza",
      C: "Porque no tienen ninguna estructura interna",
      D: "Porque están formados por moléculas apolares"
    }, "A", "La nube de electrones deslocalizados mantiene la atracción entre los cationes aunque las capas se desplacen; por eso el metal puede formar hilos o láminas."),
    pregunta("fyq-t2-025", 2, "¿Entre qué moléculas se establece una interacción dipolo-dipolo?", {
      A: "Entre moléculas polares, orientando extremos de signo parcial contrario",
      B: "Solo entre iones de signo igual",
      C: "Entre moléculas apolares sin distribución instantánea de carga",
      D: "Solo entre metales sólidos"
    }, "A", "Las moléculas polares son dipolos permanentes: el extremo parcialmente positivo de una atrae al extremo parcialmente negativo de otra."),
    pregunta("fyq-t2-026", 2, "¿Cuándo puede formarse un enlace de hidrógeno?", {
      A: "Cuando el H está unido covalentemente a un átomo muy electronegativo, como F, O o N",
      B: "Siempre que haya hidrógeno, incluso en H₂",
      C: "Solo entre átomos metálicos",
      D: "Cuando una molécula no tiene dipolo"
    }, "A", "El enlace de hidrógeno es una interacción especialmente intensa entre moléculas en las que H está unido a un átomo muy electronegativo, sobre todo F, O o N."),
    pregunta("fyq-t2-027", 2, "¿Cómo se originan las fuerzas de dispersión o de dipolo instantáneo-dipolo inducido?", {
      A: "Por una distribución momentánea e irregular de los electrones que induce un dipolo en una molécula vecina",
      B: "Por la transferencia permanente de protones",
      C: "Por la formación de una red iónica",
      D: "Por la ausencia total de electrones"
    }, "A", "El movimiento de los electrones puede producir durante un instante una separación de cargas. Ese dipolo induce otra separación en una molécula próxima."),
    pregunta("fyq-t2-028", 2, "¿Qué interacción aparece al disolver un compuesto iónico en un disolvente polar como el agua?", {
      A: "Ion-dipolo",
      B: "Solo enlace metálico",
      C: "Covalente triple",
      D: "Nuclear fuerte"
    }, "A", "Las moléculas polares del disolvente se orientan alrededor de los iones: el extremo de signo contrario al ion queda más próximo. Es una interacción ion-dipolo."),
    pregunta("fyq-t2-029", 2, "¿Por qué el agua tiene un punto de ebullición anormalmente alto frente a moléculas de masa parecida?", {
      A: "Porque entre sus moléculas se forman enlaces de hidrógeno",
      B: "Porque el agua tiene enlace metálico",
      C: "Porque sus moléculas no tienen electrones",
      D: "Porque todos sus enlaces son triples"
    }, "A", "Los enlaces de hidrógeno entre moléculas de agua son más fuertes que muchas otras fuerzas intermoleculares y requieren más energía para separarlas."),
    pregunta("fyq-t2-030", 2, "¿Qué regla general ayuda a explicar la solubilidad de sustancias covalentes?", {
      A: "Las sustancias polares tienden a disolverse en disolventes polares y las apolares en disolventes apolares",
      B: "Todas las sustancias se disuelven igual en cualquier disolvente",
      C: "Solo los sólidos iónicos se pueden disolver",
      D: "Una molécula apolar se disuelve mejor en agua que en un disolvente apolar"
    }, "A", "La disolución es favorable cuando el soluto y el disolvente pueden establecer interacciones de naturaleza semejante: polar con polar y apolar con apolar."),
    pregunta("fyq-t2-031", 2, "La nieve carbónica es CO₂ sólido. ¿Por qué puede pasar directamente a gas al abrir el recipiente?", {
      A: "Porque se subliman moléculas de CO₂ al vencer sus fuerzas intermoleculares",
      B: "Porque se rompen todos los enlaces C=O de cada molécula",
      C: "Porque el CO₂ se transforma en un metal",
      D: "Porque desaparecen los átomos de oxígeno"
    }, "A", "Al pasar de sólido molecular a gas se separan las moléculas, pero no es necesario romper los enlaces covalentes C=O del interior de cada molécula."),
    pregunta("fyq-t2-032", 2, "¿Cuál de las siguientes asociaciones entre sustancia y tipo de estructura es correcta?", {
      A: "NaCl: cristal iónico; H₂O: sustancia molecular; SiO₂: cristal covalente; Hg: sustancia metálica",
      B: "NaCl: metal; H₂O: cristal iónico; SiO₂: gas noble; Hg: molécula apolar",
      C: "NaCl: sustancia molecular; H₂O: metal; SiO₂: cristal iónico; Hg: cristal covalente",
      D: "Todas son sustancias moleculares"
    }, "A", "NaCl forma una red de iones, H₂O está formada por moléculas, SiO₂ forma una red covalente y Hg presenta enlace metálico, aunque sea líquido a temperatura ambiente."),
  ]
};
