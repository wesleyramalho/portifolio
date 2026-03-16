'use client'

import { useSectionContext } from '@/contexts/SectionContext'

const NAV_ITEMS = [
  { label: 'about', index: 1 },
  { label: 'experiences', index: 2 },
  { label: 'education', index: 3 },
]

export default function Nav() {
  const { index: current, gotoSection } = useSectionContext()

  return (
    <nav
      aria-label="Main navigation"
      className="absolute top-6 right-8 flex flex-col items-end gap-2 z-20"
    >
      {NAV_ITEMS.map(({ label, index }) => (
        <button
          key={label}
          onClick={() => gotoSection(index)}
          aria-current={current === index ? 'page' : undefined}
          className={[
            'font-mono tracking-widest uppercase transition-colors bg-transparent border-0 p-0',
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
