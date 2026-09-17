/**
 * Object storage behind checkpoint attachments.
 *
 * Two drivers implement this: `local` (a directory on disk) and `supabase`
 * (a private Storage bucket). Which one runs is decided by STORAGE_DRIVER, so
 * development needs no Supabase project and production needs no writable disk.
 *
 * A `key` is the object's path within the store, `<shipmentId>/<uuid>.<ext>`.
 * Callers never build one by hand — `storeUpload` returns it.
 */
export interface StoredObject {
  body: Buffer;
  contentType: string;
  size: number;
}

export interface StorageDriver {
  readonly name: "local" | "supabase";
  put(key: string, body: Buffer, contentType: string): Promise<void>;
  get(key: string): Promise<StoredObject | null>;
  remove(key: string): Promise<void>;
  /** Called at startup by `npm run storage:check` to surface misconfiguration. */
  healthCheck(): Promise<{ ok: boolean; detail: string }>;
}

export class StorageError extends Error {}
