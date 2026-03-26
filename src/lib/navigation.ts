export const NAV_ITEMS = [
  { key: "aboutMe", index: 1 },
  { key: "experiences", index: 2 },
  { key: "projects", index: 3 },
  { key: "education", index: 4 },
  { key: "contact", index: 5 },
] as const;

export type NavKey = (typeof NAV_ITEMS)[number]["key"];
