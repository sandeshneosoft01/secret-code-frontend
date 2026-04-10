'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useStore } from '@/store'

const publicRoutes = ['/login', '/signup', '/enter-code']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
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
  }, [user, pathname, router])

  return <>{children}</>
}
