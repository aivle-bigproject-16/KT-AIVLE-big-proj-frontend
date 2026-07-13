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
