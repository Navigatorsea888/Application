import type { ReactNode } from "react";
import { HeroBanner } from "./hero-banner";

/**
 * Compact hero for utility pages (tracking portal, legal pages). Same navy
 * banner as the marketing pages, no CTA buttons.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  crumbs?: Array<{ label: string; href: string }>;
  children?: ReactNode;
}) {
  return (
    <HeroBanner
      eyebrow={eyebrow}
      hero={{ title, lead: lead ?? "", ctas: [] }}
      crumbs={crumbs ?? [{ label: title, href: "#" }]}
    >
      {children}
    </HeroBanner>
  );
}
