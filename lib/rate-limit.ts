import "server-only";
import { prisma } from "./db";

/**
 * Database-backed sliding window. Deliberately not in-memory: the tracking form
 * is the one public surface that reveals shipment data, and an in-memory counter
 * resets on every deploy and is useless across more than one server instance.
 *
 * The window is kept to TWO queries on the allowed path — a count and an insert.
 * Every query is a network round trip to the database region (~250 ms when the
 * app runs far from it), so a third query here would be felt by the user on
 * every form submission.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const DAY_MS = 24 * 3600 * 1000;

/**
 * Expired rows are cleared occasionally rather than on every call. Doing it
 * inline on each request added a full round trip to every form submission to
 * delete rows that nobody was going to read anyway.
 */
let lastSweep = 0;
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;

function sweepIfDue(): void {
  const now = Date.now();
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;

  // Not awaited: the caller must not wait for housekeeping.
  prisma.rateLimit
    .deleteMany({ where: { createdAt: { lt: new Date(now - DAY_MS) } } })
    .catch((error) => console.error("[rate-limit] sweep failed", error));
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);

  try {
    sweepIfDue();

    const used = await prisma.rateLimit.count({
      where: { key, createdAt: { gte: windowStart } },
    });

    if (used >= limit) {
      const oldest = await prisma.rateLimit.findFirst({
        where: { key, createdAt: { gte: windowStart } },
        orderBy: { createdAt: "asc" },
        select: { createdAt: true },
      });
      const retryAfterSeconds = oldest
        ? Math.max(1, Math.ceil((oldest.createdAt.getTime() + windowSeconds * 1000 - Date.now()) / 1000))
        : windowSeconds;
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    await prisma.rateLimit.create({ data: { key } });
    return { allowed: true, remaining: limit - used - 1, retryAfterSeconds: 0 };
  } catch (error) {
    // A rate-limiter outage must not lock clients out of their own shipments.
    console.error("[rate-limit] check failed, allowing request", error);
    return { allowed: true, remaining: limit, retryAfterSeconds: 0 };
  }
}

/** Best-effort client IP from the usual proxy headers. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
