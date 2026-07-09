import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { useLoginStore } from '@/features/auth'

function AppHeader() {
  const navigate = useNavigate()
  const name = useLoginStore((s) => s.name)
  const { reset } = useLoginStore((s) => s.actions)

  const handleLogout = () => {
    reset()
    navigate(ROUTES.AUTH_LOGIN)
  }

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        borderBottom: '1px solid #30363d',
        fontFamily: 'sans-serif',
      }}
    >
      <nav style={{ display: 'flex', gap: 16 }}>
        <Link to={ROUTES.DASHBOARD}>대시보드</Link>
        <Link to={ROUTES.BATTERY}>배터리</Link>
        <Link to={ROUTES.REPORT_INDIVIDUAL}>개별 리포트</Link>
        <Link to={ROUTES.REPORT_DAILY}>일일 리포트</Link>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {name && <span>{name}님</span>}
        <button onClick={handleLogout}>로그아웃</button>
      </div>
    </header>
  )
}

export default AppHeader
