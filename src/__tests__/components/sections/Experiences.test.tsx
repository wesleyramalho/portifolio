import React from 'react'
import { screen } from '@testing-library/react'
import Experiences from '@/components/sections/Experiences'
import { renderWithProviders } from '../../test-utils'

const COMPANIES = [
  'Tecla (CredoAI)',
  'Truelogic Software (Zappos)',
  'Tecla (OnChain Studios)',
  'X-Team',
  'Popstand',
  'iCarros (Itaú)',
  'SENAI São Paulo',
]

const ROLES = [
  'Senior Software Engineer (Front-end focused)',
  'Senior Front-end Engineer (Front-end focused)',
  'Senior Front-end Engineer',
  'Senior Front-end Developer (Front-end focused)',
  'Front-end Developer',
  'Software Development Intern',
]

describe('Experiences', () => {
  it('renders the section heading', () => {
    renderWithProviders(<Experiences />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Experiences')
  })

  it('renders all company names', () => {
    renderWithProviders(<Experiences />)
    COMPANIES.forEach((company) => {
      expect(screen.getAllByText(company).length).toBeGreaterThan(0)
    })
  })

  it('renders translated roles', () => {
    renderWithProviders(<Experiences />)
    ROLES.forEach((role) => {
      expect(screen.getAllByText(role).length).toBeGreaterThan(0)
    })
  })

  it('renders 8 experience cards', () => {
    renderWithProviders(<Experiences />)
    expect(screen.getAllByRole('article')).toHaveLength(8)
  })
})
