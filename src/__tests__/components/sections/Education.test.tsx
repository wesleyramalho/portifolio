import React from 'react'
import { screen } from '@testing-library/react'
import Education from '@/components/sections/Education'
import { renderWithProviders } from '../../test-utils'

const INSTITUTIONS = [
  'PUC Minas',
  'IFSP – Instituto Federal de Educação, Ciência e Tecnologia de São Paulo',
  'Escola SENAI de Informática',
  'ETEC – Escola Técnica Estadual de São Paulo',
]

const DEGREES = [
  'Postgraduate Degree – Artificial Intelligence and Machine Learning',
  'System Analysis and Development',
  'Multi-platform Development (Web and Mobile)',
  'Technical Degree in Administration, Marketing',
  'High School',
]

describe('Education', () => {
  it('renders the section heading', () => {
    renderWithProviders(<Education />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Education')
  })

  it('renders all institution names', () => {
    renderWithProviders(<Education />)
    INSTITUTIONS.forEach((institution) => {
      expect(screen.getAllByText(institution).length).toBeGreaterThan(0)
    })
  })

  it('renders all translated degrees', () => {
    renderWithProviders(<Education />)
    DEGREES.forEach((degree) => {
      expect(screen.getByText(degree)).toBeInTheDocument()
    })
  })

  it('renders 5 education cards', () => {
    renderWithProviders(<Education />)
    expect(screen.getAllByRole('listitem')).toHaveLength(5)
  })
})
