import React from 'react'
import { render, screen } from '@testing-library/react'
import PersistentHeader from '@/components/ui/PersistentHeader'
import { LocaleProvider } from '@/contexts/LocaleContext'

function renderHeader(current = 1) {
  return render(
    <LocaleProvider>
      <PersistentHeader current={current} total={4} gotoSection={jest.fn()} />
    </LocaleProvider>,
  )
}

describe('PersistentHeader', () => {
  it('renders the name', () => {
    renderHeader()
    expect(screen.getByText('wesley ramalho')).toBeInTheDocument()
  })

  it('renders the translated job title', () => {
    renderHeader()
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
  })

  it('renders the hamburger button', () => {
    renderHeader()
    // The button has an aria-label
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toBeInTheDocument()
  })

  it('renders EN and PT language switcher buttons', () => {
    renderHeader()
    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'PT' })).toBeInTheDocument()
  })
})
