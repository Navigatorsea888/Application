// ---------------------------------------------------------------------------
// Company, offices, global copy and the "About Us" material.
// Source: Website Content — Final Copy Deck v2.0, sections 3, 4, 5A and 10.
//
// !! Anything holding CONFIRM is a value the deck marks for management to     !!
// !! verify before launch. Search this directory for "CONFIRM" before go-live. !!
// ---------------------------------------------------------------------------

import type { Cta, StepItem } from "./types";

/** Marker for facts the deck flags `[CONFIRM]`. Never renders in production. */
export const CONFIRM = "[CONFIRM]";

/** True when a content value is a real fact rather than a [CONFIRM] placeholder. */
export function isConfirmed(value: string | null | undefined): value is string {
  return typeof value === "string" && value.length > 0 && !value.includes(CONFIRM);
}

/** Returns the value when confirmed, otherwise the fallback. Keeps placeholders out of production HTML. */
export function confirmedOr(value: string | null | undefined, fallback: string): string {
  return isConfirmed(value) ? value : fallback;
}

export const company = {
  legalName: "Navigator Sea Land Limited",
  shortName: "Navigator Sea Land",
  initials: "NSL",
  domain: "navigatorsealand.com",
  tagline: "Engineering Movement Across Eurasia",
  alternativeTaglines: [
    "Heavy Cargo. Hard Routes. Delivered.",
    "Your Corridor Specialist for Central Asia",
    "Where Complex Cargo Finds Its Way",
  ],
  strapline: "Project Cargo · Heavy Haul · Multimodal",
  /** Footer "About" blurb, verbatim from the deck. */
  descriptionShort:
    "Navigator Sea Land Limited is a Kazakhstan-based project freight forwarder and multimodal logistics specialist with offices in Almaty and Atyrau. We move oversized, heavy-lift, bulk and time-critical cargo across Central Asia, the Caspian, China, the Middle East, South Asia and Europe — engineered, permitted and delivered under one point of accountability.",
  descriptionLong:
    "Navigator Sea Land Limited engineers and delivers oversized, heavy-lift, bulk and multimodal cargo between China, the Caspian, the Middle East, South Asia, Europe and every corner of Central Asia — under one contract, one team and one point of accountability.",

  phone: "+7 775 662 4455",
  phoneHref: "tel:+77756624455",
  whatsappHref: "https://wa.me/77756624455",
  /** Deck: "[24/7 number — CONFIRM]". The main line is used until confirmed. */
  emergencyPhone: "+7 775 662 4455",
  emergencyPhoneHref: "tel:+77756624455",
  /** Deck: "[email — CONFIRM]". */
  email: "operations@navigatorsealand.com",

  headquarters: "Almaty, Republic of Kazakhstan",
  country: "Republic of Kazakhstan",
  languages: ["English", "Russian", "Kazakh"],

  /** Deck 10.2: LinkedIn is the priority B2B channel; YouTube for project videos. Both [CONFIRM]. */
  social: {
    linkedin: null as string | null,
    youtube: null as string | null,
  },

  /** Company registration — not in the deck; required for the footer and legal pages. */
  registration: `${CONFIRM} Company registration number and registered address`,
} as const;

/** Deck 10.2 department mailboxes — all [CONFIRM mailboxes]. */
export const departments = [
  { key: "quotes", label: "Quotations", email: "quotes@navigatorsealand.com" },
  { key: "projects", label: "Projects", email: "projects@navigatorsealand.com" },
  { key: "operations", label: "Operations", email: "operations@navigatorsealand.com" },
  { key: "careers", label: "Careers", email: "careers@navigatorsealand.com" },
] as const;

export const offices = [
  {
    key: "ALMATY",
    city: "Almaty",
    country: "Kazakhstan",
    role: "Commercial & multimodal",
    description:
      "Head office. Commercial, project engineering and multimodal operations across the China Land Bridge, the Middle Corridor and Central Asia.",
    address: `${CONFIRM} Full street address, Almaty, Republic of Kazakhstan`,
    phone: "+7 775 662 4455",
    phoneHref: "tel:+77756624455",
    email: "operations@navigatorsealand.com",
    hours: "Mon–Fri 09:00–18:00 (UTC+5)",
    /** Google Maps embed URL — deck asks for a map embed per office. */
    mapEmbedUrl: null as string | null,
    geo: { lat: 43.238949, lng: 76.889709 },
  },
  {
    key: "ATYRAU",
    city: "Atyrau",
    country: "Kazakhstan",
    role: "Oil & gas and Caspian operations",
    description:
      "At the heart of the Caspian oil region. Heavy haul to field sites, Caspian vessel operations through Aktau and Kuryk, and oil & gas project support.",
    address: `${CONFIRM} Full street address, Atyrau, Republic of Kazakhstan`,
    phone: `${CONFIRM} Atyrau office telephone`,
    phoneHref: null as string | null,
    email: "operations@navigatorsealand.com",
    hours: "Mon–Fri 09:00–18:00 (UTC+5)",
    mapEmbedUrl: null as string | null,
    geo: { lat: 47.094495, lng: 51.923771 },
  },
] as const;

// --- Global elements (deck 3.1) ----------------------------------------------

export const closingCta = {
  heading: "Have a cargo others call impossible?",
  body: "Share your dimensions, weights and route. Our project engineers will respond within one business day with a feasible solution and a transparent quotation.",
  ctas: [
    { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
    { label: "Speak to a Project Engineer", href: "/contact", variant: "onDark" },
  ] as Cta[],
};

// --- Home page (deck 4) -------------------------------------------------------

export const homeHero = {
  title: "Moving the Heaviest Cargo Across the Heart of Eurasia",
  lead: company.descriptionLong,
  ctas: [
    { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
    { label: "Explore Our Capabilities", href: "/services", variant: "onDark" },
  ] as Cta[],
  image: {
    instruction:
      "Video loop or photo: modular trailer convoy on the Kazakh steppe at sunrise; alternate slides — Caspian ro-ro vessel, block train at Khorgos, crane lift on site.",
    alt: "Hydraulic modular trailer convoy carrying oversized cargo across the Kazakh steppe at sunrise",
  },
  /** For A/B testing, per the deck. Not rendered. */
  alternativeTitles: [
    "Project Cargo. Heavy Haul. Multimodal. Mastered Across Central Asia.",
    "Where Complex Cargo Meets Corridor Expertise",
    "From Factory Floor in China to Project Site in the Steppe",
  ],
};

export const trustStrip = [
  { title: "Almaty & Atyrau", body: "Own offices in Kazakhstan" },
  { title: "20+ Years", body: "Leadership experience in CIS multimodal logistics" },
  { title: "5 Corridors", body: "China Land Bridge · Middle Corridor · INSTC · Caspian · Khunjerab" },
  { title: "24/7", body: "Operations desk for critical and project cargo" },
] as const;

export const homeIntro = {
  heading: "Built in Kazakhstan. Engineered for Eurasia's Toughest Routes.",
  paragraphs: [
    "Central Asia is one of the most demanding logistics environments in the world: landlocked geography, multiple border regimes, CIS and European rail gauges, extreme climate, and road infrastructure that must be surveyed metre by metre for every oversized move. This is precisely where Navigator Sea Land Limited excels.",
    "We are a specialist project freight forwarder and multimodal operator headquartered in Kazakhstan. Our team plans and executes shipments that standard forwarders turn away — 100-tonne-plus transformers, wind turbine blades, refinery modules, crane components, bulk liquids and hazardous cargo — combining road, rail, sea, Caspian and air transport into a single, engineered solution.",
    "Because we are privately owned and founder-led, decisions are made quickly and by the people who actually run your shipment. You get the agility of a specialist with the discipline, documentation and HSSE standards expected by international EPC contractors and energy majors.",
  ],
  cta: { label: "Discover Who We Are", href: "/about-us", variant: "primary" } as Cta,
};

/** Deck 4 "How We Deliver" — also used on the Project Logistics page. */
export const processSteps: StepItem[] = [
  {
    title: "Consult & Survey",
    body: "We review cargo drawings, weights and centres of gravity, then survey the route, ports, borders and site access.",
  },
  {
    title: "Engineer & Plan",
    body: "Transport method statements, equipment selection, axle-load and lashing calculations, risk assessment and schedule.",
  },
  {
    title: "Permit & Comply",
    body: "Oversize/overweight permits, escorts, customs pre-clearance, transit permits and dangerous-goods approvals in every country.",
  },
  {
    title: "Execute & Monitor",
    body: "Dedicated project manager, supervised loading, convoy management and daily status reports with photos.",
  },
  {
    title: "Deliver & Close",
    body: "Safe set-down at site, proof of delivery, documentation hand-over and lessons-learned review.",
  },
];

export const homeCorridorsIntro = {
  heading: "Five Corridors. One Specialist.",
  body: "Our network connects the world's manufacturing centres with Central Asia's energy, mining and infrastructure projects through every viable route — giving you options when borders, capacity or schedules change.",
};

export const homeIndustriesHeading = "Trusted by the Sectors That Build Central Asia";

/**
 * Deck 4 "Key Figures (animated counters)". `[CONFIRM] Replace XX with verified
 * figures before launch.` The section renders only when `verified` is true and
 * every value is a number.
 */
export const keyFigures = {
  verified: false,
  items: [
    { value: 20, suffix: "+", label: "years of leadership experience" },
    { value: null as number | null, suffix: "", label: "countries served" },
    { value: null as number | null, suffix: "", label: "tonnes of project cargo moved" },
    { value: null as number | null, suffix: "", label: "projects delivered" },
    { value: null as number | null, suffix: "", label: "partner agents across Eurasia" },
  ],
};

export const homeExperienceHeading = "Proven on the Region's Most Complex Moves";

export const homeUsps = [
  {
    title: "Local Roots, Global Standards",
    body: "Kazakh-based team fluent in Russian, Kazakh and English, working to international HSSE and documentation standards.",
    icon: "globe",
  },
  {
    title: "Engineering First",
    body: "Every OOG move starts with a route survey and method statement — not a guess.",
    icon: "gauge",
  },
  {
    title: "One Point of Accountability",
    body: "One contract, one project manager and one invoice across every mode and border.",
    icon: "target",
  },
  {
    title: "Fast Decisions",
    body: "Founder-led and independent: approvals in hours, not weeks.",
    icon: "bolt",
  },
] as const;

/**
 * Deck 4 Testimonials: "Collect 2–3 short testimonials (with name, title,
 * company, and permission). Until available, hide this section rather than
 * publish placeholder text." Empty array = section hidden.
 */
export const testimonials: Array<{ quote: string; name: string; title: string; company: string }> = [];

// --- About Us (deck 5A) -------------------------------------------------------

export const about = {
  hero: {
    title: "A Kazakhstan-based project logistics company built by practitioners, for the projects shaping Central Asia.",
    lead: "Navigator Sea Land Limited is a project freight forwarding and multimodal logistics company headquartered in Kazakhstan, with offices in Almaty and Atyrau.",
    ctas: [
      { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
      { label: "Our Services", href: "/services", variant: "onDark" },
    ] as Cta[],
  },
  whoWeAre: [
    "Navigator Sea Land Limited is a project freight forwarding and multimodal logistics company headquartered in Kazakhstan, with offices in Almaty and Atyrau. We specialise in out-of-gauge (OOG), heavy-lift, bulk and project cargo moving into, out of and through Central Asia, the Caspian region, China, the Middle East, South Asia and Europe.",
    "Our company was founded by logistics professionals with more than two decades of hands-on experience in CIS multimodal transport — people who have stood on the quayside in Aktau, negotiated wagons at Dostyk, surveyed bridges on steppe highways and escorted convoys to oil-field sites. That field experience is built into every plan we produce.",
    "We work with EPC contractors, energy and mining operators, equipment manufacturers, heavy-lift contractors and commodity traders who need more than a freight booking. They need a partner who understands engineering constraints, border regimes and project schedules — and who takes full responsibility for the outcome.",
  ],
  factSheet: [
    ["Company", "Navigator Sea Land Limited"],
    ["Offices", "Almaty and Atyrau, Republic of Kazakhstan"],
    [
      "Core business",
      "Project freight forwarding, heavy haul, multimodal transport, bulk liquid logistics, customs brokerage coordination",
    ],
    [
      "Geographic scope",
      "Kazakhstan, Uzbekistan, Kyrgyzstan, Tajikistan, Turkmenistan, Azerbaijan, Georgia, Türkiye, China, Iran, Pakistan, India, GCC, Europe",
    ],
    ["Key sectors", "Oil & gas, petrochemicals, mining, renewable energy & BESS, power, EPC & infrastructure, agro"],
    [
      "Signature strengths",
      "OOG / heavy-lift engineering, China Land Bridge, Middle Corridor (TITR), INSTC, Caspian operations, EAEU customs",
    ],
  ] as Array<[string, string]>,
  vision:
    "To be the most trusted project and multimodal logistics partner for the industries building Central Asia and the corridors that connect it to the world.",
  mission:
    "To move complex cargo safely, compliantly and on schedule by combining engineering discipline, deep corridor knowledge and transparent, personal service — under one point of accountability.",
  values: [
    { title: "Safety First", body: "No schedule or cost saving justifies risk to people, cargo or the environment.", icon: "shield" },
    { title: "Precision", body: "We plan with engineering data, not assumptions — measured, calculated and verified.", icon: "gauge" },
    { title: "Integrity", body: "Transparent quotations, honest timelines and no hidden surcharges.", icon: "scale" },
    { title: "Ownership", body: "Your shipment has a named owner on our team from enquiry to delivery.", icon: "target" },
    { title: "Partnership", body: "We invest in long-term relationships with clients, carriers and authorities.", icon: "handshake" },
    { title: "Adaptability", body: "When a border closes or a route changes, we already have the alternative.", icon: "refresh" },
  ] as const,
  network: {
    intro:
      "Our own offices in Almaty and Atyrau are supported by a vetted network of agents, carriers, port operators and heavy-transport partners at every major gateway on our corridors.",
    rows: [
      ["Own offices", "Almaty (commercial & multimodal) · Atyrau (oil & gas and Caspian operations)"],
      [
        "Agent & partner locations",
        "China (Urumqi, Xi'an, Lianyungang, Tianjin, Yiwu, Shanghai) · Azerbaijan (Baku) · Georgia (Poti, Batumi, Tbilisi) · Uzbekistan (Tashkent, Samarkand) · Iran (Bandar Abbas) · Pakistan (Karachi) · India (Mundra, Nhava Sheva) · UAE (Jebel Ali) · Türkiye (Istanbul, Mersin) · Europe (Antwerp, Hamburg, Rotterdam)",
      ],
      [
        "Key gateways",
        "Khorgos / Altynkol · Dostyk · Aktau · Kuryk · Baku / Alat · Turkmenbashi · Khunjerab / Sost · Bolashak (INSTC rail)",
      ],
    ] as Array<[string, string]>,
    confirm: "Agent & partner locations — the deck marks this list [CONFIRM list]. Remove any location without an active agent agreement.",
  },
  /**
   * Deck: "Show as a logo strip with a status line under each logo. Only
   * display logos for accreditations actually held." Set `held: true` and add
   * `logoSrc` once an accreditation is confirmed; until then the section is
   * hidden on the public site.
   */
  accreditations: [
    {
      name: "FIATA (via national association)",
      relevance: "International forwarding standards, FIATA documents (FBL, FCR)",
      status: "To confirm",
      held: false,
      logoSrc: null as string | null,
    },
    {
      name: "National Freight Forwarders Association of Kazakhstan",
      relevance: "Local industry standing",
      status: "To confirm",
      held: false,
      logoSrc: null as string | null,
    },
    {
      name: "ISO 9001 Quality Management",
      relevance: "Tender pre-qualification",
      status: "To confirm / target",
      held: false,
      logoSrc: null as string | null,
    },
    {
      name: "ISO 45001 & 14001 (HSSE)",
      relevance: "Required by many oil & gas operators",
      status: "Target",
      held: false,
      logoSrc: null as string | null,
    },
    {
      name: "Heavy-lift / project cargo networks (e.g. PCN, WCA Projects)",
      relevance: "Global agent reach and financial protection",
      status: "To confirm",
      held: false,
      logoSrc: null as string | null,
    },
    {
      name: "Kazakhstan business registration & forwarding licences",
      relevance: "Legal compliance",
      status: "To confirm",
      held: false,
      logoSrc: null as string | null,
    },
  ],
  whyNavigator: {
    intro:
      "Choosing a project logistics partner in Central Asia usually means compromising: a global forwarder with standard processes but little local control, or a local broker with contacts but no engineering capability. Navigator Sea Land Limited was built to remove that compromise.",
    items: [
      {
        title: "Specialists, Not Generalists",
        body: "Our core business is complex cargo. Heavy, oversized, hazardous and time-critical shipments are our everyday work, not an exception.",
        icon: "crane",
      },
      {
        title: "On-the-Ground Control",
        body: "Our own people in Almaty and Atyrau manage permits, authorities, carriers and customs directly — no chain of sub-agents.",
        icon: "pin",
      },
      {
        title: "Engineering Capability",
        body: "Route surveys, method statements, axle-load and lashing calculations prepared for every OOG move.",
        icon: "gauge",
      },
      {
        title: "Every Corridor, Every Mode",
        body: "When one route is congested or closed, we re-engineer through another — China, Caspian, Iran or Türkiye.",
        icon: "route",
      },
      {
        title: "Transparent Commercials",
        body: "Clear, itemised quotations with defined inclusions, exclusions and validity. No surprise surcharges.",
        icon: "scale",
      },
      {
        title: "Fast, Accountable Decisions",
        body: "Founder-led management responds the same day and stands behind every commitment.",
        icon: "bolt",
      },
    ] as const,
  },
  hsse: {
    intro:
      "Safety is the first line of every Navigator method statement. We apply risk assessments, job-safety analyses and toolbox talks to all heavy-lift and OOG operations, and we select subcontractors against HSSE, insurance and equipment-certification criteria.",
    items: [
      "Pre-qualified carriers with valid insurance, certified lifting gear and trained drivers.",
      "Lashing and securing calculated to recognised standards (e.g., EN 12195-1) and checked before departure.",
      "Journey management plans, weather windows and night-movement rules for oversized convoys.",
      "ADR-compliant vehicles and trained personnel for dangerous goods.",
      "Lower-carbon routing: rail and sea preferred where schedules allow; load consolidation to reduce empty kilometres.",
    ],
  },
  /**
   * Deck lists "Leadership" in the About Us menu but supplies no bios. Add
   * entries here (name, title, bio, photo) once approved; the section and
   * menu item appear automatically when the array is non-empty.
   */
  leadership: [] as Array<{ name: string; title: string; bio: string; photoSrc?: string }>,
};

// --- 24/7 desk and careers (deck 10.3, 10.4) ----------------------------------

export const operationsDesk = {
  heading: "Critical Cargo Doesn't Wait. Neither Do We.",
  body: "For oil & gas, mining and project clients, our operations desk is reachable around the clock for urgent spares, border holds and time-critical moves. Call or WhatsApp our 24/7 line. Every emergency enquiry receives an immediate response from an operations specialist.",
};

export const careers = {
  heading: "Build Your Career Moving What Matters.",
  body: "At Navigator Sea Land Limited you will work on real projects that shape Central Asia's energy and infrastructure. We look for people who combine curiosity with ownership: project engineers, operations coordinators, customs specialists and commercial professionals with CIS corridor experience. We offer hands-on responsibility, exposure to complex international projects and a growing, founder-led company where your ideas are heard.",
  /** Add roles here; an empty list shows the "send your CV" line only. */
  openPositions: [] as Array<{ title: string; location: string; type: string; summary: string }>,
  cvPrompt: "Don't see your role? Send your CV to",
  email: "careers@navigatorsealand.com",
};

// --- Page metadata not attached to a content module ---------------------------

export const homeMeta = {
  title: "Project Cargo, Heavy Haul & Multimodal Logistics | Navigator Sea Land Limited",
  description:
    "Kazakhstan-based project freight forwarder moving OOG, heavy-lift and bulk cargo across Central Asia, the Caspian, China, Middle East and Europe. Request a quote.",
  keywords: [
    "project cargo Kazakhstan",
    "heavy haul Central Asia",
    "multimodal logistics Kazakhstan",
    "OOG transport",
    "freight forwarder Almaty",
  ],
};

export const aboutMeta = {
  title: "About Us | Navigator Sea Land Limited",
  description:
    "Founder-led project freight forwarder with offices in Almaty and Atyrau, specialising in heavy-lift, OOG and multimodal logistics across Central Asia.",
  keywords: ["Navigator Sea Land Limited", "project logistics company Kazakhstan", "freight forwarder Atyrau"],
};

export const quoteMeta = {
  title: "Request a Freight Quote | Navigator Sea Land Limited",
  description:
    "Request a quotation for project cargo, heavy haul, bulk liquid, rail, road, ocean or air freight across Central Asia. Response within one business day.",
  keywords: ["freight quote Kazakhstan", "project cargo quotation", "heavy haul quote"],
};

export const quoteHero = {
  title: "Tell Us About Your Cargo",
  lead: "Share the details below and our specialists will respond within one business day — sooner for urgent and project enquiries.",
  ctas: [{ label: "Start My Quote", href: "#quote-form", variant: "gold" }] as Cta[],
};

export const contactMeta = {
  title: "Contact Us: Almaty & Atyrau Offices, 24/7 Desk | Navigator Sea Land Limited",
  description:
    "Contact Navigator Sea Land Limited in Almaty and Atyrau, Kazakhstan. Phone, WhatsApp, department emails and a 24/7 operations desk for urgent and project cargo.",
  keywords: ["Navigator Sea Land contact", "freight forwarder Almaty phone", "Atyrau logistics office"],
};

export const contactHero = {
  title: "Talk to the People Who Will Run Your Cargo",
  lead: "Enquiries go straight to our operations and project teams in Almaty and Atyrau. For a transport quotation, the quote form captures what we need and gets a faster answer.",
  ctas: [
    { label: "Request a Quote", href: "/request-a-quote", variant: "gold" },
    { label: "Call +7 775 662 4455", href: "tel:+77756624455", variant: "onDark" },
  ] as Cta[],
};

export const careersMeta = {
  title: "Careers | Navigator Sea Land Limited",
  description:
    "Join Navigator Sea Land Limited: project engineers, operations coordinators, customs specialists and commercial professionals with CIS corridor experience, based in Almaty and Atyrau.",
  keywords: ["logistics jobs Almaty", "freight forwarding careers Kazakhstan", "project logistics jobs Atyrau"],
};

export const faqMeta = {
  title: "Frequently Asked Questions | Navigator Sea Land Limited",
  description:
    "Answers to common questions about Navigator Sea Land Limited: where we are based, the countries we cover, how quickly we quote, languages, and how shipment tracking works.",
  keywords: ["Navigator Sea Land FAQ", "freight forwarder Kazakhstan questions", "shipment tracking help"],
};
