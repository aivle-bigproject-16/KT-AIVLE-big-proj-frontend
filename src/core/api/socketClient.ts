const WS_BASE = import.meta.env.VITE_API_BASE_URL

export function createSocket(path: string): WebSocket {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return new WebSocket(`${protocol}//${window.location.host}${WS_BASE}${path}`)
}
