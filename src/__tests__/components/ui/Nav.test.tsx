import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Nav from '@/components/ui/Nav'

function renderNav(current = 0) {
  const gotoSection = jest.fn()
  render(<Nav current={current} gotoSection={gotoSection} />)
  return { gotoSection }
}

describe('Nav', () => {
  it('renders 4 navigation buttons', () => {
    renderNav()
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('renders translated nav labels', () => {
    renderNav()
    expect(screen.getByText('about me')).toBeInTheDocument()
    expect(screen.getByText('experiences')).toBeInTheDocument()
    expect(screen.getByText('projects')).toBeInTheDocument()
    expect(screen.getByText('education')).toBeInTheDocument()
    expect(screen.getByText('contact')).toBeInTheDocument()
  })

  it('active section button has aria-current="page"', () => {
    renderNav(2)
    const buttons = screen.getAllByRole('button')
    // index 2 = 'experiences' (second item, index=2)
    const activeButton = buttons.find((b) => b.getAttribute('aria-current') === 'page')
    expect(activeButton).toBeInTheDocument()
    expect(activeButton).toHaveTextContent('experiences')
  })

  it('clicking a nav button calls gotoSection with the correct index', async () => {
    const user = userEvent.setup()
    const { gotoSection } = renderNav()
    await user.click(screen.getByText('education'))
    expect(gotoSection).toHaveBeenCalledWith(4)
  })
})
