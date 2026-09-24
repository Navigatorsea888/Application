import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { Faq } from "@/components/site/faq";
import { faqMeta, generalFaqs, trackingFaqs } from "@/lib/content";

export const metadata: Metadata = {
  title: faqMeta.title,
  description: faqMeta.description,
  keywords: faqMeta.keywords,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <HeroBanner
        hero={{
          title: "Frequently Asked Questions",
          lead: "If your question is not here, ask it directly — we would rather answer than have you guess.",
          ctas: [
            { label: "Contact Us", href: "/contact", variant: "gold" },
            { label: "Request a Quote", href: "/request-a-quote", variant: "onDark" },
          ],
        }}
        crumbs={[{ label: "FAQ", href: "/faq" }]}
        eyebrow="FAQ"
      />

      <Band alt={false} id="general">
        <div className="max-w-3xl">
          <Faq items={generalFaqs} heading="About Navigator Sea Land" />
        </div>
      </Band>

      <Band alt id="tracking">
        <div className="max-w-3xl">
          <Faq items={trackingFaqs} heading="Quotes and Shipment Tracking" />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/track" variant="primary">
              Track a shipment
              <IconArrowRight className="size-4" />
            </ButtonLink>
            <Link href="/insights/tools" className="inline-flex items-center gap-1.5 self-center text-sm font-medium text-accent-700 hover:underline">
              Planning tools: CBM, OOG pre-check, Incoterms
            </Link>
          </div>
        </div>
      </Band>

      <ClosingCta />
    </>
  );
}
