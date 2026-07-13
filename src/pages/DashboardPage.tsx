import { Simulation, KpiCards, ResultSummary, DefectAnalysisChart } from '@/features/simulation'

function DashboardPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <KpiCards />
      <Simulation />
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ display: 'flex', flex: 2 }}>
          <DefectAnalysisChart />
        </div>
        <div style={{ display: 'flex', flex: 3 }}>
          <ResultSummary />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
