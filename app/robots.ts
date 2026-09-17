import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Shipment records and the admin panel must never be crawled or indexed.
        disallow: ["/admin", "/admin/", "/api/", "/track?"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
