'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface SignupFormProps {
  defaultPlan?: string
}

export default function SignupForm({ defaultPlan }: SignupFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { t } = useLanguage()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError(t('password_error'))
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() || null },
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (defaultPlan === 'starter' || defaultPlan === 'plus' || defaultPlan === 'professional') {
      router.push(`/settings?plan=${defaultPlan}`)
    } else {
      router.push('/generate')
    }
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={t('name_label')}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('name_placeholder')}
        autoComplete="name"
      />
      <Input
        label={t('email_label')}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label={t('password_label')}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('password_placeholder')}
        required
        autoComplete="new-password"
      />
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        {t('signup_btn')}
      </Button>
      <p className="text-xs text-center text-ink-500">{t('terms_text')}</p>
    </form>
  )
}
