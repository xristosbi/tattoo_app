import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata = { title: 'Log in — Inkforge' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-ink-50 mb-2">Welcome back</h1>
        <p className="text-ink-400 text-sm">Sign in to your Inkforge account</p>
      </div>
      <div className="card-surface p-6">
        <LoginForm redirectTo={searchParams.next ?? '/generate'} />
      </div>
      <p className="text-center text-sm text-ink-400 mt-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-forge-300 hover:text-forge-200 font-medium">
          Sign up free
        </Link>
      </p>
    </div>
  )
}
