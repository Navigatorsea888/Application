import type { Metadata } from "next";
import Link from "next/link";
import { Card, ButtonLink } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { IconClock, IconExternal, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { Faq } from "@/components/site/faq";
import { company, confirmedOr, contactHero, contactMeta, departments, generalFaqs, isConfirmed, offices, operationsDesk } from "@/lib/content";

export const metadata: Metadata = {
  title: contactMeta.title,
  description: contactMeta.description,
  keywords: contactMeta.keywords,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <HeroBanner hero={contactHero} crumbs={[{ label: "Contact", href: "/contact" }]} eyebrow="Contact" />

      <Band alt={false} id="message">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl">Send Us a Message</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-600">
              For a transport quotation, the{" "}
              <Link href="/request-a-quote" className="font-medium text-accent-700 underline underline-offset-2">
                quote form
              </Link>{" "}
              captures dimensions, weights and route and gets a faster answer. Tracking a shipment? Quote the Tracking ID.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </Card>

          <aside className="space-y-5">
            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                Direct lines
              </h2>
              <a href={company.phoneHref} className="mt-4 flex items-center gap-2.5 text-[1.0625rem] font-medium text-ink-900 hover:text-accent-700">
                <IconPhone className="size-4 shrink-0 text-accent-700" />
                {company.phone}
              </a>
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex items-center gap-2.5 text-[0.9375rem] text-ink-800 hover:text-accent-700"
              >
                <IconWhatsApp className="size-4 shrink-0 text-accent-700" />
                WhatsApp
                <IconExternal className="size-3.5 text-ink-400" />
              </a>
              <a href={`mailto:${company.email}`} className="mt-2.5 flex items-center gap-2.5 break-all text-[0.9375rem] text-ink-800 hover:text-accent-700">
                <IconMail className="size-4 shrink-0 text-accent-700" />
                {company.email}
              </a>
            </Card>

            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                Department emails
              </h2>
              <ul className="mt-4 space-y-2.5">
                {departments.map((dept) => (
                  <li key={dept.key} className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                    <span className="text-ink-600">{dept.label}</span>
                    <a href={`mailto:${dept.email}`} className="font-medium text-accent-700 hover:underline">
                      {dept.email}
                    </a>
                  </li>
                ))}
              </ul>
              <ConfirmNote title="Mailboxes">Confirm the quotes@, projects@, operations@ and careers@ mailboxes exist and are monitored.</ConfirmNote>
            </Card>

            {company.social.linkedin || company.social.youtube ? (
              <Card className="p-6">
                <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">Follow</h2>
                <ul className="mt-4 space-y-2 text-sm">
                  {company.social.linkedin ? (
                    <li>
                      <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-700 hover:underline">
                        LinkedIn company page
                      </a>
                    </li>
                  ) : null}
                  {company.social.youtube ? (
                    <li>
                      <a href={company.social.youtube} target="_blank" rel="noopener noreferrer" className="font-medium text-accent-700 hover:underline">
                        YouTube — project videos
                      </a>
                    </li>
                  ) : null}
                </ul>
              </Card>
            ) : (
              <ConfirmNote title="Social channels">
                Add the LinkedIn company page (priority B2B channel) and YouTube channel URLs in{" "}
                <code className="font-mono text-xs">lib/content/company.ts → company.social</code>; the Follow card then appears.
              </ConfirmNote>
            )}
          </aside>
        </div>
      </Band>

      <Band alt id="offices">
        <h2 className="text-2xl sm:text-3xl">Offices</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {offices.map((office) => (
            <Card key={office.key} className="overflow-hidden">
              <div className="p-7">
                <p className="eyebrow">{office.role}</p>
                <h3 className="mt-2 text-xl">
                  {office.city} Office
                  <span className="ml-2 text-base font-normal text-ink-500">{office.country}</span>
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{office.description}</p>
                <dl className="mt-6 space-y-3 border-t border-ink-200 pt-5">
                  <ContactRow icon={<IconPin className="size-4" />} label="Address">
                    {confirmedOr(office.address, `${office.city}, Republic of Kazakhstan — full address on request`)}
                  </ContactRow>
                  <ContactRow icon={<IconPhone className="size-4" />} label="Telephone">
                    {office.phoneHref ? (
                      <a href={office.phoneHref} className="font-medium text-accent-700 hover:underline">
                        {office.phone}
                      </a>
                    ) : isConfirmed(office.phone) ? (
                      office.phone
                    ) : (
                      <a href={company.phoneHref} className="font-medium text-accent-700 hover:underline">
                        via main line {company.phone}
                      </a>
                    )}
                  </ContactRow>
                  <ContactRow icon={<IconMail className="size-4" />} label="Email">
                    <a href={`mailto:${office.email}`} className="font-medium text-accent-700 hover:underline">
                      {office.email}
                    </a>
                  </ContactRow>
                  <ContactRow icon={<IconClock className="size-4" />} label="Hours">
                    {office.hours}
                  </ContactRow>
                </dl>
              </div>
              {office.mapEmbedUrl ? (
                <iframe
                  title={`Map of the ${office.city} office`}
                  src={office.mapEmbedUrl}
                  className="h-64 w-full border-t border-ink-200"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="border-t border-ink-200 bg-ink-50 px-7 py-4 text-sm">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${office.geo.lat},${office.geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-accent-700 hover:underline"
                  >
                    Open {office.city} in Google Maps
                    <IconExternal className="size-3.5" />
                  </a>
                </div>
              )}
            </Card>
          ))}
        </div>
        <ConfirmNote title="Office details">
          Confirm full street addresses for Almaty and Atyrau, the Atyrau telephone number, office email addresses and add Google Maps embed URLs (
          <code className="font-mono text-xs">offices[].mapEmbedUrl</code>). Set up Google Business Profiles for both offices with the same name,
          address and phone.
        </ConfirmNote>
      </Band>

      {/* 24/7 operations desk */}
      <section id="operations-desk" className="scroll-mt-28 bg-ink-900 py-16 text-white lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <p className="eyebrow text-gold-300">24/7 Operations Desk</p>
            <h2 className="mt-3 text-2xl text-white sm:text-3xl lg:text-[2.125rem]">{operationsDesk.heading}</h2>
            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-200">{operationsDesk.body}</p>
          </div>
          <div className="rounded-lg border border-white/15 bg-white/5 p-7">
            <p className="text-sm text-ink-300">Call or WhatsApp, any hour</p>
            <a href={company.emergencyPhoneHref} className="mt-2 block font-[family-name:var(--font-display)] text-2xl font-bold text-gold-300 hover:text-gold-100">
              {company.emergencyPhone}
            </a>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={company.emergencyPhoneHref} variant="gold">
                <IconPhone className="size-4" />
                Call now
              </ButtonLink>
              <ButtonLink href={company.whatsappHref} variant="onDark" target="_blank" rel="noopener noreferrer">
                <IconWhatsApp className="size-4" />
                WhatsApp
              </ButtonLink>
            </div>
            <ConfirmNote title="24/7 number">The deck marks the 24/7 number [CONFIRM]. The main line is shown until a dedicated number is confirmed.</ConfirmNote>
          </div>
        </div>
      </section>

      <Band alt={false} id="faq">
        <div className="max-w-3xl">
          <Faq items={generalFaqs} heading="Frequently Asked Questions" />
          <p className="mt-6 text-sm text-ink-600">
            Questions about shipment tracking are answered on the{" "}
            <Link href="/faq" className="font-medium text-accent-700 underline underline-offset-2">
              full FAQ page
            </Link>
            .
          </p>
        </div>
      </Band>

      <ClosingCta
        heading="Have a cargo others call impossible?"
        ctas={[
          { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
          { label: "Careers at Navigator", href: "/careers", variant: "onDark" },
        ]}
      />
    </>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs uppercase tracking-wide text-ink-500">
        <span className="shrink-0 text-accent-700" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-1 break-words pl-6 text-sm text-ink-800">{children}</dd>
    </div>
  );
}

