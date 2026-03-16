'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Nav from '@/components/ui/Nav'
import VideoBackground from '@/components/ui/VideoBackground'
import Image from 'next/image'

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Video background */}
      <VideoBackground />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/55 z-10" />

      {/* Nav */}
      <div className="hero-nav z-20">
        <Nav />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end flex-1 px-8 pb-16 md:px-16">
        <h1 className="hero-name font-sans font-bold text-white lowercase leading-none text-[clamp(3rem,10vw,9rem)] tracking-tight">
          wesley ramalho
        </h1>
        <p className="hero-title font-mono text-white/80 text-sm md:text-base tracking-widest uppercase mt-4">
          Senior Software Engineer
        </p>
      </div>

      {/* Barcode bottom right */}
      <div className="hero-barcode absolute bottom-8 right-8 z-20 opacity-70">
        <Image
          src="/bar-code.svg"
          alt="barcode"
          width={120}
          height={60}
          style={{ filter: 'invert(1)' }}
        />
      </div>
    </section>
  )
}
