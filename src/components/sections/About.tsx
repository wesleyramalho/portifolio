'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Image from 'next/image'
import { useSectionContext } from '@/contexts/SectionContext'

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)

  // Set hidden initial state on mount (before first render)
  useEffect(() => {
    if (imgRef.current) {
      gsap.set(imgRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })
    }
  }, [])

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    // Draw-path reveal: wipe avatar from top downwards (no revert — keep final state)
    gsap.to(imgRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
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
      className="h-svh flex items-center bg-background px-8 md:px-16"
      role="region"
      aria-label="About"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Avatar — clip-path reveal */}
        <div className="flex justify-center md:justify-start">
          <div ref={imgRef}>
            <Image
              src="/pixel-me.svg"
              alt="Pixel art portrait of Wesley Ramalho"
              width={280}
              height={280}
              className="grayscale opacity-90"
            />
          </div>
        </div>

        {/* Text content */}
        <div className="about-content flex flex-col gap-5">
          <h2
            className="font-sans font-bold text-foreground"
            style={{ fontSize: 'var(--text-heading)' }}
          >
            Senior Software Engineer
          </h2>

          <div className="flex flex-wrap gap-3" role="list" aria-label="Specialisations">
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase border border-white/20 px-3 py-1 text-white/60"
              style={{ fontSize: 'var(--text-label)' }}
            >
              AI Specialist
            </span>
            <span
              role="listitem"
              className="font-mono tracking-widest uppercase border border-white/20 px-3 py-1 text-white/60"
              style={{ fontSize: 'var(--text-label)' }}
            >
              Frontend
            </span>
          </div>

          <p
            className="text-white/60 leading-relaxed font-sans"
            style={{ fontSize: 'var(--text-body)' }}
          >
            I&apos;m a software engineer focused on front-end technologies and web
            applications (single-page applications with JS, HTML and CSS). I have
            over 9+ years of experience using JavaScript and ReactJS on real
            projects, and I&apos;m always learning more about data structures and
            algorithms, unit and integration tests. I also have some knowledge in
            UX/UI design processes and can help to plan and validate RESTful APIs
            and software requirements applied with agile methodologies.
          </p>
        </div>
      </div>
    </section>
  )
}
