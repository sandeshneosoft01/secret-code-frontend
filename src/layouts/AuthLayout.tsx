import React from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
  // DialogTrigger
} from '@/components/ui/dialog'

type PropTypes = {
  children: React.ReactNode
  title?: string
  description?: string
}

const AuthLayout = (props: PropTypes) => {
  const { title = '', description = '', children } = props
  return (
    <Dialog open={true}>
      {/* <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
        {(title || description) && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default AuthLayout
