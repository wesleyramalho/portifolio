"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import GlowBorderCanvas from "@/components/ui/GlowBorderCanvas";
import ExperienceProgress from "@/components/ui/ExperienceProgress";
import { EXPERIENCE_STATIC } from "../sections/experiences.data";

const DEG_PER_ITEM = 45;
const SCROLL_PER_ITEM = 500;
const SNAP_DELAY = 450;

function calcDesktopDims() {
  if (typeof window === "undefined") {
    return {
      faceW: 540,
      faceH: 440,
      radius: 400,
      perspective: 1400,
    };
  }

  const vw = window.innerWidth;

  if (vw < 1024) {
    return {
      faceW: 480,
      faceH: 410,
      radius: 300,
      perspective: 1500,
    };
  }

  return {
    faceW: 540,
    faceH: 440,
    radius: 400,
    perspective: 1400,
  };
}

export default function ExperiencesDesktop3D() {
  const sectionRef = useRef<HTMLElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);
  const snapIndexRef = useRef(0);
  const accumRef = useRef(0);
  const snapTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const [activeIndex, setActiveIndex] = useState(0);
  const [dims, setDims] = useState(calcDesktopDims);

  const { faceW, faceH, radius, perspective } = dims;

  const { isActive, index: sectionIndex, gotoSection } = useSectionContext();
  const t = useTranslations("experiences");
  const translatedItems = t.raw("items") as Array<{
    role: string;
    description: string[];
  }>;

  useEffect(() => {
    const onResize = () => setDims(calcDesktopDims());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const snapTo = useCallback((snap: number) => {
    snapIndexRef.current = snap;
    accumRef.current = 0;
    setActiveIndex(snap);

    gsap.to(tubeRef.current, {
      rotateY: -DEG_PER_ITEM * snap,
      duration: 0.65,
      ease: "power3.out",
      overwrite: true,
    });
  }, []);

  const rotateTo = useCallback((continuousIndex: number) => {
    gsap.to(tubeRef.current, {
      rotateY: -DEG_PER_ITEM * continuousIndex,
      duration: 0.25,
      ease: "power1.out",
      overwrite: true,
    });
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      accumRef.current += e.deltaY;
      const raw = snapIndexRef.current + accumRef.current / SCROLL_PER_ITEM;

      if (raw < -0.3 && e.deltaY < 0) {
        accumRef.current = 0;
        gotoSection(sectionIndex - 1);
        return;
      }

      if (raw > EXPERIENCE_STATIC.length - 1 + 0.3 && e.deltaY > 0) {
        accumRef.current = 0;
        gotoSection(sectionIndex + 1);
        return;
      }

      const clamped = Math.max(0, Math.min(EXPERIENCE_STATIC.length - 1, raw));
      rotateTo(clamped);

      clearTimeout(snapTimerRef.current);
      snapTimerRef.current = setTimeout(() => {
        snapTo(Math.round(clamped));
      }, SNAP_DELAY);
    },
    [gotoSection, rotateTo, sectionIndex, snapTo],
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    section.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      section.removeEventListener("wheel", onWheel);
    };
  }, [onWheel]);

  useEffect(() => {
    if (!isActive) {
      clearTimeout(snapTimerRef.current);
      snapIndexRef.current = 0;
      accumRef.current = 0;
      setActiveIndex(0);
      gsap.set(tubeRef.current, { rotateY: 0 });
      return;
    }

    gsap.fromTo(
      tubeRef.current,
      { rotateY: 12 },
      { rotateY: 0, duration: 0.9, ease: "power3.out", delay: 0.1 },
    );
  }, [isActive]);

  const companies = useMemo(() => EXPERIENCE_STATIC.map((e) => e.company), []);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="relative h-svh bg-background overflow-hidden"
      role="region"
      aria-label="Experiences"
      aria-roledescription="slide"
    >
      <div className="absolute top-8 left-8 md:left-16 z-10 pt-16">
        <h2 className="font-sans font-bold uppercase tracking-widest text-label text-zinc-400">
          {t("title")}
        </h2>
      </div>

      <div
        className="absolute inset-0 flex items-center justify-center px-3 sm:px-0"
        style={{ perspective: `${perspective}px` }}
      >
        <div
          ref={tubeRef}
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateY(0deg)",
            width: 0,
            height: 0,
            position: "relative",
          }}
        >
          {EXPERIENCE_STATIC.map((staticData, i) => {
            const translated = translatedItems[i] ?? {
              role: "",
              description: [],
            };
            const isThisFaceActive = i === activeIndex;

            return (
              <div
                key={i}
                aria-hidden={!isThisFaceActive}
                style={{
                  position: "absolute",
                  width: faceW,
                  height: faceH,
                  marginLeft: -faceW / 2,
                  marginTop: -faceH / 2,
                  transform: `rotateY(${DEG_PER_ITEM * i}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <GlassCard
                  className={[
                    "h-full flex flex-col overflow-hidden transition-[filter,opacity,transform] duration-500",
                    "p-5 gap-3",
                    isThisFaceActive ? "opacity-100" : "opacity-25 blur-sm",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between shrink-0 gap-3">
                    <div className="min-w-0">
                      <p className="font-mono tracking-widest uppercase text-[10px] text-zinc-500">
                        {staticData.period}
                      </p>
                      <p className="font-mono tracking-widest uppercase text-[10px] mt-0.5 text-zinc-600">
                        {staticData.location}
                      </p>
                    </div>

                    <span className="font-mono text-[10px] tracking-widest text-zinc-600 tabular-nums shrink-0">
                      {String(i + 1).padStart(2, "0")} /{" "}
                      {String(EXPERIENCE_STATIC.length).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="shrink-0 border-t border-white/5 pt-3">
                    <h3 className="font-sans font-semibold text-sm sm:text-base text-zinc-100 leading-snug">
                      {"link" in staticData ? (
                        <a
                          href={(staticData as { link: string }).link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {staticData.company}
                        </a>
                      ) : (
                        staticData.company
                      )}
                    </h3>

                    <p className="font-mono tracking-widest uppercase text-[10px] mt-1 text-zinc-400">
                      {translated.role}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-1.5 overflow-hidden flex-1">
                    {translated.description.map((item, di) => (
                      <li
                        key={di}
                        className="flex gap-2 text-[12px] leading-relaxed text-gray-400"
                      >
                        <span className="text-zinc-600 shrink-0 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                {isThisFaceActive && (
                  <GlowBorderCanvas
                    borderRadius={8}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ExperienceProgress
        total={EXPERIENCE_STATIC.length}
        active={activeIndex}
        companies={companies}
        onSelect={snapTo}
      />

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none z-10"
        style={{
          opacity: activeIndex === 0 ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        <p className="font-mono text-[10px] tracking-widest uppercase text-zinc-600">
          scroll to navigate
        </p>
        <div className="w-px h-6 bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  );
}
