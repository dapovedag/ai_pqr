import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import MetricCard from '../components/pqr/MetricCard'
import { getStatsOverview, getStatsByType, getStatsByCategory } from '../services/api'

const COLORS = {
  peticion: '#31bdeb',
  queja: '#e57373',
  reclamo: '#f0c88d',
  sugerencia: '#8dc853',
}

export default function Dashboard() {
  const navigate = useNavigate()

  const { data: overview, isLoading: loadingOverview } = useQuery({
    queryKey: ['stats-overview'],
    queryFn: () => getStatsOverview(30),
  })

  const { data: byType, isLoading: loadingType } = useQuery({
    queryKey: ['stats-by-type'],
    queryFn: () => getStatsByType(30),
  })

  const { data: byCategory, isLoading: loadingCategory } = useQuery({
    queryKey: ['stats-by-category'],
    queryFn: () => getStatsByCategory(30),
  })

  if (loadingOverview || loadingType || loadingCategory) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    )
  }

  const pieData = byType?.map(item => ({
    name: item.tipo_label,
    value: item.cantidad,
    color: COLORS[item.tipo],
  })) || []

  const barData = byCategory?.map(item => ({
    name: item.categoria_label.substring(0, 10),
    cantidad: item.cantidad,
  })) || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Resumen de los últimos 30 días
        </p>
      </div>

      {/* Estado Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="p-3 bg-yellow-100 rounded-lg">
            <Clock className="text-yellow-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{overview?.pendientes || 0}</div>
            <div className="text-sm text-gray-500">Pendientes</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <AlertCircle className="text-blue-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{overview?.en_proceso || 0}</div>
            <div className="text-sm text-gray-500">En Proceso</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{overview?.resueltos || 0}</div>
            <div className="text-sm text-gray-500">Resueltos</div>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-3 bg-gray-100 rounded-lg">
            <XCircle className="text-gray-600" size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{overview?.cerrados || 0}</div>
            <div className="text-sm text-gray-500">Cerrados</div>
          </div>
        </div>
      </div>

      {/* Métricas por Tipo */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Por Tipo de PQR
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {byType?.map(item => (
            <MetricCard
              key={item.tipo}
              type={item.tipo}
              value={item.cantidad}
              label={item.tipo_label}
              onClick={() => navigate(`/pqrs?tipo=${item.tipo}`)}
            />
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart - Por Tipo */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Distribución por Tipo</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Por Categoría */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Por Categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#31bdeb" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tiempo promedio */}
      {overview?.tiempo_promedio_respuesta_horas && (
        <div className="card bg-gradient-to-r from-brand-blue to-brand-green-dark text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">Tiempo Promedio de Respuesta</div>
              <div className="text-3xl font-bold mt-1">
                {overview.tiempo_promedio_respuesta_horas.toFixed(1)} horas
              </div>
            </div>
            <Clock size={48} className="opacity-50" />
          </div>
        </div>
      )}
    </div>
  )
}
