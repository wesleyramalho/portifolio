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
    <div className="relative w-full overflow-hidden rounded-t-xl md:rounded-t-none md:rounded-l-xl max-h-[280px] md:max-h-[360px]">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${alt} – screenshot ${i + 1}`}
          width={1920}
          height={1080}
          className="w-full h-auto absolute inset-0"
          style={{
            animation: `carousel-fade ${duration}s infinite`,
            animationDelay: `${i * SECONDS_PER_IMAGE}s`,
            opacity: 0,
            position: i === 0 ? "relative" : "absolute",
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
