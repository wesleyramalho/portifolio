import React from 'react'
import { render, screen } from '@testing-library/react'
import IntlProvider from '@/components/IntlProvider'
import { LocaleProvider } from '@/contexts/LocaleContext'

describe('IntlProvider', () => {
  it('renders children', () => {
    render(
      <LocaleProvider>
        <IntlProvider>
          <span>child content</span>
        </IntlProvider>
      </LocaleProvider>,
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })
})
