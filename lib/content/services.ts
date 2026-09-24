// ---------------------------------------------------------------------------
// Services — landing page and ten service pages.
// Source: Website Content — Final Copy Deck v2.0, section 5B.
//
// Every service page follows the deck's template: Hero → Introduction →
// Detailed content → Equipment/features grid → Why Navigator → Case study
// spotlight → FAQ → Closing CTA strip. The template adds "Why Navigator", the
// case-study spotlight and the closing strip; the blocks below are the
// page-specific copy in the deck's order.
// ---------------------------------------------------------------------------

import type { CardItem, ServicePage } from "./types";

export const servicesLanding = {
  meta: {
    title: "Freight & Project Logistics Services | Navigator Sea Land Limited",
    description:
      "Project logistics, heavy haul, bulk liquid, multimodal, rail, road, ocean & Caspian, air, customs and warehousing services across Central Asia — one accountable team.",
    keywords: ["project logistics Kazakhstan", "freight forwarding services Central Asia", "heavy haul", "bulk liquid"],
  },
  hero: {
    title: "Integrated Logistics for Complex Cargo",
    lead: "From a single pallet of critical spares to a 300-tonne reactor, Navigator Sea Land Limited provides the full spectrum of freight and project logistics services — planned by specialists and delivered through one accountable team.",
    ctas: [
      { label: "Request a Quote", href: "/request-a-quote", variant: "gold" as const },
      { label: "Speak to a Project Engineer", href: "/contact", variant: "onDark" as const },
    ],
  },
};

/** Deck 4 "What We Deliver" — six home-page capability cards. */
export const homeCapabilities: CardItem[] = [
  {
    title: "Project Logistics & Heavy Lift",
    body: "End-to-end management of industrial project cargo: route surveys, engineering, lifting, transport and site delivery.",
    icon: "crane",
    href: "/services/project-logistics-heavy-lift",
  },
  {
    title: "Heavy Haul & Over-Dimensional Trucking",
    body: "Low-beds, hydraulic modular trailers and SPMTs with permits, escorts and route engineering across CIS roads.",
    icon: "truck-heavy",
    href: "/services/heavy-haul-over-dimensional-trucking",
  },
  {
    title: "Bulk Liquid Transportation",
    body: "ISO tanks, flexitanks, road tankers and rail tank wagons for chemicals, oils and food-grade liquids.",
    icon: "tank",
    href: "/services/bulk-liquid-transportation",
  },
  {
    title: "Multimodal Corridor Solutions",
    body: "Rail, road, Caspian ferry and ocean combined into one contract across China, Middle Corridor and INSTC routes.",
    icon: "route",
    href: "/services/multimodal-solutions",
  },
  {
    title: "Freight Forwarding — All Modes",
    body: "FCL, LCL, break bulk, rail wagons, FTL/LTL trucking and air freight, door to door.",
    icon: "globe",
    href: "/services",
  },
  {
    title: "Customs & Trade Compliance",
    body: "EAEU customs, transit regimes, HS/ETSNG classification, duty exemptions and dangerous-goods documentation.",
    icon: "document",
    href: "/services/customs-trade-compliance",
  },
];

export const services: ServicePage[] = [
  // --- 5.1 -------------------------------------------------------------------
  {
    slug: "project-logistics-heavy-lift",
    path: "/services/project-logistics-heavy-lift",
    title: "Project Logistics & Heavy Lift",
    summary: "End-to-end project cargo logistics for EPC, energy and mining projects.",
    icon: "crane",
    quoteService: "PROJECT",
    meta: {
      title: "Project Logistics & Heavy Lift in Central Asia | Navigator Sea Land Limited",
      description:
        "End-to-end project cargo logistics for EPC, energy and mining projects: route surveys, engineering, heavy lift, OOG transport and site delivery across Central Asia.",
      keywords: [
        "project logistics Kazakhstan",
        "heavy lift transport Central Asia",
        "project cargo forwarder",
        "EPC logistics Uzbekistan",
      ],
    },
    hero: {
      title: "Project Logistics Engineered for Success",
      lead: "From FEED-stage logistics studies to the final lift on site — one partner for your entire project supply chain.",
      ctas: [
        { label: "Discuss Your Project", href: "/request-a-quote?service=PROJECT", variant: "gold" },
        { label: "Download Capability Statement", href: "/insights#downloads", variant: "onDark" },
      ],
      image: {
        instruction: "Transformer or reactor on hydraulic modular trailer; crane lift at site.",
        alt: "Reactor on a hydraulic modular trailer being positioned for a crane lift at a project site",
      },
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Large industrial projects succeed or fail on logistics. A late module, a route that cannot carry the load, or cargo held at a border can delay commissioning by months. Navigator Sea Land Limited manages project logistics as an engineering discipline — integrating procurement schedules, manufacturing locations, transport modes, permits and site constraints into one controlled plan.",
          "We support EPC contractors, owners and OEMs throughout the project lifecycle: early-phase bulk construction materials, main-equipment and heavy-lift deliveries during installation, and demobilisation of plant and cranes at close-out.",
        ],
      },
      {
        type: "cards",
        heading: "Our Project Logistics Scope",
        headingLevel: 3,
        items: [
          {
            title: "Pre-Project Studies",
            body: "Logistics feasibility studies, route surveys, port and border assessments, and logistics chapters for EPC tenders.",
            icon: "clipboard",
          },
          {
            title: "Engineering",
            body: "Transport method statements, lifting plans, axle-load, ground-bearing and lashing calculations, stowage plans.",
            icon: "gauge",
          },
          {
            title: "Heavy-Lift Coordination",
            body: "Crane selection, jacking & skidding, SPMT roll-on/roll-off and load-out supervision.",
            icon: "crane",
          },
          {
            title: "Multimodal Execution",
            body: "Ocean, Caspian, rail and road legs integrated — including charter vessels and dedicated block trains.",
            icon: "route",
          },
          {
            title: "Permits & Customs",
            body: "Oversize permits, escorts, transit permits, temporary import and duty-exemption support for investment projects.",
            icon: "document",
          },
          {
            title: "Site Delivery & Demob",
            body: "Set-down on foundations or laydown areas, site storage, and demobilisation of plant and equipment.",
            icon: "pin",
          },
        ],
      },
      {
        type: "list",
        heading: "Project Control & Reporting",
        headingLevel: 3,
        items: [
          "A dedicated project manager and a single project-specific communication plan.",
          "Integrated master schedule aligned to your procurement and construction milestones.",
          "Risk register and contingency routes for every critical shipment.",
          "Daily/weekly reports with photos, GPS positions, milestone status and document tracking.",
          "Kick-off meeting, readiness reviews before each critical move, and a close-out lessons-learned report.",
        ],
      },
      {
        type: "steps",
        eyebrow: "How we deliver",
        heading: "Engineered from First Enquiry to Final Set-Down",
        items: [], // filled from processSteps by the template
      },
      {
        type: "tags",
        heading: "Typical Project Cargo",
        headingLevel: 3,
        items: [
          "Transformers and reactors",
          "Pressure vessels and columns",
          "Compressor and turbine units",
          "Wind turbine towers, nacelles and blades",
          "BESS and power containers",
          "Refinery and process modules",
          "Crane components and counterweights",
          "Mining crushers, mills and haul trucks",
          "Steel structures and pipe",
        ],
      },
      {
        type: "faq",
        heading: "Frequently Asked Questions",
        items: [
          {
            question: "At what stage should we involve Navigator in our project?",
            answer:
              "Ideally at tender or FEED stage. Early involvement lets us confirm route feasibility, maximum transportable dimensions and realistic transit times, which directly influences equipment design, modularisation and budget.",
          },
          {
            question: "Can you handle the complete door-to-site chain, including ocean freight and customs?",
            answer:
              "Yes. We manage every leg — from manufacturer's works in Europe, China, India or Korea through ports, the Caspian or land borders to your foundation — under one contract and one point of contact.",
          },
          {
            question: "Do you provide method statements and engineering calculations?",
            answer:
              "Yes. For every OOG or heavy-lift move we prepare transport method statements, risk assessments and relevant calculations for review by the client and authorities.",
          },
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Multimodal Solutions", href: "/services/multimodal-solutions", kind: "service" },
      { label: "EPC & Infrastructure", href: "/industries/epc-infrastructure", kind: "industry" },
      { label: "Middle Corridor (TITR)", href: "/corridors/middle-corridor", kind: "corridor" },
    ],
  },

  // --- 5.2 -------------------------------------------------------------------
  {
    slug: "heavy-haul-over-dimensional-trucking",
    path: "/services/heavy-haul-over-dimensional-trucking",
    title: "Heavy Haul & Over-Dimensional Trucking",
    summary: "Low-beds, modular trailers and SPMT with permits, escorts and route engineering.",
    icon: "truck-heavy",
    quoteService: "HEAVY_HAUL",
    isNew: true,
    meta: {
      title: "Heavy Haul & Over-Dimensional Trucking Kazakhstan | Navigator Sea Land Limited",
      description:
        "Heavy haul and OOG trucking across Kazakhstan and Central Asia: low-beds, modular trailers, SPMT, permits, escorts and route engineering. Get an expert quote.",
      keywords: [
        "heavy haul Kazakhstan",
        "over dimensional transport Central Asia",
        "OOG trucking",
        "oversized cargo transport Uzbekistan",
        "negabarit transport",
        "SPMT Kazakhstan",
        "modular trailer transport",
      ],
    },
    hero: {
      title: "Heavy Haul & Over-Dimensional Trucking",
      lead: "Engineered road transport for cargo too heavy, wide, long or tall for ordinary trucks — permitted, escorted and delivered safely across Central Asia and beyond.",
      ctas: [
        { label: "Request a Heavy Haul Quote", href: "/request-a-quote?service=HEAVY_HAUL", variant: "gold" },
        {
          label: "Send Us Your Drawings",
          href: "mailto:quotes@navigatorsealand.com?subject=Heavy%20haul%20enquiry%20%E2%80%94%20drawings%20attached",
          variant: "onDark",
        },
      ],
      image: {
        instruction: "Multi-axle hydraulic modular trailer carrying a transformer with police escort on a Kazakh highway.",
        alt: "Multi-axle hydraulic modular trailer carrying a power transformer with police escort on a Kazakh highway",
      },
    },
    blocks: [
      {
        type: "prose",
        id: "introduction",
        heading: "Specialists in Oversized and Heavy Road Transport",
        paragraphs: [
          "When cargo exceeds the legal limits for standard road transport, every kilometre must be planned. Navigator Sea Land Limited delivers end-to-end heavy haul and over-dimensional (OOG / \"negabarit\") trucking for industrial machinery, energy equipment, mining assets and construction plant — from a single oversized crate to multi-hundred-tonne components.",
          "Our team combines transport engineering with years of first-hand execution on Central Asian roads: long steppe distances, bridges with limited ratings, low power lines, seasonal load restrictions and multiple border regimes. We select the right equipment, secure the permits, engineer the route and supervise the move — so your cargo arrives on time, intact and in full compliance.",
        ],
      },
      {
        type: "prose",
        id: "explainer",
        heading: "What Is Heavy Haul and Over-Dimensional Transport?",
        paragraphs: [
          "Heavy haul refers to loads whose gross weight or axle loads exceed the standard limits permitted on public roads. Over-dimensional (OOG) transport covers cargo that exceeds the legal width, height or length of a standard vehicle and load. Many project shipments are both.",
          "These movements require special permits from road authorities in every country crossed, engineered route studies, specialised trailers that spread weight across many axles, and — depending on size — escort vehicles, police accompaniment and temporary removal of road obstacles. In Central Asia, where routes cross several jurisdictions and infrastructure varies widely, local knowledge is decisive.",
        ],
      },
      {
        type: "cards",
        id: "cargo",
        heading: "Cargo We Move",
        items: [
          {
            title: "Energy & Power",
            body: "Power and distribution transformers, reactors, generators, gas and steam turbines, turbine rotors, switchgear houses.",
            icon: "bolt",
          },
          {
            title: "Oil, Gas & Petrochemical",
            body: "Pressure vessels, columns, heat exchangers, compressor skids, wellhead and drilling equipment, process modules.",
            icon: "flame",
          },
          {
            title: "Renewables & BESS",
            body: "Wind turbine blades, towers and nacelles; BESS and inverter containers; solar substation equipment.",
            icon: "wind",
          },
          {
            title: "Mining & Metals",
            body: "Crushers, SAG/ball mill shells, haul trucks, excavators, conveyor structures, kilns.",
            icon: "pickaxe",
          },
          {
            title: "Construction & Cranes",
            body: "Crawler and mobile crane components, counterweights, boom sections, tunnel boring equipment, bridge girders.",
            icon: "crane",
          },
          {
            title: "Industrial Machinery",
            body: "Presses, rolling-mill stands, paper machine rolls, boilers, pre-fabricated steel structures.",
            icon: "layers",
          },
        ],
      },
      {
        type: "table",
        id: "equipment",
        heading: "Our Heavy Haul Equipment Range",
        intro:
          "Through our owned-partner and contracted fleet network across Kazakhstan, Uzbekistan and neighbouring countries, we deploy the configuration that best matches your cargo, route and site:",
        caption: "Heavy haul equipment and what each is best used for",
        columns: ["Equipment", "Best used for"],
        rows: [
          ["Low-bed / low-loader semi-trailers (2–6 axles)", "Machinery, tracked equipment and tall cargo needing reduced deck height"],
          ["Step-deck and drop-deck trailers", "Tall cargo on routes with height restrictions"],
          ["Extendable flatbeds", "Long items: pipes, beams, columns, tower sections"],
          [
            "Hydraulic modular trailers (conventional axle lines)",
            "Very heavy cargo; weight spread over many axle lines with hydraulic levelling and steering",
          ],
          ["Self-Propelled Modular Transporters (SPMT)", "Ultra-heavy modules, precise manoeuvring, roll-on/roll-off at ports and sites"],
          ["Girder-bridge / vessel-bridge trailers", "Transformers and vessels where overall height must be minimised"],
          ["Wind blade trailers and blade lifters", "Rotor blades of 60–90 m+ on winding or hilly routes"],
          ["Heavy prime movers (6x4, 8x4) in pull or push-pull", "Traction for high gross combination weights and gradients"],
          ["Escort and pilot vehicles", "Warning, traffic control and route clearing"],
          ["Jacking & skidding systems, mobile cranes", "Loading, off-loading and set-down where cranes cannot reach"],
        ],
      },
      {
        type: "confirm",
        title: "Fleet wording",
        body: "If Navigator operates through partner fleets rather than owned equipment, keep the phrase \"owned-partner and contracted fleet network\" (as published). Add specific axle-line counts or SPMT capacity only when verified.",
      },
      {
        type: "list",
        id: "engineering",
        heading: "Equipment Selection & Load Engineering",
        intro: "The safest and most economical move starts with the right configuration. For every heavy haul project our engineers evaluate:",
        items: [
          "Cargo dimensions, weight, centre of gravity and designated lifting and lashing points.",
          "Gross combination weight and individual axle loads versus road and bridge limits.",
          "Trailer deck height, overall transport height and width against route clearances.",
          "Turning radii at junctions, roundabouts, rail crossings and site entrances.",
          "Bridge capacities and ground-bearing pressure at loading, unloading and parking areas.",
          "Gradients, road surface, seasonal conditions and available traction.",
          "Lashing and securing calculations and dunnage / cribbing design.",
        ],
        outro:
          "The outcome is a documented transport method statement — equipment configuration, route, schedule, lashing plan, escort plan and risk controls — shared with you and the authorities before any cargo moves.",
      },
      {
        type: "cards",
        id: "permits",
        heading: "Permits, Regulations and Route Management",
        intro:
          "Oversized and overweight road moves in Kazakhstan, Uzbekistan and other CIS countries require special permits and are subject to strict movement conditions. Navigator manages the entire compliance process:",
        items: [
          {
            title: "Route Surveys",
            body: "Physical survey with measurements of bridges, overpasses, power and telecom lines, junctions and pinch points; photo and video report.",
            icon: "search",
          },
          {
            title: "Special Permits",
            body: "Applications for oversize/overweight permits in each country crossed, including route approvals and bridge assessments.",
            icon: "document",
          },
          {
            title: "Escorts & Police",
            body: "Pilot cars, traffic management and police escort arranged as required by permit conditions.",
            icon: "shield",
          },
          {
            title: "Obstacle Management",
            body: "Coordination with utilities and road owners for lifting power lines, removing signs, barriers or street furniture.",
            icon: "bolt",
          },
          {
            title: "Movement Windows",
            body: "Compliance with time-of-day, weekend, weather and seasonal (spring thaw) restrictions.",
            icon: "clock",
          },
          {
            title: "Border Crossings",
            body: "Pre-arranged customs and transit procedures at Kazakhstan, Uzbekistan, Kyrgyzstan, China and Caspian borders.",
            icon: "map",
          },
        ],
      },
      {
        type: "prose",
        id: "multimodal",
        heading: "Beyond the Road: Integrated OOG Solutions",
        paragraphs: [
          "Heavy haul is rarely a single-leg operation. We integrate road transport with Caspian heavy-lift and ro-ro vessels, CIS rail flat wagons and well wagons, and ocean break-bulk shipping — for example: European manufacturer → Poti or Baku → Caspian → Aktau → Atyrau / Tengiz, or Chinese factory → Khorgos → Kazakhstan / Uzbekistan project site. One plan, one team, one contract.",
        ],
      },
      {
        type: "list",
        id: "why-navigator",
        heading: "Why Clients Choose Navigator for Heavy Haul",
        columns: 2,
        items: [
          "Proven OOG route pioneers — our team opened a multi-country route for oversized oilfield equipment from Tengiz to Baluchistan via China.",
          "Engineering-led planning — route surveys, method statements and calculations as standard, not an optional extra.",
          "Single-point accountability — one project manager from factory gate to foundation.",
          "Vetted carrier network across Kazakhstan, Uzbekistan, Kyrgyzstan, Azerbaijan, Georgia and China.",
          "Permit and authority expertise in Russian and Kazakh, handled by our own staff.",
          "HSSE discipline meeting the requirements of international oil & gas and EPC clients.",
          "Real-time communication — GPS tracking, daily convoy reports and photo updates.",
        ],
      },
      {
        type: "closing",
        heading: "Your Heaviest Cargo Deserves the Most Careful Plan",
        body: "Whether you are moving a single transformer to a substation or a series of modules to a refinery, send us your drawings, weights and delivery location. Our heavy haul engineers will confirm feasibility, propose equipment and route options, and provide a transparent quotation.",
        ctas: [
          { label: "Request a Heavy Haul Quote", href: "/request-a-quote?service=HEAVY_HAUL", variant: "gold" },
          { label: "Call +7 775 662 4455", href: "tel:+77756624455", variant: "onDark" },
          { label: "WhatsApp", href: "https://wa.me/77756624455", variant: "onDark" },
        ],
      },
      {
        type: "faq",
        id: "faq",
        heading: "Heavy Haul FAQ",
        items: [
          {
            question: "What counts as over-dimensional or heavy haul cargo?",
            answer:
              "Any load that exceeds the legal width, height, length, axle-load or gross-weight limits for standard road transport in the country concerned. Such cargo needs a special permit and usually specialised trailers; larger loads also need escorts and route engineering.",
          },
          {
            question: "How long does it take to obtain oversize permits in Kazakhstan and Uzbekistan?",
            answer:
              "It depends on dimensions, weight and the number of regions and bridges on the route. Standard oversize permits can be quick, while very heavy loads that require bridge assessments or utility coordination take longer. We confirm realistic lead times during the route survey so they are built into your schedule.",
          },
          {
            question: "What information do you need to quote?",
            answer:
              "Cargo drawings or dimensions (L × W × H), weight and centre of gravity, number of pieces, pick-up and delivery addresses, loading/unloading method, ready date and required delivery date. Photos of the cargo and site access help greatly.",
          },
          {
            question: "Can you move cargo across borders in Central Asia and to China or the Caspian?",
            answer:
              "Yes. We regularly plan cross-border OOG moves between Kazakhstan, Uzbekistan, Kyrgyzstan and China, and combine road with Caspian shipping to Azerbaijan, Georgia and Türkiye.",
          },
          {
            question: "Do you provide SPMT and hydraulic modular trailers?",
            answer:
              "Yes, through our specialised partner network. We select the configuration based on engineering calculations for your cargo, route and site conditions.",
          },
          {
            question: "How is cargo insured during a heavy haul move?",
            answer:
              "Carrier liability is limited by law and contract, so we strongly recommend project cargo or all-risk insurance. We can arrange suitable cover through our insurance partners on request.",
          },
        ],
      },
    ],
    related: [
      { label: "Project Logistics & Heavy Lift", href: "/services/project-logistics-heavy-lift", kind: "service" },
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "Power & Utilities", href: "/industries/power-utilities", kind: "industry" },
      { label: "Caspian Sea", href: "/corridors/caspian-sea", kind: "corridor" },
    ],
  },

  // --- 5.3 -------------------------------------------------------------------
  {
    slug: "bulk-liquid-transportation",
    path: "/services/bulk-liquid-transportation",
    title: "Bulk Liquid Transportation",
    summary: "ISO tanks, flexitanks, road tankers and rail tank wagons for chemicals, oils and food-grade liquids.",
    icon: "tank",
    quoteService: "BULK_LIQUID",
    isNew: true,
    meta: {
      title: "Bulk Liquid Transport: ISO Tank, Flexitank & Tanker | Navigator Sea Land Limited",
      description:
        "Bulk liquid logistics across Central Asia: ISO tank containers, flexitanks, ADR road tankers and rail tank wagons for chemicals, oils and food-grade liquids.",
      keywords: [
        "ISO tank Kazakhstan",
        "bulk liquid transport Central Asia",
        "flexitank Kazakhstan",
        "chemical tanker transport",
        "rail tank wagon",
        "ADR tanker Uzbekistan",
        "edible oil export Kazakhstan",
      ],
    },
    hero: {
      title: "Bulk Liquid Transportation",
      lead: "Safe, compliant and cost-efficient movement of chemicals, oils and food-grade liquids by ISO tank, flexitank, road tanker and rail tank wagon — across Central Asia and its global corridors.",
      ctas: [
        { label: "Request a Bulk Liquid Quote", href: "/request-a-quote?service=BULK_LIQUID", variant: "gold" },
        { label: "Talk to a Liquid Logistics Specialist", href: "/contact", variant: "onDark" },
      ],
      image: {
        instruction: "ISO tank containers on rail flats at a border station; stainless road tanker at a loading bay.",
        alt: "ISO tank containers on rail flat wagons at a border station",
      },
    },
    blocks: [
      {
        type: "prose",
        id: "introduction",
        heading: "Integrated Bulk Liquid Logistics — From Tank to Tank",
        paragraphs: [
          "Moving liquids in bulk removes the cost and waste of drums and IBCs, but it demands the right tank, correct cleaning history, strict dangerous-goods compliance and careful temperature control. Navigator Sea Land Limited designs and manages bulk liquid supply chains for producers, traders and industrial users moving liquids into, out of and across Central Asia.",
          "We combine all four bulk liquid solutions — ISO tank containers, flexitanks, road tankers and rail tank wagons — and switch between them along the route when it saves time or cost, for example rail tank wagon to road tanker transloading for last-mile delivery to a site without a rail siding.",
        ],
      },
      {
        type: "cards",
        id: "solutions",
        heading: "Our Bulk Liquid Solutions",
        columns: 2,
        items: [
          {
            title: "ISO Tank Containers",
            body: "Intermodal 20-ft stainless-steel tanks (typically ~21,000–26,000 litres) moving seamlessly by sea, rail and road. Suitable for hazardous and non-hazardous liquids, with heated, insulated and lined options. Ideal for China – Central Asia – Europe corridors.",
            icon: "tank",
          },
          {
            title: "Flexitanks",
            body: "Single-use bladders (typically 16,000–24,000 litres) installed in standard 20-ft containers. The most economical option for non-hazardous liquids such as edible oils, glycerine, latex and molasses.",
            icon: "box",
          },
          {
            title: "Road Tankers",
            body: "ADR-certified stainless-steel, aluminium and lined tankers — single or multi-compartment, insulated or heated — for regional distribution and door-to-door delivery.",
            icon: "truck",
          },
          {
            title: "Rail Tank Wagons",
            body: "CIS-gauge tank wagons (typically around 60–75 m³) for high-volume, long-distance flows of oils, chemicals and petroleum products on KTZ and neighbouring networks.",
            icon: "train",
          },
        ],
      },
      {
        type: "confirm",
        title: "Capacities",
        body: "Capacities shown are industry-typical ranges. Adjust if Navigator's partner equipment differs.",
      },
      {
        type: "table",
        id: "products",
        heading: "Liquids We Transport",
        caption: "Liquid cargo categories and examples",
        columns: ["Category", "Examples"],
        rows: [
          ["Petroleum & lubricants", "Base oils, lubricants, transformer oil, additives, bitumen (heated)"],
          ["Industrial chemicals (hazardous)", "Caustic soda, sulphuric and other acids, methanol, solvents, alcohols, resins"],
          ["Oilfield liquids", "Drilling fluid components, completion brines, corrosion inhibitors, production chemicals"],
          ["Mining reagents", "Flotation reagents, acids and process chemicals for mineral processing"],
          ["Food-grade liquids", "Sunflower and rapeseed oil, glycerine, liquid sugar, fruit concentrates"],
          ["Agricultural liquids", "Liquid fertilisers, UAN solutions, molasses"],
          ["Liquefied gases", "LPG and other gases in pressurised (T50) ISO tanks"],
        ],
      },
      {
        type: "list",
        id: "technical",
        heading: "Tank Types & Technical Options",
        items: [
          "Tank construction: stainless steel for most chemicals and food-grade liquids; aluminium for payload-sensitive non-hazardous products; rubber- or polymer-lined tanks for highly corrosive cargo.",
          "ISO tank portable-tank codes: T11 for many general chemicals, T14 for corrosives, T50 for liquefied gases and specialised tanks for cryogenic cargo — matched to the product's dangerous-goods requirements.",
          "Temperature control: insulated tanks, steam-coil or electric heating for viscous cargo such as bitumen, waxes, palm oil and molasses; temperature logging on request.",
          "Loading & discharge: top or bottom loading; gravity, pump or compressed-air discharge depending on product viscosity and site facilities.",
          "Dedicated food-grade equipment with documented previous-cargo history and cleaning certificates.",
        ],
      },
      {
        type: "table",
        id: "compliance",
        heading: "Compliance and Safety Standards",
        intro:
          "Bulk liquids — especially dangerous goods — are among the most regulated cargo in logistics. Our operations are planned in line with the applicable international and regional rules:",
        caption: "Regulations and documents by transport mode",
        columns: ["Mode", "Regulations & documents"],
        rows: [
          ["Road", "ADR (dangerous goods by road), ADR-certified vehicles and drivers, CMR consignment note, TIR where applicable"],
          ["Rail (CIS)", "SMGS consignment note and SMGS Annex 2 dangerous-goods rules; RID for European rail legs"],
          ["Sea / Caspian", "IMDG Code, dangerous-goods declarations, container packing certificates"],
          [
            "All modes",
            "Safety Data Sheets (SDS), UN number and packing group, tank test and inspection certificates (periodic 2.5 / 5-year), cleaning certificates, EAEU technical regulations and import permits where required",
          ],
        ],
      },
      {
        type: "list",
        intro: "Safety measures on every bulk liquid move:",
        items: [
          "Product–tank compatibility checks before booking; previous-cargo and cleaning verification.",
          "Pre-loading tank inspections, valve and seal checks, and correct placarding.",
          "GPS monitoring of tankers and ISO tanks on critical routes.",
          "Emergency response information carried with every dangerous-goods consignment.",
          "Spill-prevention procedures at loading, transloading and discharge points.",
        ],
      },
      {
        type: "cards",
        id: "value-added",
        heading: "Value-Added Bulk Liquid Services",
        items: [
          {
            title: "Tank Sourcing & Leasing",
            body: "Access to ISO tank operators and lessors for one-off or dedicated programmes.",
            icon: "tank",
          },
          {
            title: "Transloading",
            body: "Rail tank wagon ↔ road tanker ↔ ISO tank ↔ IBC/drum transfer at approved facilities.",
            icon: "refresh",
          },
          {
            title: "Heating & Cleaning",
            body: "Coordination of steam heating, tank cleaning and cleaning certificates.",
            icon: "thermometer",
          },
          {
            title: "Empty Repositioning",
            body: "Planning return or onward loads to reduce empty-tank costs in landlocked markets.",
            icon: "route",
          },
          {
            title: "Customs & Permits",
            body: "EAEU classification, import permits and dangerous-goods approvals.",
            icon: "document",
          },
          {
            title: "Programme Management",
            body: "Recurring flows with forecasting, fleet planning and KPI reporting.",
            icon: "clipboard",
          },
        ],
      },
      {
        type: "list",
        id: "corridors",
        heading: "Bulk Liquid Corridors We Serve",
        items: [
          "China ↔ Kazakhstan / Uzbekistan / Kyrgyzstan by ISO tank via Khorgos and Dostyk.",
          "Kazakhstan edible-oil and chemical exports to China, Afghanistan, Iran and the Middle East.",
          "Europe and Türkiye ↔ Central Asia via the Middle Corridor and Caspian.",
          "India and the Gulf ↔ Central Asia via INSTC and Iranian ports.",
          "Domestic CIS rail tank-wagon flows with road-tanker last-mile delivery.",
        ],
      },
      {
        type: "closing",
        heading: "Let's Move Your Liquids — Safely and Efficiently",
        body: "Tell us the product, SDS, volume, frequency and route. Our specialists will recommend the optimal tank solution — ISO tank, flexitank, road tanker or rail wagon — and provide a transparent quotation.",
        ctas: [
          { label: "Request a Bulk Liquid Quote", href: "/request-a-quote?service=BULK_LIQUID", variant: "gold" },
          { label: "Call +7 775 662 4455", href: "tel:+77756624455", variant: "onDark" },
        ],
      },
      {
        type: "faq",
        id: "faq",
        heading: "Bulk Liquid FAQ",
        items: [
          {
            question: "Which is better for my product: ISO tank, flexitank, road tanker or rail wagon?",
            answer:
              "Flexitanks are usually cheapest for non-hazardous liquids on long intermodal routes. ISO tanks are the standard for hazardous chemicals and repeat intermodal flows. Road tankers suit regional and door-to-door delivery. Rail tank wagons are most economical for large volumes on CIS rail. We recommend the best option after reviewing your product, volume and route.",
          },
          {
            question: "Can hazardous liquids be carried in flexitanks?",
            answer:
              "No. Flexitanks are for non-hazardous liquids only. Dangerous goods must move in approved ISO tanks, road tankers or rail tank wagons.",
          },
          {
            question: "What documents do you need from the shipper?",
            answer:
              "The Safety Data Sheet (SDS), UN number and class if hazardous, product specification, volume and temperature requirements, and any import permits or certificates required at destination.",
          },
          {
            question: "Can you handle food-grade liquids like sunflower oil?",
            answer:
              "Yes. We use dedicated food-grade tanks or new flexitanks, with previous-cargo history and cleaning certificates to protect product quality.",
          },
          {
            question: "Do you manage heated cargo such as bitumen or molasses?",
            answer:
              "Yes. We arrange insulated and heated tanks and coordinate steam heating at origin or destination to ensure safe discharge.",
          },
        ],
      },
    ],
    related: [
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "Petrochemicals & Chemicals", href: "/industries/petrochemicals-chemicals", kind: "industry" },
      { label: "China Land Bridge", href: "/corridors/china-land-bridge", kind: "corridor" },
    ],
  },

  // --- 5.4 -------------------------------------------------------------------
  {
    slug: "multimodal-solutions",
    path: "/services/multimodal-solutions",
    title: "Multimodal Solutions",
    summary: "Rail, road, Caspian and ocean combined into one managed shipment.",
    icon: "route",
    quoteService: "NOT_SURE",
    meta: {
      title: "Multimodal Transport Central Asia | Navigator Sea Land Limited",
      description:
        "Rail, road, Caspian and ocean combined into one managed shipment across China Land Bridge, Middle Corridor and INSTC routes. One contract, one invoice.",
      keywords: ["multimodal transport Kazakhstan", "Middle Corridor logistics", "China Land Bridge freight", "INSTC shipping"],
    },
    hero: {
      title: "One Shipment. Every Mode. One Partner.",
      lead: "Multimodal solutions designed for landlocked Central Asia — where no single mode covers the full journey.",
      ctas: [
        { label: "Plan My Route", href: "/corridors", variant: "gold" },
        { label: "Request a Quote", href: "/request-a-quote", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Central Asia is the world's largest landlocked region. Cargo typically changes mode two or three times — ocean to rail, rail to Caspian vessel, ferry to truck — and crosses several customs regimes. Each hand-over is a risk to schedule, cost and cargo condition. Navigator Sea Land Limited removes that risk by designing, contracting and controlling every leg as one integrated shipment.",
        ],
      },
      {
        type: "table",
        heading: "Example Routings",
        caption: "Example multimodal routes and their typical routing",
        columns: ["Example route", "Typical routing"],
        rows: [
          ["China → Kazakhstan / Uzbekistan", "Factory → rail (Khorgos / Dostyk) → Almaty / Tashkent → road to site"],
          [
            "China → Europe (Middle Corridor)",
            "Rail through Kazakhstan → Aktau / Kuryk → Caspian → Baku / Alat → rail or road → Poti / Batumi or Türkiye → Europe",
          ],
          ["Europe → Western Kazakhstan", "Road or ocean to Poti / Baku → Caspian → Aktau → road to Atyrau / Tengiz"],
          [
            "India / Gulf → Central Asia (INSTC)",
            "Ocean to Bandar Abbas → rail or road through Iran → Turkmenistan / Kazakhstan / Uzbekistan",
          ],
          ["Kazakhstan → Pakistan", "Road via China and Khunjerab Pass → Sost → Karachi or project site"],
          ["Urgent spares", "Air to Almaty, Dubai or Istanbul → customs → road to remote site"],
        ],
      },
      {
        type: "list",
        heading: "What You Get",
        items: [
          "One contract, one invoice, one tracking report for the entire journey.",
          "Through documentation — FIATA multimodal documents where applicable, with SMGS, CMR and B/L legs managed by us.",
          "Route resilience — alternative corridors ready if a border, port or vessel schedule is disrupted.",
          "Cost optimisation — mode mix balanced against transit time, risk and total landed cost.",
        ],
      },
    ],
    related: [
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "Ocean & Caspian Freight", href: "/services/ocean-caspian-freight", kind: "service" },
      { label: "Renewable Energy & BESS", href: "/industries/renewable-energy-bess", kind: "industry" },
      { label: "Middle Corridor (TITR)", href: "/corridors/middle-corridor", kind: "corridor" },
    ],
  },

  // --- 5.5 -------------------------------------------------------------------
  {
    slug: "rail-freight",
    path: "/services/rail-freight",
    title: "Rail Freight",
    summary: "Containers, wagons, tank wagons and OOG flat wagons across China, CIS and Europe.",
    icon: "train",
    quoteService: "RAIL",
    meta: {
      title: "Rail Freight China–Kazakhstan–Central Asia | Navigator Sea Land Limited",
      description:
        "Container and wagon rail freight between China, Kazakhstan, Central Asia and Europe. SMGS documentation, ETSNG coding, OOG flat wagons and transit permits.",
      keywords: ["rail freight China Kazakhstan", "SMGS rail", "Khorgos rail", "block train Central Asia", "rail freight Uzbekistan"],
    },
    hero: {
      title: "Rail Freight Across the Eurasian Land Bridge",
      lead: "Containers, conventional wagons, tank wagons and OOG flat wagons — China, CIS and Europe.",
      ctas: [{ label: "Request a Rail Quote", href: "/request-a-quote?service=RAIL", variant: "gold" }],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Rail is the backbone of Central Asian freight — cost-effective for heavy and high-volume cargo and faster than sea for China–Europe flows. Navigator arranges rail transport across the 1,520 mm CIS network and its connections to China and Europe, managing gauge-change borders, wagon supply and the specialised documentation CIS rail requires.",
        ],
      },
      {
        type: "cards",
        heading: "Rail Services",
        items: [
          {
            title: "Container Rail",
            body: "20' and 40' FCL and LCL rail services China ↔ Central Asia ↔ Europe, including block trains.",
            icon: "box",
          },
          {
            title: "Wagon Rail",
            body: "Covered wagons, gondolas, platforms and hoppers for bulk, steel, agro and project cargo.",
            icon: "train",
          },
          {
            title: "OOG by Rail",
            body: "Flat and well wagons for oversized cargo, with loading schemes approved by railway authorities.",
            icon: "crane",
          },
          {
            title: "Tank Wagons",
            body: "Rail tank wagons for oils, chemicals and petroleum products.",
            icon: "tank",
          },
          {
            title: "Documentation",
            body: "SMGS consignment notes, ETSNG / GNG coding, transit permits and border formalities.",
            icon: "document",
          },
          {
            title: "Tracking",
            body: "Wagon and container tracking with regular status updates.",
            icon: "search",
          },
        ],
      },
      {
        type: "tags",
        heading: "Key Gateways",
        headingLevel: 3,
        items: ["Khorgos / Altynkol", "Dostyk / Alashankou", "Saryagash", "Bolashak", "Aktau port", "Kuryk port", "Brest / Małaszewicze (Europe)"],
      },
    ],
    related: [
      { label: "Multimodal Solutions", href: "/services/multimodal-solutions", kind: "service" },
      { label: "Bulk Liquid Transportation", href: "/services/bulk-liquid-transportation", kind: "service" },
      { label: "Agro & Commodities", href: "/industries/agro-commodities", kind: "industry" },
      { label: "China Land Bridge", href: "/corridors/china-land-bridge", kind: "corridor" },
    ],
  },

  // --- 5.6 -------------------------------------------------------------------
  {
    slug: "road-freight",
    path: "/services/road-freight",
    title: "Road Freight",
    summary: "FTL, LTL, TIR and cross-border trucking with CMR and ADR compliance.",
    icon: "truck",
    quoteService: "ROAD",
    meta: {
      title: "Road Freight & TIR Trucking Central Asia | Navigator Sea Land Limited",
      description:
        "FTL, LTL, TIR and cross-border trucking across Kazakhstan, Uzbekistan, China, Caucasus, Türkiye and Europe with CMR and ADR compliance.",
      keywords: ["road freight Kazakhstan", "TIR trucking Central Asia", "FTL Uzbekistan", "cross border trucking China Kazakhstan"],
    },
    hero: {
      title: "Road Freight Without Borders",
      lead: "Full truck, groupage, temperature-controlled and dangerous-goods trucking across Central Asia, the Caucasus, China and Europe.",
      ctas: [{ label: "Request a Road Quote", href: "/request-a-quote?service=ROAD", variant: "gold" }],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Road transport gives Central Asian supply chains flexibility — direct door-to-door delivery, fast border transit under TIR, and access to sites far from rail or ports. Navigator manages a vetted network of carriers with modern tractors, GPS tracking and experienced international drivers.",
        ],
      },
      {
        type: "list",
        heading: "Road Services",
        items: [
          "FTL and LTL / groupage — tilt, curtainsider, box and flatbed trucks.",
          "TIR and CMR international transport through Kazakhstan, Uzbekistan, Kyrgyzstan, Russia, the Caucasus, Türkiye and Europe.",
          "Temperature-controlled reefer trucks for pharmaceuticals and perishables.",
          "ADR dangerous goods transport with certified vehicles and drivers.",
          "China cross-border trucking via Khorgos, Nur Zholy and Bakhty; Pakistan via Khunjerab.",
          "Heavy and OOG trucking — see Heavy Haul & Over-Dimensional Trucking.",
        ],
      },
    ],
    related: [
      { label: "Heavy Haul & Over-Dimensional Trucking", href: "/services/heavy-haul-over-dimensional-trucking", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "EPC & Infrastructure", href: "/industries/epc-infrastructure", kind: "industry" },
      { label: "South Asia (Khunjerab)", href: "/corridors/south-asia-khunjerab", kind: "corridor" },
    ],
  },

  // --- 5.7 -------------------------------------------------------------------
  {
    slug: "ocean-caspian-freight",
    path: "/services/ocean-caspian-freight",
    title: "Ocean & Caspian Freight",
    summary: "FCL, LCL, break bulk, heavy-lift and ro-ro shipping worldwide and across the Caspian.",
    icon: "ship",
    quoteService: "OCEAN_CASPIAN",
    meta: {
      title: "Ocean & Caspian Sea Freight | Navigator Sea Land Limited",
      description:
        "FCL, LCL, break bulk, heavy-lift and ro-ro shipping worldwide and across the Caspian Sea via Aktau, Kuryk, Baku and Turkmenbashi.",
      keywords: ["Caspian shipping Aktau Baku", "break bulk Kazakhstan", "sea freight Central Asia", "heavy lift Caspian"],
    },
    hero: {
      title: "Ocean and Caspian Freight, Connected Inland",
      lead: "From world ports to the Caspian and on to your door — containers, break bulk, heavy-lift and ro-ro.",
      ctas: [{ label: "Request an Ocean Quote", href: "/request-a-quote?service=OCEAN_CASPIAN", variant: "gold" }],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "For a landlocked region, the sea journey is only half the story. Navigator connects global ocean services with Caspian shipping and inland transport, giving you a single, managed chain from load port to final destination.",
        ],
      },
      {
        type: "cards",
        heading: "Ocean & Caspian Services",
        columns: 2,
        items: [
          {
            title: "Container Shipping",
            body: "FCL and LCL, including open-top, flat-rack, reefer and tank containers, with inland delivery to Central Asia.",
            icon: "box",
          },
          {
            title: "Break Bulk & Heavy Lift",
            body: "Conventional, heavy-lift and project vessel chartering for oversized and heavy cargo.",
            icon: "crane",
          },
          {
            title: "Caspian Operations",
            body: "Ferry, ro-ro and general cargo vessels between Aktau, Kuryk, Baku/Alat and Turkmenbashi; river-sea vessels via the Volga–Don.",
            icon: "ship",
          },
          {
            title: "Port Services",
            body: "Stevedoring coordination, port storage, lashing, surveys and discharge supervision.",
            icon: "anchor",
          },
        ],
      },
      {
        type: "tags",
        heading: "Key Ports",
        headingLevel: 3,
        items: [
          "Aktau",
          "Kuryk",
          "Baku / Alat",
          "Turkmenbashi",
          "Poti",
          "Batumi",
          "Bandar Abbas",
          "Jebel Ali",
          "Mundra",
          "Nhava Sheva",
          "Karachi",
          "Mersin",
          "Istanbul",
          "Antwerp",
          "Hamburg",
          "Rotterdam",
          "Lianyungang",
          "Tianjin",
          "Shanghai",
        ],
      },
    ],
    related: [
      { label: "Multimodal Solutions", href: "/services/multimodal-solutions", kind: "service" },
      { label: "Project Logistics & Heavy Lift", href: "/services/project-logistics-heavy-lift", kind: "service" },
      { label: "Oil & Gas", href: "/industries/oil-gas", kind: "industry" },
      { label: "Caspian Sea", href: "/corridors/caspian-sea", kind: "corridor" },
    ],
  },

  // --- 5.8 -------------------------------------------------------------------
  {
    slug: "air-freight",
    path: "/services/air-freight",
    title: "Air Freight",
    summary: "Time-critical air freight, AOG spares, dangerous goods and charter flights.",
    icon: "plane",
    quoteService: "AIR",
    meta: {
      title: "Air Freight & Charter to Kazakhstan | Navigator Sea Land Limited",
      description:
        "Time-critical air freight, AOG spares, dangerous goods and charter flights to and from Almaty, Astana, Atyrau and Central Asia.",
      keywords: ["air freight Kazakhstan", "air cargo Almaty", "charter flight Central Asia", "urgent spare parts Atyrau"],
    },
    hero: {
      title: "Air Freight When Every Hour Counts",
      lead: "Express, consolidated, dangerous-goods and charter air cargo for Central Asia's critical operations.",
      ctas: [
        { label: "Request an Air Quote", href: "/request-a-quote?service=AIR", variant: "gold" },
        { label: "24/7 Urgent Line", href: "tel:+77756624455", variant: "onDark" },
      ],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "When a compressor is down on an oil field or a project is waiting for a critical part, air freight is the answer. Navigator provides door-to-door air freight to and from Almaty, Astana, Atyrau, Aktau, Shymkent and Tashkent via global hubs such as Dubai, Istanbul, Frankfurt, Incheon and Beijing.",
        ],
      },
      {
        type: "list",
        heading: "Air Freight Services",
        items: [
          "Next-flight-out and express services for critical spares.",
          "Consolidated air cargo for regular shipments.",
          "Dangerous goods (IATA DGR) and temperature-controlled cargo.",
          "Full and part aircraft charters for outsized or urgent project cargo.",
          "Air + road combinations for delivery to remote field sites.",
          "Customs clearance at destination airport and on-forwarding.",
        ],
      },
    ],
    related: [
      { label: "Road Freight", href: "/services/road-freight", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "Oil & Gas", href: "/industries/oil-gas", kind: "industry" },
      { label: "Europe & Türkiye", href: "/corridors/europe-turkiye", kind: "corridor" },
    ],
  },

  // --- 5.9 -------------------------------------------------------------------
  {
    slug: "customs-trade-compliance",
    path: "/services/customs-trade-compliance",
    title: "Customs & Trade Compliance",
    summary: "EAEU customs, transit regimes, classification, duty exemptions and DG documentation.",
    icon: "document",
    quoteService: "CUSTOMS",
    meta: {
      title: "EAEU Customs Clearance & Compliance | Navigator Sea Land Limited",
      description:
        "Customs clearance and trade compliance in Kazakhstan and the EAEU: HS classification, transit, temporary import, duty exemptions and DG documentation.",
      keywords: ["customs clearance Kazakhstan", "EAEU customs broker", "transit customs Central Asia", "temporary import Kazakhstan"],
    },
    hero: {
      title: "Customs Expertise That Keeps Cargo Moving",
      lead: "EAEU customs, transit regimes and trade compliance managed by specialists who know the rules — and the people.",
      ctas: [{ label: "Speak to a Customs Specialist", href: "/contact", variant: "gold" }],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Customs delays are the most common cause of cost overruns in Central Asian logistics. Navigator coordinates import, export and transit formalities under the EAEU Customs Code and national legislation of Uzbekistan, Kyrgyzstan and neighbouring countries — working with licensed customs representatives to prepare documents correctly the first time.",
        ],
      },
      {
        type: "list",
        heading: "Customs & Compliance Services",
        items: [
          "HS / TN VED classification and ETSNG / GNG coding for rail.",
          "Import, export and transit declarations; T1, TIR and SMGS transit.",
          "Temporary import and re-export of equipment (cranes, rigs, tools) and ATA Carnets.",
          "Duty and VAT exemption support for investment and EPC projects.",
          "Certificates of origin, conformity certificates (EAEU TR), phytosanitary and veterinary certificates.",
          "Dangerous-goods declarations and sanctions / dual-use screening.",
        ],
      },
      {
        type: "confirm",
        title: "Customs licensing",
        body: "If Navigator is not itself a licensed customs representative, keep the wording \"coordinates... working with licensed customs representatives\" (as published). If licensed, state the licence number.",
      },
    ],
    related: [
      { label: "Rail Freight", href: "/services/rail-freight", kind: "service" },
      { label: "Road Freight", href: "/services/road-freight", kind: "service" },
      { label: "EPC & Infrastructure", href: "/industries/epc-infrastructure", kind: "industry" },
      { label: "China Land Bridge", href: "/corridors/china-land-bridge", kind: "corridor" },
    ],
  },

  // --- 5.10 ------------------------------------------------------------------
  {
    slug: "warehousing-distribution",
    path: "/services/warehousing-distribution",
    title: "Warehousing & Distribution",
    summary: "Warehousing, bonded storage, project laydown yards, consolidation and distribution.",
    icon: "warehouse",
    quoteService: "WAREHOUSING",
    meta: {
      title: "Warehousing & Laydown Yards Kazakhstan | Navigator Sea Land Limited",
      description:
        "Warehousing, bonded storage, project laydown yards, consolidation and distribution in Almaty, Atyrau and across Kazakhstan.",
      keywords: ["warehouse Almaty", "laydown yard Atyrau", "bonded warehouse Kazakhstan", "project cargo storage"],
    },
    hero: {
      title: "Storage and Distribution Built for Projects",
      lead: "Warehousing, bonded storage and open laydown yards that keep your supply chain flowing.",
      ctas: [{ label: "Request Storage Options", href: "/request-a-quote?service=WAREHOUSING", variant: "gold" }],
    },
    blocks: [
      {
        type: "prose",
        paragraphs: [
          "Project schedules rarely align perfectly with manufacturing and shipping. Navigator provides flexible storage solutions — covered warehousing, bonded storage for cargo awaiting clearance, and open laydown yards for heavy and oversized equipment — through our partner facilities in Almaty, Atyrau and key gateway locations.",
        ],
      },
      {
        type: "list",
        heading: "Warehousing Services",
        items: [
          "Covered and bonded warehousing with inventory reporting.",
          "Open laydown and storage yards for OOG and heavy cargo, with crane and forklift support.",
          "Consolidation and de-consolidation (LCL, groupage, project consolidation).",
          "Preservation, inspection and re-packing of project equipment.",
          "Just-in-time distribution to construction and field sites.",
        ],
      },
      {
        type: "confirm",
        title: "Facilities",
        body: "Confirm facility locations, sizes (m²), crane capacities and bonded status before publishing specific figures. None are published yet.",
      },
    ],
    related: [
      { label: "Project Logistics & Heavy Lift", href: "/services/project-logistics-heavy-lift", kind: "service" },
      { label: "Customs & Trade Compliance", href: "/services/customs-trade-compliance", kind: "service" },
      { label: "Renewable Energy & BESS", href: "/industries/renewable-energy-bess", kind: "industry" },
      { label: "Caspian Sea", href: "/corridors/caspian-sea", kind: "corridor" },
    ],
  },
];

export function findService(slug: string): ServicePage | undefined {
  return services.find((s) => s.slug === slug);
}
