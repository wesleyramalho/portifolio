import type { MetadataRoute } from "next";
import { experiencesEnabled } from "@/lib/featureFlags";

const SITE_URL = "https://wesleyramalho.com";

const ROUTES = [
  "",
  "/about",
  "/projects",
  ...(experiencesEnabled ? ["/experiences"] : []),
  "/education",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
