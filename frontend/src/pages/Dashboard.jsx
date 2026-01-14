import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Clock, CheckCircle, AlertCircle, XCircle, TrendingUp, Users, FileText, Zap } from 'lucide-react'
import MetricCard from '../components/pqr/MetricCard'
import { MOCK_PQRS, TIPOS, CATEGORIAS, ESTADOS, getEstadisticas } from '../data/mockData'

const COLORS = {
  peticion: '#31bdeb',
  queja: '#e57373',
  reclamo: '#f0c88d',
  sugerencia: '#8dc853',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = getEstadisticas()

  // Datos para pie chart
  const pieData = Object.entries(stats.por_tipo).map(([tipo, cantidad]) => ({
    name: TIPOS[tipo]?.label || tipo,
    value: cantidad,
    color: TIPOS[tipo]?.color || '#666',
  }))

  // Datos para bar chart
  const barData = Object.entries(stats.por_categoria).map(([categoria, cantidad]) => ({
    name: CATEGORIAS[categoria]?.label?.substring(0, 12) || categoria,
    cantidad,
    fullName: CATEGORIAS[categoria]?.label || categoria,
  }))

  // Últimas 5 PQRs para vista rápida
  const ultimasPQRs = MOCK_PQRS.slice(0, 5)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Resumen general del sistema - {stats.total} PQRs registradas
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Satisfacción general</div>
          <div className="text-2xl font-bold text-green-600">{stats.satisfaccion}%</div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pqrs?estado=pendiente')}>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.por_estado.pendiente || 0}</div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pqrs?estado=en_proceso')}>
          <div className="p-3 bg-blue-100 rounded-lg">
            <AlertCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.por_estado.en_proceso || 0}</div>
            <div className="text-sm text-gray-500">En Proceso</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pqrs?estado=resuelto')}>
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.por_estado.resuelto || 0}</div>
            <div className="text-sm text-gray-500">Resueltos</div>
          </div>
        </div>

        <div className="card flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pqrs?estado=cerrado')}>
          <div className="p-3 bg-gray-100 rounded-lg">
            <XCircle className="text-gray-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.por_estado.cerrado || 0}</div>
            <div className="text-sm text-gray-500">Cerrados</div>
          </div>
        </div>
      </div>

      {/* Métricas por Tipo */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Distribución por Tipo de PQR
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.por_tipo).map(([tipo, cantidad]) => (
            <MetricCard
              key={tipo}
              type={tipo}
              value={cantidad}
              label={TIPOS[tipo]?.label || tipo}
              onClick={() => navigate(`/pqrs?tipo=${tipo}`)}
            />
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Por Tipo */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} PQRs`, 'Cantidad']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Por Categoría */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Categoría</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value, name, props) => [`${value} PQRs`, props.payload.fullName]}
              />
              <Bar dataKey="cantidad" fill="#31bdeb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Indicadores de rendimiento */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-r from-brand-blue to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Tiempo Promedio Respuesta</div>
              <div className="text-3xl font-bold mt-1">{stats.tiempo_promedio_respuesta} días</div>
            </div>
            <Clock size={40} className="opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Tasa de Resolución</div>
              <div className="text-3xl font-bold mt-1">
                {((stats.por_estado.resuelto + stats.por_estado.cerrado) / stats.total * 100).toFixed(0)}%
              </div>
            </div>
            <TrendingUp size={40} className="opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Total PQRs</div>
              <div className="text-3xl font-bold mt-1">{stats.total}</div>
            </div>
            <FileText size={40} className="opacity-50" />
          </div>
        </div>
      </div>

      {/* Últimas PQRs */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Últimas PQRs Recibidas</h3>
          <button
            onClick={() => navigate('/pqrs')}
            className="text-sm text-brand-blue hover:underline"
          >
            Ver todas
          </button>
        </div>
        <div className="space-y-3">
          {ultimasPQRs.map((pqr) => (
            <div
              key={pqr.id}
              onClick={() => navigate(`/pqrs/${pqr.id}`)}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
              style={{ borderLeft: `4px solid ${TIPOS[pqr.tipo]?.color}` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500">{pqr.radicado}</span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium text-white"
                    style={{ backgroundColor: TIPOS[pqr.tipo]?.color }}
                  >
                    {TIPOS[pqr.tipo]?.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${ESTADOS[pqr.estado]?.bgClass}`}>
                    {ESTADOS[pqr.estado]?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {pqr.asunto}
                </p>
              </div>
              <div className="text-xs text-gray-500 ml-4">
                {new Date(pqr.fecha_creacion).toLocaleDateString('es')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
