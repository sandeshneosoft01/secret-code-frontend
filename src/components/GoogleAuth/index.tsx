import Image from 'next/image'
import React from 'react'

import { Button } from '../ui/button'

type PropTypes = {
  title: string
}

const GoogleAuth = (props: PropTypes) => {
  const { title } = props
  return (
    <Button className="cursor-pointer w-full" variant="outline">
      <Image
        src="/assets/icons/google-icon.png"
        alt="google-icon"
        width={20}
        height={20}
      />
      <span>{title}</span>
    </Button>
  )
}

export default GoogleAuth
