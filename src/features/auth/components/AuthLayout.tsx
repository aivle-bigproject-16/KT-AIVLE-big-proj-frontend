import type { ReactNode } from 'react'
import './AuthLayout.css'
import authBgPic from '@/assets/authBgPic.png'

interface AuthLayoutProps {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div
        className="auth-layout__visual"
        style={{ backgroundImage: `url(${authBgPic})` }}
        aria-hidden="true"
      >
        <div className="auth-layout__visual-overlay">
          <span className="auth-layout__brand-dot" />
          <span className="auth-layout__brand-name">배터리 검사 시스템</span>
        </div>
      </div>
      <div className="auth-layout__panel">
        <div className="auth-layout__form-wrap">{children}</div>
      </div>
    </div>
  )
}

export { AuthLayout }
