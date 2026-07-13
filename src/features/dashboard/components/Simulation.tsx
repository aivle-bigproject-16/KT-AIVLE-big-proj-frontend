import './Simulation.css'
import { InputIcon, CaptureIcon, AnalysisIcon, SimControlIcon, CheckIcon, AlertIcon } from './Icons'
import { SimulationCard } from './SimulationCard'
import { useSimulationStore } from '../store/useSimulationStore'
import { useSimulationSocket } from '../hooks/useSimulationSocket'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

function Simulation() {
  useSimulationSocket()

  const batteryCellCount = useSimulationStore((s) => s.batteryCellCount)
  const registered = useSimulationStore((s) => s.registered)
  const capture = useSimulationStore((s) => s.capture)
  const analyze = useSimulationStore((s) => s.analyze)
  const completed = useSimulationStore((s) => s.completed)

  const registeredCellCount = registered.reduce((sum, batch) => sum + batch.cells.length, 0)
  const capturingCellCount = capture?.cells.length ?? 0
  const analyzingCellCount = analyze?.cells.length ?? 0

  const completedCells = completed.flatMap((batch) => batch.cells)
  const passCount = completedCells.filter((cell) => cell.finalLabel === 'PASS').length
  const rejectCount = completedCells.filter((cell) => cell.finalLabel === 'REJECT').length
  const completedCount = completedCells.length

  return (
    <section className="simulation">
      <div className="simulation__header">
        <h3 className="simulation__title">Live Monitoring Flow</h3>
        <button className="simulation__sim-control">
          <SimControlIcon />
          Sim Control (시뮬레이션 제어)
        </button>
      </div>

      <div className="simulation__cards">
        {/* current/total 모두 useSimulationStore(WS) 실연동 — total은 batteryCellCount(전체 셀 개수) */}
        <SimulationCard
          label="대기 (PENDING)"
          icon={<InputIcon />}
          iconColor={TEXT_SECONDARY}
          current={registeredCellCount}
          total={batteryCellCount}
          unit="units"
        />
        <div className="simulation__connector" aria-hidden="true" />
        <SimulationCard
          label="촬영 (CAPTURING)"
          icon={<CaptureIcon />}
          iconColor={ACCENT_COLOR}
          current={capturingCellCount}
          total={batteryCellCount}
          unit="active"
        />
        <div className="simulation__connector" aria-hidden="true" />
        <SimulationCard
          label="분석 (ANALYSIS)"
          icon={<AnalysisIcon />}
          iconColor={ACCENT_COLOR}
          current={analyzingCellCount}
          total={batteryCellCount}
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
          {/* current/total은 useSimulationStore의 completed 셀 목록에서 집계한 실연동 값 */}
          <SimulationCard
            compact
            label="정상 (PASS)"
            icon={<CheckIcon />}
            iconColor={TEXT_SECONDARY}
            current={passCount}
            total={completedCount}
            unit="units"
          />
          <SimulationCard
            compact
            label="불량 (REJECT)"
            icon={<AlertIcon />}
            iconColor={ACCENT_COLOR}
            current={rejectCount}
            total={completedCount}
            unit="units"
          />
        </div>
      </div>
    </section>
  )
}

export { Simulation }
