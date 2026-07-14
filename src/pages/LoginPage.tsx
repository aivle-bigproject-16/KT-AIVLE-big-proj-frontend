import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/core/navigation/routes'
import { AuthLayout, MailIcon, LockIcon, EyeIcon, EyeOffIcon, useLoginStore } from '@/features/auth'

function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useLoginStore((s) => s.isAuthenticated)
  const isLoading = useLoginStore((s) => s.isLoading)
  const error = useLoginStore((s) => s.error)
  const { login } = useLoginStore((s) => s.actions)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">로그인</h1>
      <p className="auth-subtitle">계정에 로그인하고 대시보드를 확인하세요</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field-label">이메일</span>
          <span className="auth-input-wrap">
            <MailIcon />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              autoComplete="email"
              required
            />
          </span>
        </label>

        <label className="auth-field">
          <span className="auth-field-label">비밀번호</span>
          <span className="auth-input-wrap">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-toggle-visibility"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </span>
        </label>

        <div className="auth-row">
          <label className="auth-remember">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            로그인 상태 유지
          </label>
          <a className="auth-link" href="#">
            비밀번호를 잊으셨나요?
          </a>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>

      <div className="auth-divider">
        <span>또는</span>
      </div>

      <p className="auth-switch">
        계정이 없으신가요? <Link to={ROUTES.AUTH_SIGNUP}>회원가입</Link>
      </p>
    </AuthLayout>
  )
}

export default LoginPage
