import { useEffect, type ReactNode } from 'react'
import './Flow.css'
import { InputIcon, CaptureIcon, AnalysisIcon, SimControlIcon, ArrowRightIcon } from './Icons'
import FlowCard from './FlowCard'
import { useDashboardStore } from '../store/useDashboardStore'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

interface FlowStepProps {
  label: string
  value: string
  valueColor?: string
  caption: string
  dotVariant: 'filled-dark' | 'filled-accent' | 'outline'
  active?: boolean
}

function FlowStep({ label, value, valueColor, caption, dotVariant, active }: FlowStepProps) {
  const dotClassName = `flow-step__dot flow-step__dot--${
    dotVariant === 'outline' ? 'outline' : dotVariant === 'filled-accent' ? 'accent' : 'dark'
  }`

  return (
    <div className={`flow-step${active ? ' flow-step--active' : ''}`}>
      <div className="flow-step__header">
        <span className={dotClassName} />
        <span className="flow-step__label">{label}</span>
      </div>
      <span className="flow-step__value" style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </span>
      <span className="flow-step__caption">{caption}</span>
    </div>
  )
}

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

  const isRunning = kpiData?.processStatus === 'RUNNING'

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
            label="입고 (INPUT)"
            icon={<InputIcon />}
            iconColor={TEXT_SECONDARY}
            current={kpiData?.totalInspections ?? 0}
            total={1500}
            unit="units"
          />
          <FlowCard
            label="촬영 (CAPTURING)"
            icon={<CaptureIcon />}
            iconColor={ACCENT_COLOR}
            current={12}
            total={40}
            unit="active"
          />
          <FlowCard
            label="분석 (ANALYSIS)"
            icon={<AnalysisIcon />}
            iconColor={ACCENT_COLOR}
            current={4}
            total={40}
            unit="queued"
          />
          <div className="flow__cards-spacer" aria-hidden="true" />
        </div>
      </div>

      <div>
        <VariantLabel>Variant 2: Minimalist Industrial Grid</VariantLabel>
        <div className="flow__steps">
          <FlowStep
            label="입고 (INPUT)"
            value="ID: B-9921"
            caption="READY TO PROCESS"
            dotVariant="filled-dark"
          />
          <span className="flow__steps-arrow">
            <ArrowRightIcon />
          </span>
          <FlowStep
            label="촬영 (CAPTURING)"
            value={isRunning ? 'SCANNING...' : 'IDLE'}
            valueColor={isRunning ? ACCENT_COLOR : undefined}
            caption={isRunning ? 'CAMERA FEED ACTIVE' : 'PROCESS STATUS: ' + (kpiData?.processStatus ?? 'UNKNOWN')}
            dotVariant={isRunning ? 'filled-accent' : 'filled-dark'}
            active={isRunning}
          />
          <span className="flow__steps-arrow">
            <ArrowRightIcon />
          </span>
          <FlowStep
            label="분석 (ANALYSIS)"
            value="5.2ms"
            caption="INFERENCE LATENCY"
            dotVariant="outline"
          />
        </div>
      </div>
    </section>
  )
}

export default Flow
