import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 200

/**
 * 모달 마운트/언마운트 타이밍을 애니메이션 duration에 맞춰 제어한다.
 * - open이 true  → 즉시 마운트, 다음 틱에 visible = true (fade-in 트리거)
 * - open이 false → visible = false (fade-out 트리거) → duration 후 언마운트
 */
function useModalAnimation(open: boolean) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (open) {
      setMounted(true)
      // 마운트 직후 바로 visible을 true로 하면 브라우저가 초기 상태를 건너뛸 수 있다.
      // requestAnimationFrame으로 한 프레임 뒤에 트리거한다.
      const raf = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      timerRef.current = setTimeout(() => setMounted(false), DURATION_MS)
    }
  }, [open])

  return { mounted, visible, durationMs: DURATION_MS }
}

export { useModalAnimation }
