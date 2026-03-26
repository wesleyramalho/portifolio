import React from 'react'
import { screen } from '@testing-library/react'
import Projects from '@/components/sections/Projects'
import { PROJECTS_STATIC } from '@/components/sections/projects.data'
import { renderWithProviders } from '../../test-utils'

describe('Projects', () => {
  it('renders the section heading', () => {
    renderWithProviders(<Projects />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Projects')
  })

  it('renders all project cards', () => {
    renderWithProviders(<Projects />)
    expect(screen.getAllByRole('listitem')).toHaveLength(PROJECTS_STATIC.length)
  })

  it('renders project titles', () => {
    renderWithProviders(<Projects />)
    expect(screen.getByText('MYPDFCV')).toBeInTheDocument()
  })

  it('renders technology tags', () => {
    renderWithProviders(<Projects />)
    expect(screen.getAllByText('Next.js').length).toBeGreaterThan(0)
    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tailwind CSS').length).toBeGreaterThan(0)
  })

  it('renders external links', () => {
    renderWithProviders(<Projects />)
    expect(screen.getByText('mypdfcv.com')).toBeInTheDocument()
  })
})
