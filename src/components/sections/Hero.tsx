'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Nav from '@/components/ui/Nav'
import VideoBackground from '@/components/ui/VideoBackground'
import Image from 'next/image'
import { useSectionContext } from '@/contexts/SectionContext'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    gsap.from('.hero-name', {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    })
    gsap.from('.hero-title', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.5,
    })
    gsap.from('.hero-nav', {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.8,
    })
    gsap.from('.hero-barcode', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1,
    })
  }, [isActive])

  return (
    <section
      ref={sectionRef}
      className="relative h-svh flex flex-col overflow-hidden"
      role="region"
      aria-label="Hero"
      aria-roledescription="slide"
    >
      <VideoBackground />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" aria-hidden="true" />

      {/* Nav */}
      <div className="hero-nav z-20">
        <Nav />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end flex-1 px-8 pb-16 md:px-16">
        <h1
          className="hero-name font-sans font-bold text-white lowercase leading-none tracking-tight"
          style={{ fontSize: 'var(--text-hero)' }}
        >
          wesley ramalho
        </h1>
        <p
          className="hero-title font-mono text-white/80 tracking-widest uppercase mt-4"
          style={{ fontSize: 'var(--text-label)' }}
        >
          Senior Software Engineer
        </p>
      </div>

      {/* Barcode */}
      <div className="hero-barcode absolute bottom-8 right-8 z-20 opacity-70">
        <Image
          src="/bar-code.svg"
          alt="Decorative barcode"
          width={120}
          height={60}
          style={{ filter: 'invert(1)' }}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
