import { useParams } from 'react-router-dom'
import { DailyReportDetailCard } from '@/features/reports'

function DailyReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#F8F9FA', minHeight: '100%' }}>
      <DailyReportDetailCard reportId={Number(reportId)} />
    </div>
  )
}

export default DailyReportDetailPage
