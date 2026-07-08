import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse, PageResponse } from '@/shared/types/api'
import type {
  IndividualReportCreateRequest,
  IndividualReportCreateResponse,
  IndividualReportDetail,
  IndividualReportListItem,
} from '../types'

const BASE_URL = '/report/individual'

interface GetIndividualReportListParams {
  page?: number
  size?: number
  sort?: string
}

export const individualReportService = {
  createIndividualReport: (body: IndividualReportCreateRequest) =>
    httpClient.post<ApiResponse<IndividualReportCreateResponse>>(BASE_URL, body),

  getIndividualReport: (reportId: number) =>
    httpClient.get<ApiResponse<IndividualReportDetail>>(`${BASE_URL}/${reportId}`),

  getIndividualReportList: (params: GetIndividualReportListParams) =>
    httpClient.get<ApiResponse<PageResponse<IndividualReportListItem>>>(BASE_URL, {
      params,
    }),
}
