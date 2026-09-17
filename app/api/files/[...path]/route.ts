import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { FILE_ROUTE_PREFIX, readUpload } from "@/lib/uploads";

export const dynamic = "force-dynamic";

/**
 * Serves checkpoint attachments from whichever storage driver is configured.
 *
 * Access is decided by the attachment record, not by the store:
 *
 *  - Client-visible attachments are served to anyone holding the URL. The URL
 *    contains a random UUID and is only ever published on a tracking page that
 *    already required the Tracking ID plus a second identifier to reach.
 *  - Internal-only attachments require a signed-in staff session.
 *
 * Bytes are streamed through this route rather than handed out as a signed
 * storage URL, so that check stays in the request path for every fetch. A
 * signed URL is checked once and is then forwardable by anyone who has it.
 *
 * An object with no attachment row is never served, so an orphan left behind by
 * a failed delete is unreachable.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const storagePath = `${FILE_ROUTE_PREFIX}${segments.join("/")}`;

  // The same response for "no such file" and "not allowed", so the endpoint
  // cannot be used to discover which attachments exist.
  const notFound = NextResponse.json({ error: "Not found" }, { status: 404 });

  const attachment = await prisma.attachment.findFirst({
    where: { storagePath },
    select: { storagePath: true, fileName: true, mimeType: true, isClientVisible: true },
  });
  if (!attachment) return notFound;

  if (!attachment.isClientVisible && !(await getSessionUser())) return notFound;

  const object = await readUpload(attachment.storagePath);
  if (!object) return notFound;

  return new NextResponse(new Uint8Array(object.body), {
    headers: {
      // The recorded type, not the store's guess — the upload allowlist is what
      // vouches for it.
      "Content-Type": attachment.mimeType,
      "Content-Length": String(object.size),
      // `inline` so photographs open in the browser. The filename is quoted and
      // stripped of anything that could break out of the header.
      "Content-Disposition": `inline; filename="${attachment.fileName.replace(/["\\\r\n]/g, "_")}"`,
      // Private: an internal attachment must never sit in a shared cache.
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
