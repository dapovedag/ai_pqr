/**
 * Datos mock de 1000 PQRs para demostración del sistema
 */

// Tipos y sus colores (Paleta: #00a8c6, #40c0cb, #f9f2e7, #aee239, #8fbe00)
export const TIPOS = {
  peticion: { label: 'Petición', color: '#00a8c6', bgClass: 'bg-cyan-100 text-cyan-700' },
  queja: { label: 'Queja', color: '#8fbe00', bgClass: 'bg-lime-100 text-lime-700' },
  reclamo: { label: 'Reclamo', color: '#40c0cb', bgClass: 'bg-teal-100 text-teal-700' },
  sugerencia: { label: 'Sugerencia', color: '#aee239', bgClass: 'bg-green-100 text-green-700' },
}

// Categorías (iconName es el nombre del icono de Lucide)
export const CATEGORIAS = {
  servicios_publicos: { label: 'Servicios Publicos', iconName: 'Zap' },
  banca: { label: 'Banca', iconName: 'Landmark' },
  salud: { label: 'Salud', iconName: 'Heart' },
  telecomunicaciones: { label: 'Telecomunicaciones', iconName: 'Smartphone' },
  transporte: { label: 'Transporte', iconName: 'Bus' },
  comercio: { label: 'Comercio', iconName: 'ShoppingCart' },
  educacion: { label: 'Educacion', iconName: 'GraduationCap' },
  gobierno: { label: 'Gobierno', iconName: 'Building2' },
}

// Estados (Paleta: #00a8c6, #40c0cb, #f9f2e7, #aee239, #8fbe00)
export const ESTADOS = {
  pendiente: { label: 'Pendiente', color: '#40c0cb', bgClass: 'bg-teal-100 text-teal-700' },
  en_proceso: { label: 'En Proceso', color: '#00a8c6', bgClass: 'bg-cyan-100 text-cyan-700' },
  resuelto: { label: 'Resuelto', color: '#aee239', bgClass: 'bg-green-100 text-green-700' },
  cerrado: { label: 'Cerrado', color: '#8fbe00', bgClass: 'bg-lime-100 text-lime-700' },
}

// 10 PQRs de ejemplo para el panel derecho de NewPQR
export const EJEMPLO_PQRS = [
  {
    id: 1,
    texto: "Solicito información sobre el corte de agua programado para el sector norte. Necesito saber la fecha exacta y duración estimada para tomar previsiones.",
    tipo: "peticion",
    categoria: "servicios_publicos",
    confianza_tipo: 0.94,
    confianza_categoria: 0.89,
    respuesta_sugerida: "Estimado usuario, en respuesta a su solicitud le informamos que el corte de agua programado para el sector norte está previsto para el día 20 de enero de 2026, con una duración estimada de 6 horas (8:00 AM - 2:00 PM). Recomendamos almacenar agua para sus necesidades básicas.",
  },
  {
    id: 2,
    texto: "Me quejo por el constante corte de energía sin previo aviso en mi barrio. Llevamos 5 días con interrupciones que afectan mi trabajo desde casa.",
    tipo: "queja",
    categoria: "servicios_publicos",
    confianza_tipo: 0.97,
    confianza_categoria: 0.92,
    respuesta_sugerida: "Lamentamos los inconvenientes causados por las interrupciones del servicio eléctrico. Hemos escalado su caso al equipo técnico y se programó una revisión de la red en su sector para los próximos 3 días hábiles. Le notificaremos el avance.",
  },
  {
    id: 3,
    texto: "Presento reclamo por cobro indebido de $150.000 en mi cuenta de ahorros. No reconozco esta transacción y exijo la devolución inmediata.",
    tipo: "reclamo",
    categoria: "banca",
    confianza_tipo: 0.96,
    confianza_categoria: 0.95,
    respuesta_sugerida: "Hemos recibido su reclamo por el cobro no reconocido. Iniciamos el proceso de investigación según la normativa vigente. En un plazo máximo de 15 días hábiles recibirá respuesta. Durante este tiempo, el monto será reversado provisionalmente.",
  },
  {
    id: 4,
    texto: "Sugiero implementar un sistema de citas en línea para el centro de salud del barrio, ya que las filas son muy largas y hay adultos mayores esperando horas.",
    tipo: "sugerencia",
    categoria: "salud",
    confianza_tipo: 0.91,
    confianza_categoria: 0.88,
    respuesta_sugerida: "Agradecemos su valiosa sugerencia. La hemos remitido al área de mejora continua del centro de salud. Actualmente estamos evaluando la implementación de un sistema de agendamiento digital que esperamos tener disponible en el segundo trimestre de 2026.",
  },
  {
    id: 5,
    texto: "Solicito el cambio de mi plan de internet a fibra óptica 300 Mbps manteniendo mi número actual de contrato.",
    tipo: "peticion",
    categoria: "telecomunicaciones",
    confianza_tipo: 0.93,
    confianza_categoria: 0.96,
    respuesta_sugerida: "Con gusto procesamos su solicitud de cambio de plan. El plan Fibra 300 Mbps tiene un costo de $89.900/mes. Un técnico se comunicará en las próximas 48 horas para coordinar la instalación sin costo adicional.",
  },
  {
    id: 6,
    texto: "Me quejo por la demora de más de 30 días en la entrega de mi pedido de electrodomésticos. Ya pagué y no he recibido respuesta.",
    tipo: "queja",
    categoria: "comercio",
    confianza_tipo: 0.95,
    confianza_categoria: 0.91,
    respuesta_sugerida: "Entendemos su frustración por la demora en la entrega. Hemos localizado su pedido #45892 que se encuentra en bodega. Coordinaremos entrega prioritaria en las próximas 72 horas. Como compensación, recibirá un bono de $50.000 para futuras compras.",
  },
  {
    id: 7,
    texto: "Reclamo la devolución del dinero por un vuelo cancelado hace 2 meses. La aerolínea no responde mis llamadas ni correos.",
    tipo: "reclamo",
    categoria: "transporte",
    confianza_tipo: 0.98,
    confianza_categoria: 0.94,
    respuesta_sugerida: "Hemos escalado su caso al área de reembolsos de la aerolínea. Según la regulación aeronáutica, tienen 30 días para procesar la devolución. Si no recibe respuesta en 5 días hábiles, puede radicar queja formal ante la Aerocivil con este número de radicado.",
  },
  {
    id: 8,
    texto: "Solicito certificado de notas del semestre 2025-2 para trámite de beca en el exterior. Necesito que incluya el promedio acumulado.",
    tipo: "peticion",
    categoria: "educacion",
    confianza_tipo: 0.92,
    confianza_categoria: 0.97,
    respuesta_sugerida: "Su solicitud de certificado de notas ha sido recibida. El documento estará disponible en 3 días hábiles. Puede reclamarlo en la oficina de registro académico o solicitar envío digital al correo registrado. El costo es de $15.000.",
  },
  {
    id: 9,
    texto: "Me quejo por la falta de señalización en las nuevas rutas de buses. Los pasajeros no sabemos dónde esperar ni qué ruta tomar.",
    tipo: "queja",
    categoria: "gobierno",
    confianza_tipo: 0.89,
    confianza_categoria: 0.86,
    respuesta_sugerida: "Agradecemos reportar esta situación. Hemos notificado a la Secretaría de Movilidad para la instalación de señalización en las nuevas rutas. Se estima que en 15 días se complete la instalación de paraderos con información de rutas.",
  },
  {
    id: 10,
    texto: "Sugiero que el hospital habilite horarios nocturnos para toma de exámenes de laboratorio, facilitando a quienes trabajamos en el día.",
    tipo: "sugerencia",
    categoria: "salud",
    confianza_tipo: 0.90,
    confianza_categoria: 0.93,
    respuesta_sugerida: "Su sugerencia ha sido registrada y enviada al comité de calidad del hospital. Actualmente evaluamos la viabilidad de extender horarios. Le informamos que algunos laboratorios externos afiliados ya ofrecen servicio hasta las 8 PM.",
  },
]

// Función para generar fecha aleatoria en los últimos 6 meses
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Función para generar ID único
function generateId() {
  return Math.random().toString(36).substr(2, 9).toUpperCase()
}

// Textos de ejemplo por tipo y categoría
const TEXTOS_EJEMPLO = {
  peticion: {
    servicios_publicos: [
      "Solicito información sobre el programa de subsidios de agua potable para estratos 1 y 2.",
      "Requiero certificación del consumo de energía de los últimos 3 meses.",
      "Solicito revisión del medidor de gas ya que las lecturas no corresponden al consumo.",
    ],
    banca: [
      "Solicito extracto bancario de mi cuenta de ahorros de los últimos 6 meses.",
      "Requiero información sobre tasas de interés para crédito hipotecario.",
      "Solicito cancelación del seguro de vida asociado a mi tarjeta de crédito.",
    ],
    salud: [
      "Solicito copia de mi historia clínica para trámite de pensión.",
      "Requiero autorización para cita con especialista en cardiología.",
      "Solicito certificación de afiliación activa a la EPS.",
    ],
    telecomunicaciones: [
      "Solicito información sobre planes de fibra óptica disponibles.",
      "Requiero activación del servicio de roaming internacional.",
      "Solicito copia del contrato de servicios firmado en 2024.",
    ],
    transporte: [
      "Solicito certificación de no poseer comparendos de tránsito.",
      "Requiero información sobre requisitos para traspaso vehicular.",
      "Solicito duplicado de licencia de conducción por pérdida.",
    ],
    comercio: [
      "Solicito información sobre el estado de mi pedido #78234.",
      "Requiero factura de compra del 15 de diciembre.",
      "Solicito información sobre garantía del producto adquirido.",
    ],
    educacion: [
      "Solicito certificado de notas del período 2025-2.",
      "Requiero constancia de matrícula para trámite de beca.",
      "Solicito homologación de materias de otra institución.",
    ],
    gobierno: [
      "Solicito certificado de residencia para subsidio de vivienda.",
      "Requiero información sobre requisitos para pasaporte.",
      "Solicito paz y salvo de impuesto predial.",
    ],
  },
  queja: {
    servicios_publicos: [
      "Me quejo por el constante corte de agua sin previo aviso.",
      "Presento queja por el mal estado del alcantarillado que genera olores.",
      "Manifiesto inconformidad por altas tarifas de energía.",
    ],
    banca: [
      "Presento queja por cobro indebido sin autorización.",
      "Me quejo por la mala atención en la sucursal centro.",
      "Manifiesto inconformidad por demora en respuesta a solicitud.",
    ],
    salud: [
      "Me quejo por la demora de 3 meses para cita con especialista.",
      "Presento queja por negación de medicamentos incluidos en el POS.",
      "Manifiesto inconformidad por mala atención en urgencias.",
    ],
    telecomunicaciones: [
      "Me quejo por la lentitud del servicio de internet contratado.",
      "Presento queja por cobros adicionales no autorizados.",
      "Manifiesto inconformidad por fallas constantes en el servicio.",
    ],
    transporte: [
      "Me quejo por el mal estado de las vías en mi sector.",
      "Presento queja por incumplimiento de horarios del transporte público.",
      "Manifiesto inconformidad por falta de paraderos señalizados.",
    ],
    comercio: [
      "Me quejo por producto defectuoso que no aceptan cambiar.",
      "Presento queja por demora en entrega de pedido online.",
      "Manifiesto inconformidad por publicidad engañosa.",
    ],
    educacion: [
      "Me quejo por demora en entrega de certificados solicitados.",
      "Presento queja por mala infraestructura del plantel.",
      "Manifiesto inconformidad por falta de docentes en algunas materias.",
    ],
    gobierno: [
      "Me quejo por demora excesiva en trámite de cédula.",
      "Presento queja por mal estado de parques públicos.",
      "Manifiesto inconformidad por falta de respuesta a solicitud.",
    ],
  },
  reclamo: {
    servicios_publicos: [
      "Reclamo la corrección de factura con cobro excesivo.",
      "Exijo la reparación del daño causado por sobrevoltaje.",
      "Reclamo devolución de dinero por servicio no prestado.",
    ],
    banca: [
      "Reclamo devolución de dinero por transacción no reconocida.",
      "Exijo corrección de reporte negativo en centrales de riesgo.",
      "Reclamo reversión de cobro de intereses de mora incorrectos.",
    ],
    salud: [
      "Reclamo la atención inmediata por urgencia negada.",
      "Exijo entrega de medicamentos ordenados hace 2 semanas.",
      "Reclamo reembolso de gastos médicos no cubiertos.",
    ],
    telecomunicaciones: [
      "Reclamo devolución de dinero por servicio no funcional.",
      "Exijo compensación por días sin servicio.",
      "Reclamo cancelación sin penalidad por incumplimiento.",
    ],
    transporte: [
      "Reclamo devolución del dinero por vuelo cancelado.",
      "Exijo indemnización por equipaje perdido.",
      "Reclamo reembolso de peaje cobrado indebidamente.",
    ],
    comercio: [
      "Reclamo devolución de dinero por producto nunca entregado.",
      "Exijo aplicación de garantía por producto defectuoso.",
      "Reclamo compensación por daños causados por producto.",
    ],
    educacion: [
      "Reclamo devolución de matrícula por cancelación de programa.",
      "Exijo reconocimiento de créditos no homologados.",
      "Reclamo corrección de notas mal registradas.",
    ],
    gobierno: [
      "Reclamo devolución de dinero por trámite rechazado.",
      "Exijo respuesta a derecho de petición vencido.",
      "Reclamo corrección de información errónea en documentos.",
    ],
  },
  sugerencia: {
    servicios_publicos: [
      "Sugiero implementar alertas SMS para cortes programados.",
      "Propongo crear app móvil para reportar daños.",
      "Sugiero ampliar horarios de atención al usuario.",
    ],
    banca: [
      "Sugiero habilitar más cajeros en zonas residenciales.",
      "Propongo crear línea exclusiva para adultos mayores.",
      "Sugiero mejorar la app móvil con más funcionalidades.",
    ],
    salud: [
      "Sugiero implementar sistema de citas en línea.",
      "Propongo ampliar horarios de laboratorio clínico.",
      "Sugiero crear módulo de telemedicina.",
    ],
    telecomunicaciones: [
      "Sugiero mejorar la cobertura en zonas rurales.",
      "Propongo crear planes más económicos para estudiantes.",
      "Sugiero simplificar el proceso de portabilidad.",
    ],
    transporte: [
      "Sugiero aumentar frecuencia de buses en horas pico.",
      "Propongo crear carriles exclusivos para bicicletas.",
      "Sugiero mejorar señalización de paraderos.",
    ],
    comercio: [
      "Sugiero ampliar opciones de pago en cuotas sin interés.",
      "Propongo crear programa de puntos para clientes frecuentes.",
      "Sugiero mejorar el empaque para envíos frágiles.",
    ],
    educacion: [
      "Sugiero habilitar clases virtuales como alternativa.",
      "Propongo crear más becas para estratos bajos.",
      "Sugiero mejorar la biblioteca con más recursos digitales.",
    ],
    gobierno: [
      "Sugiero digitalizar más trámites para hacerlos en línea.",
      "Propongo crear ventanilla única para múltiples servicios.",
      "Sugiero ampliar horarios de atención al ciudadano.",
    ],
  },
}

// Generar 100 PQRs mock
function generateMockPQRs(count = 100) {
  const pqrs = []
  const tipos = Object.keys(TIPOS)
  const categorias = Object.keys(CATEGORIAS)
  const estados = Object.keys(ESTADOS)

  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 6)

  for (let i = 0; i < count; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)]
    const categoria = categorias[Math.floor(Math.random() * categorias.length)]
    const estado = estados[Math.floor(Math.random() * estados.length)]
    const fecha = randomDate(startDate, endDate)

    // Obtener texto aleatorio
    const textosDisponibles = TEXTOS_EJEMPLO[tipo][categoria]
    const texto = textosDisponibles[Math.floor(Math.random() * textosDisponibles.length)]

    pqrs.push({
      id: i + 1,
      radicado: `PQR-2026-${String(i + 1).padStart(5, '0')}`,
      texto,
      asunto: texto.substring(0, 50) + '...',
      tipo,
      categoria,
      estado,
      confianza_tipo: 0.85 + Math.random() * 0.14,
      confianza_categoria: 0.80 + Math.random() * 0.19,
      fecha_creacion: fecha.toISOString(),
      fecha_actualizacion: new Date(fecha.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      tiene_respuesta: estado === 'resuelto' || estado === 'cerrado',
    })
  }

  // Ordenar por fecha más reciente
  pqrs.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion))

  return pqrs
}

// Exportar los datos generados (100 PQRs)
export const MOCK_PQRS = generateMockPQRs(100)

// Estadísticas GLOBALES del sistema (3256 PQRs en 2025)
// El listado muestra solo las últimas 100, pero las estadísticas reflejan el total histórico
export const ESTADISTICAS_GLOBALES = {
  total: 3256,
  año: 2025,
  // Distribución por tipo (proporciones realistas)
  por_tipo: {
    peticion: 1302,    // 40%
    queja: 815,        // 25%
    reclamo: 652,      // 20%
    sugerencia: 487,   // 15%
  },
  // Distribución por categoría
  por_categoria: {
    servicios_publicos: 554,   // 17%
    banca: 489,                // 15%
    salud: 456,                // 14%
    telecomunicaciones: 423,  // 13%
    transporte: 358,           // 11%
    comercio: 391,             // 12%
    educacion: 293,            // 9%
    gobierno: 292,             // 9%
  },
  // Distribución por estado
  por_estado: {
    pendiente: 326,     // 10%
    en_proceso: 489,    // 15%
    resuelto: 1954,     // 60%
    cerrado: 487,       // 15%
  },
  // Distribución mensual en 2025
  por_mes: {
    'ene 2025': 245,
    'feb 2025': 267,
    'mar 2025': 289,
    'abr 2025': 301,
    'may 2025': 278,
    'jun 2025': 312,
    'jul 2025': 298,
    'ago 2025': 285,
    'sep 2025': 267,
    'oct 2025': 254,
    'nov 2025': 231,
    'dic 2025': 229,
  },
  resueltas_hoy: 12,
  tiempo_promedio_respuesta: 4.2, // días
  satisfaccion: 87, // porcentaje
}

// Estadísticas calculadas (usando datos globales de 3256 PQRs)
export function getEstadisticas() {
  return {
    ...ESTADISTICAS_GLOBALES,
    pendientes: ESTADISTICAS_GLOBALES.por_estado.pendiente,
  }
}

// Datos para gráficos de tendencia (12 meses de 2025 con 3256 PQRs)
// NOTA: La IA fue adoptada en Marzo 2025, mostrando mejora progresiva en tasa de resolución
export function getDatosTendencia() {
  // Datos mensuales históricos de 2025 (3256 PQRs distribuidas)
  // Antes de IA (Ene-Feb): ~75-77% resolución
  // Adopción IA (Mar): 82% resolución - inicio de mejora
  // Post-IA (Abr-Dic): mejora progresiva hasta 96%
  return [
    { mes: 'Ene 2025', total: 245, peticiones: 98, quejas: 61, reclamos: 49, sugerencias: 37, resueltas: 184, conIA: false },  // 75%
    { mes: 'Feb 2025', total: 267, peticiones: 107, quejas: 67, reclamos: 53, sugerencias: 40, resueltas: 206, conIA: false }, // 77%
    { mes: 'Mar 2025', total: 289, peticiones: 116, quejas: 72, reclamos: 58, sugerencias: 43, resueltas: 237, conIA: true },  // 82% - ADOPCIÓN IA
    { mes: 'Abr 2025', total: 301, peticiones: 120, quejas: 75, reclamos: 60, sugerencias: 46, resueltas: 259, conIA: true },  // 86%
    { mes: 'May 2025', total: 278, peticiones: 111, quejas: 70, reclamos: 56, sugerencias: 41, resueltas: 245, conIA: true },  // 88%
    { mes: 'Jun 2025', total: 312, peticiones: 125, quejas: 78, reclamos: 62, sugerencias: 47, resueltas: 281, conIA: true },  // 90%
    { mes: 'Jul 2025', total: 298, peticiones: 119, quejas: 75, reclamos: 60, sugerencias: 44, resueltas: 271, conIA: true },  // 91%
    { mes: 'Ago 2025', total: 285, peticiones: 114, quejas: 71, reclamos: 57, sugerencias: 43, resueltas: 262, conIA: true },  // 92%
    { mes: 'Sep 2025', total: 267, peticiones: 107, quejas: 67, reclamos: 53, sugerencias: 40, resueltas: 248, conIA: true },  // 93%
    { mes: 'Oct 2025', total: 254, peticiones: 102, quejas: 63, reclamos: 51, sugerencias: 38, resueltas: 239, conIA: true },  // 94%
    { mes: 'Nov 2025', total: 231, peticiones: 92, quejas: 58, reclamos: 46, sugerencias: 35, resueltas: 219, conIA: true },   // 95%
    { mes: 'Dic 2025', total: 229, peticiones: 92, quejas: 57, reclamos: 46, sugerencias: 34, resueltas: 220, conIA: true },   // 96%
  ]
}

// Datos de tendencia para gráficos (últimos 6 meses)
export function getDatosTendencia6Meses() {
  const tendenciaCompleta = getDatosTendencia()
  return tendenciaCompleta.slice(-6) // Últimos 6 meses
}
