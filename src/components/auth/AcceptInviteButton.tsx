'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function AcceptInviteButton({
  token,
  email,
}: {
  token: string
  email: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAccept() {
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/team/${token}/accept`, { method: 'POST' })
    // Note: token here is the invite_token value used as the [id] segment
    const data = await res.json()

    if (!res.ok) {
      setError(data.message ?? data.error ?? 'Failed to accept invite')
      setLoading(false)
      return
    }

    router.push('/generate')
    router.refresh()
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleAccept} loading={loading} className="w-full" size="lg">
        Accept invite & join team
      </Button>
      {error && <p className="text-xs text-red-400 text-center">{error}</p>}
      <p className="text-xs text-ink-500 text-center">
        You must be logged in as <span className="text-ink-300">{email}</span> to accept.
      </p>
    </div>
  )
}
