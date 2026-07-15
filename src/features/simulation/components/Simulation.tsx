import { useState, useEffect, useRef, type ReactNode } from 'react'
import './Simulation.css'
import { InputIcon, CaptureIcon, AnalysisIcon, SimControlIcon, CheckIcon, AlertIcon } from './Icons'
import SimulationCard from './SimulationCard'
import AnalysisCard from './AnalysisCard'
import CompactCard from './CompactCard'
import SimControlPanel from './SimControlPanel'
import { SimulationCardModal } from './SimulationCardModal'
import { useSimulationStore } from '../store/useSimulationStore'
import { useSimulationSocket } from '../hooks/useSimulationSocket'

const ACCENT_COLOR = '#E60012'
const TEXT_SECONDARY = '#5B5F63'

function VariantLabel({ children }: { children: ReactNode }) {
  return <p className="simulation__variant-label">{children}</p>
}

function Simulation() {
  useSimulationSocket()

  const [isControlOpen, setIsControlOpen] = useState(false)
  type ModalCard = 'pending' | 'capture' | 'analyze' | 'pass' | 'reject' | 'fail' | null
  const [modalCard, setModalCard] = useState<ModalCard>(null)

  const batteryCellCount = useSimulationStore((s) => s.batteryCellCount)
  const registered = useSimulationStore((s) => s.registered)
  const capture = useSimulationStore((s) => s.capture)
  const analyze = useSimulationStore((s) => s.analyze)
  const completed = useSimulationStore((s) => s.completed)
  const captureSpeed = useSimulationStore((s) => s.captureSpeed)

  // 단일 기준 타임스탬프: 모든 애니메이션의 origin
  const [captureAnimStart, setCaptureAnimStart] = useState<number>(0)
  const [displayAnalyze, setDisplayAnalyze] = useState(analyze)
  const pendingAnalyzeRef = useRef(analyze)
  pendingAnalyzeRef.current = analyze

  useEffect(() => {
    if (capture?.batchId != null) {
      setCaptureAnimStart(performance.now())
    }
  }, [capture?.batchId])

  useEffect(() => {
    if (analyze == null) setDisplayAnalyze(null)
  }, [analyze])

  const handleCaptureFillComplete = () => {
    setDisplayAnalyze(pendingAnalyzeRef.current)
  }

  const registeredCellCount = registered.reduce((sum, batch) => sum + batch.cells.length, 0)
  const capturingCellCount = capture?.cells.length ?? 0
  const analyzingCellCount = displayAnalyze?.cells.length ?? 0

  const completedCells = completed.flatMap((batch) => batch.cells)
  const passCount = completedCells.filter((cell) => cell.finalLabel === 'PASS').length
  const rejectCount = completedCells.filter((cell) => cell.finalLabel === 'REJECT').length
  const failCount = completedCells.filter((cell) => cell.finalLabel === 'FAIL').length
  const completedCount = completedCells.length

  return (
    <section className="simulation">
      <div className="simulation__header">
        <h3 className="simulation__title">Live Monitoring Flow</h3>
        <div className="simulation__control-wrapper">
          <button className="simulation__sim-control" onClick={() => setIsControlOpen((open) => !open)}>
            <SimControlIcon />
            Sim Control (시뮬레이션 제어)
          </button>
          {isControlOpen && <SimControlPanel onClose={() => setIsControlOpen(false)} />}
        </div>
      </div>

      <div className="simulation__body">
        {/*<VariantLabel>Variant 1: Glassmorphism Cards</VariantLabel>*/}
        <div className="simulation__cards">
          {/* 왼쪽 그룹: 대기 / 촬영 / 분析 */}
          <div className="simulation__cards-main">
            <SimulationCard
              label="대기 (PENDING)"
              icon={<InputIcon />}
              iconColor={TEXT_SECONDARY}
              current={registeredCellCount}
              total={batteryCellCount}
              unit="units"
              startAngle={-1.6}
              onClick={() => setModalCard('pending')}
            />
            <div key={`capture-${capture?.batchId ?? 'none'}`} className={`simulation__flow-line${capture !== null ? ' simulation__flow-line--active' : ''}`} aria-hidden="true" />
            <SimulationCard
              label="촬영 (CAPTURING)"
              icon={<CaptureIcon />}
              iconColor={ACCENT_COLOR}
              current={capturingCellCount}
              total={batteryCellCount}
              unit="active"
              startAngle={177.5}
              exitAngle={-1.6}
              progressDurationSec={capture ? (captureSpeed ?? undefined) : undefined}
              progressKey={capture?.batchId}
              batchId={capture?.batchId}
              animStartMs={captureAnimStart}
              onFillComplete={handleCaptureFillComplete}
              onClick={() => setModalCard('capture')}
            />
            <div key={`analyze-${displayAnalyze?.batchId ?? 'none'}`} className={`simulation__flow-line${displayAnalyze !== null ? ' simulation__flow-line--active' : ''}`} aria-hidden="true" />
            <AnalysisCard
              label="분석 (ANALYSIS)"
              icon={<AnalysisIcon />}
              iconColor={ACCENT_COLOR}
              current={analyzingCellCount}
              unit="queued"
              active={displayAnalyze !== null}
              batchId={displayAnalyze?.batchId}
              onClick={() => setModalCard('analyze')}
            />
          </div>

          {/* 오른쪽 그룹: 정상 / 불량 / 검사실패 */}
          <div className="simulation__cards-results">
            <CompactCard
              label="정상 (PASS)"
              icon={<CheckIcon />}
              iconColor={TEXT_SECONDARY}
              current={passCount}
              total={completedCount}
              unit="units"
              onClick={() => setModalCard('pass')}
            />
            <div className="simulation__cards-side-row">
              <CompactCard
                label="불량 (REJECT)"
                icon={<AlertIcon />}
                iconColor={ACCENT_COLOR}
                current={rejectCount}
                total={completedCount}
                unit="units"
                onClick={() => setModalCard('reject')}
              />
<CompactCard
                label="검사 실패 (FAIL)"
                icon={<AlertIcon />}
                iconColor={ACCENT_COLOR}
                current={failCount}
                total={completedCount}
                unit="units"
                onClick={() => setModalCard('fail')}
              />
            </div>
          </div>
        </div>
      </div>
      <SimulationCardModal
        open={modalCard === 'pending'}
        onClose={() => setModalCard(null)}
        label="대기 (PENDING)"
        batches={registered}
      />
      <SimulationCardModal
        open={modalCard === 'capture'}
        onClose={() => setModalCard(null)}
        label="촬영 (CAPTURING)"
        batches={capture ? [capture] : []}
      />
      <SimulationCardModal
        open={modalCard === 'analyze'}
        onClose={() => setModalCard(null)}
        label="분석 (ANALYSIS)"
        batches={analyze ? [analyze] : []}
      />
      <SimulationCardModal
        open={modalCard === 'pass'}
        onClose={() => setModalCard(null)}
        label="정상 (PASS)"
        batches={completed}
        statusSource="finalLabel"
        finalLabelFilter="PASS"
        emptyMessage="현재 정상(PASS) 셀이 없습니다."
      />
      <SimulationCardModal
        open={modalCard === 'reject'}
        onClose={() => setModalCard(null)}
        label="불량 (REJECT)"
        batches={completed}
        statusSource="finalLabel"
        finalLabelFilter="REJECT"
        emptyMessage="현재 불량(REJECT) 셀이 없습니다."
      />
      <SimulationCardModal
        open={modalCard === 'fail'}
        onClose={() => setModalCard(null)}
        label="검사 실패 (FAIL)"
        batches={completed}
        statusSource="finalLabel"
        finalLabelFilter="FAIL"
        emptyMessage="현재 검사 실패(FAIL) 셀이 없습니다."
      />
    </section>
  )
}

export { Simulation }
