import Link from "next/link";
import { Logo } from "./logo";
import { company, footerLinks, offices } from "@/lib/content";
import { IconMail, IconPin } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-ink-800 bg-ink-900 text-ink-300">
      <div className="container-page py-14">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">{company.descriptionShort}</p>
            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 text-sm text-ink-300 transition-colors duration-150 hover:text-white"
              >
                <IconMail className="size-4 text-ink-500" />
                {company.email}
              </a>
            </div>
          </div>

          <FooterColumn title="Company" links={footerLinks.company} />
          <FooterColumn title="Services" links={footerLinks.services} />
          <FooterColumn title="Corridors" links={footerLinks.corridors} />
        </div>

        <div className="mt-12 grid gap-6 border-t border-ink-800 pt-8 sm:grid-cols-3">
          {offices.map((office) => (
            <div key={office.key}>
              <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-sm font-medium text-white">
                <IconPin className="size-4 text-accent-400" />
                {office.city}, {office.country}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-400">{office.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">
            &copy; {year} {company.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-ink-400 transition-colors duration-150 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/admin" className="text-xs text-ink-400 transition-colors duration-150 hover:text-white">
              Staff Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-300 transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
