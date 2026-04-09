import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { signInWithPopup } from 'firebase/auth'

import { Button } from '../ui/button'

import {
  auth as googleAuthConfig,
  googleProvider,
} from '@/lib/firebase'
import { signInUser, signInWithGoogle } from '@/services/user-service'

type PropTypes = {
  title: string
}

const GoogleAuth = (props: PropTypes) => {
  const { title } = props
  const mutationGoogle = useMutation({
    mutationFn: signInWithGoogle,
    // onSuccess: (data) => handleSuccessGoogle(data),
    onError: () => { },
  })
  const mutation = useMutation({
    mutationFn: signInUser,
    // onSuccess: (data) => handleSuccess(data),
    onError: () => { },
  })

  const handleSignInGoogle = async (e: React.MouseEvent) => {
    const button = e.target as HTMLButtonElement
    button.disabled = true
    try {
      const result = await signInWithPopup(googleAuthConfig, googleProvider)
      const idToken = await result.user.getIdToken(true)
      await mutationGoogle.mutate(idToken)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sign in with Google.')
    }
    button.disabled = false
  }
  return (
    <Button
      className="cursor-pointer w-full"
      variant="outline"
      disabled={mutation.isPending || mutationGoogle.isPending}
      onClick={handleSignInGoogle}
    >
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
