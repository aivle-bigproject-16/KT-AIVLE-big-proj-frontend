export type ReportStatus = 'PENDING' | 'COMPLETED' | 'FAILED'
export type ImageType = 'CT' | 'RGB'
export type FailureReason =
  | 'INCOMPLETE_SET'
  | 'AI_SERVER_ERROR'
  | 'TIMEOUT'
  | 'MALFORMED_RESPONSE'
  | 'PARTIAL_ANALYSIS_FAILURE'

// ─── 공통 ────────────────────────────────────────────────────────────────────

export interface BboxCoords {
  x: number
  y: number
  width: number
  height: number
}

export interface ImageMapping {
  imageType: ImageType
  imageId: number
  bbox: BboxCoords
}

// ─── 개별 리포트 ─────────────────────────────────────────────────────────────

// POST /report/individual — Request
export interface IndividualReportCreateRequest {
  batteryCellId: number
  forceRegenerate?: boolean
}

// POST /report/individual — Response
export interface IndividualReportCreateResponse {
  reportId: number
  reportDate: string
  status: ReportStatus
  message?: string
  createdAt: string
}

// GET /report/individual/:reportId — Response
export interface IndividualReportDetail {
  reportId: number
  batteryCellId: number
  cellSerialNo: string
  status: ReportStatus
  title: string | null
  content: string | null
  ctImageUrl: string | null
  rgbImageUrl: string | null
  createdAt: string
  updatedAt: string | null
  imageMappings: ImageMapping[]
}

// GET /report/individual — Response content[]
export interface IndividualReportListItem {
  reportId: number
  status: ReportStatus
  title: string | null
  createdAt: string
  updatedAt: string
}

// ─── 일일 리포트 ─────────────────────────────────────────────────────────────

// POST /report/daily — Request
export interface DailyReportCreateRequest {
  reportDate: string
  forceRegenerate?: boolean
}

// POST /report/daily — Response
export interface DailyReportCreateResponse {
  reportId: number
  reportDate: string
  status: ReportStatus
  message?: string
  createdAt: string
}

// GET /report/daily/:id — Response
export interface DefectStat {
  defectType: string
  count: number
}

export interface DailyReportSummary {
  totalCount: number
  passCount: number
  rejectCount: number
  failedCount: number
  defects: DefectStat[]
}

export interface DailyReportDetail {
  reportId: number
  reportDate: string
  status: ReportStatus
  title: string | null
  content: string | null
  failureReason: FailureReason | null
  rgbImageUrl: string | null
  ctImageUrl: string | null
  createdAt: string
  updatedAt: string | null
  summary: DailyReportSummary
}

// GET /report/daily — Response content[]
export interface DailyReportListItem {
  reportId: number
  reportDate: string
  status: ReportStatus
  title: string | null
  createdAt: string
}
