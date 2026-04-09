'use client'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { FormEvent } from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginValues } from '@/lib/validations'

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    console.log('Login data:', data)
  }

  return (
    <div>
      <GoogleAuth title="Sign in with Google" />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
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
            {errors.password && (
              <p className="text-[13px] text-rose-500 animate-in fade-in slide-in-from-top-1 duration-300">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button className="w-full mt-8 cursor-pointer" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?&nbsp;
          <Link href="/signup" className="text-black font-semibold underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
