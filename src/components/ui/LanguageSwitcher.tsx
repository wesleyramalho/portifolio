'use client'

import { useLocale } from '@/contexts/LocaleContext'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()

  return (
    <div className="flex items-center gap-1" aria-label="Language selector">
      <button
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
        className={[
          'font-mono tracking-widest uppercase cursor-pointer bg-transparent border-0 p-0 transition-colors',
          locale === 'en' ? 'text-white' : 'text-white/40 hover:text-white/70',
        ].join(' ')}
        style={{ fontSize: 'var(--text-label)' }}
      >
        EN
      </button>
      <span className="text-white/20 font-mono" style={{ fontSize: 'var(--text-label)' }}>|</span>
      <button
        onClick={() => setLocale('pt')}
        aria-pressed={locale === 'pt'}
        className={[
          'font-mono tracking-widest uppercase cursor-pointer bg-transparent border-0 p-0 transition-colors',
          locale === 'pt' ? 'text-white' : 'text-white/40 hover:text-white/70',
        ].join(' ')}
        style={{ fontSize: 'var(--text-label)' }}
      >
        PT
      </button>
    </div>
  )
}
