import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse } from '@/shared/types/api'
import type { DashboardRequest, DashboardResponse } from '../types'

export const dashboardService = {
  getDashboard: (body: DashboardRequest) =>
    httpClient.post<ApiResponse<DashboardResponse>>('/dashboard', body),
}
