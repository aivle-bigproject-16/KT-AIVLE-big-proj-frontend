import type { ReactNode } from 'react'
import useCountUp from '../hooks/useCountUp'
import './Simulation.css'

const R = 80
const CIRC = 2 * Math.PI * R

interface CompactCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  total: number
  unit: string
  onClick?: () => void
}

function CompactCard({ label, current, total, unit, onClick }: CompactCardProps) {
  const animatedCurrent = useCountUp(current, 0, 420)
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0
  const offset = CIRC * (1 - progress / 100)

  return (
    <div
      className="sim-card sim-card--compact"
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <div className="sim-card__ring-wrap">
        <svg className="sim-card__svg" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
          <circle cx="90" cy="90" r={R} fill="none" stroke="#003EC7" strokeOpacity="0.12" strokeWidth="8" />
          <circle
            cx="90" cy="90" r={R}
            fill="none"
            stroke="#0052FF"
            strokeWidth="8"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 90 90)"
            className="sim-card__arc--static"
          />
        </svg>
        <div className="sim-card__glass">
          <span className="sim-card__value">{animatedCurrent.toLocaleString()}</span>
          <span className="sim-card__unit">{unit}</span>
        </div>
      </div>
      <p className="sim-card__label">{label}</p>
    </div>
  )
}

export default CompactCard
