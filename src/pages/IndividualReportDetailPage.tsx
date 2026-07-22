import { useParams } from 'react-router-dom'
import { IndividualReportDetailCard } from '@/features/reports'

function IndividualReportDetailPage() {
  const { reportId } = useParams<{ reportId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#F8F9FA', minHeight: '100%' }}>
      <IndividualReportDetailCard reportId={Number(reportId)} />
    </div>
  )
}

export default IndividualReportDetailPage
