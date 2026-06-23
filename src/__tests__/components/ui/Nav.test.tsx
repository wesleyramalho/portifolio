import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type NavType from '@/components/ui/Nav'

const originalEnv = process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED

let Nav: typeof NavType

function renderNav(current = 0) {
  const gotoSection = jest.fn()
  render(<Nav current={current} gotoSection={gotoSection} />)
  return { gotoSection }
}

describe('Nav (experiences disabled — default flag)', () => {
  beforeAll(() => {
    delete process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED
    jest.isolateModules(() => {
      Nav = require('@/components/ui/Nav').default
    })
  })

  afterAll(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED
    } else {
      process.env.NEXT_PUBLIC_EXPERIENCES_ENABLED = originalEnv
    }
  })

  it('renders 4 navigation buttons', () => {
    renderNav()
    expect(screen.getAllByRole('button')).toHaveLength(4)
  })

  it('renders translated nav labels without experiences', () => {
    renderNav()
    expect(screen.getByText('about me')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
    expect(screen.queryByText('experiences')).not.toBeInTheDocument()
    expect(screen.getByText('education')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
  })

  it('active section button has aria-current="page"', () => {
    renderNav(2)
    const buttons = screen.getAllByRole('button')
    const activeButton = buttons.find((b) => b.getAttribute('aria-current') === 'page')
    expect(activeButton).toBeInTheDocument()
    expect(activeButton).toHaveTextContent('projects')
  })

  it('clicking a nav button calls gotoSection with the correct index', async () => {
    const user = userEvent.setup()
    const { gotoSection } = renderNav()
    await user.click(screen.getByText('education'))
    expect(gotoSection).toHaveBeenCalledWith(3)
  })
})
