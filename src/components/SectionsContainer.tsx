"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SectionContext } from "@/contexts/SectionContext";
import { useMacBookTransition } from "@/contexts/MacBookTransitionContext";
import CircleProgress from "@/components/ui/CircleProgress";
import Nav from "@/components/ui/Nav";
import PersistentHeader from "@/components/ui/PersistentHeader";

const ROUTES = ["/", "/about", "/experiences", "/education"];

// Total scroll-pixels (deltaY accumulated) needed to complete Hero→About transition
const MACBOOK_SCROLL_THRESHOLD = 2000

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
  const macbookProgressRef = useRef(0);
  const { setProgress: setMacbookProgress } = useMacBookTransition();

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
          panel.style.zIndex = panelIndex === index ? "1" : "0";
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Instantly swap sections without GSAP — used after MacBook transition completes
  const commitTransition = useCallback((index: number) => {
    const panels = panelsRef.current;
    const prev = currentRef.current;
    panels.forEach((panel, i) => {
      gsap.set(panel, { opacity: i === index ? 1 : 0, y: 0, zIndex: i === index ? 1 : 0 });
    });
    const targetSection = panels[index]?.querySelector("section") as HTMLElement | null;
    if (targetSection) targetSection.scrollTop = 0;
    window.history.replaceState(null, "", ROUTES[index]);
    currentRef.current = index;
    setCurrent(index);
    void prev; // suppress unused-var lint
  }, []);

  const gotoSection = useCallback((index: number) => {
    // Clamp to valid range
    const target = ((index % ROUTES.length) + ROUTES.length) % ROUTES.length;
    if (animating.current || target === currentRef.current) return;

    animating.current = true;
    const previousIndex = currentRef.current;
    const direction = target > previousIndex ? 1 : -1;
    const panels = panelsRef.current;

    panels[target].style.zIndex = "2";
    panels[previousIndex].style.zIndex = "1";

    const targetSection = panels[target].querySelector("section") as HTMLElement | null;
    if (targetSection) targetSection.scrollTop = 0;

    gsap.set(panels[target], { opacity: 0, y: direction * 60 });

    const timeline = gsap.timeline({
      onComplete: () => {
        panels[previousIndex].style.zIndex = "0";
        panels[target].style.zIndex = "1";
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

    const advanceMacbook = (delta: number) => {
      const next = Math.max(0, Math.min(1, macbookProgressRef.current + delta / MACBOOK_SCROLL_THRESHOLD));
      macbookProgressRef.current = next;
      setMacbookProgress(next);

      if (next >= 1) {
        // Transition complete → commit About section, reset progress
        macbookProgressRef.current = 0;
        setMacbookProgress(0);
        commitTransition(1);
      } else if (next <= 0) {
        // Reversed back to Hero
        macbookProgressRef.current = 0;
        setMacbookProgress(0);
        commitTransition(0);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (animating.current) return;

      const section = getActiveSection();

      // ── Hero → About: MacBook transition (scroll down) ──────────────────
      if (currentRef.current === 0 && e.deltaY > 10) {
        advanceMacbook(e.deltaY);
        return;
      }

      // ── About → Hero: MacBook reverse (scroll up from top of About) ─────
      if (currentRef.current === 1 && e.deltaY < -10) {
        const atTop = !section || section.scrollTop <= 0;
        if (atTop) {
          advanceMacbook(e.deltaY); // delta is negative → decrements progress
          return;
        }
      }

      // ── Standard internal section scroll ────────────────────────────────
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

      // ── Standard section jump (all other pairs) ──────────────────────────
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

      // MacBook touch transitions
      if (currentRef.current === 0 && delta > 30) {
        advanceMacbook(delta * 10); // scale touch delta to match wheel threshold
        return;
      }
      const atTop = !getActiveSection() || (getActiveSection()?.scrollTop ?? 0) <= 0;
      if (currentRef.current === 1 && delta < -30 && atTop) {
        advanceMacbook(delta * 10);
        return;
      }

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
  }, [gotoSection, commitTransition, setMacbookProgress]);

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
            className={`absolute inset-0 h-svh ${index === 0 ? 'opacity-100 z-[1]' : 'opacity-0 z-[0]'}`}
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
