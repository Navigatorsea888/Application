import Link from "next/link";
import { IconChevronRight } from "@/components/icons";
import { JsonLd, breadcrumbJsonLd } from "./json-ld";

export interface Crumb {
  label: string;
  href: string;
}

/**
 * Visible trail plus BreadcrumbList structured data. Rendered inside the navy
 * hero banner, so colours are the on-dark set.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1.5 text-[0.8125rem] text-ink-300">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {index > 0 ? <IconChevronRight className="size-3.5 text-ink-400" /> : null}
                {isLast ? (
                  <span aria-current="page" className="text-white/90">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="transition-colors duration-150 hover:text-white">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
