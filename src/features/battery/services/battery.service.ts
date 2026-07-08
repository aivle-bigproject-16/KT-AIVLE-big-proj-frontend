import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse, PageResponse } from '@/shared/types/api'
import type { BatteryListItem, BatteryDetail } from '../types'

const BASE_URL = '/battery'

interface GetBatteryListParams {
  page?: number
  size?: number
}

export const batteryService = {
  getBatteryList: (params: GetBatteryListParams) =>
    httpClient.get<ApiResponse<PageResponse<BatteryListItem>>>(BASE_URL, { params }),

  getBatteryDetail: (batteryCellId: number) =>
    httpClient.get<ApiResponse<BatteryDetail>>(`${BASE_URL}/${batteryCellId}`),
}
