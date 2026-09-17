import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { IconArrowRight, IconChevronDown } from "@/components/icons";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Common questions about project cargo, out-of-gauge movements, shipment tracking, quotes and the corridors Navigator Sea Land operates.",
};

export default function FaqPage() {
  // A FAQPage structured-data block so these answers can surface in search.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        lead="If your question is not here, ask it directly — we would rather answer than have you guess."
      />

      <div className="container-page py-16 lg:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-ink-200 border-y border-ink-200">
          {faqs.map((faq) => (
            // <details> gives keyboard support, find-in-page and no-JS operation
            // for free; an ARIA accordion would be more code and worse.
            <details key={faq.question} className="group py-1">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-[family-name:var(--font-display)] text-[1.0625rem] font-medium text-ink-900 transition-colors duration-150 hover:text-accent-700">
                {faq.question}
                <IconChevronDown className="mt-1 size-5 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-600">{faq.answer}</div>
            </details>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-lg border border-ink-200 bg-white px-7 py-9 text-center">
          <h2 className="text-xl">Still need an answer?</h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-600">
            Our operations teams in Almaty, Atyrau and Mumbai answer enquiries directly.{" "}
            <Link href="/track" className="text-accent-600 underline underline-offset-2">
              Tracking a shipment?
            </Link>
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact">
              Contact us
              <IconArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/quote" variant="secondary">
              Request a quote
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
