import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["exceljs", "nodemailer", "bcryptjs"],
  // The public quote form accepts up to 20 MB of attachments in one server
  // action; the default 1 MB limit would reject it before the action ran.
  experimental: { serverActions: { bodySizeLimit: "25mb" } },
  // Deck 11.2: 301 redirects from every current URL to its new equivalent.
  async redirects() {
    return [
      { source: "/about", destination: "/about-us", permanent: true },
      { source: "/quote", destination: "/request-a-quote", permanent: true },
      { source: "/locations", destination: "/contact", permanent: true },
      { source: "/about-us/", destination: "/about-us", permanent: true },
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
