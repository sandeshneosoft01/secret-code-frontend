import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { signInUser, signUpUser } from '@/services/user-service'
import { useStore } from '@/store'
import type { SignInUserPayload, SignUpUserPayload } from '@/types'

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
      toast.success('Signed in successfully!')
      router.push('/')
    },
    onError: (error: any) => {
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
      toast.success('Account created successfully!')
      router.push('/')
    },
    onError: (error: any) => {
    },
  })
}
