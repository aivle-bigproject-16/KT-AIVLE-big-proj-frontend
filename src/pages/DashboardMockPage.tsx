import { Link } from 'react-router-dom'
import { DashboardMockPanel } from '@/features/dashboard'

function DashboardMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/">← 메인으로</Link>
      <DashboardMockPanel />
    </div>
  )
}

export default DashboardMockPage
