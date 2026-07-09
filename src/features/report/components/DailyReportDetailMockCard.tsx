import { useEffect } from 'react'
import { useDailyReportDetailStore } from '../store/useDailyReportDetailStore'

interface DailyReportDetailMockCardProps {
  reportId: number
}

function DailyReportDetailMockCard({ reportId }: DailyReportDetailMockCardProps) {
  const detail = useDailyReportDetailStore((s) => s.detail)
  const isLoading = useDailyReportDetailStore((s) => s.isLoading)
  const error = useDailyReportDetailStore((s) => s.error)
  const { fetchDetail } = useDailyReportDetailStore((s) => s.actions)

  useEffect(() => {
    fetchDetail(reportId)
  }, [fetchDetail, reportId])

  return (
    <section>
      <h2>일일 리포트 상세 (reportId: {reportId})</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {detail && (
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
          {JSON.stringify(detail, null, 2)}
        </pre>
      )}
    </section>
  )
}

export default DailyReportDetailMockCard
