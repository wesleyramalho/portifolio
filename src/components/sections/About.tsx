'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-image', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })
      gsap.from('.about-content > *', {
        y: 40,
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
      ref={sectionRef}
      className="bg-background py-24 px-8 md:px-16"
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Avatar */}
        <div className="about-image flex justify-center md:justify-start">
          <Image
            src="/pixel-me.svg"
            alt="Wesley Ramalho"
            width={280}
            height={280}
            className="grayscale opacity-90"
          />
        </div>

        {/* Text content */}
        <div className="about-content flex flex-col gap-5">
          <h2 className="font-sans font-bold text-2xl md:text-3xl text-foreground">
            Senior Software Engineer
          </h2>

          <div className="flex flex-wrap gap-3">
            <span className="font-mono text-xs tracking-widest uppercase border border-white/20 px-3 py-1 text-white/60">
              AI Specialist
            </span>
            <span className="font-mono text-xs tracking-widest uppercase border border-white/20 px-3 py-1 text-white/60">
              Frontend
            </span>
          </div>

          <p className="text-white/60 leading-relaxed text-sm md:text-base font-sans">
            I&apos;m a software engineer focused on front-end technologies and web
            applications (single-page applications with JS, HTML and CSS). I have
            over 9+ years of experience using JavaScript and ReactJS on real
            projects, and I&apos;m always learning more about data structures and
            algorithms, unit and integration tests. I also have some knowledge in
            UX/UI design processes and can help to plan and validating RESTful
            APIs and software requirements applied with agile methodologies.
          </p>
        </div>
      </div>
    </section>
  )
}
