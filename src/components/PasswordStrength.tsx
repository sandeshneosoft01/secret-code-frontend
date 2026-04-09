'use client'

import { useMemo } from 'react'
import { Check, X, Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Requirement {
  id: string
  label: string
  met: boolean
}

interface PasswordStrengthProps {
  password?: string
}

const PasswordStrength = ({ password = '' }: PasswordStrengthProps) => {
  const requirements: Requirement[] = useMemo(() => {
    return [
      { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
      { id: 'uppercase', label: 'Contains uppercase letters', met: /[A-Z]/.test(password) },
      { id: 'lowercase', label: 'Contains lowercase letters', met: /[a-z]/.test(password) },
      { id: 'number', label: 'Contains numbers', met: /[0-9]/.test(password) },
      { id: 'special', label: 'Contains special characters', met: /[^A-Za-z0-9]/.test(password) },
    ]
  }, [password])

  const strengthScore = requirements.filter((r) => r.met).length

  const getStrengthLabel = () => {
    if (password.length === 0) return 'Enter a password'
    switch (strengthScore) {
      case 0:
      case 1:
        return 'Very Weak'
      case 2:
        return 'Weak'
      case 3:
        return 'Fair'
      case 4:
        return 'Strong'
      case 5:
        return 'Very Strong'
      default:
        return ''
    }
  }

  const getStrengthColor = () => {
    if (password.length === 0) return 'bg-gray-200 dark:bg-gray-800'
    switch (strengthScore) {
      case 0:
      case 1:
        return 'bg-rose-500'
      case 2:
        return 'bg-orange-500'
      case 3:
        return 'bg-amber-500'
      case 4:
        return 'bg-emerald-500'
      case 5:
        return 'bg-green-500'
      default:
        return 'bg-gray-200 dark:bg-gray-800'
    }
  }

  const getShieldIcon = () => {
    if (strengthScore <= 2) return <ShieldAlert size={16} className="text-rose-500" />
    if (strengthScore <= 4) return <Shield size={16} className="text-amber-500" />
    return <ShieldCheck size={16} className="text-green-500" />
  }

  return (
    <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-1.5">
            {password.length > 0 && getShieldIcon()}
            <span className={cn(
              "transition-colors duration-300",
              password.length > 0 ? (strengthScore <= 2 ? "text-rose-600" : strengthScore <= 4 ? "text-amber-600" : "text-green-600") : "text-muted-foreground"
            )}>
              {getStrengthLabel()}
            </span>
          </div>
          <span className="text-muted-foreground">{strengthScore}/5 requirements met</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500 ease-out',
                level <= strengthScore ? getStrengthColor() : 'bg-gray-200 dark:bg-gray-800'
              )}
            />
          ))}
        </div>
      </div>

      <ul className="space-y-1.5" role="list">
        {requirements.map((req) => (
          <li key={req.id} className="flex items-center gap-2 text-[13px] transition-all duration-300">
            <div className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
              req.met ? "border-green-500 bg-green-500/10 text-green-600" : "border-muted-foreground/30 text-muted-foreground"
            )}>
              {req.met ? (
                <Check size={10} strokeWidth={3} className="animate-in zoom-in duration-300" />
              ) : (
                <X size={10} strokeWidth={3} />
              )}
            </div>
            <span className={cn(
              "transition-colors duration-300",
              req.met ? "text-foreground font-medium" : "text-muted-foreground"
            )}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PasswordStrength
