/**
 * The eleven Incoterms® 2020 rules as data.
 *
 * Source of truth is ICC Incoterms® 2020. This is a guide to who arranges,
 * pays and carries risk at each stage; the contract of sale governs, and the
 * rules say nothing about title, payment terms or breach.
 *
 * "Incoterms" is a registered trademark of the International Chamber of Commerce.
 */

export type IncotermMode = "any" | "sea";
export type Party = "seller" | "buyer";
export type IncotermGroup = "E" | "F" | "C" | "D";
export type InsuranceObligation = "none" | "seller-icc-a" | "seller-icc-c";

export interface Incoterm {
  code: string;
  name: string;
  mode: IncotermMode;
  group: IncotermGroup;
  /** Where risk of loss or damage passes from seller to buyer. */
  riskTransfer: string;
  /** Who contracts and pays for the main international carriage. */
  mainCarriage: Party;
  insurance: InsuranceObligation;
  insuranceNote: string;
  exportClearance: Party;
  importClearance: Party;
  /** One sentence for importers in Kazakhstan, Uzbekistan and the wider region. */
  watchOut: string;
}

export const INSURANCE_LABELS: Record<InsuranceObligation, string> = {
  none: "No obligation on either party",
  "seller-icc-a": "Seller — Institute Cargo Clauses (A), all risks",
  "seller-icc-c": "Seller — Institute Cargo Clauses (C), minimum cover",
};

export const INCOTERMS: readonly Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    mode: "any",
    group: "E",
    riskTransfer:
      "When the goods are placed at the buyer's disposal at the seller's premises or another named place, not loaded on any collecting vehicle.",
    mainCarriage: "buyer",
    insurance: "none",
    insuranceNote: "Buyer insures at its own option; the seller has no obligation.",
    exportClearance: "buyer",
    importClearance: "buyer",
    watchOut:
      "Export formalities sit with a buyer who is usually not established in the origin country, so in practice the seller ends up clearing anyway — FCA reflects that reality and puts loading risk where it belongs.",
  },
  {
    code: "FCA",
    name: "Free Carrier",
    mode: "any",
    group: "F",
    riskTransfer:
      "When the goods are handed to the carrier nominated by the buyer at the named place — loaded on the buyer's vehicle if that place is the seller's premises, otherwise on the seller's arriving vehicle ready for unloading.",
    mainCarriage: "buyer",
    insurance: "none",
    insuranceNote: "Buyer insures at its own option; the seller has no obligation.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "The right rule for containerised and multimodal cargo into Central Asia; since 2020 the buyer can instruct its carrier to issue the seller an on-board bill of lading where a letter of credit needs one.",
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    mode: "any",
    group: "C",
    riskTransfer:
      "When the goods are handed to the first carrier at origin — even though the seller pays carriage to the named place of destination.",
    mainCarriage: "seller",
    insurance: "none",
    insuranceNote: "No obligation on either party; the buyer bears transit risk and should insure.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "Freight to Almaty or Tashkent is paid by the seller but risk passed at origin, so the buyer carries the whole transit and should arrange its own cover.",
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To",
    mode: "any",
    group: "C",
    riskTransfer:
      "When the goods are handed to the first carrier at origin; the seller pays carriage and insurance to the named place of destination.",
    mainCarriage: "seller",
    insurance: "seller-icc-a",
    insuranceNote:
      "Seller must insure to Institute Cargo Clauses (A) or equivalent for at least 110% of the contract value, in the contract currency, unless otherwise agreed.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "Check that the seller's policy names the buyer as beneficiary, covers the full inland leg to the named destination and can be claimed on locally, not only in the seller's country.",
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    mode: "any",
    group: "D",
    riskTransfer:
      "When the goods are placed at the buyer's disposal on the arriving means of transport, ready for unloading, at the named place of destination.",
    mainCarriage: "seller",
    insurance: "none",
    insuranceNote: "No obligation; the seller bears transit risk and normally insures for its own account.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "Import clearance is still the buyer's job, so agree in the contract who pays waiting time and demurrage if the truck or wagon sits at the border or terminal while clearance is pending.",
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    mode: "any",
    group: "D",
    riskTransfer:
      "When the goods, once unloaded from the arriving means of transport, are placed at the buyer's disposal at the named place of destination.",
    mainCarriage: "seller",
    insurance: "none",
    insuranceNote: "No obligation; the seller bears transit risk and normally insures for its own account.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "The only rule that makes the seller unload, so name a place where the seller's forwarder actually controls unloading (a terminal or warehouse), not a site the seller cannot access before import clearance.",
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    mode: "any",
    group: "D",
    riskTransfer:
      "When the goods, cleared for import, are placed at the buyer's disposal on the arriving means of transport, ready for unloading, at the named place of destination.",
    mainCarriage: "seller",
    insurance: "none",
    insuranceNote: "No obligation; the seller bears transit risk and normally insures for its own account.",
    exportClearance: "seller",
    importClearance: "seller",
    watchOut:
      "Makes the seller the importer of record and payer of duties and VAT, which is often impractical in the EAEU where the declarant generally has to be a locally established entity — DAP with the buyer clearing is usually the workable alternative.",
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    mode: "sea",
    group: "F",
    riskTransfer:
      "When the goods are placed alongside the vessel nominated by the buyer (on the quay or a barge) at the named port of shipment.",
    mainCarriage: "buyer",
    insurance: "none",
    insuranceNote: "Buyer insures at its own option; the seller has no obligation.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "Meant for bulk and break-bulk loaded over the quay; for a landlocked buyer it leaves the whole sea leg, transit port and onward rail or road to arrange from thousands of kilometres away.",
  },
  {
    code: "FOB",
    name: "Free on Board",
    mode: "sea",
    group: "F",
    riskTransfer: "When the goods are on board the vessel nominated by the buyer at the named port of shipment.",
    mainCarriage: "buyer",
    insurance: "none",
    insuranceNote: "Buyer insures at its own option; the seller has no obligation.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "A sea-only rule that is frequently misused for containers handed over at a container yard days before loading — the seller then carries risk it does not control; FCA is the correct term.",
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    mode: "sea",
    group: "C",
    riskTransfer:
      "When the goods are on board the vessel at the port of shipment — even though the seller pays freight to the named port of destination.",
    mainCarriage: "seller",
    insurance: "none",
    insuranceNote: "No obligation on either party; the buyer bears transit risk and should insure.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "The named destination is a seaport such as Poti, Bandar Abbas or Qingdao, not the inland delivery point, so the buyer arranges and bears risk on the onward rail or road leg from the moment the goods are on board at origin.",
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight",
    mode: "sea",
    group: "C",
    riskTransfer:
      "When the goods are on board the vessel at the port of shipment; the seller pays freight and insurance to the named port of destination.",
    mainCarriage: "seller",
    insurance: "seller-icc-c",
    insuranceNote:
      "Seller must insure to at least Institute Cargo Clauses (C) or equivalent for 110% of the contract value, unless a higher level is agreed.",
    exportClearance: "seller",
    importClearance: "buyer",
    watchOut:
      "ICC (C) is minimum cover and stops at the discharge port, so the inland leg to Central Asia and most theft or wetting losses are uninsured unless the buyer extends the cover.",
  },
];

export const SEA_ONLY_CODES = ["FAS", "FOB", "CFR", "CIF"] as const;

export function getIncoterm(code: string): Incoterm | undefined {
  return INCOTERMS.find((term) => term.code === code.toUpperCase());
}

export function filterIncoterms(mode: IncotermMode | "all"): Incoterm[] {
  if (mode === "all") return [...INCOTERMS];
  return INCOTERMS.filter((term) => term.mode === mode);
}
