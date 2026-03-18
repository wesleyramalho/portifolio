import React from 'react'
import { render } from '@testing-library/react'
import FluidCanvas from '@/components/fluid/FluidCanvas'
import { FluidSimulationOGL } from '@/components/fluid/FluidSimulationOGL'

jest.mock('@/components/fluid/FluidSimulationOGL', () => ({
  FluidSimulationOGL: jest.fn().mockImplementation(() => ({
    resize: jest.fn(),
    update: jest.fn(),
    addSplat: jest.fn(),
    destroy: jest.fn(),
  })),
}))

const MockFluidSimulationOGL = FluidSimulationOGL as jest.MockedClass<typeof FluidSimulationOGL>

beforeEach(() => {
  MockFluidSimulationOGL.mockClear()
})

describe('FluidCanvas', () => {
  it('renders a canvas element', () => {
    const { container } = render(<FluidCanvas />)
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('does not crash when FluidSimulationOGL throws (WebGL unavailable)', () => {
    MockFluidSimulationOGL.mockImplementationOnce(() => {
      throw new Error('WebGL not supported')
    })
    expect(() => render(<FluidCanvas />)).not.toThrow()
  })

  it('skips simulation on mobile viewport', () => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
    render(<FluidCanvas />)
    expect(MockFluidSimulationOGL).not.toHaveBeenCalled()
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 })
  })
})
