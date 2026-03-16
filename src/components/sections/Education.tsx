'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.education-item', {
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
      id="education"
      ref={sectionRef}
      className="bg-background py-24 px-8 md:px-16 pb-32"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="font-sans font-bold text-lg md:text-xl text-white/40 uppercase tracking-widest mb-12">
          Education
        </h2>

        <div className="flex flex-col divide-y divide-white/10">
          {education.map((edu, i) => (
            <div key={i} className="education-item py-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
              <div className="md:w-48 shrink-0">
                <p className="font-mono text-xs text-white/40 tracking-widest uppercase">
                  {edu.period}
                </p>
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-semibold text-white text-lg mb-1">
                  {edu.institution}
                </h3>
                <p className="font-mono text-xs tracking-widest uppercase text-white/50">
                  {edu.degree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
