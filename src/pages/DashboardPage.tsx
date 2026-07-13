import { DashboardMockPanel } from '@/features/dashboard'
import { Simulation, SimulationMockPanel, KpiCards, ResultSummary } from '@/features/simulation'

function DashboardPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <KpiCards />
      <Simulation />
      <ResultSummary />
      <DashboardMockPanel />
      <SimulationMockPanel />
    </div>
  )
}

export default DashboardPage
