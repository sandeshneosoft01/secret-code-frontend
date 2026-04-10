'use client'
import React from 'react'
import { usePathname } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

import DialogLayout from '@/layouts/DialogLayout'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname()
  const t = useTranslations('Auth')

  return (
    <DialogLayout
      modal={false}
      title={pathName === '/signup' ? t('signupAccount') : t('signinAccount')}
      contentClass="sm:max-w-sm"
      dialogOverlayClass="backdrop-blur-xl bg-black/30">
      {children}
    </DialogLayout>
  )
}

export default Layout
