import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import { useMutation, useIsMutating } from '@tanstack/react-query'
import { signInWithPopup } from 'firebase/auth'

import { Button } from '../ui/button'

import {
  auth as googleAuthConfig,
  googleProvider,
} from '@/lib/firebase'
import { signInWithGoogle, signUpWithGoogle } from '@/services/user-service'
import { useStore } from '@/store'
import { useRouter } from 'next/navigation'

type PropTypes = {
  title: string,
  loginType: 'signin' | 'signup'
}

const GoogleAuth = (props: PropTypes) => {
  const { title, loginType } = props
  const navigate = useRouter()
  const isMutating = useIsMutating()
  const mutation = useMutation({
    mutationFn: loginType === 'signin' ? signInWithGoogle : signUpWithGoogle,
    onSuccess: (data) => handleSuccess(data),
    onError: () => { },
  })
  const setUser = useStore((s) => s.setUser);

  const handleSuccess = (user: any) => {
    const userDetails = {
      token: user.token,
      user: user.user,
    }

    setUser(userDetails)
    toast.success(`${loginType === 'signin' ? 'Signed in' : 'Signed up'} successfully!`)
    navigate.push('/')
  }

  const handleSignInGoogle = async (e: React.MouseEvent) => {
    const button = e.target as HTMLButtonElement
    button.disabled = true
    try {
      const result = await signInWithPopup(googleAuthConfig, googleProvider)
      const idToken = await result.user.getIdToken(true)
      await mutation.mutate(idToken)
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to sign in with Google.')
    }
    button.disabled = false
  }
  return (
    <Button
      className="cursor-pointer w-full"
      variant="outline"
      disabled={mutation.isPending || isMutating > 0}
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
