import type { Metadata } from "next";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { PageHero } from "@/components/page-hero";
import { company, differentiators, offices } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: company.descriptionShort,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A project forwarder built around the corridors, not around a network map"
        lead={company.descriptionLong}
      />

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="prose-body max-w-2xl">
            <h2 className="text-2xl">What we do</h2>
            <p className="mt-4">
              Navigator Sea Land Limited plans and executes the movement of out-of-gauge, heavy-lift and project
              cargo. Our clients are EPC contractors, energy and industrial project owners, and freight forwarders
              whose own networks stop at the edge of the region.
            </p>
            <p>
              The work divides into two halves. The first is planning: route surveys, method statements, permit
              assessments and a schedule tested against real corridor constraints rather than published transit
              times. The second is execution, where the plan meets a border queue, a ferry that did not sail, or a
              bridge that turns out to be under repair.
            </p>
            <p>
              We hold both halves. A movement is quoted by the people who will run it, and the plan is revised by
              the people who wrote it.
            </p>

            <h2 className="mt-12 text-2xl">How we work</h2>
            <p className="mt-4">
              Every enquiry starts with the cargo, not the route. Dimensions, weight, centre of gravity and lifting
              points determine what is possible; the route is what follows from them. For anything genuinely
              out-of-gauge we will say what we need to see — drawings, a general arrangement, a site plan — before
              we commit to a transit time.
            </p>
            <p>
              Once a movement is booked, it is tracked checkpoint by checkpoint. The same timeline our operations
              staff work from is what the client sees on the tracking portal, so the position is a matter of record
              rather than of asking.
            </p>

            <h2 className="mt-12 text-2xl">Compliance</h2>
            <p className="mt-4">
              Several of the corridors we operate carry sanctions and counterparty exposure that changes over time.
              We screen the route, the parties and the carriers against the position applicable at the time of
              shipment, and we will decline or re-route a movement where that screening requires it. Clients are
              told the reason.
            </p>
          </div>

          <aside className="lg:pt-2">
            <Card className="p-6">
              <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold uppercase tracking-[0.1em] text-ink-500">
                At a glance
              </h3>
              <dl className="mt-5 space-y-4">
                <Fact label="Offices" value="Almaty · Atyrau · Mumbai" />
                <Fact label="Founded" value={company.founded} />
                <Fact label="Registration" value={company.registration} />
                <Fact label="Corridors" value="Central Asia, Caspian, China Land Bridge, Middle Corridor, INSTC" />
                <Fact label="Specialism" value="OOG, heavy-lift and project cargo" />
              </dl>
            </Card>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              Entries marked <span className="font-mono">[VERIFY]</span> are placeholders awaiting confirmation and
              are edited in <span className="font-mono">lib/content.ts</span>.
            </p>
          </aside>
        </div>
      </section>

      <section className="bg-ink-900 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Our approach" title="Four things we do differently" tone="dark" />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg bg-ink-800 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title} className="bg-ink-900 p-7">
                <h3 className="text-base text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Where we are" title="Three offices on three corridors" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {offices.map((office) => (
            <Card key={office.key} className="p-6">
              <p className="font-[family-name:var(--font-display)] text-lg font-semibold">{office.city}</p>
              <p className="text-sm text-ink-500">{office.country}</p>
              <p className="mt-1 text-sm font-medium text-accent-600">{office.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{office.description}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="/contact">
            Talk to us
            <IconArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink-800">{value}</dd>
    </div>
  );
}

