import { PrismaClient } from "@prisma/client";

/**
 * Guards against the database quietly being the wrong one.
 *
 * Two failure modes this exists to prevent:
 *
 *  1. Running with the `[YOUR-PASSWORD]` placeholder still in DATABASE_URL, so
 *     the app appears configured but cannot connect.
 *  2. Writing production data to a Postgres on someone's laptop because the
 *     local development URL was never swapped out. Shipment records belong in
 *     Supabase; a local database silently collecting them is worse than an
 *     outage, because nobody notices until the laptop is gone.
 */
function assertDatabaseTarget(): void {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set.\n" +
        "Run `npm run db:connect` to point this at Supabase, or copy the strings\n" +
        "from the dashboard under Connect → ORMs → Prisma.",
    );
  }

  if (url.includes("[YOUR-PASSWORD]") || url.includes("[PROJECT-REF]") || url.includes("[REGION]")) {
    throw new Error(
      "DATABASE_URL still contains a placeholder — the database password has not been set.\n\n" +
        "  npm run db:connect     asks for the password and writes both URLs\n\n" +
        "The password is in the Supabase dashboard under Settings → Database.",
    );
  }

  const isLocal = /@(localhost|127\.0\.0\.1|::1|host\.docker\.internal)[:/]/.test(url);
  if (!isLocal) return;

  // `next build` sets NODE_ENV=production while only compiling — no request is
  // served and no data is written, so a local database is fine there. The check
  // that matters is a production server actually handling traffic.
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

  // A local database serving production traffic is never intentional.
  if (process.env.NODE_ENV === "production" && !isBuildPhase) {
    throw new Error(
      "DATABASE_URL points at a local Postgres, but NODE_ENV is production.\n" +
        "Refusing to start: shipment records would be written to a database that\n" +
        "is not backed up and not reachable by anyone else.\n\n" +
        "  npm run db:connect     point this at Supabase",
    );
  }

  // Outside production it is allowed, but never silently.
  console.warn(
    "\n\x1b[33m⚠  Using a LOCAL database — data is NOT going to Supabase.\x1b[0m\n" +
      "   Anything recorded here stays on this machine.\n" +
      "   Run `npm run db:connect` to switch to Supabase.\n",
  );
}

assertDatabaseTarget();

// Next.js hot-reloads modules in development, which would otherwise open a new
// connection pool on every edit until the database refuses connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
