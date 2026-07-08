import { Link } from 'react-router-dom'
import { BatteryListMockTable } from '@/features/battery'

function BatteryMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/">← 메인으로</Link>
      <BatteryListMockTable />
    </div>
  )
}

export default BatteryMockPage
