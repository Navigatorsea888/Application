import { IconChevronDown } from "@/components/icons";
import type { FaqItem } from "@/lib/content";
import { JsonLd, faqJsonLd } from "./json-ld";

/**
 * FAQ accordion (collapsed by default) with FAQPage structured data, as the
 * deck asks for on every FAQ. <details> gives keyboard support, find-in-page
 * and no-JS operation for free.
 */
export function Faq({ items, heading, id }: { items: FaqItem[]; heading?: string; id?: string }) {
  if (items.length === 0) return null;
  return (
    <div id={id}>
      <JsonLd data={faqJsonLd(items)} />
      {heading ? <h2 className="text-2xl sm:text-3xl">{heading}</h2> : null}
      <div className={`${heading ? "mt-8" : ""} divide-y divide-ink-200 border-y border-ink-200`}>
        {items.map((faq) => (
          <details key={faq.question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 font-[family-name:var(--font-display)] text-[1.0625rem] font-medium text-ink-900 transition-colors duration-150 hover:text-accent-700 [&::-webkit-details-marker]:hidden">
              {faq.question}
              <IconChevronDown className="mt-1 size-5 shrink-0 text-accent-600 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="pb-6 pr-10 text-[0.9375rem] leading-relaxed text-ink-700">{faq.answer}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
