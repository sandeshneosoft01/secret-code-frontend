import { StateCreator } from 'zustand'

export interface AuthSlice {
  user: null | { id: string; name: string }
  setUser: (user: AuthSlice['user']) => void
  logout: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
})