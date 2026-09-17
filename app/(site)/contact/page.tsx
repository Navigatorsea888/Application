import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { ContactForm } from "@/components/contact-form";
import { IconClock, IconMail, IconPhone, IconPin } from "@/components/icons";
import { company, offices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Navigator Sea Land Limited — offices in Almaty and Atyrau, Kazakhstan, and Mumbai, India.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the people who will run the job"
        lead="Enquiries go straight to operations. If you are asking about a shipment already in progress, quote the Tracking ID and we will have the file open before we reply."
      />

      <div className="container-page py-14 lg:py-18">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-xl">Send us a message</h2>
            <p className="mt-2 text-[0.9375rem] text-ink-600">
              For a transport quotation, the{" "}
              <Link href="/quote" className="text-accent-600 underline underline-offset-2">
                quote request form
              </Link>{" "}
              captures what we need and gets a faster answer.
            </p>
            <div className="mt-7">
              <ContactForm />
            </div>
          </Card>

          <aside className="space-y-5">
            <Card className="p-6">
              <h2 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                General enquiries
              </h2>
              <a
                href={`mailto:${company.email}`}
                className="mt-4 flex items-center gap-2.5 text-[0.9375rem] text-accent-600 underline underline-offset-2 hover:text-accent-700"
              >
                <IconMail className="size-4 shrink-0" />
                {company.email}
              </a>
              <p className="mt-2 flex items-center gap-2.5 text-[0.9375rem] text-ink-700">
                <IconPhone className="size-4 shrink-0 text-ink-400" />
                {company.phone}
              </p>
            </Card>

            {offices.map((office) => (
              <Card key={office.key} className="p-6">
                <p className="eyebrow">{office.role}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-semibold">
                  {office.city}, {office.country}
                </h3>
                <div className="mt-4 space-y-3">
                  <Row icon={<IconPin className="size-4" />}>{office.address}</Row>
                  <Row icon={<IconPhone className="size-4" />}>{office.phone}</Row>
                  <Row icon={<IconMail className="size-4" />}>
                    <a
                      href={`mailto:${office.email}`}
                      className="text-accent-600 underline underline-offset-2 hover:text-accent-700"
                    >
                      {office.email}
                    </a>
                  </Row>
                  <Row icon={<IconClock className="size-4" />}>{office.hours}</Row>
                </div>
              </Card>
            ))}
          </aside>
        </div>
      </div>
    </>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 text-sm text-ink-700">
      <span className="mt-0.5 shrink-0 text-ink-500" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0 break-words">{children}</span>
    </div>
  );
}
