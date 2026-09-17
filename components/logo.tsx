import Link from "next/link";

/**
 * Wordmark. Drawn rather than an image file so it stays crisp at any size and
 * inherits colour from its context (navy on light, white on the dark header).
 * Replace with the official artwork when brand assets are supplied.
 */
export function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const primary = variant === "light" ? "text-white" : "text-ink-900";
  const secondary = variant === "light" ? "text-accent-200" : "text-accent-600";
  const rule = variant === "light" ? "bg-white/25" : "bg-ink-300";

  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label="Navigator Sea Land — home">
      <span
        aria-hidden
        className={`grid size-10 shrink-0 place-items-center rounded-sm border ${
          variant === "light" ? "border-white/30" : "border-ink-300"
        }`}
      >
        <svg viewBox="0 0 32 32" className={`size-6 ${secondary}`} fill="none" stroke="currentColor" strokeWidth={2}>
          {/* Compass needle over a horizon line: navigation, sea and land. */}
          <path d="M16 3 20 16 16 29 12 16Z" strokeLinejoin="round" />
          <path d="M3 16h26" strokeLinecap="round" opacity={0.45} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tracking-[0.14em] ${primary}`}>
          NAVIGATOR
        </span>
        <span className={`mt-1 flex items-center gap-2`}>
          <span className={`h-px w-4 ${rule}`} aria-hidden />
          <span className={`font-[family-name:var(--font-display)] text-[0.6rem] font-medium tracking-[0.22em] ${secondary}`}>
            SEA LAND
          </span>
        </span>
      </span>
    </Link>
  );
}
