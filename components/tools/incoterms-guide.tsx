"use client";

import { useState } from "react";
import { Field, Select } from "@/components/form-fields";
import { Card, buttonClass } from "@/components/ui";
import { INSURANCE_LABELS, filterIncoterms, type Incoterm, type IncotermMode, type Party } from "@/lib/tools/incoterms";

type ModeFilter = IncotermMode | "all";

const PARTY: Record<Party, string> = { seller: "Seller", buyer: "Buyer" };

function partyClass(party: Party) {
  return party === "seller" ? "text-accent-700" : "text-ink-900";
}

function TermCard({ term }: { term: Incoterm }) {
  return (
    <Card className="print-break p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg">
          <span className="font-[family-name:var(--font-mono)] text-accent-700">{term.code}</span>{" "}
          <span className="text-ink-900">{term.name}</span>
        </h3>
        <span className="rounded border border-ink-300 bg-ink-100 px-2 py-0.5 text-xs font-medium text-ink-700">
          {term.mode === "sea" ? "Sea and inland waterway only" : "Any mode of transport"}
        </span>
      </div>

      <table className="mt-4 w-full text-sm">
        <caption className="sr-only">Obligations under {term.code} {term.name}</caption>
        <thead>
          <tr className="text-left text-xs text-ink-600">
            <th scope="col" className="w-40 pb-1 font-medium">Obligation</th>
            <th scope="col" className="pb-1 font-medium">Who</th>
          </tr>
        </thead>
        <tbody className="align-top">
          <tr className="border-t border-ink-200">
            <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">Main carriage</th>
            <td className={`py-2 font-[family-name:var(--font-display)] font-semibold ${partyClass(term.mainCarriage)}`}>
              {PARTY[term.mainCarriage]} arranges and pays
            </td>
          </tr>
          <tr className="border-t border-ink-200">
            <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">Insurance</th>
            <td className="py-2 text-ink-700">
              <span className="font-[family-name:var(--font-display)] font-semibold text-ink-900">{INSURANCE_LABELS[term.insurance]}</span>
              <span className="block text-xs text-ink-600">{term.insuranceNote}</span>
            </td>
          </tr>
          <tr className="border-t border-ink-200">
            <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">Export clearance</th>
            <td className={`py-2 font-[family-name:var(--font-display)] font-semibold ${partyClass(term.exportClearance)}`}>{PARTY[term.exportClearance]}</td>
          </tr>
          <tr className="border-t border-ink-200">
            <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">Import clearance</th>
            <td className={`py-2 font-[family-name:var(--font-display)] font-semibold ${partyClass(term.importClearance)}`}>{PARTY[term.importClearance]}</td>
          </tr>
          <tr className="border-t border-ink-200">
            <th scope="row" className="py-2 pr-3 text-left font-medium text-ink-800">Risk transfers</th>
            <td className="py-2 text-ink-700">{term.riskTransfer}</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-3 rounded-md border border-gold-300 bg-gold-50 px-3 py-2 text-sm text-ink-800">
        <span className="font-[family-name:var(--font-display)] font-semibold text-ink-800">Watch out: </span>
        {term.watchOut}
      </p>
    </Card>
  );
}

/**
 * Incoterms® 2020 quick reference. Filter by mode; "Print / save as PDF"
 * uses the browser's print dialog — there is no generated file.
 */
export function IncotermsGuide() {
  const [mode, setMode] = useState<ModeFilter>("all");
  const terms = filterIncoterms(mode);

  return (
    <div>
      <div className="no-print flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <Field label="Show rules for" name="incoterms-mode" className="sm:w-72">
          <Select name="incoterms-mode" value={mode} onChange={(e) => setMode(e.target.value as ModeFilter)}>
            <option value="all">All 11 rules</option>
            <option value="any">Any mode of transport (7)</option>
            <option value="sea">Sea and inland waterway only (4)</option>
          </Select>
        </Field>
        <button type="button" onClick={() => window.print()} className={buttonClass("secondary", "md")}>
          Print / save as PDF
        </button>
      </div>

      <p className="mt-4 text-sm text-ink-600" aria-live="polite">
        Showing {terms.length} of 11 rules. Seller obligations are shown in teal. Based on ICC Incoterms® 2020; the
        contract of sale governs and the rules do not cover title, payment or breach.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {terms.map((term) => (
          <TermCard key={term.code} term={term} />
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-600">
        Incoterms® and the Incoterms® 2020 logo are trademarks of the International Chamber of Commerce (ICC). This
        guide is a summary for orientation only; refer to the ICC text for the full rules.
      </p>
    </div>
  );
}
