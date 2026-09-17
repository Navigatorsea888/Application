// ---------------------------------------------------------------------------
// Site content.
//
// Everything a non-developer is likely to want changed lives here rather than
// inside components. Draft copy is written from the corridor, service and
// office information supplied by Navigator Sea Land.
//
// !! ANY VALUE TAGGED [VERIFY] IS A PLACEHOLDER THAT HAS NOT BEEN CONFIRMED.  !!
// !! Search this file for "VERIFY" before the site goes live. Nothing tagged  !!
// !! this way should be published as a factual claim until checked.           !!
// ---------------------------------------------------------------------------

export const VERIFY = "[VERIFY]";

export const company = {
  legalName: "Navigator Sea Land Limited",
  shortName: "Navigator Sea Land",
  initials: "NSL",
  tagline: "Project freight forwarding across Central Asia and the Eurasian corridors",
  strapline: "Multimodal & Heavy-Lift Logistics",
  descriptionShort:
    "Navigator Sea Land Limited moves out-of-gauge, heavy-lift and project cargo across Central Asia, the Caspian, the China Land Bridge, the Middle Corridor and the INSTC.",
  descriptionLong:
    "Navigator Sea Land Limited is a project freight forwarder and multimodal logistics operator. We plan and execute the movement of out-of-gauge and heavy-lift cargo for EPC contractors, energy and industrial project owners, and fellow forwarders, working across the road, rail, sea and barge legs that a single corridor movement demands.",
  // [VERIFY] — company registration details before publishing on invoices or the footer.
  registration: `${VERIFY} Company registration number`,
  founded: `${VERIFY} Year established`,
  email: "operations@navigatorsealand.com",
  phone: `${VERIFY} +7 (XXX) XXX XX XX`,
};

export const offices = [
  {
    key: "ALMATY",
    city: "Almaty",
    country: "Kazakhstan",
    role: "Head office & corridor operations",
    address: `${VERIFY} Street address, Almaty, Kazakhstan`,
    phone: `${VERIFY} +7 (727) XXX XX XX`,
    email: "almaty@navigatorsealand.com",
    description:
      "Corridor planning, rail and road execution across Kazakhstan, Uzbekistan, Kyrgyzstan and Tajikistan, and China Land Bridge coordination through Khorgos and Dostyk.",
    hours: "Mon–Fri, 09:00–18:00 (UTC+5)",
  },
  {
    key: "ATYRAU",
    city: "Atyrau",
    country: "Kazakhstan",
    role: "Caspian & energy projects",
    address: `${VERIFY} Street address, Atyrau, Kazakhstan`,
    phone: `${VERIFY} +7 (712) XXX XX XX`,
    email: "atyrau@navigatorsealand.com",
    description:
      "Caspian ferry and barge operations, oil and gas project cargo, and site delivery into the North Caspian fields.",
    hours: "Mon–Fri, 09:00–18:00 (UTC+5)",
  },
  {
    key: "MUMBAI",
    city: "Mumbai",
    country: "India",
    role: "INSTC & subcontinent gateway",
    address: `${VERIFY} Street address, Mumbai, India`,
    phone: `${VERIFY} +91 (22) XXXX XXXX`,
    email: "mumbai@navigatorsealand.com",
    description:
      "INSTC southern gateway, ocean legs via Nhava Sheva and Mundra, and origin handling for equipment manufactured in India.",
    hours: "Mon–Fri, 09:30–18:30 (UTC+5:30)",
  },
] as const;

export const services = [
  {
    slug: "project-cargo",
    title: "Project Cargo Management",
    summary:
      "End-to-end management of a project's transport scope, from route survey to final site delivery.",
    icon: "clipboard",
    body: [
      "A project move is a sequence of commitments — a vessel window, a wagon allocation, a permit, a crane at site — that only holds if every one is planned against the others. We take the transport scope of a project and run it as a single plan rather than a series of bookings.",
      "That means route surveys before rates are fixed, method statements for each critical lift, and a schedule that is tested against the real constraints of the corridor: bridge and axle limits, tunnel profiles, ferry sailing frequency, and the seasonal windows that close certain routes entirely.",
    ],
    features: [
      "Route surveys and feasibility studies",
      "Transport method statements and lift plans",
      "Permit and escort coordination",
      "Multi-leg scheduling and critical-path management",
      "On-site supervision at load and discharge",
    ],
  },
  {
    slug: "oog-heavy-lift",
    title: "OOG & Heavy-Lift",
    summary:
      "Out-of-gauge and heavy-lift cargo that does not fit a container and cannot be handled as general freight.",
    icon: "crane",
    body: [
      "Out-of-gauge cargo is defined by what it exceeds: the loading gauge of a railway, the swept path of a junction, the capacity of a bridge. Each of those is a separate approval from a separate authority, and each has its own lead time.",
      "We handle transformers, pressure vessels, turbines, modules, cranes and drilling equipment on flat racks, open tops, modular trailers and specialised rail wagons, and we plan the approvals in parallel with the physical move so that neither waits on the other.",
    ],
    features: [
      "Modular and hydraulic trailer movements",
      "Specialised rail wagon sourcing (transporter, well and depressed-centre)",
      "Flat rack, open top and breakbulk sea carriage",
      "Lifting studies, lashing and securing plans",
      "Bridge, axle-load and structural assessments",
    ],
  },
  {
    slug: "multimodal-transport",
    title: "Multimodal Transport",
    summary:
      "Road, rail, sea and barge combined under one contract, one plan and one point of contact.",
    icon: "route",
    body: [
      "Almost nothing moving into Central Asia travels on a single mode. A typical movement may start on a heavy-lift vessel, transfer to rail, cross the Caspian by ferry, and finish on modular trailers over the last unsealed kilometres to site.",
      "We contract the whole chain rather than the legs, so a delay at a transshipment point becomes our problem to re-plan rather than a gap between two suppliers' liabilities.",
    ],
    features: [
      "Sea, rail, road and inland waterway combinations",
      "Caspian ferry and barge operations",
      "Block train and part-train rail solutions",
      "Transshipment supervision at gauge changes",
      "Single through-documentation",
    ],
  },
  {
    slug: "customs-clearance",
    title: "Customs Clearance & Documentation",
    summary:
      "Export, import and transit formalities across the corridor countries, including temporary import regimes.",
    icon: "document",
    body: [
      "Corridor movements cross customs unions, transit regimes and bilateral arrangements that do not always agree with each other. The paperwork is not an administrative afterthought; it determines whether cargo moves on the day it arrives at a border or waits a week.",
      "We prepare and lodge declarations, manage TIR and transit procedures, and handle the temporary import regimes that project equipment and construction plant typically move under.",
    ],
    features: [
      "Export, import and transit declarations",
      "TIR carnet and transit guarantee management",
      "Temporary import and re-export regimes",
      "HS classification and duty assessment",
      "Certificate of origin and permit handling",
    ],
  },
  {
    slug: "chartering",
    title: "Chartering & Vessel Operations",
    summary:
      "Part and full charters, heavy-lift tonnage, and Caspian ferry and barge space for cargo no liner will accept.",
    icon: "ship",
    body: [
      "When a piece exceeds what liner services will carry, the answer is tonnage taken for the cargo rather than cargo fitted to a service. We arrange part charters, full charters and heavy-lift tonnage, and secure Caspian ferry and barge space on the Aktau and Kuryk routes.",
      "Charter work is judged on the terms as much as the rate: laytime, lifting gear, stowage and the liberty clauses that decide who carries the cost when a berth is not available.",
    ],
    features: [
      "Part and full charter fixing",
      "Heavy-lift and geared tonnage",
      "Caspian ferry and barge space",
      "Stowage planning and cargo securing approval",
      "Port agency and berth coordination",
    ],
  },
  {
    slug: "warehousing",
    title: "Warehousing & Site Support",
    summary:
      "Staging, consolidation and open-yard storage close to the corridors and to project sites.",
    icon: "warehouse",
    body: [
      "Project cargo rarely arrives in the order a site needs it. Staging areas close to the corridor let a delivery sequence be built to the construction programme rather than to the order in which suppliers shipped.",
      "We arrange covered and open-yard storage, consolidation of multi-supplier shipments, and the heavy handling equipment needed to receive and re-load oversized pieces.",
    ],
    features: [
      "Open yard and covered storage",
      "Multi-supplier consolidation",
      "Heavy handling and craneage",
      "Pre-delivery inspection and preservation",
      "Delivery sequencing to site programme",
    ],
  },
] as const;

export const corridors = [
  {
    key: "MIDDLE_CORRIDOR",
    slug: "middle-corridor",
    title: "Middle Corridor (TITR)",
    subtitle: "Trans-Caspian International Transport Route",
    summary:
      "China and Central Asia to Europe via Kazakhstan, the Caspian Sea, Azerbaijan and Georgia — bypassing the northern route.",
    body: [
      "The Middle Corridor runs from China through Kazakhstan to the Caspian ports of Aktau and Kuryk, crosses by ferry to Alat in Azerbaijan, and continues by rail through Georgia to the Black Sea or onward to Turkey and Europe.",
      "Its advantage is that it avoids the northern route entirely. Its difficulty is the Caspian crossing: ferry capacity is finite, sailings are weather-dependent, and an out-of-gauge piece competes for the same deck space as everything else. Planning the corridor means planning that crossing first and fitting the land legs around it.",
    ],
    keyPoints: ["Aktau", "Kuryk", "Alat", "Poti / Batumi", "Khorgos"],
    transitNote: `${VERIFY} Indicative transit time China–Europe`,
  },
  {
    key: "CHINA_LAND_BRIDGE",
    slug: "china-land-bridge",
    title: "China Land Bridge",
    subtitle: "Khorgos and Dostyk gateways",
    summary:
      "Rail from Chinese manufacturing centres into Central Asia and beyond, through the Kazakh border crossings.",
    body: [
      "Most project equipment manufactured in China enters Central Asia through Khorgos or Dostyk. Both are gauge-change points: cargo moves from the Chinese 1,435 mm standard gauge to the 1,520 mm gauge used across the former Soviet network.",
      "For out-of-gauge cargo the gauge change is the critical event. It means a transshipment, a re-securing operation and a fresh loading-gauge approval against a different profile. We supervise that transfer rather than leave it to the terminal.",
    ],
    keyPoints: ["Khorgos", "Dostyk", "Altynkol", "Urumqi", "Xi'an"],
    transitNote: `${VERIFY} Indicative transit time from Chinese origins`,
  },
  {
    key: "INSTC",
    slug: "instc",
    title: "INSTC",
    subtitle: "International North–South Transport Corridor",
    summary:
      "India and the Gulf to Russia and Northern Europe via Iran and the Caspian, with branches through Central Asia.",
    body: [
      "The INSTC links the Indian Ocean to the Caspian and onward north. Cargo from Nhava Sheva or Mundra reaches Bandar Abbas, moves overland across Iran, and continues either across the Caspian from Anzali and Amirabad or overland through Turkmenistan and Kazakhstan.",
      "The corridor rewards careful counterparty and compliance work. Routings, banking arrangements and carrier selection all need checking against the sanctions position applicable to the cargo and the parties at the time of shipment — a check we make on every INSTC enquiry before quoting.",
    ],
    keyPoints: ["Nhava Sheva", "Bandar Abbas", "Anzali", "Amirabad", "Aktau"],
    transitNote: `${VERIFY} Indicative transit time India–Caspian`,
  },
  {
    key: "CASPIAN",
    slug: "caspian",
    title: "Caspian Sea",
    subtitle: "Ferry, barge and port operations",
    summary:
      "The crossing that connects Central Asia to the Caucasus, and the constraint most corridor plans turn on.",
    body: [
      "We operate across the Caspian through Aktau and Kuryk on the eastern shore and Alat on the western, using rail ferries, ro-ro tonnage and barges depending on the piece.",
      "Barge is often the answer for cargo that will not go by ferry — a single oversized module, or a weight concentration no deck will take. It buys flexibility on dimensions at the cost of schedule, and works best when it is planned in from the start rather than reached for when a ferry booking fails.",
    ],
    keyPoints: ["Aktau", "Kuryk", "Alat", "Baku", "Turkmenbashi"],
    transitNote: `${VERIFY} Indicative Caspian crossing time`,
  },
  {
    key: "CENTRAL_ASIA",
    slug: "central-asia",
    title: "Central Asia",
    subtitle: "Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan",
    summary:
      "Inland delivery across five republics, where the last leg to site is often the hardest part of the move.",
    body: [
      "Central Asia is where corridor cargo stops being a corridor problem and becomes a road problem. Final delivery runs on regional roads with bridge and axle limits that were not set with 200-tonne pieces in mind, over distances where the nearest alternative route may be several hundred kilometres away.",
      "We survey the final leg before committing to it, arrange the permits and escorts, and where necessary carry out the bridge reinforcement and road works that make the delivery possible.",
    ],
    keyPoints: ["Almaty", "Atyrau", "Tashkent", "Ashgabat", "Bishkek", "Dushanbe"],
    transitNote: `${VERIFY} Indicative inland transit times`,
  },
] as const;

// Case studies. Every figure below is a PLACEHOLDER. Replace with real project
// data — and obtain client consent before naming any project or company.
export const projects = [
  {
    slug: "mirny-wind-project",
    title: `${VERIFY} Mirny Wind Project — turbine components`,
    corridor: "Central Asia",
    year: `${VERIFY} Year`,
    summary: `${VERIFY} Placeholder summary. Movement of wind turbine components from a Chinese origin to a Kazakh project site, combining rail over the China Land Bridge with modular trailer delivery on the final leg.`,
    cargo: `${VERIFY} Cargo description, piece count, heaviest and longest pieces`,
    route: `${VERIFY} Origin → Khorgos → site`,
    challenge: `${VERIFY} Describe the binding constraint — bridge capacity, blade length, seasonal road closure.`,
    solution: `${VERIFY} Describe what Navigator Sea Land did about it.`,
    metrics: [
      { label: "Heaviest piece", value: `${VERIFY} t` },
      { label: "Longest piece", value: `${VERIFY} m` },
      { label: "Total pieces", value: VERIFY },
      { label: "Transit", value: `${VERIFY} days` },
    ],
  },
  {
    slug: "caspian-heavy-lift",
    title: `${VERIFY} Caspian heavy-lift — process module`,
    corridor: "Caspian Sea",
    year: `${VERIFY} Year`,
    summary: `${VERIFY} Placeholder summary. Barge movement of an oversized process module across the Caspian, with roll-on and roll-off operations at both shores.`,
    cargo: `${VERIFY} Module dimensions and weight`,
    route: `${VERIFY} Origin port → Caspian crossing → destination`,
    challenge: `${VERIFY} Describe why ferry carriage was not available or suitable.`,
    solution: `${VERIFY} Describe the barge solution, ramp works and securing arrangements.`,
    metrics: [
      { label: "Module weight", value: `${VERIFY} t` },
      { label: "Dimensions", value: `${VERIFY} m` },
      { label: "Crossing", value: `${VERIFY} days` },
      { label: "Mode", value: "Barge / ro-ro" },
    ],
  },
  {
    slug: "instc-transformer",
    title: `${VERIFY} INSTC transformer movement`,
    corridor: "INSTC",
    year: `${VERIFY} Year`,
    summary: `${VERIFY} Placeholder summary. Power transformer moved from an Indian manufacturer to a Central Asian substation via the INSTC southern route.`,
    cargo: `${VERIFY} Transformer rating, weight, dimensions`,
    route: `${VERIFY} Nhava Sheva → Bandar Abbas → overland → site`,
    challenge: `${VERIFY} Describe impact recording, shock limits, compliance screening.`,
    solution: `${VERIFY} Describe hydraulic trailer use, escorts, impact monitoring.`,
    metrics: [
      { label: "Weight", value: `${VERIFY} t` },
      { label: "Corridor", value: "INSTC" },
      { label: "Countries", value: VERIFY },
      { label: "Transit", value: `${VERIFY} days` },
    ],
  },
] as const;

export const differentiators = [
  {
    title: "Corridor specialists, not a general network",
    body: "Our offices sit on the corridors we sell. Almaty and Atyrau are on the Middle Corridor and the Caspian; Mumbai is on the INSTC. Route knowledge comes from operating there, not from a partner's rate sheet.",
  },
  {
    title: "Out-of-gauge is the core, not an exception",
    body: "Heavy-lift and OOG cargo is what we are set up for. Route surveys, lift plans, permit lead times and gauge approvals are standard process rather than something arranged when a piece turns out not to fit.",
  },
  {
    title: "One plan across every leg",
    body: "We contract the whole chain. When a ferry slips or a wagon allocation changes, re-planning the rest of the move is our job, not a conversation between three suppliers.",
  },
  {
    title: "Visibility that matches the move",
    body: "A multimodal project movement takes weeks. Our tracking portal shows the full checkpoint timeline — every border, transshipment and clearance — so the position is visible without an email chain.",
  },
] as const;

export const faqs = [
  {
    question: "What counts as project or out-of-gauge cargo?",
    answer:
      "Cargo is out-of-gauge when it exceeds the standard dimensions a container, wagon or road vehicle can carry — in practice, anything that needs a flat rack, an open top, a modular trailer or a specialised wagon. Project cargo is the broader term: the full transport scope of a construction or industrial project, which usually includes both oversized pieces and ordinary freight that has to arrive in a particular sequence.",
  },
  {
    question: "How do I track a shipment?",
    answer:
      "Enter your Tracking ID (format NSL-YYYY-NNNN) on the Track Shipment page, together with the consignee email address or the contract reference for the shipment. The second field protects commercially sensitive movement details from anyone who guesses a Tracking ID. You will see the full checkpoint timeline, current status and estimated delivery date.",
  },
  {
    question: "Why does tracking ask for an email or contract reference?",
    answer:
      "Because project cargo carries commercial information — routes, counterparties, equipment specifications — that should not be visible to anyone who tries a sequential reference number. If you would prefer a particular shipment to be viewable with the Tracking ID alone, so that it can be shared with a site team or a client, ask your Navigator Sea Land contact to open access on that shipment.",
  },
  {
    question: "How accurate are the estimated delivery dates?",
    answer:
      "They are estimates, and on a multimodal cross-border movement they should be read as such. Ferry sailings, wagon allocations, border processing and customs clearance all vary. We update the estimate as each leg is confirmed, and we record the reason on the timeline whenever a movement is delayed or placed on hold.",
  },
  {
    question: "Which corridors do you operate on?",
    answer:
      "Central Asia, the Caspian region, the China Land Bridge through Khorgos and Dostyk, the Middle Corridor (TITR), and the INSTC. We also handle project-specific movements into and through Azerbaijan, Iran, Pakistan and other corridor countries where the project requires it.",
  },
  {
    question: "Do you handle customs clearance?",
    answer:
      "Yes — export, import and transit formalities across the corridor countries, including TIR and transit guarantee procedures and the temporary import regimes that project equipment and construction plant typically move under.",
  },
  {
    question: "What information do you need to quote?",
    answer:
      "Origin and destination, cargo dimensions and weight per piece, the commodity, the number of pieces, your required delivery window, and the Incoterms if they are already agreed. For out-of-gauge cargo, dimensional drawings and the centre of gravity make a material difference to the accuracy of the quote and to the lead time on permits.",
  },
  {
    question: "How long does a quote take?",
    answer: `${VERIFY} State your standard response time — for example, "We acknowledge every enquiry within one business day. A straightforward multimodal quote takes two to three business days; a movement requiring a route survey or permit assessment takes longer, and we will tell you the expected date when we acknowledge."`,
  },
  {
    question: "Are you insured, and is cargo insurance included?",
    answer: `${VERIFY} State your liability position and insurance arrangements. Forwarder liability under standard trading conditions is limited and is not the same as cargo insurance — confirm which conditions you trade under and whether all-risks cargo cover is offered separately.`,
  },
  {
    question: "Can you work as a subcontractor to another forwarder?",
    answer:
      "Yes. A significant part of our work is executing the Central Asian and Caspian legs for forwarders and project logistics companies whose own network stops at the region. We are used to working to another party's documentation and reporting requirements.",
  },
] as const;

export const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/corridors", label: "Corridors" },
  { href: "/projects", label: "Projects" },
  { href: "/track", label: "Track Shipment" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
] as const;

export const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/projects", label: "Projects" },
    { href: "/locations", label: "Locations" },
    { href: "/contact", label: "Contact" },
  ],
  services: services.map((s) => ({ href: `/services#${s.slug}`, label: s.title })),
  corridors: corridors.map((c) => ({ href: `/corridors#${c.slug}`, label: c.title })),
  legal: [
    { href: "/faq", label: "FAQ" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;
