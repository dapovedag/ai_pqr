"""
Plantillas de respuestas para PQRs por tipo y categoría.
Usadas para entrenar el sistema y como base para sugerencias de Groq.
"""

RESPONSE_TEMPLATES = {
    "peticion": {
        "servicios_publicos": [
            """Estimado(a) usuario(a):

Reciba un cordial saludo de parte de la Empresa de Servicios Públicos.

En atención a su petición radicada, le informamos que hemos procedido a verificar la información solicitada en nuestros sistemas.

{respuesta_especifica}

Quedamos atentos a cualquier inquietud adicional que pueda surgir.

Atentamente,
Oficina de Atención al Usuario""",

            """Apreciado(a) ciudadano(a):

Agradecemos su comunicación con nuestra entidad.

Respecto a la información solicitada, le comunicamos que:

{respuesta_especifica}

Para mayor información, puede comunicarse a nuestra línea de atención {telefono} o visitarnos en nuestras oficinas.

Cordialmente,
Servicio al Cliente""",
        ],
        "banca": [
            """Estimado(a) cliente:

Reciba un cordial saludo de {banco}.

En respuesta a su solicitud, le informamos que hemos procesado su requerimiento satisfactoriamente.

{respuesta_especifica}

Recuerde que puede realizar consultas y transacciones a través de nuestra App móvil y portal web las 24 horas.

Atentamente,
Servicio al Cliente""",

            """Apreciado(a) usuario(a):

Gracias por comunicarse con nosotros.

Con relación a su petición, le informamos:

{respuesta_especifica}

Estamos para servirle.

Cordialmente,
{banco}""",
        ],
        "salud": [
            """Estimado(a) afiliado(a):

Reciba un cordial saludo de su EPS.

En atención a su solicitud, le comunicamos que hemos dado trámite a su requerimiento.

{respuesta_especifica}

Recuerde que puede consultar el estado de sus autorizaciones a través de nuestra página web o App.

Atentamente,
Servicio al Afiliado""",
        ],
        "telecomunicaciones": [
            """Estimado(a) cliente:

Gracias por comunicarse con {operador}.

Respecto a su solicitud, le informamos:

{respuesta_especifica}

Para cualquier consulta adicional, estamos disponibles las 24 horas en nuestra línea de atención.

Cordialmente,
Servicio al Cliente""",
        ],
        "transporte": [
            """Estimado(a) ciudadano(a):

Reciba un cordial saludo de la Secretaría de Movilidad.

En respuesta a su petición, le informamos:

{respuesta_especifica}

Para más información, puede consultar nuestra página web o acercarse a nuestros puntos de atención.

Atentamente,
Secretaría de Movilidad""",
        ],
        "comercio": [
            """Estimado(a) cliente:

Agradecemos su preferencia y confianza en {empresa}.

Con relación a su solicitud, le comunicamos:

{respuesta_especifica}

Esperamos seguir contando con su preferencia.

Cordialmente,
Servicio al Cliente""",
        ],
        "educacion": [
            """Estimado(a) estudiante:

Reciba un cordial saludo de la {institucion}.

En atención a su solicitud, le informamos:

{respuesta_especifica}

Para mayor información, puede acercarse a la oficina de Registro y Control.

Atentamente,
Registro Académico""",
        ],
        "gobierno": [
            """Estimado(a) ciudadano(a):

Reciba un cordial saludo de {entidad}.

En respuesta a su derecho de petición, le comunicamos:

{respuesta_especifica}

Este documento se expide en cumplimiento del artículo 23 de la Constitución Política.

Atentamente,
{entidad}""",
        ],
    },
    "queja": {
        "servicios_publicos": [
            """Estimado(a) usuario(a):

Lamentamos profundamente los inconvenientes causados por la situación que nos reporta.

Hemos tomado las siguientes acciones correctivas:

{acciones_tomadas}

Nos comprometemos a mejorar nuestros servicios para evitar que esta situación se repita.

Agradecemos su paciencia y comprensión.

Atentamente,
Oficina de Quejas y Reclamos""",

            """Apreciado(a) ciudadano(a):

Recibimos su queja y entendemos su inconformidad.

Le informamos que:

{acciones_tomadas}

Su retroalimentación es muy valiosa para mejorar nuestros servicios.

Cordialmente,
Servicio al Usuario""",
        ],
        "banca": [
            """Estimado(a) cliente:

Lamentamos la situación que nos describe y agradecemos que nos la haya comunicado.

Tras revisar su caso, le informamos:

{acciones_tomadas}

Nos comprometemos a brindarle una mejor experiencia en el futuro.

Atentamente,
Defensoría del Cliente""",
        ],
        "salud": [
            """Estimado(a) afiliado(a):

Lamentamos los inconvenientes que ha experimentado con nuestros servicios.

Hemos tomado las siguientes medidas:

{acciones_tomadas}

Trabajamos constantemente para mejorar la calidad de nuestra atención.

Atentamente,
Oficina de Atención al Usuario""",
        ],
        "telecomunicaciones": [
            """Estimado(a) cliente:

Lamentamos sinceramente las molestias ocasionadas.

Le informamos las acciones tomadas:

{acciones_tomadas}

Agradecemos su paciencia mientras trabajamos en mejorar nuestro servicio.

Cordialmente,
Soporte al Cliente""",
        ],
        "transporte": [
            """Estimado(a) ciudadano(a):

Agradecemos que nos haya comunicado esta situación.

Le informamos que:

{acciones_tomadas}

Su queja nos ayuda a mejorar el servicio de transporte de la ciudad.

Atentamente,
Secretaría de Movilidad""",
        ],
        "comercio": [
            """Estimado(a) cliente:

Lamentamos la experiencia negativa que tuvo en nuestro establecimiento.

Hemos procedido a:

{acciones_tomadas}

Esperamos poder resarcir esta situación y recuperar su confianza.

Cordialmente,
Servicio al Cliente""",
        ],
        "educacion": [
            """Estimado(a) estudiante/acudiente:

Agradecemos que nos haya comunicado esta situación.

Le informamos las medidas tomadas:

{acciones_tomadas}

Trabajamos por ofrecer educación de calidad.

Atentamente,
Rectoría""",
        ],
        "gobierno": [
            """Estimado(a) ciudadano(a):

Agradecemos su comunicación que nos permite mejorar nuestros servicios.

En atención a su queja:

{acciones_tomadas}

Estamos comprometidos con la transparencia y el buen servicio.

Atentamente,
{entidad}""",
        ],
    },
    "reclamo": {
        "servicios_publicos": [
            """Estimado(a) usuario(a):

En atención a su reclamo, le comunicamos que hemos realizado la revisión correspondiente.

Resultado de la investigación:

{resultado_investigacion}

{solucion_propuesta}

Si no está conforme con esta respuesta, puede interponer recurso de reposición en los próximos 10 días hábiles.

Atentamente,
Oficina de PQR""",
        ],
        "banca": [
            """Estimado(a) cliente:

Tras analizar su reclamo, le informamos los resultados de nuestra investigación:

{resultado_investigacion}

Solución:

{solucion_propuesta}

Si requiere mayor información, no dude en contactarnos.

Atentamente,
Defensoría del Consumidor Financiero""",
        ],
        "salud": [
            """Estimado(a) afiliado(a):

En respuesta a su reclamo, le comunicamos:

{resultado_investigacion}

Procedemos a:

{solucion_propuesta}

Puede interponer recurso ante la Superintendencia de Salud si lo considera pertinente.

Atentamente,
Oficina de Atención al Usuario""",
        ],
        "telecomunicaciones": [
            """Estimado(a) cliente:

Tras revisar su reclamo, encontramos:

{resultado_investigacion}

En consecuencia:

{solucion_propuesta}

Puede escalar su caso ante la CRC si no está satisfecho con esta respuesta.

Cordialmente,
Área de Reclamaciones""",
        ],
        "transporte": [
            """Estimado(a) ciudadano(a):

En atención a su reclamo:

{resultado_investigacion}

Resolución:

{solucion_propuesta}

Puede interponer recurso de reposición dentro de los 5 días siguientes.

Atentamente,
Secretaría de Movilidad""",
        ],
        "comercio": [
            """Estimado(a) cliente:

Tras analizar su reclamo:

{resultado_investigacion}

Ofrecemos la siguiente solución:

{solucion_propuesta}

Esperamos que esta solución sea de su satisfacción.

Cordialmente,
Servicio Postventa""",
        ],
        "educacion": [
            """Estimado(a) estudiante:

En respuesta a su reclamo:

{resultado_investigacion}

Decisión:

{solucion_propuesta}

Puede apelar esta decisión ante el Consejo Académico.

Atentamente,
Secretaría Académica""",
        ],
        "gobierno": [
            """Estimado(a) ciudadano(a):

Tras analizar su reclamo administrativo:

{resultado_investigacion}

Resolución:

{solucion_propuesta}

Contra esta decisión proceden los recursos de ley.

Atentamente,
{entidad}""",
        ],
    },
    "sugerencia": {
        "general": [
            """Estimado(a) ciudadano(a):

Agradecemos enormemente su valiosa sugerencia.

Su propuesta ha sido remitida al área de Mejora Continua para su evaluación y posible implementación.

Comentarios preliminares:

{evaluacion_sugerencia}

Sugerencias como la suya nos ayudan a mejorar nuestros servicios.

Atentamente,
Oficina de Calidad""",

            """Apreciado(a) usuario(a):

Gracias por tomarse el tiempo de compartir su sugerencia con nosotros.

Hemos registrado su propuesta y será considerada en nuestro próximo comité de mejoramiento.

{evaluacion_sugerencia}

Su participación es fundamental para nuestra mejora continua.

Cordialmente,
Área de Experiencia del Usuario""",
        ],
    },
}

# Variables para personalizar respuestas
RESPONSE_VARIABLES = {
    "respuesta_especifica": [
        "La información solicitada se encuentra disponible en nuestro portal web.",
        "Su solicitud ha sido procesada y recibirá respuesta en los próximos 5 días hábiles.",
        "Le adjuntamos el documento solicitado para su consulta.",
        "El trámite ha sido aprobado satisfactoriamente.",
    ],
    "acciones_tomadas": [
        "Se ha realizado visita técnica para verificar la situación reportada.",
        "Se ha iniciado proceso disciplinario al funcionario involucrado.",
        "Se han implementado medidas correctivas inmediatas.",
        "Se ha priorizado la atención de su caso en nuestro sistema.",
    ],
    "resultado_investigacion": [
        "Tras revisar los registros, confirmamos que efectivamente hubo un error en el proceso.",
        "La investigación determinó que su reclamo es procedente.",
        "Se verificó la información y se encontró inconsistencia en nuestros sistemas.",
        "El análisis del caso confirma lo expuesto en su comunicación.",
    ],
    "solucion_propuesta": [
        "Se procederá al reembolso del valor cobrado indebidamente en los próximos 10 días hábiles.",
        "Se realizará la corrección solicitada de manera inmediata.",
        "Se aplicará el descuento correspondiente en su próxima factura.",
        "Se ha generado orden de servicio para atender su requerimiento.",
    ],
    "evaluacion_sugerencia": [
        "Su propuesta es viable y será evaluada para su implementación en el corto plazo.",
        "La sugerencia será presentada en el próximo comité directivo.",
        "Consideramos que su idea puede aportar significativamente a nuestros procesos.",
        "Su propuesta está alineada con nuestros objetivos de mejora continua.",
    ],
    "banco": ["Bancolombia", "Davivienda", "BBVA", "Banco de Bogotá", "Banco Popular"],
    "operador": ["Claro", "Movistar", "Tigo", "ETB", "WOM"],
    "empresa": ["Almacenes Éxito", "Falabella", "Homecenter", "Alkosto"],
    "institucion": ["Universidad Nacional", "Universidad de los Andes", "Universidad Javeriana"],
    "entidad": ["Alcaldía Municipal", "Gobernación", "DIAN", "Registraduría"],
    "telefono": ["018000-123456", "(1) 3456789", "01 8000 111 222"],
}
