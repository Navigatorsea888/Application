import type { Metadata } from "next";
import Link from "next/link";
import { ContentIcon, IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { industries, industriesLanding } from "@/lib/content";

export const metadata: Metadata = {
  title: industriesLanding.meta.title,
  description: industriesLanding.meta.description,
  keywords: industriesLanding.meta.keywords,
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <HeroBanner hero={industriesLanding.hero} crumbs={[{ label: "Industries", href: "/industries" }]} eyebrow="Industries" />

      <Band alt={false}>
        <h2 className="text-2xl sm:text-3xl">Seven Sectors We Serve</h2>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <li key={industry.slug} className="reveal">
              <Link
                href={industry.path}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg bg-ink-900 p-7 text-white shadow-card transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-accent-600/25 transition-transform duration-300 group-hover:scale-125" />
                <ContentIcon name={industry.icon} className="relative size-9 text-gold-300" />
                <span className="relative mt-8 block font-[family-name:var(--font-display)] text-xl font-semibold">{industry.title}</span>
                <span className="relative mt-2 block flex-1 text-sm leading-relaxed text-ink-300">{industry.hero.lead}</span>
                <span className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                  Sector page
                  <IconArrowRight className="size-4" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <ConfirmNote title="Industry photo tiles">
          The deck asks for one operations photo per industry tile (e.g. “transformer on hydraulic modular trailer, Atyrau region”). Tiles use
          the icon treatment until photography is supplied.
        </ConfirmNote>
      </Band>

      <ClosingCta />
    </>
  );
}
