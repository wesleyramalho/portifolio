import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="absolute top-6 right-8 flex flex-col items-end gap-2 z-20">
      <Link
        href="#experiences"
        className="font-mono text-xs tracking-widest text-white/70 hover:text-white transition-colors uppercase"
      >
        experiences
      </Link>
      <Link
        href="#education"
        className="font-mono text-xs tracking-widest text-white/70 hover:text-white transition-colors uppercase"
      >
        education
      </Link>
    </nav>
  )
}
