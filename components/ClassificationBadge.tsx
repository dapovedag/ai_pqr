type PQRSType = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
type StatusType = 'pending' | 'progress' | 'resolved' | 'closed';

interface ClassificationBadgeProps {
  type: PQRSType;
}

interface StatusBadgeProps {
  status: StatusType;
}

const TYPE_LABELS: Record<PQRSType, string> = {
  peticion: 'Petición',
  queja: 'Queja',
  reclamo: 'Reclamo',
  sugerencia: 'Sugerencia',
};

const STATUS_LABELS: Record<StatusType, string> = {
  pending: 'Pendiente',
  progress: 'En Proceso',
  resolved: 'Resuelto',
  closed: 'Cerrado',
};

export function ClassificationBadge({ type }: ClassificationBadgeProps) {
  return (
    <span className={`badge badge-${type}`}>
      {TYPE_LABELS[type]}
    </span>
  );
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`badge badge-${status}`}>
      <span className={`status-dot ${status === 'progress' ? 'pulse' : ''}`} />
      {STATUS_LABELS[status]}
    </span>
  );
}

// Ejemplo de uso en tabla:
// <ClassificationBadge type="queja" />
// <StatusBadge status="progress" />
