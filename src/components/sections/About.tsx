'use client'

import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useSectionContext } from '@/contexts/SectionContext'
import { useFluid } from '@/contexts/FluidContext'
import GlassCard from '@/components/ui/GlassCard'
import { useRippleDistortion } from '@/hooks/useRippleDistortion'

const CAREER_START = new Date(2017, 2, 1) // March 2017

function getYearsOfExperience() {
  return Math.floor((Date.now() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const distortedImgRef = useRef<HTMLDivElement>(null)
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null)
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null)
  const darkOverlayRef = useRef<HTMLDivElement>(null)
  const fluid = useFluid()
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)
  const yearsOfExperience = getYearsOfExperience()
  const t = useTranslations('about')
  const filterId = useId()

  useRippleDistortion({
    container: imgRef,
    distortedImg: distortedImgRef,
    turbulence: turbulenceRef,
    displacement: displacementRef,
    darkOverlay: darkOverlayRef,
    fluid,
  })

  useEffect(() => {
    if (imgRef.current) {
      gsap.set(imgRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
    }
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    gsap.to(imgRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 2.4,
      ease: 'power2.inOut',
      delay: 0.3,
    })

    gsap.from('.about-content > *', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.4,
    })
  }, [isActive])

  return (
    <section
      ref={sectionRef}
      className="h-svh overflow-y-auto px-8 md:px-16 md:flex md:items-center"
      role="region"
      aria-label="About"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20 pb-28 md:pt-0 md:pb-0">
        {/* Avatar — clip-path reveal + localized ripple distortion */}
        <div className="flex justify-center md:justify-start">
          <div ref={imgRef} className="relative bg-background rounded-lg">
            {/* SVG filter definition */}
            <svg width="0" height="0" className="absolute" aria-hidden="true">
              <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
                <feColorMatrix type="saturate" values="0" in="SourceGraphic" result="gray" />
                <feTurbulence
                  ref={turbulenceRef}
                  type="turbulence"
                  baseFrequency="0.02 0.025"
                  numOctaves={2}
                  seed={1}
                  result="turbulence"
                />
                <feDisplacementMap
                  ref={displacementRef}
                  in="gray"
                  in2="turbulence"
                  scale={25}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </svg>

            {/* Original image — clean, no filter */}
            <Image
              src="/pixel-me.svg"
              alt="Pixel art portrait of Wesley Ramalho"
              width={400}
              height={400}
              className="grayscale opacity-90 w-48 h-48 md:w-[400px] md:h-[400px]"
            />

            {/* Distorted layer — same image with filter, clipped to circle around cursor */}
            <div
              ref={distortedImgRef}
              className="absolute inset-0 opacity-0 pointer-events-none"
              style={{ clipPath: 'circle(0px at 50% 50%)' }}
            >
              <Image
                src="/pixel-me.svg"
                alt=""
                width={400}
                height={400}
                aria-hidden="true"
                className="opacity-90 w-48 h-48 md:w-[400px] md:h-[400px]"
                style={{ filter: `url(#${filterId})` }}
              />
            </div>

            {/* Darkening overlay — follows cursor */}
            <div
              ref={darkOverlayRef}
              className="absolute inset-0 pointer-events-none opacity-0"
              style={{
                background: 'radial-gradient(circle 100px at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,0.6), transparent)',
              }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Text content */}
        <GlassCard className="p-6">
        <div className="about-content flex flex-col gap-5">
          <h2
            className="font-sans font-bold text-heading text-zinc-100"
          >
            {t('jobTitle')}
          </h2>

          <p
            className="font-mono tracking-widest uppercase flex items-center gap-2 text-label text-zinc-500"
          >
            <span>📍</span> {t('location')}
          </p>

          <div className="flex flex-wrap gap-3" role="list" aria-label="Specialisations">
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase px-3 py-1 border text-label text-zinc-400 border-zinc-800"
            >
              {t('aiSpecialist')}
            </span>
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase px-3 py-1 border text-label text-zinc-400 border-zinc-800"
            >
              {t('frontend')}
            </span>
          </div>

          <p
            className="leading-relaxed font-sans text-body text-gray-400"
          >
            {t('bio', { years: yearsOfExperience })}
          </p>
        </div>
        </GlassCard>
      </div>
    </section>
  )
}
