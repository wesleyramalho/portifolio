"use client";

import Image from "next/image";
import { useId } from "react";

interface ProjectCarouselProps {
  images: string[];
  alt: string;
}

const SECONDS_PER_IMAGE = 4;
const FADE_SECONDS = 0.5;

export default function ProjectCarousel({ images, alt }: ProjectCarouselProps) {
  const rawId = useId();
  const animationName = `carousel-fade-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const count = images.length;
  const duration = count * SECONDS_PER_IMAGE;
  const animated = count > 1;
  const slotPct = 100 / count;
  const fadePct = (FADE_SECONDS / duration) * 100;

  const keyframes = animated
    ? `@keyframes ${animationName} {
        0% { opacity: 0 }
        ${fadePct.toFixed(3)}% { opacity: 1 }
        ${slotPct.toFixed(3)}% { opacity: 1 }
        ${(slotPct + fadePct).toFixed(3)}% { opacity: 0 }
        100% { opacity: 0 }
      }`
    : "";

  return (
    <div className="relative w-full h-full min-h-[280px] md:min-h-[360px] overflow-hidden rounded-t-xl md:rounded-t-none md:rounded-l-xl">
      {animated && <style dangerouslySetInnerHTML={{ __html: keyframes }} />}
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} – screenshot ${i + 1}`}
          width={1600}
          height={900}
          loading={i === 0 ? "eager" : "lazy"}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={
            animated
              ? {
                  animation: `${animationName} ${duration}s infinite`,
                  animationDelay: `${i * SECONDS_PER_IMAGE}s`,
                  opacity: 0,
                }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      ))}

      {/* Dot indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/40"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
