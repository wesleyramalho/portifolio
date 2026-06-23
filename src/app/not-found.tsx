"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

const REPEL_RADIUS = 140;
const REPEL_STRENGTH = 38;

export default function NotFound() {
  const sectionRef = useRef<HTMLElement>(null);
  const charRefs = useRef<HTMLSpanElement[]>([]);
  const t = useTranslations("notFound");

  useEffect(() => {
    gsap.fromTo(
      ".nf-char",
      { opacity: 0.01, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.45,
        ease: "power3.out",
        stagger: 0.06,
        delay: 0.1,
        transformOrigin: "0% 50% -40px",
        immediateRender: false,
      },
    );

    gsap.fromTo(
      ".nf-fade",
      { opacity: 0, y: 16 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.45,
      },
    );
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const isHoverDevice = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!isHoverDevice) return;

    const repelElement = (
      element: HTMLElement,
      mouseX: number,
      mouseY: number,
    ) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = mouseX - centerX;
      const deltaY = mouseY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < REPEL_RADIUS) {
        const force = Math.pow(1 - distance / REPEL_RADIUS, 1.5);
        const angle = Math.atan2(deltaY, deltaX);
        gsap.to(element, {
          x: -Math.cos(angle) * force * REPEL_STRENGTH,
          y: -Math.sin(angle) * force * REPEL_STRENGTH,
          duration: 0.35,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      charRefs.current.forEach((el) => repelElement(el, e.clientX, e.clientY));
    };
    const onLeave = () => {
      charRefs.current.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.4)",
        });
      });
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const heading = t("heading");

  return (
    <section
      ref={sectionRef}
      className="relative h-svh w-full flex flex-col"
      role="region"
      aria-label="404"
    >
      <div className="absolute inset-0 bg-black/55 z-10" aria-hidden="true" />

      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-30">
        <LanguageSwitcher />
      </div>

      <div className="relative z-20 flex flex-col justify-center flex-1 px-8 md:px-16">
        <h1
          className="font-mono font-bold uppercase text-white leading-none tracking-tight text-hero [perspective:600px]"
          aria-label={heading}
        >
          {heading.split("").map((char, index) => (
            <span
              key={index}
              className="nf-char inline-block"
              ref={(el) => {
                if (el) charRefs.current.push(el);
              }}
              aria-hidden="true"
            >
              {char}
            </span>
          ))}
        </h1>

        <p className="nf-fade font-mono text-white/70 tracking-widest uppercase mt-6 md:ml-3 text-label">
          {t("subheading")}
        </p>

        <p className="nf-fade font-sans text-white/60 max-w-xl mt-4 md:ml-3 text-body">
          {t("body")}
        </p>

        <div className="nf-fade mt-8 md:ml-3">
          <Link
            href="/"
            className="inline-block bg-white/5 border border-white/10 hover:border-white/30 backdrop-blur-sm rounded-lg px-5 py-2 font-mono uppercase tracking-widest text-label text-white/80 hover:text-white transition-colors"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
