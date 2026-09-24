import { company, offices } from "@/lib/content";
import type { FaqItem, ServicePage } from "@/lib/content";

/**
 * Schema.org helpers (deck 11.2): Organization + LocalBusiness per office,
 * Service per service page, FAQPage wherever a FAQ renders, BreadcrumbList on
 * interior pages.
 */

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function organizationJsonLd(): Record<string, unknown> {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: company.legalName,
        alternateName: company.shortName,
        url: base,
        slogan: company.tagline,
        description: company.descriptionShort,
        telephone: company.phone,
        email: company.email,
        areaServed: [
          "Kazakhstan",
          "Uzbekistan",
          "Kyrgyzstan",
          "Tajikistan",
          "Turkmenistan",
          "Azerbaijan",
          "Georgia",
          "Türkiye",
          "China",
          "Iran",
          "Pakistan",
          "India",
          "United Arab Emirates",
          "Europe",
        ],
        sameAs: [company.social.linkedin, company.social.youtube].filter(Boolean),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: company.phone,
            contactType: "sales",
            availableLanguage: company.languages,
          },
          {
            "@type": "ContactPoint",
            telephone: company.emergencyPhone,
            contactType: "emergency",
            hoursAvailable: "Mo-Su 00:00-24:00",
            availableLanguage: company.languages,
          },
        ],
      },
      ...offices.map((office) => ({
        "@type": "LocalBusiness",
        "@id": `${base}/#office-${office.key.toLowerCase()}`,
        parentOrganization: { "@id": `${base}/#organization` },
        name: `${company.legalName} — ${office.city}`,
        description: office.description,
        telephone: office.phoneHref ? office.phone : company.phone,
        email: office.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: office.city,
          addressCountry: "KZ",
        },
        geo: { "@type": "GeoCoordinates", latitude: office.geo.lat, longitude: office.geo.lng },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "18:00",
        },
      })),
    ],
  };
}

export function serviceJsonLd(service: ServicePage): Record<string, unknown> {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.meta.description,
    url: `${base}${service.path}`,
    serviceType: service.title,
    provider: { "@id": `${base}/#organization` },
    areaServed: "Central Asia, Caspian region, China, Middle East, South Asia, Europe",
  };
}

export function faqJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ label: string; href: string }>): Record<string, unknown> {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${base}${item.href}`,
    })),
  };
}
