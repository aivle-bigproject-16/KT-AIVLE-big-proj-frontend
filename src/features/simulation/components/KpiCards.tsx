import { useEffect } from 'react'
import './KpiCards.css'
import { KpiCard } from './KpiCard'
import { useDashboardStore } from '@/features/dashboard'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

const PROCESS_STATUS_LABEL: Record<string, string> = {
  PENDING: '대기 중',
  RUNNING: '스캔 진행 중',
  COMPLETED: '완료',
}

function KpiCards() {
  const kpiData = useDashboardStore((s) => s.kpiData)
  const { fetchDashboard } = useDashboardStore((s) => s.actions)

  useEffect(() => {
    fetchDashboard({
      todayDate: '2026-07-07',
      startDate: '2026-07-01',
      size: 5,
      graphType: 'DAILY_TREND',
    })
  }, [fetchDashboard])

  const processStatus = kpiData?.processStatus

  return (
    <div className="kpi-cards">
      <KpiCard
        label="공정 상태 (PROCESS STATUS)"
        value={processStatus ? (PROCESS_STATUS_LABEL[processStatus] ?? processStatus) : '-'}
        dotColor={processStatus === 'RUNNING' ? ACCENT_COLOR : TEXT_SECONDARY}
      />
      <KpiCard
        label="총 검사 수 (TOTAL INSPECTIONS)"
        value={(kpiData?.totalInspections ?? 0).toLocaleString()}
        unit="units"
      />
      <KpiCard
        label="양품률 (YIELD RATE)"
        value={`${kpiData?.yieldRate ?? 0}%`}
        unit="target 99%"
        accent
      />
    </div>
  )
}

export { KpiCards }
