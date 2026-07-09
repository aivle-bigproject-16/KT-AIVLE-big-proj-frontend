import { spawn } from 'node:child_process'
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import readline from 'node:readline'
import { WebSocketServer } from 'ws'

const RAW_PORT = 4001
const PROXY_PORT = 4000

async function readDb() {
  return JSON.parse(await readFile(new URL('./db.json', import.meta.url), 'utf-8'))
}

const child = spawn('npx', ['json-server', '--port', String(RAW_PORT), 'db.json'], {
  stdio: 'inherit',
  shell: true,
})

process.on('exit', () => child.kill())
process.on('SIGINT', () => process.exit())

function wrap(data) {
  if (Array.isArray(data)) {
    return {
      success: true,
      message: 'ok',
      data: {
        content: data,
        pageable: { page: 0, pageSize: data.length, totalElements: data.length, totalPages: 1 },
      },
    }
  }
  return { success: true, message: 'ok', data }
}

async function fetchWithRetry(url, options, retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options)
    } catch {
      await new Promise((r) => setTimeout(r, 200))
    }
  }
  throw new Error('upstream json-server not reachable')
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, POST, PUT, PATCH, DELETE',
      'access-control-allow-headers': 'content-type',
    })
    res.end()
    return
  }

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const body = Buffer.concat(chunks)
  const url = new URL(req.url, `http://localhost:${PROXY_PORT}`)

  // POST /dashboard — 실제 API는 body(조회 조건)를 받아 KPI 데이터를 계산해 반환하는
  // 액션이라, json-server의 "레코드 생성" 의미(body 그대로 저장)와 맞지 않는다.
  // db.json에 미리 넣어둔 대시보드 데이터를 그대로 반환하도록 특수 처리한다.
  if (req.method === 'POST' && url.pathname === '/dashboard') {
    const db = await readDb()
    const dashboard = db.dashboard?.[0]
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(dashboard ?? null)))
    return
  }

  // POST /auth/login — users 리소스에서 id/password를 대조해 실제 로그인처럼 동작시킨다.
  if (req.method === 'POST' && url.pathname === '/auth/login') {
    const { id, password } = JSON.parse(body.toString() || '{}')
    const db = await readDb()
    const user = db.users?.find((u) => u.id === id && u.password === password)
    if (!user) {
      res.writeHead(401, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.', data: null }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap({ name: user.name, role: user.role })))
    return
  }

  // POST /auth/signup — 실제 회원가입 로직 없이 성공만 흉내낸다.
  if (req.method === 'POST' && url.pathname === '/auth/signup') {
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap({})))
    return
  }

  // GET /report/individual/:reportId, GET /report/daily/:reportId
  // 3단계 경로라 json-server의 /:name/:id 라우트가 못 잡는다.
  // db.json의 report[].content 배열에서 직접 항목을 찾아 반환한다.
  const individualDetailMatch = url.pathname.match(/^\/report\/individual\/(\d+)$/)
  const dailyDetailMatch = url.pathname.match(/^\/report\/daily\/(\d+)$/)

  if (req.method === 'GET' && individualDetailMatch) {
    const reportId = Number(individualDetailMatch[1])
    const db = await readDb()
    const item = db.report
      ?.find((r) => r.id === 'individual')
      ?.content?.find((r) => r.reportId === reportId)
    if (!item) {
      res.writeHead(404, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ success: false, message: '해당 개별 리포트가 없습니다.', data: null }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(item)))
    return
  }

  if (req.method === 'GET' && dailyDetailMatch) {
    const reportId = Number(dailyDetailMatch[1])
    const db = await readDb()
    const item = db.report
      ?.find((r) => r.id === 'daily')
      ?.content?.find((r) => r.reportId === reportId)
    if (!item) {
      res.writeHead(404, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ success: false, message: '해당 일일 리포트가 없습니다.', data: null }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(item)))
    return
  }

  try {
    const upstream = await fetchWithRetry(`http://localhost:${RAW_PORT}${req.url}`, {
      method: req.method,
      headers: { 'content-type': 'application/json' },
      body: ['GET', 'HEAD'].includes(req.method ?? 'GET') ? undefined : body,
    })

    const status = upstream.status
    const contentType = upstream.headers.get('content-type') ?? ''

    if (!contentType.includes('application/json')) {
      res.writeHead(status, { 'access-control-allow-origin': '*' })
      res.end(await upstream.text())
      return
    }

    const json = await upstream.json()
    res.writeHead(status, {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    })
    res.end(JSON.stringify(wrap(json)))
  } catch (err) {
    res.writeHead(502, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify({ success: false, message: String(err), data: null }))
  }
})

// --- /ws/sim — 검사 진행 상황 수신(simulation.progress) mock ---
// 콘솔에 숫자를 입력하면 그 번호로 배치를 만들어 registered에 등록하고,
// 10초 후 capture, 다시 10초 후 analyze, 다시 10초 후 completed로 넘긴다.
let registered = []
let capture = null
let analyze = null
let completed = []

function snapshot() {
  const batches = [...registered, capture, analyze, ...completed].filter(Boolean)
  const batchCount = batches.length
  const batteryCellCount = batches.reduce((sum, b) => sum + b.cells.length, 0)
  return { batchCount, batteryCellCount, registered, capture, analyze, completed }
}

function broadcastSnapshot() {
  const payload = JSON.stringify(snapshot())
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(payload)
  }
}

function makeBatch(num, status) {
  return {
    batchId: `test-batch${String(num).padStart(3, '0')}`,
    status,
    cells: [
      { batteryCellId: `cell-id${num}001`, inspectionId: `inspection-id${num}001`, finalLabel: null },
      { batteryCellId: `cell-id${num}002`, inspectionId: `inspection-id${num}002`, finalLabel: null },
    ],
  }
}

const STAGE_DELAY_MS = 3000

function registerBatch(num) {
  const batch = makeBatch(num, 'REGISTERED')
  registered.push(batch)
  broadcastSnapshot()
  console.log(`[ws/sim] ${batch.batchId} registered`)

  setTimeout(() => {
    registered = registered.filter((b) => b.batchId !== batch.batchId)
    batch.status = 'CAPTURING'
    capture = batch
    broadcastSnapshot()
    console.log(`[ws/sim] ${batch.batchId} → capture`)

    setTimeout(() => {
      batch.status = 'ANALYZING'
      analyze = batch
      capture = null
      broadcastSnapshot()
      console.log(`[ws/sim] ${batch.batchId} → analyze`)

      setTimeout(() => {
        batch.status = 'COMPLETED'
        batch.cells = batch.cells.map((cell) => ({
          ...cell,
          finalLabel: Math.random() < 0.8 ? 'PASS' : 'REJECT',
        }))
        analyze = null
        completed = [batch, ...completed].slice(0, 20)
        broadcastSnapshot()
        console.log(`[ws/sim] ${batch.batchId} → completed`)
      }, STAGE_DELAY_MS)
    }, STAGE_DELAY_MS)
  }, STAGE_DELAY_MS)
}

const wss = new WebSocketServer({ server, path: '/ws/sim' })

wss.on('connection', (socket) => {
  socket.send(JSON.stringify(snapshot()))
})

const rl = readline.createInterface({ input: process.stdin })

rl.on('line', (line) => {
  const trimmed = line.trim()
  if (!trimmed) return

  const num = Number(trimmed)
  if (!Number.isInteger(num)) {
    console.log(`숫자를 입력해주세요: ${trimmed}`)
    return
  }

  registerBatch(num)
})

server.listen(PROXY_PORT, () => {
  console.log(`mock API wrapper listening on http://localhost:${PROXY_PORT} (upstream json-server on ${RAW_PORT})`)
  console.log(`mock WS listening on ws://localhost:${PROXY_PORT}/ws/sim`)
  console.log('콘솔에 숫자를 입력하면 그 번호로 배치가 등록되어 3초 간격으로 capture→analyze→completed 순으로 진행됩니다.')
})
