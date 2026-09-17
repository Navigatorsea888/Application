/**
 * Prepares and checks the Supabase project: creates the private Storage bucket
 * if it is missing, and reports whether every piece of configuration the
 * application needs is actually present and working.
 *
 *   npm run supabase:setup
 *
 * Safe to re-run.
 */
import { PrismaClient } from "@prisma/client";

async function main() {
  const results: Array<{ name: string; ok: boolean; detail: string }> = [];
  const record = (name: string, ok: boolean, detail: string) => {
    results.push({ name, ok, detail });
    console.log(`  ${ok ? "✓" : "✗"} ${name.padEnd(28)} ${detail}`);
  };

  console.log("\nSupabase configuration\n");

  // --- Environment -----------------------------------------------------------
  const databaseUrl = process.env.DATABASE_URL ?? "";
  const directUrl = process.env.DIRECT_URL ?? "";
  const storageDriver = (process.env.STORAGE_DRIVER ?? "local").toLowerCase();

  const isSupabaseDb = databaseUrl.includes("supabase.co") || databaseUrl.includes("supabase.com");
  record(
    "DATABASE_URL",
    Boolean(databaseUrl),
    isSupabaseDb
      ? databaseUrl.includes("6543") && databaseUrl.includes("pgbouncer=true")
        ? "Supabase transaction pooler"
        : "Supabase, but NOT the pooler — use port 6543 with ?pgbouncer=true"
      : databaseUrl
        ? "not Supabase (local Postgres)"
        : "missing",
  );

  record(
    "DIRECT_URL",
    Boolean(directUrl),
    !directUrl
      ? "missing — Prisma Migrate needs a direct connection"
      : isSupabaseDb && directUrl.includes("6543")
        ? "points at the pooler — migrations need port 5432"
        : "set",
  );

  // --- Database --------------------------------------------------------------
  const prisma = new PrismaClient();
  try {
    const [{ version }] = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
    record("Database connection", true, version.split(" ").slice(0, 2).join(" "));

    const [{ count }] = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT count(*) AS count FROM pg_tables WHERE schemaname = 'public' AND NOT rowsecurity
    `;
    record(
      "Row-level security",
      Number(count) === 0,
      Number(count) === 0
        ? "enabled on every public table"
        : `${count} table(s) UNPROTECTED — run: npm run db:check-rls`,
    );
  } catch (error) {
    record("Database connection", false, (error as Error).message.split("\n")[0]!);
  } finally {
    await prisma.$disconnect();
  }

  // --- Storage ---------------------------------------------------------------
  if (storageDriver === "supabase") {
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      record(
        "Supabase Storage",
        false,
        `missing ${!url ? "SUPABASE_URL" : ""}${!url && !serviceKey ? " and " : ""}${!serviceKey ? "SUPABASE_SERVICE_ROLE_KEY" : ""}`,
      );
    } else {
      try {
        const { ensureBucket, supabaseDriver } = await import("../lib/storage/supabase");
        record("Storage bucket", true, await ensureBucket());
        const health = await supabaseDriver.healthCheck();
        record("Storage read/write", health.ok, health.detail);
      } catch (error) {
        record("Supabase Storage", false, (error as Error).message.split("\n")[0]!);
      }
    }
  } else {
    const { localDriver } = await import("../lib/storage/local");
    const health = await localDriver.healthCheck();
    record("Storage (local driver)", health.ok, health.detail);
    console.log(
      "\n  Note: STORAGE_DRIVER is 'local'. Attachments live on disk, which is\n" +
        "  correct for a VPS with a persistent volume and wrong for a serverless\n" +
        "  host. Set STORAGE_DRIVER=supabase to use the Storage bucket.",
    );
  }

  const failed = results.filter((r) => !r.ok);
  console.log("");
  if (failed.length > 0) {
    console.error(`${failed.length} check(s) failed.\n`);
    process.exit(1);
  }
  console.log("All checks passed.\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
