import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink, Card } from "@/components/ui";
import { ContentIcon, IconArrowRight, IconCheck } from "@/components/icons";
import type { Block, CardItem, Cta, RelatedLink, StepItem } from "@/lib/content";
import { processSteps } from "@/lib/content";
import { ClosingCta } from "./closing-cta";
import { ConfirmNote } from "./confirm-note";
import { Faq } from "./faq";
import { ProcessSteps } from "./process-steps";

/**
 * Renders a page's ordered content blocks. Each block is its own horizontal
 * band; bands alternate white and light teal as the deck's [SECTION] legend
 * asks. Closing strips are navy and review notes carry no band of their own.
 */
export function SectionRenderer({
  blocks,
  startBand = 0,
  steps = processSteps,
}: {
  blocks: Block[];
  /** 0 = first band white, 1 = first band light teal. */
  startBand?: 0 | 1;
  steps?: StepItem[];
}) {
  let band = startBand;
  return (
    <>
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;
        if (block.type === "confirm") {
          return (
            <div key={key} className="container-page">
              <ConfirmNote title={block.title}>{block.body}</ConfirmNote>
            </div>
          );
        }
        if (block.type === "closing") {
          return <ClosingCta key={key} heading={block.heading} body={block.body} ctas={block.ctas} />;
        }
        const alt = band % 2 === 1;
        band += 1;
        return (
          <Band key={key} alt={alt} id={block.id}>
            <BlockBody block={block} steps={steps} />
          </Band>
        );
      })}
    </>
  );
}

export function Band({ alt, id, children, className = "" }: { alt: boolean; id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`scroll-mt-28 ${alt ? "band-alt" : "bg-white"} py-14 lg:py-20 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

function Heading({ text, level = 2, eyebrow, className = "" }: { text?: string; level?: 2 | 3; eyebrow?: string; className?: string }) {
  if (!text) return null;
  const Tag = level === 3 ? "h3" : "h2";
  const size = level === 3 ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl";
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag className={`${eyebrow ? "mt-3" : ""} ${size}`}>{text}</Tag>
    </div>
  );
}

function BlockBody({ block, steps }: { block: Exclude<Block, { type: "confirm" } | { type: "closing" }>; steps: StepItem[] }) {
  switch (block.type) {
    case "prose":
      return (
        <div className="max-w-3xl">
          <Heading text={block.heading} level={block.headingLevel} eyebrow={block.eyebrow} />
          <div className={`prose-body ${block.heading ? "mt-6" : ""} text-[1.0625rem] leading-relaxed`}>
            {block.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 60)}>{paragraph}</p>
            ))}
          </div>
          {block.cta ? (
            <div className="mt-8">
              <CtaButton cta={block.cta} />
            </div>
          ) : null}
        </div>
      );

    case "cards":
      return (
        <div>
          <div className="max-w-3xl">
            <Heading text={block.heading} level={block.headingLevel} eyebrow={block.eyebrow} />
            {block.intro ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{block.intro}</p> : null}
          </div>
          <CardGrid items={block.items} columns={block.columns ?? 3} className={block.heading || block.intro ? "mt-10" : ""} />
          {block.cta ? (
            <div className="mt-10">
              <CtaButton cta={block.cta} />
            </div>
          ) : null}
        </div>
      );

    case "table":
      return (
        <div>
          <div className="max-w-3xl">
            <Heading text={block.heading} level={block.headingLevel} />
            {block.intro ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{block.intro}</p> : null}
          </div>
          <div className={`${block.heading || block.intro ? "mt-8" : ""} overflow-x-auto rounded-lg border border-ink-200 bg-white shadow-card`} tabIndex={0} role="region" aria-label={block.caption}>
            <table className="w-full min-w-[36rem] border-collapse text-left text-[0.9375rem]">
              <caption className="sr-only">{block.caption}</caption>
              <thead>
                <tr className="bg-ink-900 text-white">
                  {block.columns.map((column) => (
                    <th key={column} scope="col" className="px-5 py-3.5 font-[family-name:var(--font-display)] text-[0.8125rem] font-semibold uppercase tracking-[0.08em]">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {block.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="odd:bg-white even:bg-ink-50">
                    {row.map((cell, cellIndex) =>
                      cellIndex === 0 ? (
                        <th key={cellIndex} scope="row" className="px-5 py-3.5 align-top font-semibold text-ink-900">
                          {cell}
                        </th>
                      ) : (
                        <td key={cellIndex} className="px-5 py-3.5 align-top leading-relaxed text-ink-700">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.outro ? <p className="mt-5 max-w-3xl text-sm leading-relaxed text-ink-600">{block.outro}</p> : null}
        </div>
      );

    case "list":
      return (
        <div className="max-w-4xl">
          <Heading text={block.heading} level={block.headingLevel} />
          {block.intro ? <p className={`${block.heading ? "mt-4" : ""} max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700`}>{block.intro}</p> : null}
          <ul className={`${block.heading || block.intro ? "mt-7" : ""} grid gap-3.5 ${block.columns === 2 ? "md:grid-cols-2" : ""}`}>
            {block.items.map((item) => (
              <li key={item} className="flex gap-3 text-[1rem] leading-relaxed text-ink-700">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-accent-50 text-accent-700">
                  <IconCheck className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          {block.outro ? <p className="mt-7 max-w-3xl text-[1.0625rem] leading-relaxed text-ink-700">{block.outro}</p> : null}
        </div>
      );

    case "steps":
      return (
        <div>
          <Heading text={block.heading} eyebrow={block.eyebrow} className="max-w-3xl" />
          <div className="mt-12">
            <ProcessSteps items={block.items.length ? block.items : steps} />
          </div>
        </div>
      );

    case "tags":
      return (
        <div className="max-w-4xl">
          <Heading text={block.heading} level={block.headingLevel} />
          {block.intro ? <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-700">{block.intro}</p> : null}
          <ul className="mt-6 flex flex-wrap gap-2">
            {block.items.map((item) => (
              <li key={item} className="rounded-md border border-accent-200 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 shadow-card">
                {item}
              </li>
            ))}
          </ul>
        </div>
      );

    case "faq":
      return (
        <div className="max-w-3xl">
          <Faq items={block.items} heading={block.heading} />
        </div>
      );

    case "related":
      return <RelatedLinks links={block.links} heading={block.heading} />;
  }
}

export function CardGrid({ items, columns = 3, className = "" }: { items: CardItem[]; columns?: 2 | 3 | 4; className?: string }) {
  const cols = columns === 2 ? "sm:grid-cols-2" : columns === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid gap-5 ${cols} ${className}`}>
      {items.map((item) => (
        <Card key={item.title} className={`reveal flex flex-col p-6 ${item.href ? "surface-hover" : ""}`}>
          {item.icon ? (
            <span className="grid size-11 place-items-center rounded-md bg-accent-50 text-accent-700">
              <ContentIcon name={item.icon} className="size-6" />
            </span>
          ) : null}
          <h3 className={`${item.icon ? "mt-5" : ""} text-lg`}>
            {item.href ? (
              <Link href={item.href} className="hover:text-accent-700">
                <span className="absolute inset-0" aria-hidden />
                {item.title}
              </Link>
            ) : (
              item.title
            )}
          </h3>
          <p className="mt-2.5 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
          {item.href ? (
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700">
              Learn more
              <IconArrowRight className="size-4" />
            </span>
          ) : null}
        </Card>
      ))}
    </div>
  );
}

export function RelatedLinks({ links, heading = "Related" }: { links: RelatedLink[]; heading?: string }) {
  const groups: Array<[RelatedLink["kind"], string]> = [
    ["service", "Related services"],
    ["industry", "Industries"],
    ["corridor", "Corridors"],
    ["page", "See also"],
  ];
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl">{heading}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {groups
          .filter(([kind]) => links.some((l) => l.kind === kind))
          .map(([kind, label]) => (
            <div key={kind}>
              <h3 className="font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-600">
                {label}
              </h3>
              <ul className="mt-3 space-y-2">
                {links
                  .filter((l) => l.kind === kind)
                  .map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1.5 text-[0.9375rem] font-medium text-accent-700 underline-offset-2 hover:underline"
                      >
                        {link.label}
                        <IconArrowRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  );
}

export function CtaButton({ cta, size = "md" }: { cta: Cta; size?: "md" | "lg" }) {
  const variant = cta.variant ?? "gold";
  const isHttp = cta.href.startsWith("http");
  return (
    <ButtonLink href={cta.href} variant={variant} size={size} {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {cta.label}
      <IconArrowRight className="size-4" />
    </ButtonLink>
  );
}
