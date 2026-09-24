/**
 * Container, trailer and rail-wagon reference specifications.
 *
 * Every figure here is typical or indicative. Internal dimensions, tare and
 * payload vary by manufacturer, owner and build year; road and rail payloads
 * additionally depend on axle configuration, national limits and the route.
 * Where a single number would be false precision, a range or "—" is given.
 *
 * Values are strings so ranges and units render as written.
 */

export type EquipmentCategoryId = "containers" | "trailers" | "wagons";

export interface SpecColumn {
  key: string;
  label: string;
}

export interface SpecRow {
  name: string;
  [key: string]: string;
}

export interface SpecTable {
  id: EquipmentCategoryId;
  label: string;
  /** Shown above the table; says what the numbers are and are not. */
  note: string;
  columns: SpecColumn[];
  rows: SpecRow[];
}

const CONTAINER_COLUMNS: SpecColumn[] = [
  { key: "internal", label: "Internal L × W × H (m)" },
  { key: "door", label: "Door opening W × H (m)" },
  { key: "tare", label: "Tare (kg)" },
  { key: "payload", label: "Max payload (kg)" },
  { key: "capacity", label: "Capacity (m³)" },
];

const CONTAINERS: SpecTable = {
  id: "containers",
  label: "ISO containers",
  note:
    "Typical values for ISO series-1 containers. Payloads assume the container's rated max gross; the road or rail leg in the destination country usually allows less.",
  columns: CONTAINER_COLUMNS,
  rows: [
    { name: "20' GP (dry)", internal: "5.90 × 2.35 × 2.39", door: "2.34 × 2.28", tare: "2,200–2,300", payload: "28,200", capacity: "33" },
    { name: "40' GP (dry)", internal: "12.03 × 2.35 × 2.39", door: "2.34 × 2.28", tare: "3,700–3,800", payload: "26,700", capacity: "67" },
    { name: "40' HC (high cube)", internal: "12.03 × 2.35 × 2.69", door: "2.34 × 2.58", tare: "3,900–4,000", payload: "26,500", capacity: "76" },
    { name: "45' HC (high cube)", internal: "13.55 × 2.35 × 2.69", door: "2.34 × 2.58", tare: "4,800–5,000", payload: "25,500–27,700", capacity: "86" },
    { name: "20' Open Top", internal: "5.89 × 2.35 × 2.35 (under tarpaulin)", door: "2.34 × 2.28", tare: "2,300–2,400", payload: "28,000", capacity: "32" },
    { name: "40' Open Top", internal: "12.03 × 2.35 × 2.35 (under tarpaulin)", door: "2.34 × 2.28", tare: "3,800–4,000", payload: "26,500", capacity: "65" },
    { name: "20' Flat Rack", internal: "5.94 × 2.40 × 2.35 (floor to top of end wall)", door: "— (open sides and top)", tare: "2,500–2,900", payload: "27,000–31,000 (heavy-duty units higher)", capacity: "—" },
    { name: "40' Flat Rack", internal: "12.13 × 2.40 × 1.95–2.14", door: "— (open sides and top)", tare: "5,000–5,700", payload: "39,000–45,000", capacity: "—" },
    { name: "20' Reefer", internal: "5.44 × 2.29 × 2.27", door: "2.29 × 2.26", tare: "3,000–3,100", payload: "27,400", capacity: "28" },
    { name: "40' HC Reefer", internal: "11.58 × 2.29 × 2.55", door: "2.29 × 2.57", tare: "4,500–4,800", payload: "29,000", capacity: "67" },
    { name: "20' ISO tank T11 (liquids)", internal: "— (external frame 6.06 × 2.44 × 2.59)", door: "—", tare: "3,400–4,200", payload: "26,000–32,000 (max gross 30,480–36,000)", capacity: "21–26 (21,000–26,000 L)" },
    { name: "20' ISO tank T50 (LPG / gases)", internal: "— (external frame 6.06 × 2.44 × 2.59)", door: "—", tare: "8,000–10,000", payload: "20,000–26,000 (product-dependent)", capacity: "24–25 (approx.)" },
  ],
};

const TRAILER_COLUMNS: SpecColumn[] = [
  { key: "deck", label: "Deck / internal L × W (m)" },
  { key: "height", label: "Deck height (m)" },
  { key: "cargoHeight", label: "Usable cargo height (m)" },
  { key: "payload", label: "Typical payload (t)" },
  { key: "notes", label: "Notes" },
];

const TRAILERS: SpecTable = {
  id: "trailers",
  label: "Road trailers",
  note:
    "Typical European-pattern semi-trailers. Payload is governed by the tractor–trailer gross weight and axle limits of every country on the route, not by the trailer alone.",
  columns: TRAILER_COLUMNS,
  rows: [
    { name: "Curtainsider / tilt 13.6 m", deck: "13.6 × 2.48", height: "1.15–1.35", cargoHeight: "2.70 (mega ~3.00)", payload: "22–24", notes: "33 EUR pallets; ~90 m³ (mega ~100 m³)" },
    { name: "Flatbed 13.6 m", deck: "13.6 × 2.48", height: "1.35–1.45", cargoHeight: "~2.55 at 4.0 m overall", payload: "24–27", notes: "Over-width cargo possible with permit" },
    { name: "Step-deck (semi low-loader)", deck: "Upper ~3.0 + lower 9.5–10.5 × 2.5", height: "0.85–1.00 (lower deck)", cargoHeight: "~3.0 on lower deck", payload: "25–30", notes: "For tall machinery; ramps optional" },
    { name: "3-axle low-bed", deck: "8–12 × 2.5–3.0 (bed)", height: "0.50–0.90", cargoHeight: "3.1–3.5", payload: "40–50", notes: "Gooseneck or detachable neck; often extendable" },
    { name: "Extendable flatbed", deck: "13.6 extending to 21–27 × 2.5", height: "1.35–1.45", cargoHeight: "~2.55 at 4.0 m overall", payload: "24–30 (less when extended)", notes: "Long steel, blades, towers; permit needed when extended" },
    { name: "Hydraulic modular trailer", deck: "Modules combined to length; 2.43–3.00 wide, combinable side-by-side", height: "0.9–1.5 (hydraulic)", cargoHeight: "Route-dependent", payload: "30–45 per axle line", notes: "Configuration-dependent; engineered per move" },
  ],
};

const WAGON_COLUMNS: SpecColumn[] = [
  { key: "dimensions", label: "Loading length / internal (m)" },
  { key: "capacity", label: "Volume (m³)" },
  { key: "payload", label: "Typical payload (t)" },
  { key: "notes", label: "Notes" },
];

const WAGONS: SpecTable = {
  id: "wagons",
  label: "CIS rail wagons (1,520 mm gauge)",
  note:
    "Common wagon types on the 1,520 mm network (Kazakhstan, Uzbekistan, Russia and neighbours). Payload is limited by the 23.5 t axle load; specific series differ.",
  columns: WAGON_COLUMNS,
  rows: [
    { name: "Platform wagon 13.4 m", dimensions: "13.4 × ~2.87 platform", capacity: "—", payload: "~71", notes: "Universal flat; stakes and end walls on some series" },
    { name: "60 ft container platform", dimensions: "~18.4 loading length", capacity: "—", payload: "~72", notes: "Carries 3 × 20', 40' + 20' or 1 × 45'" },
    { name: "Covered wagon", dimensions: "~15.7 × 2.76 internal", capacity: "~138 (older series ~120)", payload: "~68", notes: "Sliding side doors; palletised and bagged cargo" },
    { name: "Gondola (open wagon)", dimensions: "~12.7 × 2.9 internal", capacity: "~88", payload: "69–71", notes: "Bulk and weather-tolerant cargo; some with hatches" },
    { name: "Tank wagon", dimensions: "—", capacity: "60–75", payload: "60–70 (product-dependent)", notes: "Oil products, chemicals, LPG series differ" },
  ],
};

export const EQUIPMENT_TABLES: readonly SpecTable[] = [CONTAINERS, TRAILERS, WAGONS];

export const EQUIPMENT_DISCLAIMER =
  "All figures are typical or indicative and vary by manufacturer, operator and route. Confirm the specific unit with your Navigator Sea Land coordinator before finalising packing or lashing plans.";

export function getEquipmentTable(id: EquipmentCategoryId): SpecTable {
  return EQUIPMENT_TABLES.find((table) => table.id === id) ?? CONTAINERS;
}
