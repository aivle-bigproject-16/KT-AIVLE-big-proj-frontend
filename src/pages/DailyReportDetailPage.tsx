import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { DailyReportDetailMockCard } from '@/features/report'

function DailyReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to={ROUTES.REPORT_DAILY}>← 일일 리포트 목록으로</Link>
      <DailyReportDetailMockCard reportId={Number(reportId)} />
    </div>
  )
}

export default DailyReportDetailPage
