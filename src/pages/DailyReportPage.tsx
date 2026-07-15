import { DailyReportTable, ReportTypeToggle } from '@/features/reports'

function DailyReportPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#F8F9FA', minHeight: '100%' }}>
      <DailyReportTable headerActions={<ReportTypeToggle />} />
    </div>
  )
}

export default DailyReportPage
