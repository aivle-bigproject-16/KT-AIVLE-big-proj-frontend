import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse, PageResponse } from '@/shared/types/api'
import type {
  DailyReportCreateRequest,
  DailyReportCreateResponse,
  DailyReportDetail,
  DailyReportListItem,
} from '../types'

const BASE_URL = '/report/daily'

interface GetDailyReportListParams {
  page?: number
  size?: number
  sort?: string
}

export const dailyReportService = {
  createDailyReport: (body: DailyReportCreateRequest) =>
    httpClient.post<ApiResponse<DailyReportCreateResponse>>(BASE_URL, body),

  getDailyReport: (id: number) =>
    httpClient.get<ApiResponse<DailyReportDetail>>(`${BASE_URL}/${id}`),

  getDailyReportList: (params: GetDailyReportListParams) =>
    httpClient.get<ApiResponse<PageResponse<DailyReportListItem>>>(BASE_URL, { params }),
}
