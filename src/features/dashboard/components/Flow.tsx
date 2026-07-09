import { useEffect, type ReactNode } from 'react'
import './Flow.css'
import { InputIcon, CaptureIcon, AnalysisIcon, SimControlIcon, CheckIcon, AlertIcon } from './Icons'
import FlowCard from './FlowCard'
import { useDashboardStore } from '../store/useDashboardStore'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

function VariantLabel({ children }: { children: ReactNode }) {
  return <p className="flow__variant-label">{children}</p>
}

function Flow() {
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

  const totalInspections = kpiData?.totalInspections ?? 0
  const passCount = Math.round(totalInspections * ((kpiData?.yieldRate ?? 0) / 100))
  const rejectCount = totalInspections - passCount

  return (
    <section className="flow">
      <div className="flow__header">
        <h3 className="flow__title">Live Monitoring Flow</h3>
        <button className="flow__sim-control">
          <SimControlIcon />
          Sim Control (시뮬레이션 제어)
        </button>
      </div>

      <div>
        <VariantLabel>Variant 1: Glassmorphism Cards</VariantLabel>
        <div className="flow__cards">
          {/* current는 kpiData.totalInspections 실연동, total은 실제 용량 데이터 연동 전까지 사용하는 목업 값 */}
          <FlowCard
            label="대기 (PENDING)"
            icon={<InputIcon />}
            iconColor={TEXT_SECONDARY}
            current={kpiData?.totalInspections ?? 0}
            total={1500}
            unit="units"
          />
          <div className="flow__connector" aria-hidden="true" />
          <FlowCard
            label="촬영 (CAPTURING)"
            icon={<CaptureIcon />}
            iconColor={ACCENT_COLOR}
            current={12}
            total={40}
            unit="active"
          />
          <div className="flow__connector" aria-hidden="true" />
          <FlowCard
            label="분석 (ANALYSIS)"
            icon={<AnalysisIcon />}
            iconColor={ACCENT_COLOR}
            current={4}
            total={40}
            unit="queued"
          />
          <div className="flow__connector flow__connector--branch" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path
                d="M0 50 H50 M50 25 V75 M50 25 H100 M50 75 H100"
                stroke="#191C1D"
                strokeWidth="1"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <div className="flow__cards-side">
            {/* current/total은 kpiData.totalInspections·yieldRate로부터 산출한 실연동 값 */}
            <FlowCard
              compact
              label="정상 (PASS)"
              icon={<CheckIcon />}
              iconColor={TEXT_SECONDARY}
              current={passCount}
              total={totalInspections}
              unit="units"
            />
            <FlowCard
              compact
              label="불량 (REJECT)"
              icon={<AlertIcon />}
              iconColor={ACCENT_COLOR}
              current={rejectCount}
              total={totalInspections}
              unit="units"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Flow
