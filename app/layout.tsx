import type { Metadata, Viewport } from "next";
import "./globals.css";
import { company, homeMeta } from "@/lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Pages carry the full meta title from the copy deck (brand suffix
  // included), so the template adds nothing.
  title: { default: homeMeta.title, template: "%s" },
  description: homeMeta.description,
  keywords: homeMeta.keywords,
  applicationName: company.legalName,
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: homeMeta.title,
    description: homeMeta.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  // hreflang: RU and KZ versions follow (deck 11.2). Add them here when live.
  alternates: { languages: { en: "/" } },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b2545",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Montserrat for headings, Inter for body — both with Cyrillic subsets for the RU/KZ versions. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
