export type CellType = 'POUCH' | 'CYLINDRICAL' | 'PRISMATIC'
export type FinalLabel = 'PASS' | 'REJECT'

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

// GET /battery/:batteryCellId
export interface BatteryDetail {
  batteryCellId: number
  cellSerialNo: string
  purchaseId: string | null
  rgbImageUrl: string | null
  ctImageUrl: string | null
  productId: string | null
  modelName: string | null
  cellType: CellType | null
  manufacturedDate: string | null
  createdAt: string
  updatedAt: string | null
}
