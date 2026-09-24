import Link from "next/link";
import { IconArrowRight, IconPhone, IconWhatsApp } from "@/components/icons";
import { company } from "@/lib/content";

/** Deck 11.3: sticky bottom bar on mobile with "Quote" · "Call" · "WhatsApp". */
export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-ink-200 bg-white/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link
        href="/request-a-quote"
        className="flex h-14 items-center justify-center gap-1.5 bg-gold-500 font-[family-name:var(--font-display)] text-sm font-semibold text-ink-900"
      >
        Quote
        <IconArrowRight className="size-4" />
      </Link>
      <a
        href={company.phoneHref}
        className="flex h-14 items-center justify-center gap-1.5 font-[family-name:var(--font-display)] text-sm font-semibold text-ink-900"
      >
        <IconPhone className="size-4 text-accent-700" />
        Call
      </a>
      <a
        href={company.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-14 items-center justify-center gap-1.5 border-l border-ink-200 font-[family-name:var(--font-display)] text-sm font-semibold text-ink-900"
      >
        <IconWhatsApp className="size-4 text-accent-700" />
        WhatsApp
      </a>
    </nav>
  );
}

/** Deck 2.3: WhatsApp float button — desktop only; the mobile bar covers small screens. */
export function WhatsAppFloat() {
  return (
    <a
      href={company.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="no-print fixed bottom-6 right-6 z-40 hidden size-14 place-items-center rounded-full bg-accent-600 text-white shadow-card-hover transition-colors duration-150 hover:bg-accent-700 lg:grid"
    >
      <IconWhatsApp className="size-7" />
    </a>
  );
}
