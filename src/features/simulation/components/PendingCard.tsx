import type { ReactNode } from 'react'
import RingCard, { CIRC, R } from './RingCard'

interface PendingCardProps {
  label: string
  icon?: ReactNode
  iconColor?: string
  current: number
  total: number
  unit: string
  startAngle?: number
  onClick?: () => void
}

function PendingCard({ label, current, total, unit, startAngle = -1.6, onClick }: PendingCardProps) {
  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0
  const offset = CIRC * (1 - progress / 100)

  return (
    <RingCard
      label={label}
      current={current}
      unit={unit}
      onClick={onClick}
      arc={
        <circle
          cx="125" cy="125" r={R}
          fill="none" stroke="#0052FF" strokeWidth="9"
          strokeDasharray={CIRC} strokeDashoffset={offset}
          transform={`rotate(${startAngle} 125 125)`}
          className="sim-card__arc--static"
        />
      }
    />
  )
}

export default PendingCard
