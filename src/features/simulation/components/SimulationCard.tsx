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
  /** 지정하면 current/total 비율 대신, 이 시간(초) 동안 0→100%로 채워지는 애니메이션 바를 사용한다. */
  progressDurationSec?: number
  /** progressDurationSec 사용 시 이 값이 바뀔 때마다 애니메이션을 처음부터 다시 시작한다(예: 새 배치의 batchId). */
  progressKey?: string | number
}

function SimulationCard({
  label,
  icon,
  iconColor,
  current,
  total,
  unit,
  compact,
  progressDurationSec,
  progressKey,
}: SimulationCardProps) {
  const progress = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0
  const isTimed = progressDurationSec != null && progressDurationSec > 0

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
          {isTimed ? (
            <div
              key={progressKey}
              className="simulation-card__progress-fill simulation-card__progress-fill--timed"
              style={{ animationDuration: `${progressDurationSec}s` }}
            />
          ) : (
            <div className="simulation-card__progress-fill" style={{ width: `${progress}%` }} />
          )}
        </div>
      </div>
    </div>
  )
}

export default SimulationCard
