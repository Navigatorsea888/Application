import Link from "next/link";
import { IconArrowRight, IconSearch } from "./icons";

/**
 * Homepage tracking entry point. A plain GET form to /track, so it works
 * without JavaScript and produces a shareable URL. The verification field
 * lives on /track itself rather than here, to keep the homepage to one input.
 */
export function TrackWidget({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isDark = tone === "dark";
  return (
    <form
      action="/track"
      method="get"
      className={`rounded-lg border p-5 sm:p-6 ${
        isDark ? "border-white/15 bg-white/[0.07] backdrop-blur" : "border-ink-200 bg-white"
      }`}
    >
      <label
        htmlFor="home-tracking-id"
        className={`block font-[family-name:var(--font-display)] text-sm font-medium ${
          isDark ? "text-white" : "text-ink-900"
        }`}
      >
        Track your shipment
      </label>
      <p className={`mt-1 text-sm ${isDark ? "text-ink-300" : "text-ink-500"}`}>
        Enter the Tracking ID from your booking confirmation.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <IconSearch
            className={`pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 ${
              isDark ? "text-ink-400" : "text-ink-400"
            }`}
          />
          <input
            id="home-tracking-id"
            name="id"
            type="text"
            required
            autoComplete="off"
            spellCheck={false}
            placeholder="NSL-2026-0001"
            pattern="[A-Za-z]{3}-[0-9]{4}-[0-9]{4,}"
            title="Tracking IDs look like NSL-2026-0001"
            className={`h-12 w-full rounded-md border pl-10 pr-3 font-[family-name:var(--font-mono)] text-[0.9375rem] tracking-wide placeholder:font-[family-name:var(--font-sans)] placeholder:tracking-normal ${
              isDark
                ? "border-white/20 bg-ink-950/50 text-white placeholder:text-ink-500"
                : "border-ink-300 bg-white text-ink-900 placeholder:text-ink-400"
            }`}
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-accent-600 px-6 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700"
        >
          Track
          <IconArrowRight className="size-4" />
        </button>
      </div>

      <p className={`mt-3 text-xs ${isDark ? "text-ink-400" : "text-ink-500"}`}>
        You will also be asked for the consignee email or contract reference.{" "}
        <Link href="/faq" className="underline underline-offset-2 hover:text-accent-400">
          Why?
        </Link>
      </p>
    </form>
  );
}
