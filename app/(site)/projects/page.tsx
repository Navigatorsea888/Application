import type { Metadata } from "next";
import { Alert, ButtonLink, Card } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { IconArrowRight } from "@/components/icons";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected project cargo and heavy-lift movements handled by Navigator Sea Land across Central Asia, the Caspian and the INSTC.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Selected movements"
        lead="Case studies are the only honest way to describe project logistics capability. A rate sheet tells you nothing about what happens when the bridge is out."
      />

      <div className="container-page py-16 lg:py-20">
        <Alert tone="warning" title="Draft content — requires your input">
          The case studies below are structural placeholders. Every field marked{" "}
          <span className="font-mono">[VERIFY]</span> must be replaced with real project data in{" "}
          <span className="font-mono">lib/content.ts</span> before this page is published. Obtain client consent
          before naming any project, site or company.
        </Alert>

        <div className="mt-10 space-y-8">
          {projects.map((project) => (
            <Card key={project.slug} className="overflow-hidden">
              <div className="grid lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <div className="p-7 sm:p-9">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded border border-accent-200 bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-700">
                      {project.corridor}
                    </span>
                    <span className="text-xs text-ink-500">{project.year}</span>
                  </div>
                  <h2 className="mt-4 text-xl">{project.title}</h2>
                  <p className="mt-3 leading-relaxed text-ink-600">{project.summary}</p>

                  <dl className="mt-7 space-y-4">
                    <Detail label="Cargo" value={project.cargo} />
                    <Detail label="Route" value={project.route} />
                    <Detail label="The constraint" value={project.challenge} />
                    <Detail label="What we did" value={project.solution} />
                  </dl>
                </div>

                <div className="border-t border-ink-200 bg-ink-50 p-7 sm:p-9 lg:border-l lg:border-t-0">
                  <h3 className="font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-[0.12em] text-ink-500">
                    At a glance
                  </h3>
                  <dl className="mt-5 grid grid-cols-2 gap-5">
                    {project.metrics.map((metric) => (
                      <div key={metric.label}>
                        <dt className="text-xs text-ink-500">{metric.label}</dt>
                        <dd className="mt-1 font-[family-name:var(--font-display)] text-lg font-semibold text-ink-900">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-14 rounded-lg border border-ink-200 bg-white px-7 py-10 text-center">
          <h2 className="text-2xl">Working on something similar?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            We are happy to talk through a comparable movement in detail, including what went wrong on it and what
            we would do differently.
          </p>
          <div className="mt-7">
            <ButtonLink href="/contact" size="lg">
              Get in touch
              <IconArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[minmax(0,8rem)_1fr] sm:gap-4">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink-800">{value}</dd>
    </div>
  );
}
