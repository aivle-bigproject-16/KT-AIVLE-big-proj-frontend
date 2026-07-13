import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { useSignupStore } from '@/features/auth'

function SignupPage() {
  const isLoading = useSignupStore((s) => s.isLoading)
  const isDone = useSignupStore((s) => s.isDone)
  const error = useSignupStore((s) => s.error)
  const { signup } = useSignupStore((s) => s.actions)

  useEffect(() => {
    signup({ email: 'testid123', password: 'testpass123!', name: '테스트' })
  }, [signup])

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h2>회원가입</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isDone && <p>가입 완료</p>}
      <Link to={ROUTES.AUTH_LOGIN}>로그인으로</Link>
    </div>
  )
}

export default SignupPage
