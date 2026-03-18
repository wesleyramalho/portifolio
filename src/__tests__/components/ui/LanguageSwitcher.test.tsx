import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { LocaleProvider } from '@/contexts/LocaleContext'

function renderSwitcher() {
  return render(
    <LocaleProvider>
      <LanguageSwitcher />
    </LocaleProvider>,
  )
}

beforeEach(() => localStorage.clear())

describe('LanguageSwitcher', () => {
  it('renders EN and PT buttons', () => {
    renderSwitcher()
    expect(screen.getByRole('button', { name: /en/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pt/i })).toBeInTheDocument()
  })

  it('EN button is active by default', () => {
    renderSwitcher()
    expect(screen.getByRole('button', { name: /en/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /pt/i })).toHaveAttribute('aria-pressed', 'false')
  })

  it('clicking PT activates the PT button', async () => {
    const user = userEvent.setup()
    renderSwitcher()
    await user.click(screen.getByRole('button', { name: /pt/i }))
    expect(screen.getByRole('button', { name: /pt/i })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: /en/i })).toHaveAttribute('aria-pressed', 'false')
  })
})
