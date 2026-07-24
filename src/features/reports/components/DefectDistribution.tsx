import './DailyReportDetailCard.css'
import './DefectDistribution.css'
import DefectDonut from './DefectDonut'
import { DEFECT_COLORS } from './defectColors'
import type { DefectStat } from '../types'

interface DefectDistributionProps {
  defects: DefectStat[]
}

function DefectDistribution({ defects }: DefectDistributionProps) {
  const total = defects.reduce((sum, d) => sum + d.count, 0)

  return (
    <div className="defect-distribution">
      <h2 className="daily-detail__section-title">결함 유형별 분포 (DEFECT DISTRIBUTION)</h2>
      {total === 0 ? (
        <p className="daily-detail__empty">집계된 결함이 없습니다.</p>
      ) : (
        <div className="defect-distribution__body">
          <ul className="defect-distribution__legend">
            {defects.map((d, i) => (
              <li key={d.defectType} className="defect-distribution__legend-item">
                <span
                  className="defect-distribution__legend-dot"
                  style={{ background: DEFECT_COLORS[i % DEFECT_COLORS.length] }}
                />
                <span className="defect-distribution__legend-label">{d.defectType}</span>
                <span className="defect-distribution__legend-value">
                  {((d.count / total) * 100).toFixed(0)}% ({d.count})
                </span>
              </li>
            ))}
          </ul>
          <DefectDonut defects={defects} />
        </div>
      )}
    </div>
  )
}

export default DefectDistribution
