'use client'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupValues } from '@/lib/validations'
import { useSignup } from '@/hooks/use-auth'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import PasswordStrength from '@/components/PasswordStrength'

const Signup = () => {
  const { mutate: signup, isPending } = useSignup()
  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = form.watch('password', '')

  const onSubmit = (data: SignupValues) => {
    signup(data)
  }

  return (
    <div>
      <GoogleAuth title="Sign up with Google" loginType="signup" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <PasswordStrength password={password} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-8 cursor-pointer" type="submit" disabled={isPending}>
            {isPending ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>
      </Form>
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
