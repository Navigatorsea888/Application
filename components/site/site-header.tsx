"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import { ContentIcon, IconChevronDown, IconClose, IconMail, IconMenu, IconPhone, IconWhatsApp, IconClock } from "@/components/icons";
import { buttonClass } from "@/components/ui";
import { company, headerButtons, languages, mainMenu, type MenuItem } from "@/lib/content";

/**
 * Sticky header: thin navy utility bar (phone, email, WhatsApp, language,
 * 24/7 desk), logo, main menu with drop-down panels, and the two header
 * buttons the deck specifies — Request a Quote (gold) and Company Profile
 * (outline). Collapses to a drawer below lg.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  // Close everything on navigation.
  useEffect(() => {
    setDrawerOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Lock scroll behind the drawer.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Escape and outside click close an open panel.
  useEffect(() => {
    if (!openMenu) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    const onClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [openMenu]);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  }, []);
  const cancelClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_0_var(--color-ink-200)]">
      <UtilityBar />

      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav ref={navRef} aria-label="Main" className="hidden items-center lg:flex">
          {mainMenu.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenMenu(item.label);
                }}
                onMouseLeave={scheduleClose}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`whitespace-nowrap rounded-md py-2 pl-2.5 pr-1 text-sm font-medium transition-colors duration-150 xl:text-[0.9375rem] ${
                      isActive(item.href) ? "text-accent-700" : "text-ink-800 hover:text-accent-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={openMenu === item.label}
                    aria-controls={`menu-${item.label.replace(/\s+/g, "-").toLowerCase()}`}
                    aria-label={`${openMenu === item.label ? "Close" : "Open"} ${item.label} menu`}
                    onClick={() => setOpenMenu((current) => (current === item.label ? null : item.label))}
                    className="grid size-6 cursor-pointer place-items-center rounded text-ink-500 hover:text-accent-700"
                  >
                    <IconChevronDown className={`size-4 transition-transform duration-200 ${openMenu === item.label ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {openMenu === item.label ? <MenuPanel item={item} /> : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150 xl:text-[0.9375rem] ${
                  isActive(item.href) ? "text-accent-700" : "text-ink-800 hover:text-accent-700"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2.5 2xl:flex">
          <Link href={headerButtons.profile.href} className={buttonClass("secondary", "sm", "whitespace-nowrap")}>
            {headerButtons.profile.label}
          </Link>
          <Link href={headerButtons.quote.href} className={buttonClass("gold", "sm", "whitespace-nowrap")}>
            {headerButtons.quote.label}
          </Link>
        </div>
        <div className="hidden items-center lg:flex 2xl:hidden">
          <Link href={headerButtons.quote.href} className={buttonClass("gold", "sm", "whitespace-nowrap")}>
            {headerButtons.quote.label}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          className="grid size-11 cursor-pointer place-items-center rounded-md border border-ink-300 text-ink-900 transition-colors duration-150 hover:bg-ink-100 lg:hidden"
        >
          {drawerOpen ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
        </button>
      </div>

      {drawerOpen ? <MobileDrawer isActive={isActive} /> : null}
    </header>
  );
}

function UtilityBar() {
  return (
    <div className="hidden bg-ink-900 text-[0.8125rem] text-ink-200 lg:block">
      <div className="container-page flex h-9 items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <a href={company.phoneHref} className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-white">
            <IconPhone className="size-3.5 text-gold-300" />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`} className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-white">
            <IconMail className="size-3.5 text-gold-300" />
            {company.email}
          </a>
          <a
            href={company.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-white"
          >
            <IconWhatsApp className="size-3.5 text-gold-300" />
            WhatsApp
          </a>
        </div>
        <div className="flex items-center gap-5">
          <LanguageSwitcher />
          <Link href="/contact#operations-desk" className="inline-flex items-center gap-1.5 font-medium text-white transition-colors duration-150 hover:text-gold-300">
            <IconClock className="size-3.5 text-gold-300" />
            24/7 Operations Desk
          </Link>
        </div>
      </div>
    </div>
  );
}

function LanguageSwitcher({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <div className="flex items-center gap-1" aria-label="Language">
      {languages.map((lang, index) => (
        <span key={lang.code} className="flex items-center gap-1">
          {index > 0 ? <span aria-hidden className={tone === "dark" ? "text-ink-500" : "text-ink-300"}>|</span> : null}
          {lang.available ? (
            <span
              aria-current="true"
              lang={lang.iso}
              className={`font-semibold ${tone === "dark" ? "text-white" : "text-ink-900"}`}
              title={lang.label}
            >
              {lang.code}
            </span>
          ) : (
            <span
              aria-disabled="true"
              lang={lang.iso}
              className={tone === "dark" ? "text-ink-400" : "text-ink-400"}
              title={`${lang.label} — in preparation`}
            >
              {lang.code}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

function MenuPanel({ item }: { item: MenuItem }) {
  const id = `menu-${item.label.replace(/\s+/g, "-").toLowerCase()}`;
  const grid = item.layout === "grid";
  return (
    <div
      id={id}
      className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${grid ? "w-[min(56rem,calc(100vw-3rem))]" : "w-72"}`}
    >
      <div className="surface overflow-hidden shadow-card-hover">
        <ul className={grid ? "grid grid-cols-2 gap-x-2 p-3" : "p-2"}>
          {item.children!.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                className={`group flex gap-3 rounded-md px-3 py-2.5 transition-colors duration-150 hover:bg-accent-50 ${grid ? "" : "items-center"}`}
              >
                {grid ? (
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-md bg-accent-50 text-accent-700 group-hover:bg-white">
                    <ContentIcon name={child.icon} className="size-5" />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="flex items-center gap-2 text-[0.9375rem] font-medium text-ink-900 group-hover:text-accent-800">
                    {child.label}
                    {child.badge ? (
                      <span className="rounded bg-gold-500 px-1.5 py-px font-[family-name:var(--font-display)] text-[0.625rem] font-bold uppercase tracking-wide text-ink-900">
                        {child.badge}
                      </span>
                    ) : null}
                  </span>
                  {child.description ? <span className="mt-0.5 block text-[0.8125rem] leading-snug text-ink-500">{child.description}</span> : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {grid ? (
          <div className="border-t border-ink-200 bg-ink-50 px-5 py-3">
            <Link href={item.href} className="text-sm font-medium text-accent-700 hover:underline">
              View all {item.label.toLowerCase()} →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MobileDrawer({ isActive }: { isActive: (href: string) => boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div id="mobile-nav" className="max-h-[calc(100vh-4.5rem)] overflow-y-auto border-t border-ink-200 bg-white lg:hidden">
      <nav aria-label="Main (mobile)" className="container-page flex flex-col py-3">
        {mainMenu.map((item) => (
          <div key={item.href} className="border-b border-ink-100 last:border-b-0">
            <div className="flex items-center">
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex-1 rounded-md px-3 py-3 text-base font-medium ${isActive(item.href) ? "text-accent-700" : "text-ink-900"}`}
              >
                {item.label}
              </Link>
              {item.children ? (
                <button
                  type="button"
                  aria-expanded={expanded === item.label}
                  aria-label={`${expanded === item.label ? "Collapse" : "Expand"} ${item.label}`}
                  onClick={() => setExpanded((v) => (v === item.label ? null : item.label))}
                  className="grid size-11 cursor-pointer place-items-center rounded-md text-ink-600"
                >
                  <IconChevronDown className={`size-5 transition-transform duration-200 ${expanded === item.label ? "rotate-180" : ""}`} />
                </button>
              ) : null}
            </div>
            {item.children && expanded === item.label ? (
              <ul className="mb-2 ml-3 border-l-2 border-accent-100 pl-3">
                {item.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className="flex items-center gap-2 rounded-md px-2 py-2.5 text-[0.9375rem] text-ink-700 hover:text-accent-700">
                      {child.label}
                      {child.badge ? (
                        <span className="rounded bg-gold-500 px-1.5 py-px font-[family-name:var(--font-display)] text-[0.625rem] font-bold uppercase text-ink-900">
                          {child.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}

        <div className="mt-4 grid gap-2.5">
          <Link href={headerButtons.quote.href} className={buttonClass("gold", "lg", "w-full")}>
            {headerButtons.quote.label}
          </Link>
          <Link href={headerButtons.profile.href} className={buttonClass("secondary", "lg", "w-full")}>
            {headerButtons.profile.label}
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-ink-200 pt-5 text-sm text-ink-700">
          <a href={company.phoneHref} className="inline-flex items-center gap-2">
            <IconPhone className="size-4 text-accent-700" />
            {company.phone}
          </a>
          <a href={`mailto:${company.email}`} className="inline-flex items-center gap-2">
            <IconMail className="size-4 text-accent-700" />
            {company.email}
          </a>
          <Link href="/contact#operations-desk" className="inline-flex items-center gap-2 font-medium">
            <IconClock className="size-4 text-accent-700" />
            24/7 Operations Desk
          </Link>
          <div className="pt-1">
            <LanguageSwitcher tone="light" />
          </div>
        </div>
      </nav>
    </div>
  );
}
