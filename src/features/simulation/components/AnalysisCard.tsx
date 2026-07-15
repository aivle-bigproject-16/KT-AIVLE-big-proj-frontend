import { useEffect, useState, type ReactNode } from 'react'
import useCountUp from '../hooks/useCountUp'
import './Simulation.css'

const R = 115
const CIRC = 2 * Math.PI * R

const ANALYSIS_DURATION_SEC = 3

interface AnalysisCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  unit: string
  active: boolean
  batchId?: number | null
  onClick?: () => void
}

function AnalysisCard({ label, current, unit, active, batchId, onClick }: AnalysisCardProps) {
  const animatedCurrent = useCountUp(current, 0, 420)
  const [displayBatchId, setDisplayBatchId] = useState<number | null>(batchId ?? null)
  const [isBatchIdVisible, setIsBatchIdVisible] = useState(batchId != null)

  useEffect(() => {
    if (batchId != null) {
      setDisplayBatchId(batchId)
      setIsBatchIdVisible(true)
      return
    }
    setIsBatchIdVisible(false)
    const t = setTimeout(() => setDisplayBatchId(null), 180)
    return () => clearTimeout(t)
  }, [batchId])

  const isTimed = active

  return (
    <div className="sim-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="sim-card__ring-wrap">
        <svg className="sim-card__svg" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
          <circle cx="125" cy="125" r={R} fill="none" stroke="#003EC7" strokeOpacity="0.12" strokeWidth="9" />
          <circle
            key={String(batchId ?? 'none')}
            cx="125" cy="125" r={R}
            fill="none"
            stroke="#0052FF"
            strokeWidth="9"
            strokeDasharray={CIRC}
            strokeDashoffset={isTimed ? CIRC : CIRC}
            transform="rotate(177.5 125 125)"
            className={isTimed ? 'sim-card__arc--timed' : undefined}
            style={isTimed ? { animationDuration: `${Math.max(0, ANALYSIS_DURATION_SEC - 0.72)}s` } : undefined}
          />
        </svg>
        <div className="sim-card__glass">
          <span className="sim-card__value">{animatedCurrent.toLocaleString()}</span>
          <span className="sim-card__unit">{unit}</span>
        </div>
      </div>
      <p className="sim-card__label">{label}</p>
      <div className={`sim-card__pill${isBatchIdVisible ? '' : ' sim-card__pill--hidden'}`}>
        배치 ID · {displayBatchId ?? ''}
      </div>
    </div>
  )
}

export default AnalysisCard
