export type ProjectItem = {
  slug: string;
  images: string[];
  technologies: string[];
  links: { url: string; label: string }[];
  status: "live" | "archived";
  github?: string;
};

export const PROJECTS_STATIC: ProjectItem[] = [
  {
    slug: "mypdfcv",
    images: [
      "/projects/mypdfcv/1.jpeg",
      "/projects/mypdfcv/2.jpeg",
      "/projects/mypdfcv/3.jpeg",
    ],
    technologies: ["Next.js", "Tailwind CSS", "TypeScript", "React PDF", "Transformers.js"],
    links: [{ url: "https://mypdfcv.com", label: "mypdfcv.com" }],
    status: "live",
  },
  {
    slug: "icarros",
    images: [
      "/projects/icarros/1.png",
      "/projects/icarros/2.png",
    ],
    technologies: ["React", "JavaScript", "Java"],
    links: [{ url: "https://icarros.com.br", label: "icarros.com.br" }],
    status: "live",
  },
  {
    slug: "zappos",
    images: [
      "/projects/zappos/1.png",
      "/projects/zappos/2.png",
      "/projects/zappos/3.png",
      "/projects/zappos/4.png",
    ],
    technologies: ["React", "Node.js", "AWS Lambda", "TypeScript", "CloudFront"],
    links: [{ url: "https://www.zappos.com", label: "zappos.com" }],
    status: "live",
  },
  {
    slug: "digitoys",
    images: [
      "/projects/digitoys/1.png",
      "/projects/digitoys/2.png",
      "/projects/digitoys/3.png",
      "/projects/digitoys/4.png",
      "/projects/digitoys/5.png",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Magic Link", "Amazon API", "Storybook", "Cypress"],
    links: [{ url: "https://digitoys.io", label: "digitoys.io" }],
    status: "live",
  },
];
