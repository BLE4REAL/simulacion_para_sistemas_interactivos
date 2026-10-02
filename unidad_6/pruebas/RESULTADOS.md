# Verificación del prototipo v2

Fecha local: 27 de septiembre de 2026. Pruebas realizadas por el asistente; no constituyen ensayo musical ni autoevaluación del estudiante.

## Resultado

- 2026-09-28: fallo real de pantalla vacía diagnosticado con posiciones NaN. Regresión añadida: resize 0×0 seguido de pasos de simulación y vuelta a 1280×720; estado permanece finito. Recuperación explícita de coordenadas NaN también comprobada. Versión autónoma con audio incorporado verificada visualmente y mediante reproducción (readyState 4, paused false, sin error).
- 2026-09-28: medido el primer minuto en PCM estéreo 44.1 kHz con ventanas de 20 ms. Datos guardados en `medicion-audio.json`; referencias propuestas en el score requieren confirmación auditiva del estudiante. Ninguna medición se conecta al control del instrumento.
- 2026-09-28: atajos de energía comprobados en navegador (40→60 %, límite 100 %, límite 0 %); R devuelve Corriente y 40 %. Servidor persistente local recuperado y rango de audio probado: HTTP 206, audio/mp4, 32 bytes solicitados/recibidos.
- Sintaxis JavaScript válida.
- 12 escenarios de simulación superados; 1 555 200 actualizaciones comprobadas en conjunto.
- Se verifican finitud, límites espaciales y velocidad ordinaria al terminar el impulso.
- Desde un estado idéntico, el estallido modifica velocidades de agentes afectados; los que quedan fuera del alcance de la onda conservan el resultado base. Se comprueba también el límite local de velocidad durante el impacto.
- Pruebas de ciclo de audio: cierre a 60 segundos siguiendo el reloj del audio, marcas temporales de acciones, bloqueo antes de cargar y cancelación de un inicio pendiente.
- Navegador: archivo `silencio-61s.wav` cargado y reproducido desde cero; detención visible en 01:00 con mensaje «MINUTO COMPLETO» y opción Guardar ensayo habilitada.
- Registro visible: se inició una segunda prueba sin audio, se cambió a Compresión, se disparó un estallido, se cambió a Ruptura y se detuvo manualmente. El registro de cinco eventos se leyó de la interfaz y se guardó como `registro-controles.json`.
- Revisión visual a 1280×720 y 390×844: controles y texto utilizables; visor de vecinos visible. Se restauró el tamaño normal del navegador.
- Guía navegable revisada en el navegador. Captura del instrumento: `../vista-v2.png`.

## Límites

- El navegador integrado no confirmó la descarga automática de un enlace Blob. Se ofrece un diálogo con JSON seleccionable y un enlace explícito de descarga; la lectura/copia del JSON sí quedó verificada. No afirmar que la descarga fue comprobada.
- Prueba inicial con silencio; posteriormente se incorporó el archivo real del usuario y se verificó su reproducción. Metadatos: 213.182404 s, estado preparado y sin error. Se observó detención en 01:00 y audio pausado en 60.008655 s (resolución del ciclo de pantalla). Esto verifica reproducción/corte, no una interpretación musical ni una escucha analítica del asistente.
- Falta revisar rendimiento y sonido en el equipo/proyector de presentación, validar estética con el usuario y ensayar el score musical.
- No hay nota de autoevaluación asignada ni publicación remota.

## Repetir pruebas numéricas

Desde la carpeta `unidad_6`, ejecutar `node verify.cjs`. No necesita dependencias externas.

## Versión 3 · 2026-09-29
Pruebas Physarum superadas: 14 000 agentes, horizontal y vertical, tres modos, energía extrema, rastro finito/no negativo y onda local (216 agentes cambiaron; 13 784 exteriores conservaron la misma actualización). Pruebas anteriores de flocking y audio superadas. Navegador: red visible, cambios 1/2/3 y estallido, reproducción real, corte MINUTO COMPLETO en 01:00 y R listo en 00:00. Sin errores de consola observados. Capturas vista-physarum.png y vista-physarum-estallido.png. No equivale a ensayo musical del estudiante ni certifica rendimiento en el equipo de presentación.

## Optimización de fluidez · 30 de septiembre

El usuario reportó tirones, especialmente en navegador grande. Se conservan 14 000 agentes Physarum y 720 de flocking. Se eliminó la recuperación de hasta cinco pasos/dibujos por cuadro: ahora como máximo se ejecuta uno, conservando la fracción de tiempo residual. En equipos lentos la simulación puede avanzar más despacio, pero el audio y su corte siguen su propio reloj. Las pestañas ocultas no calculan la simulación.

El brillo se desenfoca en una superficie de 320 columnas, se limita el lienzo de salida a 1600 píxeles en su lado mayor y se simplifica la difusión. El arranque precalcula 12 pasos en lugar de 85, por lo que la red se desarrolla a la vista. La etiqueta FLUIDA identifica esta revisión. Prueba local orientativa: 6.63 ms por actualización en una muestra de 30, viewport 1062×1244. No es una garantía de FPS en otros navegadores ni una comparación controlada con idéntica red. Respaldo en respaldo-rendimiento/.

## Revisión LIGERA · 30 de septiembre

Por persistencia de tirones se redujo Physarum de 14 000 a 6000 agentes y flocking de 720 a 360. La señal depositada por cada agente Physarum se multiplica por 14000/6000 para mantener la cantidad total esperada de rastro. Se conserva grilla, sensores, difusión, evaporación y colores. Esto conserva el mecanismo y la estética general; no garantiza idénticas formas emergentes ni densidad local exacta.

Pruebas superadas: 12 escenarios de flocking (777 600 actualizaciones), estabilidad y localidad de Physarum, ciclo de audio y suspensión en pestaña oculta. Prueba orientativa en navegador a 1280×720: 4.44 ms por actualización ordinaria y 5.87 ms en muestra con estallido; no son FPS garantizados en otro navegador. Vista comprobada y guardada en vista-ligera.png. Pendiente confirmación del usuario en pantalla completa. Recargar hasta ver LIGERA.

## Revisión IMPACTO · 30 de septiembre

Aprobada por el usuario tras mejorar la fluidez. Conserva 6000 agentes de rastro y 360 auxiliares. Corriente aumenta la velocidad base; Compresión reduce velocidad al 55 %, amplía la apertura sensorial y aumenta depósito para acumular señal. Ruptura invierte la preferencia de sensores hacia zonas de menor rastro, acelera movimiento y evaporación. No agrega trayectorias globales ni conducción automática por música.

La onda manual activa un impulso local que conserva el 90 % por paso después de abandonar la onda; ese estado aumenta el desplazamiento y la longitud de estela, y decae sin afectar a agentes no alcanzados. Durante el impulso se reduce la respuesta al rastro para evitar que frene inmediatamente la descarga. Ruptura dibuja además un tercio de agentes como trazos móviles, manteniendo legibilidad cuando el campo se dispersa.

Pruebas numéricas y audio superadas; localidad de onda comprobada (2483 afectados y 3517 exteriores con actualización idéntica al control en esa muestra). Revisión visual de controles realizada. La mayor fuerza expresiva requiere ensayo con la canción; no se presenta como interpretación musical ya validada.

## TRANSICIONES · 2026-10-02
verify.cjs y verify-physarum.cjs superados tras corregir giro sensorial y retirar gradiente: 777600 pasos de flocking; audio, gestos manuales y suspensión verificados; 2721 agentes afectados por onda y 3278 exteriores sin diferencia en la muestra. Transición Ruptura→Compresión conserva >90 % de velocidad en el primer paso y converge sin detenerse (3.761→1.862 unidades/paso). Revisión visual sostenida muestra red violeta conectada. Captura vista-transiciones.png. Sin validación auditiva de los acentos ni ensayo personal.

GESTOS: comprobación de teclado real Q/W/E en navegador superada; estados/energía y estallido visibles. Regresión verify.cjs superada. Captura vista-gestos.png. Causa del fallo reportado no confirmada en navegador del usuario.
