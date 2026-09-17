/**
 * Fails if any table in `public` is missing row-level security.
 *
 * Prisma Migrate does not enable RLS on tables it creates, and on Supabase a
 * table without RLS is readable over PostgREST by anyone holding the anon key.
 * The initial lockdown migration covers every table that existed when it ran;
 * this guard catches the next one somebody adds.
 *
 * Run it in CI and before every deploy:  npm run db:check-rls
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface TableRow {
  tablename: string;
  rowsecurity: boolean;
}

async function main() {
  const tables = await prisma.$queryRaw<TableRow[]>`
    SELECT tablename, rowsecurity
    FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename
  `;

  if (tables.length === 0) {
    console.error("No tables found in the public schema. Has the migration run?");
    process.exit(1);
  }

  const unprotected = tables.filter((t) => !t.rowsecurity);

  for (const table of tables) {
    console.log(`  ${table.rowsecurity ? "✓" : "✗"} ${table.tablename}`);
  }

  console.log("");

  if (unprotected.length > 0) {
    console.error(
      `${unprotected.length} table(s) without row-level security: ${unprotected
        .map((t) => t.tablename)
        .join(", ")}`,
    );
    console.error("");
    console.error("On Supabase these are readable over PostgREST with the anon key,");
    console.error("which is public. Add a migration containing, for each table:");
    console.error("");
    for (const table of unprotected) {
      console.error(`  ALTER TABLE public."${table.tablename}" ENABLE ROW LEVEL SECURITY;`);
    }
    process.exit(1);
  }

  // The grant check only means anything on a Supabase database.
  const roles = await prisma.$queryRaw<Array<{ rolname: string }>>`
    SELECT rolname FROM pg_roles WHERE rolname IN ('anon', 'authenticated')
  `;

  if (roles.length > 0) {
    const grants = await prisma.$queryRaw<Array<{ grantee: string; count: bigint }>>`
      SELECT grantee, count(*) AS count
      FROM information_schema.role_table_grants
      WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated')
      GROUP BY grantee
    `;

    if (grants.length > 0) {
      console.error("Public-schema grants still held by the PostgREST roles:");
      for (const grant of grants) console.error(`  ${grant.grantee}: ${grant.count} grant(s)`);
      console.error("");
      console.error("Re-apply prisma/migrations/*_lock_down_public_api/migration.sql");
      process.exit(1);
    }
    console.log("  ✓ anon and authenticated hold no grants on public");
  } else {
    console.log("  (roles anon/authenticated absent — not a Supabase database)");
  }

  console.log("");
  console.log(`All ${tables.length} table(s) protected.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
