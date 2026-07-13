import { useEffect } from 'react'
import { useIndividualReportDetailStore } from '../store/useIndividualReportDetailStore'

interface IndividualReportDetailMockCardProps {
  reportId: number
}

function IndividualReportDetailMockCard({ reportId }: IndividualReportDetailMockCardProps) {
  const detail = useIndividualReportDetailStore((s) => s.detail)
  const isLoading = useIndividualReportDetailStore((s) => s.isLoading)
  const error = useIndividualReportDetailStore((s) => s.error)
  const { fetchDetail } = useIndividualReportDetailStore((s) => s.actions)

  useEffect(() => {
    fetchDetail(reportId)
  }, [fetchDetail, reportId])

  return (
    <section>
      <h2>개별 리포트 상세 (reportId: {reportId})</h2>
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

export default IndividualReportDetailMockCard
