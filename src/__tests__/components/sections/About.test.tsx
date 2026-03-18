import React from 'react'
import { screen } from '@testing-library/react'
import About from '@/components/sections/About'
import { renderWithProviders } from '../../test-utils'

describe('About', () => {
  it('renders without crashing', () => {
    renderWithProviders(<About />)
  })

  it('renders the job title', () => {
    renderWithProviders(<About />)
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument()
  })

  it('renders the location', () => {
    renderWithProviders(<About />)
    expect(screen.getByText(/São Paulo, BR/)).toBeInTheDocument()
  })

  it('renders the AI Specialist tag', () => {
    renderWithProviders(<About />)
    expect(screen.getByText('AI Specialist')).toBeInTheDocument()
  })

  it('renders the Frontend tag', () => {
    renderWithProviders(<About />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
  })

  it('renders the bio text', () => {
    renderWithProviders(<About />)
    expect(screen.getByText(/I am a software engineer/i)).toBeInTheDocument()
  })
})
