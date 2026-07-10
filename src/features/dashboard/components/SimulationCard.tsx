import type { ReactNode } from 'react'
import './Simulation.css'

interface SimulationCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  total: number
  unit: string
  compact?: boolean
}

function SimulationCard({ label, icon, iconColor, current, total, unit, compact }: SimulationCardProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className={`simulation-card${compact ? ' simulation-card--compact' : ''}`}>
      <div className="simulation-card__header">
        <span className="simulation-card__label">{label}</span>
        <span className="simulation-card__icon" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>

      <div className="simulation-card__body">
        <div className="simulation-card__value-row">
          <span className="simulation-card__value">{current.toLocaleString()}</span>
          <span className="simulation-card__unit">{unit}</span>
        </div>

        <div className="simulation-card__progress-track">
          <div className="simulation-card__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

export { SimulationCard }
