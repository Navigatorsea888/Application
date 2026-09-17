import type { Metadata } from "next";
import { ButtonLink, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { IconArrowRight, IconGlobe, IconPin } from "@/components/icons";
import { corridors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Corridors",
  description:
    "Middle Corridor (TITR), China Land Bridge, INSTC, the Caspian Sea and Central Asia — the routes Navigator Sea Land operates and the constraints that govern them.",
};

export default function CorridorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Corridors"
        title="The five corridors we operate, and what actually governs them"
        lead="Published transit times describe a corridor working. Planning one means knowing where it does not: the gauge change, the ferry window, the bridge that has not been rated since 1987."
      >
        <nav aria-label="Corridors" className="mt-8 flex flex-wrap gap-2">
          {corridors.map((corridor) => (
            <a
              key={corridor.slug}
              href={`#${corridor.slug}`}
              className="rounded-md border border-ink-300 px-3 py-1.5 text-sm text-ink-700 transition-colors duration-150 hover:border-accent-600 hover:text-accent-700"
            >
              {corridor.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-page py-16 lg:py-20">
        <div className="space-y-14">
          {corridors.map((corridor) => (
            <section key={corridor.slug} id={corridor.slug} className="scroll-mt-28">
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                  <div className="p-7 sm:p-9">
                    <p className="eyebrow">{corridor.subtitle}</p>
                    <h2 className="mt-2.5 text-2xl">{corridor.title}</h2>
                    <p className="mt-4 text-lg leading-relaxed text-ink-600">{corridor.summary}</p>
                    <div className="prose-body mt-6">
                      {corridor.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-ink-200 bg-ink-50 p-7 sm:p-9 lg:border-l lg:border-t-0">
                    <h3 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                      <IconPin className="size-4" />
                      Key points
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {corridor.keyPoints.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-sm text-ink-700">
                          <span aria-hidden className="size-1.5 rounded-full bg-accent-600" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    <h3 className="mt-7 flex items-center gap-2 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
                      <IconGlobe className="size-4" />
                      Transit
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{corridor.transitNote}</p>
                  </div>
                </div>
              </Card>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-lg bg-ink-900 px-7 py-11 text-center sm:px-12">
          <h2 className="mx-auto max-w-2xl text-2xl text-white">
            Ad hoc movements outside these corridors
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-300">
            Project work does not always stay on the main routes. We have run movements into and through
            Azerbaijan, Iran and Pakistan where a project required it, and we will assess any routing on its
            merits — including the compliance position that applies to it.
          </p>
          <div className="mt-8">
            <ButtonLink href="/contact" size="lg">
              Discuss a routing
              <IconArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
