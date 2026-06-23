import React from 'react'
import { screen } from '@testing-library/react'
import NotFound from '@/app/not-found'
import { renderWithProviders } from '../test-utils'

describe('NotFound page', () => {
  beforeEach(() => {
    renderWithProviders(<NotFound />)
  })

  it('renders the 404 heading', () => {
    expect(screen.getByRole('heading', { level: 1, name: '404' })).toBeInTheDocument()
  })

  it('renders the subheading copy', () => {
    expect(screen.getByText('// page not found')).toBeInTheDocument()
  })

  it('renders the body copy', () => {
    expect(
      screen.getByText("This route isn't in the bundle. Let's get you back to one that is."),
    ).toBeInTheDocument()
  })

  it('renders a CTA link back to /', () => {
    const link = screen.getByRole('link', { name: 'back to home' })
    expect(link).toHaveAttribute('href', '/')
  })
})
