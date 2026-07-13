export type CellType = 'POUCH' | 'CYLINDRICAL' | 'PRISMATIC'
export type FinalLabel = 'PASS' | 'REJECT' | 'FAIL'

// GET /battery
export interface BatteryListItem {
  inspectionId: number
  batteryCellId: number
  cellSerialNo: string | null
  modelName: string | null
  cellType: CellType | null
  latestFinalLabel: FinalLabel | null
  latestAnalyzedAt: string | null
}

export interface BatteryReportSummary {
  reportId: number
  title: string | null
  createdAt: string
  updatedAt: string | null
}

// GET /battery/:batteryCellId
export interface BatteryDetail {
  batteryCellId: number
  cellSerialNo: string
  purchaseId: string | null
  rgbImages: string[]
  ctImages: string[]
  productId: string | null
  modelName: string | null
  cellType: CellType | null
  manufacturedDate: string | null
  createdAt: string
  updatedAt: string | null
  reports: BatteryReportSummary[]
}
