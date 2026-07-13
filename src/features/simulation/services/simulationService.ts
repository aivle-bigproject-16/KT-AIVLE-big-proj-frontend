import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse } from '@/shared/types/api'
import type { SimStartRequest, SimStatusPayload } from '../types'

const BASE_URL = '/sim'

export const simulationService = {
  startSimulation: (body: SimStartRequest) =>
    httpClient.post<ApiResponse<SimStatusPayload>>(BASE_URL, body),

  getSimStatus: () => httpClient.get<ApiResponse<SimStatusPayload>>(BASE_URL),
}
