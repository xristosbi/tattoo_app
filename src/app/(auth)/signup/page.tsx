import SignupForm from '@/components/auth/SignupForm'
import AuthHeader from '@/components/auth/AuthHeader'
import AuthFooter from '@/components/auth/AuthFooter'

export const metadata = { title: 'Sign up — Inkforge' }

export default function SignupPage({
  searchParams,
}: {
  searchParams: { plan?: string }
}) {
  return (
    <div className="w-full max-w-md">
      <AuthHeader titleKey="signup_title" subtitleKey="signup_subtitle" />
      <div className="card-surface p-6">
        <SignupForm defaultPlan={searchParams.plan} />
      </div>
      <AuthFooter textKey="have_account" linkKey="login_link" href="/login" />
    </div>
  )
}
