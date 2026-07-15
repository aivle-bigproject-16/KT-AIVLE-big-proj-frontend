import { DailyReportTable, ReportTypeToggle } from '@/features/reports'

function DailyReportPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', background: '#F8F9FA', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ReportTypeToggle />
      </div>
      <DailyReportTable />
    </div>
  )
}

export default DailyReportPage
