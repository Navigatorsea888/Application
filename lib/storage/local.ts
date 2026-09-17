import "server-only";
import { mkdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageDriver, StoredObject } from "./types";

/**
 * Files on local disk. Correct for a VPS or a container with a persistent
 * volume; wrong for a serverless host, whose filesystem is ephemeral and
 * per-instance. Used by default in development and by the test suite.
 */
const ROOT = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : path.join(process.cwd(), "storage", "uploads");

/** Resolves a key inside ROOT, refusing anything that escapes it. */
function resolveKey(key: string): string | null {
  const relative = key.replace(/^\/+/, "");
  if (!relative || relative.includes("\0")) return null;
  const absolute = path.resolve(ROOT, relative);
  if (absolute !== ROOT && !absolute.startsWith(ROOT + path.sep)) return null;
  return absolute;
}

export const localDriver: StorageDriver = {
  name: "local",

  async put(key, body) {
    const absolute = resolveKey(key);
    if (!absolute) throw new Error("Invalid storage key.");
    await mkdir(path.dirname(absolute), { recursive: true });
    await writeFile(absolute, body);
  },

  async get(key): Promise<StoredObject | null> {
    const absolute = resolveKey(key);
    if (!absolute) return null;
    try {
      const info = await stat(absolute);
      if (!info.isFile()) return null;
      return { body: await readFile(absolute), contentType: "application/octet-stream", size: info.size };
    } catch {
      return null;
    }
  },

  async remove(key) {
    const absolute = resolveKey(key);
    if (!absolute) return;
    try {
      await unlink(absolute);
    } catch (error) {
      // A missing file is not a reason to fail the database deletion.
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error("[storage:local] could not remove file", error);
      }
    }
  },

  async healthCheck() {
    try {
      await mkdir(ROOT, { recursive: true });
      const probe = `healthcheck-${Date.now()}.png`;
      await this.put(probe, Buffer.from("ok"), "image/png");
      await this.remove(probe);
      return { ok: true, detail: `Writable: ${ROOT}` };
    } catch (error) {
      return { ok: false, detail: `Cannot write to ${ROOT}: ${(error as Error).message}` };
    }
  },
};
