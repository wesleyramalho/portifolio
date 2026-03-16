'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useSectionContext } from '@/contexts/SectionContext'

const experiences = [
  {
    company: 'Anthropic',
    role: 'Senior Software Engineer',
    period: '2023 – Present',
    description: 'Working on AI-powered developer tools and web interfaces.',
  },
  {
    company: 'Previous Company',
    role: 'Frontend Engineer',
    period: '2020 – 2023',
    description: 'Built scalable single-page applications with React and TypeScript.',
  },
  {
    company: 'Earlier Role',
    role: 'JavaScript Developer',
    period: '2017 – 2020',
    description: 'Developed interactive web experiences and REST API integrations.',
  },
]

export default function Experiences() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    gsap.from('.experience-item', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.15,
      delay: 0.2,
    })
  }, [isActive])

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="h-svh flex items-center bg-background px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Experiences"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full py-16">
        <h2
          className="font-sans font-bold text-white/40 uppercase tracking-widest mb-12"
          style={{ fontSize: 'var(--text-label)' }}
        >
          Experiences
        </h2>

        <div className="flex flex-col divide-y divide-white/10" role="list">
          {experiences.map((exp, i) => (
            <article
              key={i}
              className="experience-item py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12"
              role="listitem"
            >
              <div className="md:w-48 shrink-0">
                <p
                  className="font-mono text-white/40 tracking-widest uppercase"
                  style={{ fontSize: 'var(--text-label)' }}
                >
                  {exp.period}
                </p>
              </div>
              <div className="flex-1">
                <h3
                  className="font-sans font-semibold text-white mb-1"
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  {exp.company}
                </h3>
                <p
                  className="font-mono tracking-widest uppercase text-white/50 mb-3"
                  style={{ fontSize: 'var(--text-label)' }}
                >
                  {exp.role}
                </p>
                <p
                  className="text-white/50 leading-relaxed"
                  style={{ fontSize: 'var(--text-body)' }}
                >
                  {exp.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
