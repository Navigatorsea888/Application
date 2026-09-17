import type { Metadata } from "next";
import { Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { QuoteForm } from "@/components/quote-form";
import { IconCheck } from "@/components/icons";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Request a quotation for project cargo, out-of-gauge or heavy-lift transport across Central Asia, the Caspian, the Middle Corridor, the China Land Bridge and the INSTC.",
};

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Request a quote"
        title="Tell us about the cargo"
        lead="Project movements are priced from the cargo outwards. The more you can tell us about dimensions, weight and the delivery window, the more accurate — and faster — the quotation."
      />

      <div className="container-page py-14 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <Card className="p-6 sm:p-8">
            <QuoteForm />
          </Card>

          <aside className="space-y-5 lg:pt-1">
            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                What happens next
              </h2>
              <ol className="mt-5 space-y-4">
                {[
                  ["We acknowledge", "You receive a reference number immediately and an acknowledgement from an operations contact."],
                  ["We assess", "We check the cargo against the route: gauge, axle loads, ferry capacity, permit lead times."],
                  ["We quote", "You get a written quotation setting out the routing, the assumptions behind it and what remains to be confirmed."],
                ].map(([title, body], index) => (
                  <li key={title} className="flex gap-3">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-accent-50 font-[family-name:var(--font-mono)] text-xs font-medium text-accent-700">
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
                  "Site access details at destination",
                  "Your required on-site date",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                    <IconCheck className="mt-0.5 size-4 shrink-0 text-accent-600" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-500">
                Send drawings by email once we acknowledge your enquiry — this form does not accept attachments.
              </p>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
