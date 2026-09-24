import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { ContentIcon, IconArrowRight, IconDownload, IconMail } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, CardGrid } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { departments, downloads, insightTopics, insightsLanding, publishedInsights, tools } from "@/lib/content";

export const metadata: Metadata = {
  title: insightsLanding.meta.title,
  description: insightsLanding.meta.description,
  keywords: insightsLanding.meta.keywords,
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const quotesEmail = departments.find((d) => d.key === "quotes")?.email ?? "";
  const pendingTopics = insightTopics.filter((t) => !t.href);

  return (
    <>
      <HeroBanner hero={insightsLanding.hero} crumbs={[{ label: "Insights", href: "/insights" }]} eyebrow="Insights" />

      <Band alt={false} id="news">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl">News & Corridor Updates</h2>
        </div>

        {publishedInsights.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publishedInsights.map((post) => (
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
        ) : null}

        {pendingTopics.length > 0 ? (
          <div className="mt-8">
            <p className="max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">
              Our corridor and customs updates are written by the people who run the movements. The first articles are in preparation and
              will cover:
            </p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {pendingTopics.map((topic) => (
                <li key={topic.title} className="flex gap-3 rounded-lg border border-ink-200 bg-white px-4 py-3.5 shadow-card">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-gold-500" aria-hidden />
                  <span>
                    <span className="block text-[0.9375rem] font-medium text-ink-900">{topic.title}</span>
                    <span className="mt-0.5 block text-xs uppercase tracking-wide text-ink-500">{topic.category} · in preparation</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Band>

      <Band alt id="tools">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-2xl sm:text-3xl">Tools</h2>
          <Link href="/insights/tools" className="inline-flex items-center gap-2 text-sm font-medium text-accent-700 hover:underline">
            Open all tools
            <IconArrowRight className="size-4" />
          </Link>
        </div>
        <CardGrid items={tools.map((t) => ({ title: t.title, body: t.body, icon: t.icon, href: t.href }))} columns={4} className="mt-10" />
      </Band>

      <Band alt={false} id="downloads">
        <h2 className="text-2xl sm:text-3xl">Downloads</h2>
        <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">
          Company documents for tenders, pre-qualification and procurement files. Where a document is not yet available online, request it by
          email and we will send it the same business day.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {downloads.map((item) => (
            <li key={item.title} className="flex items-start justify-between gap-4 rounded-lg border border-ink-200 bg-white p-5 shadow-card">
              <div className="flex gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-md bg-accent-50 text-accent-700">
                  <ContentIcon name="file" className="size-6" />
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] font-semibold text-ink-900">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-600">{item.description}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-500">PDF · {item.languages}</p>
                </div>
              </div>
              {item.href ? (
                <a
                  href={item.href}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md bg-gold-500 px-3.5 text-sm font-medium text-ink-900 hover:bg-gold-600"
                  download
                >
                  <IconDownload className="size-4" />
                  Download
                </a>
              ) : (
                <a
                  href={`mailto:${quotesEmail}?subject=${encodeURIComponent(`Request: ${item.title}`)}`}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md border border-ink-300 px-3.5 text-sm font-medium text-ink-800 hover:bg-ink-100"
                >
                  <IconMail className="size-4" />
                  Request
                </a>
              )}
            </li>
          ))}
        </ul>
        <ConfirmNote title="Downloads">
          No PDFs were supplied with the copy deck. Each item is offered by email until the file is added (set <code className="font-mono text-xs">href</code> in{" "}
          <code className="font-mono text-xs">lib/content/insights.ts → downloads</code>). The header “Company Profile” button links here.
        </ConfirmNote>
      </Band>

      <ClosingCta />
    </>
  );
}
