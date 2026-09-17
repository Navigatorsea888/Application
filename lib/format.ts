/**
 * Dates are formatted in a fixed locale and UTC so that a shipment reads the
 * same in Almaty, Mumbai and a client's office in Rotterdam. Operations enter
 * checkpoint times as local time at the checkpoint; the display carries no
 * timezone claim beyond the date and time recorded.
 */
const DATE_OPTS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
};

const DATETIME_OPTS: Intl.DateTimeFormatOptions = {
  ...DATE_OPTS,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", DATE_OPTS).format(date);
}

export function formatDateTime(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", DATETIME_OPTS).format(date);
}

export function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function formatWeight(kg: number | null | undefined): string {
  if (kg === null || kg === undefined) return "—";
  if (kg >= 1000) {
    const tonnes = kg / 1000;
    return `${tonnes.toLocaleString("en-GB", { maximumFractionDigits: 2 })} t (${kg.toLocaleString("en-GB")} kg)`;
  }
  return `${kg.toLocaleString("en-GB")} kg`;
}

export function formatDimensions(
  l: number | null | undefined,
  w: number | null | undefined,
  h: number | null | undefined,
): string {
  if (l == null && w == null && h == null) return "—";
  const part = (n: number | null | undefined) =>
    n == null ? "?" : n.toLocaleString("en-GB", { maximumFractionDigits: 1 });
  return `${part(l)} × ${part(w)} × ${part(h)} cm`;
}

export function formatRoute(
  originCity: string,
  originCountry: string,
  destinationCity: string,
  destinationCountry: string,
): string {
  return `${originCity}, ${originCountry} → ${destinationCity}, ${destinationCountry}`;
}

/** Relative day count, used for "ETA in 4 days" style hints in the admin. */
export function daysUntil(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return null;
  const msPerDay = 86_400_000;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - startOfToday.getTime()) / msPerDay);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
