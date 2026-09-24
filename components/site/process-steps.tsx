import type { StepItem } from "@/lib/content";

/** Deck 4 "How We Deliver" — the five-step process graphic. */
export function ProcessSteps({ items }: { items: StepItem[] }) {
  return (
    <ol className="relative grid gap-6 md:grid-cols-5 md:gap-4">
      {/* Connector on desktop */}
      <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-accent-200 md:block" />
      {items.map((step, index) => (
        <li key={step.title} className="reveal relative flex gap-4 md:block">
          <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-accent-600 bg-white font-[family-name:var(--font-display)] text-base font-semibold text-accent-700 shadow-card">
            {index + 1}
          </span>
          <div className="md:mt-5">
            <h3 className="text-base font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
