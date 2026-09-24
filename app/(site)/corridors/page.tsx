import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { CorridorMap } from "@/components/site/corridor-map";
import { corridors, corridorsLanding } from "@/lib/content";

export const metadata: Metadata = {
  title: corridorsLanding.meta.title,
  description: corridorsLanding.meta.description,
  keywords: corridorsLanding.meta.keywords,
  alternates: { canonical: "/corridors" },
};

export default function CorridorsPage() {
  return (
    <>
      <HeroBanner hero={corridorsLanding.hero} crumbs={[{ label: "Corridors", href: "/corridors" }]} eyebrow="Corridors & Network" />

      <Band alt={false}>
        <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">{corridorsLanding.intro}</p>
        <div className="mt-10">
          <CorridorMap corridors={corridors.map((c) => ({ slug: c.slug, title: c.title, href: c.path, summary: c.summary }))} />
        </div>
      </Band>

      <Band alt id="compare">
        <h2 className="text-2xl sm:text-3xl">Six Corridors Compared</h2>
        <div className="mt-8 overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-card">
          <table className="w-full min-w-[44rem] border-collapse text-left text-[0.9375rem]">
            <caption className="sr-only">Corridor routes and what each is best for</caption>
            <thead>
              <tr className="bg-ink-900 text-white">
                {["Corridor", "Route", "Best for"].map((column) => (
                  <th key={column} scope="col" className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold uppercase tracking-[0.08em]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-200">
              {corridors.map((corridor) => (
                <tr key={corridor.slug} className="odd:bg-white even:bg-ink-50">
                  <th scope="row" className="px-5 py-4 align-top font-semibold text-ink-900">
                    <Link href={corridor.path} className="inline-flex items-center gap-1.5 hover:text-accent-700">
                      {corridor.title}
                      <IconArrowRight className="size-4 text-accent-600" />
                    </Link>
                  </th>
                  <td className="px-5 py-4 align-top leading-relaxed text-ink-700">{corridor.route}</td>
                  <td className="px-5 py-4 align-top leading-relaxed text-ink-700">{corridor.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-600">{corridorsLanding.transitNote}</p>
        <ConfirmNote title="Transit times">
          Publish transit-time ranges only after internal validation; corridor performance changes frequently. Each corridor page shows a
          “last reviewed” date. Add validated ranges to the corridor content module when ready.
        </ConfirmNote>
      </Band>

      <ClosingCta />
    </>
  );
}
