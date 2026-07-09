import { DashboardMockPanel, SimulationMockPanel } from '@/features/dashboard'

function DashboardPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <DashboardMockPanel />
      <SimulationMockPanel />
    </div>
  )
}

export default DashboardPage
