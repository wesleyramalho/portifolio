'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useTranslations } from 'next-intl'
import { NAV_ITEMS } from '@/lib/navigation'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

const CIRCLE_RADIUS = 22
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS

interface Props {
  current: number
  total: number
  gotoSection: (index: number) => void
}

export default function PersistentHeader({ current, total, gotoSection }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const animating = useRef(false)
  const tNav = useTranslations('nav')
  const tHeader = useTranslations('header')

  const progress = total > 1 ? current / (total - 1) : 0
  const offset = CIRCLE_CIRCUMFERENCE * (1 - progress)

  // Collapse menu container to zero height on mount so it takes no space
  useEffect(() => {
    if (menuRef.current) {
      gsap.set(menuRef.current, { height: 0, overflow: 'hidden' })
    }
  }, [])

  // Fade wrapper in/out based on section
  useEffect(() => {
    if (!wrapperRef.current) return
    if (current === 0) {
      gsap.to(wrapperRef.current, { opacity: 0, y: -8, duration: 0.3, ease: 'power2.in' })
    } else {
      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      )
    }
  }, [current])

  const openMenu = () => {
    if (animating.current || isOpen) return
    animating.current = true
    setIsOpen(true)

    const rows = menuRef.current?.querySelectorAll('.mobile-nav-row')
    const contents = menuRef.current?.querySelectorAll('.mobile-nav-row-content')

    gsap.set(rows ?? [], { scaleX: 0, opacity: 0, transformOrigin: 'right center' })
    gsap.set(contents ?? [], { y: 12, opacity: 0 })

    const timeline = gsap.timeline({ onComplete: () => { animating.current = false } })

    // Expand container height first
    timeline.to(menuRef.current, { height: 'auto', duration: 0.3, ease: 'power2.out' })

    timeline.to(rows ?? [], {
      scaleX: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power3.out',
    }, '-=0.1')
    timeline.to(contents ?? [], {
      y: 0, opacity: 1, duration: 0.25, stagger: 0.1, ease: 'power2.out',
    }, '-=0.3')

    // Hamburger → ×
    timeline.to('.circle-bar-top', { rotation: 45, y: 4, duration: 0.25, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
    timeline.to('.circle-bar-bot', { rotation: -45, y: -4, duration: 0.25, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
  }

  const closeMenu = () => {
    if (animating.current || !isOpen) return
    animating.current = true

    const rows = menuRef.current?.querySelectorAll('.mobile-nav-row')

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsOpen(false)
        animating.current = false
      },
    })

    timeline.to(rows ?? [], {
      scaleX: 0, opacity: 0, transformOrigin: 'right center',
      duration: 0.25, stagger: { amount: 0.2, from: 'end' }, ease: 'power2.in',
    })

    // Collapse container height after rows disappear
    timeline.to(menuRef.current, { height: 0, duration: 0.2, ease: 'power2.in' })

    // × → hamburger
    timeline.to('.circle-bar-top', { rotation: 0, y: 0, duration: 0.2, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
    timeline.to('.circle-bar-bot', { rotation: 0, y: 0, duration: 0.2, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
  }

  const handleNavClick = (index: number) => {
    gotoSection(index)
    closeMenu()
  }

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 left-0 right-0 z-[60] bg-black/30 backdrop-blur-md md:right-auto md:top-6 md:left-8 md:bg-black/20 md:backdrop-blur-md md:rounded-lg"
      style={{ opacity: 0 }}
    >
      {/* Header row */}
      <div
        className="flex items-center justify-between px-4 pb-2 md:px-3 md:py-2 md:gap-12 pt-safe"
      >
        {/* Text — pointer-events-none */}
        <div className="pointer-events-none">
          <p
            className="font-sans font-bold text-white lowercase leading-none text-[clamp(0.85rem,1.2vw,1.1rem)]"
          >
            wesley ramalho
          </p>
          <p
            className="font-mono text-zinc-500 tracking-widest uppercase mt-0.5 text-label"
          >
            {tHeader('jobTitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          {/* Circle menu button — mobile only */}
          <button
            className="md:hidden shrink-0 cursor-pointer"
            onClick={isOpen ? closeMenu : openMenu}
            aria-label={isOpen ? tHeader('closeMenu') : tHeader('openMenu')}
            aria-expanded={isOpen}
          >
            <svg width={52} height={52} viewBox="-2 -2 48 48" aria-hidden="true">
              {/* Track ring */}
              <circle
                cx={22} cy={22} r={CIRCLE_RADIUS}
                stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} fill="none"
              />
              {/* Progress arc */}
              <circle
                cx={22} cy={22} r={CIRCLE_RADIUS}
                stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} fill="none"
                strokeDasharray={CIRCLE_CIRCUMFERENCE}
                strokeDashoffset={offset}
                strokeLinecap="round"
                transform="rotate(-90 22 22)"
                className="stroke-progress"
              />
              {/* Hamburger / × icon */}
              <line
                className="circle-bar-top"
                x1="15" y1="18" x2="29" y2="18"
                stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round"
              />
              <line
                className="circle-bar-bot"
                x1="15" y1="26" x2="29" y2="26"
                stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav menu rows — mobile only, always in DOM for GSAP */}
      <div ref={menuRef} className="md:hidden" aria-hidden={!isOpen}>
        {NAV_ITEMS.map(({ key, index }) => (
          <button
            key={key}
            className="mobile-nav-row w-full flex items-center justify-between px-4 py-3 border-t cursor-pointer bg-transparent border-white/[0.08] overflow-hidden"
            onClick={() => handleNavClick(index)}
            tabIndex={isOpen ? 0 : -1}
          >
            <span
              className="mobile-nav-row-content font-sans font-bold text-white lowercase"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}
            >
              {tNav(key)}
            </span>
            <span
              className={`mobile-nav-row-content font-mono tracking-widest text-label ${current === index ? 'text-white' : 'text-zinc-500'}`}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
