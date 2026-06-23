import { experiencesEnabled } from "./featureFlags";

const BASE_KEYS = ["aboutMe", "projects", "experiences", "education", "contact"] as const;

export type NavKey = (typeof BASE_KEYS)[number];

export const NAV_ITEMS: ReadonlyArray<{ key: NavKey; index: number }> = BASE_KEYS
  .filter((key) => key !== "experiences" || experiencesEnabled)
  .map((key, i) => ({ key, index: i + 1 }));
