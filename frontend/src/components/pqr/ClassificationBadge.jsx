const TYPE_CONFIG = {
  peticion: { label: 'Petición', className: 'badge-peticion' },
  queja: { label: 'Queja', className: 'badge-queja' },
  reclamo: { label: 'Reclamo', className: 'badge-reclamo' },
  sugerencia: { label: 'Sugerencia', className: 'badge-sugerencia' },
}

const STATUS_CONFIG = {
  pending: { label: 'Pendiente', className: 'badge-pending', dotClass: 'pending' },
  progress: { label: 'En Proceso', className: 'badge-progress', dotClass: 'progress' },
  resolved: { label: 'Resuelto', className: 'badge-resolved', dotClass: 'resolved' },
  closed: { label: 'Cerrado', className: 'badge-closed', dotClass: 'closed' },
}

export function TypeBadge({ type }) {
  const config = TYPE_CONFIG[type] || { label: type, className: 'badge-peticion' }

  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'badge-pending', dotClass: 'pending' }

  return (
    <span className={`badge ${config.className} flex items-center`}>
      <span className={`status-dot ${config.dotClass}`} />
      {config.label}
    </span>
  )
}

export function CategoryBadge({ category }) {
  const labels = {
    servicios_publicos: 'Servicios Públicos',
    banca: 'Banca',
    salud: 'Salud',
    telecomunicaciones: 'Telecomunicaciones',
    transporte: 'Transporte',
    comercio: 'Comercio',
    educacion: 'Educación',
    gobierno: 'Gobierno',
  }

  return (
    <span className="text-sm text-gray-600 dark:text-gray-400">
      {labels[category] || category}
    </span>
  )
}

export function ConfidenceBadge({ value }) {
  const percentage = Math.round(value * 100)
  const color = percentage >= 80 ? 'text-green-600' : percentage >= 60 ? 'text-yellow-600' : 'text-red-600'

  return (
    <span className={`text-xs font-mono ${color}`}>
      {percentage}%
    </span>
  )
}
