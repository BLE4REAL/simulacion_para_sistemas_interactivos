http://localhost:5173
| **Criterio**                                  | **Peso** | **Qué debe demostrar la evidencia**                                                                                                                                                                                                                                                                    | **Valoración** |
| --------------------------------------------- | -------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------: |
| **Trazabilidad y comprensión del sistema**    |       25 | Puedo señalar y explicar estado, fuerzas, integración, render y controles; además puedo ubicar qué partes produjo o modificó la IA.                                                                                                                                                                    |        **4.8** |
| **Verificación del algoritmo de fuerzas**     |       25 | Estudié en detalle el proyecto y aunque no comprenda toda la sintaxis, puedo identificar su arquitectura, sus partes, puedo aislar una fuerza central, formular una predicción, ejecutarla y analizarla, comparar el resultado, cambiar deliberadamente un signo o parámetro y explicar la diferencia. |        **4.7** |
| **Diseño de fuerzas e intención**             |       20 | Las fuerzas y sus parámetros hacen perceptible una intención; el comportamiento surge de la dinámica y no de trayectorias previamente dibujadas.                                                                                                                                                       |        **4.7** |
| **Instrumento, score e interpretación**       |       15 | El score conecta la escucha con decisiones; escogí pocos controles expresivos y puedo conducir el sistema en vivo sin que el audio lo controle automáticamente.                                                                                                                                        |        **4.6** |
| **Experimentación y criterio frente a la IA** |       10 | Comparé alternativas, registré hallazgos y descartes, corregí propuestas de IA y puedo justificar por qué conservé la versión presentada.                                                                                                                                                              |        **4.8** |
| **Entrega técnica y documentación**           |        5 | La URL pública abre; la bitácora permite verificar el proceso.                                                                                                                                                                                                                                         |        **4.6** |
| **Total**                                     |  **100** |                                                                                                                                                                                                                                                                                                        |  **4.7 / 5.0** |

# Prompts utilizados durante el desarrollo

## 1. Comprensión y auditoría del proyecto existente

> Analiza primero la estructura existente del proyecto y lee los archivos `src/main.js`, `src/simulation/createSimulation.js`, `src/simulation/parameters.js`, `src/interaction/keyboardControls.js`, `src/ui/labPanel.js` y `src/styles.css`.
>
> No hagas modificaciones todavía. Explícame qué responsabilidad tiene cada archivo, cómo se conectan entre sí, cómo se actualizan las partículas, dónde se calculan y aplican las fuerzas, cómo funciona la integración, cómo se conectan los controles y cómo se comunica todo con el render.
>
> Identifica también qué partes fueron diseñadas para experimentar en LAB y cuáles forman parte de la ejecución principal. Después señala cuáles serían los puntos adecuados para introducir una nueva fuerza sin reescribir innecesariamente la arquitectura existente.

**Decisión:** este prompt fue importante porque permitió priorizar la comprensión del sistema antes de pedir cambios a la IA.

---

## 2. Diseñar una fuerza a partir de una intención

> Quiero diseñar una fuerza que permita expresar visualmente la idea de **tensión y acumulación** durante la interpretación de la pieza.
>
> No quiero una animación predeterminada ni controlar directamente las posiciones de las partículas. Propón una fuerza o combinación mínima de fuerzas cuya dinámica pueda producir ese comportamiento de manera emergente.
>
> Explica matemáticamente qué hace la fuerza, en qué dirección actúa, qué parámetros necesita, cuáles son sus límites y qué debería observar si aumento o reduzco cada parámetro.
>
> Antes de combinarla con otras fuerzas, quiero poder aislarla y probarla individualmente.

**Decisión:** se priorizó que la intención artística pudiera relacionarse directamente con una propiedad física del sistema.

---

## 3. Formular una predicción antes de experimentar

> Antes de modificar el código, formula una predicción concreta sobre el comportamiento de la fuerza.
>
> Explica qué debería ocurrir si aumento su magnitud, si cambio su signo y si reduzco su influencia. Describe qué debería observar en las partículas y por qué.
>
> Después implementa únicamente la modificación necesaria para probar esa hipótesis y compara el comportamiento observado con la predicción inicial.

**Decisión:** este prompt permitió convertir la implementación en un experimento verificable.

---

## 4. Probar deliberadamente el signo de una fuerza

> Aísla la fuerza que estamos estudiando y realiza una prueba cambiando deliberadamente el signo de su magnitud.
>
> Antes de ejecutar, explica qué comportamiento esperas con el signo original y qué comportamiento debería aparecer con el signo invertido.
>
> Después compara ambos resultados y explica por qué el comportamiento cambia. No te limites a describir visualmente el resultado; relaciónalo con la dirección del vector de fuerza y con la actualización de velocidad y posición.

**Decisión:** esta prueba permite demostrar que el efecto visual está relacionado con la lógica matemática de la fuerza y no con una animación arbitraria.

---

## 5. Diseñar controles con significado expresivo

> Quiero que el sistema pueda ser interpretado en tiempo real mediante pocos controles.
>
> Propón únicamente los parámetros que realmente tengan potencial expresivo. Cada control debe corresponder a una intención clara que pueda surgir mientras escucho la música, como acumulación, tensión, dispersión, cohesión, ruptura o estabilidad.
>
> Para cada control explica: qué intención representa, qué parámetro modifica, qué fuerza afecta y qué comportamiento emergente debería producir.
>
> No agregues controles simplemente porque técnicamente sean posibles.

**Decisión:** se buscó que cada control pudiera justificarse tanto desde el diseño como desde la dinámica.

---

## 6. Evitar que el sistema se convierta en un music visualizer

> El audio NO debe controlar automáticamente la simulación. No utilices amplitud, BPM, beat detection, FFT, kick u otras características del audio como mecanismo principal para modificar las partículas.
>
> La relación debe ser:
>
> `escucha → percepción humana → decisión → control → fuerza → comportamiento emergente`
>
> Diseña la interacción de modo que yo pueda escuchar la pieza, decidir qué intención quiero expresar y modificar manualmente el sistema en tiempo real.

**Decisión:** se descartó cualquier solución en la que el audio activara automáticamente el comportamiento visual.

---

## 7. Conectar el score con el sistema

> Ayúdame a construir un score visual para `LesAlpx` que no indique posiciones exactas de las partículas.
>
> Quiero representar estados e intenciones como acumulación, tensión, estabilidad, transición, ruptura, dispersión, reorganización, transformación y resolución.
>
> Para cada sección relevante, relaciona la intención con una decisión interpretativa y posteriormente con los controles o fuerzas que podría utilizar.
>
> El score debe funcionar como una guía de interpretación, no como una animación previamente definida.

**Decisión:** el score se utiliza como puente entre la escucha y la manipulación manual del instrumento.

---

## 8. Pedir modificaciones localizadas a la IA

> No reescribas el proyecto completo.
>
> Indica primero qué archivo necesita modificarse, por qué ese archivo es el lugar adecuado y cuál será exactamente la responsabilidad de la modificación.
>
> Conserva la arquitectura existente y realiza únicamente los cambios necesarios para incorporar la nueva fuerza o control.
>
> Después explícame qué líneas o funciones fueron modificadas y cómo se conectan con el resto del sistema.

**Decisión:** este criterio ayuda a documentar qué partes fueron propuestas por la IA y cuáles fueron modificadas deliberadamente.


