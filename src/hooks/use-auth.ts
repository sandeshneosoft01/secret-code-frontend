import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInUser, signUpUser } from '@/services/user-service'
import { useStore } from '@/store'
import type { SignInUserPayload, SignUpUserPayload } from '@/types'
import { getFriendlyMessage } from '@/constant/messages'

export const useSignin = () => {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: SignInUserPayload) => signInUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(getFriendlyMessage(response.message || 'SIGNIN_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(getFriendlyMessage(error.message || error.error || 'INTERNAL_ERROR'))
    },
  })
}

export const useSignup = () => {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: SignUpUserPayload) => signUpUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(getFriendlyMessage(response.message || 'SIGNUP_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(getFriendlyMessage(error.message || error.error || 'INTERNAL_ERROR'))
    },
  })
}
