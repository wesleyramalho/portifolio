"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";

const experiences: {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string[];
  link?: string;
}[] = [
  {
    company: "Tecla (CredoAI)",
    role: "Senior Software Engineer (Front-end focused)",
    period: "Apr 2025 – Present",
    location: "🇺🇸 United States (Remote)",
    description: [
      "Reduced client bundle size by ~5.1MB, significantly improving load performance and user experience.",
      "Migrated key components from Material-UI to the in-house design system, leveraging Tailwind for improved consistency and maintainability.",
      "Resolved multiple high-priority production issues, increasing application stability and reliability.",
    ],
  },
  {
    company: "Truelogic Software (Zappos)",
    role: "Senior Software Engineer (Front-end focused)",
    period: "Oct 2024 – Jul 2025",
    location: "🇺🇸 United States (Remote)",
    description: [
      "Led feature enhancements for the Marty initiative at Zappos, improving user engagement across > 18M monthly visitors.",
      "Implemented personalized product recommendations, dynamic content modules, and optimized UI flows.",
      "Engineered back-end services and APIs using Node.js, Express, and AWS Lambda integrated with Zappos's product catalog, real-time inventory, and user behavior tracking.",
      "Built a real-time analytics dashboard visualizing sessions, pageviews, bounce rate (~41.5%) and KPI trends.",
      "Collaborated cross-functionally on A/B tests (predictive search, smart filtering, upsell modules) resulting in +8–12% uplift in session duration (avg ~3m45s) and ~5.6 more pages per visit.",
      "Optimized CDN caching (CloudFront / Akamai), lazy loading, and image compression to improve load times under high traffic.",
    ],
  },
  {
    company: "Tecla (OnChain Studios)",
    role: "Senior Front-end Engineer (Front-end focused)",
    period: "Oct 2023 – Jun 2024",
    location: "🇺🇸 United States (Remote)",
    link: "https://digitoys.io/collections",
    description: [
      "Integrated NFTs with Amazon API to enable commercial transactions for Cryptoys.",
      "Developed thematic web pages for major clients including Disney and Mattel.",
      "Implemented authentication solutions using Magic Link, Next.js, and React.",
      "Conducted thorough code reviews to ensure code quality and best practices.",
      "Technologies: Next.js, React, Storybook, Jest, Cypress, Magic Link API, Amazon API, Docker, CSS Animations.",
    ],
  },
  {
    company: "X-Team",
    role: "Senior Front-end Engineer",
    period: "Sep 2021 – Sep 2023",
    location: "🇦🇺 Australia (Remote)",
    description: [
      "Developed code complying with company standards and best practices.",
      "Proactively identified opportunities to improve code and app performance.",
      "Participated in peer code reviews and communicated progress to Technical Lead.",
      "Attended client and project meetings and contributed to team culture.",
    ],
  },
  {
    company: "Popstand",
    role: "Senior Front-end Developer (Front-end focused)",
    period: "May 2021 – Sep 2021",
    location: "🇺🇸 United States (Remote)",
    link: "https://br.topps.com",
    description: [
      "Developed a blockchain-based NFT web application with over 1,100 active monthly users.",
      "Maintained Firebase cloud functionality for authorization and authentication.",
      "Integrated embedded web applications with social media platforms.",
      "Created custom React hooks for data processing between Firebase and web applications.",
      "Technologies: JavaScript, React, Next.js, TypeScript, Firebase, Blockchain, CSS.",
    ],
  },
  {
    company: "iCarros",
    role: "Front-end Developer",
    period: "Mar 2020 – May 2021",
    location: "🇧🇷 Brazil",
    link: "http://icarros.com.br/",
    description: [
      "Implemented reusable micro front-end components for the 4 most accessed pages, reducing rework and time complexity.",
      "Released a web app with 12M+ unique monthly accesses.",
      "Started an internal UI kit for React based on a design system for new products.",
      "Improved accessibility and SEO metrics using Lighthouse.",
    ],
  },
  {
    company: "SENAI São Paulo",
    role: "Front-end Developer",
    period: "Dec 2017 – Feb 2020",
    location: "🇧🇷 Brazil",
    description: [
      "Implemented 3 projects for external clients end-to-end (energy efficiency, school management, and farm industry).",
      "Developed web apps using ReactJS and AngularJS for different economic sectors.",
      "Prototyped and planned system requirements using Adobe tools and agile methodologies for 4+ projects.",
      "Mentored 3+ interns through code review, pair programming, and doubt support.",
    ],
  },
  {
    company: "SENAI São Paulo",
    role: "Software Development Intern",
    period: "Mar 2017 – Nov 2017",
    location: "🇧🇷 Brazil",
    description: [
      "Worked primarily with front-end development using React.",
      "Modelled relational databases and implemented RESTful APIs with ASP.NET and SQL Server.",
      "Implemented features in mobile apps using React Native.",
    ],
  },
];

export default function Experiences() {
  const sectionRef = useRef<HTMLElement>(null);
  const { isActive } = useSectionContext();

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
        <SectionHeading>Experiences</SectionHeading>

        <div className="flex flex-col gap-3" role="list">
          {experiences.map((experience, index) => (
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
                    {experience.period}
                  </p>
                  <p
                    className="font-mono tracking-widest uppercase mt-1"
                    style={{ fontSize: "var(--text-label)", color: "#52525B" }}
                  >
                    {experience.location}
                  </p>
                </div>
                <div className="flex-1">
                  <h3
                    className="font-sans font-semibold mb-1"
                    style={{ fontSize: "var(--text-body)", color: "#F4F4F5" }}
                  >
                    {experience.link ? (
                      <a
                        href={experience.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#F4F4F5" }}
                        className="hover:underline"
                      >
                        {experience.company}
                      </a>
                    ) : (
                      experience.company
                    )}
                  </h3>
                  <p
                    className="font-mono tracking-widest uppercase mb-3"
                    style={{ fontSize: "var(--text-label)", color: "#A1A1AA" }}
                  >
                    {experience.role}
                  </p>
                  <ul className="list-disc list-outside pl-4 flex flex-col gap-1">
                    {experience.description.map((item, descriptionIndex) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}
