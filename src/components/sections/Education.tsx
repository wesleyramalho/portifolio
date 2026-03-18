"use client";

import { useRef } from "react";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";

const education = [
  {
    institution: "PUC Minas",
    degree:
      "Postgraduate Degree – Artificial Intelligence and Machine Learning",
    period: "2025 – 2026",
  },
  {
    institution:
      "IFSP – Instituto Federal de Educação, Ciência e Tecnologia de São Paulo",
    degree: "System Analysis and Development",
    period: "2015 – 2017",
  },
  {
    institution: "Escola SENAI de Informática",
    degree: "Multi-platform Development (Web and Mobile)",
    period: "2016",
  },
  {
    institution: "ETEC – Escola Técnica Estadual de São Paulo",
    degree: "Technical Degree in Administration, Marketing",
    period: "2014 – 2015",
  },
  {
    institution: "ETEC – Escola Técnica Estadual de São Paulo",
    degree: "High School",
    period: "2012 – 2014",
  },
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();

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
        <SectionHeading>Education</SectionHeading>

        <div className="flex flex-col gap-3" role="list">
          {education.map((educationItem, index) => (
            <GlassCard key={index} className="education-item p-6" role="listitem">
              <article className="flex flex-col md:flex-row md:items-start gap-4 md:gap-12">
                <div className="md:w-48 shrink-0">
                  <p
                    className="font-mono tracking-widest uppercase"
                    style={{ fontSize: "var(--text-label)", color: "#71717A" }}
                  >
                    {educationItem.period}
                  </p>
                </div>
                <div className="flex-1">
                  <h3
                    className="font-sans font-semibold mb-1"
                    style={{ fontSize: "var(--text-body)", color: "#F4F4F5" }}
                  >
                    {educationItem.institution}
                  </h3>
                  <p
                    className="font-mono tracking-widest uppercase"
                    style={{ fontSize: "var(--text-label)", color: "#A1A1AA" }}
                  >
                    {educationItem.degree}
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
