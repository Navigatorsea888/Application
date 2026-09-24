import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, RelatedLinks, SectionRenderer } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { CorridorMap } from "@/components/site/corridor-map";
import { corridors, corridorsLanding, findCorridor } from "@/lib/content";
import { formatDate } from "@/lib/format";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return corridors.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const corridor = findCorridor(slug);
  if (!corridor) return {};
  return {
    title: corridor.meta.title,
    description: corridor.meta.description,
    keywords: corridor.meta.keywords,
    alternates: { canonical: corridor.path },
    openGraph: { title: corridor.meta.title, description: corridor.meta.description, url: corridor.path },
  };
}

/**
 * Corridor sub-page (deck 7): route map, key facts, border points, suitable
 * cargo, documentation, advantages and constraints, quote CTA. Transit-time
 * ranges appear only once validated; a "last reviewed" date is always shown.
 */
export default async function CorridorPage({ params }: Props) {
  const { slug } = await params;
  const corridor = findCorridor(slug);
  if (!corridor) notFound();

  return (
    <>
      <HeroBanner
        hero={corridor.hero}
        crumbs={[
          { label: "Corridors", href: "/corridors" },
          { label: corridor.title, href: corridor.path },
        ]}
        eyebrow="Corridors & Network"
      />

      <Band alt={false}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <div className="self-start rounded-lg bg-ink-900 p-7 text-white shadow-card">
          <dl className="grid gap-5">
            <div>
              <dt className="eyebrow text-gold-300">Route</dt>
              <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-200">{corridor.route}</dd>
            </div>
            <div>
              <dt className="eyebrow text-gold-300">Best for</dt>
              <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-200">{corridor.bestFor}</dd>
            </div>
            <div>
              <dt className="eyebrow text-gold-300">Border points & gateways</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {corridor.borderPoints.map((point) => (
                  <span key={point} className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-xs text-white">
                    {point}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-gold-300">Transit time</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-300">{corridorsLanding.transitNote}</dd>
            </div>
          </dl>
            <p className="mt-5 border-t border-white/15 pt-4 text-xs text-ink-300">
              Operational detail last reviewed {formatDate(corridor.reviewedOn)}.
            </p>
          </div>
          <div>
            <CorridorMap
              corridors={corridors.map((c) => ({ slug: c.slug, title: c.title, href: c.path, summary: c.summary }))}
              activeSlug={corridor.slug}
            />
          </div>
        </div>
      </Band>

      <SectionRenderer blocks={corridor.blocks} startBand={1} />

      <Band alt={(corridor.blocks.length + 1) % 2 === 1}>
        <RelatedLinks links={corridor.related} heading="Services and Industries on This Corridor" />
      </Band>

      <ClosingCta />
    </>
  );
}
