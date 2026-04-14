import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInUser, signUpUser } from '@/services/user-service'
import { useStore } from '@/store'
import type { SignInUserPayload, SignUpUserPayload } from '@/types'
import { useTranslations } from 'next-intl'
import { MessageCode } from '@/constant/messages'
import { getErrorMessage } from '@/lib/error-handler'

export const useSignin = () => {
  const t = useTranslations('Messages')
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationKey: ['signin'],
    mutationFn: (data: SignInUserPayload) => signInUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(t(response.code || response.message || 'SIGNIN_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      const code = getErrorMessage(error, 'SOMETHING_WENT_WRONG')
      toast.error(t(code as MessageCode))
    },
  })
}

export const useSignup = () => {
  const t = useTranslations('Messages')
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)

  return useMutation({
    mutationKey: ['signup'],
    mutationFn: (data: SignUpUserPayload) => signUpUser(data),
    onSuccess: (response) => {
      setUser({
        token: response.token,
        user: response.user,
      })
      toast.success(t(response.code || response.message || 'SIGNUP_SUCCESSFUL'))
      router.push('/')
    },
    onError: (error: any) => {
      const code = getErrorMessage(error, 'SOMETHING_WENT_WRONG')
      toast.error(t(code as MessageCode))
    },
  })
}
