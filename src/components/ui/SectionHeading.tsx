interface SectionHeadingProps {
  children: React.ReactNode
}

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      className="font-sans font-bold uppercase tracking-widest mb-12"
      style={{ fontSize: 'var(--text-label)', color: '#A1A1AA' }}
    >
      {children}
    </h2>
  )
}
