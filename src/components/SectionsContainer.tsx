'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SectionContext } from '@/contexts/SectionContext'
import CircleProgress from '@/components/ui/CircleProgress'

const ROUTES = ['/', '/about', '/experiences', '/education']

interface SectionsContainerProps {
  children: React.ReactNode
}

export default function SectionsContainer({ children }: SectionsContainerProps) {
  const [current, setCurrent] = useState(0)
  const currentRef = useRef(0)
  const animating = useRef(false)
  const panelsRef = useRef<HTMLDivElement[]>([])

  // On direct URL load, jump to the matching section without animation
  useEffect(() => {
    const index = ROUTES.indexOf(window.location.pathname)
    if (index > 0) {
      currentRef.current = index
      setCurrent(index)
      // Panels may not be mounted yet — set styles once they are
      requestAnimationFrame(() => {
        panelsRef.current.forEach((p, i) => {
          if (!p) return
          p.style.opacity = i === index ? '1' : '0'
          p.style.zIndex = i === index ? '1' : '0'
        })
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gotoSection = useCallback((index: number) => {
    if (animating.current || index < 0 || index >= ROUTES.length) return
    const prev = currentRef.current
    if (index === prev) return

    animating.current = true
    const direction = index > prev ? 1 : -1
    const panels = panelsRef.current

    // Bring incoming panel above outgoing
    panels[index].style.zIndex = '2'
    panels[prev].style.zIndex = '1'

    gsap.set(panels[index], { opacity: 0, y: direction * 60 })

    const tl = gsap.timeline({
      onComplete: () => {
        panels[prev].style.zIndex = '0'
        panels[index].style.zIndex = '1'
        animating.current = false
      },
    })

    tl.to(panels[prev], { opacity: 0, y: direction * -40, duration: 0.5, ease: 'power2.inOut' }, 0)
    tl.to(panels[index], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.1)

    window.history.replaceState(null, '', ROUTES[index])
    currentRef.current = index
    setCurrent(index)
  }, [])

  // Expose for Nav buttons
  useEffect(() => {
    ;(window as Window & { gotoSection?: (i: number) => void }).gotoSection = gotoSection
  }, [gotoSection])

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.deltaY > 10) gotoSection(currentRef.current + 1)
      else if (e.deltaY < -10) gotoSection(currentRef.current - 1)
    }

    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY
      if (delta > 30) gotoSection(currentRef.current + 1)
      else if (delta < -30) gotoSection(currentRef.current - 1)
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') gotoSection(currentRef.current + 1)
      if (e.key === 'ArrowUp' || e.key === 'PageUp') gotoSection(currentRef.current - 1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
    }
  }, [gotoSection])

  const childArray = React.Children.toArray(children)

  return (
    <div className="relative w-full h-svh overflow-hidden">
      {childArray.map((child, i) => (
        <SectionContext.Provider
          key={i}
          value={{ isActive: i === current, index: i, gotoSection }}
        >
          <div
            ref={el => {
              if (el) panelsRef.current[i] = el
            }}
            className="absolute inset-0 h-svh"
            style={{ opacity: i === 0 ? 1 : 0, zIndex: i === 0 ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            {child}
          </div>
        </SectionContext.Provider>
      ))}
      <CircleProgress current={current} total={ROUTES.length} />
    </div>
  )
}
