"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { TALKS_STATIC } from "./talks.data";

type TranslatedTalk = {
  eventName: string;
  place: string;
  dateLabel: string;
  organizers: string;
  description: string;
};

export default function Talks() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const t = useTranslations("talks");
  const translatedItems = t.raw("items") as TranslatedTalk[];

  useEntranceAnimation(".talk-item", isActive);

  return (
    <section
      id="talks"
      ref={sectionRef}
      className="h-svh px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Talks"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full pt-24 pb-64 md:pt-28 md:pb-56">
        <SectionHeading>{t("title")}</SectionHeading>

        <div className="grid grid-cols-1 gap-6" role="list">
          {TALKS_STATIC.map((talk, index) => {
            const item = translatedItems[index];
            return (
              <GlassCard
                key={talk.slug}
                className="talk-item p-0 overflow-hidden flex flex-col md:flex-row"
                role="listitem"
              >
                <div className="md:w-3/5 shrink-0">
                  <ProjectCarousel images={talk.images} alt={item.eventName} fit="contain" />
                </div>

                <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-sans font-semibold text-body text-zinc-100">
                      {item.eventName}
                    </h3>
                    <p className="font-mono tracking-widest uppercase text-label text-zinc-400">
                      {t("role")} · {item.dateLabel} · {item.place}
                    </p>
                    <p className="font-mono tracking-widest uppercase text-label text-zinc-500">
                      {item.organizers}
                    </p>
                  </div>

                  <p className="font-sans text-label text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                    {talk.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono tracking-widest uppercase text-label text-zinc-500 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
