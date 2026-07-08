import { Link } from 'react-router-dom'

const links = [
  { to: '/auth', label: '로그인 (auth)' },
  { to: '/battery', label: '배터리' },
  { to: '/dashboard', label: '대시보드' },
  { to: '/report/individual', label: '개별 리포트' },
  { to: '/report/daily', label: '일일 리포트' },
]

function MainMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Mock 라우팅 메인</h1>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              padding: '12px 16px',
              border: '1px solid #ccc',
              borderRadius: 8,
              textDecoration: 'none',
              color: '#111',
              width: 240,
            }}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default MainMockPage
