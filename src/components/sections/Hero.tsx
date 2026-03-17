"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import VideoBackground from "@/components/ui/VideoBackground";
import { useSectionContext } from "@/contexts/SectionContext";

const NAME = "wesley ramalho";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

    // Letter-by-letter name reveal
    gsap.from(".hero-char", {
      opacity: 0,
      y: 40,
      rotateX: -90,
      duration: 0.45,
      ease: "power3.out",
      stagger: 0.04,
      delay: 0.1,
      transformOrigin: "0% 50% -40px",
    });

    // Typewriter clip-path reveal for title
    gsap.fromTo(
      ".hero-title",
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.9,
        ease: "power2.inOut",
        delay: 0.75,
      },
    );
  }, [isActive]);

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

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end flex-1 px-8 pb-16 md:px-16">
        <h1
          className="font-sans font-bold text-white lowercase leading-none tracking-tight"
          style={{ fontSize: "var(--text-hero)", perspective: "600px" }}
          aria-label={NAME}
        >
          {NAME.split("").map((char, i) => (
            <span key={i} className="hero-char inline-block" aria-hidden="true">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p
          className="hero-title font-mono text-white/80 tracking-widest uppercase mt-4"
          style={{ fontSize: "var(--text-label)" }}
        >
          Senior Software Engineer
        </p>
      </div>
    </section>
  );
}
