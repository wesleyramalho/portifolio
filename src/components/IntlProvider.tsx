'use client'

import { NextIntlClientProvider } from 'next-intl'
import { useLocale } from '@/contexts/LocaleContext'
import enMessages from '../../messages/en.json'
import ptMessages from '../../messages/pt.json'

export default function IntlProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale()
  const messages = locale === 'pt' ? ptMessages : enMessages

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  )
}
