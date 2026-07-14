import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import { ROUTES } from '@/core/navigation/routes'
import { useLoginStore } from '@/features/auth'

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a19.4 19.4 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a19.5 19.5 0 0 1-2.16 3.19" />
      <path d="M1 1l22 22" />
      <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
    </svg>
  )
}

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
    <div className="login-page">
      <div className="login-page__visual" aria-hidden="true">
        <div className="login-page__visual-overlay">
          <span className="login-page__brand-dot" />
          <span className="login-page__brand-name">배터리 검사 시스템</span>
        </div>
      </div>
      <div className="login-page__panel">
        <div className="login-page__form-wrap">
          <h1 className="login-page__title">로그인</h1>
          <p className="login-page__subtitle">계정에 로그인하고 대시보드를 확인하세요</p>

          <form className="login-page__form" onSubmit={handleSubmit}>
            <label className="login-page__field">
              <span className="login-page__field-label">이메일</span>
              <span className="login-page__input-wrap">
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

            <label className="login-page__field">
              <span className="login-page__field-label">비밀번호</span>
              <span className="login-page__input-wrap">
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
                  className="login-page__toggle-visibility"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </span>
            </label>

            <div className="login-page__row">
              <label className="login-page__remember">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                로그인 상태 유지
              </label>
              <a className="login-page__forgot" href="#">
                비밀번호를 잊으셨나요?
              </a>
            </div>

            {error && <p className="login-page__error">{error}</p>}

            <button type="submit" className="login-page__submit" disabled={isLoading}>
              {isLoading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          <div className="login-page__divider">
            <span>또는</span>
          </div>

          <p className="login-page__signup">
            계정이 없으신가요? <Link to={ROUTES.AUTH_SIGNUP}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
