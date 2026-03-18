import React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocaleProvider, useLocale } from '@/contexts/LocaleContext'

function TestComponent() {
  const { locale, setLocale } = useLocale()
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <button onClick={() => setLocale('pt')}>Switch to PT</button>
      <button onClick={() => setLocale('en')}>Switch to EN</button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('LocaleContext', () => {
  it('defaults to en', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    )
    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  it('reads a valid locale from localStorage on mount', async () => {
    localStorage.setItem('locale', 'pt')
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    )
    // useEffect runs after render — wait for state update
    await act(async () => {})
    expect(screen.getByTestId('locale')).toHaveTextContent('pt')
  })

  it('ignores an invalid localStorage value', async () => {
    localStorage.setItem('locale', 'fr')
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    )
    await act(async () => {})
    expect(screen.getByTestId('locale')).toHaveTextContent('en')
  })

  it('setLocale updates state', async () => {
    const user = userEvent.setup()
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    )
    await user.click(screen.getByText('Switch to PT'))
    expect(screen.getByTestId('locale')).toHaveTextContent('pt')
  })

  it('setLocale persists to localStorage', async () => {
    const user = userEvent.setup()
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>,
    )
    await user.click(screen.getByText('Switch to PT'))
    expect(localStorage.getItem('locale')).toBe('pt')
  })
})
