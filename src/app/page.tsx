import Link from 'next/link'
import { Download, Users, Shield, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Sparkles,
    title: 'Image to Stencil',
    description:
      'Upload any photo or drawing and get a clean, print-ready stencil in seconds. Perfect for custom tattoo designs.',
  },
  {
    icon: Download,
    title: 'Text to Stencil',
    description:
      'Describe your tattoo concept in words. Our AI generates the image and converts it into a professional stencil.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Studio tier lets you add up to 3 team members so your whole crew can generate stencils together.',
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
    name: 'Starter',
    price: '€12',
    period: 'per month',
    gens: '20 stencil generations',
    features: [
      'Image to stencil',
      'Text to stencil',
      'PNG download (2048 px)',
      '30-day history',
    ],
    cta: 'Get Starter',
    href: '/signup',
    highlighted: false,
    gold: false,
  },
  {
    name: 'Plus',
    price: '€29',
    period: 'per month',
    gens: '60 stencil generations',
    features: [
      'Everything in Starter',
      'Priority generation queue',
      'Unlimited history',
      'Prompt fine-tuning',
    ],
    cta: 'Get Plus',
    href: '/signup?plan=pro',
    highlighted: true,
    gold: false,
  },
  {
    name: 'Professional',
    price: '€59',
    period: 'per month',
    gens: 'Unlimited generations',
    features: [
      'Everything in Plus',
      'Up to 3 team members',
      'Shared studio library',
      'Dedicated support',
    ],
    cta: 'Get Professional',
    href: '/signup?plan=studio',
    highlighted: false,
    gold: true,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink-950">
      {/* Nav */}
      <nav className="border-b border-ink-600 bg-ink-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-forge-300 rounded-md flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L8.6 5.1L13 5.8L10 8.7L10.7 13L7 11L3.3 13L4 8.7L1 5.8L5.4 5.1L7 1Z" fill="#F0EDE8"/>
              </svg>
            </div>
            <span className="font-playfair font-bold text-lg text-ink-50 tracking-wide">INKFORGE</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-ink-300 hover:text-ink-50 transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-ink-300 hover:text-ink-50 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="text-sm text-ink-300 hover:text-ink-100 transition-colors px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold bg-forge-300 hover:bg-forge-200 text-ink-50 px-4 py-2 rounded-lg transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-forge-300/10 border border-forge-300/25 text-forge-200 text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full mb-8">
          AI-Powered Stencil Generation
        </div>
        <h1 className="font-playfair text-4xl sm:text-5xl md:text-[62px] font-black text-ink-50 leading-[1.06] text-balance mb-6">
          Your design.{' '}
          <em className="text-forge-100 not-italic">Stencil-ready</em>{' '}
          in seconds.
        </h1>
        <p className="text-base sm:text-lg text-ink-300 max-w-lg mx-auto mb-10 leading-relaxed">
          The AI stencil generator built for professional tattoo artists.
          Upload any design — photograph, sketch, or digital art — and get a
          clean, print-ready stencil.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-forge-300 hover:bg-forge-200 text-ink-50 font-semibold px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Start free — no card needed
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-ink-600 hover:border-ink-500 text-ink-200 hover:text-ink-50 px-8 py-3.5 rounded-xl text-base transition-colors"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-ink-400 mt-4 font-mono tracking-wide">5 free generations · no credit card required</p>
      </section>

      {/* Before / After proof */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-5 items-center">
          {/* Original */}
          <div className="rounded-2xl border border-ink-600 overflow-hidden">
            <div className="bg-ink-900 border-b border-ink-600 px-4 py-2.5">
              <span className="font-mono text-[10px] tracking-widest uppercase text-ink-400">Original design</span>
            </div>
            <div className="bg-ink-800 aspect-[4/3] flex items-center justify-center p-6">
              <svg viewBox="0 0 200 150" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="68" rx="42" ry="50" stroke="#4A6B58" strokeWidth="2.5" opacity=".7"/>
                <ellipse cx="84" cy="72" rx="12" ry="9" stroke="#4A6B58" strokeWidth="2" opacity=".6"/>
                <ellipse cx="116" cy="72" rx="12" ry="9" stroke="#4A6B58" strokeWidth="2" opacity=".6"/>
                <path d="M96 85 L100 95 L104 85" stroke="#4A6B58" strokeWidth="2" opacity=".6"/>
                <path d="M86 107 L88 117 L91 107 M94 107 L96 117 L99 107 M102 107 L104 117 L107 107 M110 107 L112 117 L115 107" stroke="#4A6B58" strokeWidth="2" opacity=".5"/>
                <path d="M60 100 C50 95 45 88 48 80" stroke="#4A6B58" strokeWidth="1.5" opacity=".4"/>
                <ellipse cx="100" cy="60" rx="28" ry="22" stroke="#4A6B58" strokeWidth="1.5" strokeDasharray="3 3" opacity=".3"/>
              </svg>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-ink-800 border border-ink-600 items-center justify-center flex-shrink-0 mx-auto">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9.5 4.5M13 8L9.5 11.5" stroke="#7A9B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex sm:hidden justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3V17M10 17L5.5 12.5M10 17L14.5 12.5" stroke="#7A9B8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Stencil output */}
          <div className="rounded-2xl border border-forge-300/30 overflow-hidden">
            <div className="bg-ink-900 border-b border-forge-300/20 px-4 py-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-widest uppercase text-forge-200">Inkforge output</span>
              <span className="w-1.5 h-1.5 rounded-full bg-forge-200 shadow-[0_0_6px_#3B8C68]"></span>
            </div>
            <div className="bg-[#FAFAF8] aspect-[4/3] flex items-center justify-center p-6">
              <svg viewBox="0 0 200 150" width="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="100" cy="68" rx="42" ry="50" stroke="#1a1a1a" strokeWidth="3"/>
                <ellipse cx="84" cy="72" rx="12" ry="9" stroke="#1a1a1a" strokeWidth="2.5" fill="#1a1a1a"/>
                <ellipse cx="116" cy="72" rx="12" ry="9" stroke="#1a1a1a" strokeWidth="2.5" fill="#1a1a1a"/>
                <path d="M96 85 L100 95 L104 85" stroke="#1a1a1a" strokeWidth="2.5"/>
                <path d="M86 107 L88 117 L91 107 M94 107 L96 117 L99 107 M102 107 L104 117 L107 107 M110 107 L112 117 L115 107" stroke="#1a1a1a" strokeWidth="2.5"/>
                <path d="M60 100 C50 95 45 88 48 80" stroke="#1a1a1a" strokeWidth="2.5"/>
                <path d="M140 100 C150 95 155 88 152 80" stroke="#1a1a1a" strokeWidth="2.5"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <h2 className="font-playfair text-3xl font-bold text-center text-ink-50 mb-3 text-balance">
          Built for working artists
        </h2>
        <p className="text-center text-ink-300 text-sm mb-12">Everything you need, nothing you don't.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title} className="bg-ink-900 border border-ink-600 rounded-xl p-6 hover:border-ink-500 transition-colors">
              <div className="w-9 h-9 bg-forge-300/12 border border-forge-300/25 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-4 h-4 text-forge-200" />
              </div>
              <h3 className="font-semibold text-ink-50 mb-2">{f.title}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-ink-900/50 border-y border-ink-600 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="font-playfair text-3xl font-bold text-center text-ink-50 mb-3 text-balance">
            Simple, honest pricing
          </h2>
          <p className="text-center text-ink-300 text-sm mb-12">
            One monthly generation allowance. No surprises. Cancel anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-6 flex flex-col relative ${
                  tier.highlighted
                    ? 'bg-ink-800 border-forge-300/50'
                    : tier.gold
                    ? 'bg-ink-900 border-forge-100/25'
                    : 'bg-ink-900 border-ink-600'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-forge-300 text-ink-50 text-[10px] font-mono font-medium tracking-widest uppercase px-3 py-1 rounded-b-lg">
                    Most Popular
                  </div>
                )}
                <div className="font-mono text-[10px] tracking-widest uppercase text-ink-400 mb-3">{tier.name}</div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-playfair text-[38px] font-bold text-ink-50 leading-none">{tier.price}</span>
                </div>
                <div className="text-xs text-ink-400 mb-4 font-mono">{tier.period}</div>
                <div className="text-sm font-medium text-ink-100 mb-4">{tier.gens}</div>
                <ul className="space-y-2.5 flex-1 mb-6">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-300">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="flex-shrink-0 mt-0.5">
                        <circle cx="7.5" cy="7.5" r="7" fill="#2D6A4F" fillOpacity=".3"/>
                        <path d="M5 7.5L7 9.5L10.5 5.5" stroke="#3B8C68" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    tier.highlighted
                      ? 'bg-forge-300 hover:bg-forge-200 text-ink-50'
                      : tier.gold
                      ? 'bg-forge-100/10 border border-forge-100/30 text-forge-100 hover:bg-forge-100/18'
                      : 'border border-ink-600 hover:border-ink-500 text-ink-200 hover:text-ink-50'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-600 bg-ink-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-forge-300 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1L7.3 4.4L11 5L8.5 7.4L9.1 11L6 9.4L2.9 11L3.5 7.4L1 5L4.7 4.4L6 1Z" fill="#F0EDE8"/>
              </svg>
            </div>
            <span className="font-playfair font-bold text-ink-50 tracking-wide">INKFORGE</span>
          </div>
          <p className="text-sm text-ink-400">
            © {new Date().getFullYear()} Inkforge. Built for tattoo artists.
          </p>
        </div>
      </footer>
    </div>
  )
}
