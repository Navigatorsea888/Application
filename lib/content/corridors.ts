// ---------------------------------------------------------------------------
// Corridors & Network — landing page and six corridor sub-pages.
// Source: Website Content — Final Copy Deck v2.0, section 7.
//
// The deck supplies the landing copy and a route/best-for table, and asks for
// a 400–600 word sub-page per corridor with route, transit-time ranges, border
// points, suitable cargo, documentation, advantages and constraints.
//
// Transit-time ranges are NOT published: the deck requires internal
// validation first and a "last updated" date on each page. Each corridor
// carries `reviewedOn`; set `transitTimes` on a corridor once figures are
// validated and the page will show them.
// ---------------------------------------------------------------------------

import type { CorridorPage } from "./types";

export const corridorsLanding = {
  meta: {
    title: "Eurasian Logistics Corridors | Navigator Sea Land Limited",
    description:
      "Expertise across the China Land Bridge, Middle Corridor (TITR), INSTC, Caspian Sea and Khunjerab corridors connecting Central Asia to the world.",
    keywords: [
      "Middle Corridor logistics",
      "TITR freight",
      "INSTC Central Asia",
      "China Land Bridge Kazakhstan",
      "Caspian corridor",
    ],
  },
  hero: {
    title: "The Corridors That Connect Central Asia",
    lead: "Choose the route that fits your cargo, schedule and risk profile — we operate them all.",
    ctas: [
      { label: "Find My Best Route", href: "/request-a-quote", variant: "gold" as const },
      { label: "Speak to a Project Engineer", href: "/contact", variant: "onDark" as const },
    ],
    image: {
      instruction:
        "Interactive SVG map. Colours: rail = teal, road = gold, sea/Caspian = navy-blue, air = light grey dashed. Pins for Almaty and Atyrau offices, ports and border crossings.",
      alt: "Schematic map of Eurasian freight corridors served by Navigator Sea Land",
    },
  },
  intro:
    "Geopolitics, capacity and seasonality continually reshape Eurasian freight flows. Navigator Sea Land Limited keeps every major corridor open to you, and we re-plan quickly when conditions change.",
  transitNote:
    "Transit-time ranges are published for each corridor only after internal validation, because corridor performance changes frequently. Ask us for the current range for your routing.",
};

const REVIEWED = "2026-09-24";

export const corridors: CorridorPage[] = [
  {
    slug: "china-land-bridge",
    path: "/corridors/china-land-bridge",
    title: "China Land Bridge",
    summary: "Khorgos / Altynkol and Dostyk / Alashankou gateways into Kazakhstan, Uzbekistan and beyond.",
    icon: "train",
    route: "China → Khorgos / Altynkol or Dostyk / Alashankou → Kazakhstan → Uzbekistan / Kyrgyzstan / Russia / Europe",
    bestFor: "Containers, BESS, industrial equipment, consumer goods from China",
    borderPoints: ["Khorgos / Altynkol", "Dostyk / Alashankou", "Nur Zholy (road)", "Bakhty (road)", "Saryagash (to Uzbekistan)"],
    reviewedOn: REVIEWED,
    meta: {
      title: "China Land Bridge: Khorgos & Dostyk Rail Freight | Navigator Sea Land Limited",
      description:
        "China–Kazakhstan rail and road freight through Khorgos / Altynkol and Dostyk / Alashankou into Central Asia, Russia and Europe. Gauge change, documentation and OOG handled.",
      keywords: ["China Land Bridge Kazakhstan", "Khorgos rail", "Dostyk Alashankou", "China Kazakhstan rail freight"],
    },
    hero: {
      title: "China Land Bridge",
      lead: "The overland gateway from China's manufacturing centres into Kazakhstan, Uzbekistan, Kyrgyzstan and onward to Russia and Europe.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "Most project equipment, BESS containers and industrial goods manufactured in China enter Central Asia by rail or road through two Kazakh gateways: Khorgos / Altynkol in the south, close to Almaty, and Dostyk / Alashankou further north. From either, cargo continues by the 1,520 mm CIS rail network to Almaty, Astana and the western regions, crosses into Uzbekistan at Saryagash, or joins the northern network towards Russia and Europe.",
          "Both gateways are gauge-change points: cargo moves from China's 1,435 mm standard gauge to the 1,520 mm gauge used across the former Soviet network. Containers are transshipped between wagons; conventional and out-of-gauge cargo is re-loaded and re-secured, then approved against a different loading-gauge profile. We supervise that transfer rather than leave it to the terminal.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "Containers", body: "20' and 40' FCL and LCL, block trains and ISO tanks from Lianyungang, Xi'an, Urumqi, Yiwu and Shanghai.", icon: "box" },
          { title: "BESS & renewables", body: "Class 9 lithium battery containers, inverters, PV modules and substation equipment, with dangerous-goods documentation for rail.", icon: "wind" },
          { title: "Industrial & OOG", body: "Machinery and oversized components on flat and well wagons with railway-approved loading schemes, or by road via Nur Zholy and Bakhty.", icon: "crane" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "SMGS consignment note for the CIS rail leg; Chinese rail waybill or CIM/SMGS through document where available.",
          "ETSNG / GNG cargo coding, and railway loading-scheme approval for out-of-gauge pieces.",
          "Transit and import declarations under the EAEU Customs Code; certificates of conformity (EAEU TR) where required.",
          "Dangerous-goods documentation to SMGS Annex 2 for BESS and chemical cargo.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "China Land Bridge advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["Shortest overland route from China into Central Asia; faster than ocean via the Gulf or Caspian.", "Gauge change at the border: every piece is transshipped, so terminal capacity and wagon supply set the pace."],
          ["Two gateways give routing flexibility when one is congested.", "Seasonal congestion and Chinese export peaks affect wagon availability and dwell times."],
          ["Direct connections to Almaty, Tashkent, Astana and the northern network.", "OOG pieces need loading-gauge approval on both railways, with lead time that must be planned in."],
        ],
      },
    ],
    related: [
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "Bulk Liquid Transportation", href: "/services/bulk-liquid-transportation", kind: "service" },
      { label: "Renewable Energy & BESS", href: "/industries/renewable-energy-bess", kind: "industry" },
    ],
  },
  {
    slug: "middle-corridor",
    path: "/corridors/middle-corridor",
    title: "Middle Corridor (TITR)",
    summary: "China – Kazakhstan – Caspian – Azerbaijan – Georgia – Türkiye – Europe.",
    icon: "route",
    route: "China → Kazakhstan → Aktau / Kuryk → Caspian → Baku / Alat → Georgia → Türkiye / Black Sea → Europe",
    bestFor: "China–Europe cargo avoiding northern routes; Europe → Central Asia project cargo",
    borderPoints: ["Khorgos / Dostyk", "Aktau / Kuryk ports", "Baku / Alat", "Georgia (Tbilisi, Poti, Batumi)", "Kars / Istanbul (Türkiye)"],
    reviewedOn: REVIEWED,
    meta: {
      title: "Middle Corridor (TITR) Logistics | Navigator Sea Land Limited",
      description:
        "Trans-Caspian International Transport Route freight: China and Central Asia to Europe via Kazakhstan, the Caspian, Azerbaijan, Georgia and Türkiye. Rail, ferry and road planned as one.",
      keywords: ["Middle Corridor logistics", "TITR freight", "Trans-Caspian route", "Caspian shipping Aktau Baku"],
    },
    hero: {
      title: "Middle Corridor (TITR)",
      lead: "The Trans-Caspian International Transport Route: rail across Kazakhstan, a Caspian crossing to Azerbaijan, and rail or road through Georgia to Türkiye and Europe.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "The Middle Corridor runs from China through Kazakhstan to the Caspian ports of Aktau and Kuryk, crosses by rail ferry or ro-ro to Baku / Alat in Azerbaijan, and continues by rail through Georgia to the Black Sea ports of Poti and Batumi or overland to Türkiye and Europe. In the opposite direction it is the natural route for European and Turkish project equipment bound for western Kazakhstan.",
          "Its advantage is that it avoids the northern route entirely. Its difficulty is the Caspian crossing: vessel capacity is finite, sailings are weather-dependent, and an out-of-gauge piece competes for the same deck space as everything else. Planning the corridor means planning that crossing first and fitting the land legs around it.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "China–Europe containers", body: "Block trains and single containers where the northern route is unavailable or undesirable.", icon: "box" },
          { title: "European project cargo", body: "Transformers, modules and machinery from European OEMs to Atyrau, Tengiz and the Caspian oil region.", icon: "crane" },
          { title: "Türkiye ↔ Central Asia", body: "Road under TIR through Georgia and Azerbaijan, then Caspian ferry to Aktau or Kuryk.", icon: "truck" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "SMGS consignment notes on the Kazakh, Azerbaijani and Georgian railways; CMR and TIR for road legs.",
          "Bills of lading or ferry waybills for the Caspian crossing; stowage and lashing approvals for OOG pieces.",
          "Transit declarations in each country crossed; EAEU import formalities at Kazakh entry.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "Middle Corridor advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["Avoids the northern route; politically and commercially resilient.", "Caspian vessel capacity and weather windows govern the schedule."],
          ["Serves western Kazakhstan directly from Europe and Türkiye.", "Multiple transshipments: rail–vessel–rail; each is a hand-over to manage."],
          ["Growing investment in port and rail capacity along the route.", "Peak demand periods produce queues at Aktau, Kuryk and Alat."],
        ],
      },
    ],
    related: [
      { label: "Multimodal Solutions", href: "/services/multimodal-solutions", kind: "service" },
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "EPC & Infrastructure", href: "/industries/epc-infrastructure", kind: "industry" },
    ],
  },
  {
    slug: "instc",
    path: "/corridors/instc",
    title: "INSTC",
    summary: "India and the Gulf to Central Asia and Russia via Iran and the Caspian.",
    icon: "anchor",
    route: "India / Gulf → Bandar Abbas → Iran (rail/road) → Turkmenistan / Kazakhstan / Caspian → Central Asia / Russia",
    bestFor: "Indian steel, pipes, equipment and pharma to Central Asia",
    borderPoints: ["Bandar Abbas", "Sarakhs (Iran–Turkmenistan)", "Bolashak (Kazakhstan rail)", "Anzali / Amirabad (Caspian)", "Aktau"],
    reviewedOn: REVIEWED,
    meta: {
      title: "INSTC Logistics: India to Central Asia via Iran | Navigator Sea Land Limited",
      description:
        "International North–South Transport Corridor freight from India and the Gulf through Bandar Abbas and Iran to Turkmenistan, Kazakhstan and Central Asia, by rail, road and Caspian.",
      keywords: ["INSTC Central Asia", "INSTC shipping", "India Kazakhstan freight", "Bandar Abbas Central Asia"],
    },
    hero: {
      title: "INSTC — International North–South Transport Corridor",
      lead: "The southern gateway: from Indian and Gulf ports through Iran to Turkmenistan, Kazakhstan, Uzbekistan and onward north.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "The INSTC links the Indian Ocean to Central Asia and the Caspian. Cargo from Nhava Sheva, Mundra or Jebel Ali reaches Bandar Abbas, moves by rail or road across Iran, and continues either overland through Turkmenistan into Kazakhstan and Uzbekistan — including the Bolashak rail crossing — or across the Caspian from Anzali and Amirabad to Aktau.",
          "The corridor rewards careful counterparty and compliance work. Routings, banking arrangements and carrier selection are checked against the sanctions position applicable to the cargo and the parties at the time of shipment — a check we make on every INSTC enquiry before quoting.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "Steel and line pipe", body: "Indian steel products and pipe for oil & gas and infrastructure projects in Kazakhstan and Uzbekistan.", icon: "layers" },
          { title: "Equipment", body: "Machinery and project equipment from Indian manufacturers, including break bulk via Bandar Abbas.", icon: "crane" },
          { title: "Pharma and consumer goods", body: "Containerised cargo where the INSTC transit compares favourably with routing via the Gulf and Türkiye.", icon: "box" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "Ocean bill of lading to Bandar Abbas; Iranian transit documentation and rail or CMR documents onward.",
          "SMGS consignment notes on the Turkmen and Kazakh railways; EAEU import declarations at Kazakh entry.",
          "Sanctions and dual-use screening of cargo, parties and carriers before booking.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "INSTC advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["A direct southern route from India and the Gulf that avoids the long ocean routing via Europe or China.", "Compliance screening is essential and can restrict routings, carriers and payment arrangements."],
          ["Rail connections through Turkmenistan to Kazakhstan and Uzbekistan.", "Infrastructure and border capacity vary; transit times are less predictable than on the China Land Bridge."],
          ["Caspian branch offers an alternative when overland capacity is short.", "Caspian vessel schedules and Iranian port capacity govern the northern leg."],
        ],
      },
    ],
    related: [
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "Agro & Commodities", href: "/industries/agro-commodities", kind: "industry" },
    ],
  },
  {
    slug: "caspian-sea",
    path: "/corridors/caspian-sea",
    title: "Caspian Sea",
    summary: "Aktau, Kuryk, Baku/Alat and Turkmenbashi — ro-ro, ferry and heavy-lift vessels.",
    icon: "ship",
    route: "Aktau · Kuryk · Baku / Alat · Turkmenbashi; river-sea access via Volga–Don",
    bestFor: "Heavy-lift, ro-ro and project cargo to western Kazakhstan",
    borderPoints: ["Aktau", "Kuryk", "Baku / Alat", "Turkmenbashi", "Anzali / Amirabad", "Volga–Don canal"],
    reviewedOn: REVIEWED,
    meta: {
      title: "Caspian Sea Freight: Aktau, Kuryk, Baku | Navigator Sea Land Limited",
      description:
        "Caspian ferry, ro-ro, heavy-lift and general cargo shipping between Aktau, Kuryk, Baku/Alat and Turkmenbashi, with river-sea access via the Volga–Don. Project cargo to western Kazakhstan.",
      keywords: ["Caspian shipping Aktau Baku", "Caspian ferry freight", "Kuryk port", "heavy lift Caspian"],
    },
    hero: {
      title: "Caspian Sea",
      lead: "The crossing that connects Central Asia to the Caucasus, and the constraint most corridor plans turn on.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "We operate across the Caspian through Aktau and Kuryk on the eastern shore, Baku / Alat on the western, and Turkmenbashi to the south, using rail ferries, ro-ro tonnage, general cargo vessels and heavy-lift vessels depending on the piece. River-sea vessels reach the Caspian from the Black Sea and the Baltic via the Volga–Don canal in the navigation season.",
          "Barge or heavy-lift tonnage is often the answer for cargo that will not go by ferry — a single oversized module, or a weight concentration no deck will take. It buys flexibility on dimensions at the cost of schedule, and works best when it is planned in from the start rather than reached for when a ferry booking fails.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "Heavy-lift and project cargo", body: "Transformers, vessels and modules for Atyrau, Tengiz and the North Caspian fields.", icon: "crane" },
          { title: "Ro-ro and wheeled", body: "Trucks, trailers, cranes and construction plant moving between the Caucasus and Kazakhstan.", icon: "truck" },
          { title: "Rail wagons and containers", body: "Rail ferry services carry loaded wagons and containers between Alat and Aktau / Kuryk.", icon: "train" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "Bills of lading or ferry waybills; cargo manifests and stowage plans approved by the carrier.",
          "Lashing and securing plans for OOG pieces; IMDG declarations for dangerous goods.",
          "Port handling arrangements at both shores, including craneage and laydown for heavy pieces.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "Caspian Sea advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["Direct access to western Kazakhstan's oil and gas region from Europe and Türkiye.", "Finite vessel capacity; sailings are weather-dependent, particularly in winter."],
          ["Ferry, ro-ro and heavy-lift options for very different cargo profiles.", "Deck space is shared with all other Middle Corridor cargo at peak times."],
          ["River-sea access widens the vessel pool in the navigation season.", "Volga–Don navigation is seasonal and subject to draught limits."],
        ],
      },
    ],
    related: [
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Oil & Gas", href: "/industries/oil-gas", kind: "industry" },
    ],
  },
  {
    slug: "south-asia-khunjerab",
    path: "/corridors/south-asia-khunjerab",
    title: "South Asia (Khunjerab)",
    summary: "Road link via the Khunjerab Pass to Pakistan ports and project sites.",
    icon: "map",
    route: "Kazakhstan → China (Xinjiang) → Khunjerab Pass → Sost → Pakistan",
    bestFor: "OOG and mining cargo to Pakistan; Karachi port connections",
    borderPoints: ["Khorgos / Nur Zholy (Kazakhstan–China)", "Kashgar", "Khunjerab Pass", "Sost (Pakistan)", "Karachi"],
    reviewedOn: REVIEWED,
    meta: {
      title: "Khunjerab Corridor: Central Asia to Pakistan by Road | Navigator Sea Land Limited",
      description:
        "Road freight from Kazakhstan and Central Asia through Xinjiang and the Khunjerab Pass to Sost, Karachi and Pakistani project sites, including oversized and mining cargo.",
      keywords: ["Khunjerab freight", "Kazakhstan Pakistan road transport", "Central Asia Pakistan logistics"],
    },
    hero: {
      title: "South Asia via the Khunjerab Pass",
      lead: "The high-altitude road corridor linking Kazakhstan and Central Asia with Pakistan's ports and project sites through Xinjiang.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "Cargo leaves Kazakhstan by road through Khorgos or Nur Zholy into China's Xinjiang region, continues to Kashgar, and climbs the Karakoram Highway to the Khunjerab Pass — the highest paved border crossing in the world — before descending to Sost in Pakistan and onward to Islamabad, Karachi or the project site.",
          "Our team pioneered a multi-country route on this corridor for oversized oilfield equipment from Tengiz in western Kazakhstan to Baluchistan. That experience — permits in three jurisdictions, altitude and weather windows, and the engineering of oversized loads on mountain roads — is what we bring to every enquiry on the route.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "Oversized oilfield equipment", body: "Drilling and production equipment between the Caspian region and Pakistani fields.", icon: "flame" },
          { title: "Mining cargo", body: "Equipment, reagents and concentrates between Central Asian mines and Pakistani ports.", icon: "pickaxe" },
          { title: "Project and general cargo", body: "Full truck loads under transit procedures where the sea route via Karachi and Bandar Abbas is slower.", icon: "truck" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "CMR consignment notes and transit procedures across Kazakhstan, China and Pakistan.",
          "Oversize permits and escort arrangements in each jurisdiction for OOG loads.",
          "Export, transit and import declarations, with EAEU formalities at Kazakh exit or entry.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "Khunjerab corridor advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["A direct overland link between Central Asia and Pakistan that avoids Iran and the long sea route.", "Seasonal: the pass closes in winter and weather windows govern the schedule."],
          ["Proven for oversized loads with the right engineering and permits.", "Altitude, gradients and mountain roads limit dimensions and weights; route surveys are essential."],
          ["Connects to Karachi and Pakistani project sites by road.", "Border processing at three frontiers requires pre-arranged procedures."],
        ],
      },
    ],
    related: [
      { label: "Road Freight", href: "/services/road-freight", kind: "service" },
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Mining & Metals", href: "/industries/mining-metals", kind: "industry" },
    ],
  },
  {
    slug: "europe-turkiye",
    path: "/corridors/europe-turkiye",
    title: "Europe & Türkiye",
    summary: "Road, rail and ocean connections for equipment from European manufacturers.",
    icon: "globe",
    route: "Road (TIR), rail and ocean links via Georgia, Türkiye and Black Sea ports",
    bestFor: "Machinery and equipment from European OEMs",
    borderPoints: ["Istanbul / Kapıkule", "Mersin", "Poti / Batumi", "Tbilisi", "Baku / Alat"],
    reviewedOn: REVIEWED,
    meta: {
      title: "Europe & Türkiye to Central Asia Freight | Navigator Sea Land Limited",
      description:
        "Road (TIR), rail and ocean routes from European and Turkish manufacturers to Kazakhstan and Central Asia via Georgia, the Black Sea and the Caspian.",
      keywords: ["Europe Kazakhstan freight", "Türkiye Central Asia logistics", "TIR trucking Europe Kazakhstan"],
    },
    hero: {
      title: "Europe & Türkiye",
      lead: "Road, rail and ocean connections that bring European and Turkish equipment to Central Asian projects.",
      ctas: [
        { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
        { label: "All Corridors", href: "/corridors", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        heading: "The Route",
        paragraphs: [
          "European OEM equipment reaches Central Asia by three main paths. Road under TIR runs from Europe through Türkiye, Georgia and Azerbaijan to the Caspian ferry at Baku / Alat, then to Aktau or Kuryk. Ocean break bulk and containers sail from Antwerp, Hamburg or Rotterdam to Poti and Batumi on the Black Sea, or to Mersin, and join the Middle Corridor eastward. Rail via the northern network remains an option for some cargo where the commercial and compliance position allows.",
          "Türkiye is also a manufacturing origin in its own right, and Istanbul and Mersin are natural consolidation points for Turkish and European cargo bound for the Caucasus and Central Asia.",
        ],
      },
      {
        type: "cards",
        heading: "Suitable Cargo",
        columns: 3,
        items: [
          { title: "Machinery and equipment", body: "Transformers, turbines, compressors and process equipment from European and Turkish OEMs.", icon: "crane" },
          { title: "Full and part loads", body: "TIR trucking for time-sensitive spares, tools and project materials.", icon: "truck" },
          { title: "Break bulk and containers", body: "Ocean legs to Black Sea or Turkish ports with onward rail and Caspian connections.", icon: "ship" },
        ],
      },
      {
        type: "list",
        heading: "Documentation",
        items: [
          "CMR and TIR carnets for road; bills of lading for ocean legs; SMGS for rail east of the Black Sea.",
          "EU export declarations; transit through Türkiye, Georgia and Azerbaijan; EAEU import at Kazakhstan.",
          "Oversize permits and escorts in each country for OOG loads.",
        ],
      },
      {
        type: "table",
        heading: "Advantages and Constraints",
        caption: "Europe & Türkiye advantages and constraints",
        columns: ["Advantages", "Constraints"],
        rows: [
          ["Several viable paths — road, ocean and rail — so a disruption on one can be routed around.", "The Caspian crossing is shared with the Middle Corridor and sets the schedule."],
          ["Door-to-door TIR trucking for urgent equipment.", "Long distances and multiple borders; driver hours and queue times matter."],
          ["Established Black Sea and Turkish port infrastructure.", "Ocean-to-rail transshipment in Georgia adds a hand-over to manage."],
        ],
      },
    ],
    related: [
      { label: "Road Freight", href: "/services/road-freight", kind: "service" },
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "Power & Utilities", href: "/industries/power-utilities", kind: "industry" },
    ],
  },
];

export function findCorridor(slug: string): CorridorPage | undefined {
  return corridors.find((c) => c.slug === slug);
}

/** Deck 4 "Strategic Corridors" — six home-page tiles, in the deck's order. */
export const homeCorridorTiles = corridors.map((c) => ({
  title: c.title,
  body:
    c.slug === "china-land-bridge"
      ? "Khorgos / Altynkol and Dostyk / Alashankou gateways into Kazakhstan, Uzbekistan and beyond."
      : c.slug === "middle-corridor"
        ? "China – Kazakhstan – Caspian – Azerbaijan – Georgia – Türkiye – Europe."
        : c.slug === "instc"
          ? "India and the Gulf to Central Asia and Russia via Iran and the Caspian."
          : c.slug === "caspian-sea"
            ? "Aktau, Kuryk, Baku/Alat and Turkmenbashi — ro-ro, ferry and heavy-lift vessels."
            : c.slug === "south-asia-khunjerab"
              ? "Road link via the Khunjerab Pass to Pakistan ports and project sites."
              : "Road, rail and ocean connections for equipment from European manufacturers.",
  href: c.path,
  icon: c.icon,
}));
