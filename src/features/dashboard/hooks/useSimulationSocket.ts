import { useEffect } from 'react'
import { connectSimulationSocket } from '../services/simulationSocketService'
import { useSimulationStore } from '../store/useSimulationStore'
import type { SimulationProgressPayload } from '../types'

export function useSimulationSocket() {
  const { applyProgress, setWsStatus } = useSimulationStore((s) => s.actions)

  useEffect(() => {
    const socket = connectSimulationSocket()

    setWsStatus(socket.readyState === WebSocket.OPEN ? 'open' : 'connecting')

    socket.onopen = () => setWsStatus('open')

    socket.onmessage = (event) => {
      const payload: SimulationProgressPayload = JSON.parse(event.data)
      applyProgress(payload)
    }

    socket.onclose = () => setWsStatus('closed')

    // 언마운트되어도 연결은 닫지 않는다 — lifecycle은 모듈 싱글턴(simulationSocketService)이 관리.
    // 대시보드를 다시 마운트하면 이미 연결된 소켓을 그대로 재사용하고,
    // useSimulationStore에 남아있는 마지막 스냅샷으로 바로 렌더링된다.
  }, [applyProgress, setWsStatus])
}
