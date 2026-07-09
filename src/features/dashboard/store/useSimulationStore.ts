import { create } from 'zustand'
import type { BatchProgress, SimulationProgressPayload } from '../types'

// 백엔드가 completed를 계속 누적해서 보내므로, 프론트에서 최근 N개로 제한한다.
const MAX_COMPLETED = 20

type WsStatus = 'idle' | 'connecting' | 'open' | 'closed'

interface SimulationState {
  registered: BatchProgress[]
  capture: BatchProgress | null
  analyze: BatchProgress | null
  completed: BatchProgress[]
  wsStatus: WsStatus
  lastProgressAt: number | null
}

interface SimulationActions {
  actions: {
    applyProgress: (payload: SimulationProgressPayload) => void
    setWsStatus: (status: WsStatus) => void
    reset: () => void
  }
}

const initialState: SimulationState = {
  registered: [],
  capture: null,
  analyze: null,
  completed: [],
  wsStatus: 'idle',
  lastProgressAt: null,
}

export const useSimulationStore = create<SimulationState & SimulationActions>((set) => ({
  ...initialState,
  actions: {
    applyProgress: (payload) => {
      set({
        registered: payload.registered,
        capture: payload.capture,
        analyze: payload.analyze,
        completed: payload.completed.slice(0, MAX_COMPLETED),
        lastProgressAt: Date.now(),
      })
    },

    setWsStatus: (status) => set({ wsStatus: status }),

    reset: () => set(initialState),
  },
}))
