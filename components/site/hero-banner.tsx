import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";
import type { Cta, Hero } from "@/lib/content";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";

/**
 * [HERO BANNER] — full-width navy banner carrying the page's single H1, the
 * sub-headline and the CTA buttons. Gold = primary action, outline = secondary.
 *
 * No photography has been supplied yet, so the banner uses the corridor-line
 * graphic; when `hero.image.src` is set it is used as the background with the
 * navy overlay the deck specifies.
 */
export function HeroBanner({
  hero,
  crumbs,
  eyebrow,
  size = "default",
  aside,
  children,
}: {
  hero: Hero;
  crumbs?: Crumb[];
  eyebrow?: string;
  size?: "default" | "large";
  /** Optional right-hand panel (the home page tracking widget). */
  aside?: ReactNode;
  children?: ReactNode;
}) {
  const padding = size === "large" ? "py-20 lg:py-28" : "py-14 lg:py-20";
  const titleSize =
    size === "large"
      ? "text-[2rem] leading-[1.12] sm:text-4xl lg:text-[3.125rem]"
      : "text-[1.75rem] leading-[1.15] sm:text-3xl lg:text-[2.5rem]";

  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      {hero.image?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.image.src}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover opacity-40"
          loading="eager"
        />
      ) : null}
      <CorridorLines />

      <div className={`container-page relative ${padding}`}>
        {crumbs ? (
          <div className="mb-6">
            <Breadcrumbs items={crumbs} />
          </div>
        ) : null}

        <div className={aside ? "grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]" : ""}>
          <div className="max-w-3xl">
            {eyebrow ? <p className="eyebrow text-gold-300">{eyebrow}</p> : null}
            <h1 className={`${eyebrow ? "mt-3" : ""} ${titleSize} text-white`}>{hero.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-200 lg:text-[1.1875rem]">{hero.lead}</p>

            {hero.ctas.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {hero.ctas.map((cta, index) => (
                  <HeroCta key={cta.href + cta.label} cta={cta} primary={index === 0} />
                ))}
              </div>
            ) : null}
            {children}
          </div>

          {aside ? <div className="lg:pl-4">{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}

function HeroCta({ cta, primary }: { cta: Cta; primary: boolean }) {
  const variant = cta.variant ?? (primary ? "gold" : "onDark");
  const external = /^(https?:|mailto:|tel:)/.test(cta.href);
  return (
    <ButtonLink
      href={cta.href}
      size="lg"
      variant={variant}
      {...(external && cta.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {cta.label}
      {variant === "gold" ? <IconArrowRight className="size-4" /> : null}
    </ButtonLink>
  );
}

/** Decorative corridor lines: teal rail, gold road, blue sea. Hidden from AT. */
function CorridorLines() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.22]">
      <svg className="size-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" fill="none">
        <path d="M-50 420 C 250 380, 400 250, 700 240 S 1050 180, 1250 120" stroke="#13807E" strokeWidth="1.5" />
        <path d="M-50 480 C 200 460, 450 420, 650 350 S 980 300, 1250 250" stroke="#C9A227" strokeWidth="1" opacity="0.8" />
        <path d="M-50 340 C 300 320, 500 180, 820 190 S 1100 140, 1250 60" stroke="#3F9F9C" strokeWidth="1" opacity="0.6" />
        <path d="M-50 540 C 300 520, 600 470, 900 400 S 1150 330, 1250 320" stroke="#2F5FA8" strokeWidth="1.25" opacity="0.7" />
        {[
          [180, 404],
          [420, 268],
          [700, 240],
          [980, 178],
          [300, 447],
          [650, 350],
          [900, 312],
          [560, 490],
          [1050, 360],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="3.5" fill="#C9A227" />
        ))}
      </svg>
    </div>
  );
}
