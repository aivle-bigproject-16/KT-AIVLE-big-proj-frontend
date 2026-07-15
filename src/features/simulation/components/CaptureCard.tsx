import { useEffect, useRef, useState, type ReactNode } from 'react'
import RingCard, { CIRC, R } from './RingCard'

const FADE_DUR = 400

interface CaptureCardProps {
  label: string
  icon?: ReactNode
  iconColor?: string
  current: number
  total: number
  unit: string
  progressDurationSec?: number
  progressKey?: string | number
  batchId?: number | null
  startAngle?: number
  onClick?: () => void
}

type Phase = 'idle' | 'fadeout' | 'fill'

function CaptureCard({
  label,
  current,
  unit,
  progressDurationSec,
  progressKey,
  batchId,
  onClick,
}: CaptureCardProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [fillKey, setFillKey] = useState(0)
  const fillDurRef = useRef(0)
  const batchStartTimeRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const hasPrevFillRef = useRef(false)

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
    if (progressKey == null) {
      clearTimeout(timerRef.current)
      setPhase('idle')
      hasPrevFillRef.current = false
      return
    }

    batchStartTimeRef.current = performance.now()
    setPhase('fadeout')
    clearTimeout(timerRef.current)

    timerRef.current = setTimeout(() => {
      const elapsed = performance.now() - batchStartTimeRef.current
      const totalMs = (progressDurationSec ?? 0) * 1000
      fillDurRef.current = Math.max(200, totalMs - elapsed)
      setPhase('fill')
      setFillKey((k) => k + 1)
      hasPrevFillRef.current = true
    }, FADE_DUR)

    return () => clearTimeout(timerRef.current)
  }, [progressKey])

  const pill = (
    <span
      key={displayBatchId ?? 'none'}
      className={`sim-card__pill${isBatchIdVisible ? '' : ' sim-card__pill--hidden'}`}
    >
      Batch ID · {displayBatchId ?? ''}
    </span>
  )

  let arc: ReactNode = null

  if (phase === 'fadeout' && hasPrevFillRef.current) {
    arc = (
      <>
        <circle
          cx="125" cy="125" r={R}
          fill="none" stroke="#0052FF" strokeWidth="9"
          strokeDasharray={`${CIRC / 2} ${CIRC}`}
          transform="rotate(180 125 125)"
          className="sim-card__arc--capture-fadeout"
        />
        <circle
          cx="125" cy="125" r={R}
          fill="none" stroke="#0052FF" strokeWidth="9"
          strokeDasharray={`${CIRC / 2} ${CIRC}`}
          transform="rotate(180 125 125) scale(1,-1) translate(0,-250)"
          className="sim-card__arc--capture-fadeout"
        />
      </>
    )
  } else if (phase === 'fill') {
    arc = (
      <g
        key={fillKey}
        style={{ '--fill-dur': `${fillDurRef.current}ms` } as React.CSSProperties}
      >
        <circle
          cx="125" cy="125" r={R}
          fill="none" stroke="#0052FF" strokeWidth="9"
          strokeDasharray={`0 ${CIRC}`}
          transform="rotate(180 125 125)"
          className="sim-card__arc--capture-fill"
        />
        <circle
          cx="125" cy="125" r={R}
          fill="none" stroke="#0052FF" strokeWidth="9"
          strokeDasharray={`0 ${CIRC}`}
          transform="rotate(180 125 125) scale(1,-1) translate(0,-250)"
          className="sim-card__arc--capture-fill"
        />
      </g>
    )
  }

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

export default CaptureCard
