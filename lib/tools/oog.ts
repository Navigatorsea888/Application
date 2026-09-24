/**
 * Out-of-gauge pre-check.
 *
 * The limits below are indicative reference envelopes, not legal maxima. Road
 * limits differ by country (and by permit class within a country), so the
 * verdict is a screening result: it tells the client whether to expect a
 * standard trailer booking or an engineered heavy-haul move with permits.
 */

export type OogVerdict = "standard" | "oog" | "heavy" | "oog-heavy";

export interface OogInput {
  lengthM: number;
  widthM: number;
  heightM: number;
  weightT: number;
}

export interface ExceededLimit {
  limit: string;
  value: number;
  max: number;
  unit: string;
}

export interface EquipmentFit {
  equipment: string;
  fits: boolean;
  /** Which internal dimensions or payload the cargo exceeds. */
  reasons: string[];
}

export interface OogResult {
  verdict: OogVerdict;
  exceeded: ExceededLimit[];
  fits: EquipmentFit[];
  notes: string[];
}

interface Envelope {
  name: string;
  lengthM: number;
  widthM: number;
  heightM: number;
  payloadT: number;
}

/** Cargo envelope on a standard 13.6 m flatbed at the common 4.0 m overall height. */
export const TRAILER_ENVELOPE: Envelope = {
  name: "Standard trailer",
  lengthM: 13.6,
  widthM: 2.55,
  heightM: 2.7,
  payloadT: 24,
};

/** Internal dimensions; payloads are typical and vary by container owner. */
export const CONTAINER_ENVELOPES: Envelope[] = [
  { name: "40' HC container", lengthM: 12.03, widthM: 2.35, heightM: 2.69, payloadT: 26 },
  { name: "20' GP container", lengthM: 5.9, widthM: 2.35, heightM: 2.39, payloadT: 28 },
];

export const OOG_NOTES = {
  indicative:
    "Limits are indicative reference values. Legal road limits vary by country and by permit class; permits and a route survey determine the final answer.",
  oog: "Cargo exceeds the standard trailer envelope: expect a low-bed, step-deck or modular trailer, escort vehicles on some corridors and permit lead time of several days to weeks.",
  heavy:
    "Cargo exceeds the standard 24 t payload: expect a multi-axle trailer, axle-load checks and bridge or culvert assessments along the route.",
  standard:
    "Cargo fits the standard trailer envelope. Border crossings and transit countries may still apply lower limits, so confirm the corridor before booking.",
  containerFit:
    "Container fit uses internal dimensions only; allow for lashing, dunnage and the door opening, which is smaller than the internal cross-section.",
} as const;

function clean(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function checkEnvelope(input: OogInput, envelope: Envelope) {
  const dims: ExceededLimit[] = [];
  if (input.lengthM > envelope.lengthM) {
    dims.push({ limit: "Length", value: input.lengthM, max: envelope.lengthM, unit: "m" });
  }
  if (input.widthM > envelope.widthM) {
    dims.push({ limit: "Width", value: input.widthM, max: envelope.widthM, unit: "m" });
  }
  if (input.heightM > envelope.heightM) {
    dims.push({ limit: "Height", value: input.heightM, max: envelope.heightM, unit: "m" });
  }
  const weight: ExceededLimit | null =
    input.weightT > envelope.payloadT
      ? { limit: "Weight", value: input.weightT, max: envelope.payloadT, unit: "t" }
      : null;
  return { dims, weight };
}

export function precheckOog(raw: OogInput): OogResult {
  const input: OogInput = {
    lengthM: clean(raw.lengthM),
    widthM: clean(raw.widthM),
    heightM: clean(raw.heightM),
    weightT: clean(raw.weightT),
  };

  const trailer = checkEnvelope(input, TRAILER_ENVELOPE);
  const isOog = trailer.dims.length > 0;
  const isHeavy = trailer.weight !== null;

  const verdict: OogVerdict =
    isOog && isHeavy ? "oog-heavy" : isOog ? "oog" : isHeavy ? "heavy" : "standard";

  const exceeded: ExceededLimit[] = [...trailer.dims, ...(trailer.weight ? [trailer.weight] : [])];

  const fits: EquipmentFit[] = CONTAINER_ENVELOPES.map((envelope) => {
    const check = checkEnvelope(input, envelope);
    const reasons = [...check.dims, ...(check.weight ? [check.weight] : [])].map(
      (item) => `${item.limit.toLowerCase()} ${item.value} ${item.unit} > ${item.max} ${item.unit}`,
    );
    return { equipment: envelope.name, fits: reasons.length === 0, reasons };
  });

  const notes: string[] = [OOG_NOTES.indicative];
  if (isOog) notes.push(OOG_NOTES.oog);
  if (isHeavy) notes.push(OOG_NOTES.heavy);
  if (!isOog && !isHeavy) notes.push(OOG_NOTES.standard);
  notes.push(OOG_NOTES.containerFit);

  return { verdict, exceeded, fits, notes };
}

export const VERDICT_LABELS: Record<OogVerdict, string> = {
  standard: "Standard cargo",
  oog: "Likely out-of-gauge",
  heavy: "Likely overweight",
  "oog-heavy": "Likely out-of-gauge and overweight",
};
