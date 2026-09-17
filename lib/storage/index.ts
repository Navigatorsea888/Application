import "server-only";
import { localDriver } from "./local";
import { supabaseDriver } from "./supabase";
import type { StorageDriver } from "./types";

/**
 * Picks the driver from STORAGE_DRIVER. Defaults to `local`, so a developer
 * who has not set up a Supabase project still gets a working application.
 */
export function storage(): StorageDriver {
  const configured = (process.env.STORAGE_DRIVER ?? "local").trim().toLowerCase();

  switch (configured) {
    case "supabase":
      return supabaseDriver;
    case "local":
      return localDriver;
    default:
      throw new Error(`STORAGE_DRIVER must be "local" or "supabase", not "${configured}".`);
  }
}

export type { StorageDriver, StoredObject } from "./types";
export { StorageError } from "./types";
