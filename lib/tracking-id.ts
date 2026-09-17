import { prisma } from "./db";

/**
 * Tracking IDs are NSL-YYYY-NNNN, sequential within the calendar year.
 *
 * The sequence is derived from the highest existing ID for the year rather
 * than a counter table, so restoring a database backup cannot hand out an ID
 * that is already in use. The unique constraint on Shipment.trackingId is the
 * real guarantee; the retry loop below absorbs the race between two operators
 * creating a shipment at the same moment.
 */
export const TRACKING_ID_PATTERN = /^NSL-\d{4}-\d{4,}$/;

export function isValidTrackingId(value: string): boolean {
  return TRACKING_ID_PATTERN.test(value.trim().toUpperCase());
}

export function normalizeTrackingId(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}

export async function nextTrackingId(year = new Date().getFullYear()): Promise<string> {
  const prefix = `NSL-${year}-`;
  const latest = await prisma.shipment.findFirst({
    where: { trackingId: { startsWith: prefix } },
    orderBy: { trackingId: "desc" },
    select: { trackingId: true },
  });

  const lastSequence = latest ? Number.parseInt(latest.trackingId.slice(prefix.length), 10) : 0;
  const next = Number.isFinite(lastSequence) ? lastSequence + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

/**
 * Runs `create` with a freshly generated Tracking ID, retrying on the unique
 * constraint so concurrent creates cannot collide.
 */
export async function withGeneratedTrackingId<T>(
  create: (trackingId: string) => Promise<T>,
  attempts = 5,
): Promise<T> {
  for (let attempt = 0; attempt < attempts; attempt++) {
    const trackingId = await nextTrackingId();
    try {
      return await create(trackingId);
    } catch (error: unknown) {
      const code = (error as { code?: string }).code;
      const isUniqueViolation = code === "P2002";
      if (!isUniqueViolation || attempt === attempts - 1) throw error;
    }
  }
  throw new Error("Could not allocate a Tracking ID after several attempts.");
}
