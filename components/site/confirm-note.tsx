import { IconAlert } from "@/components/icons";

/**
 * A `[CONFIRM]` note from the copy deck — a fact, figure, certification or
 * client name management must verify before launch — rendered as the gold
 * review box the deck describes.
 *
 * Shown on development and preview builds so reviewers see each item where it
 * sits on the page. Never shown in production unless
 * NEXT_PUBLIC_SHOW_CONFIRM_NOTES=true is set for a staging deployment.
 */
export function showConfirmNotes(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_CONFIRM_NOTES === "true";
}

export function ConfirmNote({ title, children }: { title: string; children: React.ReactNode }) {
  if (!showConfirmNotes()) return null;
  return (
    <aside
      role="note"
      className="my-6 rounded-lg border border-gold-500 bg-gold-50 px-4 py-3 text-sm text-ink-800 shadow-card"
    >
      <p className="flex items-center gap-2 font-[family-name:var(--font-display)] text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-ink-800">
        <IconAlert className="size-4" />
        Confirm before launch · {title}
      </p>
      <div className="mt-1.5 leading-relaxed">{children}</div>
    </aside>
  );
}
