import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SectionsContainer from '@/components/SectionsContainer'
import { LocaleProvider } from '@/contexts/LocaleContext'

// Stub child sections so we don't need all providers
function Section({ label }: { label: string }) {
  return <section aria-label={label}>{label}</section>
}

function renderContainer() {
  return render(
    <LocaleProvider>
      <SectionsContainer>
        <Section label="Hero" />
        <Section label="About" />
        <Section label="Experiences" />
        <Section label="Education" />
      </SectionsContainer>
    </LocaleProvider>,
  )
}

describe('SectionsContainer', () => {
  it('renders all children', () => {
    renderContainer()
    expect(screen.getByText('Hero')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Experiences')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('renders the Nav component', () => {
    renderContainer()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })

  it('renders the PersistentHeader with the name', () => {
    renderContainer()
    expect(screen.getByText('wesley ramalho')).toBeInTheDocument()
  })

  it('renders the CircleProgress progressbar', () => {
    renderContainer()
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('ArrowDown key navigates to the next section', () => {
    renderContainer()
    fireEvent.keyDown(window, { key: 'ArrowDown' })
    // After nav, current should be 1 — progressbar aria-valuenow becomes 2
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2')
  })
})
