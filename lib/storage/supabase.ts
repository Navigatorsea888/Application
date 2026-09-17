import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { StorageDriver, StoredObject } from "./types";

/**
 * Supabase Storage, in a PRIVATE bucket.
 *
 * Two things are deliberate here:
 *
 * 1. The service-role key is used, and it must never reach the browser. It
 *    bypasses row-level security entirely. It is read from a non-`NEXT_PUBLIC_`
 *    variable and this module is server-only, so importing it from a client
 *    component is a build error rather than a leak.
 *
 * 2. Objects are downloaded through the service role and streamed back by our
 *    own `/api/files` route rather than handed out as signed URLs. That keeps
 *    the internal-only check on each attachment in the request path. A signed
 *    URL is checked once and then forwardable by anyone who has it, which is
 *    the wrong shape for a document marked internal.
 */
let client: SupabaseClient | null = null;

/** A one-pixel PNG, used to prove the bucket accepts and returns bytes. */
const PROBE_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function bucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "shipment-attachments";
}

function getClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "STORAGE_DRIVER is 'supabase' but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. See .env.example.",
    );
  }

  client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export const supabaseDriver: StorageDriver = {
  name: "supabase",

  async put(key, body, contentType) {
    const { error } = await getClient()
      .storage.from(bucket())
      .upload(key, body, { contentType, upsert: false });

    if (error) throw new Error(`Supabase Storage upload failed: ${error.message}`);
  },

  async get(key): Promise<StoredObject | null> {
    const { data, error } = await getClient().storage.from(bucket()).download(key);
    if (error || !data) return null;

    const buffer = Buffer.from(await data.arrayBuffer());
    return {
      body: buffer,
      contentType: data.type || "application/octet-stream",
      size: buffer.byteLength,
    };
  },

  async remove(key) {
    const { error } = await getClient().storage.from(bucket()).remove([key]);
    // A missing object is not a reason to fail the database deletion.
    if (error) console.error("[storage:supabase] could not remove object", error.message);
  },

  async healthCheck() {
    try {
      const supabase = getClient();
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) return { ok: false, detail: `Cannot list buckets: ${error.message}` };

      const target = buckets?.find((b) => b.name === bucket());
      if (!target) {
        return {
          ok: false,
          detail: `Bucket "${bucket()}" does not exist. Run: npm run storage:setup`,
        };
      }
      if (target.public) {
        return {
          ok: false,
          detail: `Bucket "${bucket()}" is PUBLIC. Attachments marked internal would be readable by anyone with the URL. Make it private.`,
        };
      }

      // The probe must use a type the bucket actually allows, otherwise this
      // check fails against a correctly configured bucket.
      const probe = `healthcheck/${Date.now()}.png`;
      await this.put(probe, PROBE_PNG, "image/png");
      const read = await this.get(probe);
      await this.remove(probe);

      if (!read) return { ok: false, detail: "Wrote a probe object but could not read it back." };
      return { ok: true, detail: `Bucket "${bucket()}" is private and writable.` };
    } catch (error) {
      return { ok: false, detail: (error as Error).message };
    }
  },
};

/**
 * Creates the private bucket if it is missing. Called by `npm run storage:setup`
 * so the bucket is not something someone has to remember to click in the
 * dashboard.
 */
export async function ensureBucket(): Promise<string> {
  const supabase = getClient();
  const name = bucket();

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw new Error(`Cannot list buckets: ${listError.message}`);

  const existing = buckets?.find((b) => b.name === name);
  if (existing) {
    if (existing.public) {
      // Never silently leave a public bucket holding internal documents.
      const { error } = await supabase.storage.updateBucket(name, { public: false });
      if (error) throw new Error(`Bucket "${name}" is public and could not be made private: ${error.message}`);
      return `Bucket "${name}" already existed and was PUBLIC — switched to private.`;
    }
    return `Bucket "${name}" already exists and is private.`;
  }

  const { error } = await supabase.storage.createBucket(name, {
    public: false,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"],
  });
  if (error) throw new Error(`Could not create bucket "${name}": ${error.message}`);

  return `Created private bucket "${name}".`;
}
