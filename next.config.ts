import type { NextConfig } from "next";

// PostHog ingestion is proxied through this origin at /ingest so analytics
// requests are first-party. The hosts come from the same env the browser uses.
const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com").replace(/\/$/, "");
const posthogAssetsHost = posthogHost.replace(".i.posthog.com", "-assets.i.posthog.com");

const config: NextConfig = {
  reactStrictMode: true,
  // PostHog's API paths end with a slash; without this Next would redirect them.
  skipTrailingSlashRedirect: true,
  poweredByHeader: false,
  serverExternalPackages: ["exceljs", "nodemailer", "bcryptjs"],
  // The public quote form accepts up to 20 MB of attachments in one server
  // action; the default 1 MB limit would reject it before the action ran.
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssetsHost}/static/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  // Deck 11.2: 301 redirects from every current URL to its new equivalent.
  async redirects() {
    return [
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/quote", destination: "/request-a-quote", permanent: true },
      { source: "/locations", destination: "/contact", permanent: true },
      { source: "/about-us/", destination: "/about-us", permanent: true },
      { source: "/corridors/south-asia-khunjerab", destination: "/corridors", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default config;
