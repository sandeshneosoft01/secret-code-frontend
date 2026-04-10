import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInUser, signUpUser } from '@/services/user-service'
import { useStore } from '@/store'
import type { SignInUserPayload, SignUpUserPayload } from '@/types'
import { useTranslations } from 'next-intl'

export const useSignin = () => {
  const t = useTranslations('Messages')
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: SignInUserPayload) => signInUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(t(response.code || 'SIGNIN_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      const code = error.response?.data?.code || 'INTERNAL_ERROR'
      toast.error(t(code as any))
    },
  })
}

export const useSignup = () => {
  const t = useTranslations('Messages')
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: SignUpUserPayload) => signUpUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(t(response.code || 'SIGNUP_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      const code = error.response?.data?.code || 'INTERNAL_ERROR'
      toast.error(t(code as any))
    },
  })
}
