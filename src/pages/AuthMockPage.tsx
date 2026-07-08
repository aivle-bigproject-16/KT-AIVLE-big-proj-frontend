import { Link } from 'react-router-dom'
import { AuthMockPanel } from '@/features/auth'

function AuthMockPage() {
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <Link to="/">← 메인으로</Link>
      <AuthMockPanel />
    </div>
  )
}

export default AuthMockPage
