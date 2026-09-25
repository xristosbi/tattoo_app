import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#89F336',
          900: '#122A1E',
          800: '#193626',
          700: '#1E3D2D',
          600: '#2B5240',
          500: '#3A6B55',
          400: '#4A6B58',
          300: '#7A9B8A',
          200: '#A8C4B4',
          100: '#D0E8DC',
          50: '#F0EDE8',
        },
        forge: {
          600: '#3F7215',
          500: '#5AA020',
          400: '#72CC2C',
          300: '#89F336',
          200: '#9BF54A',
          100: '#C9A84C',
          50: '#F5EDD4',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        mono: ['var(--font-dm-mono)', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        shimmer: {
          from: { backgroundPosition: '200% 0' },
          to: { backgroundPosition: '-200% 0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
