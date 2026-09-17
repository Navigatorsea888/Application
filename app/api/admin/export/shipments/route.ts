import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { AuthorizationError, requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { buildWorkbook, xlsxFilename } from "@/lib/export";
import { ACTIVE_STATUSES, CORRIDORS, MODES, PENDING_STATUSES, parseList, statusLabel } from "@/lib/constants";

export const dynamic = "force-dynamic";

/**
 * Excel export of the shipment register, honouring the same filters as the
 * admin list so what downloads matches what was on screen.
 *
 * Any signed-in role may export, including VIEWER: reporting is the one thing
 * a view-only account exists to do.
 */
export async function GET(request: NextRequest) {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const params = request.nextUrl.searchParams;
  const query = params.get("q")?.trim();
  const status = params.get("status");
  const corridor = params.get("corridor");
  const owner = params.get("owner");

  const and: Array<Record<string, unknown>> = [];
  if (query) {
    and.push({
      OR: [
        { trackingId: { contains: query, mode: "insensitive" } },
        { consigneeName: { contains: query, mode: "insensitive" } },
        { shipperName: { contains: query, mode: "insensitive" } },
        { contractRef: { contains: query, mode: "insensitive" } },
        { projectName: { contains: query, mode: "insensitive" } },
        { blNumber: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (status && status !== "ALL") {
    if (status === "GROUP_ACTIVE") and.push({ status: { in: ACTIVE_STATUSES } });
    else if (status === "GROUP_PENDING") and.push({ status: { in: PENDING_STATUSES } });
    else and.push({ status });
  }
  if (corridor && corridor !== "ALL") and.push({ corridors: { contains: corridor } });
  if (owner && owner !== "ALL") and.push({ ownerId: owner });

  const shipments = await prisma.shipment.findMany({
    where: and.length ? { AND: and } : {},
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true } }, _count: { select: { checkpoints: true } } },
  });

  const buffer = await buildWorkbook({
    sheetName: "Shipments",
    title: "Navigator Sea Land Limited — Shipment register",
    columns: [
      { header: "Tracking ID", key: "trackingId", width: 16 },
      { header: "Status", key: "status", width: 22 },
      { header: "Contract ref", key: "contractRef", width: 18 },
      { header: "Project", key: "projectName", width: 20 },
      { header: "Consignee", key: "consigneeName", width: 26 },
      { header: "Consignee email", key: "consigneeEmail", width: 24 },
      { header: "Shipper", key: "shipperName", width: 26 },
      { header: "Origin", key: "origin", width: 22 },
      { header: "Destination", key: "destination", width: 22 },
      { header: "Corridors", key: "corridors", width: 24 },
      { header: "Modes", key: "modes", width: 18 },
      { header: "Cargo", key: "cargoDescription", width: 34 },
      { header: "OOG", key: "isOOG", width: 7 },
      { header: "Pieces", key: "packageCount", width: 8, numFmt: "#,##0" },
      { header: "Weight (kg)", key: "weightKg", width: 13, numFmt: "#,##0.00" },
      { header: "L (cm)", key: "lengthCm", width: 10, numFmt: "#,##0.0" },
      { header: "W (cm)", key: "widthCm", width: 10, numFmt: "#,##0.0" },
      { header: "H (cm)", key: "heightCm", width: 10, numFmt: "#,##0.0" },
      { header: "B/L", key: "blNumber", width: 16 },
      { header: "CMR", key: "cmrNumber", width: 16 },
      { header: "ETD", key: "etd", width: 13, numFmt: "dd mmm yyyy" },
      { header: "ETA", key: "eta", width: 13, numFmt: "dd mmm yyyy" },
      { header: "Delivered", key: "actualDelivery", width: 13, numFmt: "dd mmm yyyy" },
      { header: "Handled by", key: "owner", width: 18 },
      { header: "Checkpoints", key: "checkpointCount", width: 12, numFmt: "#,##0" },
      { header: "Created", key: "createdAt", width: 13, numFmt: "dd mmm yyyy" },
    ],
    rows: shipments.map((shipment) => ({
      trackingId: shipment.trackingId,
      status: statusLabel(shipment.status),
      contractRef: shipment.contractRef ?? "",
      projectName: shipment.projectName ?? "",
      consigneeName: shipment.consigneeName,
      consigneeEmail: shipment.consigneeEmail ?? "",
      shipperName: shipment.shipperName,
      origin: `${shipment.originCity}, ${shipment.originCountry}`,
      destination: `${shipment.destinationCity}, ${shipment.destinationCountry}`,
      corridors: parseList(shipment.corridors)
        .map((c) => CORRIDORS[c as keyof typeof CORRIDORS] ?? c)
        .join(", "),
      modes: parseList(shipment.modes)
        .map((m) => MODES[m as keyof typeof MODES] ?? m)
        .join(", "),
      cargoDescription: shipment.cargoDescription,
      isOOG: shipment.isOOG ? "Yes" : "No",
      packageCount: shipment.packageCount ?? null,
      weightKg: shipment.weightKg ?? null,
      lengthCm: shipment.lengthCm ?? null,
      widthCm: shipment.widthCm ?? null,
      heightCm: shipment.heightCm ?? null,
      blNumber: shipment.blNumber ?? "",
      cmrNumber: shipment.cmrNumber ?? "",
      etd: shipment.etd ?? null,
      eta: shipment.eta ?? null,
      actualDelivery: shipment.actualDelivery ?? null,
      owner: shipment.owner?.name ?? "",
      checkpointCount: shipment._count.checkpoints,
      createdAt: shipment.createdAt,
    })),
  });

  await recordAudit({
    user,
    action: "EXPORT",
    entityType: "Shipment",
    summary: `Exported ${shipments.length} shipment(s) to Excel`,
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${xlsxFilename("nsl-shipments")}"`,
      "Cache-Control": "no-store",
    },
  });
}
