"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SectionContext } from "@/contexts/SectionContext";
import CircleProgress from "@/components/ui/CircleProgress";
import Nav from "@/components/ui/Nav";
import PersistentHeader from "@/components/ui/PersistentHeader";

const ROUTES = ["/", "/about", "/experiences", "/education"];
const SCROLL_RANGE = 500; // px of cumulative scroll delta to complete the effect

interface SectionsContainerProps {
  children: React.ReactNode;
}

export default function SectionsContainer({ children }: SectionsContainerProps) {
  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const animating = useRef(false);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  const overlayContainerRef = useRef<HTMLDivElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  // Forward cinematic: Hero → About (progress 0 → 1)
  const fwdActiveRef = useRef(false);
  const fwdProgressRef = useRef(0);

  // Reverse cinematic: About → Hero (progress 1 → 0)
  const revActiveRef = useRef(false);
  const revProgressRef = useRef(0);

  // -----------------------------------------------------------------------
  // Direct URL load
  // -----------------------------------------------------------------------
  useEffect(() => {
    const index = ROUTES.indexOf(window.location.pathname);
    if (index > 0) {
      currentRef.current = index;
      setCurrent(index);
      requestAnimationFrame(() => {
        panelsRef.current.forEach((panel, i) => {
          if (!panel) return;
          panel.style.opacity = i === index ? "1" : "0";
          panel.style.zIndex = i === index ? "1" : "0";
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Section cross-fade
  // -----------------------------------------------------------------------
  const gotoSection = useCallback((index: number) => {
    const target = ((index % ROUTES.length) + ROUTES.length) % ROUTES.length;
    if (animating.current || target === currentRef.current) return;

    animating.current = true;
    const prev = currentRef.current;
    const direction = target > prev ? 1 : -1;
    const panels = panelsRef.current;

    panels[target].style.zIndex = "2";
    panels[prev].style.zIndex = "1";

    const targetSection = panels[target].querySelector("section") as HTMLElement | null;
    if (targetSection) targetSection.scrollTop = 0;

    gsap.set(panels[target], { opacity: 0, y: direction * 60 });
    gsap
      .timeline({
        onComplete: () => {
          panels[prev].style.zIndex = "0";
          panels[target].style.zIndex = "1";
          animating.current = false;
        },
      })
      .to(panels[prev], { opacity: 0, y: direction * -40, duration: 0.5, ease: "power2.inOut" }, 0)
      .to(panels[target], { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.1);

    window.history.replaceState(null, "", ROUTES[target]);
    currentRef.current = target;
    setCurrent(target);
  }, []);

  useEffect(() => {
    (window as Window & { gotoSection?: (i: number) => void }).gotoSection = gotoSection;
  }, [gotoSection]);

  // -----------------------------------------------------------------------
  // Cinematic effect
  // -----------------------------------------------------------------------
  useEffect(() => {
    const overlay = overlayContainerRef.current;
    const canvas = overlayCanvasRef.current;
    if (!overlay || !canvas) return;

    // Constants captured once when cinematic starts
    let h1Left = 0;
    let h1Bottom = 0;
    let heroFontPx = 115;
    let fontFamily = '"Montserrat Alternates", sans-serif';
    let scaleTarget = 0.12;
    let yDelta = -780;
    let mobile = false;

    const getH1 = () =>
      panelsRef.current[0]?.querySelector("h1") as HTMLElement | null;

    const initConstants = () => {
      const h1Panel = panelsRef.current[0];
      const h1 = getH1();
      if (!h1 || !h1Panel) return;

      // Compensate for any GSAP y-offset applied to the hero panel
      const panelY = (gsap.getProperty(h1Panel, "y") as number) || 0;
      const rect = h1.getBoundingClientRect();
      h1Left = rect.left;
      h1Bottom = rect.bottom - panelY;
      heroFontPx = parseFloat(getComputedStyle(h1).fontSize);
      fontFamily = getComputedStyle(h1).fontFamily;
      mobile = window.innerWidth < 768;
      scaleTarget = 14 / heroFontPx;
      // Move bottom of scaled text to PersistentHeader top (~24px)
      yDelta = 24 - h1Bottom + heroFontPx * scaleTarget;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // -------------------------------------------------------------------
    // Draw one frame. progress 0 = letters at h1 size, 1 = tiny at header
    // Always 2-line layout. Letters grow from h1 position → screen center → header.
    // -------------------------------------------------------------------
    const drawFrame = (progress: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = window.innerWidth;
      const H = window.innerHeight;

      const SCALE_UP_END = 0.6;
      const SCALE_DOWN_START = 0.55;
      const easeIn  = (t: number) => t * t;
      const easeOut = (t: number) => t * (2 - t);
      const lerp    = (a: number, b: number, t: number) => a + (b - a) * t;

      // Dynamic peak scale: make the longest word fill ~85% of screen width
      // Measure "ramalho" at base size using a temp measurement
      ctx.font = `700 ${heroFontPx}px ${fontFamily}`;
      const ramalhoWidth1x = ctx.measureText("ramalho").width;
      const maxScale = Math.max(4, Math.min(14, (W * 0.85) / ramalhoWidth1x));

      // Current scale
      let scale: number;
      if (progress <= SCALE_UP_END) {
        scale = 1 + (maxScale - 1) * easeIn(progress / SCALE_UP_END);
      } else {
        const t = Math.min(1, (progress - SCALE_DOWN_START) / (1 - SCALE_DOWN_START));
        scale = maxScale + (scaleTarget - maxScale) * easeOut(t);
      }

      const fontSize = heroFontPx * scale;

      // Measure words at current size
      ctx.font = `700 ${fontSize}px ${fontFamily}`;
      const wesleyW  = ctx.measureText("wesley").width;
      const ramalhoW = ctx.measureText("ramalho").width;
      const lineGap  = fontSize * 1.05; // baseline-to-baseline

      // --- Keyframe positions ---
      // START: match h1 (2-line stack at bottom-left)
      const sX     = h1Left;
      const sY_r   = h1Bottom;                   // ramalho baseline
      const sY_w   = h1Bottom - heroFontPx * 1.1; // wesley baseline

      // PEAK: each word centered on screen
      const pX_w  = (W - wesleyW)  / 2;
      const pX_r  = (W - ramalhoW) / 2;
      const pY_r  = H * 0.60;                    // ramalho baseline at 60% of height
      const pY_w  = pY_r - lineGap;              // wesley above

      // END: PersistentHeader top-left (~left:32px, top:24px on desktop)
      const hLeft = mobile ? 16 : 32;
      const eX    = hLeft;
      const eY_w  = 24 + fontSize;               // wesley baseline just below header top
      const eY_r  = eY_w + lineGap;              // ramalho below

      // Interpolate positions
      let xW: number, yW: number, xR: number, yR: number;
      if (progress <= SCALE_UP_END) {
        const t = easeOut(progress / SCALE_UP_END);
        xW = lerp(sX, pX_w, t);  yW = lerp(sY_w, pY_w, t);
        xR = lerp(sX, pX_r, t);  yR = lerp(sY_r, pY_r, t);
      } else {
        const t = easeOut(Math.min(1, (progress - SCALE_DOWN_START) / (1 - SCALE_DOWN_START)));
        xW = lerp(pX_w, eX, t);  yW = lerp(pY_w, eY_w, t);
        xR = lerp(pX_r, eX, t);  yR = lerp(pY_r, eY_r, t);
      }

      // Draw — resize resets canvas state, so set font/composite again after
      canvas.width  = W;
      canvas.height = H;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, W, H);

      ctx.globalCompositeOperation = "destination-out";
      ctx.font = `700 ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "white";
      ctx.fillText("wesley",  xW, yW);
      ctx.fillText("ramalho", xR, yR);
    };

    // Fill canvas solid black (used at animation completion before overlay fades)
    const fillBlack = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // -------------------------------------------------------------------
    // Forward update (Hero → About)
    // -------------------------------------------------------------------
    const updateFwd = (raw: number) => {
      const progress = Math.max(0, Math.min(1, raw));
      fwdProgressRef.current = progress;

      if (progress <= 0) {
        fwdActiveRef.current = false;
        gsap.set(overlay, { opacity: 0, visibility: "hidden" });
        const h1 = getH1();
        if (h1) gsap.set(h1, { clearProps: "opacity" });
        return;
      }

      if (!fwdActiveRef.current) {
        if (animating.current) return;
        fwdActiveRef.current = true;
        initConstants();
        const h1 = getH1();
        if (h1) gsap.set(h1, { opacity: 0 });
        gsap.set(overlay, { visibility: "visible" });
      }

      gsap.set(overlay, { opacity: 1 });
      drawFrame(progress);

      if (progress >= 1) {
        fwdProgressRef.current = 0;
        fwdActiveRef.current = false;
        const h1 = getH1();
        if (h1) gsap.set(h1, { clearProps: "opacity" });
        fillBlack();
        gotoSection(1);
        // Fade overlay out while section cross-fade runs
        gsap.delayedCall(0.2, () => {
          gsap.to(overlay, {
            opacity: 0, duration: 0.4,
            onComplete: () => { gsap.set(overlay, { visibility: "hidden" }); },
          });
        });
      }
    };

    // -------------------------------------------------------------------
    // Reverse update (About → Hero)
    // revProgress 1 = end state (letters tiny at header), 0 = back to Hero
    // -------------------------------------------------------------------
    const updateRev = (raw: number) => {
      const progress = Math.max(0, Math.min(1, raw));
      revProgressRef.current = progress;

      gsap.set(overlay, { opacity: 1 });
      drawFrame(progress);

      if (progress <= 0) {
        revActiveRef.current = false;
        revProgressRef.current = 0;
        const h1 = getH1();
        if (h1) gsap.set(h1, { clearProps: "opacity" });
        gotoSection(0);
        gsap.delayedCall(0.2, () => {
          gsap.to(overlay, {
            opacity: 0, duration: 0.4,
            onComplete: () => { gsap.set(overlay, { visibility: "hidden" }); },
          });
        });
      }
    };

    const cancelRev = () => {
      revActiveRef.current = false;
      revProgressRef.current = 0;
      gsap.set(overlay, { opacity: 0, visibility: "hidden" });
      const h1 = getH1();
      if (h1) gsap.set(h1, { clearProps: "opacity" });
    };

    // -------------------------------------------------------------------
    // Wheel
    // -------------------------------------------------------------------
    const getActiveSection = (): HTMLElement | null =>
      (panelsRef.current[currentRef.current]?.querySelector("section") as HTMLElement | null) ?? null;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();

      // Reverse cinematic is active
      if (revActiveRef.current) {
        const next = revProgressRef.current + e.deltaY / SCROLL_RANGE;
        if (next >= 1) {
          cancelRev(); // user scrolled back down to About — cancel reverse
        } else {
          updateRev(next);
        }
        return;
      }

      // Forward cinematic: on Hero or mid-forward-animation
      if (fwdActiveRef.current || currentRef.current === 0) {
        updateFwd(fwdProgressRef.current + e.deltaY / SCROLL_RANGE);
        return;
      }

      // On About, scroll up → start reverse
      if (currentRef.current === 1 && e.deltaY < 0) {
        if (animating.current) return;
        revActiveRef.current = true;
        revProgressRef.current = 1;
        initConstants();
        const h1 = getH1();
        if (h1) gsap.set(h1, { opacity: 0 });
        gsap.set(overlay, { visibility: "visible" });
        updateRev(1 + e.deltaY / SCROLL_RANGE); // deltaY < 0 → decreases from 1
        return;
      }

      // Normal navigation
      if (animating.current) return;

      const section = getActiveSection();
      if (section && section.scrollHeight > section.clientHeight + 2) {
        const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 4;
        const atTop = section.scrollTop <= 0;
        if (e.deltaY > 10 && !atBottom) { section.scrollTop += e.deltaY; return; }
        if (e.deltaY < -10 && !atTop) { section.scrollTop += e.deltaY; return; }
      }

      if (e.deltaY > 10) gotoSection(currentRef.current + 1);
      else if (e.deltaY < -10) gotoSection(currentRef.current - 1);
    };

    // -------------------------------------------------------------------
    // Touch (real-time via touchmove)
    // -------------------------------------------------------------------
    let touchStartY = 0;
    let touchLastY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = touchLastY - y; // positive = finger up = scroll down
      touchLastY = y;

      if (revActiveRef.current) {
        const next = revProgressRef.current + delta / SCROLL_RANGE;
        if (next >= 1) {
          cancelRev();
        } else {
          updateRev(next);
        }
        return;
      }

      if (fwdActiveRef.current || currentRef.current === 0) {
        updateFwd(fwdProgressRef.current + delta / SCROLL_RANGE);
        return;
      }

      if (currentRef.current === 1 && delta < 0) {
        if (animating.current) return;
        if (!revActiveRef.current) {
          revActiveRef.current = true;
          revProgressRef.current = 1;
          initConstants();
          const h1 = getH1();
          if (h1) gsap.set(h1, { opacity: 0 });
          gsap.set(overlay, { visibility: "visible" });
        }
        updateRev(revProgressRef.current + delta / SCROLL_RANGE); // delta < 0 → decreases
        return;
      }
    };

    const onTouchEnd = () => {
      if (fwdActiveRef.current || revActiveRef.current) return;
      if (currentRef.current === 0) return;
      if (animating.current) return;

      const totalDelta = touchStartY - touchLastY;
      if (Math.abs(totalDelta) < 30) return;

      const section = getActiveSection();
      if (section) {
        const atBottom = section.scrollTop + section.clientHeight >= section.scrollHeight - 4;
        const atTop = section.scrollTop <= 0;
        if (totalDelta > 30 && !atBottom) return;
        if (totalDelta < -30 && !atTop) return;
      }

      if (totalDelta > 30) gotoSection(currentRef.current + 1);
      else if (totalDelta < -30) gotoSection(currentRef.current - 1);
    };

    // -------------------------------------------------------------------
    // Keyboard (instant complete)
    // -------------------------------------------------------------------
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        if (revActiveRef.current) { cancelRev(); return; }
        if (fwdActiveRef.current || currentRef.current === 0) { updateFwd(1); return; }
        if (animating.current) return;
        gotoSection(currentRef.current + 1);
      }
      if (e.key === "ArrowUp" || e.key === "PageUp") {
        if (fwdActiveRef.current) { updateFwd(0); return; }
        if (currentRef.current === 1) {
          if (animating.current) return;
          if (!revActiveRef.current) {
            revActiveRef.current = true;
            revProgressRef.current = 1;
            initConstants();
            const h1 = getH1();
            if (h1) gsap.set(h1, { opacity: 0 });
            gsap.set(overlay, { visibility: "visible" });
          }
          updateRev(0);
          return;
        }
        if (animating.current) return;
        gotoSection(currentRef.current - 1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
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
            ref={(el) => { if (el) panelsRef.current[index] = el; }}
            className={`absolute inset-0 h-svh ${index === 0 ? "opacity-100 z-[1]" : "opacity-0 z-[0]"}`}
            aria-hidden={index !== current}
          >
            {child}
          </div>
        </SectionContext.Provider>
      ))}

      <Nav current={current} gotoSection={gotoSection} />
      <PersistentHeader current={current} total={ROUTES.length} gotoSection={gotoSection} />
      <CircleProgress current={current} total={ROUTES.length} />

      {/* Cinematic letter-mask overlay */}
      <div
        ref={overlayContainerRef}
        style={{
          position: "fixed", inset: 0, zIndex: 150,
          opacity: 0, visibility: "hidden", pointerEvents: "none",
        }}
      >
        {/* Duplicate video — visible through canvas letter holes */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        >
          <source src="/video.webm" type="video/webm" />
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Canvas: black fill + destination-out text = transparent letter holes revealing video */}
        <canvas
          ref={overlayCanvasRef}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
