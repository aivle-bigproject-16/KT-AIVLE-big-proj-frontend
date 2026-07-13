import { useEffect, useState } from 'react'
import './RejectCauseChart.css'
import { dashboardService } from '@/features/dashboard/services/dashboardService'
import type { GraphDataItem } from '@/features/dashboard/types'

// 8-hue 고정 순서 카테고리 팔레트(색맹 안전성 검증됨) — slot 1부터 순서대로 배정
const SLICE_COLORS = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834']

function getReadableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? '#191c1d' : '#ffffff'
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function describeSlice(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`
}

function RejectCauseChart() {
  // useDashboardStore의 graphData는 DashboardMockPanel(DAILY_TREND)과 공유되는 단일 슬롯이라
  // 같은 페이지에서 동시에 다른 graphType을 요청하면 서로 덮어써버린다. 그래서 이 차트는
  // 스토어를 거치지 않고 서비스를 직접 호출해 로컬 상태로 들고 있는다.
  const [graphData, setGraphData] = useState<GraphDataItem[]>([])

  useEffect(() => {
    let cancelled = false

    dashboardService
      .getDashboard({
        todayDate: '2026-07-07',
        startDate: '2026-07-01',
        size: 5,
        graphType: 'DEFECT_TYPE',
      })
      .then((res) => {
        if (!cancelled) setGraphData(res.data.graphData)
      })
      .catch(() => {
        if (!cancelled) setGraphData([])
      })

    return () => {
      cancelled = true
    }
  }, [])

  const total = graphData.reduce((sum, item) => sum + item.value, 0)

  const cx = 100
  const cy = 100
  const r = 80
  let cursorAngle = 0

  const slices = graphData.map((item, index) => {
    const ratio = total > 0 ? item.value / total : 0
    const startAngle = cursorAngle
    const endAngle = cursorAngle + ratio * 360
    cursorAngle = endAngle

    const midAngle = (startAngle + endAngle) / 2
    const labelPos = polarToCartesian(cx, cy, r * 0.65, midAngle)
    const color = SLICE_COLORS[index % SLICE_COLORS.length]

    return {
      label: item.label,
      value: item.value,
      percent: Math.round(ratio * 1000) / 10,
      color,
      path: describeSlice(cx, cy, r, startAngle, endAngle),
      labelPos,
      textColor: getReadableTextColor(color),
    }
  })

  return (
    <div className="reject-cause-chart">
      <h4 className="reject-cause-chart__title">REJECT 원인 분포</h4>
      {total === 0 ? (
        <p className="reject-cause-chart__empty">데이터가 없습니다.</p>
      ) : (
        <div className="reject-cause-chart__body">
          <svg
            className="reject-cause-chart__svg"
            viewBox="0 0 200 200"
            role="img"
            aria-label="REJECT 원인별 분포 파이 차트"
          >
            {slices.map((slice) => (
              <path key={slice.label} d={slice.path} fill={slice.color}>
                <title>{`${slice.label}: ${slice.value}건 (${slice.percent}%)`}</title>
              </path>
            ))}
            {slices.map((slice) =>
              slice.percent >= 8 ? (
                <text
                  key={`${slice.label}-label`}
                  x={slice.labelPos.x}
                  y={slice.labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="reject-cause-chart__slice-label"
                  fill={slice.textColor}
                >
                  {slice.percent}%
                </text>
              ) : null,
            )}
          </svg>
          <ul className="reject-cause-chart__legend">
            {slices.map((slice) => (
              <li key={slice.label} className="reject-cause-chart__legend-item">
                <span className="reject-cause-chart__legend-dot" style={{ background: slice.color }} />
                <span className="reject-cause-chart__legend-label">{slice.label}</span>
                <span className="reject-cause-chart__legend-value">
                  {slice.value}건 ({slice.percent}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export { RejectCauseChart }
