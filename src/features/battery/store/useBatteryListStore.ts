import { create } from 'zustand'
import { batteryService } from '../services/battery.service'
import type { BatteryListItem } from '../types'
import type { Pageable } from '@/shared/types/api'
import type { AsyncState } from '@/shared/types/store'

interface BatteryListState extends AsyncState {
  list: BatteryListItem[]
  pageable: Pageable | null
}

interface BatteryListActions {
  actions: {
    fetchList: (page: number, size: number) => Promise<void>
    reset: () => void
  }
}

const initialState: BatteryListState = {
  list: [],
  pageable: null,
  isLoading: false,
  error: null,
}

export const useBatteryListStore = create<BatteryListState & BatteryListActions>((set) => ({
  ...initialState,
  actions: {
    fetchList: async (page, size) => {
      set({ isLoading: true, error: null })
      try {
        const res = await batteryService.getBatteryList({ page, size })
        set({ list: res.data.content, pageable: res.data.pageable, isLoading: false })
      } catch {
        set({ error: '배터리 목록 조회에 실패했습니다.', isLoading: false })
      }
    },

    reset: () => set(initialState),
  },
}))
