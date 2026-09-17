import type { Metadata } from "next";
import { ButtonLink, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { IconArrowRight, IconCheck, SERVICE_ICONS } from "@/components/icons";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Project cargo management, OOG and heavy-lift, multimodal transport, customs clearance, chartering, and warehousing across Central Asia and the Eurasian corridors.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything a project movement needs, under one plan"
        lead="Six service lines that are rarely bought separately. Most projects need four or five of them in sequence, which is exactly why holding them together matters."
      >
        <nav aria-label="Services" className="mt-8 flex flex-wrap gap-2">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`#${service.slug}`}
              className="rounded-md border border-ink-300 px-3 py-1.5 text-sm text-ink-700 transition-colors duration-150 hover:border-accent-600 hover:text-accent-700"
            >
              {service.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <div className="container-page py-16 lg:py-20">
        <div className="space-y-16">
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[service.icon];
            return (
              <section
                key={service.slug}
                id={service.slug}
                className="scroll-mt-28 border-b border-ink-200 pb-16 last:border-b-0 last:pb-0"
              >
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-md bg-accent-50 text-accent-600">
                        <Icon className="size-6" />
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-sm text-ink-500">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="mt-5 text-2xl">{service.title}</h2>
                    <p className="mt-3 text-lg leading-relaxed text-ink-600">{service.summary}</p>
                    <div className="prose-body mt-6 max-w-2xl">
                      {service.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>

                  <Card className="h-fit p-6">
                    <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                      Included
                    </h3>
                    <ul className="mt-4 space-y-3">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex gap-3 text-sm leading-relaxed text-ink-700">
                          <IconCheck className="mt-0.5 size-4 shrink-0 text-accent-600" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 rounded-lg border border-ink-200 bg-white px-7 py-10 text-center">
          <h2 className="text-2xl">Not sure which of these you need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            Most enquiries start with a drawing and a delivery date. Send those and we will tell you what the
            movement actually requires.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/quote" size="lg">
              Request a Quote
              <IconArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact Us
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}
