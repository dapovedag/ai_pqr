import { TrendingUp, TrendingDown, FileText, AlertCircle, AlertTriangle, Lightbulb } from 'lucide-react';

type PQRSType = 'peticion' | 'queja' | 'reclamo' | 'sugerencia';

interface MetricCardProps {
  type: PQRSType;
  value: number;
  label: string;
  trend?: number; // porcentaje de cambio
}

const ICONS: Record<PQRSType, React.ReactNode> = {
  peticion: <FileText size={24} />,
  queja: <AlertCircle size={24} />,
  reclamo: <AlertTriangle size={24} />,
  sugerencia: <Lightbulb size={24} />,
};

const COLORS: Record<PQRSType, string> = {
  peticion: '#31bdeb',
  queja: '#e57373',
  reclamo: '#f0c88d',
  sugerencia: '#8dc853',
};

export function MetricCard({ type, value, label, trend }: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div className="card metric-card" data-type={type}>
      <div className="flex items-center justify-between mb-4">
        <span style={{ color: COLORS[type] }}>{ICONS[type]}</span>
        {trend !== undefined && (
          <span className={`metric-trend ${isPositive ? 'positive' : 'negative'}`}>
            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="metric-value">{value.toLocaleString()}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}

// Ejemplo de uso:
// <MetricCard type="peticion" value={142} label="Peticiones este mes" trend={12.5} />
// <MetricCard type="queja" value={38} label="Quejas pendientes" trend={-8.2} />
