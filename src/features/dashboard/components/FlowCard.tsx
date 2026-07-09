import type { ReactNode } from 'react'
import './Flow.css'

interface FlowCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  total: number
  unit: string
  compact?: boolean
}

function FlowCard({ label, icon, iconColor, current, total, unit, compact }: FlowCardProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className={`flow-card${compact ? ' flow-card--compact' : ''}`}>
      <div className="flow-card__header">
        <span className="flow-card__label">{label}</span>
        <span className="flow-card__icon" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>

      <div className="flow-card__body">
        <div className="flow-card__value-row">
          <span className="flow-card__value">{current.toLocaleString()}</span>
          <span className="flow-card__unit">{unit}</span>
        </div>

        <div className="flow-card__progress-track">
          <div className="flow-card__progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}

export default FlowCard
