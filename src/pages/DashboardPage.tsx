import { Flow, DashboardMockPanel } from '@/features/dashboard'

function DashboardPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Flow />
      <DashboardMockPanel />
    </div>
  )
}

export default DashboardPage
