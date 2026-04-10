'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useStore } from '@/store'

const publicRoutes = ['/login', '/signup', '/enter-code']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user)
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const isPublicRoute = publicRoutes.includes(pathname)

    if (!user && !isPublicRoute) {
      router.replace('/login')
    } else if (user && isPublicRoute) {
      if (pathname === '/enter-code') {
        router.replace(pathname)
      } else {
        router.replace('/')
      }
    }
  }, [user, pathname, router, isMounted])

  if (!isMounted) return null

  const isPublicRoute = publicRoutes.includes(pathname)

  // Prevent flash of protected content before redirect
  if (!user && !isPublicRoute) return null

  // Prevent flash of auth content before redirect
  if (user && isPublicRoute && pathname !== '/enter-code') return null

  return <>{children}</>
}
