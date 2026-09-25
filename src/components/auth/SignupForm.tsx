'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password.length < 8) {
      setError('Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες')
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
        label="Ονοματεπώνυμο"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Γιάννης Παπαδόπουλος"
        autoComplete="name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Κωδικός"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Τουλάχιστον 8 χαρακτήρες"
        required
        autoComplete="new-password"
      />
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Δημιουργία Λογαριασμού
      </Button>
      <p className="text-xs text-center text-ink-500">
        Με την εγγραφή σου, αποδέχεσαι τους όρους χρήσης και την πολιτική απορρήτου.
      </p>
    </form>
  )
}
