import { create } from 'zustand'
import { authService } from '../services/auth.service'
import type { LoginRequest } from '../types'
import type { AsyncState } from '@/shared/types/store'

interface LoginState extends AsyncState {
  name: string | null
  role: string | null
  isAuthenticated: boolean
}

interface LoginActions {
  actions: {
    login: (body: LoginRequest) => Promise<void>
    reset: () => void
  }
}

const initialState: LoginState = {
  name: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const useLoginStore = create<LoginState & LoginActions>((set) => ({
  ...initialState,
  actions: {
    login: async (body) => {
      set({ isLoading: true, error: null })
      try {
        const res = await authService.login(body)
        set({ name: res.data.name, role: res.data.role, isAuthenticated: true, isLoading: false })
      } catch {
        set({ error: '로그인에 실패했습니다.', isLoading: false })
      }
    },

    reset: () => set(initialState),
  },
}))
