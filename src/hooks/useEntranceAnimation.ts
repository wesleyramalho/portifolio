'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function useEntranceAnimation(selector: string, isActive: boolean) {
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    gsap.from(selector, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.2,
    })
  }, [isActive, selector])
}
