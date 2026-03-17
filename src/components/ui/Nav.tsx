'use client'

const NAV_ITEMS = [
  { label: 'about', index: 1 },
  { label: 'experiences', index: 2 },
  { label: 'education', index: 3 },
]

interface NavProps {
  current: number
  gotoSection: (i: number) => void
}

export default function Nav({ current, gotoSection }: NavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-6 right-8 z-[60] hidden md:flex flex-col items-end gap-2 bg-black/20 backdrop-blur-md rounded-lg px-3 py-2"
    >
      {NAV_ITEMS.map(({ label, index }) => (
        <button
          key={label}
          onClick={() => gotoSection(index)}
          aria-current={current === index ? 'page' : undefined}
          className={[
            'font-mono tracking-widest uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer',
            current === index ? 'text-white' : 'text-white/50 hover:text-white/80',
          ].join(' ')}
          style={{ fontSize: 'var(--text-label)' }}
        >
          {label}
        </button>
      ))}
    </nav>
  )
}
