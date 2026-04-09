'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupValues } from '@/lib/validations'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import PasswordStrength from '@/components/PasswordStrength'

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: 'all',
  })

  const password = watch('password', '')

  const onSubmit = async (data: SignupValues) => {
    console.log('Signup success:', data)
  }

  const onError = (errors: any) => {
    console.log('Signup errors:', errors)
  }

  return (
    <div>
      <GoogleAuth title="Sign up with Google" />
      <form onSubmit={handleSubmit(onSubmit, onError)} className="mt-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              type="email"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="text-[13px] text-rose-500 animate-in fade-in slide-in-from-top-1 duration-300">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="********"
              type="password"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
            />
            <PasswordStrength password={password} />
            {errors.password && (
              <p className="text-[13px] text-rose-500 animate-in fade-in slide-in-from-top-1 duration-300">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button className="w-full mt-8 cursor-pointer" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up...' : 'Sign up'}
        </Button>
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Already account?&nbsp;
          <Link href="/login" className="text-black font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
