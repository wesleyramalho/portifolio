"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { PROJECTS_STATIC } from "./projects.data";

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();
  const t = useTranslations("projects");
  const translatedItems = t.raw("items") as Array<{
    title: string;
    description: string;
  }>;

  useEntranceAnimation(".project-item", isActive);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="h-svh bg-background px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Projects"
      aria-roledescription="slide"
    >
      <div className="max-w-5xl mx-auto w-full pt-24 pb-48 md:pt-28 md:pb-40">
        <SectionHeading>{t("title")}</SectionHeading>

        <div className="grid grid-cols-1 gap-6" role="list">
          {PROJECTS_STATIC.map((project, index) => (
            <GlassCard
              key={project.slug}
              className="project-item p-0 overflow-hidden flex flex-col md:flex-row"
              role="listitem"
            >
              <a
                href={project.links[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="md:w-3/5 shrink-0 cursor-pointer block"
              >
                <ProjectCarousel
                  images={project.images}
                  alt={translatedItems[index].title}
                />
              </a>

              <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                {/* Title + status badge */}
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={project.links[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-semibold text-body text-zinc-100 hover:text-white transition-colors cursor-pointer"
                  >
                    {translatedItems[index].title}
                  </a>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono tracking-widest uppercase text-label shrink-0 ${
                      project.status === "live"
                        ? "text-emerald-400"
                        : "text-zinc-500"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        project.status === "live"
                          ? "bg-emerald-400 animate-pulse"
                          : "bg-zinc-500"
                      }`}
                      aria-hidden="true"
                    />
                    {t(project.status)}
                  </span>
                </div>

                {/* Description */}
                <p className="font-sans text-label text-zinc-400 leading-relaxed">
                  {translatedItems[index].description}
                </p>

                {/* Technology tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono tracking-widest uppercase text-label text-zinc-500 bg-white/5 border border-white/10 rounded px-2 py-0.5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
                  {project.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono tracking-widest uppercase text-label text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {link.label}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  ))}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono tracking-widest uppercase text-label text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      GitHub
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
