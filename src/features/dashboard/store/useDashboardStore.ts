import { create } from 'zustand'
import { dashboardService } from '../services/dashboardService'
import type { DashboardRequest, KpiData, SummaryItem, GraphDataItem } from '../types'
import type { AsyncState } from '@/shared/types/store'

interface DashboardState extends AsyncState {
  kpiData: KpiData | null
  summaryData: SummaryItem[]
  graphData: GraphDataItem[]
}

interface DashboardActions {
  actions: {
    fetchDashboard: (body: DashboardRequest) => Promise<void>
    reset: () => void
  }
}

const initialState: DashboardState = {
  kpiData: null,
  summaryData: [],
  graphData: [],
  isLoading: false,
  error: null,
}

export const useDashboardStore = create<DashboardState & DashboardActions>((set) => ({
  ...initialState,
  actions: {
    fetchDashboard: async (body) => {
      set({ isLoading: true, error: null })
      try {
        const res = await dashboardService.getDashboard(body)
        set({
          kpiData: res.data.kpiData,
          summaryData: res.data.summaryData,
          graphData: res.data.graphData,
          isLoading: false,
        })
      } catch {
        set({ error: '대시보드 조회에 실패했습니다.', isLoading: false })
      }
    },

    reset: () => set(initialState),
  },
}))
