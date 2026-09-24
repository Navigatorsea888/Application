/**
 * CBM and chargeable-weight maths for the Insights → Tools page.
 *
 * Pure functions, no DOM: the component owns the inputs, this file owns the
 * arithmetic, and the unit tests exercise it directly.
 *
 * Volumetric conventions (industry defaults, carriers may differ):
 *   air   1 : 6,000  — 1 m³ ≈ 166.67 kg
 *   sea   W/M        — 1 m³ = 1,000 kg (freight ton)
 *   road  1 : 3,000  — 1 m³ ≈ 333.33 kg
 */

export const AIR_DIVISOR_CM3_PER_KG = 6_000;
export const ROAD_DIVISOR_CM3_PER_KG = 3_000;
export const SEA_KG_PER_CBM = 1_000;

export interface CbmInput {
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  pieces: number;
  grossWeightKgPerPiece: number;
}

export interface CbmResult {
  cbmPerPiece: number;
  totalCbm: number;
  totalGrossKg: number;
  /** Volume expressed as weight per mode, before comparing with gross. */
  airVolumetricKg: number;
  seaVolumetricKg: number;
  roadVolumetricKg: number;
  /** Greater of gross and volumetric weight per mode. */
  airChargeableKg: number;
  seaChargeableKg: number;
  roadChargeableKg: number;
  /** Which figure won per mode — useful for the UI to explain the result. */
  airBasis: "gross" | "volumetric";
  seaBasis: "gross" | "volumetric";
  roadBasis: "gross" | "volumetric";
}

/** Treat NaN, Infinity and negatives as zero so the calculator never shows garbage. */
function clean(value: number): number {
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function calculateCbm(input: CbmInput): CbmResult {
  const lengthCm = clean(input.lengthCm);
  const widthCm = clean(input.widthCm);
  const heightCm = clean(input.heightCm);
  const pieces = Math.floor(clean(input.pieces));
  const grossPerPiece = clean(input.grossWeightKgPerPiece);

  const cm3PerPiece = lengthCm * widthCm * heightCm;
  const cbmPerPieceExact = cm3PerPiece / 1_000_000;
  const totalCbmExact = cbmPerPieceExact * pieces;
  const totalCm3 = cm3PerPiece * pieces;
  const totalGrossExact = grossPerPiece * pieces;

  const airVolumetric = totalCm3 / AIR_DIVISOR_CM3_PER_KG;
  const roadVolumetric = totalCm3 / ROAD_DIVISOR_CM3_PER_KG;
  const seaVolumetric = totalCbmExact * SEA_KG_PER_CBM;

  const pick = (volumetric: number): "gross" | "volumetric" =>
    volumetric > totalGrossExact ? "volumetric" : "gross";

  return {
    cbmPerPiece: roundTo(cbmPerPieceExact, 3),
    totalCbm: roundTo(totalCbmExact, 3),
    totalGrossKg: Math.round(totalGrossExact),
    airVolumetricKg: Math.round(airVolumetric),
    seaVolumetricKg: Math.round(seaVolumetric),
    roadVolumetricKg: Math.round(roadVolumetric),
    airChargeableKg: Math.round(Math.max(totalGrossExact, airVolumetric)),
    seaChargeableKg: Math.round(Math.max(totalGrossExact, seaVolumetric)),
    roadChargeableKg: Math.round(Math.max(totalGrossExact, roadVolumetric)),
    airBasis: pick(airVolumetric),
    seaBasis: pick(seaVolumetric),
    roadBasis: pick(roadVolumetric),
  };
}

export type DimensionUnit = "cm" | "mm" | "m" | "in";

const TO_CM: Record<DimensionUnit, number> = { cm: 1, mm: 0.1, m: 100, in: 2.54 };

export function toCentimetres(value: number, unit: DimensionUnit): number {
  return clean(value) * TO_CM[unit];
}
