import { spawn } from 'node:child_process'
import http from 'node:http'
import { readFile } from 'node:fs/promises'
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

  // POST /api/dashboard — 실제 API는 body(조회 조건)를 받아 KPI 데이터를 계산해 반환하는
  // 액션이라, json-server의 "레코드 생성" 의미(body 그대로 저장)와 맞지 않는다.
  // db.json에 미리 넣어둔 대시보드 데이터를 그대로 반환하도록 특수 처리한다.
  if (req.method === 'POST' && url.pathname === '/api/dashboard') {
    const db = await readDb()
    const dashboard = db.dashboard?.[0]
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(dashboard ?? null)))
    return
  }

  // POST /api/auth/login — users 리소스에서 email/password를 대조해 실제 로그인처럼 동작시킨다.
  if (req.method === 'POST' && url.pathname === '/api/auth/login') {
    const { email, password } = JSON.parse(body.toString() || '{}')
    const db = await readDb()
    const user = db.users?.find((u) => u.email === email && u.password === password)
    if (!user) {
      res.writeHead(401, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.', data: null }))
      return
    }
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap({ name: user.name, role: user.role })))
    return
  }

  // POST /api/auth/signup — 실제 회원가입 로직 없이 성공만 흉내낸다.
  if (req.method === 'POST' && url.pathname === '/api/auth/signup') {
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap({})))
    return
  }

  // POST /api/sim — 요청받은 batchSize/batteryCellCount/captureSpeed로 셀·배치를 생성하고 진행을 시작한다.
  if (req.method === 'POST' && url.pathname === '/api/sim') {
    const { batchSize, batteryCellCount, captureSpeed } = JSON.parse(body.toString() || '{}')
    if (!batchSize || !batteryCellCount || !captureSpeed) {
      res.writeHead(400, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
      res.end(JSON.stringify({ success: false, message: 'batchSize, batteryCellCount, captureSpeed는 필수입니다.', data: null }))
      return
    }
    startSimulation({ batchSize, batteryCellCount, captureSpeed })
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(snapshot())))
    return
  }

  // GET /api/sim — 진행 상황 복구용. 시작된 적이 없으면 COMPLETED로 응답한다.
  if (req.method === 'GET' && url.pathname === '/api/sim') {
    res.writeHead(200, { 'content-type': 'application/json', 'access-control-allow-origin': '*' })
    res.end(JSON.stringify(wrap(snapshot())))
    return
  }

  // GET /api/reports/individual/:reportId, GET /api/reports/daily/:reportId
  // 3단계 경로라 json-server의 /:name/:id 라우트가 못 잡는다.
  // db.json의 reports[].content 배열에서 직접 항목을 찾아 반환한다.
  const individualDetailMatch = url.pathname.match(/^\/api\/reports\/individual\/(\d+)$/)
  const dailyDetailMatch = url.pathname.match(/^\/api\/reports\/daily\/(\d+)$/)

  if (req.method === 'GET' && individualDetailMatch) {
    const reportId = Number(individualDetailMatch[1])
    const db = await readDb()
    const item = db.reports
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
    const item = db.reports
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
    // json-server는 db.json의 리소스 키(예: /battery, /users)로 라우팅하므로 /api 프리픽스를 모른다.
    const upstreamPath = req.url.replace(/^\/api(?=\/|$)/, '')
    const upstream = await fetchWithRetry(`http://localhost:${RAW_PORT}${upstreamPath}`, {
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

// --- /ws/sim, /api/sim — 검사 진행 상황(simulation.progress) mock ---
// POST /api/sim { batchSize, batteryCellCount, captureSpeed } 요청에 맞춰 셀·배치를 생성하고
// registered에 전부 등록한 뒤, 한 번에 한 배치씩 CAPTURING(captureSpeed초) → ANALYZING → COMPLETED 순으로 진행한다.
let registered = []
let capture = null
let analyze = null
let completed = []
let captureSpeedSec = null
let hasStartedOnce = false
let totalBatchCount = 0

// WS(/ws/sim)와 HTTP(POST·GET /api/sim)가 전부 이 페이로드 하나를 공유한다.
// 한 번도 시작된 적이 없으면 captureSpeed가 없어 PROGRESS 스키마(비-nullable int)를 만족할 수 없으므로
// COMPLETED(종료/복구할 것 없음)로 응답한다.
function snapshot(forceProgress = false) {
  if (!hasStartedOnce) return { event: 'COMPLETED' }

  // 모든 배치가 completed에 들어갔으면 COMPLETED
  if (!forceProgress && completed.length === totalBatchCount && totalBatchCount > 0) {
    console.log(`[snap] COMPLETED: completed=${completed.length}, total=${totalBatchCount}`)
    return { event: 'COMPLETED' }
  }

  console.log(`[snap] PROGRESS: registered=${registered.length}, capture=${capture ? 'yes' : 'no'}, analyze=${analyze ? 'yes' : 'no'}, completed=${completed.length}/${totalBatchCount}`)
  const batches = [...registered, capture, analyze, ...completed].filter(Boolean)
  const batchCount = batches.length
  const batteryCellCount = batches.reduce((sum, b) => sum + b.cells.length, 0)
  return {
    event: 'PROGRESS',
    batchCount,
    batteryCellCount,
    captureSpeed: captureSpeedSec,
    registered,
    capture,
    analyze,
    completed,
  }
}

function broadcastSnapshot(forceProgress = false) {
  const payload = JSON.stringify(snapshot(forceProgress))
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(payload)
  }
}

function makeBatches(batchSize, batteryCellCount) {
  const batches = []
  let remaining = batteryCellCount
  let batchId = 1

  while (remaining > 0) {
    const cellCount = Math.min(batchSize, remaining)
    const cells = []
    for (let i = 1; i <= cellCount; i++) {
      const cellId = Number(`${batchId}${String(i).padStart(3, '0')}`)
      cells.push({ batteryCellId: cellId, inspectionId: cellId, finalLabel: null })
    }
    batches.push({ batchId, status: 'REGISTERED', cells })
    remaining -= cellCount
    batchId += 1
  }

  return batches
}

const ANALYZE_DELAY_MIN_MS = 1000
const ANALYZE_DELAY_MAX_MS = 5000

function randomAnalyzeDelayMs() {
  return Math.floor(Math.random() * (ANALYZE_DELAY_MAX_MS - ANALYZE_DELAY_MIN_MS + 1)) + ANALYZE_DELAY_MIN_MS
}

// POST /api/sim이 다시 호출되면(재시작) runId가 올라간다 — 이전 실행의 setTimeout 체인은
// myRunId 검사에 걸려 조용히 무시되고, 새로 시작된 시뮬레이션 상태를 건드리지 않는다.
let runId = 0

function moveToAnalyze(batch, myRunId) {
  if (myRunId !== runId) return

  if (capture?.batchId === batch.batchId) {
    capture = null
  }

  batch.status = 'ANALYZING'
  analyze = batch
  broadcastSnapshot()
  console.log(`[sim] batch ${batch.batchId} → ANALYZING`)

  // 분석으로 넘어가는 즉시 다음 배치를 CAPTURING으로 올린다.
  processNextBatch(myRunId)

  const analyzeDelayMs = randomAnalyzeDelayMs()
  console.log(`[sim] batch ${batch.batchId} analyze delay=${analyzeDelayMs}ms`)

  setTimeout(() => {
    if (myRunId !== runId) return

    batch.status = 'COMPLETED'
    batch.cells = batch.cells.map((cell) => ({
      ...cell,
      finalLabel: (() => {
        const r = Math.random()
        if (r < 0.75) return 'PASS'
        if (r < 0.95) return 'REJECT'
        return 'FAIL'
      })(),
    }))

    analyze = null
    completed = [batch, ...completed]
    // 마지막 배치라도 최종 completed 목록을 먼저 PROGRESS로 한번 보내고,
    // 다음 루프에서 큐 소진 시 COMPLETED 이벤트를 보낸다.
    broadcastSnapshot(true)
    console.log(`[sim] batch ${batch.batchId} → COMPLETED`)

    // 캡처가 이미 끝나서 CAPTURED 상태로 대기 중이면 즉시 분석 슬롯으로 이동.
    if (capture && capture.status === 'CAPTURED') {
      moveToAnalyze(capture, myRunId)
      return
    }

    processNextBatch(myRunId)
  }, analyzeDelayMs)
}

function processNextBatch(myRunId) {
  if (myRunId !== runId) return // 이미 재시작되어 폐기된 실행 — 무시

  // capture 슬롯이 사용 중이면 새 배치를 올리지 않는다.
  if (capture) return

  const batch = registered.shift()
  if (!batch) {
    // 큐 소진 — 모든 배치가 완료되었으면 COMPLETED 브로드캐스트
    if (completed.length === totalBatchCount && totalBatchCount > 0 && analyze === null && capture === null) {
      broadcastSnapshot()
      console.log('[sim] all batches completed')
    }
    return
  }

  batch.status = 'CAPTURING'
  capture = batch
  broadcastSnapshot()
  console.log(`[sim] batch ${batch.batchId} → CAPTURING (${captureSpeedSec}s)`)

  setTimeout(() => {
    if (myRunId !== runId) return
    if (!capture || capture.batchId !== batch.batchId) return

    batch.status = 'CAPTURED'

    if (analyze === null) {
      moveToAnalyze(batch, myRunId)
      return
    }

    // 분석 슬롯이 비지 않았으면 CAPTURED 상태로 capture 슬롯에서 대기.
    capture = batch
    broadcastSnapshot()
    console.log(`[sim] batch ${batch.batchId} → CAPTURED (waiting ANALYZING slot)`)
  }, captureSpeedSec * 1000)
}

function startSimulation({ batchSize, batteryCellCount, captureSpeed }) {
  runId += 1
  const myRunId = runId

  registered = makeBatches(batchSize, batteryCellCount)
  totalBatchCount = registered.length
  capture = null
  analyze = null
  completed = []
  captureSpeedSec = captureSpeed
  hasStartedOnce = true

  console.log(`[sim] started: batchSize=${batchSize} batteryCellCount=${batteryCellCount} captureSpeed=${captureSpeed}s`)
  setTimeout(() => processNextBatch(myRunId), 0)
}

const wss = new WebSocketServer({ server, path: '/ws/sim' })

wss.on('connection', (socket) => {
  socket.send(JSON.stringify(snapshot()))
})

server.listen(PROXY_PORT, () => {
  console.log(`mock API wrapper listening on http://localhost:${PROXY_PORT} (upstream json-server on ${RAW_PORT})`)
  console.log(`mock WS listening on ws://localhost:${PROXY_PORT}/ws/sim`)
  console.log('POST /api/sim { batchSize, batteryCellCount, captureSpeed } 요청으로 시뮬레이션을 시작합니다.')
})
