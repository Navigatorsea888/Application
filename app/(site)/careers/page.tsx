import type { Metadata } from "next";
import { Card, ButtonLink } from "@/components/ui";
import { ContentIcon, IconArrowRight, IconMail } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { about, careers, careersMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: careersMeta.title,
  description: careersMeta.description,
  keywords: careersMeta.keywords,
  alternates: { canonical: "/careers" },
};

const ROLES = [
  { title: "Project engineers", body: "Route surveys, method statements and load engineering for OOG and heavy-lift moves.", icon: "gauge" },
  { title: "Operations coordinators", body: "Carriers, wagons, vessels and borders — keeping every leg of a movement on plan.", icon: "route" },
  { title: "Customs specialists", body: "EAEU classification, transit regimes, temporary import and dangerous-goods documentation.", icon: "document" },
  { title: "Commercial professionals", body: "Quotations, tenders and long-term client relationships across the corridors we serve.", icon: "briefcase" },
] as const;

export default function CareersPage() {
  return (
    <>
      <HeroBanner
        hero={{
          title: careers.heading,
          lead: "Real projects that shape Central Asia's energy and infrastructure, in a growing, founder-led company where your ideas are heard.",
          ctas: [{ label: "Send Your CV", href: `mailto:${careers.email}?subject=${encodeURIComponent("Application — Navigator Sea Land Limited")}`, variant: "gold" }],
        }}
        crumbs={[
          { label: "Contact", href: "/contact" },
          { label: "Careers", href: "/careers" },
        ]}
        eyebrow="Careers"
      />

      <Band alt={false}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl sm:text-3xl">Work on What Matters</h2>
            <p className="mt-5 text-[1.0625rem] leading-relaxed text-ink-700">{careers.body}</p>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {ROLES.map((role) => (
              <li key={role.title} className="flex gap-4 rounded-lg border border-ink-200 bg-white p-5 shadow-card">
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent-50 text-accent-700">
                  <ContentIcon name={role.icon} className="size-5" />
                </span>
                <div>
                  <p className="font-[family-name:var(--font-display)] font-semibold text-ink-900">{role.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{role.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <Band alt id="open-positions">
        <h2 className="text-2xl sm:text-3xl">Open Positions</h2>
        {careers.openPositions.length > 0 ? (
          <ul className="mt-8 grid gap-4">
            {careers.openPositions.map((role) => (
              <li key={role.title}>
                <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
                  <div>
                    <p className="font-[family-name:var(--font-display)] text-lg font-semibold">{role.title}</p>
                    <p className="mt-1 text-sm text-ink-600">
                      {role.location} · {role.type}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">{role.summary}</p>
                  </div>
                  <ButtonLink href={`mailto:${careers.email}?subject=${encodeURIComponent(`Application: ${role.title}`)}`} variant="gold">
                    Apply
                    <IconArrowRight className="size-4" />
                  </ButtonLink>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">
            There are no advertised vacancies at the moment. We are always interested in hearing from experienced people with CIS corridor
            experience.
          </p>
        )}
        <div className="mt-8 rounded-lg border border-ink-200 bg-white p-6 shadow-card">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink-900">{careers.cvPrompt}</p>
          <a href={`mailto:${careers.email}`} className="mt-2 inline-flex items-center gap-2 text-[1.0625rem] font-medium text-accent-700 hover:underline">
            <IconMail className="size-5" />
            {careers.email}
          </a>
          <ConfirmNote title="Careers mailbox">Confirm the careers@ mailbox exists and is monitored.</ConfirmNote>
        </div>
      </Band>

      <Band alt={false}>
        <h2 className="text-2xl sm:text-3xl">Our Values</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {about.values.map((value) => (
            <li key={value.title} className="rounded-lg border-t-4 border-gold-500 bg-white p-6 shadow-card">
              <ContentIcon name={value.icon} className="size-6 text-accent-700" />
              <p className="mt-3 font-[family-name:var(--font-display)] font-semibold">{value.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{value.body}</p>
            </li>
          ))}
        </ul>
      </Band>

      <ClosingCta />
    </>
  );
}
