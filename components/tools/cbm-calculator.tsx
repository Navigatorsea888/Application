"use client";

import { useMemo, useState } from "react";
import { Field, Select, TextInput } from "@/components/form-fields";
import { Card } from "@/components/ui";
import { calculateCbm, toCentimetres, type DimensionUnit } from "@/lib/tools/cbm";

const UNITS: Array<{ value: DimensionUnit; label: string }> = [
  { value: "cm", label: "Centimetres (cm)" },
  { value: "mm", label: "Millimetres (mm)" },
  { value: "m", label: "Metres (m)" },
  { value: "in", label: "Inches (in)" },
];

const kg = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const cbm = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

/**
 * CBM & chargeable weight. Every input is controlled so the result panel
 * re-computes on each keystroke; the maths lives in lib/tools/cbm.
 */
export function CbmCalculator() {
  const [unit, setUnit] = useState<DimensionUnit>("cm");
  const [length, setLength] = useState("120");
  const [width, setWidth] = useState("80");
  const [height, setHeight] = useState("100");
  const [pieces, setPieces] = useState("1");
  const [weight, setWeight] = useState("150");

  const result = useMemo(
    () =>
      calculateCbm({
        lengthCm: toCentimetres(Number(length), unit),
        widthCm: toCentimetres(Number(width), unit),
        heightCm: toCentimetres(Number(height), unit),
        pieces: Number(pieces),
        grossWeightKgPerPiece: Number(weight),
      }),
    [length, width, height, pieces, weight, unit],
  );

  const modes = [
    { label: "Air (1 : 6,000)", volumetric: result.airVolumetricKg, chargeable: result.airChargeableKg, basis: result.airBasis },
    { label: "Sea LCL (W/M, 1 m³ = 1,000 kg)", volumetric: result.seaVolumetricKg, chargeable: result.seaChargeableKg, basis: result.seaBasis },
    { label: "Road groupage (1 : 3,000)", volumetric: result.roadVolumetricKg, chargeable: result.roadChargeableKg, basis: result.roadBasis },
  ];

  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()} aria-label="Cargo dimensions">
          <Field label="Dimension unit" name="cbm-unit">
            <Select name="cbm-unit" value={unit} onChange={(e) => setUnit(e.target.value as DimensionUnit)}>
              {UNITS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={`Length (${unit})`} name="cbm-length">
              <TextInput name="cbm-length" type="number" inputMode="decimal" min={0} step="any" value={length} onChange={(e) => setLength(e.target.value)} />
            </Field>
            <Field label={`Width (${unit})`} name="cbm-width">
              <TextInput name="cbm-width" type="number" inputMode="decimal" min={0} step="any" value={width} onChange={(e) => setWidth(e.target.value)} />
            </Field>
            <Field label={`Height (${unit})`} name="cbm-height">
              <TextInput name="cbm-height" type="number" inputMode="decimal" min={0} step="any" value={height} onChange={(e) => setHeight(e.target.value)} />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Number of pieces" name="cbm-pieces" hint="Identical pieces of the size above.">
              <TextInput name="cbm-pieces" type="number" inputMode="numeric" min={1} step={1} value={pieces} onChange={(e) => setPieces(e.target.value)} />
            </Field>
            <Field label="Gross weight per piece (kg)" name="cbm-weight">
              <TextInput name="cbm-weight" type="number" inputMode="decimal" min={0} step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </Field>
          </div>
        </form>

        <output
          htmlFor="cbm-length cbm-width cbm-height cbm-pieces cbm-weight cbm-unit"
          aria-live="polite"
          className="block rounded-lg bg-ink-50 p-5"
        >
          <p className="eyebrow">Result</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-xs text-ink-600">CBM per piece</dt>
              <dd className="font-[family-name:var(--font-mono)] text-lg text-ink-900">{cbm.format(result.cbmPerPiece)} m³</dd>
            </div>
            <div>
              <dt className="text-xs text-ink-600">Total volume</dt>
              <dd className="font-[family-name:var(--font-mono)] text-lg text-ink-900">{cbm.format(result.totalCbm)} m³</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-xs text-ink-600">Total gross weight</dt>
              <dd className="font-[family-name:var(--font-mono)] text-lg text-ink-900">{kg.format(result.totalGrossKg)} kg</dd>
            </div>
          </dl>

          <table className="mt-5 w-full text-sm">
            <caption className="sr-only">Chargeable weight by transport mode</caption>
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs text-ink-600">
                <th scope="col" className="pb-2 font-medium">Mode</th>
                <th scope="col" className="pb-2 text-right font-medium">Volumetric</th>
                <th scope="col" className="pb-2 text-right font-medium">Chargeable</th>
              </tr>
            </thead>
            <tbody>
              {modes.map((mode) => (
                <tr key={mode.label} className="border-b border-ink-200 last:border-b-0">
                  <th scope="row" className="py-2.5 pr-2 text-left font-[family-name:var(--font-display)] font-medium text-ink-800">
                    {mode.label}
                    <span className="block text-xs font-normal text-ink-600">
                      {mode.basis === "volumetric" ? "Volume governs" : "Gross weight governs"}
                    </span>
                  </th>
                  <td className="py-2.5 text-right font-[family-name:var(--font-mono)] text-ink-600">{kg.format(mode.volumetric)} kg</td>
                  <td className="py-2.5 text-right font-[family-name:var(--font-mono)] font-semibold text-ink-900">{kg.format(mode.chargeable)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-4 text-xs leading-relaxed text-ink-600">
            Chargeable weight is the greater of gross and volumetric weight. Divisors are industry defaults; individual
            carriers and consolidators may apply different ratios, and sea LCL is often rated per revenue ton (whichever
            is greater of 1 m³ or 1,000 kg).
          </p>
        </output>
      </div>
    </Card>
  );
}
