import { DashboardMockPanel, SimulationMockPanel, Simulation } from '@/features/dashboard'

function DashboardPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Simulation />
      <DashboardMockPanel />
      <SimulationMockPanel />
    </div>
  )
}

export default DashboardPage
