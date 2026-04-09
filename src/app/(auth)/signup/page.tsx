'use client'

import GoogleAuth from '@/components/GoogleAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React, { FormEvent } from 'react'

const Login = () => {
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
  }
  return (
    <div>
      <GoogleAuth title="Sign up with Google" />
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input placeholder="Enter your email" type="email" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input placeholder="********" type="password" />
          </div>
        </div>

        <Button className="w-full mt-8 cursor-pointer">Sign up</Button>
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

export default Login
