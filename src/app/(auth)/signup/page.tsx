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
        <h1 className="text-2xl font-bold text-ink-50 mb-2">Create your account</h1>
        <p className="text-ink-400 text-sm">
          Start with 5 free generations — no credit card required
        </p>
      </div>
      <div className="card-surface p-6">
        <SignupForm defaultPlan={searchParams.plan} />
      </div>
      <p className="text-center text-sm text-ink-400 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-forge-300 hover:text-forge-200 font-medium">
          Log in
        </Link>
      </p>
    </div>
  )
}
