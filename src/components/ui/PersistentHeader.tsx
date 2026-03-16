'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  current: number
}

export default function PersistentHeader({ current }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (current === 0) {
      gsap.to(ref.current, { opacity: 0, y: 8, duration: 0.3, ease: 'power2.in' })
    } else {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 8, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out' }
      )
    }
  }, [current])

  return (
    <div
      ref={ref}
      className="fixed top-6 left-8 z-[60] pointer-events-none"
      style={{ opacity: 0 }}
    >
      <p
        className="font-sans font-bold text-white lowercase leading-none"
        style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1.1rem)' }}
      >
        wesley ramalho
      </p>
      <p
        className="font-mono text-[#71717A] tracking-widest uppercase mt-0.5"
        style={{ fontSize: 'var(--text-label)' }}
      >
        Senior Software Engineer
      </p>
    </div>
  )
}
