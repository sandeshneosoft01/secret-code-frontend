'use client'
import { useIsMutating } from '@tanstack/react-query'
import { Link } from '@/i18n/navigation'
import { useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, SignupValues } from '@/lib/validations'
import { useSignup } from '@/hooks/use-auth'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import PasswordStrength from '@/components/PasswordStrength'

const Signup = () => {
  const t = useTranslations('Auth')
  const { mutate: signup, isPending } = useSignup()
  const isMutating = useIsMutating({ mutationKey: ['signup'] })
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
      <GoogleAuth title={`${t('signup')} ${t('withGoogle')}`} loginType="signup" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fullName')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterFullName')} {...field} />
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
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('enterEmail')} type="email" {...field} />
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
                  <FormLabel>{t('password')}</FormLabel>
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
                  <FormLabel>{t('confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input placeholder="********" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-8 cursor-pointer" type="submit" disabled={isPending || isMutating > 0}>
            {isPending || isMutating > 0 ? t('signingUp') : t('signup')}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6 pb-2">
        <p className="text-sm text-muted-foreground">
          {t('alreadyHaveAccount')}&nbsp;
          <Link href="/login" className="text-primary font-semibold hover:underline transition-all">
            {t('signin')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
