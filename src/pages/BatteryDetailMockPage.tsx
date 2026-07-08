import { Link, useParams } from 'react-router-dom'
import { BatteryDetailMockCard } from '@/features/battery'

function BatteryDetailMockPage() {
  const { batteryCellId } = useParams<{ batteryCellId: string }>()

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/battery">← 배터리 목록으로</Link>
      <BatteryDetailMockCard batteryCellId={Number(batteryCellId)} />
    </div>
  )
}

export default BatteryDetailMockPage
