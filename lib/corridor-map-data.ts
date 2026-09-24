/* -------------------------------------------------------------------------
   Corridor map data: a schematic network map of the Eurasian corridors
   Navigator Sea Land operates on. Deliberately not an atlas — the water
   bodies are soft blobs for orientation and the routes are gentle curves
   between named nodes. Rendered by components/site/corridor-map.tsx.
------------------------------------------------------------------------- */

export type TransportMode = "rail" | "road" | "sea" | "air";

export const MODE_COLORS: Record<TransportMode, string> = {
  rail: "#13807E",
  road: "#C9A227",
  sea: "#2F5FA8",
  air: "#94A0B4",
};

export const MODE_LABELS: Record<TransportMode, string> = {
  rail: "Rail",
  road: "Road",
  sea: "Sea / Caspian",
  air: "Air",
};

export const CORRIDOR_ORDER = [
  "china-land-bridge",
  "middle-corridor",
  "instc",
  "caspian-sea",
  "south-asia-khunjerab",
  "europe-turkiye",
] as const;

export type CorridorSlug = (typeof CORRIDOR_ORDER)[number];

/** Slugs used elsewhere in the site content that map onto a corridor route. */
export const ROUTE_SLUG_ALIASES: Readonly<Record<string, CorridorSlug>> = {
  caspian: "caspian-sea",
};

export function resolveCorridorSlug(slug: string | undefined): CorridorSlug | undefined {
  if (!slug) return undefined;
  if ((CORRIDOR_ORDER as readonly string[]).includes(slug)) return slug as CorridorSlug;
  return ROUTE_SLUG_ALIASES[slug];
}

/* ---- Projection ---------------------------------------------------------
   Equirectangular: lon 20°E–125°E across 1200 px, lat 12°N–60°N down 560 px.
------------------------------------------------------------------------- */

export const MAP_WIDTH = 1200;
export const MAP_HEIGHT = 560;
export const MAP_BOUNDS = { lonMin: 20, lonMax: 125, latMin: 12, latMax: 60 } as const;

export function project(lon: number, lat: number): { x: number; y: number } {
  const { lonMin, lonMax, latMin, latMax } = MAP_BOUNDS;
  const x = ((lon - lonMin) / (lonMax - lonMin)) * MAP_WIDTH;
  const y = ((latMax - lat) / (latMax - latMin)) * MAP_HEIGHT;
  return { x: round(x), y: round(y) };
}

function round(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Graticule lines every 10°, as projected pixel positions. */
export const GRATICULE = {
  meridians: [30, 40, 50, 60, 70, 80, 90, 100, 110, 120].map((lon) => project(lon, 12).x),
  parallels: [20, 30, 40, 50].map((lat) => project(0, lat).y),
} as const;

/* ---- Nodes ------------------------------------------------------------- */

export type NodeKind = "office" | "port" | "border" | "city" | "hub";
export type LabelAnchor = "start" | "middle" | "end";

export interface MapNode {
  id: string;
  label: string;
  lon: number;
  lat: number;
  kind: NodeKind;
  /** Label offset hints (px) to keep neighbouring labels apart. */
  dx?: number;
  dy?: number;
  anchor?: LabelAnchor;
}

export const MAP_NODES = [
  // Offices
  { id: "almaty", label: "Almaty", lon: 76.9, lat: 43.2, kind: "office", dx: -10, dy: -6, anchor: "end" },
  { id: "atyrau", label: "Atyrau", lon: 51.9, lat: 47.1, kind: "office", dx: -12, dy: -3, anchor: "end" },
  // Kazakhstan / Central Asia
  { id: "astana", label: "Astana", lon: 71.4, lat: 51.2, kind: "city", dx: 9, dy: 4 },
  { id: "aktau", label: "Aktau", lon: 51.2, lat: 43.6, kind: "port", dx: -9, dy: -2, anchor: "end" },
  { id: "kuryk", label: "Kuryk", lon: 51.7, lat: 43.2, kind: "port", dx: 9, dy: 9 },
  { id: "tengiz", label: "Tengiz", lon: 53.4, lat: 46.2, kind: "city", dx: 9, dy: 4 },
  { id: "bolashak", label: "Bolashak", lon: 55.5, lat: 41.5, kind: "border", dx: 9, dy: -4 },
  { id: "saryagash", label: "Saryagash", lon: 69.2, lat: 41.5, kind: "border", dx: -10, dy: -5, anchor: "end" },
  { id: "tashkent", label: "Tashkent", lon: 69.2, lat: 41.3, kind: "city", dx: -10, dy: 13, anchor: "end" },
  { id: "bishkek", label: "Bishkek", lon: 74.6, lat: 42.9, kind: "city", dx: -6, dy: 14, anchor: "end" },
  { id: "khorgos", label: "Khorgos / Altynkol", lon: 80.4, lat: 44.2, kind: "border", dx: 8, dy: 22 },
  { id: "dostyk", label: "Dostyk / Alashankou", lon: 82.5, lat: 45.3, kind: "border", dx: 9, dy: -5 },
  // Caucasus / Caspian west & south
  { id: "baku", label: "Baku / Alat", lon: 49.6, lat: 40.0, kind: "port", dx: 0, dy: 17, anchor: "middle" },
  { id: "turkmenbashi", label: "Turkmenbashi", lon: 53.0, lat: 40.0, kind: "port", dx: 9, dy: 4 },
  { id: "anzali", label: "Anzali", lon: 49.5, lat: 37.5, kind: "port", dx: -9, dy: 4, anchor: "end" },
  { id: "tehran", label: "Tehran", lon: 51.4, lat: 35.7, kind: "city", dx: 9, dy: 4 },
  { id: "tbilisi", label: "Tbilisi", lon: 44.8, lat: 41.7, kind: "city", dx: 8, dy: -6 },
  { id: "poti", label: "Poti / Batumi", lon: 41.7, lat: 42.0, kind: "port", dx: -4, dy: 18, anchor: "end" },
  // Türkiye / Europe
  { id: "istanbul", label: "Istanbul", lon: 29.0, lat: 41.0, kind: "hub", dx: 9, dy: 12 },
  { id: "mersin", label: "Mersin", lon: 34.6, lat: 36.8, kind: "port", dx: 9, dy: 4 },
  { id: "europe", label: "Europe", lon: 22.0, lat: 51.0, kind: "hub", dx: 10, dy: -6 },
  // China
  { id: "urumqi", label: "Urumqi", lon: 87.6, lat: 43.8, kind: "city", dx: 9, dy: 4 },
  { id: "kashgar", label: "Kashgar", lon: 76.0, lat: 39.5, kind: "city", dx: 9, dy: 4 },
  { id: "xian", label: "Xi'an", lon: 108.9, lat: 34.3, kind: "city", dx: -8, dy: 12, anchor: "end" },
  { id: "lianyungang", label: "Lianyungang", lon: 119.2, lat: 34.6, kind: "port", dx: 0, dy: -10, anchor: "middle" },
  { id: "tianjin", label: "Tianjin", lon: 117.2, lat: 39.1, kind: "port", dx: 9, dy: 4 },
  { id: "shanghai", label: "Shanghai", lon: 121.5, lat: 31.2, kind: "port", dx: -9, dy: 4, anchor: "end" },
  // South Asia / Gulf
  { id: "khunjerab", label: "Khunjerab / Sost", lon: 75.4, lat: 36.8, kind: "border", dx: 9, dy: 4 },
  { id: "karachi", label: "Karachi", lon: 67.0, lat: 24.9, kind: "port", dx: -9, dy: 4, anchor: "end" },
  { id: "mundra", label: "Mundra / Nhava Sheva", lon: 70.5, lat: 21.5, kind: "port", dx: 9, dy: 4 },
  { id: "bandar-abbas", label: "Bandar Abbas", lon: 56.3, lat: 27.2, kind: "port", dx: 9, dy: -4 },
  { id: "jebel-ali", label: "Jebel Ali", lon: 55.1, lat: 25.0, kind: "port", dx: 9, dy: 11 },
] as const satisfies readonly MapNode[];

export type NodeId = (typeof MAP_NODES)[number]["id"];

export const NODE_BY_ID: Readonly<Record<NodeId, MapNode>> = Object.fromEntries(
  MAP_NODES.map((node) => [node.id, node]),
) as Record<NodeId, MapNode>;

/* ---- Routes ------------------------------------------------------------ */

export interface MapLeg {
  from: NodeId;
  to: NodeId;
  mode: TransportMode;
  /** Bow direction/strength for the curve; +1 bows to the right of the direction of travel (screen coordinates), -1 to the left, 0 straight. */
  bow?: number;
  /** Secondary link drawn dashed and lighter. */
  dashed?: boolean;
}

export interface MapRoute {
  slug: CorridorSlug;
  /** Mode whose colour represents the corridor in selector cards. */
  accent: TransportMode;
  legs: readonly MapLeg[];
}

export const MAP_ROUTES: Readonly<Record<CorridorSlug, MapRoute>> = {
  "china-land-bridge": {
    slug: "china-land-bridge",
    accent: "rail",
    legs: [
      { from: "shanghai", to: "xian", mode: "rail", bow: -1 },
      { from: "lianyungang", to: "xian", mode: "rail", bow: 0.6 },
      { from: "xian", to: "urumqi", mode: "rail", bow: -1 },
      { from: "urumqi", to: "khorgos", mode: "rail", bow: 0.6 },
      { from: "khorgos", to: "almaty", mode: "rail", bow: 0.6 },
      { from: "almaty", to: "saryagash", mode: "rail", bow: 1 },
      { from: "saryagash", to: "tashkent", mode: "rail", bow: 0 },
      { from: "dostyk", to: "astana", mode: "rail", bow: 1 },
    ],
  },
  "middle-corridor": {
    slug: "middle-corridor",
    accent: "rail",
    legs: [
      { from: "xian", to: "urumqi", mode: "rail", bow: -1 },
      { from: "urumqi", to: "dostyk", mode: "rail", bow: -0.8 },
      { from: "dostyk", to: "astana", mode: "rail", bow: 1 },
      { from: "astana", to: "aktau", mode: "rail", bow: 1 },
      { from: "astana", to: "kuryk", mode: "rail", bow: 0.6 },
      { from: "aktau", to: "baku", mode: "sea", bow: 0.8 },
      { from: "baku", to: "tbilisi", mode: "rail", bow: 0.8 },
      { from: "tbilisi", to: "poti", mode: "rail", bow: 0.8 },
      { from: "poti", to: "istanbul", mode: "sea", bow: 1 },
      { from: "istanbul", to: "europe", mode: "road", bow: 1 },
      { from: "tbilisi", to: "mersin", mode: "road", bow: 1 },
    ],
  },
  instc: {
    slug: "instc",
    accent: "sea",
    legs: [
      { from: "mundra", to: "bandar-abbas", mode: "sea", bow: -1 },
      { from: "jebel-ali", to: "bandar-abbas", mode: "sea", bow: 0.8 },
      { from: "bandar-abbas", to: "tehran", mode: "rail", bow: 0.8 },
      { from: "tehran", to: "anzali", mode: "rail", bow: 0.8 },
      { from: "anzali", to: "aktau", mode: "sea", bow: -1 },
      { from: "tehran", to: "turkmenbashi", mode: "rail", bow: -0.8 },
      { from: "turkmenbashi", to: "bolashak", mode: "rail", bow: -0.8 },
      { from: "bolashak", to: "atyrau", mode: "rail", bow: -0.8 },
    ],
  },
  "caspian-sea": {
    slug: "caspian-sea",
    accent: "sea",
    legs: [
      { from: "aktau", to: "baku", mode: "sea", bow: 0.8 },
      { from: "kuryk", to: "baku", mode: "sea", bow: -0.8 },
      { from: "turkmenbashi", to: "baku", mode: "sea", bow: 0.8 },
      { from: "aktau", to: "atyrau", mode: "road", bow: 1 },
      { from: "atyrau", to: "tengiz", mode: "road", bow: 0.6 },
    ],
  },
  "south-asia-khunjerab": {
    slug: "south-asia-khunjerab",
    accent: "road",
    legs: [
      { from: "tengiz", to: "almaty", mode: "road", bow: 0.8 },
      { from: "almaty", to: "khorgos", mode: "road", bow: -0.8 },
      { from: "khorgos", to: "kashgar", mode: "road", bow: -1 },
      { from: "kashgar", to: "khunjerab", mode: "road", bow: 0.8 },
      { from: "khunjerab", to: "karachi", mode: "road", bow: 1 },
    ],
  },
  "europe-turkiye": {
    slug: "europe-turkiye",
    accent: "road",
    legs: [
      { from: "europe", to: "istanbul", mode: "road", bow: -1 },
      { from: "istanbul", to: "tbilisi", mode: "road", bow: -0.3 },
      { from: "tbilisi", to: "baku", mode: "road", bow: 1 },
      { from: "europe", to: "poti", mode: "sea", bow: 0.8 },
      { from: "europe", to: "astana", mode: "rail", bow: -0.6, dashed: true },
    ],
  },
};

/** Air links: always drawn faint and dashed, not tied to a corridor. */
export const AIR_LEGS: readonly MapLeg[] = [
  { from: "europe", to: "almaty", mode: "air", bow: -0.7 },
  { from: "jebel-ali", to: "atyrau", mode: "air", bow: -0.9 },
];

/** Quadratic Bézier between two nodes with a gentle bow (≈12% of the span). */
export function legPath(leg: MapLeg): string {
  const a = NODE_BY_ID[leg.from];
  const b = NODE_BY_ID[leg.to];
  const p1 = project(a.lon, a.lat);
  const p2 = project(b.lon, b.lat);
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = (leg.bow ?? 1) * 0.12 * len;
  const cx = round((p1.x + p2.x) / 2 + (-dy / len) * bow);
  const cy = round((p1.y + p2.y) / 2 + (dx / len) * bow);
  return `M ${p1.x} ${p1.y} Q ${cx} ${cy} ${p2.x} ${p2.y}`;
}

/** Ordered, de-duplicated node labels for a corridor (used for the SVG desc). */
export function routeNodeLabels(slug: CorridorSlug): string[] {
  const seen = new Set<NodeId>();
  for (const leg of MAP_ROUTES[slug].legs) {
    seen.add(leg.from);
    seen.add(leg.to);
  }
  return [...seen].map((id) => NODE_BY_ID[id].label);
}

/* ---- Water bodies (orientation only) ------------------------------------ */

export interface WaterBody {
  id: string;
  label: string;
  /** Outline as [lon, lat] pairs; rendered as a smooth closed curve. */
  outline: readonly (readonly [number, number])[];
  labelAt: readonly [number, number];
}

export const MAP_WATER: readonly WaterBody[] = [
  {
    id: "caspian",
    label: "Caspian Sea",
    labelAt: [51.4, 41.6],
    outline: [
      [47.2, 44.8], [48.5, 46.6], [51.5, 47.3], [53.3, 46.1], [52.1, 44.3], [51.6, 43.0],
      [53.1, 41.8], [54.1, 40.2], [53.6, 38.5], [51.6, 36.9], [49.4, 37.3], [49.1, 39.1],
      [49.9, 40.7], [48.8, 42.1], [47.4, 43.3],
    ],
  },
  {
    id: "black-sea",
    label: "Black Sea",
    labelAt: [34.5, 43.6],
    outline: [
      [28.2, 44.2], [30.0, 46.1], [34.0, 45.6], [37.6, 46.3], [40.6, 44.5], [41.3, 42.2],
      [38.0, 41.3], [34.0, 41.6], [30.5, 41.2], [28.0, 42.8],
    ],
  },
  {
    id: "arabian-sea",
    label: "Persian Gulf / Arabian Sea",
    labelAt: [64.5, 17.5],
    outline: [
      [48.0, 30.0], [50.5, 30.1], [53.5, 27.3], [56.0, 27.0], [58.5, 25.4], [62.5, 25.2],
      [66.5, 24.7], [70.0, 22.4], [72.6, 20.0], [73.2, 14.0], [66.0, 12.4], [59.0, 13.6],
      [57.6, 20.0], [56.6, 24.0], [54.4, 24.5], [51.5, 25.6], [50.0, 26.6], [48.0, 28.0],
    ],
  },
  {
    id: "mediterranean",
    label: "Mediterranean",
    labelAt: [26.5, 34.2],
    outline: [
      [18.0, 37.8], [23.5, 36.0], [28.0, 36.3], [32.0, 36.2], [35.6, 36.7], [36.1, 35.0],
      [35.0, 32.0], [32.0, 31.2], [26.0, 31.8], [18.0, 32.4],
    ],
  },
];

/** Smooth closed path through the midpoints of an outline (quadratic segments). */
export function waterPath(body: WaterBody): string {
  const pts = body.outline.map(([lon, lat]) => project(lon, lat));
  const n = pts.length;
  const mid = (i: number) => {
    const p = pts[i % n];
    const q = pts[(i + 1) % n];
    return { x: round((p.x + q.x) / 2), y: round((p.y + q.y) / 2) };
  };
  let d = `M ${mid(0).x} ${mid(0).y}`;
  for (let i = 1; i <= n; i++) {
    const ctrl = pts[i % n];
    const m = mid(i);
    d += ` Q ${ctrl.x} ${ctrl.y} ${m.x} ${m.y}`;
  }
  return `${d} Z`;
}
