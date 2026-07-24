import './DefectDonut.css'
import { DEFECT_COLORS } from './defectColors'
import type { DefectStat } from '../types'

interface DefectDonutProps {
  defects: DefectStat[]
}

function DefectDonut({ defects }: DefectDonutProps) {
  const total = defects.reduce((sum, d) => sum + d.count, 0)
  const radius = 70
  const strokeWidth = 24
  const circumference = 2 * Math.PI * radius

  const segments = defects.reduce<{ defectType: string; dash: number; offset: number }[]>((acc, d) => {
    const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
    const dash = (d.count / total) * circumference
    acc.push({ defectType: d.defectType, dash, offset: prevOffset })
    return acc
  }, [])

  return (
    <div className="defect-donut">
      <svg viewBox="0 0 200 200" className="defect-donut__chart" role="img" aria-label="결함 유형별 분포">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#e1e0d9" strokeWidth={strokeWidth} />
        {segments.map((s, i) => (
          <circle
            key={s.defectType}
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={DEFECT_COLORS[i % DEFECT_COLORS.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${s.dash} ${circumference - s.dash}`}
            strokeDashoffset={-s.offset}
            transform="rotate(-90 100 100)"
          />
        ))}
      </svg>
      <div className="defect-donut__center">
        <span className="defect-donut__total">{total.toLocaleString()}</span>
        <span className="defect-donut__total-label">Total</span>
      </div>
    </div>
  )
}

export default DefectDonut
