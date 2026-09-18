# Unidad 5: Sistemas de partículas

## Red de floración — Relevo generacional

**Autor:** Juan Esteban Araujo.  
**Proyecto individual.** Fecha de entrega indicada: 18 de septiembre de 2026.

En esta unidad desarrollé una presentación web generativa para interpretar el guion “Relevo generacional: la ventaja que nadie está aprovechando”, del Fórum UPB. Mi propuesta se llama **Red de floración** y utiliza pétalos rosados que se agrupan, se separan y cambian de estructura durante trece escenas.

La pregunta que orientó el trabajo fue: ¿cómo hacer que el movimiento de los elementos explique una idea, además de acompañar visualmente una presentación?

- [Encargo de la Unidad 5](https://juanferfranco.github.io/simulacion-2026-20/units/unit5/).
- [Archivos de la presentación](unidad_5/).
- [Instrucciones y gramática visual](unidad_5/README.md).

Para ejecutar la presentación, descargar el repositorio y abrir `unidad_5/index.html` en un navegador. La vista de archivos de GitHub muestra el código; no ejecuta la presentación. Las fotografías están incluidas localmente. Las tipografías se solicitan a Google Fonts; sin conexión se utilizan las fuentes de respaldo.

## 1. Punto de partida y referentes

El encargo propone pensar las partículas como elementos relacionados. Lo importante es explicar qué cambia en sus vínculos, organización y comportamiento, y cómo eso interpreta el discurso. Conservé el orden narrativo del guion y resumí el texto para mostrar ideas centrales en pantalla.

Tomé como orientación conceptual la pregunta planteada por la unidad a partir de Memo Akten: cómo el movimiento puede convertirse en estructura y lenguaje. El proyecto [ForumTEDTALK](https://github.com/juanferfranco/ForumTEDTALK) fue la referencia de presentación web. Mi propuesta desarrolló una identidad propia a partir de la floración.

El guion parte del auditorio como espacio para ceremonias, pasa al encuentro entre academia, industria y ciudad, y plantea el relevo generacional como colaboración. Por eso necesitaba un sistema capaz de pasar de elementos dispersos a estructuras compartidas.

## 2. Concepto elegido

Elegí la alternativa “Red de floración”. Quería una estética rosada con pétalos inspirados en los cerezos y en los árboles que se ponen rosados en Medellín. Esa conexión cercana fue el punto de partida de la paleta y de la forma de las partículas.

Los pétalos representan personas, ideas y oportunidades. Sus agrupaciones expresan comunidades; la apertura de una forma indica una nueva relación con el entorno; las ramificaciones representan caminos que se desarrollan desde una base común; la floración expresa un resultado construido colectivamente.

No busqué representar literalmente Japón ni reconstruir una especie botánica. La referencia floral funciona como una metáfora de crecimiento y transformación.

## 3. Decisiones visuales y su justificación

| Decisión | Intención |
|---|---|
| Pétalos rosados de contorno orgánico | Dar identidad al sistema y relacionarlo con la floración. |
| Variaciones de tamaño, orientación y tono | Mantener diferencias individuales dentro de un conjunto reconocible. No codifican edades ni datos demográficos. |
| Fondo crema `#f7efe9` | Dar una base cálida y separar las figuras del texto y las fotografías. |
| Rosados `#f4a6b9`, `#e96f92` y `#a83d65` | Crear variación dentro de la misma familia cromática y distinguir superposiciones. |
| Texto ciruela oscuro `#271d27` | Buscar contraste con el fondo claro sin salir de la paleta. |
| Playfair Display en títulos | Dar peso editorial a la idea principal mediante contraste entre trazos gruesos y finos. |
| DM Sans en apoyos y controles | Facilitar una lectura sencilla y diferenciar información principal y secundaria. |
| Texto a la izquierda y sistema hacia la derecha | Organizar la lectura y reservar una zona para observar la transformación. |
| Etiqueta, título y frase de apoyo | Presentar el tema, destacar una afirmación y conectar esa afirmación con la figura. |
| Fotografías con velo claro y menor saturación | Situar el discurso en el Fórum sin perder legibilidad. |
| Espacio libre y controles inferiores | Permitir el recorrido de los pétalos y ajustar el ritmo durante la exposición. |

Las decisiones no tienen todas el mismo tipo de justificación: unas construyen significado y otras resuelven legibilidad, composición o control. Los títulos todavía tienen bastante peso visual; debo seguir revisando que permitan suficiente protagonismo al sistema en una pantalla grande.

## 4. Gramática de las trece escenas

| Escena | Organización propuesta | Relación con el discurso |
|---:|---|---|
| 1 | Pétalos dispersos | Hay personas e ideas con potencial, pero todavía sin organización común. |
| 2 | Anillo cerrado | El auditorio aparece como espacio delimitado por su función inicial. |
| 3 | Anillo abierto con una sección que se desprende | La universidad sale al encuentro del mundo. |
| 4 | Tres núcleos | Academia, industria y ciudad conservan su identidad dentro del encuentro. |
| 5 | Centro y anillos concéntricos pulsantes | El evento inicia un impacto que alcanza otros ámbitos. |
| 6 | Estructura neuronal con señales | La comunidad se sostiene mediante intercambio y comunicación. |
| 7 | Anillos coordinados | La confianza se interpreta como organización y ritmo compartido. |
| 8 | Raíces, tronco y ramas | La experiencia sostiene el descubrimiento de nuevas rutas. |
| 9 | Dos agrupaciones | Las generaciones conservan diferencias dentro de una visión común. |
| 10 | Composición floral de seis lóbulos | La colaboración organiza contribuciones alrededor de un centro compartido. |
| 11 | Forma frontal y soporte inferior | Los jóvenes ocupan el presente y cuentan con una base de apoyo. |
| 12 | Árbol con copa florecida | El futuro es el resultado de construir sobre relaciones anteriores. |
| 13 | Dos marcos para QR | El cierre invita a continuar la relación mediante memorias y redes. |

Esta tabla registra la intención del diseño. Algunas lecturas requieren ajuste: el anillo es ovalado según sus proporciones, las ondas pulsan en lugar de expandirse indefinidamente y la figura de la escena 11 todavía conserva un trazado espiral. En la escena 9 los grupos se distinguen por posición, no por colores asignados a cada generación.

## 5. Funcionamiento del sistema

La presentación está construida con HTML, CSS y JavaScript utilizando Canvas 2D. Cada pétalo almacena posición, velocidad, tamaño, orientación, giro, fase y tono. El número de partículas se adapta al área de la ventana dentro de un rango de 110 a 230.

Cada escena define posiciones objetivo. Después de la entrada, las partículas se aproximan a ellas mediante una fuerza de atracción y amortiguación. Sobre esos objetivos se añaden pequeñas oscilaciones que mantienen el movimiento sin deshacer completamente la silueta.

En determinadas escenas se dibujan conexiones con vecinos cercanos. Las señales luminosas recorren algunos de esos enlaces en las escenas de comunidad y confianza. Son una representación visual de comunicación: no constituyen una simulación biológica ni las líneas aplican fuerzas de resorte entre partículas.

El sistema combina estructuras diseñadas de antemano con propiedades y movimiento calculados en tiempo real. No es una organización completamente emergente. Esa diferencia me permite explicar con precisión qué parte del resultado depende de una composición y qué parte depende de las reglas dinámicas.

## 6. Experimentos y correcciones

### Correspondencia entre explicación y figura

Al revisar el primer prototipo observé que varias formas no coincidían con la explicación: la dispersión parecía una función seno, el círculo parecía una espiral abierta y otras escenas repetían espirales. También señalé que las escenas de comunidad y confianza casi no cambiaban entre sí.

Solicité una revisión escena por escena. Se reemplazaron los objetivos de las partículas para diferenciar dispersión, apertura, ondas, ramificaciones, agrupaciones y floración. Pedí específicamente señales neuronales para la comunidad y una estructura de árbol para la experiencia.

La lección de esta prueba fue que ponerle un nombre a una animación no garantiza que el público perciba esa intención. La forma visible debe sostener la explicación.

### Fotografías de fondo

En las primeras revisiones no aparecían fotografías donde debían estar, especialmente en las escenas 8, 12 y 13. Los recursos quedaron incluidos como archivos locales y se revisó su correspondencia: FOTO 1 en escena 2, FOTO 2 en escena 4, FOTO 3 en escena 5, FOTO 4 en escena 8, FOTO 5 en escena 12 y FOTO 6 en escena 13. Las capturas posteriores ya mostraron fondos fotográficos en varias de esas escenas.

### Movimiento mientras permanezco en una escena

Después pedí que la figura no quedara inmóvil. Se incorporaron oscilaciones pequeñas, respiración colectiva y desplazamientos de copa en los árboles. La intención fue mantener una estructura activa durante la narración sin impedir que se reconociera.

### Entrada como viento

Pedí que los pétalos llegaran desde afuera y llenaran la figura lentamente. La entrada inicial utiliza cuatro bordes, recorridos curvos, retrasos individuales y desaceleración. La llegada completa se distribuye aproximadamente entre tres y siete segundos.

### Continuidad entre diapositivas

La siguiente corrección fue conservar continuidad entre escenas. La mayoría de los pétalos ahora parte de su posición actual para reorganizarse; una fracción vuelve a entrar desde los bordes. El umbral de selección es del 18 %, por lo que la proporción real puede variar según la escena. No representa un dato poblacional.

Las transiciones duran aproximadamente entre 2,7 y 5,5 segundos contando los retrasos. El texto tiene una entrada con opacidad, desplazamiento y desenfoque. La fotografía dispone de una transición de opacidad, aunque queda pendiente revisar que cada cambio de imagen se perciba con suficiente suavidad.

## 7. Interacción y demostración

- Flecha derecha o espacio: avanzar.
- Flecha izquierda: retroceder.
- R: volver a la primera escena.
- F: solicitar pantalla completa.
- Mouse: desplazar localmente los pétalos una vez asentados y observar su reorganización.

Para exponer el proyecto puedo mostrar primero los pétalos dispersos, pasar al anillo cerrado y después a su apertura. Esa secuencia permite explicar cómo una modificación estructural cambia el sentido. Luego puedo comparar comunidad y confianza, mostrar el árbol y terminar con la convergencia de las generaciones.

En cada paso usaré tres preguntas: ¿qué relación existe?, ¿qué cambia?, ¿qué idea comunica ese cambio?

## 8. Evidencia y límites de la validación

| Revisión | Evidencia disponible | Límite |
|---|---|---|
| Formas iniciales | Capturas y observaciones durante la revisión de las escenas. | Demostraron ambigüedades y motivaron el rediseño. |
| Fondos | Fotografías locales y capturas posteriores con fondos visibles. | Falta una revisión final completa en la pantalla de exposición. |
| Movimiento de viento | Implementación y mi respuesta favorable antes de pedir continuidad. | No equivale a una medición de rendimiento. |
| Continuidad | Implementación que utiliza la posición actual de las partículas. | Falta validar visualmente toda la secuencia definitiva. |
| JavaScript | Comprobación sintáctica con `node --check`. | No sustituye una prueba visual ni de interacción. |

No he registrado una prueba final en proyector ni una demostración ante el grupo. Los espacios QR siguen siendo marcadores pendientes de sus enlaces definitivos. Tampoco se incorporó sonido: decidí dejarlo para el final.

## 9. Autoevaluación del estado documentado

Uso los cuatro criterios de la unidad, cada uno con un máximo de 25 puntos. Esta valoración reconoce los pendientes del prototipo y no constituye una calificación del profesor.

| Criterio | Valoración | Justificación |
|---|---:|---|
| Cumplimiento del encargo | 21/25 | La presentación mantiene trece momentos narrativos y dispone de navegación y pantalla completa. Falta la revisión definitiva en pantalla grande y completar los QR. |
| Relaciones estructurales | 20/25 | Puedo relacionar dispersión, núcleos, apertura, ramificación y convergencia con el discurso. Los enlaces son principalmente visuales y algunas formas todavía necesitan mayor claridad. |
| Comportamiento y significado | 21/25 | Las entradas y transformaciones tienen una intención definida. Debo revisar que las oscilaciones permanentes aporten sentido y no compitan con la narración. |
| Explicación y demostración | 20/25 | La gramática, los controles y el recorrido explicativo están documentados. Todavía falta el ensayo completo y la demostración ante el grupo. |
| **Total** | **82/100** | Valoración del estado actual, con aspectos concretos por terminar. |

## 10. Reflexión personal

Al principio tenía más clara la estética que el comportamiento. Quería los pétalos rosados y una atmósfera relacionada con la floración, pero durante el proceso fui viendo que eso por sí solo no explicaba el relevo generacional. Lo importante estaba en cómo se organizaban los elementos y en qué cambiaba entre una escena y otra.

Una de las partes que más revisé fue la diferencia entre lo que se decía que hacía una figura y lo que yo realmente veía. Si me explicaban que había semillas dispersas, pero yo veía una curva, la propuesta todavía no estaba comunicando bien. Lo mismo ocurrió con los círculos, las ondas y las espirales repetidas. Por eso pedí cambios específicos en lugar de aceptar únicamente la explicación del concepto.

También me interesó que la presentación tuviera vida mientras yo hablara. Pedí que los pétalos llegaran como llevados por el viento y después que existiera continuidad entre diapositivas. Ese cambio me parece importante porque permite reconocer que el sistema sigue siendo el mismo, aunque sus relaciones se transformen.

Me quedo con que justificar una decisión de diseño implica comprobar si se percibe. El color puede dar identidad y la tipografía puede organizar la lectura, pero el movimiento necesita mostrar una relación concreta. Una animación puede verse agradable y aun así no explicar lo que yo quiero comunicar.

Si continúo desarrollando el proyecto, mejoraría la claridad de algunas figuras, reduciría el peso de los títulos donde compiten con el sistema y ensayaría toda la presentación en una pantalla grande. También revisaría si las conexiones pueden tener una influencia más directa en el comportamiento de los pétalos. Para mí, el aprendizaje central de esta unidad es que una estructura se convierte en lenguaje cuando sus cambios permiten entender una idea sin depender por completo del texto.

## 11. Materiales consultados

- [Unidad 5: Sistemas de partículas](https://juanferfranco.github.io/simulacion-2026-20/units/unit5/).
- [Guion TED TALK BRASIL](https://docs.google.com/document/d/1VC1B2TqRKKQ7wbiFpc604vRvWvZ3oV-x1zWbgUvx1PM/edit).
- [Ejemplo ForumTEDTALK](https://github.com/juanferfranco/ForumTEDTALK).
- [Recursos visuales del encargo](https://drive.google.com/drive/folders/15gRLhpwspt-6iJp762h8RShex41Fv-yf).

Las fotografías se incluyen como material suministrado para el ejercicio académico; no son fotografías de mi autoría.
