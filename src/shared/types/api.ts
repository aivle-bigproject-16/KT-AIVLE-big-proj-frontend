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

// 페이지 정보 없이 배열만 오는 응답까지 포괄 (mock 서버, 페이지네이션 미지원 엔드포인트 등)
export type ListResponse<T> = PageResponse<T> | T[]

export function normalizeListResponse<T>(data: ListResponse<T>): {
  content: T[]
  pageable: Pageable | null
} {
  if (Array.isArray(data)) {
    return { content: data, pageable: null }
  }
  return { content: data.content, pageable: data.pageable ?? null }
}
