import SignupForm from '@/components/auth/SignupForm'
import Link from 'next/link'

export const metadata = { title: 'Sign up — Inkforge' }

export default function SignupPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-ink-50 mb-2">Δημιούργησε λογαριασμό</h1>
        <p className="text-ink-400 text-sm">
          Ξεκίνα με 3 δωρεάν δημιουργίες — χωρίς πιστωτική κάρτα
        </p>
      </div>
      <div className="card-surface p-6">
        <SignupForm defaultPlan={searchParams.plan} />
      </div>
      <p className="text-center text-sm text-ink-400 mt-6">
        Έχεις ήδη λογαριασμό;{' '}
        <Link href="/login" className="text-forge-300 hover:text-forge-200 font-medium">
          Σύνδεση
        </Link>
      </p>
    </div>
  )
}
