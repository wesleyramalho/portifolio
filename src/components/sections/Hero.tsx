"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import VideoBackground from "@/components/ui/VideoBackground";
import { useSectionContext } from "@/contexts/SectionContext";

const NAME = "wesley ramalho";

const REPEL_RADIUS = 140;
const REPEL_STRENGTH = 38;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const { isActive } = useSectionContext();
  const hasAnimated = useRef(false);
  const t = useTranslations('hero');

  // Entrance animation (runs once when section becomes active)
  useEffect(() => {
    if (!isActive || hasAnimated.current) return;
    hasAnimated.current = true;

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

  // Desktop mouse-repel interaction
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isHoverDevice = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isHoverDevice) return;

    const onMove = (e: MouseEvent) => {
      charRefs.current.forEach((charElement) => {
        const rect = charElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < REPEL_RADIUS) {
          const force = Math.pow(1 - distance / REPEL_RADIUS, 1.5);
          const angle = Math.atan2(deltaY, deltaX);
          gsap.to(charElement, {
            x: -Math.cos(angle) * force * REPEL_STRENGTH,
            y: -Math.sin(angle) * force * REPEL_STRENGTH,
            duration: 0.35,
            ease: "power3.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(charElement, { x: 0, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      });
    };

    const onLeave = () => {
      charRefs.current.forEach((charElement) => {
        gsap.to(charElement, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-svh flex flex-col overflow-hidden"
      role="region"
      aria-label="Hero"
      aria-roledescription="slide"
    >
      <VideoBackground />

      <div className="absolute inset-0 bg-black/55 z-10" aria-hidden="true" />

      <div className="relative z-20 flex flex-col justify-end flex-1 px-8 pb-16 md:px-16">
        <h1
          className="font-sans font-bold text-white lowercase leading-none tracking-tight"
          style={{ fontSize: "var(--text-hero)", perspective: "600px" }}
          aria-label={NAME}
        >
          {NAME.split(" ").map((word, wordIndex, wordArray) => (
            <React.Fragment key={wordIndex}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className="hero-char inline-block"
                    ref={(spanElement) => { if (spanElement) charRefs.current.push(spanElement); }}
                    aria-hidden="true"
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wordIndex < wordArray.length - 1 && (
                <>
                  <br className="md:hidden" aria-hidden="true" />
                  <span
                    className="hero-char hidden md:inline-block"
                    ref={(spanElement) => { if (spanElement) charRefs.current.push(spanElement); }}
                    aria-hidden="true"
                  >
                    &nbsp;
                  </span>
                </>
              )}
            </React.Fragment>
          ))}
        </h1>
        <p
          className="hero-title font-mono text-white/80 tracking-widest uppercase mt-4 md:ml-3 lg:ml-3"
          style={{ fontSize: "var(--text-label)" }}
        >
          {t('jobTitle')}
        </p>
      </div>
    </section>
  );
}
