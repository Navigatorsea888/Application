"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Field, TextInput } from "@/components/form-fields";
import { Card, buttonClass } from "@/components/ui";
import { CONTAINER_ENVELOPES, TRAILER_ENVELOPE, VERDICT_LABELS, precheckOog, type OogVerdict } from "@/lib/tools/oog";

const VERDICT_TONE: Record<OogVerdict, string> = {
  standard: "border-success-600/30 bg-success-50 text-success-700",
  oog: "border-signal-500/40 bg-signal-50 text-signal-700",
  heavy: "border-signal-500/40 bg-signal-50 text-signal-700",
  "oog-heavy": "border-danger-600/30 bg-danger-50 text-danger-700",
};

/**
 * Out-of-gauge screening. Reference limits and verdict logic live in
 * lib/tools/oog; this component collects metres and tonnes and renders the
 * verdict, the limits exceeded, container fit and the engineer call-back.
 */
export function OogPrecheck() {
  const [length, setLength] = useState("6");
  const [width, setWidth] = useState("2.4");
  const [height, setHeight] = useState("2.5");
  const [weight, setWeight] = useState("18");

  const result = useMemo(
    () =>
      precheckOog({
        lengthM: Number(length),
        widthM: Number(width),
        heightM: Number(height),
        weightT: Number(weight),
      }),
    [length, width, height, weight],
  );

  const needsEngineer = result.verdict !== "standard";

  return (
    <Card className="p-5 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()} aria-label="Cargo dimensions and weight">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Length (m)" name="oog-length">
              <TextInput name="oog-length" type="number" inputMode="decimal" min={0} step="any" value={length} onChange={(e) => setLength(e.target.value)} />
            </Field>
            <Field label="Width (m)" name="oog-width">
              <TextInput name="oog-width" type="number" inputMode="decimal" min={0} step="any" value={width} onChange={(e) => setWidth(e.target.value)} />
            </Field>
            <Field label="Height (m)" name="oog-height">
              <TextInput name="oog-height" type="number" inputMode="decimal" min={0} step="any" value={height} onChange={(e) => setHeight(e.target.value)} />
            </Field>
          </div>
          <Field label="Gross weight (t)" name="oog-weight" hint="Single piece, including any skid or crate.">
            <TextInput name="oog-weight" type="number" inputMode="decimal" min={0} step="any" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </Field>

          <div className="rounded-lg border border-ink-200 p-4 text-sm">
            <p className="font-[family-name:var(--font-display)] font-medium text-ink-800">Indicative reference limits</p>
            <table className="mt-2 w-full">
              <caption className="sr-only">Reference cargo envelopes used by the pre-check</caption>
              <thead>
                <tr className="text-left text-xs text-ink-600">
                  <th scope="col" className="pb-1 font-medium">Equipment</th>
                  <th scope="col" className="pb-1 font-medium">L × W × H (m)</th>
                  <th scope="col" className="pb-1 text-right font-medium">Payload (t)</th>
                </tr>
              </thead>
              <tbody className="font-[family-name:var(--font-mono)] text-xs text-ink-700">
                {[TRAILER_ENVELOPE, ...CONTAINER_ENVELOPES].map((envelope) => (
                  <tr key={envelope.name}>
                    <th scope="row" className="py-1 pr-2 text-left font-[family-name:var(--font-sans)] font-normal">{envelope.name}</th>
                    <td className="py-1">{envelope.lengthM} × {envelope.widthM} × {envelope.heightM}</td>
                    <td className="py-1 text-right">{envelope.payloadT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-ink-600">
              Trailer envelope assumes a standard flatbed within a 4.0 m overall height. Legal limits vary by country.
            </p>
          </div>
        </form>

        <output htmlFor="oog-length oog-width oog-height oog-weight" aria-live="polite" className="block rounded-lg bg-ink-50 p-5">
          <p className="eyebrow">Verdict</p>
          <p className={`mt-3 inline-flex rounded-md border px-3 py-1.5 font-[family-name:var(--font-display)] text-sm font-semibold ${VERDICT_TONE[result.verdict]}`}>
            {VERDICT_LABELS[result.verdict]}
          </p>

          {result.exceeded.length > 0 ? (
            <ul className="mt-4 space-y-1.5 text-sm text-ink-700">
              {result.exceeded.map((item) => (
                <li key={item.limit} className="flex justify-between gap-3 border-b border-ink-200 pb-1.5">
                  <span>{item.limit} exceeds trailer envelope</span>
                  <span className="font-[family-name:var(--font-mono)] text-ink-900">
                    {item.value} {item.unit} <span className="text-ink-600">/ max {item.max} {item.unit}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          <h3 className="mt-5 text-sm font-semibold text-ink-900">Container fit</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {result.fits.map((fit) => (
              <li key={fit.equipment} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-ink-700">{fit.equipment}</span>
                <span className={`font-[family-name:var(--font-display)] text-xs font-semibold ${fit.fits ? "text-success-700" : "text-signal-700"}`}>
                  {fit.fits ? "Fits (internal dimensions)" : `Does not fit — ${fit.reasons.join(", ")}`}
                </span>
              </li>
            ))}
          </ul>

          <ul className="mt-5 space-y-2 text-xs leading-relaxed text-ink-600">
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          {needsEngineer ? (
            <div className="mt-5">
              <Link href="/request-a-quote?service=HEAVY_HAUL" className={buttonClass("gold", "md", "w-full sm:w-auto")}>
                Ask a heavy haul engineer to review this
              </Link>
            </div>
          ) : null}
        </output>
      </div>
    </Card>
  );
}
