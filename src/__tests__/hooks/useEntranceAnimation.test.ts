import { renderHook } from '@testing-library/react'
import gsap from 'gsap'
import { useEntranceAnimation } from '@/hooks/useEntranceAnimation'

const mockGsap = gsap as jest.Mocked<typeof gsap>

beforeEach(() => {
  jest.clearAllMocks()
})

describe('useEntranceAnimation', () => {
  it('does not call gsap.from when isActive is false', () => {
    renderHook(() => useEntranceAnimation('.item', false))
    expect(mockGsap.from).not.toHaveBeenCalled()
  })

  it('calls gsap.from once when isActive is true', () => {
    renderHook(() => useEntranceAnimation('.item', true))
    expect(mockGsap.from).toHaveBeenCalledTimes(1)
    expect(mockGsap.from).toHaveBeenCalledWith('.item', expect.objectContaining({ opacity: 0 }))
  })

  it('does not re-animate when isActive toggles off then on again', () => {
    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) => useEntranceAnimation('.item', isActive),
      { initialProps: { isActive: true } },
    )
    expect(mockGsap.from).toHaveBeenCalledTimes(1)

    rerender({ isActive: false })
    rerender({ isActive: true })
    // hasAnimated guard prevents a second call
    expect(mockGsap.from).toHaveBeenCalledTimes(1)
  })
})
