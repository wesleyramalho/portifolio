'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useSectionContext } from '@/contexts/SectionContext'
import GlassCard from '@/components/ui/GlassCard'

const CAREER_START = new Date(2017, 2, 1) // March 2017

function getYearsOfExperience() {
  return Math.floor((Date.now() - CAREER_START.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)
  const yearsOfExperience = getYearsOfExperience()

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
      className="h-svh overflow-y-auto bg-background px-8 md:px-16 md:flex md:items-center"
      role="region"
      aria-label="About"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center pt-20 pb-28 md:pt-0 md:pb-0">
        {/* Avatar — clip-path reveal */}
        <div className="flex justify-center md:justify-start">
          <div ref={imgRef}>
            <Image
              src="/pixel-me.svg"
              alt="Pixel art portrait of Wesley Ramalho"
              width={400}
              height={400}
              className="grayscale opacity-90 w-48 h-48 md:w-[400px] md:h-[400px]"
            />
          </div>
        </div>

        {/* Text content */}
        <GlassCard className="p-6">
        <div className="about-content flex flex-col gap-5">
          <h2
            className="font-sans font-bold"
            style={{ fontSize: 'var(--text-heading)', color: '#F4F4F5' }}
          >
            Senior Software Engineer
          </h2>

          <p
            className="font-mono tracking-widest uppercase flex items-center gap-2"
            style={{ fontSize: 'var(--text-label)', color: '#71717A' }}
          >
            <span>📍</span> São Paulo, BR
          </p>

          <div className="flex flex-wrap gap-3" role="list" aria-label="Specialisations">
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase px-3 py-1 border"
              style={{ fontSize: 'var(--text-label)', color: '#A1A1AA', borderColor: '#27272A' }}
            >
              AI Specialist
            </span>
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase px-3 py-1 border"
              style={{ fontSize: 'var(--text-label)', color: '#A1A1AA', borderColor: '#27272A' }}
            >
              Frontend
            </span>
          </div>

          <p
            className="leading-relaxed font-sans"
            style={{ fontSize: 'var(--text-body)', color: '#9CA3AF' }}
          >
            I&apos;m a software engineer focused on front-end technologies and web
            applications (single-page applications with JS, HTML and CSS). I have
            over {yearsOfExperience}+ years of experience using JavaScript and ReactJS on real
            projects, and I&apos;m always learning more about data structures and
            algorithms, unit and integration tests. I also have some knowledge in
            UX/UI design processes and can help to plan and validate RESTful APIs
            and software requirements applied with agile methodologies.
          </p>
        </div>
        </GlassCard>
      </div>
    </section>
  )
}
