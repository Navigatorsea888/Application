"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { navigation } from "@/lib/content";
import { IconClose, IconMenu, IconSearch } from "./icons";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation, otherwise it stays open over the new page.
  useEffect(() => setOpen(false), [pathname]);

  // Prevent the page behind the drawer from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`rounded-md px-3 py-2 text-[0.9375rem] font-medium transition-colors duration-150 ${
                isActive(item.href)
                  ? "bg-ink-100 text-ink-900"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/track"
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-ink-300 px-4 text-sm font-medium text-ink-800 transition-colors duration-150 hover:border-ink-400 hover:bg-ink-100"
          >
            <IconSearch className="size-4" />
            Track
          </Link>
          <Link
            href="/quote"
            className="inline-flex h-10 cursor-pointer items-center rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-700"
          >
            Request a Quote
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          className="grid size-11 cursor-pointer place-items-center rounded-md border border-ink-300 text-ink-800 transition-colors duration-150 hover:bg-ink-100 lg:hidden"
        >
          {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-ink-200 bg-white lg:hidden">
          <nav aria-label="Main (mobile)" className="container-page flex flex-col py-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-md px-3 py-3 text-base font-medium ${
                  isActive(item.href) ? "bg-ink-100 text-ink-900" : "text-ink-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/quote"
              className="mt-3 inline-flex h-12 items-center justify-center rounded-md bg-accent-600 px-4 font-medium text-white"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
