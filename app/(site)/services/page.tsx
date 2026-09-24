import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { ContentIcon, IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ProcessSteps } from "@/components/site/process-steps";
import { homeUsps, processSteps, services, servicesLanding } from "@/lib/content";

export const metadata: Metadata = {
  title: servicesLanding.meta.title,
  description: servicesLanding.meta.description,
  keywords: servicesLanding.meta.keywords,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <HeroBanner hero={servicesLanding.hero} crumbs={[{ label: "Services", href: "/services" }]} eyebrow="Services" />

      <Band alt={false}>
        <h2 className="text-2xl sm:text-3xl">Ten Services, One Accountable Team</h2>
        <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">
          Most complex movements need several of these in sequence — a heavy haul leg, a Caspian crossing, customs at two borders and a
          laydown yard at the end. Each service page explains what we do and how; the quote form lets you ask for any combination.
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <li key={service.slug}>
              <Card className="reveal flex h-full flex-col p-6 surface-hover">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-md bg-accent-50 text-accent-700">
                    <ContentIcon name={service.icon} className="size-6" />
                  </span>
                  {service.isNew ? (
                    <span className="rounded bg-gold-500 px-2 py-0.5 font-[family-name:var(--font-display)] text-[0.625rem] font-bold uppercase tracking-wide text-ink-900">
                      New
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-5 text-lg">
                  <Link href={service.path} className="hover:text-accent-700">
                    <span className="absolute inset-0" aria-hidden />
                    {service.title}
                  </Link>
                </h3>
                <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">{service.summary}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
                  Learn more
                  <IconArrowRight className="size-4" />
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </Band>

      <Band alt>
        <div className="max-w-3xl">
          <p className="eyebrow">How we deliver</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">Engineered from First Enquiry to Final Set-Down</h2>
        </div>
        <div className="mt-12">
          <ProcessSteps items={processSteps} />
        </div>
      </Band>

      <Band alt={false}>
        <h2 className="text-2xl sm:text-3xl">Why Navigator</h2>
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

      <ClosingCta />
    </>
  );
}
