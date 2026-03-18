"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

const EDUCATION_STATIC = [
  { institution: "PUC Minas", period: "2025 – 2026" },
  { institution: "IFSP – Instituto Federal de Educação, Ciência e Tecnologia de São Paulo", period: "2015 – 2017" },
  { institution: "Escola SENAI de Informática", period: "2016" },
  { institution: "ETEC – Escola Técnica Estadual de São Paulo", period: "2014 – 2015" },
  { institution: "ETEC – Escola Técnica Estadual de São Paulo", period: "2012 – 2014" },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const t = useTranslations('education');
  const translatedItems = t.raw('items') as Array<{ degree: string }>;

  useEntranceAnimation(".education-item", isActive);

  return (
    <section
      id="education"
      ref={sectionRef}
      className="h-svh bg-background px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Education"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full pt-24 pb-28 md:pt-28 md:pb-16">
        <SectionHeading>{t('title')}</SectionHeading>

        <div className="flex flex-col gap-3" role="list">
          {EDUCATION_STATIC.map((staticData, index) => (
            <GlassCard key={index} className="education-item p-6" role="listitem">
              <article className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                <div className="md:w-48 shrink-0">
                  <p
                    className="font-mono tracking-widest uppercase text-label text-zinc-500"
                  >
                    {staticData.period}
                  </p>
                </div>
                <div className="flex-1">
                  <h3
                    className="font-sans font-semibold mb-1 text-body text-zinc-100"
                  >
                    {staticData.institution}
                  </h3>
                  <p
                    className="font-mono tracking-widest uppercase text-label text-zinc-400"
                  >
                    {translatedItems[index].degree}
                  </p>
                </div>
              </article>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
