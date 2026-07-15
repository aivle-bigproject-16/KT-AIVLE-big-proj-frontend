import type { ReactNode } from 'react'
import useCountUp from '../hooks/useCountUp'
import './Simulation.css'

export const R = 115
export const CIRC = 2 * Math.PI * R

interface RingCardProps {
  label: string
  current: number
  unit: string
  arc: ReactNode
  pill?: ReactNode
  onClick?: () => void
}

function RingCard({ label, current, unit, arc, pill, onClick }: RingCardProps) {
  const animatedCurrent = useCountUp(current, 0, 600)

  return (
    <div className="sim-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="sim-card__ring-wrap">
        <svg className="sim-card__svg" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
          <circle cx="125" cy="125" r={R} fill="none" stroke="#E0E7F8" strokeWidth="9" />
          {arc}
        </svg>
        <div className="sim-card__glass">
          <span className="sim-card__value">{animatedCurrent.toLocaleString()}</span>
          <span className="sim-card__unit">{unit}</span>
          {pill}
        </div>
      </div>
      <p className="sim-card__label">{label}</p>
    </div>
  )
}

export default RingCard
