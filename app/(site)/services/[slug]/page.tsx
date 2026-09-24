import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui";
import { ContentIcon, IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, RelatedLinks, SectionRenderer } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { JsonLd, serviceJsonLd } from "@/components/site/json-ld";
import { corridors, findService, homeUsps, publishedCaseStudies, services } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return {};
  return {
    title: service.meta.title,
    description: service.meta.description,
    keywords: service.meta.keywords,
    alternates: { canonical: service.path },
    openGraph: { title: service.meta.title, description: service.meta.description, url: service.path },
  };
}

/**
 * Service page template (deck 5B): Hero → Introduction → Detailed content →
 * Equipment/features grid → Why Navigator → Case study spotlight → FAQ →
 * Closing CTA strip. Page-specific blocks come from the content module; the
 * template supplies "Why Navigator" (when the page has no section of its own),
 * the case-study spotlight, related links and the closing strip.
 */
export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  const closingIndex = service.blocks.findIndex((b) => b.type === "closing");
  const before = closingIndex === -1 ? service.blocks : service.blocks.slice(0, closingIndex);
  const after = closingIndex === -1 ? [] : service.blocks.slice(closingIndex);
  const hasOwnWhy = service.blocks.some((b) => b.type !== "confirm" && b.type !== "closing" && b.id === "why-navigator");
  const spotlight = publishedCaseStudies.find((c) => c.serviceSlugs.includes(service.slug));
  const spotlightCorridor = spotlight ? corridors.find((c) => c.slug === spotlight.corridorSlug) : undefined;

  // Alternation continues across the template's own sections.
  const bandsBefore = before.filter((b) => b.type !== "confirm").length;
  let band = bandsBefore;
  const nextAlt = () => {
    const alt = band % 2 === 1;
    band += 1;
    return alt;
  };

  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      <HeroBanner
        hero={service.hero}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.title, href: service.path },
        ]}
        eyebrow={service.isNew ? "Services · New" : "Services"}
      />
      {service.hero.image ? (
        <div className="container-page">
          <ConfirmNote title="Hero image">
            [IMG] {service.hero.image.instruction} — suggested alt text: “{service.hero.image.alt}”.
          </ConfirmNote>
        </div>
      ) : null}

      <SectionRenderer blocks={before} />

      {!hasOwnWhy ? (
        <Band alt={nextAlt()}>
          <h2 className="text-2xl sm:text-3xl">Why Navigator</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homeUsps.map((usp) => (
              <div key={usp.title} className="reveal rounded-lg border-t-4 border-gold-500 bg-white p-6 shadow-card">
                <ContentIcon name={usp.icon} className="size-7 text-accent-700" />
                <h3 className="mt-4 text-base font-semibold">{usp.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{usp.body}</p>
              </div>
            ))}
          </div>
        </Band>
      ) : null}

      {spotlight ? (
        <Band alt={nextAlt()}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
            <div>
              <p className="eyebrow">Case study spotlight</p>
              <h2 className="mt-3 text-2xl sm:text-3xl">Proven on a Comparable Move</h2>
              <Link href="/projects" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
                All case studies
                <IconArrowRight className="size-4" />
              </Link>
            </div>
            <Card className="p-7">
              <p className="eyebrow">{spotlight.sector}</p>
              <h3 className="mt-3 text-xl">{spotlight.title}</h3>
              <p className="mt-3 text-[1.0625rem] leading-relaxed text-ink-700">{spotlight.summary}</p>
              {spotlightCorridor ? (
                <p className="mt-4 text-sm text-ink-600">
                  Corridor:{" "}
                  <Link href={spotlightCorridor.path} className="font-medium text-accent-700 hover:underline">
                    {spotlightCorridor.title}
                  </Link>
                </p>
              ) : null}
            </Card>
          </div>
        </Band>
      ) : null}

      <Band alt={nextAlt()}>
        <RelatedLinks links={service.related} heading="Related Services, Industries and Corridors" />
      </Band>

      {after.length > 0 ? <SectionRenderer blocks={after} startBand={(band % 2) as 0 | 1} /> : <ClosingCta />}
    </>
  );
}
