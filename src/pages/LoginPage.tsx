import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { AuthMockPanel, useLoginStore } from '@/features/auth'

function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useLoginStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <AuthMockPanel />
      <Link to={ROUTES.AUTH_SIGNUP}>회원가입</Link>
    </div>
  )
}

export default LoginPage
