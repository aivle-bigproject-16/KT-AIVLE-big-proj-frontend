import { Link, useParams } from 'react-router-dom'
import { DailyReportDetailMockCard } from '@/features/report'

function DailyReportDetailMockPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/report/daily">← 일일 리포트 목록으로</Link>
      <DailyReportDetailMockCard reportId={Number(reportId)} />
    </div>
  )
}

export default DailyReportDetailMockPage
