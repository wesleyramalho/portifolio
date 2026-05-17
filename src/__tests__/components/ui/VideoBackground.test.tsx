import React, { act } from 'react'
import { render } from '@testing-library/react'
import VideoBackground from '@/components/ui/VideoBackground'

describe('VideoBackground', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  function renderAndAdvance() {
    const result = render(<VideoBackground />)
    // Component defers mount via setTimeout/requestIdleCallback to avoid blocking FCP
    act(() => {
      jest.advanceTimersByTime(500)
    })
    return result
  }

  it('renders a placeholder before the video mounts', () => {
    const { container } = render(<VideoBackground />)
    expect(container.querySelector('video')).not.toBeInTheDocument()
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('renders a video element after the deferred mount', () => {
    const { container } = renderAndAdvance()
    expect(container.querySelector('video')).toBeInTheDocument()
  })

  it('video has autoPlay, muted, loop, and preload="none"', () => {
    const { container } = renderAndAdvance()
    const video = container.querySelector('video')!
    expect(video.autoplay).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.loop).toBe(true)
    expect(video.preload).toBe('none')
  })

  it('has two source elements (webm + mp4)', () => {
    const { container } = renderAndAdvance()
    const sources = container.querySelectorAll('source')
    expect(sources).toHaveLength(2)
    expect(sources[0].type).toBe('video/webm')
    expect(sources[1].type).toBe('video/mp4')
  })
})
