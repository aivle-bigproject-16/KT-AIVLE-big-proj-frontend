import type { FinalLabel } from '@/features/battery/types'

// POST /sim — Request (시뮬레이션 설정 + 시작)
export interface SimStartRequest {
  batchSize: number
  batteryCellCount: number
  captureSpeed: number
}

// PUT /sim — Request (일시중단/재개, 상태: 추후 진행 — 아직 미구현)
export interface SimPauseResumeRequest {
  running: boolean
}

// WS /ws/sim 연결 상태 (프론트 전용 — 소켓 연결 자체의 lifecycle)
export type WsStatus = 'idle' | 'connecting' | 'reconnecting' | 'open' | 'closed'

// event: PROGRESS / COMPLETED 중 어느 쪽인지 (프론트 전용 — 시뮬레이션 실행의 lifecycle)
export type SimulationRunStatus = 'idle' | 'running' | 'completed'

// WS /ws/sim, event: PROGRESS — Response (상태: 추후 진행)
export type BatchStatus = 'REGISTERED' | 'CAPTURING' | 'CAPTURED' | 'ANALYZING' | 'ANALYZED' | 'COMPLETED'

export interface CellProgress {
  batteryCellId: number
  inspectionId: number
  finalLabel: FinalLabel | null
}

export interface BatchProgress {
  batchId: number
  status: BatchStatus
  cells: CellProgress[]
}

export interface SimulationProgressPayload {
  event: 'PROGRESS'
  batchCount: number
  batteryCellCount: number
  captureSpeed: number
  registered: BatchProgress[]
  capture: BatchProgress | null
  analyze: BatchProgress | null
  completed: BatchProgress[]
}

// WS /ws/sim, event: COMPLETED — Response
export interface SimulationCompletedPayload {
  event: 'COMPLETED'
}

// WS PROGRESS/COMPLETED와 POST·GET /sim 응답이 전부 동일한 스키마를 공유한다.
export type SimulationSocketMessage = SimulationProgressPayload | SimulationCompletedPayload
export type SimStatusPayload = SimulationSocketMessage
