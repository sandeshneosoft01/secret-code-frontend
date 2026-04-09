'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useStore } from '@/store'

const publicRoutes = ['/login', '/signup']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const isPublicRoute = publicRoutes.includes(pathname)

    if (!user && !isPublicRoute) {
      router.replace('/login')
    } else if (user && isPublicRoute) {
      router.replace('/')
    }
  }, [user, pathname, router])

  return <>{children}</>
}
