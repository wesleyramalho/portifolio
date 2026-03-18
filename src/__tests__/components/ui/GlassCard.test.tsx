import React from 'react'
import { render, screen } from '@testing-library/react'
import GlassCard from '@/components/ui/GlassCard'

describe('GlassCard', () => {
  it('renders children', () => {
    render(<GlassCard>Card content</GlassCard>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies role prop', () => {
    render(<GlassCard role="listitem">Item</GlassCard>)
    expect(screen.getByRole('listitem')).toBeInTheDocument()
  })

  it('merges extra className', () => {
    const { container } = render(<GlassCard className="p-6">Item</GlassCard>)
    expect(container.firstChild).toHaveClass('p-6')
  })
})
