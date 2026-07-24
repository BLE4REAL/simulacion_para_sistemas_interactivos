# Bitácora de desarrollo

## 1. Intención conceptual de cada momento

Desde el inicio quise representar un cielo lleno de faroles flotando de una forma que no pareciera una simple animación, sino un sistema que estuviera vivo y cambiando constantemente. La idea principal era que cada farol siguiera un recorrido diferente, dejando una estela que mostrara el camino que había recorrido y que, poco a poco, fuera construyendo patrones generativos.

Después de lograr el movimiento básico, empecé a buscar que el comportamiento se sintiera más natural. En ese momento incorporé pequeñas variaciones en la velocidad, cambios de dirección y movimientos más suaves para que no pareciera que todos los faroles seguían exactamente la misma trayectoria.

Más adelante la intención pasó a ser mostrar cómo los faroles podían interactuar entre sí. Por eso añadí un sistema de repulsión para evitar que todos ocuparan el mismo espacio y, además, un efecto visual que resaltara cuando dos faroles se acercaban, iluminando sus estelas y generando pequeños destellos.

Finalmente quise que el espectador también pudiera influir en la experiencia. Para lograrlo implementé la interacción con el mouse, que genera una corriente de aire alrededor del cursor y modifica el recorrido de los faroles sin llegar a controlar completamente el sistema. La intención era que el usuario sintiera que hace parte del entorno y no que simplemente mueve objetos en la pantalla.

## 2. Experimentos y versiones intermedias

Al principio todos los faroles aparecían desde el mismo punto, lo que hacía que el inicio fuera demasiado uniforme.
<img width="1233" height="1092" alt="Captura de pantalla 2026-07-24 103337" src="https://github.com/user-attachments/assets/57f13d4c-8c78-407b-90c8-07d71df9a4bd" />

Después probé hacer que aparecieran desde cualquier parte del borde inferior utilizando una distribución uniforme y, finalmente, combiné esa distribución con una distribución gaussiana para que la mayoría apareciera cerca del centro, pero algunos surgieran desde otras zonas de la pantalla.
<img width="1234" height="1092" alt="Captura de pantalla 2026-07-24 103454" src="https://github.com/user-attachments/assets/5674983a-87de-4655-9bf6-308e8e97fbb2" />

También experimenté con diferentes tipos de movimiento. Inicialmente el desplazamiento horizontal era muy pequeño, luego aumenté la intensidad del viento y posteriormente incorporé ruido Perlin para evitar movimientos completamente aleatorios y conseguir trayectorias más fluidas. Otro experimento importante fue la estela. Al comienzo era simplemente una línea delgada que permanecía visible demasiado tiempo. Más adelante implementé un sistema de desvanecimiento progresivo, reduje su grosor y finalmente añadí diferentes tipos de estelas dependiendo del comportamiento de cada farol.

También realicé varias pruebas con la interacción entre los faroles, ajustando continuamente la distancia a la que comenzaban a influenciarse entre sí, la intensidad de la repulsión y la frecuencia con la que aparecían los destellos luminosos.

<img width="1229" height="1088" alt="Captura de pantalla 2026-07-24 103541" src="https://github.com/user-attachments/assets/57545840-59c5-49e8-a942-88b0a403a4dd" />

## 3. Decisiones tomadas y alternativas descartadas

Durante el desarrollo tomé varias decisiones que cambiaron el resultado final.

Inicialmente pensé en que todos los faroles dejaran exactamente la misma estela, pero finalmente decidí crear una pequeña proporción de faroles especiales que generan una estela morada más brillante y presentan un comportamiento diferente al resto.

También consideré hacer que el mouse actuara como un escudo completamente visible, pero finalmente descarté esa idea porque rompía la estética del proyecto. En su lugar implementé una corriente de aire invisible que modifica el movimiento de los faroles y evita que puedan atravesar el cursor.

Otra alternativa descartada fue utilizar movimientos completamente aleatorios. Aunque al principio parecía interesante, el resultado era poco natural. Finalmente opté por combinar aleatoriedad con ruido Perlin, obteniendo movimientos mucho más suaves y orgánicos.

También decidí que las estelas no permanecieran indefinidamente. En lugar de eso implementé un sistema donde aparecen progresivamente, permanecen visibles algunos segundos y luego desaparecen para dar paso a nuevas figuras generativas.

## 4. Dificultades y soluciones

Una de las principales dificultades fue lograr que el movimiento de los faroles se sintiera natural. En varias ocasiones el desplazamiento lateral era demasiado brusco o demasiado uniforme. Para solucionarlo fui ajustando poco a poco las velocidades máximas, el ruido Perlin y las fuerzas aplicadas a cada farol.

Otra dificultad fue conseguir que las estelas se vieran llamativas sin saturar la escena. Después de varias pruebas terminé utilizando diferentes niveles de brillo, desvanecimiento progresivo y distintos colores según el tipo de interacción que estuviera ocurriendo.

También tuve dificultades para mantener un flujo constante de faroles. Inicialmente aparecían todos al mismo tiempo y luego la pantalla quedaba vacía hasta que terminaban de subir. Finalmente solucioné el problema reciclando los faroles cuando abandonan la parte superior de la pantalla y asignando tiempos de aparición diferentes para cada uno.

Finalmente fue necesario ajustar muchas veces la intensidad de la interacción entre los faroles y el usuario para encontrar un equilibrio donde la influencia del mouse fuera evidente, pero sin perder el comportamiento autónomo del sistema.
