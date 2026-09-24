import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { IconCheck, IconPhone } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { company, quoteHero, quoteMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: quoteMeta.title,
  description: quoteMeta.description,
  keywords: quoteMeta.keywords,
  alternates: { canonical: "/request-a-quote" },
};

interface Props {
  searchParams: Promise<{ service?: string }>;
}

export default async function QuotePage({ searchParams }: Props) {
  const { service } = await searchParams;

  return (
    <>
      <HeroBanner hero={quoteHero} crumbs={[{ label: "Request a Quote", href: "/request-a-quote" }]} eyebrow="Request a Quote" />

      <div className="container-page py-14 lg:py-20" id="quote-form">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Card className="p-6 sm:p-8">
            <QuoteWizard defaultServiceType={service} />
          </Card>

          <aside className="space-y-5 lg:pt-1">
            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                What happens next
              </h2>
              <ol className="mt-5 space-y-4">
                {[
                  ["We acknowledge", "You receive a reference number immediately and a Navigator specialist contacts you within one business day."],
                  ["We assess", "Engineers check the cargo against the route: gauge, axle loads, vessel capacity, permit lead times and compliance."],
                  ["We quote", "A transparent, itemised quotation with defined inclusions, exclusions and validity — and what remains to be confirmed."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold-500 font-[family-name:var(--font-display)] text-xs font-bold text-ink-900">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-ink-900">{title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-600">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>

            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                Helps us quote faster
              </h2>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Dimensional drawings or a general arrangement",
                  "Weight and centre of gravity per piece",
                  "Lifting and lashing points",
                  "Safety Data Sheet and UN number for dangerous goods",
                  "Site access details at destination",
                  "Cargo ready date and required delivery date",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                    <IconCheck className="mt-0.5 size-4 shrink-0 text-accent-700" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">Attach files on step 6 of the form (drawings, packing list, SDS, photos — up to 20 MB).</p>
            </Card>

            <Card className="bg-ink-900 p-6 text-white">
              <p className="eyebrow text-gold-300">Urgent cargo?</p>
              <p className="mt-2 text-sm text-ink-200">Our operations desk is reachable around the clock for urgent spares, border holds and time-critical moves.</p>
              <a href={company.emergencyPhoneHref} className="mt-3 inline-flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold text-gold-300 hover:text-gold-100">
                <IconPhone className="size-4" />
                {company.emergencyPhone}
              </a>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
