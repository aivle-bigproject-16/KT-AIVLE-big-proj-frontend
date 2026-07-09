import { createSocket } from '@/core/api/socketClient'

let socket: WebSocket | null = null

export function connectSimulationSocket() {
  if (socket && socket.readyState !== WebSocket.CLOSED) return socket
  socket = createSocket('/ws/sim')
  return socket
}

export function disconnectSimulationSocket() {
  socket?.close()
  socket = null
}
