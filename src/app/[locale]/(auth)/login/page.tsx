'use client'

import { useIsMutating } from '@tanstack/react-query'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignin } from '@/hooks/use-auth'
import { loginSchema, LoginValues } from '@/lib/validations'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

const Login = () => {
  const t = useTranslations('Auth')
  const { mutate: signin, isPending } = useSignin()
  const isMutating = useIsMutating()
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginValues) => {
    signin(data)
  }

  return (
    <div>
      <GoogleAuth title={`${t('signin')} ${t('withGoogle')}`} loginType="signin" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-5">
          <div className="space-y-4">
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button className="w-full mt-8 cursor-pointer" type="submit" disabled={isPending || isMutating > 0}>
            {isPending || isMutating > 0 ? t('signingIn') : t('signin')}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          {t('dontHaveAccount')}&nbsp;
          <Link href="/signup" className="text-primary font-semibold hover:underline transition-all duration-200">
            {t('signup')}
          </Link>
        </p>
      </div>

    </div>
  )
}

export default Login
