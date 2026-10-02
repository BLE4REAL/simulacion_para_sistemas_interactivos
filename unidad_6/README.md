# Sobrecarga · Unidad 6

Trabajo individual para el primer minuto de Pump It, Black Eyed Peas. Entrega: 2 de octubre de 2026. Revisión vigente: TRANSICIONES (v4).

## Uso

Abrir Sobrecarga.html en navegador habitual. Incorpora canción, estilos y código. Mantener guia.html junto al instrumento para consultar la guía. En la vista HTTP temporal, recargar después de actualizar. La etiqueta TRANSICIONES identifica esta revisión.

| Control | Efecto |
| --- | --- |
| Q / Impulso | Corriente + energía 60 % |
| W / Acumular | Compresión + energía 70 % |
| E / Descargar | Ruptura + energía 85 % + un estallido |
| 1 / 2 / 3 | Solo el modo |
| Espacio | Onda local desde cursor o centro visual |
| ↑ / ↓ o deslizador | Energía |
| Mouse sostenido | Atracción local, radio 240 px |
| P | Iniciar/detener audio; corte a 60 s |
| R | Reiniciar agentes y rastro; Corriente al 40 % |
| F / H / D | Pantalla completa / ocultar controles / percepción flocking |
| Guardar ensayo | Registro JSON visible y descargable de acciones y tiempos |

Los gestos se activan una vez y sostienen el estado hasta otra decisión. No hay secuencia musical automática ni análisis de audio durante el performance.

## Modelo vigente

6000 agentes Physarum guardan posición, orientación e impulso local. Tres sensores leen un campo común de rastro que se deposita, difunde y evapora. En Compresión, sensores más lejanos, giros menores y mayor difusión reúnen el rastro en filamentos gruesos; la saturación modera el atractivo y el depósito en nudos densos. Corriente favorece continuidad; Ruptura evita señales densas y evapora más rápido. No se prescribe una figura global ni hay líder.

360 agentes adicionales usan alineación, cohesión y separación con vecinos a 48–62 px y muestrean un campo de flujo en su posición. D muestra esta población; el radio coincide con la mezcla real de reglas.

Cada cambio mezcla reglas, velocidad del Physarum y color con una constante de 0.4 s (aproximadamente 1.2 s para 95 %). Conserva posiciones y orientaciones; no reinicia al cambiar modo. Una onda local activa un impulso que decae en los agentes afectados.

La salida se limita a 1600 px en su lado mayor, el brillo se calcula en una superficie pequeña y se ejecuta como máximo un paso por cuadro. Las pestañas ocultas no calculan agentes. La simulación puede avanzar más despacio si el equipo pierde cuadros; el audio conserva su propio reloj.

## Archivos y comprobación

Fuentes: index.html, style.css, app.js, physarum.js. Regenerar autónomo con node build-portable.cjs. Servidor local opcional: node server.cjs (127.0.0.1:4176). Pruebas: node verify.cjs y node verify-physarum.cjs. Score: SCORE.md. Bitácora: BITACORA.md. Evidencias: pruebas/RESULTADOS.md. Respaldo previo: respaldo-impacto/.

Pendientes personales: ensayo musical, reflexión, autoevaluación y publicación. Los registros de prueba del asistente no representan un ensayo del estudiante.


Revisión PRESIÓN: mantén Espacio hasta 1.4 s y suelta para descargar de 1× a 2×. Incluye acercamiento y sacudida breve; sin nuevos agentes. Un toque o E conserva descarga inmediata. Perder foco cancela la carga.
Versión pública: la canción se carga localmente con Cargar canción; el repositorio no incluye audio. Sobrecarga.html usa los archivos de esta carpeta.
