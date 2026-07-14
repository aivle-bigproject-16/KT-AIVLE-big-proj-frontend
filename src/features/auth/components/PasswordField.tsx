import { useState } from 'react'
import { LockIcon, EyeIcon, EyeOffIcon } from './AuthIcons'

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  autoComplete: string
}

function PasswordField({ label, value, onChange, placeholder, autoComplete }: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <label className="auth-field">
      <span className="auth-field-label">{label}</span>
      <span className="auth-input-wrap">
        <LockIcon />
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
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
  )
}

export { PasswordField }
