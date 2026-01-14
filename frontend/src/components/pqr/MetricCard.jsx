import { TrendingUp, TrendingDown, FileText, AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react'

const ICONS = {
  peticion: FileText,
  queja: AlertCircle,
  reclamo: AlertTriangle,
  sugerencia: Lightbulb,
}

// Paleta: #00a8c6, #40c0cb, #f9f2e7, #aee239, #8fbe00
const COLORS = {
  peticion: '#00a8c6',
  queja: '#8fbe00',
  reclamo: '#40c0cb',
  sugerencia: '#aee239',
}

export default function MetricCard({ type, value, label, trend, onClick }) {
  const Icon = ICONS[type] || FileText
  const color = COLORS[type] || COLORS.peticion
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div
      className={`card cursor-pointer hover:scale-105 transition-transform`}
      style={{ borderLeft: `4px solid ${color}` }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <span style={{ color }}>
          <Icon size={24} />
        </span>
        {trend !== undefined && (
          <span className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-3xl font-bold font-mono text-gray-900 dark:text-white">
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
        {label}
      </div>
    </div>
  )
}
