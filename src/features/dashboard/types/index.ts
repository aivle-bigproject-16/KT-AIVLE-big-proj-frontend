import type { FinalLabel } from '@/features/battery/types'

export type GraphType = 'DEFECT_TYPE' | 'DAILY_TREND' | 'MANUFACTURE_DEFECTS'
export type ProcessStatus = 'PENDING' | 'RUNNING' | 'COMPLETED'

// POST /dashboard — Request
export interface DashboardRequest {
  todayDate: string
  startDate: string | null
  size: number
  graphType: GraphType
}

// POST /dashboard — Response
export interface KpiData {
  totalInspections: number
  yieldRate: number
  processStatus: ProcessStatus
}

export interface SummaryItem {
  inspectionId: number
  finalLabel: FinalLabel
  createdAt: string
}

export interface GraphDataItem {
  label: string
  value: number
}

export interface DashboardResponse {
  kpiData: KpiData
  summaryData: SummaryItem[]
  graphData: GraphDataItem[]
}

// PUT /sim — Request (상태: 추후 진행, 스키마 미확정)
export interface SimConfigRequest {
  running: boolean
}

// WS simulation.progress — Response (상태: 추후 진행)
export type BatchStatus = 'REGISTERED' | 'CAPTURING' | 'CAPTURED' | 'ANALYZING' | 'ANALYZED' | 'COMPLETED'

export interface CellProgress {
  batteryCellId: string
  inspectionId: string
  finalLabel: FinalLabel | null
}

export interface BatchProgress {
  batchId: string
  status: BatchStatus
  cells: CellProgress[]
}

export interface SimulationProgressPayload {
  batchCount: number
  batteryCellCount: number
  registered: BatchProgress[]
  capture: BatchProgress | null
  analyze: BatchProgress | null
  completed: BatchProgress[]
}
