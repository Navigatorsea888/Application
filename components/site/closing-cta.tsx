import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import { closingCta } from "@/lib/content";
import type { Cta } from "@/lib/content";

/**
 * Closing CTA strip (deck 3.1, all pages). Pages with a page-specific closing
 * block pass their own heading, body and CTAs.
 */
export function ClosingCta({
  heading = closingCta.heading,
  body = closingCta.body,
  ctas = closingCta.ctas,
}: {
  heading?: string;
  body?: string;
  ctas?: Cta[];
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 py-16 text-white lg:py-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-20">
        <svg className="size-full" viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M-50 220 C 250 200, 450 120, 750 110 S 1050 80, 1250 40" stroke="#13807E" strokeWidth="1.5" />
          <path d="M-50 260 C 250 250, 500 210, 700 170 S 1000 140, 1250 120" stroke="#C9A227" strokeWidth="1" />
        </svg>
      </div>
      <div className="container-page relative text-center">
        <h2 className="mx-auto max-w-3xl text-2xl text-white sm:text-3xl lg:text-[2.25rem]">{heading}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-200">{body}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {ctas.map((cta, index) => {
            const variant = cta.variant ?? (index === 0 ? "gold" : "onDark");
            const isHttp = cta.href.startsWith("http");
            return (
              <ButtonLink
                key={cta.href + cta.label}
                href={cta.href}
                size="lg"
                variant={variant}
                {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {cta.label}
                {variant === "gold" ? <IconArrowRight className="size-4" /> : null}
              </ButtonLink>
            );
          })}
        </div>
      </div>
    </section>
  );
}
