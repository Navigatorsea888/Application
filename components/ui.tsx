import Link from "next/link";
import type { ReactNode } from "react";
import { SHIPMENT_STATUSES, isShipmentStatus, statusLabel } from "@/lib/constants";

/* -------------------------------------------------------------------------
   Small presentational primitives shared by the public site and the admin.
   Deliberately plain: no runtime CSS-in-JS, no variant library.
------------------------------------------------------------------------- */

type ButtonVariant = "primary" | "secondary" | "onDark" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_BASE =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md font-[family-name:var(--font-display)] font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-accent-600 text-white hover:bg-accent-700",
  secondary: "border border-ink-300 bg-white text-ink-800 hover:bg-ink-100 hover:border-ink-400",
  // For use on the navy hero. A separate variant rather than utility overrides:
  // Tailwind resolves conflicting classes by stylesheet order, not by the order
  // they appear in the attribute, so an override here is a coin toss.
  onDark: "border border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/10",
  ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-900",
  danger: "bg-danger-600 text-white hover:bg-danger-700",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-7 text-base",
};

export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra = "") {
  return `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${extra}`.trim();
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
} & Omit<React.ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-ink-200 bg-white ${className}`}>{children}</div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "light",
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow ? (
        <p className={`eyebrow ${tone === "dark" ? "text-accent-400" : ""}`}>{eyebrow}</p>
      ) : null}
      <h2 className={`mt-3 text-2xl sm:text-3xl ${tone === "dark" ? "text-white" : ""}`}>{title}</h2>
      {lead ? (
        <p className={`mt-4 text-[1.0625rem] leading-relaxed ${tone === "dark" ? "text-ink-300" : "text-ink-600"}`}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Status pill. Colour is meaning, never decoration: amber = exception. */
export function StatusBadge({ status, size = "md" }: { status: string; size?: "sm" | "md" }) {
  const meta = isShipmentStatus(status) ? SHIPMENT_STATUSES[status] : null;
  const isException = meta?.isException ?? false;
  const isDelivered = status === "DELIVERED";

  const tone = isException
    ? "border-signal-500 bg-signal-50 text-signal-700"
    : isDelivered
      ? "border-success-600 bg-success-50 text-success-700"
      : "border-accent-600 bg-accent-50 text-accent-700";

  const dimensions = size === "sm" ? "px-2 py-0.5 text-[0.6875rem]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-[family-name:var(--font-display)] font-medium ${tone} ${dimensions}`}
    >
      <span
        aria-hidden
        className={`size-1.5 rounded-full ${
          isException ? "bg-signal-600" : isDelivered ? "bg-success-600" : "bg-accent-600"
        }`}
      />
      {statusLabel(status)}
    </span>
  );
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "accent" | "signal" }) {
  const tones = {
    neutral: "border-ink-300 bg-ink-100 text-ink-700",
    accent: "border-accent-200 bg-accent-50 text-accent-700",
    signal: "border-signal-500 bg-signal-50 text-signal-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** Label/value row used on shipment detail views. */
export function DataRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 border-b border-ink-200 py-3 last:border-b-0 sm:grid-cols-[minmax(0,11rem)_1fr] sm:gap-4">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-[0.9375rem] text-ink-900">{children}</dd>
    </div>
  );
}

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-accent-200 bg-accent-50 text-accent-800",
    success: "border-success-600/30 bg-success-50 text-success-700",
    warning: "border-signal-500/40 bg-signal-50 text-signal-700",
    error: "border-danger-600/30 bg-danger-50 text-danger-700",
  };
  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${tones[tone]}`} role={tone === "error" ? "alert" : undefined}>
      {title ? <p className="font-semibold">{title}</p> : null}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-ink-300 bg-white px-6 py-12 text-center">
      <p className="font-[family-name:var(--font-display)] font-medium text-ink-800">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
