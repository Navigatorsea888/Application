import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, RelatedLinks, SectionRenderer } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { findIndustry, industries } from "@/lib/content";
import type { Block } from "@/lib/content";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) return {};
  return {
    title: industry.meta.title,
    description: industry.meta.description,
    keywords: industry.meta.keywords,
    alternates: { canonical: industry.path },
    openGraph: { title: industry.meta.title, description: industry.meta.description, url: industry.path },
  };
}

/** Industry page (deck 6): Hero → intro → Cargo we move → How we help → related → closing. */
export default async function IndustryPage({ params }: Props) {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) notFound();

  const [intro, ...rest] = industry.blocks;
  const cargoBlock: Block = {
    type: "tags",
    heading: "Cargo We Move",
    items: industry.cargo
      .replace(/\.$/, "")
      .split(/,\s*|;\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
  };
  const blocks: Block[] = [intro, cargoBlock, ...rest];

  return (
    <>
      <HeroBanner
        hero={industry.hero}
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.title, href: industry.path },
        ]}
        eyebrow="Industries"
      />
      <SectionRenderer blocks={blocks} />
      <Band alt={blocks.length % 2 === 1}>
        <RelatedLinks links={industry.related} heading="Relevant Services and Corridors" />
      </Band>
      <ClosingCta />
    </>
  );
}
