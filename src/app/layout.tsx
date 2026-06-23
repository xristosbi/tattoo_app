import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Inkforge — AI Tattoo Stencil Generator',
  description:
    'Generate professional tattoo stencils from photos or text prompts. Used by tattoo artists worldwide.',
  keywords: ['tattoo stencil', 'tattoo generator', 'AI tattoo', 'stencil maker'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-ink-950 text-ink-100 antialiased">{children}</body>
    </html>
  )
}
