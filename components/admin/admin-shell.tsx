"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconClose,
  IconDashboard,
  IconDocument,
  IconInbox,
  IconLogout,
  IconMenu,
  IconPackage,
  IconUsers,
} from "@/components/icons";
import type { SessionUser } from "@/lib/auth";
import { OFFICES, ROLES } from "@/lib/constants";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: IconDashboard, exact: true },
  { href: "/admin/shipments", label: "Shipments", icon: IconPackage },
  { href: "/admin/quotes", label: "Quote requests", icon: IconDocument },
  { href: "/admin/enquiries", label: "Enquiries", icon: IconInbox },
  { href: "/admin/clients", label: "Clients", icon: IconUsers },
] as const;

const ADMIN_ONLY_NAV = [
  { href: "/admin/users", label: "Staff accounts", icon: IconUsers },
  { href: "/admin/notifications", label: "Notification log", icon: IconInbox },
] as const;

export function AdminShell({
  user,
  badges,
  children,
  logoutAction,
}: {
  user: SessionUser;
  badges: { quotes: number; enquiries: number };
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  const badgeFor = (href: string) =>
    href === "/admin/quotes" ? badges.quotes : href === "/admin/enquiries" ? badges.enquiries : 0;

  const navItems = user.role === "ADMIN" ? [...NAV, ...ADMIN_ONLY_NAV] : NAV;

  return (
    <div className="lg:flex">
      {/* Mobile bar */}
      <div className="no-print flex items-center justify-between border-b border-ink-200 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="admin-nav"
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid size-10 cursor-pointer place-items-center rounded-md border border-ink-300"
        >
          {open ? <IconClose className="size-5" /> : <IconMenu className="size-5" />}
        </button>
      </div>

      <aside
        id="admin-nav"
        className={`no-print ${open ? "block" : "hidden"} border-b border-ink-800 bg-ink-900 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden border-b border-ink-800 px-5 py-5 lg:block">
            <Logo variant="light" />
          </div>

          <nav aria-label="Admin" className="flex-1 space-y-1 p-3">
            {navItems.map((item) => {
              const active = isActive(item.href, "exact" in item ? item.exact : undefined);
              const badge = badgeFor(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    active ? "bg-accent-600 text-white" : "text-ink-300 hover:bg-ink-800 hover:text-white"
                  }`}
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {badge > 0 ? (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[0.6875rem] font-semibold ${
                        active ? "bg-white/25 text-white" : "bg-signal-500 text-ink-900"
                      }`}
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-ink-800 p-3">
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="mt-0.5 truncate text-xs text-ink-400">
                {ROLES[user.role]} · {OFFICES[user.office as keyof typeof OFFICES] ?? user.office}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink-300 transition-colors duration-150 hover:bg-ink-800 hover:text-white"
              >
                <IconLogout className="size-4" />
                Sign out
              </button>
            </form>
            <Link
              href="/"
              className="mt-1 block rounded-md px-3 py-2 text-xs text-ink-400 transition-colors duration-150 hover:text-white"
            >
              View public site ↗
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

/** Page header used by every admin screen. */
export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 bg-white px-5 py-6 sm:px-8">
      <div className="min-w-0">
        <h1 className="text-2xl">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2 no-print">{actions}</div> : null}
    </div>
  );
}
