interface GlassCardProps {
  children: React.ReactNode
  className?: string
  role?: string
}

export default function GlassCard({ children, className = '', role }: GlassCardProps) {
  return (
    <div className={`bg-white/5 border border-white/10 backdrop-blur-sm rounded-lg ${className}`} role={role}>
      {children}
    </div>
  )
}
