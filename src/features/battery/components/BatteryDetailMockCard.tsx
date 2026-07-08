import { useEffect } from 'react'
import { useBatteryDetailStore } from '../store/useBatteryDetailStore'

interface BatteryDetailMockCardProps {
  batteryCellId: number
}

function BatteryDetailMockCard({ batteryCellId }: BatteryDetailMockCardProps) {
  const detail = useBatteryDetailStore((s) => s.detail)
  const isLoading = useBatteryDetailStore((s) => s.isLoading)
  const error = useBatteryDetailStore((s) => s.error)
  const { fetchDetail } = useBatteryDetailStore((s) => s.actions)

  useEffect(() => {
    fetchDetail(batteryCellId)
  }, [fetchDetail, batteryCellId])

  return (
    <section>
      <h2>배터리 상세 (batteryCellId: {batteryCellId})</h2>
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

export default BatteryDetailMockCard
