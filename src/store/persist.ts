import { StateStorage, createJSONStorage } from 'zustand/middleware'

export const createPersistStorage = (): StateStorage => {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    }
  }

  return createJSONStorage(() => localStorage) as unknown as StateStorage
}