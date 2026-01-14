# Sistema de Diseño - Dashboard PQRS

## 1. Paleta de Colores de Marca

```css
:root {
  /* Colores primarios de marca */
  --brand-blue: #31bdeb;      /* Peticiones - Informativo */
  --brand-green-dark: #1ab273; /* Resuelto - Éxito */
  --brand-green-light: #8dc853; /* Sugerencias - Positivo */
  --brand-dark: #0d0e20;       /* Textos principales */

  /* Colores semánticos PQRS */
  --pqrs-peticion: #31bdeb;    /* Azul - Peticiones */
  --pqrs-queja: #e57373;       /* Rojo - Quejas */
  --pqrs-reclamo: #f0c88d;     /* Amarillo - Reclamos */
  --pqrs-sugerencia: #8dc853;  /* Verde claro - Sugerencias */

  /* Estados */
  --status-pending: #f0c88d;
  --status-in-progress: #31bdeb;
  --status-resolved: #1ab273;
  --status-closed: #6b6880;
}
```

## 2. Tipografía

```css
/* Jerarquía tipográfica */
--font-sans: 'Geist', sans-serif;           /* UI general */
--font-mono: 'JetBrains Mono', monospace;   /* Códigos, botones */

/* Tamaños */
--text-xs: 0.75rem;    /* 12px - Labels pequeños */
--text-sm: 0.875rem;   /* 14px - Texto secundario */
--text-base: 1rem;     /* 16px - Texto base */
--text-lg: 1.125rem;   /* 18px - Subtítulos */
--text-xl: 1.25rem;    /* 20px - Títulos de cards */
--text-2xl: 1.5rem;    /* 24px - Títulos de sección */
--text-3xl: 2rem;      /* 32px - Métricas grandes */
```

## 3. Estructura del Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR          │ HEADER                                   │
│ ┌───────────┐    │ Logo + Título + Filtros + Usuario       │
│ │ Logo      │    ├─────────────────────────────────────────┤
│ │           │    │ MÉTRICAS RESUMEN (4 cards)              │
│ │ Nav       │    │ ┌────┐ ┌────┐ ┌────┐ ┌────┐            │
│ │ - Dashboard│   │ │ P  │ │ Q  │ │ R  │ │ S  │            │
│ │ - PQRS    │    │ └────┘ └────┘ └────┘ └────┘            │
│ │ - Reportes│    ├─────────────────────────────────────────┤
│ │ - Config  │    │ GRÁFICOS                                │
│ │           │    │ ┌──────────────┐ ┌──────────────┐       │
│ └───────────┘    │ │ Tendencia    │ │ Distribución │       │
│                  │ │ (Line Chart) │ │ (Pie Chart)  │       │
│                  │ └──────────────┘ └──────────────┘       │
│                  ├─────────────────────────────────────────┤
│                  │ TABLA DE CLASIFICACIÓN                  │
│                  │ ┌─────────────────────────────────────┐ │
│                  │ │ ID | Tipo | Estado | Fecha | Acción│ │
│                  │ └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 4. Componentes Clave

### 4.1 Metric Card
```tsx
// Tarjeta de métrica individual
interface MetricCardProps {
  title: string;        // "Peticiones", "Quejas", etc.
  value: number;        // Cantidad
  trend: number;        // % cambio
  color: string;        // Color del tipo PQRS
  icon: ReactNode;
}
```

**Estilos:**
```css
.metric-card {
  background: var(--card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--pqrs-color);
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.metric-value {
  font-size: var(--text-3xl);
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--foreground);
}
```

### 4.2 Botón Primario (Estilo 30)
```css
.btn-primary {
  align-items: center;
  appearance: none;
  background-color: var(--brand-blue);
  border-radius: 4px;
  border-width: 0;
  box-shadow:
    rgba(13, 14, 32, 0.4) 0 2px 4px,
    rgba(13, 14, 32, 0.3) 0 7px 13px -3px,
    rgba(49, 189, 235, 0.3) 0 -3px 0 inset;
  color: white;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-mono);
  height: 48px;
  justify-content: center;
  padding: 0 16px;
  transition: box-shadow 0.15s, transform 0.15s;
  font-size: 16px;
}

.btn-primary:hover {
  box-shadow:
    rgba(13, 14, 32, 0.4) 0 4px 8px,
    rgba(13, 14, 32, 0.3) 0 7px 13px -3px,
    rgba(49, 189, 235, 0.3) 0 -3px 0 inset;
  transform: translateY(-2px);
}

.btn-primary:active {
  box-shadow: rgba(49, 189, 235, 0.4) 0 3px 7px inset;
  transform: translateY(2px);
}
```

### 4.3 Badge de Clasificación
```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
}

.badge-peticion { background: #31bdeb20; color: #31bdeb; }
.badge-queja { background: #e5737320; color: #e57373; }
.badge-reclamo { background: #f0c88d20; color: #d4a056; }
.badge-sugerencia { background: #8dc85320; color: #6fa33f; }
```

### 4.4 Status Indicator
```css
.status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-pending .status-dot { background: var(--status-pending); }
.status-progress .status-dot { background: var(--status-in-progress); }
.status-resolved .status-dot { background: var(--status-resolved); }
```

## 5. Gráficos (Recharts)

### Colores para gráficos
```tsx
const CHART_COLORS = {
  peticion: '#31bdeb',
  queja: '#e57373',
  reclamo: '#f0c88d',
  sugerencia: '#8dc853',
};

// Para gráficos de tendencia
const TREND_COLORS = ['#31bdeb', '#1ab273', '#8dc853', '#f0c88d'];
```

## 6. Espaciado y Grid

```css
/* Sistema de espaciado basado en 4px */
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */

/* Grid del dashboard */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

## 7. Animaciones

```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-in {
  animation: fadeIn 0.3s ease-out;
}
```

## 8. Estructura de Archivos Sugerida

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Table.tsx
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── TrendChart.tsx
│   │   ├── DistributionChart.tsx
│   │   └── ClassificationTable.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       └── Header.tsx
├── styles/
│   ├── globals.css      (variables CSS)
│   └── components.css   (estilos de componentes)
└── pages/
    └── Dashboard.tsx
```

## 9. Iconos Recomendados

Usar **Lucide React** para consistencia:
- `FileText` - Peticiones
- `AlertCircle` - Quejas
- `AlertTriangle` - Reclamos
- `Lightbulb` - Sugerencias
- `TrendingUp` / `TrendingDown` - Tendencias
- `Clock` - Pendiente
- `CheckCircle` - Resuelto
