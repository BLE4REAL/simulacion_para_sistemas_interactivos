# Unidad 4: Oscilaciones

## Sistema audiovisual performativo con Kuramoto

En esta unidad desarrollé un instrumento audiovisual para la Web basado en el modelo de Kuramoto. El proyecto se llama **Ocho: un instrumento de ondas** y está formado por ocho agentes que tienen un ritmo propio, una identidad visual y una voz sonora diferente.

La intención principal fue convertir la sincronización en algo que pudiera escucharse, observarse y tocarse. En vez de construir una canción fija o un secuenciador tradicional, diseñé un sistema en el que cada instrumento conserva su propio pulso, pero puede acercarse al ritmo de los demás cuando aumenta la conexión entre agentes.

El enunciado y los requisitos de la unidad se encuentran en [Unidad 4: Oscilaciones](https://juanferfranco.github.io/simulacion-2026-20/units/unit4/).

---

## 1. Referentes e intención inicial

Los referentes de la unidad mostraron distintas maneras de relacionar oscilación, sincronización, imagen y sonido:

- Las piezas de movimiento armónico simple de Memo Akten me ayudaron a entender que una oscilación puede convertirse en material visual expresivo.
- El video de Veritasium y la simulación de luciérnagas de Nicky Case hicieron visible cómo varios elementos independientes pueden organizarse sin necesidad de un reloj central.
- Incredibox sirvió como referente por la claridad de sus personajes sonoros y por la facilidad con la que el usuario puede intervenir la experiencia.

No quise copiar la estructura de Incredibox. Mi intención fue crear una pequeña orquesta en la que la organización temporal no estuviera predeterminada, sino que emergiera de la interacción entre los agentes.

La pregunta que guio el diseño fue:

> ¿Cómo hacer que la sincronización de Kuramoto se convierta en una experiencia que se pueda tocar y no solamente observar?

---

## 2. Primera versión y cambio de enfoque

El punto de partida fue un archivo HTML que ya contenía ocho agentes y una simulación de Kuramoto. Sin embargo, los agentes compartían solamente cuatro tipos de sonido y la interfaz funcionaba principalmente como una demostración técnica.

Después de revisar el prototipo decidí cambiar el enfoque. En lugar de mostrar osciladores abstractos, convertí los ocho agentes en instrumentos con una personalidad reconocible. También rediseñé toda la interfaz con formas redondeadas, colores vivos y controles sencillos, buscando que el sistema se sintiera como un instrumento y no como un panel de laboratorio.

La nueva versión quedó organizada en cuatro zonas:

1. Un personaje o instrumento principal que puede tocarse directamente.
2. Una simulación con las vistas **Ondas** y **Campo**.
3. Controles globales para iniciar el conjunto, modificar la conexión K, observar la sincronización y controlar el volumen.
4. Una sección para seleccionar cada agente y cambiar afinación, ritmo propio, duración e intensidad.

---

## 3. Las ocho personalidades audiovisuales

Cada agente tiene una frecuencia base, un ritmo natural, un color, una envolvente y una forma de síntesis diferente.

| Agente | Instrumento | Frecuencia base | Personalidad audiovisual |
|---:|---|---:|---|
| 1 | Bombo | 65,41 Hz | Golpe profundo, redondo y de mayor peso visual. |
| 2 | Conga | 146,83 Hz | Sonido cálido con una respuesta corta y orgánica. |
| 3 | Caja | 196 Hz | Ataque seco, ruido brillante y movimiento rápido. |
| 4 | Maraca | 220 Hz | Textura de ruido, onda irregular y duración breve. |
| 5 | Marimba | 261,63 Hz | Tono de madera, ataque definido y resonancia media. |
| 6 | Cuerda | 329,63 Hz | Sonido elástico con varios armónicos. |
| 7 | Campana | 392 Hz | Resonancia metálica larga y ondas expansivas. |
| 8 | Flauta | 523,25 Hz | Sonido suave, agudo y sostenido. |

Las diferencias no dependen únicamente del color o de la altura musical. Cada instrumento usa una combinación propia de timbre, duración, armónicos, forma de onda, animación y respuesta visual. Cuando un agente completa un ciclo, se escucha su voz y su representación visual produce un pulso.

---

## 4. Implementación del modelo de Kuramoto

El modelo utilizado parte de la ecuación:

$$
\frac{d\theta_i}{dt}=\omega_i+\frac{K}{N}\sum_{j=1}^{N}\sin(\theta_j-\theta_i)
$$

En la implementación se usa una forma equivalente de campo medio:

$$
\frac{d\theta_i}{dt}=\omega_i+KR\sin(\psi-\theta_i)
$$

### Significado de las variables

- **Fase del agente (theta):** indica el punto actual del ciclo de cada instrumento. Cuando la fase completa una vuelta se produce un golpe sonoro y un pulso visual.
- **Ritmo propio (omega):** es la velocidad natural con la que avanza cada agente cuando no recibe influencia del grupo. En la interfaz aparece como **Ritmo propio**.
- **Conexión entre agentes (K):** controla cuánto influye el comportamiento colectivo sobre cada oscilador. Con un valor bajo los ritmos permanecen separados; al aumentarlo comienzan a acercarse.
- **Número de agentes (N):** en este proyecto es igual a ocho.
- **Parámetro de orden (R):** representa el nivel de sincronización del grupo. Se calcula a partir de la suma de los vectores de fase y toma valores entre 0 y 1.
- **Fase media (psi):** señala la dirección o fase colectiva hacia la que tienden los agentes cuando existe acoplamiento.

El valor R se comunica en la interfaz mediante el indicador **Sincronía**, expresado como porcentaje. Esto permite reconocer el estado colectivo sin depender únicamente del oído.

Kuramoto no podría reemplazarse por un temporizador global sin cambiar la experiencia. Un temporizador haría que todos los golpes ocurrieran según una secuencia ya definida. Aquí, en cambio, cada agente conserva su frecuencia natural y la coincidencia de los golpes aparece gradualmente por la interacción entre sus fases.

---

## 5. Relación entre modelo, sonido e imagen

La fase de cada agente controla simultáneamente tres aspectos:

1. La posición del marcador sobre su onda.
2. El momento en el que se activa su sonido.
3. El pulso, destello u onda expansiva que aparece en la interfaz.

La vista **Ondas** muestra las ocho señales y el recorrido de fase de cada instrumento. Cuando el audio está activo, se representa la señal sonora en tiempo real.

La vista **Campo** distribuye los ocho agentes en el espacio. Cada golpe genera ondas expansivas y, cuando dos agentes tienen fases cercanas, aparecen conexiones visuales entre ellos. Al aumentar K, los golpes, los marcadores de fase y las ondas tienden a organizarse.

Esta relación hace que el algoritmo sea perceptible: la sincronización no es solamente un número, sino que se escucha en la coincidencia de los ataques y se observa en la organización de las fases.

---

## 6. Interacciones performativas

### Intervención global

- **Tocar juntos / Pausar:** inicia o detiene la evolución del conjunto.
- **Conexión entre agentes:** modifica K entre 0 y 6.
- **Volumen general:** controla la intensidad de toda la mezcla.
- **Guardar mezcla:** conserva en el navegador los parámetros definidos por el usuario.

### Intervención individual

- Tocar un personaje, una onda o las teclas del 1 al 8 activa directamente su sonido.
- Arrastrar una onda hacia arriba o abajo modifica el ritmo propio de ese agente.
- Cada instrumento permite editar su afinación, ritmo, duración e intensidad.
- Los botones **M** y **S** permiten silenciar una voz o escucharla de manera aislada.

### Mecanismo de perturbación

Al tocar manualmente un agente se altera temporalmente su evolución de fase. El sistema añade un impulso y luego permite observar cómo ese agente vuelve a relacionarse con el colectivo. Esta acción rompe por un momento una organización estable y hace visible la respuesta del grupo.

---

## 7. Estados colectivos observables

### Desorden

Con K cercano a cero, cada agente avanza principalmente según su ritmo propio. Los sonidos aparecen separados, los marcadores de fase se distribuyen por toda la pantalla y el porcentaje de sincronía es bajo o variable.

### Organización parcial

Con valores intermedios de K, algunos agentes comienzan a coincidir mientras otros conservan diferencias. Se escuchan pequeños grupos rítmicos y el indicador de sincronía aumenta sin estabilizarse por completo.

### Organización estable

Con una conexión alta, las fases se agrupan y los ataques sonoros tienden a ocurrir juntos. En la vista Campo aparecen más relaciones y el porcentaje de sincronía se aproxima a un valor alto.

Una parte importante de la interpretación consiste en pasar deliberadamente entre estos estados y luego tocar un agente para romper la estabilidad y escuchar cómo se reorganiza el sistema.

---

## 8. Experimentos y decisiones durante el desarrollo

### Ocho voces realmente diferentes

La primera decisión importante fue dejar de repetir cuatro sonidos entre los ocho agentes. Se diseñaron ocho voces: bombo, conga, caja, maraca, marimba, cuerda, campana y flauta. Esto hizo más fácil reconocer qué agente estaba actuando y permitió que cada uno tuviera una presencia musical propia.

### Dos representaciones de la simulación

Una representación centrada solamente en ondas no comunicaba con suficiente claridad la relación entre los agentes. Por eso conservé la vista Ondas y añadí la vista Campo. La primera permite comparar señales y fases; la segunda hace visible la propagación de cada golpe y la cercanía temporal entre agentes.

### Controles expresivos

Se conservaron pocos controles con un resultado perceptible:

- La afinación cambia la frecuencia de la voz.
- El ritmo modifica la velocidad natural del agente.
- La duración modifica la envolvente.
- La intensidad modifica el nivel individual.
- La conexión modifica K y, por tanto, el comportamiento colectivo.

### Ampliación del ritmo propio

En una prueba posterior observé que el rango de ritmo era demasiado limitado. El máximo inicial era de 4,2 rad/s, aproximadamente 40 pulsos por minuto. Amplié el rango hasta 12 rad/s, equivalente a aproximadamente **114,6 pulsos por minuto**.

También adapté el gesto de arrastrar la onda para alcanzar ese nuevo límite. El cambio permitió explorar resultados más rápidos sin alterar los sonidos, la estructura visual ni el modelo de sincronización.

### Prueba de configuración musical

Para escuchar el sistema como instrumento preparé una mezcla con los siguientes ritmos:

| Instrumento | Ritmo propio |
|---|---:|
| Bombo | 24 ppm |
| Conga | 32 ppm |
| Caja | 36 ppm |
| Maraca | 48 ppm |
| Marimba | 30 ppm |
| Cuerda | 40 ppm |
| Campana | 20 ppm |
| Flauta | 28 ppm |

Con K alrededor de 0,70 los ritmos se mantienen entrelazados. Al subirlo progresivamente hasta 2,20 se escucha cómo las voces comienzan a acercarse y sincronizarse.

También intenté aproximarme al carácter rítmico de una canción conocida. Esta prueba dejó claro un límite importante: el sistema puede crear una atmósfera y una organización rítmica, pero no reproducir un riff exacto porque no es un secuenciador de notas. Decidí conservar esta limitación, ya que mantiene el enfoque de la unidad en el comportamiento emergente.

---

## 9. Pruebas realizadas

| Prueba | Acción | Resultado esperado | Resultado observado |
|---|---|---|---|
| Inicio del conjunto | Pulsar **Tocar juntos** | Los ocho agentes avanzan y producen sonido según su fase. | El conjunto inició correctamente y cada voz mantuvo su pulso. |
| Acoplamiento | Aumentar K de un valor bajo a uno alto | El indicador R aumenta y los ataques tienden a coincidir. | Se observó y escuchó una organización progresiva. |
| Perturbación | Tocar un agente durante una sincronización alta | El agente se separa temporalmente y después responde al grupo. | Se produjo el golpe individual y posteriormente la reorganización. |
| Edición individual | Cambiar afinación, ritmo, duración e intensidad | Solamente cambia el instrumento seleccionado. | Los controles modificaron la voz seleccionada sin reconfigurar las demás. |
| Mezcla | Activar silencio y solo | La salida sonora y la apariencia indican qué voces están activas. | Los controles respondieron correctamente. |
| Rango ampliado | Llevar Ritmo propio al máximo | El control alcanza aproximadamente 114,6 ppm. | El nuevo máximo quedó disponible tanto en el control como al arrastrar. |
| Adaptación | Abrir la interfaz en escritorio y móvil | Los controles permanecen visibles y utilizables. | La distribución respondió correctamente en ambos tamaños. |

Además, se comprobó la sintaxis del JavaScript, el funcionamiento de las ocho voces, la selección de instrumentos, las vistas Ondas y Campo y los atajos de teclado.

---

## 10. Dificultades y soluciones

Una de las principales dificultades fue evitar que la experiencia se sintiera como una visualización técnica. La solución fue convertir cada oscilador en un instrumento reconocible y relacionar su fase con sonido, animación y ondas.

Otra dificultad fue diferenciar ocho agentes sin depender solamente del color. Para resolverlo diseñé tipos de síntesis, frecuencias, envolventes, formas de onda y comportamientos visuales distintos.

También fue necesario equilibrar autonomía y control. Si el usuario controlaba directamente toda la secuencia, Kuramoto perdía importancia. Por eso las intervenciones modifican parámetros o perturban fases, pero el sistema continúa evolucionando según sus propias reglas.

Finalmente, el rango inicial del ritmo limitaba la interpretación. La ampliación hasta 12 rad/s permitió tocar configuraciones más rápidas sin convertir el sistema en un secuenciador tradicional.

---

## 11. Alternativas descartadas

- Mantener cuatro sonidos repetidos entre los ocho agentes, porque debilitaba sus personalidades.
- Usar solamente una vista de ondas, porque no mostraba de manera suficiente la relación espacial y colectiva.
- Hacer que el audio controlara automáticamente la simulación, porque la interacción debía depender de las decisiones del performer.
- Incorporar una canción fija o un secuenciador por pasos, porque reemplazaría el comportamiento emergente por una estructura predeterminada.
- Diferenciar los agentes únicamente por color o altura, porque el enunciado exige personalidades audiovisuales reconocibles.
- Utilizar un reloj global, porque eliminaría la función central de las fases, los ritmos propios y el acoplamiento.

---

## 12. Uso de inteligencia artificial

Utilicé IA como apoyo para:

- Analizar la estructura del HTML original.
- Explorar alternativas de interfaz y organización de controles.
- Proponer una primera diferenciación de instrumentos y timbres.
- Implementar y revisar la síntesis mediante Web Audio.
- Comprobar la adaptación de la interfaz a escritorio y móvil.
- Encontrar los puntos donde debía ampliarse el rango del ritmo.
- Proponer valores iniciales para realizar pruebas musicales.

Las decisiones de diseño no se aceptaron automáticamente. Elegí convertir los agentes en instrumentos, definí que fueran ocho voces distintas, pedí cambiar completamente la interfaz, exigí que cada instrumento tuviera una onda vinculada y posteriormente limité el último cambio únicamente a ampliar el ritmo propio. También evalué las propuestas mediante pruebas de interacción y descarté la idea de reproducir una canción exacta porque no era coherente con el modelo.

---

## 13. Verificación de requisitos mínimos

| Requisito | Evidencia |
|---|---|
| 8 agentes simultáneos | El sistema contiene ocho osciladores activos. |
| Al menos 4 personalidades audiovisuales | Existen ocho instrumentos con timbre, envolvente, forma, color y comportamiento propios. |
| Manifestación visual y sonora | Cada ciclo genera sonido, animación, marcador de fase y onda. |
| Modificar al menos 2 variables del modelo | Es posible intervenir K y el ritmo propio de cada agente. |
| Interacción global e individual | Se puede modificar K y tocar o editar cada agente por separado. |
| Mecanismo de perturbación | Tocar un agente aplica un impulso temporal a su fase. |
| Tres estados colectivos | Se reconocen desorden, organización parcial y organización estable. |
| Comunicación del estado colectivo | El porcentaje de sincronía muestra el parámetro de orden R. |
| Experiencia performativa | El usuario puede iniciar, mezclar, tocar, perturbar y reconfigurar el sistema en tiempo real. |
| Kuramoto con consecuencias perceptibles | La fase y el acoplamiento determinan los golpes, pulsos, ondas y organización colectiva. |

---

## 14. Autoevaluación

| Criterio | Puntaje | Justificación |
|---|---:|---|
| Leí y verifiqué que el proyecto cumple los requisitos mínimos de la unidad. | 25/25 | Revisé cada requisito y relacioné su evidencia con una función concreta del instrumento. |
| Puedo explicar qué representa cada variable de Kuramoto. | 25/25 | Identifico fase, ritmo propio, conexión, número de agentes, parámetro de orden y fase media dentro de la aplicación. |
| Puedo explicar cómo las variables producen el comportamiento observado. | 25/25 | Puedo relacionar fase y acoplamiento con ritmo, sonido, animación y sincronización. |
| Puedo demostrar que el proyecto cumple los objetivos de la unidad. | 25/25 | La interfaz permite recorrer los estados colectivos, intervenir agentes y observar la reorganización. |
| **Total** | **100/100** | El proyecto convierte el modelo de autoorganización en un instrumento audiovisual performativo. |

---

## 15. Reflexión final

El aprendizaje más importante fue comprender que una oscilación no tiene que representarse solamente como una curva. Puede convertirse en ritmo, sonido, movimiento, interacción y comportamiento colectivo.

Antes de esta unidad pensaba la sincronización como una coincidencia programada. Con Kuramoto entendí que también puede aparecer como resultado de agentes independientes que se influyen entre sí. El valor de la experiencia está precisamente en escuchar y observar ese proceso: comenzar con voces separadas, aumentar la conexión, encontrar una organización y luego perturbarla para descubrir cómo responde.

El proyecto responde la pregunta central de la unidad porque Kuramoto no funciona como decoración. Las fases determinan cuándo ocurre cada evento y el acoplamiento transforma realmente la experiencia audiovisual. Sin este modelo, **Ocho** dejaría de ser un sistema emergente y se convertiría en una secuencia convencional.
