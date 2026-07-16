import { IndividualReportTable, ReportTypeToggle } from '@/features/reports'

function IndividualReportPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#F8F9FA', minHeight: '100%' }}>
      <IndividualReportTable headerActions={<ReportTypeToggle />} />
    </div>
  )
}

export default IndividualReportPage
