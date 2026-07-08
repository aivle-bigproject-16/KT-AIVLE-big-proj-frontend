import { Link } from 'react-router-dom'
import { IndividualReportMockList } from '@/features/report'

function IndividualReportMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/">← 메인으로</Link>
      <IndividualReportMockList />
    </div>
  )
}

export default IndividualReportMockPage
