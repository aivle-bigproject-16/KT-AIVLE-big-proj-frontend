import { useEffect, useRef, useState, type ReactNode } from 'react'
import useCountUp from '../hooks/useCountUp'
import './Simulation.css'

const R = 115
const CIRC = 2 * Math.PI * R
const EXIT_DURATION = 800
const FILL_DELAY = 720

interface SimulationCardProps {
  label: string
  icon: ReactNode
  iconColor: string
  current: number
  total: number
  unit: string
  progressDurationSec?: number
  progressKey?: string | number
  batchId?: number | null
  startAngle?: number
  exitAngle?: number
  animStartMs?: number
  onFillComplete?: () => void
  onClick?: () => void
}

function SimulationCard({
  label,
  current,
  total,
  unit,
  progressDurationSec,
  progressKey,
  batchId,
  startAngle = 180,
  exitAngle,
  animStartMs,
  onFillComplete,
  onClick,
}: SimulationCardProps) {
  const animatedCurrent = useCountUp(current, 0, 600)
  const [displayBatchId, setDisplayBatchId] = useState<number | null>(batchId ?? null)
  const [isBatchIdVisible, setIsBatchIdVisible] = useState(batchId != null)
  const [stableKey, setStableKey] = useState(progressKey)
  const [isExiting, setIsExiting] = useState(false)

  const circleARef = useRef<SVGCircleElement>(null)
  const circleBRef = useRef<SVGCircleElement>(null)
  const fillARef = useRef<SVGCircleElement>(null)
  const fillBRef = useRef<SVGCircleElement>(null)
  const exitRafRef = useRef<number>(0)
  const fillRafRef = useRef<number>(0)
  const fillEndTimeRef = useRef<number>(0)
  const busyRef = useRef(false)
  const pendingKeyRef = useRef<typeof progressKey | undefined>(undefined)
  const nextKeyRef = useRef<typeof progressKey | undefined>(undefined)
  const onFillCompleteRef = useRef(onFillComplete)
  onFillCompleteRef.current = onFillComplete

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

  // fill t===1 도달 시 단일 트리거 — exit 시작 + 부모 알림을 동시에 처리
  const doExitRef = useRef<(nextKey: typeof progressKey) => void>()
  doExitRef.current = (nextKey) => {
    setIsExiting(true)
    setTimeout(() => {
      setIsExiting(false)
      setStableKey(nextKey ?? null)
      if (pendingKeyRef.current !== undefined) {
        const pending = pendingKeyRef.current
        pendingKeyRef.current = undefined
        nextKeyRef.current = pending
        // busyRef 유지: 새 fill이 완료될 때 doExit(pending) 실행
      } else {
        busyRef.current = false
        nextKeyRef.current = undefined
      }
    }, EXIT_DURATION + 100)
  }

  const handleFillCompleteRef = useRef<() => void>()
  handleFillCompleteRef.current = () => {
    onFillCompleteRef.current?.()
    if (nextKeyRef.current !== undefined) {
      doExitRef.current!(nextKeyRef.current)
    }
  }

  useEffect(() => {
    if (progressKey === stableKey) return
    if (stableKey == null) {
      setStableKey(progressKey)
      return
    }
    if (busyRef.current) {
      pendingKeyRef.current = progressKey
      return
    }
    busyRef.current = true
    const remaining = fillEndTimeRef.current - performance.now()
    if (remaining > 16 && isTimed) {
      // fill 진행 중 — fill 완료 시 handleFillComplete가 exit 실행
      nextKeyRef.current = progressKey
    } else {
      // fill 없음 또는 이미 종료 — 즉시 exit
      nextKeyRef.current = progressKey
      doExitRef.current!(progressKey)
    }
  }, [progressKey])

  // exit: exitAngle 수렴 (양 끝에서 exitAngle으로)
  useEffect(() => {
    if (!isExiting) return
    const startTime = performance.now()

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / EXIT_DURATION, 1)
      const half = CIRC / 2 * (1 - t)
      const da = `${half} ${CIRC - half}`
      if (circleARef.current) {
        circleARef.current.style.strokeDasharray = da
        circleARef.current.style.strokeDashoffset = '0'
      }
      if (circleBRef.current) {
        circleBRef.current.style.strokeDasharray = da
        circleBRef.current.style.strokeDashoffset = String(CIRC / 2 + half)
      }
      if (t < 1) exitRafRef.current = requestAnimationFrame(tick)
    }

    exitRafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(exitRafRef.current)
  }, [isExiting])

  // fill: startAngle에서 양 방향으로 확장
  const isTimed = progressDurationSec != null && progressDurationSec > 0

  useEffect(() => {
    if (!isTimed || stableKey == null) return
    cancelAnimationFrame(fillRafRef.current)

    // 단일 origin에서 fill 시작/종료 시각 계산
    const origin = animStartMs && animStartMs > 0 ? animStartMs : performance.now()
    const fillStartMs = origin + FILL_DELAY
    const fillEndMs = origin + (progressDurationSec ?? 0) * 1000
    const fillDur = fillEndMs - fillStartMs

    // exit 대기 기준을 upfront 설정
    fillEndTimeRef.current = fillEndMs

    // 초기 상태: 빈 원
    if (fillARef.current) {
      fillARef.current.style.strokeDasharray = `0 ${CIRC}`
      fillARef.current.style.strokeDashoffset = '0'
    }
    if (fillBRef.current) {
      fillBRef.current.style.strokeDasharray = `0 ${CIRC}`
      fillBRef.current.style.strokeDashoffset = String(CIRC / 2)
    }

    const delayMs = Math.max(0, fillStartMs - performance.now())
    const delayTimer = setTimeout(() => {
      const startTime = performance.now()
      // 실제 시작 시각 기준으로 종료 시각 갱신 (exit 대기에 사용)
      fillEndTimeRef.current = startTime + fillDur
      const tick = (now: number) => {
        const t = Math.min((now - startTime) / fillDur, 1)
        const half = CIRC / 2 * t
        const da = `${half} ${CIRC - half}`
        if (fillARef.current) {
          fillARef.current.style.strokeDasharray = da
          fillARef.current.style.strokeDashoffset = '0'
        }
        if (fillBRef.current) {
          fillBRef.current.style.strokeDasharray = da
          fillBRef.current.style.strokeDashoffset = String(CIRC / 2 + half)
        }
        if (t < 1) {
          fillRafRef.current = requestAnimationFrame(tick)
        } else {
          handleFillCompleteRef.current?.()
        }
      }
      fillRafRef.current = requestAnimationFrame(tick)
    }, delayMs)

    return () => {
      clearTimeout(delayTimer)
      cancelAnimationFrame(fillRafRef.current)
    }
  }, [stableKey, isTimed, animStartMs])

  const progress = total > 0 ? Math.min(100, (current / total) * 100) : 0
  const offset = CIRC * (1 - progress / 100)
  const eAngle = exitAngle ?? startAngle

  return (
    <div className="sim-card" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="sim-card__ring-wrap">
        <svg className="sim-card__svg" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
          <circle cx="125" cy="125" r={R} fill="none" stroke="#E0E7F8" strokeOpacity="1" strokeWidth="9" />
          {isExiting ? (
            <>
              <circle ref={circleARef} cx="125" cy="125" r={R}
                fill="none" stroke="#0052FF" strokeWidth="9"
                strokeDasharray={`${CIRC / 2} ${CIRC / 2}`} strokeDashoffset={0}
                transform={`rotate(${eAngle} 125 125)`} />
              <circle ref={circleBRef} cx="125" cy="125" r={R}
                fill="none" stroke="#0052FF" strokeWidth="9"
                strokeDasharray={`${CIRC / 2} ${CIRC / 2}`} strokeDashoffset={CIRC}
                transform={`rotate(${eAngle + 180} 125 125)`} />
            </>
          ) : isTimed ? (
            <>
              <circle ref={fillARef} cx="125" cy="125" r={R}
                fill="none" stroke="#0052FF" strokeWidth="9"
                strokeDasharray={`0 ${CIRC}`} strokeDashoffset={0}
                transform={`rotate(${startAngle} 125 125)`} />
              <circle ref={fillBRef} cx="125" cy="125" r={R}
                fill="none" stroke="#0052FF" strokeWidth="9"
                strokeDasharray={`0 ${CIRC}`} strokeDashoffset={CIRC / 2}
                transform={`rotate(${startAngle + 180} 125 125)`} />
            </>
          ) : (
            <circle
              cx="125" cy="125" r={R}
              fill="none" stroke="#0052FF" strokeWidth="9"
              strokeDasharray={CIRC} strokeDashoffset={offset}
              transform={`rotate(${startAngle} 125 125)`}
              className="sim-card__arc--static"
            />
          )}
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

export default SimulationCard
