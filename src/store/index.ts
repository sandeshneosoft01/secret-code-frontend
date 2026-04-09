import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createAuthSlice, AuthSlice } from './slices/authSlice'
import { createPersistStorage } from './persist'

type StoreState = AuthSlice

export const useStore = create<StoreState>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
      }),
      {
        name: 'app-storage',
        storage: createPersistStorage() as unknown as any,
        partialize: (state) => ({
          user: state.user,
        }),
      }
    )
  )
)