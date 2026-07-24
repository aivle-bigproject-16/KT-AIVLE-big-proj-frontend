import { Simulation, KpiCards, ResultSummary } from '@/features/simulation'
import { DefectAnalysisChart } from '@/features/dashboard'
import './DashboardPage.css'

function DashboardPage() {
  return (
    <div className="dashboard">
      <KpiCards />
      <Simulation />
      <div className="dashboard__bottom">
        <div className="dashboard__defect">
          <DefectAnalysisChart />
        </div>
        <div className="dashboard__result">
          <ResultSummary />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
