/**
 * Upload guards. These decide what can be written into a directory we serve
 * back from our own origin, so the failure modes matter more than the happy
 * path.
 */
// Pin the storage driver before anything imports it. The suite must exercise
// the upload guards without reaching the network or writing into the real
// Supabase bucket, whatever STORAGE_DRIVER says in .env.
process.env.STORAGE_DRIVER = "local";

import { test, describe, after } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";

import {
  ALLOWED_MIME_TYPES,
  FILE_ROUTE_PREFIX,
  MAX_QUOTE_ATTACHMENT_BYTES,
  MAX_UPLOAD_BYTES,
  QUOTE_ALLOWED_MIME_TYPES,
  UploadError,
  readUpload,
  removeUpload,
  storageKeyFor,
  storeUpload,
} from "../lib/uploads";

const SHIPMENT_ID = "test-uploads-fixture";
const QUOTE_SCOPE = "quote-test-uploads-fixture";
const stored: string[] = [];

const XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

/** A one-pixel PNG. */
const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

function pngFile(name = "photo.png"): File {
  return new File([new Uint8Array(PNG_BYTES)], name, { type: "image/png" });
}

after(async () => {
  await Promise.all(stored.map((p) => removeUpload(p)));

  // Remove the directory too, so repeated runs do not leave empty fixture
  // folders behind in storage/.
  for (const scope of [SHIPMENT_ID, QUOTE_SCOPE]) {
    await rm(join(process.cwd(), "storage", "uploads", scope), { recursive: true, force: true });
  }
});

describe("Uploads", () => {
  test("stores an allowed file and returns a public path", async () => {
    const result = await storeUpload(pngFile(), SHIPMENT_ID);
    stored.push(result.storagePath);

    assert.match(
      result.storagePath,
      new RegExp(`^${FILE_ROUTE_PREFIX}${SHIPMENT_ID}/[0-9a-f-]{36}\\.png$`),
    );
    assert.equal(result.mimeType, "image/png");
    assert.equal(result.sizeBytes, PNG_BYTES.length);

    const roundTripped = await readUpload(result.storagePath);
    assert.ok(roundTripped, "the stored object should read back");
    assert.equal(roundTripped!.size, PNG_BYTES.length);
  });

  test("the stored name is generated, never taken from the upload", async () => {
    const result = await storeUpload(pngFile("../../../etc/passwd.png"), SHIPMENT_ID);
    stored.push(result.storagePath);

    assert.ok(!result.storagePath.includes(".."), "a crafted name must not escape the directory");
    assert.ok(!result.fileName.includes("/"), "the display name must not carry a path");
    // basename() discards the directory before the character filter runs, so the
    // traversal segments are gone rather than merely escaped.
    assert.equal(result.fileName, "passwd.png");
  });

  test("two uploads of the same file never collide", async () => {
    const a = await storeUpload(pngFile(), SHIPMENT_ID);
    const b = await storeUpload(pngFile(), SHIPMENT_ID);
    stored.push(a.storagePath, b.storagePath);
    assert.notEqual(a.storagePath, b.storagePath);
  });

  test("rejects a type that is not on the allowlist", async () => {
    const svg = new File(["<svg onload='alert(1)'/>"], "x.svg", { type: "image/svg+xml" });
    await assert.rejects(() => storeUpload(svg, SHIPMENT_ID), UploadError, "SVG can carry script");

    const html = new File(["<h1>hi</h1>"], "x.html", { type: "text/html" });
    await assert.rejects(() => storeUpload(html, SHIPMENT_ID), UploadError);
  });

  test("rejects an empty file", async () => {
    const empty = new File([], "empty.png", { type: "image/png" });
    await assert.rejects(() => storeUpload(empty, SHIPMENT_ID), UploadError);
  });

  test("rejects a file over the size limit", async () => {
    const big = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], "big.png", { type: "image/png" });
    await assert.rejects(() => storeUpload(big, SHIPMENT_ID), UploadError);
  });

  test("the allowlist covers what operations actually attach", () => {
    for (const type of ["image/jpeg", "image/png", "image/heic", "application/pdf"]) {
      assert.ok(ALLOWED_MIME_TYPES[type], `${type} should be attachable`);
    }
  });

  test("removal deletes the object and tolerates a missing one", async () => {
    const result = await storeUpload(pngFile(), SHIPMENT_ID);
    assert.ok(await readUpload(result.storagePath));

    await removeUpload(result.storagePath);
    assert.equal(await readUpload(result.storagePath), null);

    // Deleting twice must not throw — the database row is what matters.
    await removeUpload(result.storagePath);
  });

  test("only a generated key shape is accepted, whatever the driver", () => {
    // The key format is validated centrally, which closes traversal for every
    // storage driver at once rather than relying on each to defend itself.
    for (const bad of [
      `${FILE_ROUTE_PREFIX}../../package.json`,
      `${FILE_ROUTE_PREFIX}../.env`,
      `${FILE_ROUTE_PREFIX}a/../../../etc/passwd`,
      `${FILE_ROUTE_PREFIX}ship/notauuid.png`,
      `${FILE_ROUTE_PREFIX}ship/00000000-0000-0000-0000-000000000000.exe.sh`,
      `${FILE_ROUTE_PREFIX}ship/a/00000000-0000-0000-0000-000000000000.png`,
      FILE_ROUTE_PREFIX,
      "/uploads/ship/file.png",
      "",
    ]) {
      assert.equal(storageKeyFor(bad), null, `should refuse: ${bad}`);
    }

    assert.equal(
      storageKeyFor(`${FILE_ROUTE_PREFIX}ship123/8f14e45f-ea3c-4c2f-9d1b-0a2b3c4d5e6f.png`),
      "ship123/8f14e45f-ea3c-4c2f-9d1b-0a2b3c4d5e6f.png",
    );
  });

  test("removing a malformed key is a no-op", async () => {
    await removeUpload(`${FILE_ROUTE_PREFIX}../../package.json`);
    assert.ok(existsSync("package.json"), "package.json must survive");
  });

  test("rejects a shipment reference that is not a plain id", async () => {
    await assert.rejects(() => storeUpload(pngFile(), "../../etc"), UploadError);
    await assert.rejects(() => storeUpload(pngFile(), "a/b"), UploadError);
  });

  test("a spreadsheet is accepted with the quote allowlist and rejected with the default one", async () => {
    const xlsx = new File([new Uint8Array([0x50, 0x4b, 0x03, 0x04])], "packing-list.xlsx", { type: XLSX_TYPE });

    // Checkpoint attachments keep their narrow allowlist: operations attach
    // photographs and PDFs, and widening it there was never asked for.
    await assert.rejects(() => storeUpload(xlsx, SHIPMENT_ID), UploadError);

    const result = await storeUpload(xlsx, QUOTE_SCOPE, {
      allowed: QUOTE_ALLOWED_MIME_TYPES,
      maxBytes: MAX_QUOTE_ATTACHMENT_BYTES,
    });
    stored.push(result.storagePath);
    assert.match(result.storagePath, new RegExp(`^${FILE_ROUTE_PREFIX}${QUOTE_SCOPE}/[0-9a-f-]{36}\\.xlsx$`));
    assert.equal(result.mimeType, XLSX_TYPE);

    // The generated key must round-trip through the same shape check.
    assert.equal(storageKeyFor(result.storagePath), result.storagePath.slice(FILE_ROUTE_PREFIX.length));
    assert.ok(await readUpload(result.storagePath), "the stored spreadsheet should read back");
  });

  test("the quote allowlist is a superset of the checkpoint one and still excludes SVG", () => {
    for (const type of Object.keys(ALLOWED_MIME_TYPES)) {
      assert.ok(QUOTE_ALLOWED_MIME_TYPES[type], `${type} should also be attachable to a quote`);
    }
    assert.equal(QUOTE_ALLOWED_MIME_TYPES["image/svg+xml"], undefined);
    assert.equal(MAX_QUOTE_ATTACHMENT_BYTES, 20 * 1024 * 1024);
  });
});
