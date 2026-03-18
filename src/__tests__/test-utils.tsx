import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { SectionContext, SectionContextValue } from '@/contexts/SectionContext'

interface ProvidersOptions {
  sectionContext?: Partial<SectionContextValue>
}

const defaultSectionContext: SectionContextValue = {
  isActive: true,
  index: 0,
  gotoSection: jest.fn(),
}

function Providers({
  children,
  sectionContext = {},
}: {
  children: React.ReactNode
  sectionContext?: Partial<SectionContextValue>
}) {
  return (
    <LocaleProvider>
      <SectionContext.Provider value={{ ...defaultSectionContext, ...sectionContext }}>
        {children}
      </SectionContext.Provider>
    </LocaleProvider>
  )
}

export function renderWithProviders(
  ui: React.ReactElement,
  { sectionContext, ...options }: ProvidersOptions & RenderOptions = {},
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <Providers sectionContext={sectionContext}>{children}</Providers>
    ),
    ...options,
  })
}
