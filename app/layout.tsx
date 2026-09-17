import type { Metadata, Viewport } from "next";
import "./globals.css";
import { company } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${company.legalName} — ${company.tagline}`,
    template: `%s | ${company.shortName}`,
  },
  description: company.descriptionShort,
  keywords: [
    "project cargo",
    "heavy lift",
    "out of gauge",
    "OOG",
    "freight forwarding",
    "multimodal logistics",
    "Middle Corridor",
    "TITR",
    "INSTC",
    "China Land Bridge",
    "Caspian",
    "Kazakhstan",
    "Almaty",
    "Atyrau",
  ],
  openGraph: {
    type: "website",
    siteName: company.legalName,
    title: `${company.legalName} — ${company.tagline}`,
    description: company.descriptionShort,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
