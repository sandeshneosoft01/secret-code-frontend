'use client'

import { useEffect, useState } from 'react'
import { useStore } from './index'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    useStore.getState().checkAuth()
    setHydrated(true)
  }, [])

  if (!hydrated) return null

  return <>{children}</>
}