import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'emailRequired').email('invalidEmail'),
  password: z.string().min(1, 'passwordRequired'),
})

export const signupSchema = z
  .object({
    name: z.string().min(1, 'fullNameRequired').min(2, 'nameLength'),
    email: z.string().min(1, 'emailRequired').email('invalidEmail'),
    password: z
      .string()
      .min(1, 'passwordRequired')
      .min(8, 'passwordLength')
      .regex(/[A-Z]/, 'passwordUppercase')
      .regex(/[a-z]/, 'passwordLowercase')
      .regex(/[0-9]/, 'passwordNumber')
      .regex(/[^A-Za-z0-9]/, 'passwordSpecial'),
    confirmPassword: z.string().min(1, 'confirmPasswordRequired'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwordsMatch",
    path: ['confirmPassword'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
