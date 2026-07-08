import { Link, useParams } from 'react-router-dom'
import { IndividualReportDetailMockCard } from '@/features/report'

function IndividualReportDetailMockPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/report/individual">← 개별 리포트 목록으로</Link>
      <IndividualReportDetailMockCard reportId={Number(reportId)} />
    </div>
  )
}

export default IndividualReportDetailMockPage
