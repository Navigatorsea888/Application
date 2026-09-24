import type { MetadataRoute } from "next";
import { corridors, industries, services } from "@/lib/content";

/** Public marketing routes. /track results and /admin are excluded deliberately. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();

  const routes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/about-us", priority: 0.8, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    ...services.map((s) => ({ path: s.path, priority: 0.9, changeFrequency: "monthly" as const })),
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
    ...industries.map((i) => ({ path: i.path, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/corridors", priority: 0.9, changeFrequency: "monthly" },
    ...corridors.map((c) => ({ path: c.path, priority: 0.8, changeFrequency: "monthly" as const })),
    { path: "/projects", priority: 0.7, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
    { path: "/insights/tools", priority: 0.7, changeFrequency: "monthly" },
    { path: "/request-a-quote", priority: 0.9, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/careers", priority: 0.5, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/track", priority: 0.6, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ];

  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
