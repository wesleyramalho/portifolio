"use client";

import { useEffect } from "react";
import gsap from "gsap";
import type { FluidSimulationOGL } from "@/components/fluid/FluidSimulationOGL";

interface RippleRefs {
  container: React.RefObject<HTMLDivElement | null>;
  distortedImg: React.RefObject<HTMLDivElement | null>;
  turbulence: React.RefObject<SVGFETurbulenceElement | null>;
  displacement: React.RefObject<SVGFEDisplacementMapElement | null>;
  darkOverlay: React.RefObject<HTMLDivElement | null>;
  fluid?: FluidSimulationOGL | null;
}

export function useRippleDistortion(refs: RippleRefs) {
  useEffect(() => {
    const container = refs.container.current;
    const distortedImg = refs.distortedImg.current;
    const turbulence = refs.turbulence.current;
    const displacement = refs.displacement.current;
    const darkOverlay = refs.darkOverlay.current;
    if (!container || !distortedImg || !turbulence || !displacement || !darkOverlay)
      return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const isHoverDevice = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (!isHoverDevice) return;

    const img = container.querySelector("img") as HTMLElement | null;
    if (!img) return;

    let lastX = 0;
    let lastY = 0;
    let seed = 0;
    let lastSeedTime = 0;
    const SEED_INTERVAL = 200;
    const RIPPLE_RADIUS = 100;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width - 0.5) * 2;
      const ny = (y / rect.height - 0.5) * 2;

      // Fluid ripple at cursor position
      if (refs.fluid) {
        const uvX = e.clientX / window.innerWidth;
        const uvY = 1 - e.clientY / window.innerHeight;
        const dx = (e.clientX - lastX) * 3;
        const dy = -(e.clientY - lastY) * 3;
        refs.fluid.addSplat(uvX, uvY, dx, dy);
      }

      // Distortion — localized via clip-path circle on the distorted layer
      const now = Date.now();
      if (now - lastSeedTime > SEED_INTERVAL) {
        seed += 1;
        turbulence.setAttribute("seed", String(seed));
        lastSeedTime = now;
      }

      // Move the clip-path circle to cursor position
      distortedImg.style.clipPath = `circle(${RIPPLE_RADIUS}px at ${x}px ${y}px)`;

      gsap.to(distortedImg, {
        opacity: 1,
        duration: 0.2,
        overwrite: "auto",
      });

      lastX = e.clientX;
      lastY = e.clientY;

      // Wobble
      gsap.to(img, {
        x: -nx * 6,
        y: -ny * 6,
        scale: 1.04,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Darkening
      darkOverlay.style.setProperty("--mx", `${x}px`);
      darkOverlay.style.setProperty("--my", `${y}px`);

      gsap.to(darkOverlay, {
        opacity: 1,
        duration: 0.3,
        overwrite: "auto",
      });
    };

    const onLeave = () => {
      gsap.to(distortedImg, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(img, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.4)",
        overwrite: "auto",
      });

      gsap.to(darkOverlay, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    // Random glitch — distortion flashes at a random position every few seconds
    let glitchTimer: ReturnType<typeof setTimeout>;
    let isHovering = false;

    const onEnter = () => { isHovering = true; };
    const origOnLeave = onLeave;
    const wrappedOnLeave = () => { isHovering = false; origOnLeave(); };

    container.removeEventListener("mouseleave", onLeave);
    container.addEventListener("mouseenter", onEnter);
    container.addEventListener("mouseleave", wrappedOnLeave);

    function scheduleGlitch() {
      const delay = 1500 + Math.random() * 3000; // 1.5-4.5 seconds
      glitchTimer = setTimeout(() => {
        if (isHovering) { scheduleGlitch(); return; }

        const rect = container!.getBoundingClientRect();
        const gx = Math.random() * rect.width;
        const gy = Math.random() * rect.height;

        seed += 1;
        turbulence!.setAttribute("seed", String(seed));

        distortedImg!.style.clipPath = `circle(${80 + Math.random() * 100}px at ${gx}px ${gy}px)`;

        gsap.fromTo(distortedImg,
          { opacity: 0 },
          { opacity: 1, duration: 0.08, yoyo: true, repeat: 2 + Math.floor(Math.random() * 4),
            ease: "power1.inOut",
            onComplete: () => {
              gsap.set(distortedImg, { opacity: 0 });
            },
          },
        );

        scheduleGlitch();
      }, delay);
    }

    scheduleGlitch();

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseenter", onEnter);
      container.removeEventListener("mouseleave", wrappedOnLeave);
      clearTimeout(glitchTimer);
    };
  }, [refs]);
}
