"use client";

import Image from "next/image";

interface ProjectCarouselProps {
  images: string[];
  alt: string;
}

const SECONDS_PER_IMAGE = 4;

export default function ProjectCarousel({ images, alt }: ProjectCarouselProps) {
  const duration = images.length * SECONDS_PER_IMAGE;

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-auto md:h-full md:min-h-[400px] overflow-hidden rounded-t-xl md:rounded-t-none md:rounded-l-xl bg-black/20">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} – screenshot ${i + 1}`}
          fill
          className="object-cover object-top"
          style={{
            animation: `carousel-fade ${duration}s infinite`,
            animationDelay: `${i * SECONDS_PER_IMAGE}s`,
            opacity: 0,
          }}
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
