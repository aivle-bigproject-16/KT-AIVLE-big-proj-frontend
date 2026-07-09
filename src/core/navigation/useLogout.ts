import { useNavigate } from 'react-router-dom'
import { ROUTES } from './routes'
import { useLoginStore } from '@/features/auth'
import { disconnectSimulationSocket } from '@/features/dashboard'

export function useLogout() {
  const navigate = useNavigate()
  const { reset } = useLoginStore((s) => s.actions)

  return () => {
    disconnectSimulationSocket()
    reset()
    navigate(ROUTES.AUTH_LOGIN, { replace: true })
  }
}
