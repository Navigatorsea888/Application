// ---------------------------------------------------------------------------
// Controlled vocabularies.
//
// These live in code rather than as database enums so the schema stays
// portable between SQLite and PostgreSQL, and so a status label can be
// reworded without a migration. Every status stored in the database must be
// a key from SHIPMENT_STATUSES.
// ---------------------------------------------------------------------------

export const ROLES = {
  ADMIN: "Administrator",
  OPERATOR: "Operations",
  VIEWER: "View only",
} as const;
export type Role = keyof typeof ROLES;

/** Ranked most to least privileged. Used by requireRole(). */
export const ROLE_RANK: Record<Role, number> = { ADMIN: 3, OPERATOR: 2, VIEWER: 1 };

export const OFFICES = {
  ALMATY: "Almaty, Kazakhstan",
  ATYRAU: "Atyrau, Kazakhstan",
  MUMBAI: "Mumbai, India",
} as const;
export type Office = keyof typeof OFFICES;

export const MODES = {
  ROAD: "Road",
  RAIL: "Rail",
  SEA: "Sea",
  AIR: "Air",
  BARGE: "Barge / Inland waterway",
} as const;
export type Mode = keyof typeof MODES;

export const CORRIDORS = {
  CENTRAL_ASIA: "Central Asia",
  CASPIAN: "Caspian Sea",
  CHINA_LAND_BRIDGE: "China Land Bridge",
  MIDDLE_CORRIDOR: "Middle Corridor (TITR)",
  INSTC: "INSTC",
} as const;
export type Corridor = keyof typeof CORRIDORS;

// --- Shipment status ---------------------------------------------------------

/**
 * The operational checkpoint sequence. `order` drives timeline progress; the
 * two exception states share order 0 because they can occur at any stage and
 * are rendered as a flag on the current step rather than a step of their own.
 */
export const SHIPMENT_STATUSES = {
  BOOKING_CONFIRMED: {
    label: "Booking Confirmed",
    description: "Booking accepted and job reference opened.",
    order: 1,
    isException: false,
    isMilestone: true,
  },
  CARGO_RECEIVED: {
    label: "Cargo Received at Origin",
    description: "Cargo received at the loading point or origin warehouse.",
    order: 2,
    isException: false,
    isMilestone: false,
  },
  CUSTOMS_EXPORT: {
    label: "Customs Clearance — Export",
    description: "Export declaration lodged and clearance in progress.",
    order: 3,
    isException: false,
    isMilestone: false,
  },
  IN_TRANSIT: {
    label: "In Transit",
    description: "Cargo moving on the leg shown.",
    order: 4,
    isException: false,
    isMilestone: true,
  },
  BORDER_CROSSING: {
    label: "Border Crossing / Transshipment",
    description: "At a border or transshipment point, e.g. Khorgos or Aktau.",
    order: 5,
    isException: false,
    isMilestone: false,
  },
  ARRIVED_HUB: {
    label: "Arrived at Port / Hub",
    description: "Arrived at the destination port, terminal or hub.",
    order: 6,
    isException: false,
    isMilestone: false,
  },
  CUSTOMS_IMPORT: {
    label: "Customs Clearance — Import",
    description: "Import clearance in progress at destination.",
    order: 7,
    isException: false,
    isMilestone: false,
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Final Delivery",
    description: "On final delivery to the site or consignee address.",
    order: 8,
    isException: false,
    isMilestone: false,
  },
  DELIVERED: {
    label: "Delivered",
    description: "Cargo delivered and receipt confirmed.",
    order: 9,
    isException: false,
    isMilestone: true,
  },
  DELAYED: {
    label: "Delayed",
    description: "Progress delayed — reason recorded in remarks.",
    order: 0,
    isException: true,
    isMilestone: true,
  },
  ON_HOLD: {
    label: "On Hold",
    description: "Movement suspended pending instruction or clearance.",
    order: 0,
    isException: true,
    isMilestone: true,
  },
} as const;

export type ShipmentStatus = keyof typeof SHIPMENT_STATUSES;

export const STATUS_KEYS = Object.keys(SHIPMENT_STATUSES) as ShipmentStatus[];

/** The ordered happy path, excluding exception states. */
export const PROGRESS_STATUSES = STATUS_KEYS.filter(
  (k) => !SHIPMENT_STATUSES[k].isException,
).sort((a, b) => SHIPMENT_STATUSES[a].order - SHIPMENT_STATUSES[b].order);

/** Statuses that trigger a client notification. Deliberately not every step. */
export const MILESTONE_STATUSES = STATUS_KEYS.filter((k) => SHIPMENT_STATUSES[k].isMilestone);

export function isShipmentStatus(value: string): value is ShipmentStatus {
  return Object.prototype.hasOwnProperty.call(SHIPMENT_STATUSES, value);
}

export function statusLabel(value: string): string {
  return isShipmentStatus(value) ? SHIPMENT_STATUSES[value].label : value;
}

/**
 * Dashboard grouping. "Pending" means booked but not yet physically moving —
 * the set operations chase daily.
 */
export const PENDING_STATUSES: ShipmentStatus[] = [
  "BOOKING_CONFIRMED",
  "CARGO_RECEIVED",
  "CUSTOMS_EXPORT",
];

export const ACTIVE_STATUSES: ShipmentStatus[] = [
  "IN_TRANSIT",
  "BORDER_CROSSING",
  "ARRIVED_HUB",
  "CUSTOMS_IMPORT",
  "OUT_FOR_DELIVERY",
];

// --- Pipeline statuses -------------------------------------------------------

export const QUOTE_STATUSES = {
  NEW: "New",
  IN_REVIEW: "In review",
  QUOTED: "Quoted",
  WON: "Won",
  LOST: "Lost",
  ARCHIVED: "Archived",
} as const;

export const ENQUIRY_STATUSES = {
  NEW: "New",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
} as const;

export const PACKAGE_TYPES = [
  "Crate",
  "Case",
  "Skid",
  "Pallet",
  "Bundle",
  "Loose / Uncrated",
  "Flat rack",
  "Open top",
  "Container (20ft)",
  "Container (40ft)",
  "Breakbulk",
] as const;

/**
 * Service lines a visitor can pick on step 1 of the public "Request a Quote"
 * form. Keys are stored on QuoteRequest.serviceType; labels are display only.
 */
export const QUOTE_SERVICE_TYPES = {
  PROJECT: "Project Logistics & Heavy Lift",
  HEAVY_HAUL: "Heavy Haul & Over-Dimensional Trucking",
  BULK_LIQUID: "Bulk Liquid Transportation",
  RAIL: "Rail Freight",
  ROAD: "Road Freight",
  OCEAN_CASPIAN: "Ocean & Caspian Freight",
  AIR: "Air Freight",
  CUSTOMS: "Customs & Trade Compliance",
  WAREHOUSING: "Warehousing & Distribution",
  NOT_SURE: "Not sure yet",
} as const;
export type QuoteServiceType = keyof typeof QUOTE_SERVICE_TYPES;

/** Preferred correspondence language on a quote request. */
export const LANGUAGES = {
  EN: "English",
  RU: "Russian",
  KZ: "Kazakh",
} as const;
export type Language = keyof typeof LANGUAGES;

export const INCOTERMS = [
  "EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP",
] as const;

// --- Small helpers for the comma-separated list columns ----------------------

export function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

export function serializeList(values: readonly string[] | undefined | null): string | null {
  if (!values || values.length === 0) return null;
  const cleaned = Array.from(new Set(values.map((v) => v.trim()).filter(Boolean)));
  return cleaned.length ? cleaned.join(",") : null;
}
