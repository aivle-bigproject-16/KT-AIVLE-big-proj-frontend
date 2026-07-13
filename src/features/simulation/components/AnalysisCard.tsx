import { useEffect, useState, type ReactNode } from 'react'
import useCountUp from '../hooks/useCountUp'
import './Simulation.css'

interface AnalysisCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  unit: string
  /** null이면 하단 스피너를 숨긴다. */
  active: boolean
  /** 하단에 표시할 현재 배치 ID */
  batchId?: number | null
}

function AnalysisCard({ label, icon, iconColor, current, unit, active, batchId }: AnalysisCardProps) {
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
    const hideTimer = setTimeout(() => setDisplayBatchId(null), 180)
    return () => clearTimeout(hideTimer)
  }, [batchId])

  return (
    <div className="simulation-card">
      <div className="simulation-card__header">
        <span className="simulation-card__label">{label}</span>
        <span className="simulation-card__icon" style={{ color: iconColor }}>
          {icon}
        </span>
      </div>

      <div className="simulation-card__body">
        <div className="simulation-card__value-row">
          <span className="simulation-card__value">{animatedCurrent.toLocaleString()}</span>
          <span className="simulation-card__unit">{unit}</span>
        </div>

        <div className="simulation-card__footer-row">
          <div className="simulation-card__snippet-area">
            {active && <span className="simulation-card__snippet-spinner" />}
          </div>
        </div>
      </div>
      <div className="simulation-card__batch-id-area">
        <span
          className={`simulation-card__batch-id ${
            isBatchIdVisible ? 'simulation-card__batch-id--visible' : 'simulation-card__batch-id--hidden'
          }`}
        >
          {displayBatchId != null ? `Batch ID : ${displayBatchId}` : ''}
        </span>
      </div>
    </div>
  )
}

export default AnalysisCard
