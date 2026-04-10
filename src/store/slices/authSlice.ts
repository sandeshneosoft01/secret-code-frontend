import { StateCreator } from 'zustand'
import { decodeJwt } from 'jose'

export interface AuthSlice {
  user: null | { user: any, token: string | null }
  setUser: (user: AuthSlice['user']) => void
  logout: () => void
  checkAuth: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
  checkAuth: () => {
    const { user, logout } = get()
    if (user && user.token) {
      try {
        const payload = decodeJwt(user.token)
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          logout()
        }
      } catch (error) {
        logout()
      }
    }
  }
})