export type TalkItem = {
  slug: string;
  images: string[];
  tags: string[];
};

export const TALKS_STATIC: TalkItem[] = [
  {
    slug: "demo-night-sao-paulo",
    images: [
      "/events/demo-night-sao-paulo/1.webp",
      "/events/demo-night-sao-paulo/2.webp",
      "/events/demo-night-sao-paulo/3.webp",
      "/events/demo-night-sao-paulo/4.webp",
    ],
    tags: ["AI Agents", "MCP", "RAG", "Cost Control", "Analytics"],
  },
];
