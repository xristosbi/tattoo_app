import Link from 'next/link'
import { Zap, Image, Type, Download, Users, Shield } from 'lucide-react'

const features = [
  {
    icon: Image,
    title: 'Image to Stencil',
    description:
      'Upload any photo or drawing and get a clean, print-ready stencil in seconds. Perfect for custom tattoo designs.',
  },
  {
    icon: Type,
    title: 'Text to Stencil',
    description:
      'Describe your tattoo concept in words. Our AI generates the image and converts it into a professional stencil.',
  },
  {
    icon: Download,
    title: 'Instant Download',
    description:
      'Download your stencil as a high-resolution PNG, ready to print and transfer directly to skin.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Generate stencils in under 30 seconds. No waiting, no queues — just results.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Studio tier lets you add up to 3 team members so your whole crew can generate stencils.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description:
      'Your designs are stored securely and are only accessible to you. We never share your work.',
  },
]

const pricing = [
  {
    name: 'Free',
    price: '€0',
    period: '/month',
    description: 'Try Inkforge with no commitment.',
    features: [
      '5 stencil generations/month',
      'Image to stencil',
      'Text to stencil',
      'PNG download',
      'Generation history',
    ],
    cta: 'Start free',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '€19',
    period: '/month',
    description: 'For active tattoo artists.',
    features: [
      '100 stencil generations/month',
      'Image to stencil',
      'Text to stencil',
      'PNG download',
      'Generation history',
      'Priority support',
    ],
    cta: 'Get Pro',
    href: '/signup?plan=pro',
    highlighted: true,
  },
  {
    name: 'Studio',
    price: '€49',
    period: '/month',
    description: 'For studios and shop teams.',
    features: [
      'Unlimited generations',
      'Image to stencil',
      'Text to stencil',
      'PNG download',
      'Generation history',
      'Up to 3 team members',
      'Priority support',
    ],
    cta: 'Get Studio',
    href: '/signup?plan=studio',
    highlighted: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      {/* Nav */}
      <nav className="border-b border-ink-600 bg-ink-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-forge-300 rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-ink-950" />
            </div>
            <span className="font-bold text-lg text-ink-50">Inkforge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-ink-300 hover:text-ink-100 transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-forge-300 hover:bg-forge-200 text-ink-950 px-4 py-1.5 rounded-lg transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-forge-300/10 border border-forge-300/30 text-forge-300 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <Zap className="w-3 h-3" />
          AI-powered stencil generation
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-ink-50 tracking-tight text-balance mb-6">
          Turn any idea into a{' '}
          <span className="gradient-text">tattoo stencil</span>
        </h1>
        <p className="text-lg sm:text-xl text-ink-300 max-w-2xl mx-auto mb-10 text-balance">
          Upload a photo or type a concept. Inkforge converts it to a clean, print-ready stencil
          in seconds — built for professional tattoo artists.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-forge-300 hover:bg-forge-200 text-ink-950 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-ink-600 hover:border-ink-500 text-ink-200 hover:text-ink-100 px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Log in
          </Link>
        </div>
        <p className="text-xs text-ink-400 mt-4">No credit card required · 5 free generations</p>
      </section>

      {/* Demo preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="rounded-2xl border border-ink-600 bg-ink-900 overflow-hidden">
          <div className="bg-ink-800 border-b border-ink-600 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-ink-400 ml-2">inkforge.app/generate</span>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="text-sm font-medium text-ink-400 uppercase tracking-wider">
                Text to Stencil
              </div>
              <div className="bg-ink-800 border border-ink-600 rounded-xl p-4">
                <p className="text-ink-200 text-sm">
                  "Traditional Japanese koi fish with lotus flowers, bold outlines"
                </p>
              </div>
              <div className="bg-forge-300/10 border border-forge-300/30 rounded-xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-forge-300 animate-pulse" />
                <span className="text-sm text-forge-200">Generating stencil...</span>
              </div>
            </div>
            <div className="aspect-square bg-ink-800 rounded-xl border border-ink-600 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto border-2 border-ink-600 rounded-xl flex items-center justify-center">
                  <Image className="w-8 h-8 text-ink-500" />
                </div>
                <p className="text-xs text-ink-500">Stencil preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-ink-50 mb-12">
          Everything you need to create perfect stencils
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-surface p-6">
              <div className="w-10 h-10 bg-forge-300/10 border border-forge-300/20 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-forge-300" />
              </div>
              <h3 className="font-semibold text-ink-100 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-ink-50 mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-ink-400 mb-12">
          Start free, upgrade when you need more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-xl border p-6 flex flex-col ${
                tier.highlighted
                  ? 'bg-forge-300/5 border-forge-300/50 relative'
                  : 'bg-ink-900 border-ink-600'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-forge-300 text-ink-950 text-xs font-bold px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-bold text-ink-50 text-lg mb-1">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-ink-50">{tier.price}</span>
                  <span className="text-ink-400 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-ink-400 mt-2">{tier.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                    <span className="text-forge-300 mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                  tier.highlighted
                    ? 'bg-forge-300 hover:bg-forge-200 text-ink-950'
                    : 'border border-ink-600 hover:border-ink-500 text-ink-200 hover:text-ink-100'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-600 bg-ink-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-forge-300 rounded flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-ink-950" />
            </div>
            <span className="font-semibold text-ink-100">Inkforge</span>
          </div>
          <p className="text-sm text-ink-400">
            © {new Date().getFullYear()} Inkforge. Built for tattoo artists.
          </p>
        </div>
      </footer>
    </div>
  )
}
