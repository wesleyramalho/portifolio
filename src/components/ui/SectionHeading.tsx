interface SectionHeadingProps {
  children: React.ReactNode
}

export default function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2
      className="font-sans font-bold uppercase tracking-widest mb-12 text-label text-zinc-400"
    >
      {children}
    </h2>
  )
}
