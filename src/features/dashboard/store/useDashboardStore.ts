import { create } from 'zustand'
import { dashboardService } from '../services/dashboardService'
import type { DashboardRequest, GraphDataItem } from '../types'
import type { AsyncState } from '@/shared/types/store'

interface DashboardState extends AsyncState {
  graphData: GraphDataItem[]
}

interface DashboardActions {
  actions: {
    fetchDashboard: (body: DashboardRequest) => Promise<void>
    reset: () => void
  }
}

const initialState: DashboardState = {
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
