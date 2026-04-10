'use client'
import React from 'react'
import { usePathname } from 'next/navigation'

import DialogLayout from '@/layouts/DialogLayout'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()

  return (
    <DialogLayout
      modal={false}
      title={`${pathName === '/signup' ? 'Sign up' : 'Sign'} into your account`}
      contentClass="sm:max-w-sm"
      dialogOverlayClass="backdrop-blur-xl bg-black/30">
      {children}
    </DialogLayout>
  )
}

export default Layout
