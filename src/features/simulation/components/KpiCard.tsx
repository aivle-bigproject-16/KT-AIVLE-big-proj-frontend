import './KpiCards.css'

interface KpiCardProps {
  label: string
  value: string
  unit?: string
  accent?: boolean
  dotColor?: string
}

function KpiCard({ label, value, unit, accent, dotColor }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__value-row">
        {dotColor && <span className="kpi-card__dot" style={{ background: dotColor }} />}
        <span
          key={value}
          className={`kpi-card__value kpi-card__value--animate${accent ? ' kpi-card__value--accent' : ''}`}
        >
          {value}
        </span>
        {unit && <span className="kpi-card__unit">{unit}</span>}
      </div>
    </div>
  )
}

export { KpiCard }
