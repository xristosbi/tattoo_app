import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  elevated?: boolean
}

export default function Card({ children, className, elevated }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border',
        elevated
          ? 'bg-ink-800 border-ink-600'
          : 'bg-ink-900 border-ink-600',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('px-5 py-4 border-b border-ink-600', className)}>{children}</div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
