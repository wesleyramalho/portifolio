'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const NAV_ITEMS = [
  { label: 'about', index: 1 },
  { label: 'experiences', index: 2 },
  { label: 'education', index: 3 },
]

const R = 22
const C = 2 * Math.PI * R

interface Props {
  current: number
  total: number
  gotoSection: (i: number) => void
}

export default function PersistentHeader({ current, total, gotoSection }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const animating = useRef(false)

  const progress = total > 1 ? current / (total - 1) : 0
  const offset = C * (1 - progress)

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

    const tl = gsap.timeline({ onComplete: () => { animating.current = false } })

    // Expand container height first
    tl.to(menuRef.current, { height: 'auto', duration: 0.3, ease: 'power2.out' })

    tl.to(rows ?? [], {
      scaleX: 1, opacity: 1, duration: 0.35, stagger: 0.1, ease: 'power3.out',
    }, '-=0.1')
    tl.to(contents ?? [], {
      y: 0, opacity: 1, duration: 0.25, stagger: 0.1, ease: 'power2.out',
    }, '-=0.3')

    // Hamburger → ×
    tl.to('.circle-bar-top', { rotation: 45, y: 4, duration: 0.25, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
    tl.to('.circle-bar-bot', { rotation: -45, y: -4, duration: 0.25, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
  }

  const closeMenu = () => {
    if (animating.current || !isOpen) return
    animating.current = true

    const rows = menuRef.current?.querySelectorAll('.mobile-nav-row')

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false)
        animating.current = false
      },
    })

    tl.to(rows ?? [], {
      scaleX: 0, opacity: 0, transformOrigin: 'right center',
      duration: 0.25, stagger: { amount: 0.2, from: 'end' }, ease: 'power2.in',
    })

    // Collapse container height after rows disappear
    tl.to(menuRef.current, { height: 0, duration: 0.2, ease: 'power2.in' })

    // × → hamburger
    tl.to('.circle-bar-top', { rotation: 0, y: 0, duration: 0.2, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
    tl.to('.circle-bar-bot', { rotation: 0, y: 0, duration: 0.2, transformOrigin: '50% 50%', ease: 'power2.inOut' }, 0)
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
        className="flex items-center justify-between px-4 pb-2 md:px-3 md:py-2"
        style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top))' }}
      >
        {/* Text — pointer-events-none on desktop */}
        <div className="pointer-events-none">
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

        {/* Circle menu button — mobile only */}
        <button
          className="md:hidden shrink-0 ml-4 cursor-pointer"
          onClick={isOpen ? closeMenu : openMenu}
          aria-label={isOpen ? 'Close menu' : 'Open navigation menu'}
          aria-expanded={isOpen}
        >
          <svg width={52} height={52} viewBox="0 0 44 44" aria-hidden="true">
            {/* Track ring */}
            <circle
              cx={22} cy={22} r={R}
              stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} fill="none"
            />
            {/* Progress arc */}
            <circle
              cx={22} cy={22} r={R}
              stroke="rgba(255,255,255,0.7)" strokeWidth={1.5} fill="none"
              strokeDasharray={C}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)' }}
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

      {/* Nav menu rows — mobile only, always in DOM for GSAP */}
      <div ref={menuRef} className="md:hidden" aria-hidden={!isOpen}>
        {NAV_ITEMS.map(({ label, index }) => (
          <button
            key={label}
            className="mobile-nav-row w-full flex items-center justify-between px-4 py-3 border-t cursor-pointer bg-transparent"
            style={{ borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}
            onClick={() => handleNavClick(index)}
            tabIndex={isOpen ? 0 : -1}
          >
            <span
              className="mobile-nav-row-content font-sans font-bold text-white lowercase"
              style={{ fontSize: 'clamp(1.1rem, 4vw, 1.4rem)' }}
            >
              {label}
            </span>
            <span
              className="mobile-nav-row-content font-mono tracking-widest"
              style={{ fontSize: 'var(--text-label)', color: current === index ? '#fff' : '#71717A' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
