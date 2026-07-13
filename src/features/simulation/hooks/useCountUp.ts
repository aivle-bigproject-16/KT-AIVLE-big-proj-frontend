import { useEffect, useRef, useState } from 'react'

export default function useCountUp(end: number, start = 0, duration = 3000) {
  const [value, setValue] = useState(start)
  const frameRef = useRef<number | null>(null)
  const valueRef = useRef(start)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    const from = valueRef.current
    const to = end

    if (from === to) return

    const startedAt = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startedAt
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = Math.round(from + (to - from) * eased)

      setValue(next)

      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [end, duration])

  return value
}
