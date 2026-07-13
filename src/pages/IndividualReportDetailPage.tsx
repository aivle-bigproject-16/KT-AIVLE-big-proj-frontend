import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { IndividualReportDetailMockCard } from '@/features/reports'

function IndividualReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to={ROUTES.REPORT_INDIVIDUAL}>← 개별 리포트 목록으로</Link>
      <IndividualReportDetailMockCard reportId={Number(reportId)} />
    </div>
  )
}

export default IndividualReportDetailPage
