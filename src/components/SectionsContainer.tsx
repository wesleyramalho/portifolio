"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SectionContext } from "@/contexts/SectionContext";
import CircleProgress from "@/components/ui/CircleProgress";
import Nav from "@/components/ui/Nav";
import PersistentHeader from "@/components/ui/PersistentHeader";
import { experiencesEnabled } from "@/lib/featureFlags";

const ROUTES = [
  "/",
  "/about",
  "/projects",
  ...(experiencesEnabled ? ["/experiences"] : []),
  "/education",
  "/contact",
];
const BELOW_FLUID = new Set([0, 1]); // Hero, About — fluid renders on top via mix-blend-mode

function panelZ(index: number, level: 0 | 1 | 2): string {
  if (level === 0) return "0";
  if (BELOW_FLUID.has(index)) return String(level);
  return String(50 + level);
}

interface SectionsContainerProps {
  children: React.ReactNode;
}

export default function SectionsContainer({
  children,
}: SectionsContainerProps) {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const animating = useRef(false);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  // On direct URL load, jump to the matching section without animation
  useEffect(() => {
    const index = ROUTES.indexOf(window.location.pathname);
    if (index > 0) {
      currentRef.current = index;
      setCurrent(index);
      requestAnimationFrame(() => {
        panelsRef.current.forEach((panel, panelIndex) => {
          if (!panel) return;
          panel.style.opacity = panelIndex === index ? "1" : "0";
          panel.style.zIndex = panelIndex === index ? panelZ(index, 1) : "0";
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gotoSection = useCallback((index: number) => {
    // Clamp to valid range
    const target = ((index % ROUTES.length) + ROUTES.length) % ROUTES.length;
    if (animating.current || target === currentRef.current) return;

    animating.current = true;
    const previousIndex = currentRef.current;
    const direction = target > previousIndex ? 1 : -1;
    const panels = panelsRef.current;

    panels[target].style.zIndex = panelZ(target, 2);
    panels[previousIndex].style.zIndex = panelZ(previousIndex, 1);

    const targetSection = panels[target].querySelector(
      "section",
    ) as HTMLElement | null;
    if (targetSection) targetSection.scrollTop = 0;

    gsap.set(panels[target], { opacity: 0, y: direction * 60 });

    const timeline = gsap.timeline({
      onComplete: () => {
        panels[previousIndex].style.zIndex = panelZ(previousIndex, 0);
        panels[target].style.zIndex = panelZ(target, 1);
        animating.current = false;
      },
    });

    timeline.to(
      panels[previousIndex],
      { opacity: 0, y: direction * -40, duration: 0.5, ease: "power2.inOut" },
      0,
    );
    timeline.to(
      panels[target],
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      0.1,
    );

    window.history.replaceState(null, "", ROUTES[target]);
    currentRef.current = target;
    setCurrent(target);
  }, []);

  // Expose for Nav buttons
  useEffect(() => {
    (window as Window & { gotoSection?: (index: number) => void }).gotoSection =
      gotoSection;
  }, [gotoSection]);

  useEffect(() => {
    const getActiveSection = (): HTMLElement | null => {
      const activePanel = panelsRef.current[currentRef.current];
      return (
        (activePanel?.querySelector("section") as HTMLElement | null) ?? null
      );
    };

    const onWheel = (e: WheelEvent) => {
      if (animating.current) return;

      e.preventDefault();

      const section = getActiveSection();
      if (section && section.scrollHeight > section.clientHeight + 2) {
        const atBottom =
          section.scrollTop + section.clientHeight >= section.scrollHeight - 4;
        const atTop = section.scrollTop <= 0;
        if (e.deltaY > 10 && !atBottom) {
          section.scrollTop += e.deltaY;
          return;
        }
        if (e.deltaY < -10 && !atTop) {
          section.scrollTop += e.deltaY;
          return;
        }
      }

      if (e.deltaY > 10) gotoSection((currentRef.current + 1) % ROUTES.length);
      else if (e.deltaY < -10)
        gotoSection((currentRef.current - 1 + ROUTES.length) % ROUTES.length);
    };

    let touchStartY = 0;
    let touchStartScrollTop = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartScrollTop = getActiveSection()?.scrollTop ?? 0;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const delta = touchStartY - e.changedTouches[0].clientY;
      const scrolledBy = Math.abs(
        (getActiveSection()?.scrollTop ?? 0) - touchStartScrollTop,
      );
      if (scrolledBy > 5) return;
      if (delta > 30) gotoSection((currentRef.current + 1) % ROUTES.length);
      else if (delta < -30)
        gotoSection((currentRef.current - 1 + ROUTES.length) % ROUTES.length);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown")
        gotoSection((currentRef.current + 1) % ROUTES.length);
      if (e.key === "ArrowUp" || e.key === "PageUp")
        gotoSection((currentRef.current - 1 + ROUTES.length) % ROUTES.length);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
    };
  }, [gotoSection]);

  const childArray = React.Children.toArray(children);

  return (
    <div className="relative w-full h-svh overflow-hidden">
      {childArray.map((child, index) => (
        <SectionContext.Provider
          key={index}
          value={{ isActive: index === current, index, gotoSection }}
        >
          <div
            ref={(sectionElement) => {
              if (sectionElement) panelsRef.current[index] = sectionElement;
            }}
            className={`absolute inset-0 h-svh ${index === 0 ? "opacity-100 z-[1]" : "opacity-0 z-[0]"}`}
            aria-hidden={index !== current}
          >
            {child}
          </div>
        </SectionContext.Provider>
      ))}
      <Nav current={current} gotoSection={gotoSection} />
      <PersistentHeader
        current={current}
        total={ROUTES.length}
        gotoSection={gotoSection}
      />
      <CircleProgress current={current} total={ROUTES.length} />
    </div>
  );
}
