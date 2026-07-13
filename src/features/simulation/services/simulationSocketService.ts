import { createSocket } from '@/core/api/socketClient'
import type { WsStatus } from '../types'

const BASE_DELAY_MS = 1000
const MAX_DELAY_MS = 30000

interface SimulationSocketCallbacks {
  onMessage: (data: unknown) => void
  onStatusChange: (status: WsStatus) => void
}

let socket: WebSocket | null = null
let callbacks: SimulationSocketCallbacks | null = null
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempt = 0

export function startSimulationSocket(cb: SimulationSocketCallbacks) {
  callbacks = cb

  if (socket && socket.readyState !== WebSocket.CLOSED) {
    cb.onStatusChange(socket.readyState === WebSocket.OPEN ? 'open' : 'connecting')
    return
  }

  connect()
}

export function disconnectSimulationSocket() {
  callbacks = null
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  reconnectAttempt = 0
  socket?.close()
  socket = null
}

function connect() {
  callbacks?.onStatusChange(reconnectAttempt === 0 ? 'connecting' : 'reconnecting')
  console.log('[ws] connecting...')

  const ws = createSocket('/ws/sim')
  socket = ws

  ws.onopen = () => {
    console.log('[ws] connected')
    if (socket !== ws) return // 이미 disconnect/재연결로 폐기된 세대의 소켓 — 무시
    reconnectAttempt = 0
    callbacks?.onStatusChange('open')
  }

  ws.onmessage = (event) => {
    console.log('[ws] message received:', event.data)
    if (socket !== ws) return
    try {
      const data = JSON.parse(event.data)
      console.log('[ws] parsed:', data)
      callbacks?.onMessage(data)
    } catch (err) {
      console.error('[ws] parse error:', err)
      // 파싱 불가한 메세지는 무시
    }
  }

  ws.onclose = () => {
    console.log('[ws] closed')
    if (socket !== ws) return
    callbacks?.onStatusChange('closed')
    scheduleReconnect()
  }

  ws.onerror = (err) => {
    console.error('[ws] error:', err)
    ws.close()
  }
}

// 다음날 새 배치가 들어올 수 있으므로 completed 이후에도 재연결을 계속 시도한다.
// 의도적으로 disconnectSimulationSocket()이 호출된 경우(callbacks === null)에는 재시도하지 않는다.
function scheduleReconnect() {
  if (!callbacks) return

  const delay = Math.min(BASE_DELAY_MS * 2 ** reconnectAttempt, MAX_DELAY_MS)
  const jitter = delay * 0.2 * Math.random()
  reconnectAttempt += 1
  reconnectTimer = setTimeout(connect, delay + jitter)
}
