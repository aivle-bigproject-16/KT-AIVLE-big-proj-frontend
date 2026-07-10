import { useEffect } from 'react'
import { useDashboardStore } from '../store/useDashboardStore'

function DashboardMockPanel() {
  const kpiData = useDashboardStore((s) => s.kpiData)
  const summaryData = useDashboardStore((s) => s.summaryData)
  const graphData = useDashboardStore((s) => s.graphData)
  const isLoading = useDashboardStore((s) => s.isLoading)
  const error = useDashboardStore((s) => s.error)
  const { fetchDashboard } = useDashboardStore((s) => s.actions)

  useEffect(() => {
    fetchDashboard({
      todayDate: '2026-07-07',
      startDate: '2026-07-01',
      size: 5,
      graphType: 'DAILY_TREND',
    })
  }, [fetchDashboard])

  return (
    <section>
      <h2>대시보드</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {kpiData && (
        <pre
          style={{
            textAlign: 'left',
            background: '#0d1117',
            color: '#c9d1d9',
            padding: '16px 20px',
            borderRadius: 8,
            border: '1px solid #30363d',
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontSize: 13,
            lineHeight: 1.6,
            overflowX: 'auto',
          }}
        >
          {JSON.stringify({ kpiData, summaryData, graphData }, null, 2)}
        </pre>
      )}
    </section>
  )
}

export { DashboardMockPanel }
