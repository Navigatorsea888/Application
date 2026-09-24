import type { Metadata } from "next";
import Link from "next/link";
import { Card, ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { HeroBanner } from "@/components/site/hero-banner";
import { Band } from "@/components/site/section-renderer";
import { ClosingCta } from "@/components/site/closing-cta";
import { ConfirmNote } from "@/components/site/confirm-note";
import { caseStudies, corridors, projectsLanding, publishedCaseStudies, services } from "@/lib/content";

export const metadata: Metadata = {
  title: projectsLanding.meta.title,
  description: projectsLanding.meta.description,
  keywords: projectsLanding.meta.keywords,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const pending = caseStudies.filter((c) => !c.published);

  return (
    <>
      <HeroBanner hero={projectsLanding.hero} crumbs={[{ label: "Projects", href: "/projects" }]} eyebrow="Projects" />

      <Band alt={false} id="case-studies">
        <h2 className="text-2xl sm:text-3xl">Case Studies</h2>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {publishedCaseStudies.map((study) => {
            const corridor = corridors.find((c) => c.slug === study.corridorSlug);
            const linkedServices = services.filter((s) => study.serviceSlugs.includes(s.slug));
            return (
              <Card key={study.slug} className="reveal flex flex-col p-7">
                <p className="eyebrow">{study.sector}</p>
                <h3 className="mt-3 text-xl">{study.title}</h3>
                <p className="mt-3 flex-1 text-[1rem] leading-relaxed text-ink-700">{study.summary}</p>
                <dl className="mt-6 space-y-2 border-t border-ink-200 pt-5 text-sm">
                  {corridor ? (
                    <div className="flex gap-2">
                      <dt className="w-20 shrink-0 text-ink-500">Corridor</dt>
                      <dd>
                        <Link href={corridor.path} className="font-medium text-accent-700 hover:underline">
                          {corridor.title}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <dt className="w-20 shrink-0 text-ink-500">Services</dt>
                    <dd className="flex flex-wrap gap-x-3 gap-y-1">
                      {linkedServices.map((s) => (
                        <Link key={s.slug} href={s.path} className="font-medium text-accent-700 hover:underline">
                          {s.title}
                        </Link>
                      ))}
                    </dd>
                  </div>
                </dl>
              </Card>
            );
          })}
        </div>

        <ConfirmNote title="Case studies">
          Every case study follows Challenge → Solution → Result (500–800 words, 3–6 photos, key-facts box, client quote where permitted).
          Full narratives are built when confirmed. Recommended launch case studies not yet published:{" "}
          {pending.map((p) => `${p.title} [${p.confirmStatus}]`).join(" · ")}. Confirm which projects Navigator Sea Land Limited executed
          directly and obtain written permission before naming any client or project owner.
        </ConfirmNote>

        <div className="mt-12 rounded-lg border border-ink-200 bg-accent-50 px-7 py-9 text-center">
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-ink-900">{projectsLanding.cta}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/contact" variant="gold" size="lg">
              Talk to Our Project Team
              <IconArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href="/request-a-quote?service=PROJECT" variant="secondary" size="lg">
              Request a Quote
            </ButtonLink>
          </div>
        </div>
      </Band>

      {projectsLanding.gallery.length > 0 ? (
        <Band alt id="gallery">
          <h2 className="text-2xl sm:text-3xl">Project Gallery</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectsLanding.gallery.map((image) => (
              <li key={image.src} className="overflow-hidden rounded-lg bg-white shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <p className="px-4 py-3 text-sm text-ink-600">{image.caption}</p>
              </li>
            ))}
          </ul>
        </Band>
      ) : (
        <div className="container-page" id="gallery">
          <ConfirmNote title="Project gallery">
            The gallery renders once operations photographs are added to <code className="font-mono text-xs">lib/content/projects.ts → projectsLanding.gallery</code>{" "}
            with descriptive alt text (cargo and location, e.g. “transformer on hydraulic modular trailer, Atyrau region”).
          </ConfirmNote>
        </div>
      )}

      <ClosingCta />
    </>
  );
}
