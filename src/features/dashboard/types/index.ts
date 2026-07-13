export type GraphType = 'DEFECT_TYPE' | 'DAILY_TREND' | 'MANUFACTURE_DEFECTS'

// POST /dashboard — Request
export interface DashboardRequest {
  todayDate: string
  startDate: string | null
  size: number
  graphType: GraphType
}

// POST /dashboard — Response

export interface GraphDataItem {
  label: string
  value: number
}

export interface DashboardResponse {
  graphData: GraphDataItem[]
}
