import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui";
import { ContentIcon, IconArrowRight, IconCheck, IconPin } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band, CardGrid } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { about, aboutMeta, offices } from "@/lib/content";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  keywords: aboutMeta.keywords,
  alternates: { canonical: "/about-us" },
};

export default function AboutPage() {
  const heldAccreditations = about.accreditations.filter((a) => a.held);

  return (
    <>
      <HeroBanner hero={about.hero} crumbs={[{ label: "About Us", href: "/about-us" }]} eyebrow="About Us" />

      {/* Who we are */}
      <Band alt={false} id="who-we-are">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div>
            <h2 className="text-2xl sm:text-3xl">Who We Are</h2>
            <div className="prose-body mt-6 text-[1.0625rem] leading-relaxed">
              {about.whoWeAre.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside>
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Company fact sheet</caption>
                <tbody className="divide-y divide-ink-200">
                  {about.factSheet.map(([label, value]) => (
                    <tr key={label} className="align-top">
                      <th scope="row" className="w-32 bg-ink-50 px-4 py-3 text-left font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wide text-ink-600">
                        {label}
                      </th>
                      <td className="px-4 py-3 leading-relaxed text-ink-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </aside>
        </div>
      </Band>

      {/* Vision, mission, values */}
      <Band alt id="vision-mission-values">
        <h2 className="text-2xl sm:text-3xl">Vision, Mission & Values</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="rounded-lg bg-ink-900 p-7 text-white shadow-card">
            <p className="eyebrow text-gold-300">Our Vision</p>
            <p className="mt-3 text-lg leading-relaxed">{about.vision}</p>
          </div>
          <div className="rounded-lg bg-accent-800 p-7 text-white shadow-card">
            <p className="eyebrow text-gold-100">Our Mission</p>
            <p className="mt-3 text-lg leading-relaxed">{about.mission}</p>
          </div>
        </div>
        <CardGrid items={about.values.map((v) => ({ title: v.title, body: v.body, icon: v.icon }))} columns={3} className="mt-8" />
      </Band>

      {/* Leadership — only when bios are supplied */}
      {about.leadership.length > 0 ? (
        <Band alt={false} id="leadership">
          <h2 className="text-2xl sm:text-3xl">Leadership</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {about.leadership.map((person) => (
              <Card key={person.name} className="p-6">
                <p className="font-[family-name:var(--font-display)] text-lg font-semibold">{person.name}</p>
                <p className="text-sm text-accent-700">{person.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{person.bio}</p>
              </Card>
            ))}
          </div>
        </Band>
      ) : (
        <div className="container-page">
          <ConfirmNote title="Leadership">
            The deck's menu lists a Leadership section but supplies no biographies. Add approved names, titles, bios and photos in{" "}
            <code className="font-mono text-xs">lib/content/company.ts → about.leadership</code>; the section and menu item then appear.
          </ConfirmNote>
        </div>
      )}

      {/* Network & offices */}
      <Band alt={false} id="network-offices">
        <h2 className="text-2xl sm:text-3xl">Network & Offices</h2>
        <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">{about.network.intro}</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {offices.map((office) => (
            <Card key={office.key} className="p-6">
              <p className="eyebrow">{office.role}</p>
              <h3 className="mt-2 flex items-center gap-2 text-lg">
                <IconPin className="size-5 text-gold-500" />
                {office.city}, {office.country}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">{office.description}</p>
              <Link href="/contact#offices" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline">
                Office details
                <IconArrowRight className="size-4" />
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card">
          <table className="w-full text-sm">
            <caption className="sr-only">Network overview</caption>
            <tbody className="divide-y divide-ink-200">
              {about.network.rows.map(([label, value]) => (
                <tr key={label} className="align-top">
                  <th scope="row" className="w-44 bg-ink-50 px-5 py-4 text-left font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wide text-ink-600 sm:w-56">
                    {label}
                  </th>
                  <td className="px-5 py-4 leading-relaxed text-ink-800">{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ConfirmNote title="Agent & partner locations">{about.network.confirm}</ConfirmNote>
      </Band>

      {/* Accreditations — only logos for accreditations actually held */}
      {heldAccreditations.length > 0 ? (
        <Band alt id="accreditations">
          <h2 className="text-2xl sm:text-3xl">Accreditations & Memberships</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {heldAccreditations.map((item) => (
              <li key={item.name} className="rounded-lg bg-white p-6 text-center shadow-card">
                {item.logoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.logoSrc} alt={item.name} className="mx-auto h-14 object-contain" loading="lazy" />
                ) : (
                  <p className="font-[family-name:var(--font-display)] font-semibold">{item.name}</p>
                )}
                <p className="mt-3 text-sm text-ink-600">{item.relevance}</p>
                <p className="mt-1 text-xs font-medium text-accent-700">{item.status}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : (
        <div className="container-page">
          <ConfirmNote title="Accreditations & memberships">
            Only display logos for accreditations actually held. None is marked as held yet, so the section is hidden. To confirm: FIATA (via
            national association) · National Freight Forwarders Association of Kazakhstan · ISO 9001 (confirm / target) · ISO 45001 & 14001
            (target) · heavy-lift networks such as PCN or WCA Projects · Kazakhstan business registration & forwarding licences. Set{" "}
            <code className="font-mono text-xs">held: true</code> and add a logo in <code className="font-mono text-xs">about.accreditations</code>.
          </ConfirmNote>
        </div>
      )}

      {/* Why Navigator */}
      <Band alt id="why-navigator">
        <h2 className="text-2xl sm:text-3xl">Why Navigator</h2>
        <p className="mt-4 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">{about.whyNavigator.intro}</p>
        <CardGrid items={about.whyNavigator.items.map((i) => ({ title: i.title, body: i.body, icon: i.icon }))} columns={3} className="mt-10" />
      </Band>

      {/* HSSE & sustainability */}
      <Band alt={false} id="hsse-sustainability">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <div>
            <span className="grid size-12 place-items-center rounded-md bg-accent-50 text-accent-700">
              <ContentIcon name="shield" className="size-7" />
            </span>
            <h2 className="mt-5 text-2xl sm:text-3xl">HSSE & Sustainability</h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{about.hsse.intro}</p>
          </div>
          <ul className="grid gap-3.5 self-center">
            {about.hsse.items.map((item) => (
              <li key={item} className="flex gap-3 rounded-lg bg-accent-50 px-4 py-3.5 text-[0.9375rem] leading-relaxed text-ink-800">
                <IconCheck className="mt-1 size-4 shrink-0 text-accent-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Band>

      <ClosingCta />
    </>
  );
}
