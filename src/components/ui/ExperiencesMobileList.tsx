"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { EXPERIENCE_STATIC } from "../sections/experiences.data";

export default function ExperiencesMobileList() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const t = useTranslations("experiences");
  const translatedItems = t.raw("items") as Array<{
    role: string;
    description: string[];
  }>;

  useEffect(() => {
    if (!isActive) return;

    const section = sectionRef.current;
    if (!section) return;

    const items = Array.from(
      section.querySelectorAll<HTMLElement>(".experience-item"),
    );
    const animatedItems = new Set<HTMLElement>();
    let animatedCount = 0;

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

        if (itemRect.top - containerRect.top < section.clientHeight - 40) {
          animateItem(item);
        }
      });
    };

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
        <SectionHeading>{t("title")}</SectionHeading>

        <div className="flex flex-col gap-3" role="list">
          {EXPERIENCE_STATIC.map((staticData, index) => {
            const translated = translatedItems[index] ?? {
              role: "",
              description: [],
            };

            return (
              <GlassCard
                key={index}
                className="experience-item p-6"
                role="listitem"
              >
                <article className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                  <div className="md:w-48 shrink-0">
                    <p className="font-mono tracking-widest uppercase text-label text-zinc-500">
                      {staticData.period}
                    </p>
                    <p className="font-mono tracking-widest uppercase mt-1 text-label text-zinc-600">
                      {staticData.location}
                    </p>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-sans font-semibold mb-1 text-body text-zinc-100">
                      {!!staticData?.link ? (
                        <a
                          href={staticData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-zinc-100"
                        >
                          {staticData.company}
                        </a>
                      ) : (
                        staticData.company
                      )}
                    </h3>

                    <p className="font-mono tracking-widest uppercase mb-3 text-label text-zinc-400">
                      {translated.role}
                    </p>

                    <ul className="list-disc list-outside pl-4 flex flex-col gap-1">
                      {translated.description.map((item, descriptionIndex) => (
                        <li
                          key={descriptionIndex}
                          className="leading-relaxed text-body text-gray-400"
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
