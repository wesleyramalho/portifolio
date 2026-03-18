'use client'

import { useTranslations } from 'next-intl'
import { NAV_ITEMS } from '@/lib/navigation'

interface NavProps {
  current: number
  gotoSection: (index: number) => void
}

export default function Nav({ current, gotoSection }: NavProps) {
  const t = useTranslations('nav')

  return (
    <nav
      aria-label="Main navigation"
      className="fixed top-6 right-8 z-[60] hidden md:flex flex-col items-end gap-2 bg-black/20 backdrop-blur-md rounded-lg px-3 py-2"
    >
      {NAV_ITEMS.map(({ key, index }) => (
        <button
          key={key}
          onClick={() => gotoSection(index)}
          aria-current={current === index ? 'page' : undefined}
          className={[
            'font-mono tracking-widest uppercase transition-colors bg-transparent border-0 p-0 cursor-pointer text-label',
            current === index ? 'text-white' : 'text-white/50 hover:text-white/80',
          ].join(' ')}
        >
          {t(key)}
        </button>
      ))}
    </nav>
  )
}
