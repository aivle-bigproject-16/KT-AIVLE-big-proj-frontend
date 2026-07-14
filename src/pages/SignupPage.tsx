import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, UserIcon } from './AuthIcons'
import { ROUTES } from '@/core/navigation/routes'
import { useSignupStore } from '@/features/auth'

function SignupPage() {
  const navigate = useNavigate()
  const isLoading = useSignupStore((s) => s.isLoading)
  const isDone = useSignupStore((s) => s.isDone)
  const error = useSignupStore((s) => s.error)
  const { signup } = useSignupStore((s) => s.actions)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmError, setConfirmError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setConfirmError('비밀번호가 일치하지 않습니다.')
      return
    }
    setConfirmError(null)
    signup({ name, email, password })
  }

  if (isDone) {
    return (
      <AuthLayout>
        <h1 className="auth-title">가입 완료</h1>
        <p className="auth-subtitle">회원가입이 완료되었습니다. 로그인해 주세요.</p>
        <button type="button" className="auth-submit" onClick={() => navigate(ROUTES.AUTH_LOGIN)}>
          로그인하러 가기
        </button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="auth-title">회원가입</h1>
      <p className="auth-subtitle">정보를 입력하고 새 계정을 만드세요</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          <span className="auth-field-label">이름</span>
          <span className="auth-input-wrap">
            <UserIcon />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              autoComplete="name"
              required
            />
          </span>
        </label>

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
              autoComplete="new-password"
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

        <label className="auth-field">
          <span className="auth-field-label">비밀번호 확인</span>
          <span className="auth-input-wrap">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              autoComplete="new-password"
              required
            />
          </span>
        </label>

        {confirmError && <p className="auth-error">{confirmError}</p>}
        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={isLoading}>
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <p className="auth-switch">
        이미 계정이 있으신가요? <Link to={ROUTES.AUTH_LOGIN}>로그인</Link>
      </p>
    </AuthLayout>
  )
}

export default SignupPage
