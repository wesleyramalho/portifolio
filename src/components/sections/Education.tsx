'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useSectionContext } from '@/contexts/SectionContext'

const education = [
  {
    institution: 'Universidade Estácio de Sá',
    degree: 'Systems Analysis and Development',
    period: '2016 – 2019',
  },
  {
    institution: 'Online Courses',
    degree: 'Advanced JavaScript & React Ecosystem',
    period: '2018 – Present',
  },
]

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const { isActive } = useSectionContext()
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isActive || hasAnimated.current) return
    hasAnimated.current = true

    gsap.from('.education-item', {
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
      id="education"
      ref={sectionRef}
      className="h-svh flex items-center bg-background px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Education"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full py-16">
        <h2
          className="font-sans font-bold uppercase tracking-widest mb-12"
          style={{ fontSize: 'var(--text-label)', color: '#A1A1AA' }}
        >
          Education
        </h2>

        <div className="flex flex-col divide-y" style={{ borderColor: '#27272A' }} role="list">
          {education.map((edu, i) => (
            <article
              key={i}
              className="education-item py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12"
              role="listitem"
            >
              <div className="md:w-48 shrink-0">
                <p
                  className="font-mono tracking-widest uppercase"
                  style={{ fontSize: 'var(--text-label)', color: '#71717A' }}
                >
                  {edu.period}
                </p>
              </div>
              <div className="flex-1">
                <h3
                  className="font-sans font-semibold mb-1"
                  style={{ fontSize: 'var(--text-body)', color: '#F4F4F5' }}
                >
                  {edu.institution}
                </h3>
                <p
                  className="font-mono tracking-widest uppercase"
                  style={{ fontSize: 'var(--text-label)', color: '#A1A1AA' }}
                >
                  {edu.degree}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
