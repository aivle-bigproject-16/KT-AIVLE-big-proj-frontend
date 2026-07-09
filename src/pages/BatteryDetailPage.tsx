import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { BatteryDetailMockCard } from '@/features/battery'

function BatteryDetailPage() {
  const { batteryCellId } = useParams<{ batteryCellId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to={ROUTES.BATTERY}>← 배터리 목록으로</Link>
      <BatteryDetailMockCard batteryCellId={Number(batteryCellId)} />
    </div>
  )
}

export default BatteryDetailPage
