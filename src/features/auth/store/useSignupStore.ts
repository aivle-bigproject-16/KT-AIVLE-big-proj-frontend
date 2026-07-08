import { create } from 'zustand'
import { authService } from '../services/auth.service'
import type { SignupRequest } from '../types'
import type { AsyncState } from '@/shared/types/store'

interface SignupState extends AsyncState {
  isDone: boolean
}

interface SignupActions {
  actions: {
    signup: (body: SignupRequest) => Promise<void>
    reset: () => void
  }
}

const initialState: SignupState = {
  isLoading: false,
  isDone: false,
  error: null,
}

export const useSignupStore = create<SignupState & SignupActions>((set) => ({
  ...initialState,
  actions: {
    signup: async (body) => {
      set({ isLoading: true, error: null })
      try {
        await authService.signup(body)
        set({ isLoading: false, isDone: true })
      } catch {
        set({ error: '회원가입에 실패했습니다.', isLoading: false })
      }
    },

    reset: () => set(initialState),
  },
}))
