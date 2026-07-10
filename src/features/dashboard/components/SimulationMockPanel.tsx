import { useSimulationSocket } from '../hooks/useSimulationSocket'
import { useSimulationStore } from '../store/useSimulationStore'

function SimulationMockPanel() {
  useSimulationSocket()

  const registered = useSimulationStore((s) => s.registered)
  const capture = useSimulationStore((s) => s.capture)
  const analyze = useSimulationStore((s) => s.analyze)
  const completed = useSimulationStore((s) => s.completed)
  const wsStatus = useSimulationStore((s) => s.wsStatus)
  const lastProgressAt = useSimulationStore((s) => s.lastProgressAt)

  return (
    <section>
      <h2>시뮬레이션 진행 상황 (simulation.progress)</h2>
      <p>
        상태: {wsStatus}
        {lastProgressAt && ` · 마지막 수신: ${new Date(lastProgressAt).toLocaleTimeString()}`}
      </p>
      <pre
        style={{
          textAlign: 'left',
          background: '#0d1117',
          color: '#c9d1d9',
          padding: '16px 20px',
          borderRadius: 8,
          border: '1px solid #30363d',
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: 'auto',
        }}
      >
        {JSON.stringify({ registered, capture, analyze, completed }, null, 2)}
      </pre>
    </section>
  )
}

export { SimulationMockPanel }
