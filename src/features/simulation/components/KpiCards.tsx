import './KpiCards.css'
import { KpiCard } from './KpiCard'
import { useSimulationStore } from '../store/useSimulationStore'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

const PROCESS_STATUS_LABEL: Record<string, string> = {
  PENDING: '대기 중',
  RUNNING: '진행 중',
  COMPLETED: '완료',
}

function KpiCards() {
  const event = useSimulationStore((s) => s.event)
  const completed = useSimulationStore((s) => s.completed)

  const totalInspections = completed.length
  const passCount = completed.filter((cell) => cell.finalLabel === 'PASS').length
  const yieldRate = totalInspections === 0 ? 0 : Math.round((passCount / totalInspections) * 1000) / 10

  const processStatus =
    event === 'PROGRESS'
      ? 'RUNNING'
      : event === 'COMPLETED' && totalInspections > 0
        ? 'COMPLETED'
        : 'PENDING'

  return (
    <div className="kpi-cards">
      <KpiCard
        label="공정 상태 (PROCESS STATUS)"
        value={processStatus ? (PROCESS_STATUS_LABEL[processStatus] ?? processStatus) : '-'}
        dotColor={processStatus === 'RUNNING' ? ACCENT_COLOR : TEXT_SECONDARY}
      />
      <KpiCard
        label="총 검사 수 (TOTAL INSPECTIONS)"
        value={totalInspections.toLocaleString()}
        unit="units"
      />
      <KpiCard
        label="양품률 (YIELD RATE)"
        value={`${yieldRate}%`}
        unit="target 99%"
        accent
      />
    </div>
  )
}

export { KpiCards }
