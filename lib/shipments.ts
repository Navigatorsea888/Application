import "server-only";
import { prisma } from "./db";
import { normalizeTrackingId } from "./tracking-id";
import {
  ACTIVE_STATUSES,
  PENDING_STATUSES,
  PROGRESS_STATUSES,
  SHIPMENT_STATUSES,
  isShipmentStatus,
  type ShipmentStatus,
} from "./constants";

/**
 * Service layer between routes and Prisma. Routes never query Prisma for
 * shipments directly, which is what keeps a future ERP sync to one file: point
 * these functions at CargoWise and the UI is unchanged.
 */

// --- Public tracking ---------------------------------------------------------

export type TrackingLookup =
  | { outcome: "FOUND"; shipment: PublicShipment }
  | { outcome: "NOT_FOUND" }
  | { outcome: "VERIFICATION_REQUIRED" }
  | { outcome: "VERIFICATION_FAILED" };

export interface PublicCheckpoint {
  id: string;
  status: string;
  location: string;
  country: string | null;
  leg: string | null;
  occurredAt: Date;
  remarks: string | null;
  attachments: Array<{ id: string; fileName: string; storagePath: string; caption: string | null }>;
}

export interface PublicShipment {
  trackingId: string;
  status: string;
  exceptionFlag: string | null;
  exceptionNote: string | null;
  consigneeName: string;
  contractRef: string | null;
  projectName: string | null;
  originCity: string;
  originCountry: string;
  destinationCity: string;
  destinationCountry: string;
  portOfLoading: string | null;
  portOfDischarge: string | null;
  corridors: string | null;
  modes: string;
  cargoDescription: string;
  commodity: string | null;
  packageCount: number | null;
  packageType: string | null;
  weightKg: number | null;
  isOOG: boolean;
  etd: Date | null;
  eta: Date | null;
  actualDelivery: Date | null;
  checkpoints: PublicCheckpoint[];
}

/**
 * Looks up a shipment for the public tracking page.
 *
 * Unless the shipment is explicitly marked `isPublicAccess`, the caller must
 * also supply the consignee email or the contract reference. Comparison is
 * case-insensitive and trimmed, because clients paste these out of emails.
 *
 * NOT_FOUND is returned for a wrong Tracking ID and VERIFICATION_FAILED for a
 * wrong second factor. That distinction is deliberate: the tracking form is
 * rate limited, and telling a legitimate consignee "that reference does not
 * match" rather than "no such shipment" saves a support call.
 */
export async function lookupShipment(
  rawTrackingId: string,
  verification?: string | null,
): Promise<TrackingLookup> {
  const trackingId = normalizeTrackingId(rawTrackingId);
  if (!trackingId) return { outcome: "NOT_FOUND" };

  const shipment = await prisma.shipment.findUnique({
    where: { trackingId },
    include: {
      checkpoints: {
        where: { isClientVisible: true },
        orderBy: [{ occurredAt: "asc" }, { createdAt: "asc" }],
        include: {
          attachments: {
            where: { isClientVisible: true },
            select: { id: true, fileName: true, storagePath: true, caption: true },
          },
        },
      },
    },
  });

  if (!shipment) return { outcome: "NOT_FOUND" };

  if (!shipment.isPublicAccess) {
    const supplied = verification?.trim().toLowerCase();
    if (!supplied) return { outcome: "VERIFICATION_REQUIRED" };

    const accepted = [shipment.consigneeEmail, shipment.contractRef, shipment.projectName]
      .filter((v): v is string => Boolean(v))
      .map((v) => v.trim().toLowerCase());

    if (!accepted.includes(supplied)) return { outcome: "VERIFICATION_FAILED" };
  }

  return {
    outcome: "FOUND",
    shipment: {
      trackingId: shipment.trackingId,
      status: shipment.status,
      exceptionFlag: shipment.exceptionFlag,
      exceptionNote: shipment.exceptionNote,
      consigneeName: shipment.consigneeName,
      contractRef: shipment.contractRef,
      projectName: shipment.projectName,
      originCity: shipment.originCity,
      originCountry: shipment.originCountry,
      destinationCity: shipment.destinationCity,
      destinationCountry: shipment.destinationCountry,
      portOfLoading: shipment.portOfLoading,
      portOfDischarge: shipment.portOfDischarge,
      corridors: shipment.corridors,
      modes: shipment.modes,
      cargoDescription: shipment.cargoDescription,
      commodity: shipment.commodity,
      packageCount: shipment.packageCount,
      packageType: shipment.packageType,
      weightKg: shipment.weightKg,
      isOOG: shipment.isOOG,
      etd: shipment.etd,
      eta: shipment.eta,
      actualDelivery: shipment.actualDelivery,
      checkpoints: shipment.checkpoints,
    },
  };
}

/**
 * Builds the client-facing timeline: every stage in order, each marked done,
 * current or upcoming. Exception states are not stages — they surface as a
 * flag on the current stage, so a delayed shipment still reads as a straight
 * line from booking to delivery.
 */
export interface TimelineStage {
  status: ShipmentStatus;
  label: string;
  description: string;
  state: "DONE" | "CURRENT" | "UPCOMING";
  /** True once the movement has progressed past this stage; drives the connector. */
  passed: boolean;
  events: PublicCheckpoint[];
}

export function buildTimeline(shipment: PublicShipment): {
  stages: TimelineStage[];
  isException: boolean;
  exceptionLabel: string | null;
} {
  const currentIsException = isShipmentStatus(shipment.status) && SHIPMENT_STATUSES[shipment.status].isException;

  const statusOrder =
    !currentIsException && isShipmentStatus(shipment.status) ? SHIPMENT_STATUSES[shipment.status].order : 0;

  // The furthest stage any checkpoint has reached. Corridor movements are not
  // monotonic — road, border, road, border — so this can exceed the current
  // status, and it is what the connector line follows.
  const eventOrders = shipment.checkpoints
    .filter((c) => isShipmentStatus(c.status) && !SHIPMENT_STATUSES[c.status].isException)
    .map((c) => SHIPMENT_STATUSES[c.status as ShipmentStatus].order);

  const frontier = Math.max(statusOrder, ...(eventOrders.length ? eventOrders : [0]));

  // CURRENT follows the shipment's own status, because that is what operations
  // asserts the position to be. Only when the shipment sits in an exception
  // state (which carries no position of its own) does it fall back to the
  // furthest checkpoint reached.
  const currentOrder = currentIsException ? frontier : statusOrder;

  const stages: TimelineStage[] = PROGRESS_STATUSES.map((status) => {
    const meta = SHIPMENT_STATUSES[status];
    const events = shipment.checkpoints.filter((c) => c.status === status);

    let state: TimelineStage["state"];
    if (meta.order === currentOrder) state = "CURRENT";
    // A stage with checkpoints against it has demonstrably happened, even when
    // the shipment has since moved back to an earlier stage.
    else if (meta.order < frontier || events.length > 0) state = "DONE";
    else state = "UPCOMING";

    return {
      status,
      label: meta.label,
      description: meta.description,
      state,
      passed: meta.order < frontier,
      events,
    };
  });

  // Exception checkpoints are not stages. Attach them to the stage that was
  // current when they were raised so the reason still appears on the timeline.
  const exceptionEvents = shipment.checkpoints.filter(
    (c) => isShipmentStatus(c.status) && SHIPMENT_STATUSES[c.status].isException,
  );
  if (exceptionEvents.length) {
    const target = stages.find((s) => s.state === "CURRENT") ?? stages[stages.length - 1];
    if (target) {
      target.events = [...target.events, ...exceptionEvents].sort(
        (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime(),
      );
    }
  }

  return {
    stages,
    isException: currentIsException,
    exceptionLabel: currentIsException ? SHIPMENT_STATUSES[shipment.status as ShipmentStatus].label : null,
  };
}

// --- Admin queries -----------------------------------------------------------

export interface ShipmentSearchParams {
  query?: string;
  status?: string;
  corridor?: string;
  ownerId?: string;
  page?: number;
  perPage?: number;
}

/**
 * Free-text search spans Tracking ID, consignee, shipper, contract reference,
 * project, B/L and phone — the fields staff actually have to hand when a
 * client calls.
 */
export async function searchShipments(params: ShipmentSearchParams) {
  const page = Math.max(1, params.page ?? 1);
  const perPage = Math.min(100, Math.max(5, params.perPage ?? 25));
  const query = params.query?.trim();

  const where: Record<string, unknown> = {};
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
        { cmrNumber: { contains: query, mode: "insensitive" } },
        { consigneePhone: { contains: query, mode: "insensitive" } },
        { shipperPhone: { contains: query, mode: "insensitive" } },
        { consigneeEmail: { contains: query, mode: "insensitive" } },
      ],
    });
  }
  if (params.status && params.status !== "ALL") {
    if (params.status === "GROUP_ACTIVE") and.push({ status: { in: ACTIVE_STATUSES } });
    else if (params.status === "GROUP_PENDING") and.push({ status: { in: PENDING_STATUSES } });
    else and.push({ status: params.status });
  }
  // Exact-case on purpose: this matches a stored key ("MIDDLE_CORRIDOR") against
  // a value from a fixed select, not free text.
  if (params.corridor && params.corridor !== "ALL") and.push({ corridors: { contains: params.corridor } });
  if (params.ownerId && params.ownerId !== "ALL") and.push({ ownerId: params.ownerId });

  if (and.length) where.AND = and;

  const [total, rows] = await Promise.all([
    prisma.shipment.count({ where }),
    prisma.shipment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        owner: { select: { name: true } },
        _count: { select: { checkpoints: true } },
      },
    }),
  ]);

  return { rows, total, page, perPage, pageCount: Math.max(1, Math.ceil(total / perPage)) };
}

export async function dashboardStats() {
  const now = new Date();
  const [total, inTransit, delivered, pending, exceptions, overdue, recent, newQuotes, newEnquiries] =
    await Promise.all([
      prisma.shipment.count(),
      prisma.shipment.count({ where: { status: { in: ACTIVE_STATUSES } } }),
      prisma.shipment.count({ where: { status: "DELIVERED" } }),
      prisma.shipment.count({ where: { status: { in: PENDING_STATUSES } } }),
      prisma.shipment.count({ where: { status: { in: ["DELAYED", "ON_HOLD"] } } }),
      prisma.shipment.count({
        where: { eta: { lt: now }, status: { notIn: ["DELIVERED"] } },
      }),
      prisma.shipment.findMany({
        orderBy: { updatedAt: "desc" },
        take: 8,
        select: {
          id: true,
          trackingId: true,
          status: true,
          consigneeName: true,
          originCity: true,
          destinationCity: true,
          eta: true,
          updatedAt: true,
          isOOG: true,
        },
      }),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.shipmentEnquiry.count({ where: { status: "NEW" } }),
    ]);

  return { total, inTransit, delivered, pending, exceptions, overdue, recent, newQuotes, newEnquiries };
}

/** Counts per status, for the dashboard breakdown bar. */
export async function statusBreakdown() {
  const grouped = await prisma.shipment.groupBy({ by: ["status"], _count: { _all: true } });
  const counts = new Map(grouped.map((g) => [g.status, g._count._all]));
  return PROGRESS_STATUSES.concat(["DELAYED", "ON_HOLD"] as ShipmentStatus[]).map((status) => ({
    status,
    label: SHIPMENT_STATUSES[status].label,
    count: counts.get(status) ?? 0,
  }));
}
