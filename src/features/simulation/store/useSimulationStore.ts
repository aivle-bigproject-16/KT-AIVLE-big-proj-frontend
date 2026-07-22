import { create } from 'zustand'
import { simulationService } from '../services/simulationService'
import type { CellProgress, SimStartRequest, SimulationRunStatus, SimulationSocketMessage, WsStatus } from '../types'

function isSimulationSocketMessage(data: unknown): data is SimulationSocketMessage {
  return typeof data === 'object' && data !== null && 'event' in data
}

interface SimulationState {
  batchCount: number
  batteryCellCount: number
  registered: CellProgress[]
  capture: CellProgress[]
  analyze: CellProgress | null
  completed: CellProgress[]
  captureSpeed: number | null
  wsStatus: WsStatus
  simulationStatus: SimulationRunStatus
  event: 'PROGRESS' | 'COMPLETED' | null
  lastMessage: unknown
  lastMessageAt: number | null
  isStarting: boolean
  startError: string | null
}

interface SimulationActions {
  actions: {
    applyMessage: (data: unknown) => void
    setWsStatus: (status: WsStatus) => void
    start: (body: SimStartRequest) => Promise<void>
    reset: () => void
  }
}

const initialState: SimulationState = {
  batchCount: 0,
  batteryCellCount: 0,
  registered: [],
  capture: [],
  analyze: null,
  completed: [],
  captureSpeed: null,
  wsStatus: 'idle',
  simulationStatus: 'idle',
  event: null,
  lastMessage: null,
  lastMessageAt: null,
  isStarting: false,
  startError: null,
}

export const useSimulationStore = create<SimulationState & SimulationActions>((set, get) => ({
  ...initialState,
  actions: {
    applyMessage: (data) => {
      if (!isSimulationSocketMessage(data)) return

      if (data.event === 'PROGRESS') {
        set({
          event: 'PROGRESS',
          batchCount: data.batchCount,
          batteryCellCount: data.batteryCellCount,
          captureSpeed: data.captureSpeed,
          registered: Array.isArray(data.registered) ? data.registered : [],
          capture: Array.isArray(data.capture) ? data.capture : [],
          analyze: Array.isArray(data.analyze) ? null : (data.analyze ?? null),
          completed: Array.isArray(data.completed) ? data.completed : [],
          simulationStatus: 'running',
          lastMessage: data,
          lastMessageAt: Date.now(),
        })
        return
      }

      // event === 'COMPLETED'
      set({
        event: 'COMPLETED',
        simulationStatus: 'completed',
        registered: [],
        capture: [],
        analyze: null,
        lastMessage: data,
        lastMessageAt: Date.now(),
      })
    },

    setWsStatus: (status) => set({ wsStatus: status }),

    start: async (body) => {
      set({ isStarting: true, startError: null })
      try {
        const res = await simulationService.startSimulation(body)
        get().actions.applyMessage(res.data)
        set({ isStarting: false })
      } catch {
        set({ isStarting: false, startError: '시뮬레이션 시작에 실패했습니다.' })
      }
    },

    reset: () => set(initialState),
  },
}))
