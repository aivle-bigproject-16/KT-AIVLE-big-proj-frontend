import { IndividualReportMockList, ReportTypeToggle } from '@/features/reports'

function IndividualReportPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ReportTypeToggle />
      </div>
      <IndividualReportMockList />
    </div>
  )
}

export default IndividualReportPage
