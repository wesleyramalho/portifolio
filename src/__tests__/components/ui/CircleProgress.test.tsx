import React from 'react'
import { render, screen } from '@testing-library/react'
import CircleProgress from '@/components/ui/CircleProgress'

const CIRCLE_RADIUS = 28
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

describe('CircleProgress', () => {
  it('renders a progressbar', () => {
    render(<CircleProgress current={0} total={4} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow to current + 1', () => {
    render(<CircleProgress current={2} total={4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3')
  })

  it('sets aria-valuemax to total', () => {
    render(<CircleProgress current={0} total={4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4')
  })

  it('shows full offset (no progress) at section 0', () => {
    const { container } = render(<CircleProgress current={0} total={4} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    const offset = parseFloat(progressCircle.getAttribute('stroke-dashoffset') ?? '0')
    expect(offset).toBeCloseTo(CIRCLE_CIRCUMFERENCE, 0)
  })

  it('shows zero offset (full progress) at last section', () => {
    const { container } = render(<CircleProgress current={3} total={4} />)
    const progressCircle = container.querySelectorAll('circle')[1]
    const offset = parseFloat(progressCircle.getAttribute('stroke-dashoffset') ?? '1')
    expect(offset).toBeCloseTo(0, 0)
  })

  it('displays current section number', () => {
    const { container } = render(<CircleProgress current={1} total={4} />)
    expect(container.querySelector('text')).toHaveTextContent('02')
  })
})
