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
          'font-mono tracking-widest uppercase cursor-pointer bg-transparent border-0 p-0 transition-colors text-label',
          locale === 'en' ? 'text-white' : 'text-white/40 hover:text-white/70',
        ].join(' ')}
      >
        EN
      </button>
      <span className="text-white/20 font-mono text-label">|</span>
      <button
        onClick={() => setLocale('pt')}
        aria-pressed={locale === 'pt'}
        className={[
          'font-mono tracking-widest uppercase cursor-pointer bg-transparent border-0 p-0 transition-colors text-label',
          locale === 'pt' ? 'text-white' : 'text-white/40 hover:text-white/70',
        ].join(' ')}
      >
        PT
      </button>
    </div>
  )
}
