import Link from "next/link";
import { Logo } from "@/components/logo";
import { IconClock, IconMail, IconPhone, IconPin, IconWhatsApp } from "@/components/icons";
import { company, confirmedOr, footerColumns, isConfirmed, offices } from "@/lib/content";

/**
 * Footer (deck 3.1): About blurb, columns Company · Services · Industries ·
 * Corridors · Contact, and the legal line. Bottom padding on small screens
 * makes room for the sticky mobile action bar.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-800 bg-ink-950 pb-24 text-ink-300 lg:pb-0">
      <div className="container-page py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] lg:gap-10">
          <div>
            <Logo variant="light" />
            <p className="mt-3 font-[family-name:var(--font-display)] text-sm font-medium text-gold-300">{company.tagline}</p>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">{company.descriptionShort}</p>
          </div>

          <FooterColumn title="Company" links={footerColumns.company} />
          <FooterColumn title="Services" links={footerColumns.services} />
          <FooterColumn title="Industries" links={footerColumns.industries} />
          <FooterColumn title="Corridors" links={footerColumns.corridors} />
        </div>

        <div className="mt-12 border-t border-ink-800 pt-10">
          <h3 className="font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
            Contact
          </h3>
          <div className="mt-5 grid gap-8 sm:grid-cols-3">
            {offices.map((office) => (
              <div key={office.key} className="text-sm">
                <p className="flex items-center gap-2 font-[family-name:var(--font-display)] font-semibold text-white">
                  <IconPin className="size-4 text-gold-300" />
                  {office.city} office
                </p>
                <p className="mt-1.5 text-xs text-ink-400">{office.role}</p>
                <p className="mt-2 leading-relaxed text-ink-300">{confirmedOr(office.address, `${office.city}, Republic of Kazakhstan`)}</p>
                {office.phoneHref ? (
                  <a href={office.phoneHref} className="mt-1.5 block text-ink-300 transition-colors duration-150 hover:text-white">
                    {office.phone}
                  </a>
                ) : isConfirmed(office.phone) ? (
                  <p className="mt-1.5 text-ink-300">{office.phone}</p>
                ) : (
                  <a href={company.phoneHref} className="mt-1.5 block text-ink-300 transition-colors duration-150 hover:text-white">
                    via {company.phone}
                  </a>
                )}
                <p className="mt-1 text-xs text-ink-400">{office.hours}</p>
              </div>
            ))}
            <div className="text-sm">
              <p className="flex items-center gap-2 font-[family-name:var(--font-display)] font-semibold text-white">
                <IconClock className="size-4 text-gold-300" />
                24/7 Operations Desk
              </p>
              <a href={company.emergencyPhoneHref} className="mt-2 block text-ink-300 transition-colors duration-150 hover:text-white">
                <IconPhone className="mr-2 inline size-4 text-ink-500" />
                {company.emergencyPhone}
              </a>
              <a
                href={company.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 block text-ink-300 transition-colors duration-150 hover:text-white"
              >
                <IconWhatsApp className="mr-2 inline size-4 text-ink-500" />
                WhatsApp
              </a>
              <a href={`mailto:${company.email}`} className="mt-1.5 block break-all text-ink-300 transition-colors duration-150 hover:text-white">
                <IconMail className="mr-2 inline size-4 text-ink-500" />
                {company.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ink-800 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink-400">
            &copy; {year} {company.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerColumns.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-ink-400 transition-colors duration-150 hover:text-white">
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

function FooterColumn({ title, links }: { title: string; links: readonly { href: string; label: string }[] }) {
  return (
    <div>
      <h3 className="font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-400">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-300 transition-colors duration-150 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
