import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { PrintTrigger } from "@/components/admin/print-trigger";
import { CORRIDORS, MODES, parseList, statusLabel } from "@/lib/constants";
import { formatDate, formatDateTime, formatDimensions, formatWeight } from "@/lib/format";
import { company } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const shipment = await prisma.shipment.findUnique({ where: { id }, select: { trackingId: true } });
  return { title: `${shipment?.trackingId ?? "Shipment"} — report` };
}

/**
 * A single-shipment report laid out for paper. "Save as PDF" in the browser's
 * print dialog produces the PDF; generating one server-side would mean shipping
 * a headless browser to render a page this already renders correctly.
 *
 * The `internal` query parameter decides whether commercially sensitive detail
 * is included, so the same report can be printed for a client or for the file.
 */
export default async function ShipmentPrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ internal?: string }>;
}) {
  const { id } = await params;
  const { internal } = await searchParams;
  const includeInternal = internal === "1";

  const user = await requireUser();

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      owner: { select: { name: true } },
      checkpoints: {
        where: includeInternal ? {} : { isClientVisible: true },
        orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
        include: { createdBy: { select: { name: true } } },
      },
    },
  });

  if (!shipment) notFound();

  await recordAudit({
    user,
    action: "EXPORT",
    entityType: "Shipment",
    entityId: shipment.id,
    summary: `Printed ${includeInternal ? "internal" : "client"} report for ${shipment.trackingId}`,
  });

  const modes = parseList(shipment.modes).map((m) => MODES[m as keyof typeof MODES] ?? m);
  const corridors = parseList(shipment.corridors).map(
    (c) => CORRIDORS[c as keyof typeof CORRIDORS] ?? c,
  );

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 print:p-0">
      <PrintTrigger shipmentId={shipment.id} includeInternal={includeInternal} />

      {/* Letterhead */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-ink-900 pb-5">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-[0.12em] text-ink-900">
            NAVIGATOR SEA LAND
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-ink-600">
            Project Freight Forwarding &amp; Multimodal Logistics
          </p>
          <p className="mt-2 text-xs text-ink-600">
            Almaty · Atyrau · Mumbai &nbsp;|&nbsp; {company.email}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-ink-600">Shipment report</p>
          <p className="font-[family-name:var(--font-mono)] text-xl font-semibold text-ink-900">
            {shipment.trackingId}
          </p>
          <p className="mt-1 text-xs text-ink-600">Issued {formatDate(new Date())}</p>
          {includeInternal ? (
            <p className="mt-1 inline-block border border-signal-600 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-signal-700">
              Internal copy
            </p>
          ) : null}
        </div>
      </header>

      <section className="mt-6 print-break">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">Status</h2>
        <div className="flex items-baseline gap-4 border border-ink-300 px-4 py-3">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold">
            {statusLabel(shipment.status)}
          </p>
          {shipment.exceptionNote ? (
            <p className="text-sm text-ink-700">— {shipment.exceptionNote}</p>
          ) : null}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-6 print-break">
        <Block title="Shipper">
          <p className="font-medium">{shipment.shipperName}</p>
          {shipment.shipperContact ? <p>{shipment.shipperContact}</p> : null}
          {shipment.shipperAddress ? <p className="text-ink-600">{shipment.shipperAddress}</p> : null}
          {includeInternal && shipment.shipperEmail ? (
            <p className="text-ink-600">{shipment.shipperEmail}</p>
          ) : null}
        </Block>
        <Block title="Consignee">
          <p className="font-medium">{shipment.consigneeName}</p>
          {shipment.consigneeContact ? <p>{shipment.consigneeContact}</p> : null}
          {shipment.consigneeAddress ? <p className="text-ink-600">{shipment.consigneeAddress}</p> : null}
          {includeInternal && shipment.consigneeEmail ? (
            <p className="text-ink-600">{shipment.consigneeEmail}</p>
          ) : null}
        </Block>
      </div>

      <section className="mt-6 print-break">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
          Consignment
        </h2>
        <table className="w-full border-collapse text-sm">
          <tbody>
            <Row label="Contract / project">
              {[shipment.contractRef, shipment.projectName].filter(Boolean).join(" · ") || "—"}
            </Row>
            <Row label="Route">
              {shipment.originCity}, {shipment.originCountry} → {shipment.destinationCity},{" "}
              {shipment.destinationCountry}
            </Row>
            <Row label="Ports">
              {[shipment.portOfLoading, shipment.portOfDischarge].filter(Boolean).join(" → ") || "—"}
            </Row>
            {shipment.borderCrossings ? (
              <Row label="Via">{shipment.borderCrossings}</Row>
            ) : null}
            <Row label="Mode">{modes.join(", ")}</Row>
            {corridors.length ? <Row label="Corridor">{corridors.join(", ")}</Row> : null}
            <Row label="Cargo">
              {shipment.cargoDescription}
              {shipment.isOOG ? (
                <span className="ml-2 border border-signal-600 px-1 py-0.5 text-[0.625rem] font-semibold uppercase text-signal-700">
                  Out of gauge
                </span>
              ) : null}
            </Row>
            <Row label="Commodity">{shipment.commodity ?? "—"}</Row>
            <Row label="Pieces">
              {shipment.packageCount ?? "—"} {shipment.packageType ?? ""}
            </Row>
            <Row label="Weight">{formatWeight(shipment.weightKg)}</Row>
            <Row label="Dimensions">
              {formatDimensions(shipment.lengthCm, shipment.widthCm, shipment.heightCm)}
              {shipment.volumeCbm ? ` · ${shipment.volumeCbm} cbm` : ""}
            </Row>
            {shipment.oogNotes ? <Row label="OOG notes">{shipment.oogNotes}</Row> : null}
            <Row label="ETD / ETA">
              {formatDate(shipment.etd)} / {formatDate(shipment.eta)}
            </Row>
            {shipment.actualDelivery ? (
              <Row label="Delivered">{formatDate(shipment.actualDelivery)}</Row>
            ) : null}
            {includeInternal ? (
              <>
                <Row label="B/L · CMR · AWB">
                  {[shipment.blNumber, shipment.cmrNumber, shipment.awbNumber]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </Row>
                <Row label="Handled by">{shipment.owner?.name ?? "Unassigned"}</Row>
                {shipment.internalNotes ? (
                  <Row label="Internal notes">{shipment.internalNotes}</Row>
                ) : null}
              </>
            ) : null}
          </tbody>
        </table>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">
          Movement record
        </h2>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-y border-ink-300 text-left text-xs uppercase tracking-wide text-ink-600">
              <th className="py-2 pr-3 font-semibold">Date</th>
              <th className="py-2 pr-3 font-semibold">Status</th>
              <th className="py-2 pr-3 font-semibold">Location</th>
              <th className="py-2 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {shipment.checkpoints.map((checkpoint) => (
              <tr key={checkpoint.id} className="border-b border-ink-200 align-top print-break">
                <td className="whitespace-nowrap py-2 pr-3 font-[family-name:var(--font-mono)] text-xs">
                  {formatDateTime(checkpoint.occurredAt)}
                </td>
                <td className="py-2 pr-3">
                  {statusLabel(checkpoint.status)}
                  {includeInternal && !checkpoint.isClientVisible ? (
                    <span className="ml-1 text-[0.625rem] font-semibold uppercase text-signal-700">
                      (internal)
                    </span>
                  ) : null}
                </td>
                <td className="py-2 pr-3">
                  {checkpoint.location}
                  {checkpoint.country ? `, ${checkpoint.country}` : ""}
                </td>
                <td className="py-2 text-ink-700">{checkpoint.remarks ?? "—"}</td>
              </tr>
            ))}
            {shipment.checkpoints.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-ink-600">
                  No checkpoints recorded.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <footer className="mt-8 border-t border-ink-300 pt-4 text-[0.6875rem] leading-relaxed text-ink-600">
        <p>
          Estimated dates are indicative. Multimodal and cross-border movements are subject to vessel
          and ferry schedules, wagon allocation, border processing, customs clearance and permit
          issuance. This report reflects the position recorded at the time of issue.
        </p>
        <p className="mt-2">
          {company.legalName} · All services supplied subject to our standard trading conditions.
        </p>
      </footer>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="print-break">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink-600">{title}</h2>
      <div className="border border-ink-300 px-4 py-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-ink-200 align-top">
      <th scope="row" className="w-40 py-2 pr-4 text-left font-normal text-ink-600">
        {label}
      </th>
      <td className="py-2">{children}</td>
    </tr>
  );
}
