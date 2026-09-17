import type { ReactNode } from "react";

/** Shared page banner for the interior marketing pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-ink-200 bg-white">
      <div className="container-page py-14 lg:py-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl leading-tight sm:text-4xl">{title}</h1>
        {lead ? <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">{lead}</p> : null}
        {children}
      </div>
    </section>
  );
}
