import { create } from 'zustand'
import { dailyReportService } from '../services/dailyReportService'
import type { DailyReportDetail, DailyReportCreateRequest } from '../types'
import type { AsyncState } from '@/shared/types/store'

interface DailyReportDetailState extends AsyncState {
  detail: DailyReportDetail | null
}

interface DailyReportDetailActions {
  actions: {
    fetchDetail: (reportId: number) => Promise<void>
    create: (body: DailyReportCreateRequest) => Promise<number>
    reset: () => void
  }
}

const initialState: DailyReportDetailState = {
  detail: null,
  isLoading: false,
  error: null,
}

export const useDailyReportDetailStore = create<
  DailyReportDetailState & DailyReportDetailActions
>((set) => ({
  ...initialState,
  actions: {
    fetchDetail: async (reportId) => {
      set({ isLoading: true, error: null })
      try {
        const res = await dailyReportService.getDailyReport(reportId)
        set({ detail: res.data, isLoading: false })
      } catch {
        set({ error: '일일 리포트 조회에 실패했습니다.', isLoading: false })
      }
    },

    create: async (body) => {
      const res = await dailyReportService.createDailyReport(body)
      return res.data.reportId
    },

    reset: () => set(initialState),
  },
}))
