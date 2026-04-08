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
];
