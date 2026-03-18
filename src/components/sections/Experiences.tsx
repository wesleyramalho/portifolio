"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

const EXPERIENCE_STATIC: {
  company: string;
  period: string;
  location: string;
  link?: string;
}[] = [
  {
    company: "Tecla (CredoAI)",
    period: "Apr 2025 – Present",
    location: "🇺🇸 United States (Remote)",
  },
  {
    company: "Truelogic Software (Zappos)",
    period: "Oct 2024 – Jul 2025",
    location: "🇺🇸 United States (Remote)",
  },
  {
    company: "Tecla (OnChain Studios)",
    period: "Oct 2023 – Jun 2024",
    location: "🇺🇸 United States (Remote)",
    link: "https://digitoys.io/collections",
  },
  {
    company: "X-Team",
    period: "Sep 2021 – Sep 2023",
    location: "🇦🇺 Australia (Remote)",
  },
  {
    company: "Popstand",
    period: "May 2021 – Sep 2021",
    location: "🇺🇸 United States (Remote)",
    link: "https://br.topps.com",
  },
  {
    company: "iCarros",
    period: "Mar 2020 – May 2021",
    location: "🇧🇷 Brazil",
    link: "http://icarros.com.br/",
  },
  {
    company: "SENAI São Paulo",
    period: "Dec 2017 – Feb 2020",
    location: "🇧🇷 Brazil",
  },
  {
    company: "SENAI São Paulo",
    period: "Mar 2017 – Nov 2017",
    location: "🇧🇷 Brazil",
  },
];

export default function Experiences() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const t = useTranslations('experiences');
  const translatedItems = t.raw('items') as Array<{ role: string; description: string[] }>;

  useEffect(() => {
    if (!isActive) return;

    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(
      section.querySelectorAll<HTMLElement>(".experience-item"),
    );
    const animatedItems = new Set<HTMLElement>();
    let animatedCount = 0;

    // Only hide opacity — no y-transform so DOM positions stay accurate for visibility checks
    gsap.set(items, { opacity: 0 });

    const animateItem = (item: HTMLElement) => {
      if (animatedItems.has(item)) return;
      animatedItems.add(item);

      const delay = animatedCount < 2 ? animatedCount * 0.12 : 0;
      animatedCount++;

      gsap.fromTo(
        item,
        { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
        {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.75,
          delay,
          ease: "power3.out",
          clearProps: "clipPath",
        },
      );
    };

    const checkVisibility = () => {
      const containerRect = section.getBoundingClientRect();
      items.forEach((item) => {
        if (animatedItems.has(item)) return;
        const itemRect = item.getBoundingClientRect();
        // Trigger when top of item is within the section's visible height
        if (itemRect.top - containerRect.top < section.clientHeight - 40) {
          animateItem(item);
        }
      });
    };

    // Check immediately after layout settles, then on every scroll
    requestAnimationFrame(checkVisibility);
    section.addEventListener("scroll", checkVisibility, { passive: true });

    return () => section.removeEventListener("scroll", checkVisibility);
  }, [isActive]);

  return (
    <section
      id="experiences"
      ref={sectionRef}
      className="h-svh bg-background px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Experiences"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full pt-24 pb-28 md:pt-28 md:pb-16">
        <SectionHeading>{t('title')}</SectionHeading>

        <div className="flex flex-col gap-3" role="list">
          {EXPERIENCE_STATIC.map((staticData, index) => {
            const translated = translatedItems[index];
            return (
              <GlassCard
                key={index}
                className="experience-item p-6"
                role="listitem"
              >
                <article className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                  <div className="md:w-48 shrink-0">
                    <p
                      className="font-mono tracking-widest uppercase"
                      style={{ fontSize: "var(--text-label)", color: "#71717A" }}
                    >
                      {staticData.period}
                    </p>
                    <p
                      className="font-mono tracking-widest uppercase mt-1"
                      style={{ fontSize: "var(--text-label)", color: "#52525B" }}
                    >
                      {staticData.location}
                    </p>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-sans font-semibold mb-1"
                      style={{ fontSize: "var(--text-body)", color: "#F4F4F5" }}
                    >
                      {staticData.link ? (
                        <a
                          href={staticData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#F4F4F5" }}
                          className="hover:underline"
                        >
                          {staticData.company}
                        </a>
                      ) : (
                        staticData.company
                      )}
                    </h3>
                    <p
                      className="font-mono tracking-widest uppercase mb-3"
                      style={{ fontSize: "var(--text-label)", color: "#A1A1AA" }}
                    >
                      {translated.role}
                    </p>
                    <ul className="list-disc list-outside pl-4 flex flex-col gap-1">
                      {translated.description.map((item, descriptionIndex) => (
                        <li
                          key={descriptionIndex}
                          className="leading-relaxed"
                          style={{
                            fontSize: "var(--text-body)",
                            color: "#9CA3AF",
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
