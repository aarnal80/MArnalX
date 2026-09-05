/* Banco de contenidos de Estudios.
 * Preguntas elaboradas a partir del libro de Física y Química de 1.º de
 * Bachillerato (temas 0 a 12 y anexo de formulación y tablas). */
"use strict";

function pregunta(id, tema, q, o, r, explicacion) {
  return { id, fuente: "fyq-santillana", tema, q, o, r,
    e: { correcta: EXPLICACIONES_AMPLIAS[id] || explicacion, incorrectas: {} } };
}

// Explanations designed as short learning notes: idea, reasoning, formula and
// units when they are relevant, so the correction also teaches the procedure.
const EXPLICACIONES_AMPLIAS = {
  "fyq-t0-001": `La opción B es correcta porque una teoría o un modelo científico no se acepta solo porque parezca razonable. Debe compararse con observaciones y experimentos, y además debe permitir hacer predicciones que puedan comprobarse. Si aparecen datos incompatibles, el modelo se revisa o se sustituye; por eso el conocimiento científico es contrastable y revisable.`,
  "fyq-t0-002": `Una magnitud física es una propiedad de un cuerpo o fenómeno que puede medirse y expresarse mediante un número y una unidad. Por ejemplo, decir m = 2,0 kg significa que la masa se ha comparado con el kilogramo y que el resultado numérico es 2,0. Un instrumento sirve para realizar la comparación, pero no es la magnitud.`,
  "fyq-t0-003": `La velocidad del viento es vectorial porque para describirla hacen falta tres datos: módulo, dirección y sentido. El módulo puede ser 35 km/h, pero todavía hay que indicar hacia dónde sopla. En cambio, la temperatura, la energía y la concentración son escalares: quedan determinadas por un número y una unidad.`,
  "fyq-t0-004": `Una magnitud discreta solo puede tomar valores separados, normalmente asociados a un recuento: no puede haber 2,4 partículas. Una magnitud continua puede tomar cualquier valor de un intervalo, al menos en el modelo de medida; por ejemplo, una longitud puede ser 2,40 cm o 2,401 cm. La opción C expresa precisamente esta diferencia.`,
  "fyq-t0-005": `Las magnitudes fundamentales son las siete que el Sistema Internacional define como independientes: longitud, masa, tiempo, corriente eléctrica, temperatura termodinámica, cantidad de sustancia e intensidad luminosa. A partir de ellas se construyen las derivadas. Por ejemplo, el área se expresa en m² y la velocidad en m/s, así que no son fundamentales.`,
  "fyq-t0-006": `La opción A enumera las siete unidades fundamentales del SI: metro (m), kilogramo (kg), segundo (s), amperio (A), kelvin (K), mol (mol) y candela (cd). El litro es una unidad aceptada, y el julio, newton y vatio son unidades derivadas. Además, km, g y h incluyen prefijos o unidades que no son las fundamentales.`,
  "fyq-t0-007": `La velocidad relaciona una distancia recorrida con el tiempo empleado. Su definición es v = Δx/Δt; por eso, al usar las unidades básicas del SI, queda [v] = m/s. Es una magnitud derivada porque su unidad se obtiene combinando el metro y el segundo, que sí son unidades fundamentales.`,
  "fyq-t0-008": `El prefijo kilo- significa un factor 10³, es decir, mil. La relación es 1 km = 10³ m = 1000 m. Por tanto, pasar de kilómetros a metros consiste en multiplicar por 1000; no debe confundirse con mili-, que representa 10⁻³. El prefijo se aplica a la unidad completa: 3,5 km son 3,5·1000 = 3500 m, mientras que 3,5 mm son 3,5·10⁻³ m.`,
  "fyq-t0-009": `Hay que cambiar las dos unidades: v = 120 km/h · (1000 m/1 km) · (1 h/3600 s). Se cancelan km y h, y queda v = 120000/3600 m/s = 33,333… m/s. Como el dato tiene tres cifras significativas, se expresa como 33,3 m/s. Los factores de conversión valen 1, así que no alteran la magnitud física; solo cambian la unidad en la que se expresa.`,
  "fyq-t0-010": `El electronvoltio es una unidad de energía, no de velocidad ni de carga. Se define como la energía que adquiere un electrón al atravesar una diferencia de potencial de 1 V. Su equivalencia es 1 eV = 1,602 · 10⁻¹⁹ J, aproximadamente; por eso resulta útil para energías atómicas, que son muy pequeñas en julios.`,
  "fyq-t0-011": `La sensibilidad indica la variación mínima que el instrumento puede apreciar o distinguir en la magnitud medida; suele relacionarse con el valor de la división más pequeña de la escala. Por ejemplo, una regla graduada en milímetros aprecia 1 mm. No es lo mismo que exactitud: un aparato puede apreciar cambios pequeños y estar mal calibrado.`,
  "fyq-t0-012": `Un instrumento es exacto cuando sus resultados están cerca del valor verdadero o aceptado. La precisión describe otra cosa: que varias medidas repetidas sean parecidas entre sí. Un aparato puede ser preciso pero inexacto si todas sus lecturas se agrupan alrededor de un valor desplazado por una mala calibración.`,
  "fyq-t0-013": `Los errores aleatorios cambian de forma imprevisible de una medida a otra. Al repetir muchas veces y calcular la media, unas desviaciones positivas y negativas tienden a compensarse. La media se calcula como x̄ = (x₁ + x₂ + … + xₙ)/n y suele ser una mejor estimación; repetir no elimina un error sistemático.`,
  "fyq-t0-014": `Un error sistemático desplaza las medidas siempre, o casi siempre, en la misma dirección y cantidad. Puede deberse al cero del instrumento, a una mala calibración o a un método inadecuado. Repetir la medida reduce el azar, pero conserva ese desplazamiento; hay que calibrar, corregir o cambiar el procedimiento.`,
  "fyq-t0-015": `La media aritmética se obtiene sumando todas las medidas y dividiendo entre su número: x̄ = (2,2 + 2,4 + 2,6)/3 = 7,2/3 = 2,4. Las medidas están expresadas con la misma unidad, que también tendría la media. El valor 2,4 representa el centro del conjunto, no significa que todas las lecturas hayan sido 2,4.`,
  "fyq-t0-016": `La desviación típica mide cuánto se separan, en promedio, los resultados de la media. Para una población puede escribirse σ = √[Σ(xᵢ − x̄)²/n]. Si σ es pequeña, las medidas están muy agrupadas y la dispersión es menor; si es grande, hay más variabilidad y la incertidumbre estadística es mayor.`,
  "fyq-t0-017": `En una distribución normal se cumple aproximadamente la regla 68-95-99,7. El intervalo x̄ − σ ≤ x ≤ x̄ + σ contiene cerca del 68 % de los resultados; al ampliar a ±2σ se llega aproximadamente al 95 %, y a ±3σ al 99,7 %. El 68 % es una aproximación válida para muchas observaciones con distribución gaussiana.`,
  "fyq-t0-018": `En la notación x = 23,738(31) m, el número entre paréntesis expresa la incertidumbre de las últimas cifras escritas. Como esas cifras están en las milésimas de metro, la medida equivale a x = 23,738 ± 0,031 m. El intervalo aproximado es 23,707 m ≤ x ≤ 23,769 m; no significa ±31 m.`,
  "fyq-t0-019": `El volumen de un cubo se calcula con la fórmula V = L³, porque hay tres dimensiones iguales: largo · ancho · alto = L · L · L. Así, V = (14,9 cm)³ = 3307,949 cm³. El lado tiene tres cifras significativas, por lo que el resultado se redondea a tres: 3,31 · 10³ cm³, es decir, unos 3310 cm³.`,
  "fyq-t0-020": `Para un lado positivo, la función V = L³ aumenta cuando aumenta L. Por eso el volumen mínimo se obtiene con 14,85 cm y el máximo con 14,95 cm: Vmín = 14,85³ = 3274,76 cm³ y Vmáx = 14,95³ = 3341,36 cm³. Redondeando, el intervalo es aproximadamente 3275 cm³ ≤ V ≤ 3341 cm³.`,
  "fyq-t0-021": `El método de mínimos cuadrados busca los parámetros de la curva que mejor sigue los datos. Para una recta y = ax + b minimiza S = Σ[yᵢ − (axᵢ + b)]², la suma de los cuadrados de las diferencias entre cada medida y el valor predicho. Al elevar al cuadrado se evita que los errores positivos y negativos se cancelen y se penalizan más las desviaciones grandes.`,
  "fyq-t0-022": `En una gráfica de T frente a m se estudia cómo cambia el período T cuando se modifica la masa m. Por convenio, la variable independiente o controlada va en el eje horizontal (x), así que allí se coloca m; la variable dependiente va en el eje vertical (y), así que allí se coloca T.`,
  "fyq-t0-023": `Un artículo científico comunica una investigación de forma que otros equipos puedan entenderla y evaluarla. Normalmente incluye objetivo, método, datos, resultados, discusión y conclusiones, además de referencias. Así los resultados pueden contrastarse, reproducirse y relacionarse con trabajos anteriores; no es simplemente una opinión publicada.`,
  "fyq-t0-024": `Una búsqueda científica fiable empieza por términos concretos y por fuentes con autoría identificable, como universidades, organismos científicos o revistas especializadas. Después hay que comprobar la fecha, comparar la información con otras fuentes y distinguir datos de opiniones. Finalmente se debe citar la fuente para que otra persona pueda localizarla.`,
  "fyq-t0-025": `La bibliografía y las citas permiten saber de dónde procede cada dato, idea, imagen o recurso utilizado. Un trabajo completo debe identificar autor, título, fecha y enlace o publicación cuando corresponda. Citar no solo evita presentar ideas ajenas como propias: también permite que el lector compruebe la información y amplíe el estudio.`,

  "fyq-t1-001": `Un espectro es la distribución ordenada de una radiación según su longitud de onda, frecuencia o energía. La luz blanca, por ejemplo, puede separarse en colores y formar un espectro continuo; los átomos excitados producen líneas concretas. Cada línea corresponde a una radiación con una energía determinada.`,
  "fyq-t1-002": `Para obtener un espectro de emisión se aporta energía a la muestra, por ejemplo mediante calor o una descarga eléctrica. Los electrones pasan a niveles superiores y, al regresar a niveles más bajos, emiten fotones. La energía del fotón es ΔE = hν = hc/λ; como cada elemento tiene niveles propios, sus líneas son características.`,
  "fyq-t1-003": `Una línea espectral aparece cuando la radiación tiene exactamente la energía de una transición entre dos niveles. En emisión el átomo libera esa energía y aparece una línea brillante; en absorción la radiación se retira del espectro continuo y aparece una línea oscura en la misma longitud de onda. Por eso ambos espectros son complementarios.`,
  "fyq-t1-004": `Si el electrón pasa de un nivel exterior a otro interior, termina con menor energía y emite un fotón cuya energía es ΔE = Eexterior − Einterior = hν. Si realiza el salto contrario, necesita absorber esa misma diferencia energética. No se emite cualquier frecuencia: solo las que corresponden a diferencias entre niveles permitidos.`,
  "fyq-t1-005": `Cada elemento tiene un número de protones y una estructura electrónica propios. Por ello, las diferencias de energía entre sus niveles también son propias y generan unas longitudes de onda determinadas. El conjunto de líneas de emisión o absorción funciona como una huella dactilar: comparándolo con espectros conocidos se puede identificar el elemento.`,
  "fyq-t1-006": `Si el electrón alcanza n = 4, puede realizar seis transiciones distintas: 4→3, 4→2, 4→1, 3→2, 3→1 y 2→1. También se puede contar con la fórmula N = n(n − 1)/2: N = 4·3/2 = 6. Cada transición tiene una diferencia de energía distinta y puede originar una línea.`,
  "fyq-t1-007": `El desdoblamiento de líneas al aplicar un campo magnético es una evidencia del efecto Zeeman. Indica que un nivel que parecía único contiene subniveles con energías ligeramente diferentes, relacionados con el movimiento y el momento angular del electrón. Al cambiar la energía de las transiciones aparecen varias frecuencias en lugar de una sola.`,
  "fyq-t1-008": `De Broglie propuso que toda partícula en movimiento tiene una longitud de onda asociada: λ = h/p, donde h es la constante de Planck y p el momento lineal; si la velocidad no es relativista, p = mv. En objetos grandes λ es tan pequeña que no se aprecia, pero en electrones sí puede observarse comportamiento ondulatorio.`,
  "fyq-t1-009": `El principio de incertidumbre se expresa como Δx · Δp ≥ h/(4π), o equivalentemente Δx · Δp ≥ ħ/2. No significa que el instrumento sea malo: es una limitación fundamental del estado cuántico. Cuanto más exactamente se conoce la posición, mayor es la incertidumbre inevitable en el momento lineal, y viceversa.`,
  "fyq-t1-010": `Un orbital no es una órbita o trayectoria dibujada alrededor del núcleo. Es una región del espacio donde la probabilidad de encontrar al electrón es elevada; matemáticamente se relaciona con |ψ|², el cuadrado de la función de onda. La descripción cuántica permite probabilidades, no una posición y una trayectoria exactas en todo momento.`,
  "fyq-t1-011": `Un orbital queda definido por un conjunto de números cuánticos y solo puede alojar dos electrones. El principio de exclusión de Pauli exige que no tengan los cuatro números cuánticos iguales; si comparten orbital, deben diferenciarse por el espín, que será opuesto: ↑↓.`,
  "fyq-t1-012": `El subnivel p está formado por tres orbitales de igual energía, que se suelen llamar pₓ, pᵧ y p_z. Como cada orbital admite dos electrones por Pauli, su capacidad máxima es 3 orbitales · 2 electrones/orbital = 6 electrones. Por eso 2p⁶ está completo.`,
  "fyq-t1-013": `El principio de mínima energía, o de construcción, indica que los electrones ocupan primero los orbitales disponibles de menor energía. El orden habitual comienza 1s, 2s, 2p, 3s, 3p, 4s, 3d… y se consulta con el diagrama de Möller. No basta con ordenar solo por el número de capa n.`,
  "fyq-t1-014": `Pauli establece que no puede haber dos electrones en un átomo con los cuatro números cuánticos idénticos. Como los dos electrones de un mismo orbital ya comparten n, l y m, deben tener espines opuestos. De ahí se deduce la capacidad máxima de dos electrones por orbital.`,
  "fyq-t1-015": `La regla de Hund se aplica a orbitales degenerados, es decir, de igual energía, como los tres orbitales p. Primero se coloca un electrón en cada orbital con espines paralelos y solo después se empiezan a formar parejas. Por ejemplo, para p³ la distribución estable es ↑  ↑  ↑, no ↑↓  ↑  —.`,
  "fyq-t1-016": `El estado fundamental es la configuración de menor energía posible para ese átomo. Se obtiene llenando los orbitales según mínima energía y respetando Pauli y Hund. Si un electrón ocupa un orbital superior mientras queda disponible uno inferior, el átomo está en un estado excitado, no en el fundamental.`,
  "fyq-t1-017": `La configuración 2s³ es imposible porque el subnivel 2s tiene un único orbital. Por Pauli, ese orbital puede contener como máximo dos electrones, 2s². El exponente 3 supera esa capacidad; en cambio, un subnivel p sí puede llegar a p⁶ porque posee tres orbitales.`,
  "fyq-t1-018": `La tabla periódica moderna se ordena por número atómico Z, que es el número de protones del núcleo. Al aumentar Z se incorpora un protón y, en un átomo neutro, también un electrón. La masa atómica no es el criterio de orden actual porque depende de los isótopos y puede producir excepciones.`,
  "fyq-t1-019": `Mendeleiev organizó los elementos conocidos atendiendo principalmente a su masa atómica y a la repetición de sus propiedades. Dejó huecos en lugares donde la periodicidad indicaba que faltaban elementos y predijo algunas de sus propiedades. El descubrimiento posterior de esos elementos apoyó su propuesta.`,
  "fyq-t1-020": `Las filas horizontales son los siete períodos y las columnas verticales son los dieciocho grupos. Los elementos de un mismo período tienen ocupado el mismo número máximo de capas principales, mientras que los de un mismo grupo suelen compartir una configuración externa parecida y, por ello, propiedades químicas semejantes.`,
  "fyq-t1-021": `El bloque d ocupa los grupos 3 a 12 y corresponde a los elementos de transición. En ellos se va llenando un subnivel d, normalmente el (n−1)d, mientras que también participan electrones ns. El bloque s llena orbitales s, el p orbitales p y el f orbitales f.`,
  "fyq-t1-022": `Los electrones de valencia son los que se encuentran en la zona externa del átomo y los que pueden intervenir con mayor facilidad en los enlaces. En los elementos representativos suelen ser los de la capa con mayor n; en los de transición también pueden participar electrones d. Explican muchas valencias y tendencias periódicas.`,
  "fyq-t1-023": `El calcio tiene Z = 20, así que un átomo neutro posee 20 electrones: 1s² 2s² 2p⁶ 3s² 3p⁶ 4s², o [Ar]4s². Al perder los dos electrones 4s forma Ca²⁺ y queda con 18 electrones, la misma configuración estable que el argón: [Ar]. La carga se comprueba comparando protones y electrones: 20 protones − 18 electrones = +2, de ahí Ca²⁺; no se pierden protones del núcleo.`,
  "fyq-t1-024": `Al avanzar de izquierda a derecha en un período, los electrones externos siguen ocupando aproximadamente la misma capa, pero aumenta el número de protones. La carga nuclear efectiva crece y atrae con más fuerza a esos electrones, por lo que el radio atómico disminuye en general.`,
  "fyq-t1-025": `Al bajar por un grupo se añade una capa electrónica principal. Aunque también aumente el número de protones, las capas internas apantallan parte de esa atracción y los electrones externos quedan más lejos del núcleo. El resultado general es un aumento del radio atómico.`,
  "fyq-t1-026": `La primera energía de ionización es la energía mínima necesaria para quitar el primer electrón a un átomo aislado en estado gaseoso: X(g) → X⁺(g) + e⁻. Se expresa normalmente en kJ/mol. No es la energía para arrancar todos los electrones, y las ionizaciones sucesivas requieren valores distintos y generalmente mayores.`,
  "fyq-t1-027": `La electronegatividad mide la capacidad de un átomo para atraer hacia sí el par de electrones compartido en un enlace. En la escala de Pauling el flúor tiene el valor máximo, aproximadamente 4,0, porque su radio pequeño y su elevada carga nuclear efectiva atraen con mucha intensidad esos electrones.`,
  "fyq-t1-028": `El carácter metálico es la facilidad para perder electrones y formar cationes. Aumenta al bajar en un grupo porque el electrón externo está más alejado y apantallado, y aumenta hacia la izquierda de un período. Por eso su tendencia general es opuesta a la electronegatividad.`,

  "fyq-t2-001": `Un enlace químico es la interacción que mantiene unidos átomos en una molécula o en una red sólida. Se forma cuando el sistema alcanza una disposición de menor energía que los átomos separados. No debe confundirse con una fuerza intermolecular: el enlace une partículas dentro de la sustancia y las fuerzas intermoleculares actúan entre moléculas.`,
  "fyq-t2-002": `La base del enlace es eléctrica: los núcleos positivos atraen a los electrones y, al mismo tiempo, núcleos y electrones del mismo signo se repelen. Existe una distancia de equilibrio cuando la energía potencial total es mínima; si los átomos se acercan demasiado predominan las repulsiones y si se separan mucho desaparece la atracción.`,
  "fyq-t2-003": `La regla del octeto es una guía de Lewis: muchos átomos tienden a ganar, perder o compartir electrones hasta tener ocho electrones en su capa de valencia, parecida a la de un gas noble. No es una ley sin excepciones: el hidrógeno busca un dueto y algunos elementos pueden quedar con octeto incompleto o ampliado.`,
  "fyq-t2-004": `En un enlace iónico suele participar un metal, que pierde electrones y se convierte en catión, y un no metal, que los gana y se convierte en anión. La atracción electrostática entre cargas opuestas organiza los iones en una red. No se forman moléculas aisladas de NaCl, sino unidades fórmula dentro del cristal.`,
  "fyq-t2-005": `El sodio tiene configuración [Ne]3s¹ y pierde su electrón externo: Na → Na⁺ + e⁻, quedando con [Ne]. El cloro tiene [Ne]3s²3p⁵ y gana ese electrón: Cl + e⁻ → Cl⁻, quedando con [Ar]. La atracción Na⁺–Cl⁻ y la red resultante forman NaCl, y ambos iones alcanzan configuración de gas noble.`,
  "fyq-t2-006": `Una red cristalina iónica es una disposición tridimensional, ordenada y repetitiva de cationes y aniones. Cada ion se rodea del mayor número posible de iones de signo contrario sin acercar demasiado cargas iguales. Por eso un cristal iónico se describe mediante una unidad fórmula, como NaCl, y no mediante moléculas independientes.`,
  "fyq-t2-007": `La energía de red cuantifica la estabilidad de la red iónica; según la convención puede definirse como energía liberada al formarla o como energía necesaria para separarla. Lo importante es comparar su valor absoluto: una energía de red grande implica atracciones electrostáticas fuertes y, por tanto, una red más estable y difícil de romper.`,
  "fyq-t2-008": `El índice de coordinación cuenta los iones vecinos más próximos de signo contrario que rodean a uno dado. En la estructura del NaCl, cada Na⁺ está rodeado por seis Cl⁻ y cada Cl⁻ por seis Na⁺. Por eso el índice de coordinación es 6:6, o 6 para cada tipo de ion.`,
  "fyq-t2-009": `Los iones están unidos por fuerzas electrostáticas intensas, lo que dificulta rayar el cristal y explica su dureza. Sin embargo, al desplazar una capa por un golpe pueden quedar enfrentados iones del mismo signo. La repulsión entre esas cargas rompe la red, por eso los sólidos iónicos son frágiles aunque sean duros.`,
  "fyq-t2-010": `En el cristal sólido los cationes y aniones ocupan posiciones fijas y no pueden transportar carga a través del material. Al fundirlo, o al disolverlo en agua, los iones adquieren movilidad y pueden desplazarse hacia los electrodos. Por eso un compuesto iónico conduce en estado líquido o en disolución, pero normalmente no como sólido.`,
  "fyq-t2-011": `El agua es polar: el oxígeno tiene carga parcial negativa, δ−, y los hidrógenos carga parcial positiva, δ+. Alrededor de un catión se orienta el oxígeno hacia el ion; alrededor de un anión se orientan los hidrógenos. Estas atracciones ion-dipolo ayudan a separar y estabilizar los iones en la disolución.`,
  "fyq-t2-012": `Un enlace covalente se forma normalmente entre átomos no metálicos con electronegatividades parecidas. Como ninguno cede o capta por completo los electrones con facilidad, los comparten. El par compartido atrae a ambos núcleos y puede permitir que cada átomo complete, aproximadamente, su capa de valencia.`,
  "fyq-t2-013": `En una estructura de Lewis, una pareja de electrones compartida se representa como dos puntos o como una línea entre los símbolos. Esa pareja constituye un enlace covalente sencillo; cada átomo aporta normalmente un electrón al par, aunque existen enlaces dativos en los que ambos electrones proceden de la misma especie.`,
  "fyq-t2-014": `Un enlace covalente triple implica compartir tres pares, es decir, seis electrones, entre los mismos dos átomos. En una descripción más detallada contiene un enlace σ y dos enlaces π. Al aumentar el orden de enlace, suele disminuir la distancia entre los núcleos y aumentar la energía necesaria para romperlo.`,
  "fyq-t2-015": `La fórmula molecular indica el número real de átomos de cada elemento en una molécula: H₂O₂ tiene dos H y dos O. La fórmula empírica reduce esos subíndices a la proporción entera más sencilla: 2:2 se divide entre 2 y produce HO. La fórmula empírica no informa del tamaño real de la molécula.`,
  "fyq-t2-016": `El CO₂ tiene 16 electrones de valencia: 4 del carbono y 6 de cada oxígeno. El carbono se coloca en el centro y comparte dos pares con cada oxígeno, de modo que la estructura es O=C=O. Cada átomo completa su octeto y la molécula resulta lineal, con un ángulo aproximado de 180°.`,
  "fyq-t2-017": `En un enlace covalente dativo o coordinado, la especie dadora aporta los dos electrones del par compartido y la especie aceptora aporta un orbital vacío o un sitio disponible. Se representa con una flecha dador → aceptor. Una vez formado, el enlace no se distingue físicamente de otro covalente por el origen de sus electrones.`,
  "fyq-t2-018": `El oxígeno es más electronegativo que el hidrógeno, así que atrae con más fuerza el par compartido del enlace H—O. La distribución no es uniforme: O queda con δ− y H con δ+. Como los electrones siguen compartidos y no se transfieren por completo, el enlace es covalente polar, no iónico.`,
  "fyq-t2-019": `La polaridad molecular depende de la suma vectorial de los dipolos de enlace y de la geometría. En H₂O, la forma angular hace que los dipolos no se cancelen y la molécula sea polar. En CO₂, los dos dipolos son iguales y opuestos en una molécula lineal, por lo que se anulan y el conjunto es apolar.`,
  "fyq-t2-020": `En una sustancia covalente molecular hay moléculas independientes: dentro de cada una actúan enlaces covalentes fuertes, pero entre ellas actúan fuerzas intermoleculares más débiles. Estas últimas determinan en gran medida los puntos de fusión y ebullición, por lo que muchas sustancias moleculares tienen estados sólido, líquido o gaseoso según la temperatura.`,
  "fyq-t2-021": `En un cristal covalente no existen moléculas aisladas: los átomos están unidos por enlaces covalentes que se extienden por toda la red, como en el diamante o la sílice. Para deformarlo o fundirlo hay que romper muchos enlaces fuertes, lo que explica su dureza y sus altos puntos de fusión; la red también puede fracturarse de forma frágil.`,
  "fyq-t2-022": `En el grafito, cada carbono forma tres enlaces covalentes con vecinos de una capa y queda un electrón deslocalizado. Esos electrones pueden moverse por las capas y transportar carga, por lo que el grafito conduce, sobre todo, en la dirección paralela a ellas. El diamante no dispone de esos electrones libres y no conduce igual.`,
  "fyq-t2-023": `En el enlace metálico, los electrones de valencia quedan deslocalizados y se mueven por una red de cationes metálicos. La atracción entre la nube electrónica negativa y los cationes mantiene unido el sólido. Como los electrones pueden desplazarse, los metales conducen el calor y la electricidad y reflejan la luz.`,
  "fyq-t2-024": `El enlace metálico no está dirigido hacia un par concreto de átomos: la nube electrónica común mantiene la atracción aunque las capas de cationes se desplacen. Por eso el material puede deformarse sin que se rompa toda la red. Ductilidad significa formar hilos y maleabilidad significa formar láminas.`,
  "fyq-t2-025": `Una molécula polar posee un dipolo permanente, con un extremo parcialmente positivo y otro parcialmente negativo. Las interacciones dipolo-dipolo aparecen cuando el extremo δ+ de una molécula atrae al extremo δ− de otra. Su intensidad depende de los momentos dipolares y de la orientación y distancia entre moléculas.`,
  "fyq-t2-026": `Un enlace de hidrógeno aparece cuando H está unido covalentemente a un átomo muy electronegativo, principalmente F, O o N, y es atraído por un par libre de F, O o N de otra molécula. La fuerte polarización concentra una carga parcial positiva en H y hace esta interacción más intensa que un dipolo-dipolo ordinario.`,
  "fyq-t2-027": `Los electrones se mueven continuamente y pueden concentrarse un instante más en una zona de una partícula, creando un dipolo instantáneo. Ese dipolo deforma la nube electrónica de una partícula vecina y le induce otro dipolo. Las atracciones resultantes son fuerzas de dispersión, presentes en todas las sustancias y mayores cuanto más polarizable es la nube electrónica.`,
  "fyq-t2-028": `Al disolver un compuesto iónico en agua, cada ion interacciona con los dipolos permanentes de las moléculas del disolvente. El oxígeno, δ−, se orienta hacia los cationes y los hidrógenos, δ+, hacia los aniones. Esta atracción ion-dipolo forma capas de hidratación que estabilizan los iones separados en el agua.`,
  "fyq-t2-029": `El agua forma una red extensa de enlaces de hidrógeno porque cada molécula tiene enlaces O—H muy polares y pares electrónicos libres en el oxígeno. Separar sus moléculas exige aportar bastante energía, por eso su punto de ebullición es alto comparado con el de otras moléculas de masa parecida.`,
  "fyq-t2-030": `La regla de semejanza indica que un soluto polar suele disolverse mejor en un disolvente polar y uno apolar en un disolvente apolar. Disolver requiere romper interacciones soluto-soluto y disolvente-disolvente y formar otras nuevas; el proceso es favorable cuando las interacciones nuevas compensan suficientemente las que se han roto.`,
  "fyq-t2-031": `La nieve carbónica sublima según CO₂(s) → CO₂(g): pasa directamente de sólido a gas. En el cambio se separan las moléculas y se vencen fuerzas intermoleculares, pero cada molécula conserva sus enlaces covalentes C=O. Por eso no se descompone el CO₂ en carbono y oxígeno al sublimarse.`,
  "fyq-t2-032": `NaCl forma una red cristalina iónica de Na⁺ y Cl⁻; H₂O está formada por moléculas covalentes polares; SiO₂ es una red covalente extendida; y Hg es un metal con enlace metálico, aunque sea líquido a temperatura ambiente. La asociación correcta distingue entre red iónica, sustancia molecular, red covalente y red metálica.`
};

const PREGUNTAS_T3_6 = [
  /* ============================== TEMA 3 ============================== */
  pregunta("fyq-t3-001", 3, "¿Cómo se expresa 0,00000325 en notación científica?", {
    A: "3,25 · 10⁻⁶", B: "3,25 · 10⁶", C: "0,325 · 10⁻⁵", D: "32,5 · 10⁻⁶"
  }, "A", "La notación científica tiene la forma a · 10ⁿ, con 1 ≤ a < 10. En 0,00000325 desplazamos la coma seis posiciones hacia la derecha hasta obtener 3,25; como el número original es menor que uno, el exponente es negativo: 0,00000325 = 3,25 · 10⁻⁶. Al comprobarlo, 10⁻⁶ equivale a dividir entre un millón y 3,25/1 000 000 = 0,00000325; el exponente indica exactamente cuántos lugares se ha movido la coma."),
  pregunta("fyq-t3-002", 3, "¿Qué afirma la ley de conservación de la masa de Lavoisier?", {
    A: "La masa de los productos siempre es mayor que la de los reactivos", B: "En una reacción química, la masa total se conserva", C: "Solo se conserva la masa de los sólidos", D: "La masa desaparece cuando se forma un gas"
  }, "B", "La ley se expresa como m(reactivos) = m(productos) en un sistema cerrado. Durante la reacción se rompen y forman enlaces, pero los átomos no desaparecen: se reorganizan. Si parece que la masa cambia, normalmente se ha escapado o incorporado alguna sustancia gaseosa al sistema que se está pesando."),
  pregunta("fyq-t3-003", 3, "¿Qué explica que un metal gane masa al calentarse en presencia de aire?", {
    A: "Que absorbe oxígeno y forma un óxido", B: "Que crea materia a partir del calor", C: "Que pierde electrones y por eso pesa más", D: "Que el aire no participa en la reacción"
  }, "A", "Al calcinar un metal, sus átomos pueden combinarse con el oxígeno del aire: metal + oxígeno → óxido metálico. La masa del óxido incluye la masa inicial del metal más la del oxígeno incorporado. En un recipiente cerrado se comprueba que la masa total del sistema se conserva, aunque cambie la masa de cada sustancia."),
  pregunta("fyq-t3-004", 3, "¿Qué establece la ley de las proporciones definidas de Proust?", {
    A: "Un compuesto siempre contiene sus elementos en la misma proporción en masa", B: "Los gases siempre ocupan el mismo volumen", C: "Un elemento solo puede formar un compuesto", D: "La masa atómica no depende del elemento"
  }, "A", "Un compuesto puro tiene composición constante: la proporción entre las masas de sus elementos es fija, independientemente de cómo se haya obtenido. Por ejemplo, si un compuesto contiene 3 g de hierro por cada 2 g de azufre, una muestra doble contendrá 6 g y 4 g. Si la proporción cambia, no se trata del mismo compuesto puro."),
  pregunta("fyq-t3-005", 3, "Dos elementos forman varios compuestos. ¿Qué afirma la ley de las proporciones múltiples de Dalton?", {
    A: "Las masas de un elemento que se combinan con una masa fija del otro guardan una relación de números enteros sencillos", B: "Todos los compuestos tienen la misma masa", C: "La proporción entre elementos siempre es decimal", D: "Los elementos no pueden combinarse más de una vez"
  }, "A", "Para aplicar la ley se fija la masa de uno de los elementos y se comparan las diferentes masas del otro en los compuestos. Si las masas son, por ejemplo, 4 g y 8 g, su relación es 1:2, un número entero sencillo. Esto refleja que los átomos se combinan en cantidades enteras, no de forma continua."),
  pregunta("fyq-t3-006", 3, "¿Qué idea de Dalton relaciona las proporciones múltiples con la estructura de la materia?", {
    A: "Los átomos de los elementos se combinan en relaciones de números enteros", B: "Los átomos pueden dividirse durante toda reacción", C: "Las moléculas no contienen átomos", D: "La masa de los electrones determina toda la composición"
  }, "A", "La teoría atómica de Dalton interpreta las leyes ponderales suponiendo que la materia está formada por átomos y que los compuestos contienen combinaciones enteras de ellos. Por eso dos compuestos formados por los mismos elementos pueden tener fórmulas distintas, como CO y CO₂, y proporciones de masa relacionadas por números sencillos."),
  pregunta("fyq-t3-007", 3, "¿Qué indica la ley de los volúmenes de combinación de Gay-Lussac?", {
    A: "Los gases reaccionan en proporciones de volumen sencillas si la presión y la temperatura son iguales", B: "Los líquidos siempre reaccionan en proporción 1:1", C: "El volumen de un gas no depende de la temperatura", D: "Solo los sólidos pueden formar moléculas"
  }, "A", "Cuando los gases reaccionan manteniendo la misma temperatura y presión, los volúmenes de reactivos y productos guardan relaciones de números enteros sencillos. Por ejemplo, 2 volúmenes de H₂ pueden reaccionar con 1 volumen de O₂ para formar 2 volúmenes de vapor de agua. La condición de igual T y p es esencial para comparar volúmenes."),
  pregunta("fyq-t3-008", 3, "¿Qué afirma la hipótesis de Avogadro para gases a la misma presión y temperatura?", {
    A: "Volúmenes iguales contienen igual número de partículas", B: "Masas iguales contienen siempre igual número de partículas", C: "Todos los gases tienen la misma masa molar", D: "La presión no depende del número de partículas"
  }, "A", "La hipótesis de Avogadro establece que, a igual presión y temperatura, el volumen de un gas es proporcional a la cantidad de sustancia: V ∝ n. Por eso dos recipientes con el mismo volumen de gases diferentes contienen el mismo número de moléculas si están a la misma T y p, aunque sus masas sean distintas."),
  pregunta("fyq-t3-009", 3, "¿Cuál es la masa molecular relativa aproximada del CO₂?", {
    A: "28", B: "32", C: "44", D: "48"
  }, "C", "La masa molecular relativa se obtiene sumando las masas atómicas relativas de todos los átomos de la fórmula: Mr(CO₂) = Ar(C) + 2·Ar(O) = 12,00 + 2·16,00 = 44,00. Como es una magnitud relativa, no lleva unidades; la masa molar correspondiente sí se expresa como 44,00 g/mol."),
  pregunta("fyq-t3-010", 3, "¿Qué representa un mol de una sustancia?", {
    A: "Una masa fija de 1 gramo", B: "6,022 · 10²³ entidades elementales de esa sustancia", C: "El volumen de un gas en cualquier condición", D: "Un átomo aislado"
  }, "B", "El mol es la unidad de cantidad de sustancia y contiene el número de Avogadro, Nₐ = 6,022 · 10²³, de entidades: átomos, moléculas, iones u otras. La entidad debe especificarse. Un mol de H₂O contiene 6,022 · 10²³ moléculas de agua, mientras que un mol de átomos de carbono contiene ese número de átomos de carbono."),
  pregunta("fyq-t3-011", 3, "¿Cuántas moléculas hay aproximadamente en 0,50 mol de agua?", {
    A: "1,20 · 10²⁴", B: "3,01 · 10²³", C: "6,02 · 10²²", D: "0,50 · 10²³"
  }, "B", "Se usa N = n·Nₐ, donde n es la cantidad en mol y Nₐ el número de Avogadro. Por tanto, N = 0,50 mol · 6,022 · 10²³ moléculas/mol = 3,011 · 10²³ moléculas. El mol no es un número de moléculas variable: siempre contiene Nₐ entidades. Las unidades mol se cancelan y queda moléculas; como 0,50 tiene dos cifras significativas, el resultado puede expresarse como 3,0 · 10²³ moléculas."),
  pregunta("fyq-t3-012", 3, "¿Cuál es la masa molar aproximada del CaCO₃?", {
    A: "56,08 g/mol", B: "84,10 g/mol", C: "100,09 g/mol", D: "116,09 g/mol"
  }, "C", "La fórmula contiene un Ca, un C y tres O. Se calcula M(CaCO₃) = 40,08 + 12,01 + 3·16,00 = 100,09 g/mol. Esto significa que 1 mol de carbonato de calcio tiene una masa de 100,09 g; la masa molar permite transformar masa en moles mediante n = m/M. El subíndice 3 afecta solo al oxígeno: se suman tres masas atómicas de O, no una sola ni tres masas de toda la fórmula."),
  pregunta("fyq-t3-013", 3, "¿Cuál es la composición centesimal aproximada del agua, H₂O, en masa?", {
    A: "50 % H y 50 % O", B: "11,2 % H y 88,8 % O", C: "5,6 % H y 94,4 % O", D: "88,8 % H y 11,2 % O"
  }, "B", "Primero se calcula M(H₂O) = 2·1,008 + 16,00 = 18,016 g/mol. La masa de H es 2,016 g por mol, así que %H = (2,016/18,016)·100 ≈ 11,2 %; el oxígeno representa el resto, %O ≈ 88,8 %. La composición centesimal expresa qué porcentaje de la masa total aporta cada elemento."),
  pregunta("fyq-t3-014", 3, "Un compuesto contiene 40,0 % de C, 6,7 % de H y 53,3 % de O. ¿Cuál es su fórmula empírica?", {
    A: "CHO", B: "CH₂O", C: "C₂H₄O₂", D: "C₆H₁₂O₆"
  }, "B", "Se toma una base de 100 g: 40,0 g de C, 6,7 g de H y 53,3 g de O. Los moles son aproximadamente 40/12 = 3,33, 6,7/1 = 6,7 y 53,3/16 = 3,33; al dividir todos por el menor, la proporción es 1:2:1. La fórmula empírica es CH₂O; C₂H₄O₂ y C₆H₁₂O₆ tienen la misma proporción, pero no son la fórmula mínima."),
  pregunta("fyq-t3-015", 3, "Si la fórmula empírica es CH₂O y la masa molar es 180 g/mol, ¿cuál es la fórmula molecular?", {
    A: "CH₂O", B: "C₂H₄O₂", C: "C₆H₁₂O₆", D: "C₁₂H₂₄O₁₂"
  }, "C", "La masa de la fórmula empírica es M(CH₂O) = 12 + 2·1 + 16 = 30 g/mol. Se calcula el multiplicador k = M molecular/M empírica = 180/30 = 6. Multiplicamos todos los subíndices por 6: (CH₂O)₆ = C₆H₁₂O₆. La fórmula molecular es siempre un múltiplo entero de la empírica."),
  pregunta("fyq-t3-016", 3, "¿Qué diferencia describe correctamente la fórmula de un compuesto iónico y la de un compuesto molecular?", {
    A: "La fórmula iónica indica la proporción mínima de iones; la molecular indica el número real de átomos de una molécula", B: "Los compuestos iónicos no tienen fórmula", C: "Toda fórmula representa una molécula aislada", D: "Los compuestos moleculares solo se escriben con símbolos sin subíndices"
  }, "A", "Un cristal iónico, como NaCl, no está formado por moléculas independientes; su fórmula indica la proporción mínima que hace neutra la red: un Na⁺ por cada Cl⁻. En una sustancia molecular, como H₂O o CO₂, la fórmula sí informa del número de átomos que hay en cada molécula. Esta diferencia evita interpretar NaCl como una molécula aislada."),

  /* ============================== TEMA 4 ============================== */
  pregunta("fyq-t4-001", 4, "Según la teoría cinética, ¿qué representa la temperatura de un gas?", {
    A: "La energía cinética media de sus partículas", B: "La masa total del recipiente", C: "El número de paredes del recipiente", D: "La cantidad de sustancia solamente"
  }, "A", "La temperatura absoluta está relacionada con la energía cinética media de las partículas. Al aumentar T, las partículas se mueven más deprisa en promedio; al disminuir T, se mueven más lentamente. La temperatura no mide directamente la masa ni el número de partículas: dos gases pueden tener la misma temperatura y distinta cantidad de materia."),
  pregunta("fyq-t4-002", 4, "¿Por qué un gas ejerce presión sobre las paredes del recipiente?", {
    A: "Por los choques de sus partículas contra las paredes", B: "Porque las partículas están completamente quietas", C: "Por la masa de las paredes", D: "Porque el gas se convierte en líquido"
  }, "A", "Las partículas del gas se mueven continuamente y chocan con las paredes. Cada choque transfiere cantidad de movimiento; el efecto conjunto de muchísimos choques por unidad de superficie se mide como presión: p = F/A. Al aumentar la frecuencia o la intensidad de los choques, aumenta la presión."),
  pregunta("fyq-t4-003", 4, "Un gas ocupa 5,0 L a 2,0 atm y temperatura constante. ¿Qué presión ejercerá si ocupa 2,0 L?", {
    A: "0,80 atm", B: "2,0 atm", C: "5,0 atm", D: "10 atm"
  }, "C", "A temperatura y cantidad de gas constantes se aplica Boyle-Mariotte: p₁V₁ = p₂V₂. Despejando, p₂ = p₁V₁/V₂ = (2,0 atm·5,0 L)/(2,0 L) = 5,0 atm. Al reducir el volumen, las partículas chocan más veces por segundo contra las paredes y la presión aumenta; por eso la opción correcta es C."),
  pregunta("fyq-t4-004", 4, "¿A qué temperatura absoluta equivalen 27 °C?", {
    A: "27 K", B: "246 K", C: "300 K", D: "546 K"
  }, "C", "Las leyes de los gases requieren temperatura absoluta, no grados Celsius. La conversión es T(K) = t(°C) + 273,15; por tanto, T = 27 + 273,15 = 300,15 K, que se redondea normalmente a 300 K. No se pueden usar directamente 27 en una relación como p/T o V/T."),
  pregunta("fyq-t4-005", 4, "Un gas está a 1,0 atm y 300 K en un recipiente de volumen constante. ¿Qué presión tendrá a 600 K?", {
    A: "0,50 atm", B: "1,0 atm", C: "2,0 atm", D: "600 atm"
  }, "C", "A volumen constante y con la misma cantidad de gas se aplica la ley de Gay-Lussac: p₁/T₁ = p₂/T₂. Despejamos p₂ = p₁T₂/T₁ = (1,0 atm)(600 K)/(300 K) = 2,0 atm. El cociente 600/300 = 2 indica que la temperatura absoluta se duplica; por eso también se duplica la energía cinética media y, al no cambiar el volumen, aumentan proporcionalmente los choques contra las paredes. Es imprescindible usar kelvin, no 300 y 600 °C."),
  pregunta("fyq-t4-006", 4, "Un gas ocupa 1,2 L a 300 K y presión constante. ¿Qué volumen ocupará a 450 K?", {
    A: "0,80 L", B: "1,2 L", C: "1,8 L", D: "2,4 L"
  }, "C", "A presión constante y con la misma cantidad de gas se aplica la ley de Charles: V₁/T₁ = V₂/T₂. Por tanto, V₂ = V₁T₂/T₁ = (1,2 L)(450 K)/(300 K) = 1,8 L. Como 450/300 = 1,5, el volumen aumenta un 50 %, exactamente en la misma proporción que la temperatura absoluta. La temperatura debe estar en kelvin: si se usaran grados Celsius, la proporcionalidad no sería correcta."),
  pregunta("fyq-t4-007", 4, "¿Qué relación resume la ecuación general de los gases para una cantidad fija de gas?", {
    A: "pV/T = constante", B: "pT/V = constante", C: "p + V + T = constante", D: "p/V/T = constante"
  }, "A", "Las tres leyes experimentales se combinan en p₁V₁/T₁ = p₂V₂/T₂, o pV/T = constante si n permanece fija. Esta expresión permite relacionar dos estados del mismo gas cuando cambian simultáneamente presión, volumen y temperatura. Siempre hay que usar unidades coherentes y T en kelvin."),
  pregunta("fyq-t4-008", 4, "¿Qué ecuación relaciona presión, volumen, cantidad de sustancia y temperatura de un gas ideal?", {
    A: "pV = nRT", B: "p = nVRT", C: "V = pRT/n", D: "pV = RT/n"
  }, "A", "La ecuación de estado es pV = nRT, donde p es la presión, V el volumen, n los moles, T la temperatura absoluta y R la constante de los gases. Si p está en atm y V en L, puede usarse R = 0,082 L·atm·mol⁻¹·K⁻¹. La ecuación muestra que V aumenta con n y T, y disminuye cuando aumenta p."),
  pregunta("fyq-t4-009", 4, "¿Qué volumen ocupa aproximadamente 1 mol de gas ideal a 1 atm y 273 K?", {
    A: "1,00 L", B: "11,2 L", C: "22,4 L", D: "273 L"
  }, "C", "Se aplica la ecuación de los gases ideales, pV = nRT, despejando V = nRT/p. Para 1 mol, V = (1 mol)(0,082 L·atm·mol⁻¹·K⁻¹)(273 K)/(1 atm) ≈ 22,4 L. Las unidades mol, atm y K se cancelan correctamente y queda litro. Estas condiciones se llaman tradicionalmente condiciones normales; si cambian la presión o la temperatura, el volumen molar deja de ser 22,4 L y debe recalcularse con V = nRT/p."),
  pregunta("fyq-t4-010", 4, "Un gas tiene una masa de 4,0 g y ocupa 2,0 L. ¿Cuál es su densidad?", {
    A: "0,50 g/L", B: "2,0 g/L", C: "6,0 g/L", D: "8,0 g/L"
  }, "B", "La densidad es masa dividida entre volumen: d = m/V. Sustituyendo, d = 4,0 g/2,0 L = 2,0 g/L. La densidad depende de las condiciones del gas: para la misma sustancia aumenta con la presión y disminuye cuando aumenta la temperatura, si se mantiene la cantidad de gas."),
  pregunta("fyq-t4-011", 4, "¿Qué expresión permite calcular la masa molar de un gas ideal a partir de su densidad?", {
    A: "M = dRT/p", B: "M = p/(dRT)", C: "M = d p/(RT)", D: "M = RT/(dp)"
  }, "A", "Partimos de pV = nRT y de n = m/M. Sustituyendo: pV = (m/M)RT; al despejar, M = mRT/(pV). Como d = m/V, entonces m/V = d y resulta M = dRT/p. La comprobación de unidades confirma el resultado: (g/L)(L·atm·mol⁻¹·K⁻¹)(K)/atm = g/mol. Por ejemplo, hay que usar d en g/L, p en atm, R = 0,082 L·atm·mol⁻¹·K⁻¹ y T en K; si se mezclan Pa con litros, el valor numérico será incorrecto."),
  pregunta("fyq-t4-012", 4, "¿En qué condiciones se aparta más un gas real del comportamiento ideal?", {
    A: "Baja presión y alta temperatura", B: "Alta presión y baja temperatura", C: "Cualquier condición exactamente igual", D: "Solo cuando no tiene masa"
  }, "B", "El modelo ideal supone partículas puntuales sin volumen propio y sin atracciones entre ellas. A alta presión las partículas están muy juntas y su volumen deja de ser despreciable; a baja temperatura se mueven más despacio y las atracciones intermoleculares influyen más. Por eso el comportamiento real se aparta especialmente de la idealidad en alta p y baja T."),
  pregunta("fyq-t4-013", 4, "¿Qué afirma la ley de Dalton para una mezcla de gases?", {
    A: "La presión total es la suma de las presiones parciales", B: "Todos los gases tienen la misma presión parcial", C: "La presión total es siempre cero", D: "La presión depende solo del gas más pesado"
  }, "A", "En una mezcla ideal, cada gas ejerce una presión parcial como si ocupase solo el recipiente. La presión total es pₜ = p₁ + p₂ + … + pₙ. La presión parcial también puede escribirse pᵢ = xᵢpₜ, donde xᵢ es la fracción molar del componente; por eso todos los componentes contribuyen a la presión total."),
  pregunta("fyq-t4-014", 4, "Una mezcla contiene 2 mol de N₂ y 3 mol de O₂. ¿Cuál es la fracción molar del O₂?", {
    A: "0,20", B: "0,40", C: "0,60", D: "3,00"
  }, "C", "La fracción molar es la cantidad de moles del componente dividida entre los moles totales: x(O₂) = n(O₂)/nₜ = 3/(2+3) = 0,60. No tiene unidades y puede expresarse como porcentaje: 0,60 equivale al 60 % de los moles de la mezcla. La suma de todas las fracciones molares debe ser 1; aquí x(N₂) = 2/5 = 0,40 y 0,40 + 0,60 = 1. Además, en una mezcla ideal p(O₂) = x(O₂)pₜ, de modo que el oxígeno aporta el 60 % de la presión total."),
  pregunta("fyq-t4-015", 4, "En una mezcla ideal de gases, ¿qué relación hay entre fracción molar y porcentaje en volumen?", {
    A: "El porcentaje en volumen es 100·xᵢ", B: "El porcentaje en volumen siempre es cero", C: "Es 100 dividido entre xᵢ", D: "No tienen ninguna relación"
  }, "A", "A la misma presión y temperatura, el volumen es proporcional al número de moles, según Avogadro. Por eso Vᵢ/Vₜ = nᵢ/nₜ = xᵢ y el porcentaje en volumen es %Vᵢ = xᵢ·100. Una fracción molar de 0,21 equivale aproximadamente a un 21 % en volumen de ese gas."),
  pregunta("fyq-t4-016", 4, "¿Qué magnitudes deben expresarse siempre en kelvin y en unidades coherentes al usar pV = nRT?", {
    A: "Solo la presión", B: "La temperatura absoluta y las unidades compatibles con el valor de R", C: "Solo la cantidad de sustancia", D: "Ninguna, porque la ecuación no tiene unidades"
  }, "B", "La temperatura debe convertirse con T(K) = t(°C) + 273,15 porque las leyes de los gases relacionan temperatura absoluta. Además, el valor de R fija las unidades: R = 0,082 L·atm·mol⁻¹·K⁻¹ se combina con L y atm, mientras que R = 8,314 J·mol⁻¹·K⁻¹ exige Pa y m³. Mezclar sistemas produce resultados numéricos incorrectos."),

  /* ============================== TEMA 5 ============================== */
  pregunta("fyq-t5-001", 5, "¿Qué diferencia hay entre una propiedad extensiva e intensiva?", {
    A: "La extensiva depende de la cantidad de materia; la intensiva no", B: "La intensiva depende siempre de la masa", C: "No existe diferencia", D: "La extensiva solo se aplica a gases"
  }, "A", "La masa y el volumen son extensivas: si duplicamos la cantidad de sustancia, normalmente se duplican. La densidad y la temperatura son intensivas: una muestra grande y una pequeña de la misma sustancia pueden tener el mismo valor. Esta clasificación no depende de que la propiedad sea física o química."),
  pregunta("fyq-t5-002", 5, "¿Cuál de estas propiedades sirve habitualmente para identificar una sustancia?", {
    A: "La masa de la muestra", B: "El volumen de la muestra", C: "La densidad en condiciones especificadas", D: "El tamaño del recipiente"
  }, "C", "La densidad es una propiedad característica o intensiva porque, fijadas la temperatura y la presión, tiene un valor propio para cada sustancia pura. La masa y el volumen dependen de cuánto material se haya tomado. La densidad se calcula con d = m/V y debe acompañarse de sus unidades y condiciones de medida."),
  pregunta("fyq-t5-003", 5, "Una muestra tiene 200 g y ocupa 50 cm³. ¿Cuál es su densidad?", {
    A: "0,25 g/cm³", B: "4,0 g/cm³", C: "50 g/cm³", D: "250 g/cm³"
  }, "B", "Se usa la definición de densidad, d = m/V. Sustituyendo, d = 200 g/50 cm³ = 4,0 g/cm³. La unidad queda porque se divide una masa entre un volumen; no hay que sumar masa y volumen. La misma relación puede despejarse como m = dV o V = m/d. Si se necesitara el SI, habría que convertir a kg/m³: 1 g/cm³ = 1000 kg/m³, por tanto 4,0 g/cm³ = 4000 kg/m³. Una densidad tan alta puede ayudar a comparar o identificar materiales, siempre considerando la temperatura."),
  pregunta("fyq-t5-004", 5, "¿Cuál es una mezcla homogénea o disolución?", {
    A: "Granito", B: "Agua con azúcar completamente disuelto", C: "Arena con piedras", D: "Agua y aceite separados"
  }, "B", "En una mezcla homogénea no se distinguen sus componentes a simple vista y cualquier porción tiene la misma composición, si está bien mezclada. El azúcar disuelto se distribuye entre las moléculas de agua. El granito, la arena y el sistema agua-aceite son heterogéneos porque presentan regiones o fases distinguibles."),
  pregunta("fyq-t5-005", 5, "En una disolución de agua y sal, ¿qué papel desempeña normalmente el agua?", {
    A: "Soluto, porque está en menor cantidad", B: "Disolvente, porque suele ser el componente mayoritario", C: "Producto de una reacción", D: "No forma parte de la disolución"
  }, "B", "El disolvente es el componente que está en mayor proporción y en el que se dispersa el soluto. En agua salada, el agua es el disolvente y la sal el soluto. Puede haber más de un soluto, pero normalmente se identifica un único disolvente; ambos quedan en una mezcla homogénea."),
  pregunta("fyq-t5-006", 5, "Una disolución contiene 5 g de soluto y 95 g de disolvente. ¿Cuál es su porcentaje en masa de soluto?", {
    A: "5 %", B: "5,26 %", C: "95 %", D: "100 %"
  }, "A", "La masa total de disolución es m_d = m_soluto + m_disolvente = 5 g + 95 g = 100 g. El porcentaje en masa se calcula con % m/m = (m_soluto/m_disolución)·100 = (5 g/100 g)·100 = 5 %. Esto significa que hay 5 g de soluto por cada 100 g de disolución. No se divide entre la masa del disolvente: hacerlo daría 5,26 %, que no representa la definición solicitada. Si se preparasen 200 g con la misma concentración, contendrían 10 g de soluto."),
  pregunta("fyq-t5-007", 5, "Una bebida tiene un 5 % en volumen de alcohol. ¿Qué volumen de alcohol hay en 200 mL?", {
    A: "1 mL", B: "5 mL", C: "10 mL", D: "40 mL"
  }, "C", "El porcentaje en volumen es % V/V = (V_soluto/V_disolución)·100. Despejando, V_soluto = (%/100)·V_disolución = (5/100)·200 mL = 10 mL. El resto del volumen corresponde aproximadamente al disolvente y otros componentes, según cómo se haya preparado la bebida."),
  pregunta("fyq-t5-008", 5, "¿Cuál es la concentración en masa de una disolución con 5 g de azúcar en 100 mL de disolución?", {
    A: "0,05 g/L", B: "5 g/L", C: "50 g/L", D: "500 g/L"
  }, "C", "La concentración en masa se define como cₘ = m_soluto/V_disolución. Primero convertimos 100 mL = 0,100 L; después cₘ = 5 g/0,100 L = 50 g/L. Es distinta del porcentaje en masa porque aquí se divide entre el volumen total de la disolución, no entre su masa."),
  pregunta("fyq-t5-009", 5, "¿Cuál es la molaridad de 5,00 g de NaCl disueltos hasta 100 mL de disolución?", {
    A: "0,0856 M", B: "0,856 M", C: "5,00 M", D: "58,45 M"
  }, "B", "La molaridad es M = n/V, con V en litros. La masa molar del NaCl es 58,45 g/mol, así que n = 5,00/58,45 = 0,0855 mol; como 100 mL = 0,100 L, M = 0,0855/0,100 = 0,855 mol/L ≈ 0,856 M. El volumen que se usa es el volumen final de la disolución, no el del agua añadida inicialmente."),
  pregunta("fyq-t5-010", 5, "¿Qué relación se utiliza para diluir una disolución sin cambiar la cantidad de soluto?", {
    A: "M₁V₁ = M₂V₂", B: "M₁ + V₁ = M₂ + V₂", C: "M₁/V₁ = M₂V₂", D: "M₁V₂ = M₂/V₁"
  }, "A", "Al añadir disolvente, los moles de soluto permanecen constantes: n₁ = n₂. Como n = M·V, se obtiene M₁V₁ = M₂V₂. Los volúmenes deben estar en las mismas unidades; si se conocen tres magnitudes, se despeja la cuarta. La concentración baja porque el mismo soluto se reparte en un volumen mayor."),
  pregunta("fyq-t5-011", 5, "¿Cuál es el procedimiento correcto para preparar una disolución a partir de un soluto sólido?", {
    A: "Pesar el soluto, disolverlo y enrasar en un matraz aforado", B: "Añadir agua hasta cualquier volumen y no agitar", C: "Calentar el sólido hasta que hierva", D: "Pesar solo el agua y suponer la concentración"
  }, "A", "Se calcula la masa necesaria con n = M·V y m = n·M_molar, se pesa el sólido, se disuelve en una pequeña cantidad de agua y se transfiere al matraz aforado. Después se añade disolvente hasta la marca de enrase, se tapa y se homogeneiza. La concentración se refiere al volumen final exacto de la disolución."),
  pregunta("fyq-t5-012", 5, "Al preparar una disolución desde un reactivo comercial de riqueza conocida, ¿qué debe tenerse en cuenta?", {
    A: "Solo el volumen del agua", B: "La riqueza y, si es líquido, la densidad para calcular el volumen comercial", C: "Que el reactivo comercial siempre es puro", D: "Que la masa molar deja de ser necesaria"
  }, "B", "Si el reactivo tiene una riqueza del 37 %, solo 37 g de cada 100 g de producto son soluto puro. Primero se calcula la masa pura necesaria; después m_comercial = m_pura/(riqueza/100). Si el producto es líquido, la densidad permite obtener V_comercial = m_comercial/d. Finalmente se completa hasta el volumen de disolución indicado."),
  pregunta("fyq-t5-013", 5, "¿Qué diferencia hay entre molaridad y molalidad?", {
    A: "La molaridad usa moles de soluto por litro de disolución; la molalidad, moles por kilogramo de disolvente", B: "Ambas usan siempre gramos por litro", C: "La molalidad usa volumen de disolvente", D: "La molaridad no depende del volumen"
  }, "A", "La molaridad es M = n_soluto/V_disolución, en mol/L, mientras que la molalidad es m = n_soluto/m_disolvente, en mol/kg. La molaridad puede variar con la temperatura porque el volumen se dilata; la molalidad usa una masa de disolvente y resulta menos sensible a ese efecto. No hay que confundir la M de molaridad con la M de masa molar, según el contexto."),
  pregunta("fyq-t5-014", 5, "Una mezcla tiene 2 mol de soluto y 8 mol de disolvente. ¿Cuál es la fracción molar del soluto?", {
    A: "0,02", B: "0,20", C: "0,25", D: "2,00"
  }, "B", "La fracción molar se calcula como x_soluto = n_soluto/(n_soluto+n_disolvente). Por tanto, x = 2/(2+8) = 0,20. No tiene unidades y expresa la proporción de partículas, en términos de moles, que corresponde al soluto; la fracción del disolvente es 0,80 y ambas suman 1."),
  pregunta("fyq-t5-015", 5, "¿Cómo suele variar la solubilidad de un sólido en agua cuando aumenta la temperatura?", {
    A: "Suele aumentar, aunque hay excepciones", B: "Siempre se hace cero", C: "Siempre disminuye", D: "No puede depender de la temperatura"
  }, "A", "En muchos sólidos, elevar la temperatura favorece que sus partículas pasen a la disolución y aumenta la solubilidad. La relación concreta depende del proceso y existen excepciones. Una curva de solubilidad indica la cantidad máxima que se disuelve a cada temperatura; superar ese valor produce una disolución saturada y sólido sin disolver."),
  pregunta("fyq-t5-016", 5, "¿Cómo influye la presión en la solubilidad de un gas en un líquido?", {
    A: "En general, al aumentar la presión aumenta la solubilidad del gas", B: "La presión no tiene ningún efecto", C: "Al aumentar la presión el gas siempre precipita", D: "Solo depende de la masa del recipiente"
  }, "A", "La solubilidad de un gas aumenta normalmente con su presión parcial sobre el líquido, como expresa la ley de Henry: c = k·p. Al abrir una bebida con gas, la presión de CO₂ disminuye y el gas deja de estar tan soluble, por lo que escapa en forma de burbujas. La temperatura también influye y, para los gases, suele reducir la solubilidad al aumentar."),
  pregunta("fyq-t5-017", 5, "¿Qué expresa la ley de Raoult para una disolución ideal con soluto no volátil?", {
    A: "p_disolvente = x_disolvente · p°disolvente", B: "p_disolvente = p°disolvente/x_disolvente", C: "p = nRT", D: "p_disolvente = 0 siempre"
  }, "A", "La ley de Raoult indica que la presión de vapor del disolvente disminuye al añadir un soluto no volátil: p = x_disolvente·p°. Como x_disolvente es menor que 1, la presión de vapor de la disolución es menor que la del disolvente puro. Esta disminución origina varias propiedades coligativas."),
  pregunta("fyq-t5-018", 5, "¿Qué presión osmótica tiene aproximadamente una disolución ideal diluida?", {
    A: "π = MRT", B: "π = M/(RT)", C: "π = mgh", D: "π = qE"
  }, "A", "La presión osmótica se calcula con π = MRT, análoga a la ecuación de los gases, donde M es la concentración molar, R la constante y T la temperatura absoluta. Representa la presión mínima que debe aplicarse para detener el paso neto de disolvente a través de una membrana semipermeable. Si el soluto se disocia, hay que considerar el número efectivo de partículas."),
  pregunta("fyq-t5-019", 5, "¿Qué ocurre con el punto de ebullición al disolver un soluto no volátil en agua?", {
    A: "Aumenta", B: "Disminuye siempre hasta 0 °C", C: "No cambia nunca", D: "Se convierte en la temperatura del soluto"
  }, "A", "El soluto reduce la presión de vapor del disolvente. Para que la disolución hierva, su presión de vapor debe igualar la presión exterior; si a una temperatura dada es menor, hay que calentar más. El aumento se expresa como ΔT_b = K_b·m, para una disolución diluida, donde m es la molalidad y K_b depende del disolvente."),
  pregunta("fyq-t5-020", 5, "¿Por qué una disolución de sal puede bajar el punto de congelación del agua?", {
    A: "Porque el soluto dificulta la ordenación del disolvente y produce un descenso crioscópico", B: "Porque la sal elimina la masa del agua", C: "Porque el agua deja de tener moléculas", D: "Porque la temperatura de congelación depende solo del recipiente"
  }, "A", "La presencia de partículas de soluto altera el equilibrio entre agua líquida y hielo y hace necesario enfriar más para que se forme el sólido. El descenso se calcula como ΔT_f = K_f·m; por tanto, T_f(disolución) = T_f° − ΔT_f. Cuantas más partículas de soluto haya por kilogramo de disolvente, mayor será el descenso, considerando la disociación si existe."),

  /* ============================== TEMA 6 ============================== */
  pregunta("fyq-t6-001", 6, "¿Qué ocurre en una reacción química?", {
    A: "Los átomos se reorganizan al romperse y formarse enlaces", B: "Los átomos desaparecen", C: "Solo cambia el estado físico", D: "La masa se crea desde la nada"
  }, "A", "En una reacción química, los reactivos se transforman en productos porque se rompen enlaces de los reactivos y se forman otros nuevos. Los átomos de cada elemento se conservan, aunque cambien de agrupación. Por eso hay que ajustar la ecuación y por eso, en un sistema cerrado, también se conserva la masa."),
  pregunta("fyq-t6-002", 6, "¿Qué información aportan los coeficientes de una ecuación química ajustada?", {
    A: "La proporción en moles de reactivos y productos", B: "La temperatura exacta de la reacción", C: "La masa de cada molécula", D: "El color de los productos"
  }, "A", "En 2 H₂ + O₂ → 2 H₂O, los coeficientes indican que reaccionan 2 mol de H₂ por cada 1 mol de O₂ para producir 2 mol de H₂O. También representan proporciones de moléculas y, para gases a la misma T y p, de volúmenes. No indican que una única molécula contenga dos moléculas de H₂: describen una relación macroscópica o de partículas."),
  pregunta("fyq-t6-003", 6, "¿Por qué no se deben cambiar los subíndices al ajustar una ecuación química?", {
    A: "Porque cambiaría la identidad de las sustancias", B: "Porque los subíndices no tienen significado", C: "Porque siempre hay que conservar una ecuación sin números", D: "Porque solo se ajustan los estados físicos"
  }, "A", "El subíndice pertenece a la fórmula de una sustancia: H₂O es agua, mientras que H₂O₂ es otra sustancia. Para conservar la identidad química se modifican únicamente los coeficientes delante de las fórmulas. El ajuste consiste en hacer iguales los átomos de cada elemento a ambos lados, no en inventar nuevas fórmulas."),
  pregunta("fyq-t6-004", 6, "¿Cómo se define la velocidad media de una reacción?", {
    A: "Cambio de concentración de una especie dividido entre el tiempo", B: "Masa total dividida entre volumen del recipiente", C: "Temperatura dividida entre presión", D: "Número atómico dividido entre masa"
  }, "A", "La velocidad mide lo rápido que desaparece un reactivo o aparece un producto. Para un reactivo puede escribirse v = −Δ[reactivo]/Δt, y para un producto v = Δ[producto]/Δt; el signo negativo hace positiva la velocidad porque la concentración del reactivo disminuye. En una ecuación ajustada, los coeficientes permiten comparar las velocidades de consumo y formación."),
  pregunta("fyq-t6-005", 6, "Según la teoría de colisiones, ¿qué condiciones debe cumplir un choque para producir reacción?", {
    A: "Tener energía suficiente y orientación adecuada", B: "Ocurrir entre partículas quietas", C: "Tener siempre temperatura igual a 0 °C", D: "Ser un choque completamente aleatorio sin energía mínima"
  }, "A", "No todos los choques producen reacción. Las partículas deben superar la energía de activación y colisionar con una orientación que permita romper y formar los enlaces adecuados. Aumentar la temperatura incrementa la energía cinética y la frecuencia de choques eficaces; un catalizador reduce la energía de activación sin consumirse globalmente."),
  pregunta("fyq-t6-006", 6, "¿Qué representa la energía de activación?", {
    A: "La barrera energética mínima para que ocurra la reacción", B: "La energía total de los productos siempre", C: "La masa de los reactivos", D: "La energía que se conserva sin cambio"
  }, "A", "En el perfil energético, los reactivos deben alcanzar un estado de transición de mayor energía antes de convertirse en productos. La diferencia entre la energía de los reactivos y ese máximo es la energía de activación, Eₐ. Un catalizador ofrece un camino alternativo con menor Eₐ; no cambia por sí mismo la variación de entalpía entre reactivos y productos."),
  pregunta("fyq-t6-007", 6, "¿Qué signo tiene ΔH en una reacción exotérmica?", {
    A: "ΔH < 0", B: "ΔH = 0 siempre", C: "ΔH > 0", D: "El signo no puede definirse"
  }, "A", "En una reacción exotérmica el sistema libera calor al entorno, por lo que la entalpía de los productos es menor que la de los reactivos. Se expresa ΔH = H_productos − H_reactivos < 0. En una reacción endotérmica se absorbe calor y ΔH > 0; el signo describe el intercambio energético, no la rapidez."),
  pregunta("fyq-t6-008", 6, "¿Qué afirma la ley de Hess?", {
    A: "La variación de entalpía depende solo de estados inicial y final", B: "La entalpía depende de la velocidad", C: "Solo se conserva la temperatura", D: "Una reacción no puede dividirse en etapas"
  }, "A", "La entalpía es una función de estado. Si una reacción global puede expresarse como suma de varias etapas, su variación es ΔH_global = ΔH₁ + ΔH₂ + … + ΔHₙ, aunque las etapas reales sean diferentes. Al invertir una ecuación cambia el signo de ΔH y al multiplicarla por un factor también se multiplica su ΔH."),
  pregunta("fyq-t6-009", 6, "En la ecuación 2 H₂ + O₂ → 2 H₂O, ¿qué relación molar hay entre O₂ y H₂O?", {
    A: "1 mol O₂ : 1 mol H₂O", B: "1 mol O₂ : 2 mol H₂O", C: "2 mol O₂ : 1 mol H₂O", D: "2 mol O₂ : 2 mol H₂O₂"
  }, "B", "Los coeficientes ajustados funcionan como factores de conversión: 1 mol O₂ produce 2 mol H₂O, siempre que el H₂ esté disponible en cantidad suficiente. La proporción es n(H₂O)/n(O₂) = 2/1. No se deben usar los subíndices para hacer este cálculo: los subíndices describen la molécula y los coeficientes la proporción de reacción."),
  pregunta("fyq-t6-010", 6, "¿Cuál es el primer paso correcto de un cálculo estequiométrico?", {
    A: "Escribir y ajustar la ecuación química", B: "Convertir directamente gramos en gramos sin fórmula", C: "Ignorar el reactivo limitante", D: "Usar los coeficientes como gramos"
  }, "A", "La ecuación ajustada es el mapa del cálculo: fija la proporción en moles entre las sustancias. Después se convierte el dato a moles, se aplica la relación de coeficientes y finalmente se transforma el resultado a gramos, volumen o partículas. Los coeficientes no son masas; solo indican cantidades relativas de sustancia."),
  pregunta("fyq-t6-011", 6, "¿Cómo se transforma una masa de sustancia en cantidad de sustancia?", {
    A: "n = m/M", B: "n = m·M", C: "n = M/m²", D: "n = m + M"
  }, "A", "La relación fundamental es n = m/M, donde n es la cantidad de sustancia en mol, m la masa en gramos y M la masa molar en g/mol. Por ejemplo, 18 g de agua corresponden a n = 18 g/(18 g/mol) = 1 mol. Las unidades se comprueban: g dividido entre g/mol deja mol. La fórmula también permite despejar m = nM y M = m/n; por eso primero se calcula correctamente la masa molar a partir de la fórmula química y después se divide la masa disponible entre ella."),
  pregunta("fyq-t6-012", 6, "En una reacción con una sustancia disuelta de concentración M y volumen V, ¿cuántos moles representa?", {
    A: "n = M·V", B: "n = M/V", C: "n = V/M", D: "n = M + V"
  }, "A", "La molaridad se define como M = n/V, donde M se expresa en mol/L y V debe estar en litros. Despejando se obtiene n = M·V. Por ejemplo, 0,50 L de una disolución 2,0 M contienen n = (2,0 mol/L)(0,50 L) = 1,0 mol; los litros se cancelan y queda mol. Es un error frecuente usar mililitros sin convertirlos a litros: 500 mL = 0,500 L. Esta magnitud indica cuántos moles de soluto hay en cada litro de disolución."),
  pregunta("fyq-t6-013", 6, "En un cálculo de reacción, ¿qué es el reactivo limitante?", {
    A: "El que se consume primero y fija la cantidad máxima de producto", B: "El que tiene mayor masa molar", C: "El que aparece como producto", D: "El que sobra al final"
  }, "A", "Se comparan las cantidades disponibles con la proporción que exige la ecuación ajustada. El reactivo que se agota primero es el limitante; determina cuánto producto puede formarse. El otro reactivo queda en exceso y puede calcularse restando la cantidad que reaccionó a la cantidad inicial."),
  pregunta("fyq-t6-014", 6, "¿Cómo se calcula el rendimiento porcentual de una reacción?", {
    A: "% rendimiento = (cantidad real/cantidad teórica)·100", B: "% rendimiento = (teórica/real)·100", C: "% rendimiento = real + teórica", D: "% rendimiento = masa reactivo·100"
  }, "A", "La cantidad teórica es la máxima que predice la estequiometría suponiendo conversión completa; la real es la obtenida experimentalmente. La expresión es %R = (real/teórica)·100. En una reacción ordinaria el rendimiento suele ser menor que 100 % por pérdidas, reacciones secundarias o conversión incompleta; si sale mayor, hay que revisar los datos y unidades."),
  pregunta("fyq-t6-015", 6, "¿Cuál es la ecuación ajustada de la combustión completa del propano?", {
    A: "C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O", B: "C₃H₈ + O₂ → CO₂ + H₂O", C: "3 C₃H₈ + 4 O₂ → CO₂ + H₂O", D: "C₃H₈ + 3 O₂ → 8 CO₂ + 3 H₂O"
  }, "A", "En una combustión completa de un hidrocarburo se forman CO₂ y H₂O. Primero se ajusta C: 3 CO₂; después H: 4 H₂O; finalmente se cuentan los oxígenos del producto, 6 + 4 = 10, que requieren 5 O₂. La ecuación queda C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O y conserva 3 C, 8 H y 10 O a ambos lados."),
  pregunta("fyq-t6-016", 6, "¿Qué se entiende por poder calorífico de un combustible?", {
    A: "Energía liberada por unidad de masa o volumen al quemarse", B: "Masa de oxígeno del combustible", C: "Velocidad de la llama", D: "Temperatura ambiente del combustible"
  }, "A", "El poder calorífico indica la energía que libera una cantidad de combustible en una combustión completa; puede expresarse en J/kg, kJ/kg o MJ/m³, según el combustible. Para obtener una energía aproximada se usa Q = m·PC si el poder está dado por masa. Un combustible con mayor poder calorífico libera más energía por la misma cantidad, pero también hay que considerar emisiones y eficiencia."),
  pregunta("fyq-t6-017", 6, "¿Qué producto de una combustión incompleta de hidrocarburos es especialmente peligroso?", {
    A: "Monóxido de carbono, CO", B: "Oxígeno, O₂", C: "Agua pura solamente", D: "Nitrógeno molecular siempre"
  }, "A", "Con poco oxígeno puede formarse CO en lugar de CO₂. El monóxido de carbono es tóxico porque se une a la hemoglobina e impide el transporte de oxígeno en la sangre. Una combustión completa de un hidrocarburo produce principalmente CO₂ y H₂O, pero una combustión real puede generar también CO, partículas y otros contaminantes."),
  pregunta("fyq-t6-018", 6, "¿Qué reacción industrial produce amoniaco en el proceso de Haber-Bosch?", {
    A: "N₂ + 3 H₂ ⇌ 2 NH₃", B: "N₂ + H₂ → NH₂", C: "2 NH₃ → N₂ + 3 O₂", D: "N₂ + 3 O₂ ⇌ 2 NO₃"
  }, "A", "La ecuación ajustada es N₂(g) + 3 H₂(g) ⇌ 2 NH₃(g). La doble flecha indica que es reversible y alcanza un equilibrio. Industrialmente se combinan presión elevada, temperatura adecuada y catalizador para obtener una velocidad razonable y favorecer la producción; el catalizador acelera la llegada al equilibrio, pero no cambia su composición final por sí solo."),
];

const PREGUNTAS_T7_9 = [
  /* ============================== TEMA 7 ============================== */
  pregunta("fyq-t7-001", 7, "¿Por qué el carbono puede formar tantos compuestos diferentes?", {
    A: "Porque tiene cuatro electrones de valencia y puede formar cuatro enlaces", B: "Porque no puede enlazarse consigo mismo", C: "Porque solo forma enlaces iónicos", D: "Porque carece de electrones de valencia"
  }, "A", "El carbono tiene configuración 1s² 2s² 2p² y cuatro electrones de valencia. Puede compartir electrones y formar hasta cuatro enlaces covalentes, sencillos, dobles o triples. Además, los enlaces C—C son suficientemente estables para construir cadenas, ramificaciones y anillos, lo que explica la enorme variedad de compuestos orgánicos."),
  pregunta("fyq-t7-002", 7, "¿Qué significa que el carbono sea tetravalente?", {
    A: "Que normalmente puede formar cuatro enlaces covalentes", B: "Que tiene cuatro protones", C: "Que solo forma enlaces triples", D: "Que siempre tiene carga 4−"
  }, "A", "Tetravalente significa que el átomo de carbono puede completar su capa de valencia compartiendo cuatro pares de electrones. En metano, CH₄, forma cuatro enlaces C—H; en eteno, C₂H₄, cada carbono combina un doble enlace C=C con dos enlaces C—H. Tetravalencia no significa que el carbono tenga cuatro protones ni una carga fija."),
  pregunta("fyq-t7-003", 7, "¿Qué propiedad permite al carbono enlazarse consigo mismo formando cadenas?", {
    A: "La concatenación o catenación", B: "La sublimación", C: "La ionización completa", D: "La radiactividad"
  }, "A", "La catenación es la capacidad del carbono para formar enlaces C—C estables. Gracias a ella aparecen cadenas lineales, ramificadas y cíclicas, y esas cadenas pueden incorporar H, O, N, halógenos y otros elementos. Esta característica, unida a la tetravalencia y a la posibilidad de enlaces múltiples, es la base de la química orgánica."),
  pregunta("fyq-t7-004", 7, "¿Qué diferencia general hay entre un compuesto orgánico y uno inorgánico del carbono?", {
    A: "Muchos orgánicos presentan esqueletos C—C y C—H; CO₂ y carbonatos son ejemplos de compuestos inorgánicos del carbono", B: "Todo compuesto con carbono es orgánico sin excepción", C: "Los orgánicos nunca contienen hidrógeno", D: "Los inorgánicos solo pueden ser gases"
  }, "A", "La clasificación no depende únicamente de que aparezca el carbono. Los hidrocarburos y la mayoría de sus derivados, con esqueletos C—C y C—H, se estudian como orgánicos; CO₂, CO, carbonatos y algunos carburos se consideran inorgánicos. La opción A expresa la distinción habitual sin convertirla en una regla absoluta."),
  pregunta("fyq-t7-005", 7, "¿Qué información aporta una fórmula semidesarrollada como CH₃—CH₂—OH?", {
    A: "Muestra la cadena de carbonos y agrupa los hidrógenos unidos a cada carbono", B: "Indica solo la masa molecular", C: "Representa únicamente los electrones", D: "No permite reconocer grupos funcionales"
  }, "A", "La fórmula semidesarrollada no dibuja cada enlace C—H, pero sí muestra cómo se conectan los carbonos y los grupos importantes. CH₃—CH₂—OH contiene dos carbonos y un grupo hidroxilo —OH; corresponde al etanol. La fórmula molecular C₂H₆O da la composición total, pero no muestra por sí sola cómo están conectados los átomos."),
  pregunta("fyq-t7-006", 7, "¿Cuál es la fórmula general de los alcanos acíclicos?", {
    A: "CₙH₂ₙ₊₂", B: "CₙH₂ₙ", C: "CₙH₂ₙ₋₂", D: "CₙHₙ"
  }, "A", "Los alcanos son hidrocarburos saturados: solo tienen enlaces sencillos. Para una cadena abierta con n carbonos, cada carbono completa cuatro enlaces y se obtiene la fórmula general CₙH₂ₙ₊₂. Por ejemplo, para n = 3, C₃H₈, el propano; para n = 4, C₄H₁₀, el butano."),
  pregunta("fyq-t7-007", 7, "¿Qué caracteriza a un alqueno?", {
    A: "Contiene al menos un doble enlace C=C", B: "Solo contiene enlaces sencillos y no tiene hidrógeno", C: "Contiene siempre un grupo —OH", D: "Es un compuesto iónico"
  }, "A", "Los alquenos son hidrocarburos insaturados que contienen al menos un doble enlace carbono-carbono. En una cadena abierta con un solo doble enlace, su fórmula general es CₙH₂ₙ; por ejemplo, el eteno es C₂H₄. El doble enlace reduce el número de hidrógenos frente al alcano correspondiente y permite reacciones de adición."),
  pregunta("fyq-t7-008", 7, "¿Qué caracteriza a un alquino?", {
    A: "Contiene al menos un triple enlace C≡C", B: "Contiene solo enlaces C—C sencillos", C: "Siempre es un alcohol", D: "No contiene carbono"
  }, "A", "Los alquinos poseen al menos un triple enlace entre dos carbonos. Para una cadena abierta con un único triple enlace, la fórmula general es CₙH₂ₙ₋₂; el etino o acetileno, por ejemplo, es C₂H₂. El triple enlace está formado por un enlace σ y dos enlaces π y hace que el compuesto sea insaturado."),
  pregunta("fyq-t7-009", 7, "¿Qué nombre recibe el hidrocarburo C₃H₈?", {
    A: "Metano", B: "Etano", C: "Propano", D: "Propeno"
  }, "C", "La cadena tiene tres átomos de carbono, por lo que el prefijo es prop-. Como solo aparecen enlaces sencillos y la fórmula C₃H₈ cumple CₙH₂ₙ₊₂, el sufijo es -ano: propano. Metano tiene un carbono, etano dos y propeno tendría un doble enlace y la fórmula C₃H₆."),
  pregunta("fyq-t7-010", 7, "¿Qué son dos isómeros?", {
    A: "Sustancias con la misma fórmula molecular pero distinta estructura o disposición", B: "Átomos con distinto número atómico", C: "Moléculas con masas necesariamente distintas y fórmulas distintas", D: "Iones del mismo elemento con idéntica estructura"
  }, "A", "Los isómeros tienen igual número y tipo de átomos, pero estos están conectados o distribuidos de forma diferente. Por ejemplo, C₄H₁₀ puede ser butano lineal o 2-metilpropano ramificado. Al cambiar la estructura pueden cambiar propiedades como el punto de ebullición y la reactividad, aunque la masa molecular sea la misma."),
  pregunta("fyq-t7-011", 7, "¿Cuál es la fórmula molecular del benceno?", {
    A: "C₆H₆", B: "C₆H₁₂", C: "C₂H₆", D: "C₆H₁₄"
  }, "A", "El benceno es un hidrocarburo aromático formado por un anillo de seis carbonos con electrones π deslocalizados. Su fórmula molecular es C₆H₆. Aunque se dibuje con tres dobles enlaces alternados, la deslocalización hace que los enlaces C—C del anillo tengan un comportamiento equivalente y una estabilidad especial."),
  pregunta("fyq-t7-012", 7, "Al nombrar un hidrocarburo ramificado, ¿qué criterio se aplica primero?", {
    A: "Elegir la cadena principal más larga que contenga el máximo número de enlaces múltiples", B: "Elegir siempre la cadena con más hidrógenos", C: "Numerar al azar", D: "Nombrar primero el último carbono"
  }, "A", "Se identifica la cadena principal siguiendo las reglas de la nomenclatura y se numera para dar los localizadores más bajos a los enlaces múltiples y sustituyentes según corresponda. Después se nombran las ramificaciones como grupos alquilo y se ordenan alfabéticamente. No basta con escoger visualmente la cadena horizontal del dibujo: hay que buscar la cadena adecuada en toda la estructura."),
  pregunta("fyq-t7-013", 7, "¿Qué grupo funcional caracteriza a los alcoholes?", {
    A: "—OH unido a un carbono", B: "—COOH", C: "—CHO exclusivamente", D: "—NH₂"
  }, "A", "El grupo hidroxilo —OH unido a un carbono caracteriza a los alcoholes. En CH₃—CH₂—OH, el grupo —OH convierte al etano en etanol; el nombre termina en -ol. No debe confundirse con —COOH, que es el grupo carboxilo de los ácidos carboxílicos, ni con un OH perteneciente a otra función."),
  pregunta("fyq-t7-014", 7, "¿Cómo se distingue un aldehído de una cetona?", {
    A: "El aldehído tiene —CHO en un extremo; la cetona tiene el grupo carbonilo entre carbonos", B: "El aldehído no contiene oxígeno", C: "La cetona siempre contiene nitrógeno", D: "No hay diferencia estructural"
  }, "A", "Ambos contienen un grupo carbonilo C=O, pero su posición es diferente. En un aldehído, el carbonilo está en un extremo y se escribe —CHO; en una cetona, el carbono del carbonilo está unido a dos carbonos, R—CO—R'. Esa diferencia estructural determina nomenclatura y propiedades químicas distintas."),
  pregunta("fyq-t7-015", 7, "¿Qué grupo funcional define a los ácidos carboxílicos?", {
    A: "—COOH", B: "—O—", C: "—OH siempre aislado", D: "—C≡C—"
  }, "A", "El grupo carboxilo —COOH combina un carbonilo C=O y un hidroxilo —OH sobre el mismo carbono. Por ejemplo, CH₃—COOH es ácido etanoico o acético. El hidrógeno del —OH puede cederse con relativa facilidad, lo que explica el carácter ácido; no debe confundirse con un alcohol, cuyo —OH no está unido a un carbonilo."),
  pregunta("fyq-t7-016", 7, "¿Qué enlace une el oxígeno con los dos fragmentos orgánicos en un éter?", {
    A: "R—O—R'", B: "R—OH", C: "R—COOH", D: "R—NH₂"
  }, "A", "Los éteres presentan un átomo de oxígeno unido a dos grupos orgánicos: R—O—R'. En metoxietano, por ejemplo, el oxígeno actúa como puente entre dos fragmentos carbonados. Su estructura no contiene un —OH libre, por eso no es un alcohol, aunque ambos compuestos tengan oxígeno."),
  pregunta("fyq-t7-017", 7, "¿Qué función orgánica contiene el grupo —COO— entre dos restos carbonados?", {
    A: "Éster", B: "Amina", C: "Alquino", D: "Alcohol"
  }, "A", "Un éster contiene la estructura R—COO—R'. Puede formarse, en términos generales, por reacción entre un ácido carboxílico y un alcohol, con eliminación de agua. Los ésteres aparecen en aromas y aceites; su grupo funcional combina un carbonilo y un oxígeno enlazado a otro grupo carbonado."),
  pregunta("fyq-t7-018", 7, "¿Qué diferencia básica hay entre una amina y una amida?", {
    A: "La amina tiene N unido a carbonos o hidrógenos; la amida tiene N unido a un carbonilo C=O", B: "La amina siempre tiene oxígeno y la amida nunca", C: "Ambas son hidrocarburos puros", D: "La amida solo contiene enlaces triples"
  }, "A", "Las aminas derivan del amoniaco y contienen grupos como —NH₂, —NHR o —NR₂ unidos a restos orgánicos. En una amida, el nitrógeno está unido directamente a un carbonilo, R—CONH₂, lo que modifica la distribución electrónica y la reactividad. Reconocer el carbonilo junto al nitrógeno es la clave para distinguirlas."),

  /* ============================== TEMA 8 ============================== */
  pregunta("fyq-t8-001", 8, "¿Qué es un sistema de referencia?", {
    A: "El conjunto de origen, ejes, orientación y reloj respecto al que se describe el movimiento", B: "La masa del móvil", C: "Solo el nombre del objeto", D: "La trayectoria real sin observador"
  }, "A", "La posición y la velocidad no se describen de forma absoluta: se comparan con un origen, unos ejes y una medida del tiempo. Ese conjunto constituye el sistema de referencia. Un pasajero está en reposo respecto al tren, pero se mueve respecto a la estación; ambas descripciones son correctas porque usan referencias distintas."),
  pregunta("fyq-t8-002", 8, "¿Cuándo puede modelarse un cuerpo como punto material?", {
    A: "Cuando sus dimensiones son despreciables frente a las distancias del problema", B: "Cuando no tiene masa", C: "Solo cuando está quieto", D: "Cuando su forma es exactamente esférica"
  }, "A", "El modelo de punto material ignora el tamaño y la forma del objeto y concentra toda su masa en un punto. Es válido si esas dimensiones no afectan a la pregunta, como al estudiar la órbita de un planeta. No sería apropiado para analizar la rotación de una rueda, donde el tamaño y la orientación sí importan."),
  pregunta("fyq-t8-003", 8, "¿Qué representa la posición de un móvil?", {
    A: "El lugar que ocupa respecto al origen en un instante determinado", B: "La distancia total recorrida siempre", C: "La rapidez sin dirección", D: "La masa del móvil"
  }, "A", "La posición depende del sistema de referencia y del instante. En una dimensión se representa mediante una coordenada x(t); en el plano puede escribirse el vector de posición r⃗(t) = x(t)i⃗ + y(t)j⃗. La posición no es lo mismo que la distancia recorrida: un móvil puede volver al origen y tener posición cero después de haber recorrido muchos metros."),
  pregunta("fyq-t8-004", 8, "¿Qué diferencia hay entre trayectoria y desplazamiento?", {
    A: "La trayectoria es el camino seguido; el desplazamiento es el vector que une posición inicial y final", B: "Son siempre exactamente iguales", C: "El desplazamiento no tiene dirección", D: "La trayectoria solo existe si el móvil está quieto"
  }, "A", "La trayectoria es la línea o conjunto de puntos por los que pasa el móvil. El desplazamiento es Δr⃗ = r⃗_f − r⃗_i, un vector independiente del camino concreto. La distancia recorrida mide la longitud de la trayectoria y siempre es no negativa; el módulo del desplazamiento nunca puede superar esa distancia."),
  pregunta("fyq-t8-005", 8, "Un móvil recorre una vuelta completa y termina en el punto de partida. ¿Cuál es su desplazamiento?", {
    A: "Igual al radio", B: "Igual a la longitud de la circunferencia", C: "Cero", D: "Siempre negativo"
  }, "C", "El desplazamiento depende solo de las posiciones inicial y final: Δr⃗ = r⃗_f − r⃗_i. Si ambas coinciden, Δr⃗ = 0, aunque la distancia recorrida sea la longitud de una vuelta, 2πR. Este ejemplo muestra por qué distancia y desplazamiento no son sinónimos."),
  pregunta("fyq-t8-006", 8, "¿Cómo se define la velocidad media?", {
    A: "v⃗_m = Δr⃗/Δt", B: "v⃗_m = Δt/Δr⃗", C: "v⃗_m = r⃗ + t", D: "v⃗_m = m·g"
  }, "A", "La velocidad media es el desplazamiento dividido entre el intervalo de tiempo: v⃗_m = (r⃗_f − r⃗_i)/(t_f − t_i) = Δr⃗/Δt. Es vectorial y puede ser cero aunque haya distancia recorrida. La rapidez media, en cambio, usa distancia total dividida entre tiempo total y no incluye dirección."),
  pregunta("fyq-t8-007", 8, "¿Qué representa la pendiente de una gráfica posición-tiempo x(t)?", {
    A: "La velocidad", B: "La aceleración siempre", C: "La masa", D: "La fuerza normal"
  }, "A", "La pendiente media entre dos puntos es Δx/Δt, que coincide con la velocidad media. En el límite de un intervalo muy pequeño, la pendiente de la tangente es la velocidad instantánea: v = dx/dt. Una recta x-t tiene pendiente constante y describe movimiento uniforme; una curva indica que la velocidad cambia."),
  pregunta("fyq-t8-008", 8, "¿Qué es la velocidad instantánea?", {
    A: "La velocidad en un instante, obtenida como límite de Δr⃗/Δt", B: "La distancia total entre el tiempo total únicamente", C: "La posición inicial", D: "La aceleración acumulada"
  }, "A", "La velocidad instantánea describe cómo se mueve el móvil en un momento concreto. Matemáticamente v⃗(t) = lim(Δt→0) Δr⃗/Δt = d r⃗/dt. En una gráfica posición-tiempo es la pendiente de la tangente; en cada punto es tangente a la trayectoria y apunta en el sentido del movimiento."),
  pregunta("fyq-t8-009", 8, "¿Por qué se dice que el movimiento es relativo?", {
    A: "Porque la posición y la velocidad dependen del sistema de referencia elegido", B: "Porque las leyes físicas cambian al azar", C: "Porque ningún móvil puede tener velocidad", D: "Porque el tiempo depende de la masa en todos los casos"
  }, "A", "Un mismo objeto puede estar en reposo para un observador y moviéndose para otro. Por ejemplo, una persona sentada en un tren tiene velocidad cero respecto al tren, pero aproximadamente la velocidad del tren respecto al suelo. La descripción cambia con la referencia, aunque los hechos físicos y las transformaciones entre referencias sean coherentes."),
  pregunta("fyq-t8-010", 8, "¿Cómo se define la aceleración media?", {
    A: "a⃗_m = Δv⃗/Δt", B: "a⃗_m = Δt/Δv⃗", C: "a⃗_m = v⃗·t", D: "a⃗_m = m/v⃗"
  }, "A", "La aceleración mide cómo cambia la velocidad: a⃗_m = (v⃗_f − v⃗_i)/(t_f − t_i) = Δv⃗/Δt. Como la velocidad es vectorial, puede haber aceleración aunque el módulo de la velocidad sea constante, por ejemplo cuando cambia la dirección en un movimiento circular. Su unidad en el SI es m/s²."),
  pregunta("fyq-t8-011", 8, "¿Qué componente de la aceleración cambia el módulo de la velocidad?", {
    A: "La componente tangencial", B: "La componente normal únicamente", C: "La componente química", D: "Ninguna"
  }, "A", "La aceleración tangencial a_t modifica la rapidez: si tiene el mismo sentido que la velocidad, el móvil acelera; si tiene sentido contrario, frena. La componente normal o centrípeta a_n cambia la dirección del vector velocidad. En general, a⃗ = a_t t⃗ + a_n n⃗."),
  pregunta("fyq-t8-012", 8, "¿Qué componente de la aceleración cambia la dirección de la velocidad?", {
    A: "La componente normal", B: "La componente tangencial", C: "La componente de la masa", D: "La componente térmica"
  }, "A", "La componente normal apunta hacia el centro de curvatura y hace girar el vector velocidad. En una trayectoria curva puede existir aunque la rapidez sea constante. En un movimiento circular de radio R, su módulo es a_n = v²/R; cuanto mayor es la velocidad o menor el radio, mayor debe ser esa aceleración."),
  pregunta("fyq-t8-013", 8, "¿Puede un móvil tener velocidad constante y aceleración no nula?", {
    A: "Sí, si cambia la dirección de la velocidad, como en el movimiento circular uniforme", B: "No, nunca", C: "Solo si cambia la masa", D: "Solo en reposo"
  }, "A", "Constante puede significar constante en módulo, pero la velocidad es un vector. En el movimiento circular uniforme la rapidez no cambia, pero la dirección del vector velocidad cambia continuamente; por eso existe aceleración centrípeta a = v²/R dirigida hacia el centro. Solo en un movimiento rectilíneo uniforme es nula la aceleración."),
  pregunta("fyq-t8-014", 8, "Un móvil tiene la ley x(t) = 2 + 3t, con x en metros y t en segundos. ¿Cuál es su velocidad?", {
    A: "2 m/s", B: "3 m/s", C: "3t m/s", D: "5 m/s"
  }, "B", "La velocidad instantánea es la derivada de la posición: v = dx/dt. Al derivar x(t) = 2 + 3t se obtiene v = 3 m/s; el término 2 m es la posición inicial x₀, porque x(0) = 2 m, y no influye en la velocidad. El número 3 es la pendiente de la gráfica posición-tiempo y expresa que la posición aumenta 3 m cada segundo. Como v es constante y la trayectoria se supone rectilínea, se trata de un MRU."),
  pregunta("fyq-t8-015", 8, "¿Qué unidad tiene la aceleración en el Sistema Internacional?", {
    A: "m/s", B: "m/s²", C: "N", D: "J/s"
  }, "B", "La aceleración es el cambio de velocidad por unidad de tiempo: a = Δv/Δt. Sus unidades son [a] = (m/s)/s = m/s². Esto significa, por ejemplo, que una aceleración de 2 m/s² cambia la velocidad en 2 m/s cada segundo si permanece constante. El m/s corresponde a velocidad, el newton a fuerza y el J/s a potencia. Las unidades permiten detectar errores antes de aceptar un resultado."),
  pregunta("fyq-t8-016", 8, "En una gráfica velocidad-tiempo, ¿qué representa el área bajo la curva?", {
    A: "El desplazamiento", B: "La masa", C: "La fuerza eléctrica siempre", D: "La temperatura"
  }, "A", "Como v = dx/dt, al integrar en el tiempo se obtiene Δx = ∫v(t)dt. Gráficamente, el área con signo bajo la curva v-t es el desplazamiento; las áreas por debajo del eje representan desplazamiento negativo. Si se quiere distancia total, hay que sumar las áreas usando el valor absoluto de la velocidad."),

  /* ============================== TEMA 9 ============================== */
  pregunta("fyq-t9-001", 9, "¿Qué caracteriza a un movimiento rectilíneo uniforme, MRU?", {
    A: "Trayectoria recta y velocidad constante", B: "Trayectoria circular y aceleración variable", C: "Velocidad siempre nula", D: "Aceleración constante distinta de cero necesariamente"
  }, "A", "En el movimiento rectilíneo uniforme, MRU, la trayectoria es una recta y el vector velocidad permanece constante en módulo, dirección y sentido. Por ello a = Δv/Δt = 0. La ecuación de posición es x = x₀ + vt, una función lineal del tiempo cuya pendiente es v. Si v es positiva avanza en el sentido elegido; si es negativa retrocede, pero mientras no cambie permanece constante. En el modelo ideal la fuerza neta también sería cero, de acuerdo con la primera ley de Newton."),
  pregunta("fyq-t9-002", 9, "¿Cuál es la ecuación de posición del MRU?", {
    A: "x = x₀ + vt", B: "x = x₀ + at²", C: "x = v/t", D: "x = x₀ − gt²"
  }, "A", "En un tiempo t, el desplazamiento de un móvil con velocidad constante es Δx = vt. Sumando la posición inicial, x = x₀ + Δx = x₀ + vt. La pendiente de la gráfica x-t es v y la ordenada en el origen es x₀; antes de sustituir hay que usar unidades compatibles, como metros y segundos."),
  pregunta("fyq-t9-003", 9, "Un ciclista se mueve a 15 m/s durante 20 s en MRU. ¿Qué distancia recorre?", {
    A: "0,75 m", B: "35 m", C: "300 m", D: "450 m"
  }, "C", "En MRU, la distancia recorrida es d = v·t cuando el movimiento mantiene el mismo sentido. Sustituyendo, d = 15 m/s · 20 s = 300 m; los segundos se cancelan y queda metro. Si hubiese cambios de sentido, habría que distinguir distancia total y desplazamiento."),
  pregunta("fyq-t9-004", 9, "¿Cómo es la gráfica posición-tiempo de un MRU?", {
    A: "Una recta cuya pendiente es la velocidad", B: "Una circunferencia", C: "Una línea vertical siempre", D: "Una parábola obligatoriamente"
  }, "A", "La ecuación x = x₀ + vt tiene la forma y = b + mx, así que su representación es una recta. La pendiente m = Δx/Δt es v: positiva si avanza en el sentido elegido, negativa si retrocede y cero si está en reposo. La ordenada x₀ indica la posición inicial."),
  pregunta("fyq-t9-005", 9, "¿Cómo es la gráfica velocidad-tiempo de un MRU?", {
    A: "Una línea horizontal", B: "Una parábola", C: "Una recta siempre inclinada", D: "Una línea vertical en todos los casos"
  }, "A", "En MRU la velocidad no cambia con el tiempo, por eso v(t) es constante y se dibuja como una recta horizontal. La pendiente de la gráfica v-t es la aceleración, que vale cero. El área bajo esa línea en un intervalo proporciona el desplazamiento: Δx = v·Δt."),
  pregunta("fyq-t9-006", 9, "¿Qué define a un movimiento uniformemente acelerado, MUA?", {
    A: "Una aceleración constante", B: "Una posición constante obligatoriamente", C: "Una velocidad siempre nula", D: "Una fuerza siempre igual a cero"
  }, "A", "En el MUA la aceleración es constante, tanto en módulo como en dirección y sentido si el movimiento es rectilíneo. La velocidad cambia linealmente con el tiempo: v = v₀ + at. Si además la trayectoria es recta, se denomina MRUA y pueden aplicarse las ecuaciones cinemáticas de una dimensión."),
  pregunta("fyq-t9-007", 9, "¿Cuál es la ecuación de la velocidad en un MRUA?", {
    A: "v = v₀ + at", B: "v = v₀/t + a", C: "v = at²", D: "v = x₀ + t"
  }, "A", "Partimos de la definición a = Δv/Δt. Si a es constante, Δv = at y, por tanto, v − v₀ = at; despejando, v = v₀ + at. La ecuación permite hallar la velocidad en cualquier instante: el producto at tiene unidades (m/s²)(s) = m/s y se puede sumar a v₀. También muestra que la pendiente de la gráfica velocidad-tiempo es a; un signo negativo indica que la velocidad disminuye en el eje elegido."),
  pregunta("fyq-t9-008", 9, "¿Cuál es la ecuación de posición de un MRUA?", {
    A: "x = x₀ + v₀t + ½at²", B: "x = x₀ + vt²", C: "x = at/v₀", D: "x = x₀ + a/t"
  }, "A", "La posición se obtiene integrando la velocidad v = v₀ + at: x = x₀ + v₀t + ½at². El término x₀ es la posición inicial, v₀t es lo que recorrería con velocidad inicial constante y ½at² es el desplazamiento adicional causado por la aceleración. Las unidades de cada término son metros."),
  pregunta("fyq-t9-009", 9, "¿Qué ecuación del MRUA no contiene explícitamente el tiempo?", {
    A: "v² = v₀² + 2a(x − x₀)", B: "x = x₀ + v₀t", C: "v = v₀ + at", D: "a = Δv/Δt"
  }, "A", "Al eliminar t entre las ecuaciones de velocidad y posición se obtiene v² = v₀² + 2aΔx, con Δx = x − x₀. Es útil cuando se conocen velocidades, aceleración y desplazamiento, pero no el tiempo. La comprobación dimensional también funciona: cada término tiene unidades de m²/s²."),
  pregunta("fyq-t9-010", 9, "Un móvil parte del reposo con a = 2,0 m/s² durante 5,0 s. ¿Qué velocidad alcanza?", {
    A: "2,5 m/s", B: "7,0 m/s", C: "10 m/s", D: "25 m/s"
  }, "C", "Partir del reposo significa v₀ = 0. Usamos la ecuación del MRUA, v = v₀ + at = 0 + (2,0 m/s²)(5,0 s) = 10 m/s. El segundo se simplifica y queda m/s; físicamente, la aceleración constante aumenta la velocidad 2,0 m/s cada segundo: tras 1 s sería 2,0 m/s, tras 2 s 4,0 m/s y tras 5 s 10 m/s. Si además se quisiera la distancia, se usaría x − x₀ = ½at² = 25 m."),
  pregunta("fyq-t9-011", 9, "En una caída libre cerca de la superficie terrestre, ¿qué aceleración se usa normalmente?", {
    A: "g ≈ 9,8 m/s² hacia abajo", B: "g = 0 m/s²", C: "g = 9,8 km/s", D: "g depende de la masa del objeto"
  }, "A", "Si se desprecia la resistencia del aire, todos los cuerpos próximos a la superficie terrestre tienen la misma aceleración gravitatoria, g ≈ 9,8 m/s², dirigida hacia abajo. No depende de la masa del objeto. El signo será negativo o positivo según el eje elegido; por ejemplo, tomando arriba como positivo, a_y = −g."),
  pregunta("fyq-t9-012", 9, "En un lanzamiento vertical hacia arriba, ¿qué ocurre en el punto más alto?", {
    A: "La velocidad instantánea es cero, pero la aceleración sigue siendo −g", B: "La velocidad y la aceleración son cero", C: "La gravedad cambia de sentido", D: "El objeto deja de estar sometido a fuerzas"
  }, "A", "Durante la subida la velocidad disminuye por la aceleración gravitatoria. En la altura máxima, v_y = 0 solo durante un instante, porque cambia de sentido; sin embargo, la gravedad sigue actuando y a_y = −g. Después comienza el descenso con velocidad dirigida hacia abajo."),
  pregunta("fyq-t9-013", 9, "Si se lanza verticalmente hacia arriba y se desprecia el aire, ¿qué relación hay entre los tiempos de subida y bajada al mismo nivel?", {
    A: "Son iguales", B: "La bajada dura siempre el doble", C: "La subida dura siempre el doble", D: "No se pueden relacionar"
  }, "A", "La ecuación v_y = v₀ − gt hace que el tiempo hasta v_y = 0 sea t_subida = v₀/g. La vuelta al mismo nivel es simétrica y dura el mismo tiempo, t_bajada = v₀/g. Esta igualdad supone que la gravedad es constante y que no hay resistencia del aire; con rozamiento, la simetría se pierde."),
  pregunta("fyq-t9-014", 9, "¿Qué caracteriza al movimiento circular uniforme, MCU?", {
    A: "Trayectoria circular y velocidad angular constante", B: "Trayectoria recta y aceleración cero", C: "Velocidad vectorial constante en todo momento", D: "Radio que aumenta continuamente"
  }, "A", "En el MCU el móvil recorre una circunferencia con rapidez constante y velocidad angular constante. Aunque el módulo de v no cambie, su dirección gira, así que existe aceleración centrípeta. La velocidad angular se expresa como ω = Δθ/Δt y la aceleración apunta hacia el centro."),
  pregunta("fyq-t9-015", 9, "¿Cuál es la relación entre velocidad lineal y angular en un movimiento circular?", {
    A: "v = ωR", B: "v = ω/R", C: "v = R/ω", D: "v = ω + R"
  }, "A", "La longitud del arco recorrido es s = Rθ, con θ en radianes. Derivando respecto al tiempo, v = ds/dt = R·dθ/dt = Rω. Por eso, a igual velocidad angular, un punto más alejado del centro tiene mayor rapidez lineal; las unidades son (rad/s)·m = m/s porque el radián es adimensional."),
  pregunta("fyq-t9-016", 9, "Un móvil completa una vuelta cada 20 s. ¿Cuál es su velocidad angular?", {
    A: "0,05 rad/s", B: "0,314 rad/s", C: "3,14 rad/s", D: "20 rad/s"
  }, "B", "Una vuelta equivale a 2π radianes. La velocidad angular es ω = Δθ/Δt = 2π/20 s = 0,1π rad/s ≈ 0,314 rad/s. También se puede calcular primero la frecuencia, f = 1/T = 1/20 s = 0,050 Hz, y usar ω = 2πf, que da el mismo resultado. No se debe usar 1 rad como ángulo de una vuelta: la circunferencia completa mide 2π rad."),
  pregunta("fyq-t9-017", 9, "¿Cuál es la aceleración centrípeta de un movimiento circular?", {
    A: "a_c = v²/R", B: "a_c = vR²", C: "a_c = R/v²", D: "a_c = v + R"
  }, "A", "La aceleración centrípeta cambia la dirección de la velocidad y apunta hacia el centro: a_c = v²/R = ω²R. Si se duplica v manteniendo R, la aceleración se cuadruplica; si se duplica R manteniendo v, se reduce a la mitad. No es una fuerza nueva, sino el resultado de la fuerza neta dirigida hacia el centro."),
  pregunta("fyq-t9-018", 9, "En un tiro parabólico sin resistencia del aire, ¿cómo se descompone el movimiento?", {
    A: "MRU horizontal y movimiento vertical uniformemente acelerado", B: "Dos MRU independientes", C: "Solo caída libre sin velocidad horizontal", D: "Dos movimientos circulares"
  }, "A", "La velocidad inicial se separa en v₀x = v₀ cos α y v₀y = v₀ sin α. En el eje horizontal no hay aceleración, así que x = x₀ + v₀x t; en el vertical actúa −g, de modo que y = y₀ + v₀y t − ½gt². La combinación de ambos movimientos produce una trayectoria parabólica."),
];

const PREGUNTAS_T10_12 = [
  /* ============================== TEMA 10 ============================== */
  pregunta("fyq-t10-001", 10, "¿Qué afirma la primera ley de Newton?", {
    A: "Si la fuerza neta es cero, el cuerpo mantiene su estado de reposo o MRU", B: "Todo cuerpo necesita una fuerza para mantener su velocidad", C: "La fuerza neta siempre es igual al peso", D: "Los cuerpos en movimiento se detienen sin interacción"
  }, "A", "La primera ley o principio de inercia dice que ΣF⃗ = 0 implica a⃗ = 0. El cuerpo puede estar en reposo o moverse con velocidad constante en línea recta; no hace falta una fuerza para mantener una velocidad. Las fuerzas son necesarias para cambiar la velocidad, es decir, para producir aceleración."),
  pregunta("fyq-t10-002", 10, "¿Cuál es la expresión de la segunda ley de Newton?", {
    A: "ΣF⃗ = m a⃗", B: "ΣF⃗ = m/v⃗", C: "ΣF⃗ = m + a⃗", D: "ΣF⃗ = a⃗/m"
  }, "A", "La segunda ley relaciona la fuerza neta con la aceleración: ΣF⃗ = m a⃗. La aceleración tiene la dirección y el sentido de la fuerza resultante; para una masa fija, duplicar la fuerza duplica a. En el SI, 1 N = 1 kg·m/s², de modo que las unidades de ambos lados son coherentes."),
  pregunta("fyq-t10-003", 10, "¿Qué describe la tercera ley de Newton?", {
    A: "Las fuerzas de interacción aparecen por parejas iguales y opuestas sobre cuerpos distintos", B: "La fuerza y la reacción actúan siempre sobre el mismo cuerpo", C: "Toda fuerza desaparece sin producir interacción", D: "La reacción tiene siempre menor módulo"
  }, "A", "Si el cuerpo A ejerce sobre B una fuerza F⃗_AB, B ejerce sobre A otra F⃗_BA = −F⃗_AB. Tienen igual módulo y sentidos opuestos, pero actúan sobre cuerpos distintos; por eso no se cancelan al hacer el diagrama de fuerzas de un solo cuerpo. Son fuerzas de acción y reacción y aparecen simultáneamente."),
  pregunta("fyq-t10-004", 10, "¿Cómo se calcula el peso de un cuerpo cerca de la superficie terrestre?", {
    A: "P = mg", B: "P = m/g", C: "P = m + g", D: "P = g/m"
  }, "A", "El peso es la fuerza gravitatoria que ejerce la Tierra sobre el cuerpo y se calcula con P = mg. Si m = 60 kg y g = 9,8 m/s², P = 60·9,8 = 588 N. La masa se mide en kg y es una propiedad del cuerpo; el peso se mide en newtons y puede cambiar si cambia g."),
  pregunta("fyq-t10-005", 10, "¿De qué depende la fuerza gravitatoria entre dos masas?", {
    A: "F = Gm₁m₂/r²", B: "F = G(m₁+m₂)r²", C: "F = r²/(Gm₁m₂)", D: "F = m₁m₂/r"
  }, "A", "La ley de gravitación universal es F = Gm₁m₂/r², donde r es la distancia entre los centros de masa y G la constante de gravitación universal. La fuerza es siempre atractiva. Si una masa se duplica, F se duplica; si la distancia se duplica, F se divide entre cuatro porque aparece al cuadrado en el denominador."),
  pregunta("fyq-t10-006", 10, "¿Qué establece la ley de Coulomb para dos cargas puntuales?", {
    A: "F = k|q₁q₂|/r²", B: "F = k(q₁+q₂)r²", C: "F = q₁q₂/(kr)", D: "F = kr²/(q₁q₂)"
  }, "A", "El módulo de la fuerza eléctrica es F = k|q₁q₂|/r². Las cargas del mismo signo se repelen y las de signo contrario se atraen; la dirección es la línea que une las cargas. La dependencia 1/r² significa que al triplicar la distancia la fuerza queda dividida entre nueve."),
  pregunta("fyq-t10-007", 10, "¿Qué representa la fuerza normal sobre un cuerpo apoyado?", {
    A: "La reacción perpendicular de la superficie sobre el cuerpo", B: "El peso del cuerpo en todos los casos", C: "Una fuerza siempre horizontal", D: "La fuerza que el cuerpo ejerce sobre la Tierra"
  }, "A", "La normal N⃗ es una fuerza de contacto perpendicular a la superficie. En una mesa horizontal, si no hay otras fuerzas verticales, el equilibrio da N − mg = 0 y N = mg. En un plano inclinado no coincide generalmente con el peso: su valor ideal sin otras fuerzas es N = mg cos θ."),
  pregunta("fyq-t10-008", 10, "¿Qué expresión se usa para el rozamiento cinético?", {
    A: "f_k = μ_kN", B: "f_k = μ_k/N", C: "f_k = mgh", D: "f_k = N/μ_k²"
  }, "A", "Cuando el cuerpo desliza, el módulo del rozamiento cinético se modela como f_k = μ_kN, donde μ_k es el coeficiente de rozamiento cinético. La fuerza apunta en sentido contrario al movimiento relativo. En una superficie horizontal sin otras fuerzas verticales, N = mg y entonces f_k = μ_kmg; la dirección debe tratarse separadamente del módulo."),
  pregunta("fyq-t10-009", 10, "¿Qué diferencia hay entre rozamiento estático y cinético?", {
    A: "El estático impide iniciar el deslizamiento y el cinético actúa cuando ya hay deslizamiento", B: "El cinético solo existe en líquidos", C: "El estático siempre vale μ_sN aunque no haya tendencia a moverse", D: "Son fuerzas sin dirección"
  }, "A", "El rozamiento estático se adapta a la fuerza aplicada hasta un máximo f_s,máx = μ_sN; mientras no se supere ese máximo, el cuerpo puede permanecer quieto. Una vez que desliza, actúa el rozamiento cinético, aproximadamente f_k = μ_kN, y normalmente μ_k < μ_s. El rozamiento se opone al movimiento o a la tendencia de movimiento, no necesariamente a la fuerza aplicada."),
  pregunta("fyq-t10-010", 10, "¿En qué dirección actúa la tensión de una cuerda ideal?", {
    A: "A lo largo de la cuerda y tirando del cuerpo", B: "Siempre verticalmente hacia abajo", C: "Perpendicular a la cuerda", D: "Siempre en sentido contrario al peso"
  }, "A", "La tensión T⃗ es la fuerza que transmite una cuerda, cable o hilo y está dirigida a lo largo de la cuerda, alejándose del cuerpo que la soporta. En una cuerda ideal se suele considerar que el módulo de la tensión es el mismo en todos sus puntos. Su sentido se determina dibujando cómo tira la cuerda de cada cuerpo."),
  pregunta("fyq-t10-011", 10, "¿Cómo se calcula la fuerza resultante de varias fuerzas?", {
    A: "Mediante la suma vectorial ΣF⃗", B: "Sumando solo los módulos sin considerar direcciones", C: "Restando siempre el peso", D: "Multiplicando las fuerzas"
  }, "A", "Las fuerzas son vectores: hay que sumar componentes con signo o construir el paralelogramo. En una dimensión, fuerzas opuestas se restan y las del mismo sentido se suman; en dos dimensiones, ΣF_x y ΣF_y se calculan por separado. El módulo final puede obtenerse con R = √(R_x² + R_y²) si los ejes son perpendiculares."),
  pregunta("fyq-t10-012", 10, "¿Qué condición expresa el equilibrio traslacional de un cuerpo?", {
    A: "ΣF⃗ = 0", B: "ΣF⃗ = m a⃗ con a⃗ distinta de cero", C: "ΣF⃗ = mg siempre", D: "ΣF⃗ = v⃗/t"
  }, "A", "Por la segunda ley, ΣF⃗ = m a⃗. Si el cuerpo está en equilibrio traslacional, a⃗ = 0 y por tanto ΣF⃗ = 0; en componentes, ΣF_x = 0 y ΣF_y = 0. Equilibrio no significa ausencia de fuerzas: puede haber varias fuerzas que se compensan, como el peso y la normal de una mesa."),
  pregunta("fyq-t10-013", 10, "¿Cuál es el momento de una fuerza respecto a un eje?", {
    A: "τ = rF sen θ", B: "τ = r/F", C: "τ = F/r²", D: "τ = r + F + θ"
  }, "A", "El momento mide la capacidad de una fuerza para producir giro: |τ⃗| = rF sen θ, donde r es la distancia desde el eje al punto de aplicación y θ el ángulo entre r⃗ y F⃗. También puede escribirse τ = F·d, usando d como brazo perpendicular. Una fuerza aplicada más lejos del eje o perpendicularmente produce mayor momento."),
  pregunta("fyq-t10-014", 10, "¿Qué condición debe cumplir un sólido rígido en equilibrio rotacional?", {
    A: "Στ⃗ = 0 respecto a cualquier eje adecuado", B: "Στ⃗ = mg", C: "Todos los momentos deben tener el mismo sentido", D: "No puede actuar ninguna fuerza"
  }, "A", "Para que no haya aceleración angular, la suma algebraica de los momentos debe ser cero: Στ = 0. En problemas planos se elige un sentido positivo y se suman momentos horarios y antihorarios con signos opuestos. Un sólido en equilibrio completo debe cumplir además ΣF⃗ = 0; puede haber fuerzas y pares de fuerzas, pero no una resultante ni un momento netos."),
  pregunta("fyq-t10-015", 10, "¿Qué es el impulso de una fuerza constante?", {
    A: "J⃗ = F⃗Δt", B: "J⃗ = F⃗/Δt", C: "J⃗ = mgh", D: "J⃗ = F⃗ + Δt"
  }, "A", "El impulso mide el efecto de una fuerza aplicada durante un intervalo: J⃗ = F⃗Δt para una fuerza constante, y J⃗ = ∫F⃗dt si cambia. Su unidad es N·s, equivalente a kg·m/s. El impulso es igual al cambio de cantidad de movimiento, J⃗ = Δp⃗, por eso una fuerza grande durante poco tiempo puede producir el mismo efecto que otra menor durante más tiempo."),
  pregunta("fyq-t10-016", 10, "¿Cómo se define la cantidad de movimiento lineal?", {
    A: "p⃗ = m v⃗", B: "p⃗ = m/v⃗", C: "p⃗ = v⃗/m", D: "p⃗ = m + v⃗"
  }, "A", "La cantidad de movimiento o momento lineal es p⃗ = m v⃗. Tiene la dirección y sentido de la velocidad y se mide en kg·m/s. Un camión y una bicicleta con la misma velocidad no tienen el mismo momento porque sus masas son diferentes; cambiar la velocidad o la masa cambia p⃗."),
  pregunta("fyq-t10-017", 10, "¿Cuándo se conserva la cantidad de movimiento total de un sistema?", {
    A: "Cuando la resultante de fuerzas exteriores es cero", B: "Siempre que haya una fuerza interna", C: "Solo si todos los cuerpos están en reposo", D: "Cuando desaparece la masa"
  }, "A", "La relación general es ΣF⃗_ext = d p⃗_total/dt. Si ΣF⃗_ext = 0, entonces p⃗_total permanece constante: p⃗_inicial = p⃗_final. Las fuerzas internas, como las de acción y reacción durante un choque, pueden cambiar el momento de cada cuerpo, pero se compensan al sumar el sistema completo."),
  pregunta("fyq-t10-018", 10, "En un choque perfectamente inelástico, ¿qué ocurre con los cuerpos después del impacto?", {
    A: "Quedan unidos y comparten una velocidad final", B: "Cada uno conserva necesariamente su velocidad inicial", C: "Desaparecen todas las fuerzas", D: "La energía cinética siempre se conserva"
  }, "A", "En un choque perfectamente inelástico los cuerpos quedan unidos. Si no hay impulso externo apreciable, se conserva el momento lineal: m₁v₁ + m₂v₂ = (m₁+m₂)v_f, de donde v_f = (m₁v₁+m₂v₂)/(m₁+m₂). La energía cinética no se conserva: parte se transforma en deformación, calor y sonido, aunque la cantidad de movimiento sí se conserve."),

  /* ============================== TEMA 11 ============================== */
  pregunta("fyq-t11-001", 11, "¿Qué es la energía en Física?", {
    A: "La capacidad de un sistema para producir cambios o realizar trabajo", B: "Una fuerza sin dirección", C: "La masa de un objeto", D: "Solo el calor de un cuerpo"
  }, "A", "La energía es una magnitud escalar asociada a la posibilidad de producir transformaciones: mover un cuerpo, elevarlo, calentarlo o cambiarlo químicamente. Se mide en julios, J. Puede cambiar de forma, pero en un sistema aislado la energía total se conserva; no es una sustancia que se almacene como un fluido."),
  pregunta("fyq-t11-002", 11, "¿Cuál es la expresión de la potencia media?", {
    A: "P = W/Δt", B: "P = W·Δt", C: "P = Δt/W", D: "P = F/m"
  }, "A", "La potencia mide la rapidez con la que se transfiere energía o se realiza trabajo: P = W/Δt, y su unidad es el vatio, 1 W = 1 J/s. Dos máquinas pueden realizar el mismo trabajo, pero la que lo hace en menor tiempo tiene mayor potencia. Si la potencia es constante, también puede escribirse W = PΔt."),
  pregunta("fyq-t11-003", 11, "¿Cómo se calcula el trabajo de una fuerza constante?", {
    A: "W = Fd cos θ", B: "W = F/d", C: "W = F + d + θ", D: "W = mdg"
  }, "A", "El trabajo de una fuerza constante es W = Fd cos θ, donde d es el desplazamiento y θ el ángulo entre la fuerza y el desplazamiento. Solo cuenta la componente de la fuerza paralela al desplazamiento. Si F = 10 N y d = 3 m en la misma dirección, W = 10·3·cos 0° = 30 J. Si la fuerza ayuda al movimiento, W > 0; si se opone, W < 0; si es perpendicular, cos 90° = 0 y no realiza trabajo. En el SI, N·m = J."),
  pregunta("fyq-t11-004", 11, "¿Qué trabajo realiza una fuerza perpendicular al desplazamiento?", {
    A: "Cero", B: "F·d", C: "Siempre negativo", D: "mgh"
  }, "A", "Con W = Fd cos θ y θ = 90°, cos 90° = 0, así que W = 0. Por ejemplo, en un movimiento circular uniforme la fuerza centrípeta es perpendicular a la velocidad instantánea y al desplazamiento elemental, por lo que cambia la dirección de la velocidad pero no realiza trabajo sobre el móvil."),
  pregunta("fyq-t11-005", 11, "¿Qué significa que el trabajo de una fuerza sea negativo?", {
    A: "Que la fuerza extrae energía del movimiento del cuerpo", B: "Que la fuerza no existe", C: "Que la energía se crea", D: "Que la fuerza es perpendicular siempre"
  }, "A", "Si la fuerza tiene una componente opuesta al desplazamiento, cos θ < 0 y W < 0. El rozamiento es un ejemplo: reduce la energía cinética mecánica y la transforma principalmente en energía interna. Un trabajo negativo no significa que la magnitud del trabajo sea imposible; indica una transferencia de energía en sentido contrario al movimiento considerado."),
  pregunta("fyq-t11-006", 11, "¿Cuál es la energía cinética de un cuerpo de masa m que se mueve con velocidad v?", {
    A: "E_c = ½mv²", B: "E_c = mv", C: "E_c = mgh", D: "E_c = ½m/v²"
  }, "A", "La energía cinética asociada al movimiento es E_c = ½mv². Si el cuerpo está en reposo, v = 0 y E_c = 0. Depende linealmente de la masa y cuadráticamente de la velocidad: por ejemplo, para m = 2 kg y v = 3 m/s, E_c = ½·2·3² = 9 J; si v se duplica, la energía se cuadruplica. Se mide en julios porque kg·(m/s)² = kg·m²/s² = J."),
  pregunta("fyq-t11-007", 11, "¿Qué afirma el teorema de la energía cinética?", {
    A: "El trabajo de la fuerza neta es igual al cambio de energía cinética", B: "El trabajo neto es siempre cero", C: "La energía cinética no depende de la velocidad", D: "Solo se aplica a cuerpos en reposo"
  }, "A", "El teorema se expresa W_neto = ΔE_c = E_cf − E_ci. Si el trabajo neto es positivo, aumenta la rapidez; si es negativo, disminuye. Por ejemplo, para detener un cuerpo, el trabajo del frenado debe ser −½mv² si la velocidad final es cero. El teorema permite resolver problemas sin calcular directamente todas las aceleraciones."),
  pregunta("fyq-t11-008", 11, "¿Cuál es la energía potencial gravitatoria cerca de la superficie terrestre?", {
    A: "E_p = mgh", B: "E_p = mg/h", C: "E_p = ½mv²", D: "E_p = F/d"
  }, "A", "Tomando un nivel de referencia, la energía potencial gravitatoria es E_p = mgh, donde h es la altura respecto a ese nivel. Lo importante físicamente es la diferencia ΔE_p = mg(h_f − h_i), no el cero elegido. Al elevar un cuerpo aumenta E_p; al descender, puede transformarse en energía cinética."),
  pregunta("fyq-t11-009", 11, "¿Qué ocurre con la energía mecánica si solo actúan fuerzas conservativas?", {
    A: "E_m = E_c + E_p permanece constante", B: "Desaparece por completo", C: "Solo permanece la energía cinética", D: "Aumenta siempre sin límite"
  }, "A", "La energía mecánica es E_m = E_c + E_p. Si no hay rozamiento ni otras fuerzas no conservativas, E_m,f = E_m,i: una disminución de E_p se compensa con un aumento de E_c y viceversa. Si existe rozamiento, la energía mecánica disminuye, pero la energía total se conserva al incluir la energía interna producida."),
  pregunta("fyq-t11-010", 11, "¿Qué energía almacena un muelle deformado idealmente?", {
    A: "E_elástica = ½kx²", B: "E_elástica = k/x", C: "E_elástica = mgx", D: "E_elástica = ½mv²"
  }, "A", "Para un muelle que cumple la ley de Hooke, F = kx, la energía potencial elástica es E_el = ½kx². k es la constante elástica en N/m y x la deformación respecto a la posición natural. Al soltarlo, esa energía puede transformarse en cinética; el factor ½ aparece porque la fuerza aumenta desde cero hasta kx durante la deformación."),
  pregunta("fyq-t11-011", 11, "¿Cómo afecta el rozamiento a la energía mecánica?", {
    A: "La reduce y la transforma principalmente en energía interna", B: "La crea sin límite", C: "No realiza trabajo", D: "La convierte siempre en energía potencial"
  }, "A", "El rozamiento suele realizar trabajo negativo: W_roz < 0. La energía cinética o mecánica disminuye, pero no desaparece; se transfiere a energía interna del cuerpo y de la superficie, que pueden calentarse, además de sonido y deformaciones. Por eso la conservación correcta se formula para la energía total, no solo para E_c + E_p."),
  pregunta("fyq-t11-012", 11, "¿Qué unidad corresponde a la energía y al trabajo en el SI?", {
    A: "Julio, J", B: "Newton por segundo, N/s", C: "Metro por segundo, m/s", D: "Pascal, Pa"
  }, "A", "Trabajo y energía se miden en julios. Como W = Fd cuando la fuerza y el desplazamiento son paralelos, 1 J = 1 N·m = 1 kg·m²/s². El newton mide fuerza, el m/s velocidad y el pascal presión; distinguir unidades ayuda a detectar fórmulas aplicadas de forma incorrecta."),
  pregunta("fyq-t11-013", 11, "¿Qué es el rendimiento de una máquina o proceso?", {
    A: "η = energía útil/energía suministrada", B: "η = energía suministrada/energía útil siempre", C: "η = masa·velocidad", D: "η = trabajo + tiempo"
  }, "A", "El rendimiento compara lo que se aprovecha con lo que se aporta: η = E_útil/E_entrada, o en porcentaje η(%) = (E_útil/E_entrada)·100. En un proceso real suele ser menor que 100 % porque hay rozamiento, calentamiento, sonido u otras transferencias no útiles. Un rendimiento de 0,80 equivale al 80 %."),
  pregunta("fyq-t11-014", 11, "Si una máquina realiza 6000 J de trabajo útil con 8000 J de energía de entrada, ¿cuál es su rendimiento?", {
    A: "25 %", B: "60 %", C: "75 %", D: "133 %"
  }, "C", "Se usa η = E_útil/E_entrada = 6000 J/8000 J = 0,75. Para expresarlo en porcentaje, η = 0,75·100 = 75 %. El resultado es menor que 100 %, como corresponde a una máquina real; un valor superior a 100 % indicaría que se han contado mal las energías o los límites del sistema."),
  pregunta("fyq-t11-015", 11, "¿Qué ocurre con la distancia de frenado si se duplica la velocidad inicial y la fuerza de frenado es la misma?", {
    A: "Se cuadruplica", B: "Se duplica", C: "Se reduce a la mitad", D: "No cambia"
  }, "A", "Para detener el vehículo, el trabajo del frenado Fd debe igualar la energía cinética inicial: Fd = ½mv². Despejando, d = mv²/(2F); con m y F constantes, d es proporcional a v². Si v se duplica, d' = m(2v)²/(2F) = 4d. Esta dependencia explica por qué aumentar la velocidad incrementa mucho el riesgo."),
  pregunta("fyq-t11-016", 11, "¿Qué principio permite seguir la transformación de energía en una montaña rusa?", {
    A: "La energía total se conserva, aunque cambie entre potencial, cinética e interna", B: "La energía potencial se destruye al bajar", C: "La velocidad no depende de la altura", D: "El rozamiento crea energía mecánica"
  }, "A", "En una zona alta predomina E_p = mgh; al descender, esa energía puede convertirse en E_c = ½mv². Si se desprecia el rozamiento, E_p + E_c permanece constante; si existe, parte se transforma en energía interna. El análisis debe incluir todas las formas relevantes y elegir el mismo nivel de referencia para comparar alturas."),

  /* ============================== TEMA 12 ============================== */
  pregunta("fyq-t12-001", 12, "¿Qué significa que dos cuerpos estén en equilibrio térmico?", {
    A: "Tienen la misma temperatura y no hay flujo neto de calor entre ellos", B: "Tienen necesariamente la misma masa", C: "Contienen la misma energía interna", D: "Están a la misma altura"
  }, "A", "Cuando dos cuerpos alcanzan la misma temperatura, desaparece el flujo neto de energía térmica entre ellos: están en equilibrio térmico. No tienen por qué poseer la misma masa, material ni energía interna total. La temperatura indica el estado térmico; la energía interna depende además de la cantidad y la naturaleza de la sustancia."),
  pregunta("fyq-t12-002", 12, "¿En qué sentido fluye espontáneamente el calor?", {
    A: "Del cuerpo de mayor temperatura al de menor temperatura", B: "Del frío al caliente siempre", C: "Solo entre cuerpos con la misma temperatura", D: "No puede fluir"
  }, "A", "El calor es energía transferida debido a una diferencia de temperatura y fluye espontáneamente del cuerpo más caliente al más frío. El proceso continúa hasta alcanzar el equilibrio térmico. Para hacer que fluya en sentido contrario, como en un frigorífico, hay que aportar trabajo mediante un dispositivo externo."),
  pregunta("fyq-t12-003", 12, "¿Cuál es la diferencia entre temperatura y calor?", {
    A: "La temperatura describe el estado térmico; el calor es energía que se transfiere por una diferencia de temperatura", B: "Son exactamente la misma magnitud", C: "El calor es una propiedad que un cuerpo guarda siempre", D: "La temperatura se mide en julios"
  }, "A", "La temperatura se relaciona con la energía cinética media microscópica y se mide en K o °C. El calor Q no es algo contenido permanentemente en un cuerpo: es energía que pasa de un sistema a otro por una diferencia de temperatura y se mide en J. Por eso decir que un objeto tiene mucho calor es menos preciso que decir que tiene alta energía interna o que recibe calor."),
  pregunta("fyq-t12-004", 12, "¿Cómo se relacionan las escalas Celsius y kelvin?", {
    A: "T(K) = t(°C) + 273,15", B: "T(K) = t(°C) − 273,15", C: "T(K) = 273,15·t(°C)", D: "T(K) = t(°C)/273,15"
  }, "A", "El tamaño de un grado Celsius y de un kelvin es el mismo, pero sus ceros están desplazados. La conversión es T(K) = t(°C) + 273,15; por ejemplo, 25 °C = 298,15 K. Para diferencias de temperatura, ΔT en kelvin y en grados Celsius tiene el mismo valor numérico: un aumento de 10 °C equivale a 10 K."),
  pregunta("fyq-t12-005", 12, "¿Qué es la capacidad calorífica de un cuerpo?", {
    A: "C = Q/ΔT", B: "C = Q·ΔT", C: "C = ΔT/Q²", D: "C = mgh"
  }, "A", "La capacidad calorífica C indica cuánto calor necesita un cuerpo para aumentar su temperatura un kelvin: C = Q/ΔT. Depende de la sustancia y de la cantidad de materia, y su unidad es J/K. No debe confundirse con el calor específico, que se refiere a un kilogramo de sustancia y no depende de la cantidad de muestra."),
  pregunta("fyq-t12-006", 12, "¿Qué fórmula permite calcular el calor que cambia la temperatura de una masa sin cambio de estado?", {
    A: "Q = mcΔT", B: "Q = m/cΔT", C: "Q = c/(mΔT)", D: "Q = mgh"
  }, "A", "El calor sensible se calcula con Q = mcΔT, donde m es la masa, c el calor específico y ΔT = T_f − T_i. Si la temperatura aumenta, Q > 0 para el cuerpo; si disminuye, Q < 0. Las unidades J = kg·J/(kg·K)·K confirman la fórmula. El modelo vale mientras no haya cambio de estado."),
  pregunta("fyq-t12-007", 12, "¿Qué calor absorbe 0,50 kg de agua al aumentar 10 K si c = 4180 J/(kg·K)?", {
    A: "2090 J", B: "4180 J", C: "20 900 J", D: "83 600 J"
  }, "C", "Aplicamos Q = mcΔT: Q = 0,50 kg · 4180 J/(kg·K) · 10 K = 20 900 J. El resultado es positivo porque el agua se calienta y absorbe energía. Si se hubiera enfriado 10 K, ΔT sería −10 K y el calor calculado para el agua sería negativo, indicando que lo cede al entorno."),
  pregunta("fyq-t12-008", 12, "En un calorímetro ideal, ¿qué relación se cumple entre el calor cedido y el absorbido?", {
    A: "Q_cedido + Q_absorbido = 0", B: "Q_cedido = Q_absorbido siempre con el mismo signo", C: "Q_absorbido = 0", D: "Q_cedido = mgh"
  }, "A", "Si el calorímetro está aislado, la energía que pierde el cuerpo caliente es igual a la que gana el frío: Q_caliente + Q_frío = 0, usando signos. Como Q = mc(T_f − T_i), el cuerpo que se enfría tiene Q < 0 y el que se calienta Q > 0. En un calorímetro real también puede incluirse la capacidad calorífica del propio aparato."),
  pregunta("fyq-t12-009", 12, "¿Qué es el calor latente de cambio de estado?", {
    A: "La energía por unidad de masa necesaria para cambiar de estado sin variar la temperatura", B: "La energía cinética media por mol", C: "La temperatura final dividida entre la masa", D: "La presión del vapor"
  }, "A", "Durante una fusión o vaporización, el calor recibido no aumenta la temperatura: se emplea en modificar la estructura y separar partículas. La relación es Q = mL, donde L es el calor latente en J/kg. En el cambio inverso, como solidificación o condensación, el sistema cede la misma energía por unidad de masa y Q tiene signo negativo."),
  pregunta("fyq-t12-010", 12, "¿Qué ocurre con la temperatura de una sustancia pura durante un cambio de estado a presión constante?", {
    A: "Permanece constante mientras coexisten las dos fases", B: "Aumenta sin límite", C: "Se hace siempre 0 K", D: "Depende solo de la masa"
  }, "A", "En la curva de calentamiento, la temperatura aumenta dentro de una fase, pero queda constante durante la fusión o la ebullición mientras coexisten sólido-líquido o líquido-gas. El calor suministrado se invierte en el cambio de estado, Q = mL, no en elevar T. La temperatura de cambio depende de la presión y de la sustancia."),
  pregunta("fyq-t12-011", 12, "¿Cómo se expresa la dilatación lineal de un sólido?", {
    A: "ΔL = αL₀ΔT", B: "ΔL = α/(L₀ΔT)", C: "ΔL = L₀/α", D: "ΔL = mgΔT"
  }, "A", "Al aumentar la temperatura, las partículas vibran más y la longitud media del sólido suele aumentar. La dilatación lineal se modela con ΔL = αL₀ΔT, donde α es el coeficiente del material, L₀ la longitud inicial y ΔT el cambio de temperatura. La longitud final es L = L₀ + ΔL; la fórmula se aplica para cambios moderados y el material indicado."),
  pregunta("fyq-t12-012", 12, "¿En qué consiste la conducción térmica?", {
    A: "Transferencia de energía por contacto microscópico sin transporte macroscópico de materia", B: "Movimiento global de un fluido", C: "Emisión exclusiva de luz visible", D: "Una reacción química obligatoria"
  }, "A", "En la conducción, las partículas de una zona caliente transfieren energía a sus vecinas mediante choques y vibraciones, pero el material no se desplaza globalmente. Es especialmente importante en sólidos; los metales conducen bien por sus electrones libres. El flujo espontáneo sigue el gradiente de temperatura, del extremo caliente al frío."),
  pregunta("fyq-t12-013", 12, "¿Qué caracteriza a la convección?", {
    A: "El transporte de energía acompañado por el movimiento macroscópico de un fluido", B: "La transferencia exclusiva en sólidos", C: "La ausencia de movimiento de partículas", D: "La transformación de calor en masa"
  }, "A", "La convección ocurre en líquidos y gases cuando unas zonas se calientan, se dilatan, disminuyen su densidad y ascienden, mientras otras más frías descienden. Se forman corrientes que transportan materia y energía. En la conducción no hay ese movimiento global del fluido: allí la energía pasa localmente entre partículas vecinas."),
  pregunta("fyq-t12-014", 12, "¿Cómo puede transmitirse el calor por radiación?", {
    A: "Mediante ondas electromagnéticas, incluso a través del vacío", B: "Solo por contacto entre sólidos", C: "Solo si existe agua líquida", D: "Por una corriente de partículas de aire obligatoria"
  }, "A", "Todo cuerpo emite radiación electromagnética por su temperatura. La radiación no necesita un medio material, por eso la energía del Sol llega a la Tierra a través del vacío. La cantidad y el tipo de radiación dependen de la temperatura y de las propiedades de la superficie; una superficie oscura suele absorber y emitir más que una muy reflectante."),
  pregunta("fyq-t12-015", 12, "¿Qué es la energía interna de un sistema?", {
    A: "La suma de las energías microscópicas de sus partículas", B: "Solo su energía potencial gravitatoria", C: "La energía que tiene por estar en movimiento macroscópico", D: "La temperatura expresada en julios"
  }, "A", "La energía interna U incluye la energía cinética microscópica de las partículas y la energía potencial asociada a sus interacciones. Puede cambiar si el sistema recibe calor o si se realiza trabajo sobre él. No es lo mismo que la energía cinética del cuerpo como conjunto ni que mgh, que son energías macroscópicas del sistema completo."),
  pregunta("fyq-t12-016", 12, "Con el convenio ΔU = Q + W, ¿qué significa que Q sea positivo?", {
    A: "El sistema recibe calor del entorno", B: "El sistema cede calor", C: "El sistema realiza necesariamente trabajo", D: "La energía interna no cambia"
  }, "A", "Con este convenio, Q > 0 cuando el calor entra en el sistema y Q < 0 cuando el sistema lo cede. W > 0 cuando el entorno realiza trabajo sobre el sistema; por eso la primera ley queda ΔU = Q + W. La energía interna aumenta si la suma es positiva. Otros libros usan W como trabajo realizado por el sistema y escriben ΔU = Q − W; lo importante es declarar el convenio y mantenerlo."),
  pregunta("fyq-t12-017", 12, "¿Cuál es la equivalencia aproximada entre calorías y julios?", {
    A: "1 cal ≈ 4,18 J", B: "1 cal ≈ 0,0418 J", C: "1 cal = 4180 J", D: "1 cal = 1 kW"
  }, "A", "La caloría se definió históricamente a partir del calentamiento del agua y se usa todavía en algunos contextos. La equivalencia es 1 cal ≈ 4,18 J; por tanto, 250 cal ≈ 250·4,18 = 1045 J. En nutrición, una kilocaloría, kcal, equivale a 1000 cal y aproximadamente 4180 J."),
  pregunta("fyq-t12-018", 12, "¿Qué indica la segunda ley de la termodinámica sobre los procesos espontáneos?", {
    A: "La entropía total de un sistema aislado no disminuye", B: "El calor puede pasar espontáneamente del frío al caliente", C: "Toda energía se transforma íntegramente en trabajo útil", D: "La entropía siempre vale cero"
  }, "A", "La segunda ley introduce la entropía y establece que, en un sistema aislado, ΔS_total ≥ 0: puede aumentar o permanecer constante en un proceso reversible ideal, pero no disminuir espontáneamente. Explica la dirección natural del calor y por qué ninguna máquina térmica convierte todo el calor absorbido en trabajo útil. La energía se conserva, pero su capacidad de aprovechamiento puede degradarse."),
];

/* ============================== ANEXO: FORMULACIÓN Y TABLAS ============================== */
const PREGUNTAS_T13 = [
  pregunta("fyq-t13-001", 13, "¿Qué indican los subíndices de una fórmula química?", {
    A: "La proporción o el número de átomos de cada elemento", B: "La carga total de cualquier compuesto", C: "La temperatura de fusión", D: "El número de moles que siempre hay en la muestra"
  }, "A", "Los subíndices indican cuántos átomos de cada elemento aparecen en una unidad de la sustancia o la proporción mínima en la que se combinan. Por ejemplo, en CaCl₂ hay un átomo de calcio por cada dos de cloro; el 2 solo afecta al Cl. No debe confundirse con un coeficiente delante de la fórmula: 3 CaCl₂ representa tres unidades o tres moles del compuesto, mientras que CaCl₂ describe su composición."),
  pregunta("fyq-t13-002", 13, "En un compuesto neutro, ¿qué condición cumplen los números de oxidación?", {
    A: "La suma de sus contribuciones es cero", B: "Todos son positivos", C: "Todos son iguales al subíndice", D: "La suma siempre es +1"
  }, "A", "Un compuesto neutro no tiene carga eléctrica global, por lo que la suma de cada número de oxidación multiplicado por el número de átomos correspondiente debe ser cero. En Al₂O₃, por ejemplo, 2·(+3) + 3·(−2) = +6 − 6 = 0. Si se trata de un ion poliatómico, la suma debe coincidir con la carga del ion, no necesariamente con cero."),
  pregunta("fyq-t13-003", 13, "¿Cómo se colocan normalmente los elementos al escribir la fórmula de un compuesto binario?", {
    A: "El elemento más electropositivo a la izquierda y el más electronegativo a la derecha", B: "Siempre se escriben en orden alfabético", C: "El metal siempre va a la derecha", D: "Se coloca primero el elemento con mayor subíndice"
  }, "A", "En la formulación inorgánica se coloca normalmente a la izquierda el elemento más electropositivo, que suele presentar número de oxidación positivo, y a la derecha el más electronegativo, que suele ser negativo. Después se eligen los subíndices para que la suma de cargas sea cero. Hay excepciones concretas, como algunos óxidos de halógenos, por lo que la regla debe aplicarse junto con las normas de nomenclatura."),
  pregunta("fyq-t13-004", 13, "¿Cuál es el nombre correcto de FeCl₃ usando nomenclatura de Stock?", {
    A: "Cloruro de hierro(III)", B: "Cloruro de hierro(I)", C: "Hierro tricloruro", D: "Cloro de hierro"
  }, "A", "En FeCl₃, el cloro suele tener número de oxidación −1. Como hay tres átomos de cloro, su contribución es 3·(−1) = −3; para que el compuesto sea neutro, el hierro debe ser +3. Por eso el nombre de Stock es cloruro de hierro(III). El número romano no es el subíndice: informa del número de oxidación del hierro en ese compuesto."),
  pregunta("fyq-t13-005", 13, "¿Qué fórmula resulta al combinar Al³⁺ con O²⁻?", {
    A: "AlO", B: "Al₂O₃", C: "Al₃O₂", D: "Al₂O"
  }, "B", "Hay que conseguir que la carga total sea cero. Dos iones Al³⁺ aportan +6 y tres iones O²⁻ aportan −6: 2·(+3) + 3·(−2) = 0. La fórmula mínima es Al₂O₃. El método de intercambio de cargas puede sugerir los subíndices 2 y 3, pero siempre hay que comprobar la suma y simplificar si todos los subíndices tienen un divisor común."),
  pregunta("fyq-t13-006", 13, "¿Qué número de oxidación tiene un elemento en una sustancia elemental como O₂, Fe o S₈?", {
    A: "0", B: "+1", C: "−2 siempre", D: "Depende del subíndice"
  }, "A", "Cuando un elemento está combinado consigo mismo y no con otro elemento, sus átomos no han ganado ni perdido electrones respecto a ese estado elemental de referencia. Por eso el número de oxidación es 0 tanto en O₂ como en Fe, S₈ o Cl₂. El subíndice indica cuántos átomos forman la molécula, pero no cambia el número de oxidación de cada átomo."),
  pregunta("fyq-t13-007", 13, "¿Cuál es la fórmula correcta del cloruro de calcio?", {
    A: "CaCl", B: "CaCl₂", C: "Ca₂Cl", D: "Ca₂Cl₂"
  }, "B", "El calcio forma habitualmente Ca²⁺ y el cloro forma Cl⁻. Se necesitan dos iones cloruro para compensar la carga de un ion calcio: (+2) + 2·(−1) = 0. Por tanto, la fórmula mínima es CaCl₂. Ca₂Cl₂ tendría la misma proporción, pero no sería la fórmula empírica simplificada; CaCl no sería eléctricamente neutro."),
  pregunta("fyq-t13-008", 13, "¿Qué nombre corresponde a N₂O₅ en nomenclatura de composición?", {
    A: "Pentóxido de dinitrógeno", B: "Óxido de nitrógeno", C: "Dióxido de nitrógeno", D: "Nitrato de nitrógeno"
  }, "A", "La fórmula contiene dos átomos de nitrógeno y cinco de oxígeno. En la nomenclatura de composición se usan prefijos: di- para dos y penta- para cinco; el nombre es pentóxido de dinitrógeno. También puede analizarse el número de oxidación: 2·(n) + 5·(−2) = 0, de donde n = +5 para cada nitrógeno."),
  pregunta("fyq-t13-009", 13, "¿Qué número de oxidación tiene el oxígeno en un peróxido como H₂O₂?", {
    A: "−1", B: "−2", C: "0", D: "+1"
  }, "A", "En la mayoría de los óxidos el oxígeno tiene −2, pero en los peróxidos aparece el ion O₂²⁻. Como la carga −2 se reparte entre sus dos átomos, cada oxígeno tiene número de oxidación −1. En H₂O₂ se comprueba: 2·(+1) + 2·(−1) = 0. Reconocer el grupo O₂²⁻ evita aplicar automáticamente la regla habitual del −2."),
  pregunta("fyq-t13-010", 13, "¿Cuál es la fórmula del hidróxido de aluminio?", {
    A: "AlOH", B: "Al(OH)₂", C: "Al(OH)₃", D: "Al₃OH"
  }, "C", "El catión aluminio es Al³⁺ y el anión hidróxido es OH⁻. Se necesitan tres hidróxidos para neutralizar un aluminio: (+3) + 3·(−1) = 0. Como el ion OH⁻ es un grupo formado por dos elementos, se escribe entre paréntesis cuando aparece más de una vez: Al(OH)₃. El subíndice 3 afecta al grupo completo, no solo al hidrógeno."),
  pregunta("fyq-t13-011", 13, "¿Qué fórmula representa correctamente el ácido sulfúrico?", {
    A: "H₂SO₄", B: "HSO₃", C: "H₂S", D: "SO₄"
  }, "A", "El ácido sulfúrico contiene dos hidrógenos, un azufre y cuatro oxígenos: H₂SO₄. En la comprobación de números de oxidación, 2·(+1) + n + 4·(−2) = 0, de modo que el azufre presenta +6. No debe confundirse con el ácido sulfuroso, H₂SO₃, que tiene un oxígeno menos y azufre con número de oxidación +4."),
  pregunta("fyq-t13-012", 13, "¿Qué ion poliatómico es el nitrato?", {
    A: "NO₂⁻", B: "NO₃⁻", C: "N₂O₃²⁻", D: "NH₄⁺"
  }, "B", "El ion nitrato es NO₃⁻: contiene un átomo de nitrógeno y tres de oxígeno, y su carga total es −1. El nitrito es NO₂⁻, por lo que cambiar el subíndice modifica el ion y su nombre. En una sal, el nitrato se combina con cationes; por ejemplo, Ca²⁺ necesita dos nitratos y forma Ca(NO₃)₂. Los paréntesis indican que el grupo completo se repite."),
  pregunta("fyq-t13-013", 13, "¿Cuál es la fórmula correcta del sulfato de aluminio?", {
    A: "AlSO₄", B: "Al₂SO₄", C: "Al₂(SO₄)₃", D: "Al₃(SO₄)₂"
  }, "C", "El aluminio aporta Al³⁺ y el sulfato es SO₄²⁻. El mínimo común múltiplo de 3 y 2 es 6: hacen falta dos Al³⁺, que aportan +6, y tres sulfatos, que aportan −6. La fórmula es Al₂(SO₄)₃. Los paréntesis son obligatorios porque hay tres grupos sulfato completos; escribir Al₂SO₄ no conservaría la proporción de cargas."),
  pregunta("fyq-t13-014", 13, "¿Qué familia de hidrocarburos contiene únicamente enlaces sencillos entre carbonos y sigue la fórmula general CₙH₂ₙ₊₂ en cadenas abiertas?", {
    A: "Alcanos", B: "Alquenos", C: "Alquinos", D: "Aromáticos"
  }, "A", "Los alcanos acíclicos son hidrocarburos saturados: entre sus carbonos solo hay enlaces simples. Su fórmula general es CₙH₂ₙ₊₂; por ejemplo, para n = 3 se obtiene C₃H₈, propano. Los alquenos contienen al menos un doble enlace y siguen CₙH₂ₙ, mientras que los alquinos contienen un triple enlace y siguen CₙH₂ₙ₋₂ en cadenas abiertas."),
  pregunta("fyq-t13-015", 13, "¿Qué característica identifica a un alqueno?", {
    A: "Al menos un doble enlace C=C", B: "Solo enlaces C−C sencillos", C: "Un grupo −OH obligatorio", D: "Un átomo de nitrógeno en cada molécula"
  }, "A", "Los alquenos son hidrocarburos insaturados que contienen al menos un doble enlace carbono-carbono, C=C. En una cadena abierta con un solo doble enlace cumplen CₙH₂ₙ; por ejemplo, eteno es C₂H₄. El doble enlace reduce el número máximo de hidrógenos respecto a un alcano y debe indicarse en el nombre y localizarse con el número adecuado."),
  pregunta("fyq-t13-016", 13, "¿Qué grupo funcional caracteriza a los alcoholes?", {
    A: "−OH unido a un carbono", B: "−COOH", C: "−C≡N", D: "−NO₂ exclusivamente"
  }, "A", "Los alcoholes contienen el grupo hidroxilo, −OH, unido a un átomo de carbono. En el etanol, CH₃−CH₂−OH, ese grupo aparece en el extremo y se nombra con el sufijo -ol. No debe confundirse con un hidróxido inorgánico: en un alcohol el −OH forma parte de una molécula orgánica y está unido covalentemente al carbono."),
  pregunta("fyq-t13-017", 13, "¿Qué grupo funcional aparece en un aldehído?", {
    A: "−CHO en un extremo de la cadena", B: "−OH siempre en el carbono central", C: "−COO− entre dos carbonos", D: "−NH₂"
  }, "A", "Un aldehído posee un grupo carbonilo terminal, −CHO: el carbono del grupo C=O está unido a un hidrógeno y a la cadena carbonada. Por eso el etanal se representa CH₃−CHO y termina en el sufijo -al. Una cetona también tiene C=O, pero el carbonilo está entre dos carbonos, como en CH₃−CO−CH₃; esa diferencia cambia la familia y el nombre."),
  pregunta("fyq-t13-018", 13, "¿Qué diferencia estructural básica hay entre un aldehído y una cetona?", {
    A: "El aldehído tiene el carbonilo terminal y la cetona lo tiene unido a dos carbonos", B: "El aldehído contiene nitrógeno y la cetona oxígeno", C: "La cetona no contiene enlaces dobles", D: "No existe ninguna diferencia"
  }, "A", "Ambos compuestos contienen el grupo carbonilo C=O, pero su posición es distinta. En un aldehído aparece al final de la cadena, −CHO, porque el carbono del carbonilo está unido a un hidrógeno. En una cetona está en una posición interna, −CO−, unido a dos carbonos. Así, CH₃CHO es etanal y CH₃COCH₃ es propanona."),
  pregunta("fyq-t13-019", 13, "¿Qué grupo funcional define a los ácidos carboxílicos?", {
    A: "−COOH", B: "−O−", C: "−NH₂", D: "C=C"
  }, "A", "El grupo carboxilo −COOH combina un carbonilo C=O y un hidroxilo −OH sobre el mismo carbono. El ácido etanoico, CH₃−COOH, es un ejemplo. El sufijo habitual es -oico. El grupo carboxilo puede liberar el hidrógeno del −OH y formar un ion carboxilato, R−COO⁻, que aparece en muchas sales y ésteres."),
  pregunta("fyq-t13-020", 13, "¿Qué enlace o grupo caracteriza a un éster?", {
    A: "R−COO−R′", B: "R−OH únicamente", C: "R−NH₂", D: "R−C≡N"
  }, "A", "Un éster presenta la estructura general R−COO−R′: contiene un carbonilo unido a un oxígeno que enlaza con otra cadena orgánica. Se puede formar mediante esterificación entre un ácido carboxílico y un alcohol, produciendo también agua: ácido + alcohol ⇌ éster + H₂O. El grupo R′ distingue al éster de un ácido carboxílico, cuyo grupo termina en −OH."),
  pregunta("fyq-t13-021", 13, "¿Qué grupo funcional caracteriza a una amina primaria?", {
    A: "−NH₂ unido a una cadena carbonada", B: "−COOH", C: "−CHO", D: "−O−"
  }, "A", "Una amina primaria puede representarse como R−NH₂: el nitrógeno está unido a una cadena orgánica y conserva dos hidrógenos. Las aminas son derivados orgánicos del amoníaco, NH₃, en los que uno o más hidrógenos han sido sustituidos por grupos carbonados. No debe confundirse una amina con una amida, que contiene además un carbonilo: R−CONH₂."),
  pregunta("fyq-t13-022", 13, "¿Qué grupo funcional identifica a un nitrilo?", {
    A: "−C≡N", B: "−OH", C: "−COOH", D: "−Cl"
  }, "A", "Los nitrilos contienen el grupo ciano, −C≡N, con un enlace triple entre carbono y nitrógeno. En la fórmula CH₃−C≡N, por ejemplo, el compuesto pertenece a la familia de los nitrilos. El triple enlace explica que sea una función diferente de una amina, −NH₂, y de un nitroderivado, −NO₂, aunque ambas familias contengan nitrógeno."),
  pregunta("fyq-t13-023", 13, "¿Cuál es el nombre correcto de CH₃−CH(CH₃)−CH₃?", {
    A: "Butano", B: "2-metilpropano", C: "Prop-1-eno", D: "2-metilpropan-2-ol"
  }, "B", "La cadena continua más larga tiene tres carbonos, por lo que el hidrocarburo base es propano. En el carbono 2 hay una ramificación metilo, −CH₃; por eso el nombre es 2-metilpropano. No se elige una cadena de cuatro carbonos porque no existe un recorrido continuo de cuatro átomos de carbono en la estructura. La numeración debe dar el localizador más bajo a la ramificación."),
  pregunta("fyq-t13-024", 13, "Al nombrar una molécula con varios grupos funcionales, ¿qué criterio general se aplica?", {
    A: "Se elige la cadena principal que contiene el grupo funcional prioritario y se usa su sufijo", B: "Se ignoran todos los grupos funcionales", C: "Siempre se numera desde el extremo más largo sin más comprobaciones", D: "Se nombran solo los átomos de hidrógeno"
  }, "A", "Primero se identifica el grupo funcional principal según las reglas de prioridad; debe quedar incluido en la cadena principal y se expresa mediante el sufijo del nombre. Después se numera para darle el localizador adecuado, se nombran las sustituciones como prefijos y se comprueba la estructura completa. Esta estrategia evita elegir una cadena que sea larga pero no contenga la función principal y permite distinguir, por ejemplo, un alcohol de un ácido carboxílico con la misma cadena carbonada."),
];

window.DB = {
  version: "estudios-fyq-v3",
  fuentes: [
    {
      id: "fyq-santillana",
      nombre: "Física y Química · libro de 1.º de Bachillerato",
      idioma: "es",
      descripcion: "Preguntas elaboradas a partir de los temas 0 al 12 y el anexo de formulación y tablas del libro de Física y Química.",
      licencia: "Uso personal y educativo"
    }
  ],
  temas: [
    { id: 0, nombre: "La medida", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 1, nombre: "El átomo y la tabla periódica", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 2, nombre: "El enlace químico", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 3, nombre: "Las sustancias", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 4, nombre: "Los gases", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 5, nombre: "Disoluciones", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 6, nombre: "Reacciones químicas", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 7, nombre: "Química del carbono", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 8, nombre: "El movimiento", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 9, nombre: "Tipos de movimientos", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 10, nombre: "Las fuerzas", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 11, nombre: "Trabajo y energía", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 12, nombre: "El calor y la energía", sistema: "Física y Química", fuente: "fyq-santillana" },
    { id: 13, nombre: "Formulación y tablas", sistema: "Física y Química", fuente: "fyq-santillana" }
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

window.DB.preguntas.push(...PREGUNTAS_T3_6, ...PREGUNTAS_T7_9, ...PREGUNTAS_T10_12, ...PREGUNTAS_T13);
