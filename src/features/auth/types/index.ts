export interface LoginRequest {
  id: string
  password: string
}

export interface LoginResponse {
  name: string
  role: string
}

export interface SignupRequest {
  id: string
  password: string
  name: string
}

export type SignupResponse = Record<string, never>
