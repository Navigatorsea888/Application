// ---------------------------------------------------------------------------
// Projects (case studies).
// Source: Website Content — Final Copy Deck v2.0, sections 4 and 8.
//
// The deck supplies card copy for three "Selected Experience" examples and a
// list of six recommended launch case studies, every one marked [CONFIRM]:
//
//   "Confirm (a) which projects Navigator Sea Land Limited executed directly
//    versus experience of the team at previous employers, and (b) written
//    permission from each client/project owner before naming them. If
//    permission is not available, anonymise."
//
// The three cards are published anonymised, exactly as the deck words them.
// Full case-study pages (Challenge → Solution → Result, 500–800 words, 3–6
// photos) are built only when `published` is true and the narrative fields are
// filled from confirmed project data.
// ---------------------------------------------------------------------------

export interface CaseStudy {
  slug: string;
  title: string;
  /** One-line card copy, as in the deck. */
  summary: string;
  sector: string;
  corridorSlug: string;
  serviceSlugs: string[];
  /** Deck section 8 status wording. */
  confirmStatus: string;
  /** Card shown on the site. */
  published: boolean;
  /** Optional key facts once confirmed. */
  keyFacts?: Array<[string, string]>;
  /** Full narrative — only when confirmed. */
  challenge?: string[];
  solution?: string[];
  result?: string[];
  clientQuote?: { quote: string; attribution: string };
  images?: Array<{ src: string; alt: string }>;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "tengiz-to-baluchistan-oog-route",
    title: "OOG Route: Tengiz to Baluchistan via China",
    summary:
      "Pioneered a multi-country route for oversized oilfield equipment from western Kazakhstan to Pakistan through the China Land Bridge and Khunjerab Pass.",
    sector: "Oil & Gas",
    corridorSlug: "south-asia-khunjerab",
    serviceSlugs: ["heavy-haul-over-dimensional-trucking", "project-logistics-heavy-lift"],
    confirmStatus: "Confirm permission & executing entity",
    published: true,
  },
  {
    slug: "wind-energy-components-kazakhstan",
    title: "Wind Energy Components",
    summary: "Transport engineering and delivery of wind turbine components for a major wind project in Kazakhstan.",
    sector: "Renewable Energy",
    corridorSlug: "china-land-bridge",
    serviceSlugs: ["heavy-haul-over-dimensional-trucking", "project-logistics-heavy-lift"],
    confirmStatus: "Confirm permission",
    published: true,
  },
  {
    slug: "bess-china-to-uzbekistan",
    title: "Battery Energy Storage (BESS)",
    summary: "Multimodal logistics solution for utility-scale BESS containers from China to Uzbekistan via Khorgos.",
    sector: "Renewable Energy & BESS",
    corridorSlug: "china-land-bridge",
    serviceSlugs: ["multimodal-solutions", "rail-freight"],
    confirmStatus: "Confirm — publish only if executed",
    published: true,
  },
  {
    slug: "heavy-equipment-demob-azerbaijan-atyrau",
    title: "Heavy equipment demobilisation from Azerbaijan to Atyrau via the Caspian",
    summary: "Demobilisation of heavy construction equipment across the Caspian from Azerbaijan to Atyrau.",
    sector: "EPC & Infrastructure",
    corridorSlug: "caspian-sea",
    serviceSlugs: ["ocean-caspian-freight", "heavy-haul-over-dimensional-trucking"],
    confirmStatus: "Confirm permission & executing entity",
    published: false,
  },
  {
    slug: "steel-line-pipe-india-uzbekistan",
    title: "Steel line pipe from Indian ports (Kandla / Mundra) to Uzbekistan",
    summary: "Steel line pipe from Indian ports to Uzbekistan via the INSTC.",
    sector: "Oil & Gas",
    corridorSlug: "instc",
    serviceSlugs: ["ocean-caspian-freight", "rail-freight"],
    confirmStatus: "Confirm — publish only if executed",
    published: false,
  },
  {
    slug: "steam-turbine-rotor-export-packing",
    title: "Export packing and shipment of a steam turbine rotor from Kazakhstan",
    summary: "Export packing, preservation and shipment of a steam turbine rotor from Kazakhstan.",
    sector: "Power & Utilities",
    corridorSlug: "europe-turkiye",
    serviceSlugs: ["project-logistics-heavy-lift"],
    confirmStatus: "Confirm permission & executing entity",
    published: false,
  },
];

export const publishedCaseStudies = caseStudies.filter((c) => c.published);

export const projectsLanding = {
  meta: {
    title: "Projects & Case Studies | Navigator Sea Land Limited",
    description:
      "Selected project cargo, heavy haul and multimodal movements across Central Asia, the Caspian, China and South Asia by Navigator Sea Land Limited.",
    keywords: ["project cargo case study Kazakhstan", "heavy haul case study Central Asia", "BESS logistics Uzbekistan"],
  },
  hero: {
    title: "Proven on the Region's Most Complex Moves",
    lead: "Case studies are the only honest way to describe project logistics capability. Each one follows the same format: the challenge, our solution, and the measurable result.",
    ctas: [
      { label: "Talk to Our Project Team", href: "/contact", variant: "gold" as const },
      { label: "Request a Quote", href: "/request-a-quote", variant: "onDark" as const },
    ],
  },
  /**
   * Deck: "Projects → Case Studies · Project Gallery". No photography has been
   * supplied; the gallery section renders only when this array is non-empty.
   */
  gallery: [] as Array<{ src: string; alt: string; caption: string }>,
  cta: "Facing a similar challenge? Talk to our project team.",
};
