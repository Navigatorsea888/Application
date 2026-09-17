import Link from "next/link";
import { TrackWidget } from "@/components/track-widget";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";
import { IconArrowRight, IconCheck, SERVICE_ICONS } from "@/components/icons";
import { company, corridors, differentiators, offices, services } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CorridorStrip />
      <ServicesPreview />
      <WhyUs />
      <CorridorsPreview />
      <OfficesPreview />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      {/* Decorative corridor lines. Purely atmospheric, hidden from assistive tech. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <svg className="size-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M-50 420 C 250 380, 400 250, 700 240 S 1050 180, 1250 120" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M-50 480 C 200 460, 450 420, 650 350 S 980 300, 1250 250" stroke="#38bdf8" strokeWidth="1" opacity="0.6" />
          <path d="M-50 340 C 300 320, 500 180, 820 190 S 1100 140, 1250 60" stroke="#38bdf8" strokeWidth="1" opacity="0.4" />
          {[
            [180, 404], [420, 268], [700, 240], [980, 178],
            [300, 447], [650, 350], [900, 312],
          ].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#38bdf8" />
          ))}
        </svg>
      </div>

      <div className="container-page relative py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div>
            <p className="eyebrow text-accent-400">{company.strapline}</p>
            <h1 className="mt-4 max-w-2xl text-3xl leading-[1.15] text-white sm:text-4xl lg:text-[2.875rem]">
              Out-of-gauge and heavy-lift cargo across the Eurasian corridors.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-300">
              {company.descriptionLong}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/quote" size="lg">
                Request a Quote
                <IconArrowRight className="size-4" />
              </ButtonLink>
              <ButtonLink href="/services" size="lg" variant="onDark">
                Our Services
              </ButtonLink>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
              {["Project cargo management", "Route surveys & permits", "Customs across five republics"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-ink-300">
                    <IconCheck className="size-4 shrink-0 text-accent-400" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="lg:pl-4">
            <TrackWidget />
          </div>
        </div>
      </div>
    </section>
  );
}

function CorridorStrip() {
  return (
    <section aria-label="Corridors served" className="border-b border-ink-200 bg-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6">
        <span className="font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-600">
          Corridors served
        </span>
        {corridors.map((corridor) => (
          <Link
            key={corridor.key}
            href={`/corridors#${corridor.slug}`}
            className="text-sm font-medium text-ink-600 transition-colors duration-150 hover:text-accent-600"
          >
            {corridor.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

function ServicesPreview() {
  return (
    <section className="container-page py-20 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="What we do"
          title="Six services, one transport plan"
          lead="Project movements fail at the joins between suppliers. We hold the whole scope so the joins are ours to manage."
        />
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors duration-150 hover:text-accent-700"
        >
          All services
          <IconArrowRight className="size-4" />
        </Link>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const Icon = SERVICE_ICONS[service.icon];
          return (
            <Card key={service.slug} className="reveal p-6 transition-colors duration-150 hover:border-accent-600">
              <Icon className="size-7 text-accent-600" />
              <h3 className="mt-5 text-lg">
                <Link href={`/services#${service.slug}`} className="hover:text-accent-700">
                  <span className="absolute inset-0" aria-hidden />
                  {service.title}
                </Link>
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">{service.summary}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="bg-ink-900 py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Why Navigator Sea Land"
          title="Corridor knowledge you cannot buy from a rate sheet"
          tone="dark"
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-lg bg-ink-800 sm:grid-cols-2">
          {differentiators.map((item) => (
            <div key={item.title} className="reveal bg-ink-900 p-7">
              <h3 className="text-base text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorridorsPreview() {
  return (
    <section className="container-page py-20 lg:py-24">
      <SectionHeading
        eyebrow="Where we operate"
        title="Five corridors, planned as one network"
        lead="A movement rarely uses a single corridor. Knowing where they connect — and where they do not — is most of the work."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {corridors.map((corridor) => (
          <Card key={corridor.key} className="reveal group relative flex flex-col p-6 transition-colors duration-150 hover:border-accent-600">
            <p className="eyebrow">{corridor.subtitle}</p>
            <h3 className="mt-2.5 text-lg">
              <Link href={`/corridors#${corridor.slug}`}>
                <span className="absolute inset-0" aria-hidden />
                {corridor.title}
              </Link>
            </h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{corridor.summary}</p>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {corridor.keyPoints.slice(0, 4).map((point) => (
                <span key={point} className="rounded border border-ink-200 bg-ink-50 px-2 py-0.5 text-xs text-ink-600">
                  {point}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function OfficesPreview() {
  return (
    <section className="border-y border-ink-200 bg-white py-20 lg:py-24">
      <div className="container-page">
        <SectionHeading eyebrow="Our offices" title="On the corridors we sell" />
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {offices.map((office) => (
            <div key={office.key} className="reveal">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-ink-900">
                {office.city}
              </p>
              <p className="text-sm text-ink-500">{office.country}</p>
              <p className="mt-1 text-sm font-medium text-accent-600">{office.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{office.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/locations" variant="secondary">
            Office details
            <IconArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="container-page py-20 lg:py-24">
      <div className="rounded-lg border border-ink-200 bg-white px-7 py-12 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl text-2xl sm:text-3xl">
          Have a piece that does not fit a container?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-ink-600">
          Send us the dimensions, the weight and where it has to end up. We will tell you how it moves, what it
          needs, and how long the permits take.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/quote" size="lg">
            Request a Quote
            <IconArrowRight className="size-4" />
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
