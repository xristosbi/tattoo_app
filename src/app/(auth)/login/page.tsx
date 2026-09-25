import LoginForm from '@/components/auth/LoginForm'
import AuthHeader from '@/components/auth/AuthHeader'
import AuthFooter from '@/components/auth/AuthFooter'

export const metadata = { title: 'Log in — Inkforge' }

export default function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string }
}) {
  return (
    <div className="w-full max-w-md">
      <AuthHeader titleKey="login_title" subtitleKey="login_subtitle" />
      <div className="card-surface p-6">
        <LoginForm redirectTo={searchParams.next ?? '/generate'} />
      </div>
      <AuthFooter textKey="no_account" linkKey="signup_link" href="/signup" />
    </div>
  )
}
