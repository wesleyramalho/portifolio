'use client'

import { useEffect, useState } from 'react'

export default function VideoBackground() {
  const [mount, setMount] = useState(false)

  // Defer video mount until after hydration so it doesn't block FCP/LCP
  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMount(true), { timeout: 1500 })
      : window.setTimeout(() => setMount(true), 300)
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(id as number)
      else window.clearTimeout(id as number)
    }
  }, [])

  if (!mount) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 w-full h-full bg-background"
      />
    )
  }

  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      title="Decorative background video"
      className="absolute inset-0 w-full h-full object-cover"
    >
      <source src="/video.webm" type="video/webm" />
      <source src="/video.mp4" type="video/mp4" />
    </video>
  )
}
