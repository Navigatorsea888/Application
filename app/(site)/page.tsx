import type { Metadata } from "next";
import Link from "next/link";
import { TrackWidget } from "@/components/track-widget";
import { Card } from "@/components/ui";
import { ContentIcon, IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, CardGrid, CtaButton } from "@/components/site/section-renderer";
import { ProcessSteps } from "@/components/site/process-steps";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { Counter } from "@/components/site/counter";
import { CorridorMap } from "@/components/site/corridor-map";
import {
  corridors,
  homeCapabilities,
  homeCorridorsIntro,
  homeExperienceHeading,
  homeHero,
  homeIndustriesHeading,
  homeIntro,
  homeMeta,
  homeUsps,
  industries,
  keyFigures,
  processSteps,
  publishedCaseStudies,
  publishedInsights,
  testimonials,
  trustStrip,
} from "@/lib/content";

export const metadata: Metadata = {
  title: homeMeta.title,
  description: homeMeta.description,
  keywords: homeMeta.keywords,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroBanner hero={homeHero} size="large" eyebrow="Project Cargo · Heavy Haul · Multimodal" aside={<TrackWidget />} />

      {/* Trust strip */}
      <section aria-label="At a glance" className="border-b border-ink-200 bg-white">
        <div className="container-page grid gap-6 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustStrip.map((item) => (
            <div key={item.title} className="flex gap-4 border-l-2 border-gold-500 pl-4">
              <div>
                <p className="font-[family-name:var(--font-display)] text-xl font-bold text-ink-900">{item.title}</p>
                <p className="mt-1 text-sm leading-snug text-ink-600">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Introduction */}
      <Band alt={false}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-[2.125rem]">{homeIntro.heading}</h2>
            <div className="mt-8 hidden lg:block">
              <CtaButton cta={homeIntro.cta} />
            </div>
          </div>
          <div className="prose-body text-[1.0625rem] leading-relaxed">
            {homeIntro.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            <div className="mt-8 lg:hidden">
              <CtaButton cta={homeIntro.cta} />
            </div>
          </div>
        </div>
      </Band>

      {/* Core capabilities */}
      <Band alt>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Core capabilities</p>
            <h2 className="mt-3 text-2xl sm:text-3xl">What We Deliver</h2>
          </div>
          <Link href="/services" className="inline-flex items-center gap-2 text-sm font-medium text-accent-700 hover:underline">
            All services
            <IconArrowRight className="size-4" />
          </Link>
        </div>
        <CardGrid items={homeCapabilities} columns={3} className="mt-10" />
      </Band>

      {/* How we deliver */}
      <Band alt={false}>
        <div className="max-w-3xl">
          <p className="eyebrow">How we deliver</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">Engineered from First Enquiry to Final Set-Down</h2>
        </div>
        <div className="mt-12">
          <ProcessSteps items={processSteps} />
        </div>
      </Band>

      {/* Strategic corridors */}
      <Band alt id="corridors">
        <div className="max-w-3xl">
          <p className="eyebrow">Strategic corridors</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">{homeCorridorsIntro.heading}</h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{homeCorridorsIntro.body}</p>
        </div>
        <div className="mt-10">
          <CorridorMap corridors={corridors.map((c) => ({ slug: c.slug, title: c.title, href: c.path, summary: c.summary }))} />
        </div>
        <div className="mt-10">
          <CtaButton cta={{ label: "View All Corridors", href: "/corridors", variant: "primary" }} />
        </div>
      </Band>

      {/* Industries */}
      <Band alt={false}>
        <div className="max-w-3xl">
          <p className="eyebrow">Industries</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">{homeIndustriesHeading}</h2>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <li key={industry.slug} className="reveal">
              <Link
                href={industry.path}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg bg-ink-900 p-6 text-white shadow-card transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span aria-hidden className="absolute -right-6 -top-6 size-28 rounded-full bg-accent-600/25 transition-transform duration-300 group-hover:scale-125" />
                <ContentIcon name={industry.icon} className="relative size-8 text-gold-300" />
                <span className="relative mt-10 block">
                  <span className="block font-[family-name:var(--font-display)] text-lg font-semibold">{industry.title}</span>
                  <span className="mt-2 block text-sm leading-snug text-ink-300">{industry.summary}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300">
                    Sector page
                    <IconArrowRight className="size-4" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li className="reveal">
            <Link
              href="/industries"
              className="flex h-full min-h-[12rem] flex-col items-center justify-center rounded-lg border-2 border-dashed border-accent-200 p-6 text-center text-accent-700 transition-colors duration-150 hover:border-accent-600 hover:bg-accent-50"
            >
              <span className="font-[family-name:var(--font-display)] font-semibold">All industries</span>
              <IconArrowRight className="mt-2 size-5" />
            </Link>
          </li>
        </ul>
        <ConfirmNote title="Industry photo tiles">
          The deck asks for one operations photo per industry tile. Tiles render with the icon treatment until photography is supplied.
        </ConfirmNote>
      </Band>

      {/* Key figures — only with verified numbers */}
      {keyFigures.verified && keyFigures.items.every((i) => typeof i.value === "number") ? (
        <section className="bg-ink-900 py-16">
          <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {keyFigures.items.map((item) => (
              <Counter key={item.label} value={item.value as number} suffix={item.suffix} label={item.label} />
            ))}
          </div>
        </section>
      ) : (
        <div className="container-page">
          <ConfirmNote title="Key figures">
            The animated counters (years, countries served, tonnes moved, projects delivered, partner agents) are hidden until verified figures
            are entered in <code className="font-mono text-xs">lib/content/company.ts → keyFigures</code> and <code className="font-mono text-xs">verified</code> is set to true.
          </ConfirmNote>
        </div>
      )}

      {/* Selected experience */}
      <Band alt>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow">Selected experience</p>
            <h2 className="mt-3 text-2xl sm:text-3xl">{homeExperienceHeading}</h2>
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-medium text-accent-700 hover:underline">
            All case studies
            <IconArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {publishedCaseStudies.slice(0, 3).map((study) => {
            const corridor = corridors.find((c) => c.slug === study.corridorSlug);
            return (
              <Card key={study.slug} className="reveal flex flex-col p-6">
                <p className="eyebrow">{study.sector}</p>
                <h3 className="mt-3 text-lg">{study.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">{study.summary}</p>
                {corridor ? (
                  <Link href={corridor.path} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
                    {corridor.title}
                    <IconArrowRight className="size-4" />
                  </Link>
                ) : null}
              </Card>
            );
          })}
        </div>
        <ConfirmNote title="Case study wording">
          These examples come from the founding team's track record. Confirm (a) which projects Navigator Sea Land Limited executed directly
          versus experience of the team at previous employers, and (b) written permission from each client/project owner before naming them.
          Cards are published anonymised, as worded in the deck.
        </ConfirmNote>
      </Band>

      {/* Why Navigator */}
      <Band alt={false}>
        <div className="max-w-3xl">
          <p className="eyebrow">Why Navigator</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">Specialist Capability with Local Control</h2>
        </div>
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

      {/* Testimonials — hidden until collected */}
      {testimonials.length > 0 ? (
        <Band alt>
          <h2 className="text-2xl sm:text-3xl">What Clients Say</h2>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="rounded-lg bg-white p-6 shadow-card">
                <p className="text-[1.0625rem] leading-relaxed text-ink-800">“{t.quote}”</p>
                <footer className="mt-4 text-sm text-ink-600">
                  <strong className="text-ink-900">{t.name}</strong>, {t.title}, {t.company}
                </footer>
              </blockquote>
            ))}
          </div>
        </Band>
      ) : (
        <div className="container-page">
          <ConfirmNote title="Testimonials">
            Collect 2–3 short client testimonials (name, title, company, permission). The section is hidden until they are added in{" "}
            <code className="font-mono text-xs">lib/content/company.ts → testimonials</code>.
          </ConfirmNote>
        </div>
      )}

      {/* Latest insights — the three latest published posts */}
      {publishedInsights.length > 0 ? (
        <Band alt>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="text-2xl sm:text-3xl">Latest Insights</h2>
            <Link href="/insights" className="inline-flex items-center gap-2 text-sm font-medium text-accent-700 hover:underline">
              All insights
              <IconArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {publishedInsights.slice(0, 3).map((post) => (
              <Card key={post.title} className="reveal p-6 surface-hover">
                <p className="eyebrow">{post.category}</p>
                <h3 className="mt-3 text-lg">
                  <Link href={post.href!}>
                    <span className="absolute inset-0" aria-hidden />
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? <p className="mt-2 text-sm text-ink-600">{post.excerpt}</p> : null}
              </Card>
            ))}
          </div>
        </Band>
      ) : null}

      <ClosingCta />
    </>
  );
}
