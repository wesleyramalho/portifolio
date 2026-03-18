import React from 'react'
import { render } from '@testing-library/react'
import VideoBackground from '@/components/ui/VideoBackground'

describe('VideoBackground', () => {
  it('renders a video element', () => {
    const { container } = render(<VideoBackground />)
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
  })

  it('video has autoPlay, muted and loop', () => {
    const { container } = render(<VideoBackground />)
    const video = container.querySelector('video')!
    expect(video.autoplay).toBe(true)
    expect(video.muted).toBe(true)
    expect(video.loop).toBe(true)
  })

  it('has two source elements (webm + mp4)', () => {
    const { container } = render(<VideoBackground />)
    const sources = container.querySelectorAll('source')
    expect(sources).toHaveLength(2)
    expect(sources[0].type).toBe('video/webm')
    expect(sources[1].type).toBe('video/mp4')
  })
})
