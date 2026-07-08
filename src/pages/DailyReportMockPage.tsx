import { Link } from 'react-router-dom'
import { DailyReportMockList } from '@/features/report'

function DailyReportMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/">← 메인으로</Link>
      <DailyReportMockList />
    </div>
  )
}

export default DailyReportMockPage
