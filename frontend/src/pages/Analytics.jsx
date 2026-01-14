import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Calendar } from 'lucide-react'
import { getFullStats } from '../services/api'

const COLORS = {
  peticion: '#31bdeb',
  queja: '#e57373',
  reclamo: '#f0c88d',
  sugerencia: '#8dc853',
}

const CATEGORY_COLORS = [
  '#31bdeb', '#1ab273', '#8dc853', '#f0c88d',
  '#e57373', '#9b59b6', '#3498db', '#e74c3c',
]

export default function Analytics() {
  const [dias, setDias] = useState(30)

  const { data, isLoading } = useQuery({
    queryKey: ['full-stats', dias],
    queryFn: () => getFullStats(dias),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    )
  }

  const pieData = data?.por_tipo?.map(item => ({
    name: item.tipo_label,
    value: item.cantidad,
    color: COLORS[item.tipo],
  })) || []

  const categoryData = data?.por_categoria?.map((item, idx) => ({
    name: item.categoria_label,
    cantidad: item.cantidad,
    porcentaje: item.porcentaje,
    color: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  })) || []

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analíticas
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Estadísticas detalladas del sistema
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-gray-400" />
          <select
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="input w-auto"
          >
            <option value={7}>Últimos 7 días</option>
            <option value={30}>Últimos 30 días</option>
            <option value={90}>Últimos 90 días</option>
            <option value={365}>Último año</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-brand-blue">
            {data?.overview?.total_pqrs || 0}
          </div>
          <div className="text-sm text-gray-500">Total PQRs</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-500">
            {data?.overview?.pendientes || 0}
          </div>
          <div className="text-sm text-gray-500">Pendientes</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-500">
            {data?.overview?.en_proceso || 0}
          </div>
          <div className="text-sm text-gray-500">En Proceso</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-500">
            {data?.overview?.resueltos || 0}
          </div>
          <div className="text-sm text-gray-500">Resueltos</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-gray-500">
            {data?.overview?.cerrados || 0}
          </div>
          <div className="text-sm text-gray-500">Cerrados</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart - Por Tipo */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Distribución por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Por Categoría */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            PQRs por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 11 }}
              />
              <Tooltip />
              <Bar dataKey="cantidad" radius={[0, 4, 4, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Detalle por Tipo
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Tipo
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Cantidad
                </th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                  Porcentaje
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Distribución
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.por_tipo?.map((item) => (
                <tr key={item.tipo} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[item.tipo] }}
                      />
                      <span className="font-medium">{item.tipo_label}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {item.cantidad}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {item.porcentaje}%
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${item.porcentaje}%`,
                          backgroundColor: COLORS[item.tipo],
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tiempo promedio */}
      {data?.overview?.tiempo_promedio_respuesta_horas && (
        <div className="card bg-gradient-to-r from-brand-blue to-brand-green-dark text-white">
          <div className="text-center">
            <div className="text-sm opacity-80 mb-2">
              Tiempo Promedio de Respuesta
            </div>
            <div className="text-4xl font-bold">
              {data.overview.tiempo_promedio_respuesta_horas.toFixed(1)}
            </div>
            <div className="text-sm opacity-80 mt-1">
              horas
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
