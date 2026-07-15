import { useEffect, useRef, useState, type ReactNode } from 'react'
import RingCard, { CIRC, R } from './RingCard'

const SPIN_DASH = CIRC * 0.25
const FADE_DUR = 400

interface AnalysisCardProps {
  label: string
  icon?: ReactNode
  iconColor?: string
  current: number
  unit: string
  active: boolean
  batchId?: number | null
  onClick?: () => void
}

type Phase = 'idle' | 'fadeout' | 'spin'

function AnalysisCard({ label, current, unit, active, batchId, onClick }: AnalysisCardProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [spinKey, setSpinKey] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const prevActiveRef = useRef(false)

  const [displayBatchId, setDisplayBatchId] = useState<number | null>(batchId ?? null)
  const [isBatchIdVisible, setIsBatchIdVisible] = useState(batchId != null)

  useEffect(() => {
    if (batchId != null) {
      setDisplayBatchId(batchId)
      setIsBatchIdVisible(true)
    } else {
      setIsBatchIdVisible(false)
      const t = setTimeout(() => setDisplayBatchId(null), 300)
      return () => clearTimeout(t)
    }
  }, [batchId])

  useEffect(() => {
    clearTimeout(timerRef.current)

    if (!active) {
      if (prevActiveRef.current) {
        // 기존 아이템 사라짐: 스피닝 페이드 아웃
        setPhase('fadeout')
        timerRef.current = setTimeout(() => setPhase('idle'), FADE_DUR)
      }
      prevActiveRef.current = false
      return
    }

    // 새 배치 도착: 바로 페이드 인
    setPhase('spin')
    setSpinKey((k) => k + 1)
    prevActiveRef.current = true

    return () => clearTimeout(timerRef.current)
  }, [active])

  let arc: ReactNode = null
  if (phase === 'fadeout') {
    arc = (
      <circle
        cx="125" cy="125" r={R}
        fill="none" stroke="#0052FF" strokeWidth="9"
        strokeDasharray={`${SPIN_DASH} ${CIRC - SPIN_DASH}`}
        strokeDashoffset={0}
        className="sim-card__arc--spin sim-card__arc--fadeout-spin"
      />
    )
  } else if (phase === 'spin') {
    arc = (
      <circle
        key={spinKey}
        cx="125" cy="125" r={R}
        fill="none" stroke="#0052FF" strokeWidth="9"
        strokeDasharray={`${SPIN_DASH} ${CIRC - SPIN_DASH}`}
        strokeDashoffset={0}
        className="sim-card__arc--spin sim-card__arc--fadein"
      />
    )
  }

  const pill = (
    <span
      key={displayBatchId ?? 'none'}
      className={`sim-card__pill${isBatchIdVisible ? '' : ' sim-card__pill--hidden'}`}
    >
      배치 ID · {displayBatchId ?? ''}
    </span>
  )

  return (
    <RingCard
      label={label}
      current={current}
      unit={unit}
      arc={arc}
      pill={pill}
      onClick={onClick}
    />
  )
}

export default AnalysisCard
