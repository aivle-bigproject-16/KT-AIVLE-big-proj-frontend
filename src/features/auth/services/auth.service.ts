import { httpClient } from '@/core/api/httpClient'
import type { ApiResponse } from '@/shared/types/api'
import type { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from '../types'

const BASE_URL = '/auth'

export const authService = {
  login: (body: LoginRequest) =>
    httpClient.post<ApiResponse<LoginResponse>>(`${BASE_URL}/login`, body),

  signup: (body: SignupRequest) =>
    httpClient.post<ApiResponse<SignupResponse>>(`${BASE_URL}/signup`, body),
}
