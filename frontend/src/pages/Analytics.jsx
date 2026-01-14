import { useState } from 'react'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { TrendingUp, TrendingDown, Brain, Clock, Target, Zap, Calendar } from 'lucide-react'
import { MOCK_PQRS, TIPOS, CATEGORIAS, getEstadisticas, getDatosTendencia } from '../data/mockData'

export default function Analytics() {
  const [periodoComparacion, setPeriodoComparacion] = useState('6m')
  const stats = getEstadisticas()
  const tendencia = getDatosTendencia()

  // Calcular métricas de rendimiento del modelo
  const modelMetrics = {
    accuracy_tipo: 94.2,
    accuracy_categoria: 89.7,
    tiempo_promedio_ms: 78,
    pqrs_clasificadas: MOCK_PQRS.length,
    f1_score: 0.92,
  }

  // Datos para gráfico de tendencia por tipo
  const tendenciaPorTipo = tendencia.map(mes => ({
    mes: mes.mes.split(' ')[0],
    Peticiones: mes.peticiones,
    Quejas: mes.quejas,
    Reclamos: mes.reclamos,
    Sugerencias: mes.sugerencias,
  }))

  // Datos para gráfico de resolución
  const tendenciaResolucion = tendencia.map(mes => ({
    mes: mes.mes.split(' ')[0],
    total: mes.total,
    resueltas: mes.resueltas,
    tasa: mes.total > 0 ? ((mes.resueltas / mes.total) * 100).toFixed(0) : 0,
  }))

  // Datos para radar de categorías
  const radarData = Object.entries(stats.por_categoria).map(([key, value]) => ({
    categoria: CATEGORIAS[key]?.label?.substring(0, 8) || key,
    cantidad: value,
    fullName: CATEGORIAS[key]?.label || key,
  }))

  // Comparativa mes actual vs anterior
  const mesActual = tendencia[tendencia.length - 1] || { total: 0, resueltas: 0 }
  const mesAnterior = tendencia[tendencia.length - 2] || { total: 0, resueltas: 0 }
  const variacionTotal = mesAnterior.total > 0
    ? (((mesActual.total - mesAnterior.total) / mesAnterior.total) * 100).toFixed(1)
    : 0
  const variacionResolucion = mesAnterior.resueltas > 0
    ? (((mesActual.resueltas - mesAnterior.resueltas) / mesAnterior.resueltas) * 100).toFixed(1)
    : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analíticas Avanzadas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Análisis de tendencias, rendimiento del modelo y métricas de gestión
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-400" />
          <select
            value={periodoComparacion}
            onChange={(e) => setPeriodoComparacion(e.target.value)}
            className="input w-auto"
          >
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* Comparativa con período anterior */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">PQRs este mes</p>
              <p className="text-2xl font-bold">{mesActual.total}</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${Number(variacionTotal) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Number(variacionTotal) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {variacionTotal}%
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">vs mes anterior ({mesAnterior.total})</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Resueltas este mes</p>
              <p className="text-2xl font-bold">{mesActual.resueltas}</p>
            </div>
            <div className={`flex items-center gap-1 text-sm ${Number(variacionResolucion) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Number(variacionResolucion) >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {variacionResolucion}%
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">vs mes anterior ({mesAnterior.resueltas})</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasa de resolución</p>
              <p className="text-2xl font-bold">
                {mesActual.total > 0 ? ((mesActual.resueltas / mesActual.total) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <Target className="text-green-500" size={24} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Meta: 85%</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tiempo promedio</p>
              <p className="text-2xl font-bold">{stats.tiempo_promedio_respuesta} días</p>
            </div>
            <Clock className="text-blue-500" size={24} />
          </div>
          <p className="text-xs text-gray-400 mt-2">Meta: {"<"} 5 días</p>
        </div>
      </div>

      {/* Gráfico de tendencia por tipo */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tendencia por Tipo de PQR (Últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={tendenciaPorTipo}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="Peticiones" stackId="1" stroke="#31bdeb" fill="#31bdeb" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Quejas" stackId="1" stroke="#e57373" fill="#e57373" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Reclamos" stackId="1" stroke="#f0c88d" fill="#f0c88d" fillOpacity={0.6} />
            <Area type="monotone" dataKey="Sugerencias" stackId="1" stroke="#8dc853" fill="#8dc853" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Gráficos lado a lado */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Tasa de resolución mensual */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Evolución Tasa de Resolución</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tendenciaResolucion}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value) => [`${value}%`, 'Tasa']} />
              <Line type="monotone" dataKey="tasa" stroke="#1ab273" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar de categorías */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="categoria" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis />
              <Radar dataKey="cantidad" stroke="#31bdeb" fill="#31bdeb" fillOpacity={0.5} />
              <Tooltip formatter={(value, name, props) => [value, props.payload.fullName]} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rendimiento del Modelo BERT */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-800 border-2 border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="text-purple-600" size={28} />
          <div>
            <h3 className="text-lg font-semibold">Rendimiento del Modelo BERT</h3>
            <p className="text-sm text-gray-500">BETO (dccuchile/bert-base-spanish-wwm-cased)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">{modelMetrics.accuracy_tipo}%</div>
            <div className="text-sm text-gray-500">Accuracy Tipo</div>
            <div className="text-xs text-gray-400 mt-1">4 clases</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-blue-600">{modelMetrics.accuracy_categoria}%</div>
            <div className="text-sm text-gray-500">Accuracy Categoría</div>
            <div className="text-xs text-gray-400 mt-1">8 clases</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{modelMetrics.f1_score}</div>
            <div className="text-sm text-gray-500">F1-Score</div>
            <div className="text-xs text-gray-400 mt-1">Promedio ponderado</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">{modelMetrics.tiempo_promedio_ms}ms</div>
            <div className="text-sm text-gray-500">Latencia</div>
            <div className="text-xs text-gray-400 mt-1">Tiempo de inferencia</div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-gray-700">{modelMetrics.pqrs_clasificadas}</div>
            <div className="text-sm text-gray-500">PQRs Clasificadas</div>
            <div className="text-xs text-gray-400 mt-1">Total procesadas</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-900/50 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <Zap className="inline text-yellow-500 mr-1" size={16} />
            El modelo fue fine-tuned con un dataset de <strong>10,000 PQRs sintéticas</strong> (8K train, 1K val, 1K test)
            durante 3 épocas con learning rate de 2e-5. Utiliza embeddings de 768 dimensiones.
          </p>
        </div>
      </div>

      {/* Volumen por hora del día (simulado) */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Distribución por Hora del Día</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={[
            { hora: '00-06', cantidad: 5 },
            { hora: '06-09', cantidad: 12 },
            { hora: '09-12', cantidad: 28 },
            { hora: '12-14', cantidad: 15 },
            { hora: '14-17', cantidad: 25 },
            { hora: '17-20', cantidad: 10 },
            { hora: '20-24', cantidad: 5 },
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#31bdeb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Mayor volumen entre 9:00 AM y 5:00 PM (horario laboral)
        </p>
      </div>

      {/* Resumen ejecutivo */}
      <div className="card bg-gray-50 dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Resumen Ejecutivo</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-green-600 mb-2">Aspectos Positivos</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Tasa de resolución por encima de la meta (85%)</li>
              <li>• Tiempo de respuesta dentro del objetivo ({"<"}5 días)</li>
              <li>• Alta precisión del modelo de clasificación (94%)</li>
              <li>• Reducción de PQRs pendientes vs mes anterior</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-orange-600 mb-2">Áreas de Mejora</h4>
            <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
              <li>• Incremento de quejas en categoría Telecomunicaciones</li>
              <li>• Mejorar accuracy en categorías menos frecuentes</li>
              <li>• Reducir tiempo de respuesta en horario pico</li>
              <li>• Aumentar uso de respuestas sugeridas por IA</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
