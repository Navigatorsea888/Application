// ---------------------------------------------------------------------------
// Industries — landing page and seven sector pages.
// Source: Website Content — Final Copy Deck v2.0, section 6.
// ---------------------------------------------------------------------------

import type { IndustryPage } from "./types";

export const industriesLanding = {
  meta: {
    title: "Industries We Serve | Navigator Sea Land Limited",
    description:
      "Oil & gas, petrochemicals, mining, renewable energy & BESS, power, EPC and agro logistics across Kazakhstan and Central Asia — sector knowledge that reduces project risk.",
    keywords: ["oil and gas logistics Kazakhstan", "wind turbine transport Kazakhstan", "BESS logistics Uzbekistan", "mining logistics Central Asia"],
  },
  hero: {
    title: "Sector Knowledge That Reduces Project Risk.",
    lead: "Every industry has its own cargo, standards and pressure points. Our teams understand the operational realities of the sectors we serve — from the HSSE expectations of oil majors to the delicate handling of wind blades and the tight commissioning windows of power projects.",
    ctas: [
      { label: "Request a Quote", href: "/request-a-quote", variant: "gold" as const },
      { label: "Speak to Our Sector Team", href: "/contact", variant: "onDark" as const },
    ],
  },
};

const sectorMeta = (sector: string, keywords: string[]) => ({
  title: `${sector} Logistics Central Asia | Navigator Sea Land Limited`,
  description: `Specialist ${sector.toLowerCase()} logistics in Kazakhstan and Central Asia: project cargo, heavy haul, multimodal and compliance by Navigator Sea Land Limited.`,
  keywords,
});

export const industries: IndustryPage[] = [
  {
    slug: "oil-gas",
    path: "/industries/oil-gas",
    title: "Oil & Gas",
    summary: "Project cargo, heavy haul and critical spares for operators, EPCs and service companies in western Kazakhstan.",
    icon: "flame",
    meta: sectorMeta("Oil & Gas", ["oil and gas logistics Kazakhstan", "Tengiz logistics", "Atyrau freight forwarder", "Kashagan supply chain"]),
    hero: {
      title: "Logistics Powering Kazakhstan's Energy Sector",
      lead: "From Atyrau, at the heart of the Caspian oil region, we support operators, EPC contractors and service companies.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo:
      "Process modules, pressure vessels, compressors, drilling equipment, tubulars and line pipe, wellhead equipment, chemicals and drilling fluids, generators, camp modules, critical spares.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Western Kazakhstan hosts some of the world's largest oil and gas developments. Supplying them means moving oversized process equipment, drilling materials and urgent spares to remote fields under demanding HSSE rules. Our Atyrau team works where the industry works.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "Caspian routing via Baku / Alat to Aktau and Kuryk for European and Turkish supplies.",
          "Heavy haul and SPMT operations to field sites, with route surveys and permits.",
          "Temporary import and re-export of rigs, cranes and tools.",
          "24/7 critical spares service by air and dedicated road.",
          "HSSE documentation and contractor pre-qualification support.",
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Air Freight", href: "/services/air-freight", kind: "service" },
      { label: "Caspian Sea", href: "/corridors/caspian-sea", kind: "corridor" },
    ],
  },
  {
    slug: "petrochemicals-chemicals",
    path: "/industries/petrochemicals-chemicals",
    title: "Petrochemicals & Chemicals",
    summary: "Compliant movement of equipment, polymers and liquid chemicals across Central Asia.",
    icon: "flask",
    meta: sectorMeta("Petrochemicals & Chemicals", ["chemical logistics Kazakhstan", "petrochemical transport Central Asia", "dangerous goods transport"]),
    hero: {
      title: "Safe Logistics for Petrochemical and Chemical Supply Chains",
      lead: "Compliant movement of equipment, polymers and liquid chemicals across Central Asia.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo: "Reactors and columns, catalysts, polymers (PE, PP, PVC), base oils, methanol, caustic soda, acids, sulphur, process chemicals.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Kazakhstan and Uzbekistan are expanding refining and petrochemical capacity. We support both the construction phase — reactors, columns and modules — and ongoing operations with polymers, catalysts and bulk liquid chemicals.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "ISO tanks, road tankers and rail tank wagons for bulk liquids.",
          "ADR, IMDG and SMGS Annex 2 dangerous-goods compliance.",
          "ETSNG / GNG coding and EAEU classification for chemicals.",
          "Heavy-lift delivery of refinery and plant equipment.",
        ],
      },
    ],
    related: [
      { label: "Bulk Liquid Transportation", href: "/services/bulk-liquid-transportation", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "China Land Bridge", href: "/corridors/china-land-bridge", kind: "corridor" },
    ],
  },
  {
    slug: "mining-metals",
    path: "/industries/mining-metals",
    title: "Mining & Metals",
    summary: "Heavy equipment in, concentrates and metals out — across long distances and difficult borders.",
    icon: "pickaxe",
    meta: sectorMeta("Mining & Metals", ["mining logistics Kazakhstan", "mining equipment transport Uzbekistan", "concentrate export Central Asia"]),
    hero: {
      title: "Delivering Mining Projects in Remote Terrain",
      lead: "Heavy equipment in, concentrates and metals out — across long distances and difficult borders.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo:
      "Crushers, mill shells, haul trucks and excavators, conveyor systems, reagents, explosives-related materials (licensed carriers), concentrates in bulk bags and containers, steel and metal products.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Central Asia is rich in copper, gold, uranium, zinc and rare metals, often in remote locations. We move heavy mining equipment to site and help export concentrates and metals to global markets.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "OOG route engineering to remote mine sites.",
          "Rail wagon programmes for concentrate and metal exports.",
          "Reagent logistics with dangerous-goods compliance.",
          "Multi-country routing including China and the Khunjerab corridor to Pakistan.",
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "South Asia (Khunjerab)", href: "/corridors/south-asia-khunjerab", kind: "corridor" },
    ],
  },
  {
    slug: "renewable-energy-bess",
    path: "/industries/renewable-energy-bess",
    title: "Renewable Energy & BESS",
    summary: "Wind, solar and battery storage projects delivered with specialised transport engineering.",
    icon: "wind",
    meta: sectorMeta("Renewable Energy & BESS", [
      "wind turbine transport Kazakhstan",
      "BESS logistics Uzbekistan",
      "solar project logistics Central Asia",
      "wind blade transport",
    ]),
    hero: {
      title: "Logistics for Central Asia's Energy Transition",
      lead: "Wind, solar and battery storage projects delivered with specialised transport engineering.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo:
      "Wind turbine blades, towers, nacelles and hubs; BESS containers (Class 9 lithium batteries); PV modules and inverters; transformers and substation equipment; cable drums.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Kazakhstan and Uzbekistan are building gigawatts of wind, solar and battery energy storage capacity. These projects bring some of the most challenging cargo in logistics — 80-metre blades, heavy nacelles, and dangerous-goods classified battery containers.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "Blade-transport route surveys and specialised blade trailers.",
          "Dangerous-goods compliant BESS shipping from China by rail and road.",
          "Port-to-site and rail-to-site delivery planning in line with installation sequence.",
          "Laydown yard and just-in-time delivery management.",
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Warehousing & Distribution", href: "/services/warehousing-distribution", kind: "service" },
      { label: "China Land Bridge", href: "/corridors/china-land-bridge", kind: "corridor" },
    ],
  },
  {
    slug: "power-utilities",
    path: "/industries/power-utilities",
    title: "Power & Utilities",
    summary: "Transformers, turbines and generators delivered to substations and power plants.",
    icon: "bolt",
    meta: sectorMeta("Power & Utilities", ["transformer transport Kazakhstan", "power plant logistics Central Asia"]),
    hero: {
      title: "Heavy Logistics for Power Generation and Grids",
      lead: "Transformers, turbines and generators delivered to substations and power plants.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo: "Power transformers, reactors, generator stators, steam and gas turbine rotors, boilers, switchgear, cable drums.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Modernisation of power plants and transmission grids across Central Asia requires delivery of the heaviest single items in industry — transformers, generator stators and turbine rotors — often to sites with restricted access.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "Girder-bridge and modular trailers for transformers.",
          "Export packing supervision and preservation for sensitive rotating equipment.",
          "Bridge assessments and obstacle management.",
          "Jacking and skidding onto foundations.",
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Project Logistics & Heavy Lift", href: "/services/project-logistics-heavy-lift", kind: "service" },
      { label: "Europe & Türkiye", href: "/corridors/europe-turkiye", kind: "corridor" },
    ],
  },
  {
    slug: "epc-infrastructure",
    path: "/industries/epc-infrastructure",
    title: "EPC & Infrastructure",
    summary: "From the tender logistics chapter to demobilisation — aligned to your project schedule.",
    icon: "hardhat",
    meta: sectorMeta("EPC & Infrastructure", ["EPC logistics Kazakhstan", "construction project logistics Uzbekistan"]),
    hero: {
      title: "Your Embedded Logistics Partner for EPC Projects",
      lead: "From the tender logistics chapter to demobilisation — aligned to your project schedule.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo:
      "Steel structures, piping, pre-cast elements, modules, cranes and heavy construction plant, camp and welfare units, electrical equipment.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "EPC contractors need a logistics partner that thinks like a project team. We join at tender stage, build the logistics plan into your schedule and deliver every phase: construction materials, main equipment, and the demobilisation of cranes and plant.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "Logistics chapter and budget for EPC bids.",
          "Duty exemption support under investment frameworks.",
          "Phased delivery aligned with construction sequence.",
          "Crane and heavy equipment mobilisation and demobilisation across borders.",
        ],
      },
    ],
    related: [
      { label: "Project Logistics & Heavy Lift", href: "/services/project-logistics-heavy-lift", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "Middle Corridor (TITR)", href: "/corridors/middle-corridor", kind: "corridor" },
    ],
  },
  {
    slug: "agro-commodities",
    path: "/industries/agro-commodities",
    title: "Agro & Commodities",
    summary: "Grain, oilseeds, edible oils, cotton and fertilisers moved efficiently by rail, sea and road.",
    icon: "wheat",
    meta: sectorMeta("Agro & Commodities", ["grain export Kazakhstan", "edible oil logistics", "fertiliser transport Central Asia"]),
    hero: {
      title: "Connecting Central Asian Commodities to Global Markets",
      lead: "Grain, oilseeds, edible oils, cotton and fertilisers moved efficiently by rail, sea and road.",
      ctas: [{ label: "Speak to Our Sector Team", href: "/contact", variant: "gold" }],
    },
    cargo: "Wheat, barley, flour, oilseeds, sunflower oil, cotton, fertilisers (urea, ammonium nitrate), sugar.",
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Kazakhstan is a major exporter of wheat, flour and sunflower oil; Uzbekistan of cotton and textiles. We help traders and producers move commodities efficiently to China, Iran, Afghanistan, the Caucasus and beyond.",
        ],
      },
      {
        type: "list",
        heading: "How We Help",
        items: [
          "Rail wagon and container programmes.",
          "Flexitank and ISO tank solutions for edible oils.",
          "Phytosanitary certificates and certificates of origin.",
          "Routing via China, INSTC and the Caspian.",
        ],
      },
    ],
    related: [
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "Bulk Liquid Transportation", href: "/services/bulk-liquid-transportation", kind: "service" },
      { label: "INSTC", href: "/corridors/instc", kind: "corridor" },
    ],
  },
];

export function findIndustry(slug: string): IndustryPage | undefined {
  return industries.find((i) => i.slug === slug);
}
