import { DashboardMockPanel, SimulationMockPanel, Simulation, KpiCards, ResultSummary } from '@/features/dashboard'

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
