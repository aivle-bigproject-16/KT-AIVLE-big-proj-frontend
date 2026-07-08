export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface Pageable {
  page: number
  pageSize: number
  totalElements: number
  totalPages: number
}

export interface PageResponse<T> {
  content: T[]
  pageable: Pageable
}
