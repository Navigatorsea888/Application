/**
 * Points .env at the Supabase database.
 *
 *   npm run db:connect
 *
 * Asks for the database password, works out the rest, and checks the
 * connection before writing anything. The password is read from the terminal
 * with echo off and never appears in argv, so it does not land in shell
 * history, and it is never printed or logged.
 *
 * It handles the two things that are easy to get wrong by hand: URL-encoding a
 * password containing @ : / ? # [ ] %, and using the right host and port for
 * each of the two connection strings.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { Client } from "pg";

const ENV_PATH = ".env";

// Regions Supabase runs the pooler in. Probed in turn until one recognises the
// project; the survivor is the region.
const REGIONS = [
  "ap-northeast-1", "ap-south-1", "ap-southeast-1", "ap-southeast-2",
  "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1",
  "us-east-1", "us-east-2", "us-west-1", "us-west-2", "ca-central-1",
  "sa-east-1", "ap-northeast-2",
];

function readEnv(): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
    if (!line.includes("=") || line.trimStart().startsWith("#")) continue;
    const index = line.indexOf("=");
    map.set(line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^"|"$/g, ""));
  }
  return map;
}

/** Reads a line from the terminal without echoing it. */
function askSecret(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const stdout = process.stdout as NodeJS.WriteStream & { muted?: boolean };
    stdout.muted = false;

    // Swallow everything after the prompt so keystrokes are not echoed.
    const write = stdout.write.bind(stdout);
    (stdout as unknown as { write: typeof write }).write = ((chunk: string, ...rest: unknown[]) =>
      stdout.muted && chunk !== "\n" ? true : write(chunk, ...(rest as []))) as typeof write;

    rl.question(prompt, (answer) => {
      (stdout as unknown as { write: typeof write }).write = write;
      process.stdout.write("\n");
      rl.close();
      resolve(answer);
    });
    stdout.muted = true;
  });
}

async function probe(host: string, user: string, password: string): Promise<"ok" | "wrong-password" | "no-tenant"> {
  const client = new Client({
    host,
    port: 5432,
    user,
    password,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10_000,
  });
  try {
    await client.connect();
    await client.end();
    return "ok";
  } catch (error) {
    const message = (error as Error).message.toLowerCase();
    if (message.includes("not found") || message.includes("enotfound")) return "no-tenant";
    if (message.includes("password") || message.includes("authentication")) return "wrong-password";
    return "no-tenant";
  }
}

async function main() {
  const env = readEnv();
  const supabaseUrl = env.get("SUPABASE_URL") ?? "";
  const ref = supabaseUrl.replace("https://", "").replace(".supabase.co", "").replace(/\/$/, "");

  if (!ref) {
    console.error("SUPABASE_URL is not set in .env — cannot work out the project reference.");
    process.exit(1);
  }

  console.log(`\nProject: ${ref}`);
  console.log("Password: Supabase dashboard → Settings → Database → Database password.");
  console.log("It is not shown again after creation; reset it there if you do not have it.\n");

  const password = await askSecret("Database password (hidden): ");
  if (!password) {
    console.error("No password entered.");
    process.exit(1);
  }

  const user = `postgres.${ref}`;
  process.stdout.write("Locating the project's region");

  let region: string | null = null;
  let sawWrongPassword = false;

  for (const candidate of REGIONS) {
    process.stdout.write(".");
    const result = await probe(`aws-0-${candidate}.pooler.supabase.com`, user, password);
    if (result === "ok") {
      region = candidate;
      break;
    }
    if (result === "wrong-password") {
      sawWrongPassword = true;
      region = candidate;
      break;
    }
  }
  process.stdout.write("\n\n");

  if (!region) {
    console.error("Could not find the project in any known region.");
    console.error("Copy the strings from the dashboard instead: Connect → ORMs → Prisma.");
    process.exit(1);
  }

  if (sawWrongPassword) {
    console.error(`Found the project in ${region}, but that password was rejected.`);
    console.error("Check it, or reset it under Settings → Database, then run this again.");
    process.exit(1);
  }

  console.log(`✓ Connected — region ${region}\n`);

  // URL-encode so a password containing @ : / ? # [ ] % cannot break the string.
  const encoded = encodeURIComponent(password);
  const host = `aws-0-${region}.pooler.supabase.com`;
  const pooled = `postgresql://${user}:${encoded}@${host}:6543/postgres?pgbouncer=true&connection_limit=1`;
  const direct = `postgresql://${user}:${encoded}@${host}:5432/postgres`;

  const lines = readFileSync(ENV_PATH, "utf8").split("\n");
  const out: string[] = [];
  let replacedPooled = false;
  let replacedDirect = false;

  for (const line of lines) {
    if (/^DATABASE_URL=/.test(line)) {
      if (!replacedPooled) {
        out.push(`# Previous: ${line.replace(/:[^:@]*@/, ":<redacted>@")}`);
        out.push(`DATABASE_URL="${pooled}"`);
        replacedPooled = true;
      }
      continue;
    }
    if (/^DIRECT_URL=/.test(line)) {
      if (!replacedDirect) {
        out.push(`# Previous: ${line.replace(/:[^:@]*@/, ":<redacted>@")}`);
        out.push(`DIRECT_URL="${direct}"`);
        replacedDirect = true;
      }
      continue;
    }
    out.push(line);
  }

  writeFileSync(ENV_PATH, out.join("\n"));

  console.log("Wrote DATABASE_URL (pooler, 6543) and DIRECT_URL (direct, 5432) to .env.");
  console.log("The previous values are kept above each, commented out and redacted.\n");
  console.log("Next:");
  console.log("  npm run setup           # migrate + seed");
  console.log("  npm run db:check-rls    # confirm the API is locked off");
  console.log("  npm run supabase:setup  # full configuration check\n");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
