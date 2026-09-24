// ---------------------------------------------------------------------------
// Insights, tools and resources.
// Source: Website Content — Final Copy Deck v2.0, section 9.
// ---------------------------------------------------------------------------

export const insightsLanding = {
  meta: {
    title: "Insights, Tools & Resources | Navigator Sea Land Limited",
    description:
      "Corridor and customs updates for Central Asian shippers, plus free tools: CBM & chargeable weight calculator, OOG pre-check, Incoterms® 2020 guide and container & equipment specs.",
    keywords: ["Middle Corridor update", "CBM calculator", "Incoterms 2020 guide", "container dimensions", "OOG check"],
  },
  hero: {
    title: "Insights, Tools & Resources",
    lead: "Practical corridor knowledge for shippers moving cargo into, out of and across Central Asia — and the tools our own team reaches for.",
    ctas: [
      { label: "Open the Tools", href: "/insights/tools", variant: "gold" as const },
      { label: "Request a Quote", href: "/request-a-quote", variant: "onDark" as const },
    ],
  },
};

export const toolsPage = {
  meta: {
    title: "Freight Tools: CBM Calculator, OOG Check, Incoterms | Navigator Sea Land Limited",
    description:
      "Free logistics tools from Navigator Sea Land Limited: CBM and chargeable weight calculator, out-of-gauge pre-check, Incoterms® 2020 guide and container, trailer and rail wagon specifications.",
    keywords: ["CBM calculator", "chargeable weight calculator", "OOG check", "Incoterms 2020", "container specifications"],
  },
  hero: {
    title: "Tools for Planning Complex Cargo",
    lead: "Four calculators and references built from the questions we answer every day. Results are indicative — our engineers confirm the final answer for your route.",
    ctas: [{ label: "Request a Quote", href: "/request-a-quote", variant: "gold" as const }],
  },
};

export const tools = [
  {
    slug: "cbm-calculator",
    title: "CBM & Chargeable Weight Calculator",
    body: "Enter dimensions and weight; outputs CBM and air/sea chargeable weight.",
    icon: "calculator",
    href: "/insights/tools#cbm-calculator",
  },
  {
    slug: "oog-precheck",
    title: "OOG Pre-Check",
    body: "Enter L×W×H and weight; the tool flags whether the cargo is likely out-of-gauge and prompts an engineer call-back.",
    icon: "gauge",
    href: "/insights/tools#oog-precheck",
  },
  {
    slug: "incoterms",
    title: "Incoterms® 2020 Guide",
    body: "Who pays and who carries risk for each term; print or save as PDF.",
    icon: "scale",
    href: "/insights/tools#incoterms",
  },
  {
    slug: "equipment-specs",
    title: "Container & Equipment Specs",
    body: "Dimensions and payloads of containers, flat racks, trailers and rail wagons.",
    icon: "box",
    href: "/insights/tools#equipment-specs",
  },
] as const;

/**
 * Deck 9.2 launch blog topics (one post per month minimum, 800–1,200 words).
 * Articles are written and approved separately; until then the topics are
 * listed as "in preparation". Add `href` and `publishedOn` when an article
 * goes live and it becomes a card.
 */
export const insightTopics: Array<{
  title: string;
  category: string;
  href?: string;
  publishedOn?: string;
  excerpt?: string;
}> = [
  { title: "Middle Corridor in 2026: capacity, transit times and what shippers should know.", category: "Corridor update" },
  { title: "Khorgos vs Dostyk: choosing the right China–Kazakhstan rail gateway.", category: "Corridor update" },
  { title: "Moving oversized cargo in Kazakhstan: permits, surveys and seasonal restrictions explained.", category: "Heavy haul" },
  { title: "ISO tank vs flexitank vs rail tank wagon: choosing the right bulk liquid solution.", category: "Bulk liquid" },
  { title: "Shipping BESS containers to Central Asia: dangerous-goods rules by rail, road and sea.", category: "Compliance" },
  { title: "INSTC explained: India to Central Asia through Iran.", category: "Corridor update" },
  { title: "Wind blade transport: route engineering for 80-metre components.", category: "Heavy haul" },
  { title: "Temporary import of construction equipment into Kazakhstan: a practical guide.", category: "Customs" },
  { title: "Caspian heavy-lift shipping: vessel options and port constraints at Aktau, Kuryk and Baku.", category: "Corridor update" },
  { title: "Incoterms for Central Asian importers: avoiding the most common mistakes.", category: "Trade" },
];

export const publishedInsights = insightTopics.filter((t) => t.href && t.publishedOn);

/**
 * Deck 9.3 downloads. Set `href` to the file once it exists; until then the
 * item is offered "on request" by email.
 */
export const downloads: Array<{ title: string; description: string; href: string | null; languages: string }> = [
  { title: "Company Profile", description: "Who we are, what we move and where we operate.", href: null, languages: "EN / RU" },
  { title: "Heavy Haul Capability Statement", description: "Equipment range, engineering process and permit management.", href: null, languages: "EN" },
  { title: "Bulk Liquid Solutions Sheet", description: "ISO tank, flexitank, road tanker and rail tank wagon options.", href: null, languages: "EN" },
  { title: "Standard Trading Conditions", description: "The conditions under which Navigator Sea Land Limited contracts.", href: null, languages: "EN" },
  { title: "HSSE Policy", description: "Health, safety, security and environment commitments.", href: null, languages: "EN" },
];
