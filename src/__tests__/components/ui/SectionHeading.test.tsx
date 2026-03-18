import React from 'react'
import { render, screen } from '@testing-library/react'
import SectionHeading from '@/components/ui/SectionHeading'

describe('SectionHeading', () => {
  it('renders children inside an h2', () => {
    render(<SectionHeading>Experiences</SectionHeading>)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('Experiences')
  })

  it('renders arbitrary children', () => {
    render(<SectionHeading>Education</SectionHeading>)
    expect(screen.getByText('Education')).toBeInTheDocument()
  })
})
