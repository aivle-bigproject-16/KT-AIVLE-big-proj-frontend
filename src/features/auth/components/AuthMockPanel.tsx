import { useEffect } from 'react'
import { useLoginStore } from '../store/useLoginStore'

function AuthMockPanel() {
  const name = useLoginStore((s) => s.name)
  const role = useLoginStore((s) => s.role)
  const isAuthenticated = useLoginStore((s) => s.isAuthenticated)
  const isLoading = useLoginStore((s) => s.isLoading)
  const error = useLoginStore((s) => s.error)
  const { login } = useLoginStore((s) => s.actions)

  useEffect(() => {
    login({ id: 'testid123', password: 'testpass123!' })
  }, [login])

  return (
    <section>
      <h2>로그인 (auth)</h2>
      {isLoading && <p>로딩 중...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre
        style={{
          textAlign: 'left',
          background: '#0d1117',
          color: '#c9d1d9',
          padding: '16px 20px',
          borderRadius: 8,
          border: '1px solid #30363d',
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontSize: 13,
          lineHeight: 1.6,
          overflowX: 'auto',
        }}
      >
        {JSON.stringify({ isAuthenticated, name, role }, null, 2)}
      </pre>
    </section>
  )
}

export default AuthMockPanel
