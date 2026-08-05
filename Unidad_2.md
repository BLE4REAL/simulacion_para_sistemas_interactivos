# Proyecto: Protección vs. Destrucción


Mi primera idea era que existiera un núcleo que debía ser protegido y un grupo de partículas encargadas de defenderlo de otras partículas que representaban una amenaza.

## Primera versión

<img width="1242" height="1096" alt="image" src="https://github.com/user-attachments/assets/e48bbd58-c7c2-48b7-8ab5-3a513dd3bf5f" />

La primera versión era bastante sencilla.

Había un núcleo en el centro, un grupo de protectores que lo seguían constantemente y unos perturbadores que aparecían desde los bordes.

En esta etapa el comportamiento era muy básico porque los protectores simplemente perseguían el núcleo y los perturbadores intentaban acercarse.

Visualmente funcionaba, pero al observar la simulación me di cuenta de que realmente no estaba comunicando la contradicción que quería representar.

Parecía más una simulación de seguimiento que un sistema generativo.


<img width="1238" height="1094" alt="image" src="https://github.com/user-attachments/assets/fd4531cc-ddcd-4fb5-bb95-36fba672bec7" />
## Primeros problemas encontrados

Durante las primeras pruebas aparecieron varios problemas.

Los protectores terminaban agrupándose demasiado sobre el núcleo.

En otras ocasiones la fuerza de repulsión hacía que todos salieran disparados hacia los bordes de la pantalla.

También observé que los perturbadores casi no influían en el comportamiento general, por lo que su presencia no modificaba realmente el sistema.

En ese momento comprendí que no bastaba con cambiar parámetros como la velocidad o la fuerza. El problema estaba en las reglas de interacción.

## Cambio de enfoque

Después de varias pruebas decidí dejar de pensar en trayectorias y comenzar a pensar en relaciones entre partículas.

La intención pasó a ser construir un sistema donde el comportamiento surgiera únicamente de reglas locales.

En lugar de hacer que todas las partículas siguieran directamente al núcleo, empecé a trabajar con relaciones de atracción, repulsión y distancias de interacción, buscando un comportamiento más cercano a Particle Life.

## Rediseño del sistema

Decidí reorganizar completamente el proyecto.

En vez de escribir condiciones independientes para cada tipo de partícula, construí una matriz de relaciones donde cada población define cómo interactúa con las demás.

Esto permitió que el comportamiento fuera mucho más fácil de controlar y modificar.

También incorporé:

velocidades máximas,
aceleración,
fricción,
radios de interacción,
variabilidad entre ejecuciones,
ruido para hacer el movimiento más orgánico.

Cada ejecución comenzó a producir resultados diferentes sin perder la identidad del sistema.

## Organización de los protectores

Uno de los cambios más importantes fue modificar el comportamiento de los protectores.

Inicialmente todos perseguían directamente al núcleo.

Después cambié esta lógica para que intentaran mantener una distancia determinada alrededor de él.

Esto permitió formar un anillo estable que podía reorganizarse cuando aparecían amenazas.

Este cambio hizo que el comportamiento fuera mucho más emergente y menos predecible.

##Contradicción incorporada en las reglas

Uno de los objetivos principales era que la contradicción no dependiera únicamente del color de las partículas.

Por esa razón diseñé las reglas para que el peligro no proviniera directamente de los perturbadores.

Cuando aparecen amenazas, los protectores intentan reorganizarse para defender el núcleo.

Sin embargo, al concentrarse demasiado y cerrar completamente el anillo terminan ejerciendo presión sobre aquello que intentan proteger.

De esta manera la destrucción aparece como consecuencia de las propias reglas del sistema y no porque exista una animación programada.

## Cambios visuales

También hice varias modificaciones en la parte visual.

Añadí halos luminosos, estelas y diferentes colores para distinguir las poblaciones.

Aunque estos elementos ayudan a comprender la simulación, procuré que la contradicción no dependiera únicamente de ellos sino del comportamiento del sistema.

## Interacción

Inicialmente la interacción con el mouse hacía aparecer una amenaza similar a un perturbador.

Después decidí cambiar este comportamiento.

Ahora, al hacer clic, el usuario crea temporalmente un nuevo núcleo de atracción.

Con este cambio el usuario no controla directamente las partículas, sino que modifica las relaciones del sistema, permitiendo observar nuevas reorganizaciones sin romper la lógica generativa.

## Descartes

Durante el desarrollo descarté varias ideas.

Una de ellas fue hacer que todos los protectores persiguieran siempre a los perturbadores, ya que esto producía movimientos demasiado caóticos y eliminaba la estructura del sistema.

También descarté utilizar trayectorias programadas manualmente porque el objetivo de la unidad era construir un comportamiento emergente y no una animación fija.

Otra idea descartada fue controlar completamente las explosiones mediante temporizadores. Finalmente preferí que aparecieran como consecuencia del estado del sistema y de las reglas establecidas.



<img width="1239" height="1093" alt="image" src="https://github.com/user-attachments/assets/7cb7766a-33ea-4bb9-9d9b-a47c629a7622" />

| **Criterio**                                                                      | **Peso** | **Valoración** | **Aporte**                                                                                                   |
| --------------------------------------------------------------------------------- | :------: | :------------: | ------------------------------------------------------------------------------------------------------------ |
| La intención es clara y perceptible en el comportamiento.                         |    20%   |    5   | La contradicción entre protección y destrucción se entiende a través del comportamiento de las partículas.   |
| Los tipos, cantidades, matriz y parámetros están justificados desde la intención. |    25%   |    5   | Cada tipo de partícula y sus relaciones fueron definidos para reforzar la idea principal del proyecto.       |
| Comprendo y puedo modificar el funcionamiento técnico del sistema.                |    20%   |    5  | Entiendo cómo funciona el sistema y pude modificar reglas, parámetros e interacciones durante el desarrollo. |
| El sistema produce variaciones con una identidad reconocible.                     |    15%   |    5   | Cada ejecución es diferente, pero siempre mantiene el mismo comportamiento general.                          |
| Experimenté, comparé, seleccioné y descarté con criterios claros.                 |    10%   |      4    | Probé diferentes soluciones y descarté las que no representaban bien la intención del proyecto.              |
| Puedo distinguir y sustentar lo diseñado y lo emergente.                          |    10%   |   5  | Las reglas fueron diseñadas por mí, mientras que el comportamiento surge de la interacción entre ellas.      |


