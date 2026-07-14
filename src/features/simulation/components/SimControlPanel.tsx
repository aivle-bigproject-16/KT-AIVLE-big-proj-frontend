import { useState, type FormEvent } from 'react'
import './Simulation.css'
import { useSimulationStore } from '../store/useSimulationStore'

interface SimControlPanelProps {
  onClose: () => void
}

function SimControlPanel({ onClose }: SimControlPanelProps) {
  const isStarting = useSimulationStore((s) => s.isStarting)
  const startError = useSimulationStore((s) => s.startError)
  const { start } = useSimulationStore((s) => s.actions)

  const [batchSize, setBatchSize] = useState(5)
  const [batteryCellCount, setBatteryCellCount] = useState(100)
  const [captureSpeed, setCaptureSpeed] = useState(3)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await start({ batchSize, batteryCellCount, captureSpeed })
    if (!useSimulationStore.getState().startError) onClose()
  }

  return (
    <form className="simulation__control-panel" onSubmit={handleSubmit}>
      <label className="simulation__control-field">
        배치 사이즈
        <input
          type="number"
          min={1}
          value={batchSize}
          onChange={(e) => setBatchSize(Number(e.target.value))}
          required
        />
      </label>
      <label className="simulation__control-field">
        배터리 셀 개수
        <input
          type="number"
          min={1}
          value={batteryCellCount}
          onChange={(e) => setBatteryCellCount(Number(e.target.value))}
          required
        />
      </label>
      <label className="simulation__control-field">
        촬영속도
        <input
          type="number"
          min={1}
          value={captureSpeed}
          onChange={(e) => setCaptureSpeed(Number(e.target.value))}
          required
        />
      </label>

      {startError && <p className="simulation__control-error">{startError}</p>}

      <div className="simulation__control-actions">
        <button type="button" onClick={onClose} disabled={isStarting}>
          취소
        </button>
        <button type="submit" disabled={isStarting}>
          {isStarting ? '시작 중...' : '시작'}
        </button>
      </div>
    </form>
  )
}

export default SimControlPanel
