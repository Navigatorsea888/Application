"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * On-screen controls for the print report. Hidden from paper by `.no-print`,
 * and it opens the print dialog once on load so the page behaves like an export
 * rather than a page you have to know to print.
 */
export function PrintTrigger({
  shipmentId,
  includeInternal,
}: {
  shipmentId: string;
  includeInternal: boolean;
}) {
  useEffect(() => {
    // A frame's delay lets fonts settle, otherwise the dialog can capture a
    // fallback typeface.
    const timer = window.setTimeout(() => window.print(), 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="no-print mb-6 flex flex-wrap items-center gap-3 rounded-md border border-ink-200 bg-ink-50 px-4 py-3">
      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-9 cursor-pointer items-center rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-700"
      >
        Print / Save as PDF
      </button>

      <Link
        href={`/admin/shipments/${shipmentId}/print${includeInternal ? "" : "?internal=1"}`}
        className="inline-flex h-9 items-center rounded-md border border-ink-300 bg-white px-4 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
      >
        {includeInternal ? "Switch to client copy" : "Switch to internal copy"}
      </Link>

      <Link
        href={`/admin/shipments/${shipmentId}`}
        className="text-sm text-ink-600 underline underline-offset-2 hover:text-ink-900"
      >
        Back to shipment
      </Link>

      <p className="w-full text-xs text-ink-500">
        {includeInternal
          ? "Internal copy — includes transport document numbers, internal notes and internal-only checkpoints. Do not send to the client."
          : "Client copy — commercial references and internal checkpoints are excluded."}{" "}
        Choose &ldquo;Save as PDF&rdquo; as the destination in the print dialog.
      </p>
    </div>
  );
}
