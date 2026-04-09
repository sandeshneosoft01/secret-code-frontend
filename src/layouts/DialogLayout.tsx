import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

type PropTypes = {
  children: React.ReactNode
  title?: string
  description?: string
  contentClass?: string
  open?: boolean
  dialogOverlayClass?: string
  handleOpenChange?: () => void
  showCloseButton?: boolean
}

const DialogLayout = (props: PropTypes) => {
  const {
    title = '',
    description = '',
    children,
    contentClass,
    open = true,
    dialogOverlayClass = '',
    handleOpenChange,
    showCloseButton = false
  } = props
  return (
    <Dialog open={open} onOpenChange={() => handleOpenChange?.()}>
      <DialogContent
        className={contentClass ? contentClass : 'w-full'}
        showCloseButton={showCloseButton}
        dialogOverlayClass={dialogOverlayClass}>
        {(title || description) && (
          <DialogHeader className="gap-0">
            <DialogTitle className="text-md">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default DialogLayout
