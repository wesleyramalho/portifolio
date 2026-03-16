'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.experience-item', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="bg-background py-24 px-8 md:px-16"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-sans font-bold text-lg md:text-xl text-white/40 uppercase tracking-widest mb-12">
          Experiences
        </h2>

        <div className="flex flex-col divide-y divide-white/10">
          {experiences.map((exp, i) => (
            <div key={i} className="experience-item py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
              <div className="md:w-48 shrink-0">
                <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
                  {exp.period}
                </p>
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-semibold text-white text-lg mb-1">
                  {exp.company}
                </h3>
                <p className="font-mono text-xs tracking-widest uppercase text-white/50 mb-3">
                  {exp.role}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
