import { useEffect, type ReactNode } from 'react'
import './Simulation.css'
import { InputIcon, CaptureIcon, AnalysisIcon, SimControlIcon, CheckIcon, AlertIcon } from './Icons'
import SimulationCard from './SimulationCard'
import { useDashboardStore } from '../store/useDashboardStore'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

function VariantLabel({ children }: { children: ReactNode }) {
  return <p className="simulation__variant-label">{children}</p>
}

function Simulation() {
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
    <section className="simulation">
      <div className="simulation__header">
        <h3 className="simulation__title">Live Monitoring Flow</h3>
        <button className="simulation__sim-control">
          <SimControlIcon />
          Sim Control (시뮬레이션 제어)
        </button>
      </div>

      <div>
        <VariantLabel>Variant 1: Glassmorphism Cards</VariantLabel>
        <div className="simulation__cards">
          {/* current는 kpiData.totalInspections 실연동, total은 실제 용량 데이터 연동 전까지 사용하는 목업 값 */}
          <SimulationCard
            label="대기 (PENDING)"
            icon={<InputIcon />}
            iconColor={TEXT_SECONDARY}
            current={kpiData?.totalInspections ?? 0}
            total={1500}
            unit="units"
          />
          <div className="simulation__connector" aria-hidden="true" />
          <SimulationCard
            label="촬영 (CAPTURING)"
            icon={<CaptureIcon />}
            iconColor={ACCENT_COLOR}
            current={12}
            total={40}
            unit="active"
          />
          <div className="simulation__connector" aria-hidden="true" />
          <SimulationCard
            label="분석 (ANALYSIS)"
            icon={<AnalysisIcon />}
            iconColor={ACCENT_COLOR}
            current={4}
            total={40}
            unit="queued"
          />
          <div className="simulation__connector simulation__connector--branch" aria-hidden="true">
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
          <div className="simulation__cards-side">
            {/* current/total은 kpiData.totalInspections·yieldRate로부터 산출한 실연동 값 */}
            <SimulationCard
              compact
              label="정상 (PASS)"
              icon={<CheckIcon />}
              iconColor={TEXT_SECONDARY}
              current={passCount}
              total={totalInspections}
              unit="units"
            />
            <SimulationCard
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

export { Simulation }
