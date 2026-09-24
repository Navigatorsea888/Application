# Navigator Sea Land — Website Content Deck v2.0 implementation

**Date:** 2026-09-24 · **Source:** `Navigator_Sea_Land_Limited_Website_Content_Final (1).docx`
(Version 2.0, September 2026) · **Status:** Implemented

## Purpose

Rebuild the public marketing site so that every page carries the copy, structure,
SEO metadata and design direction in the v2.0 copy deck. The tracking portal and
the admin panel are out of the deck's scope and are kept as they are, restyled
only through the shared design tokens.

The deck was written for an IT team and asks for the pages to be built "exactly in
the order the sections appear". This spec records the decisions taken where the
deck leaves something open or where it asks for material that does not yet exist.

## Decisions

| Question | Decision | Why |
|---|---|---|
| Where copy lives | `lib/content/` — one module per content family (company, services, industries, corridors, projects, insights, faqs, navigation) | The old single `content.ts` would pass 2,000 lines; separate modules keep each family reviewable on its own and let the `[CONFIRM]` sweep be per file |
| How pages are built | Data-driven templates. Service, industry and corridor pages are `[slug]` routes rendering typed section blocks from the content modules | Ten service pages share one template in the deck ("Hero → Intro → Detail → Grid → Why → FAQ → CTA"). One renderer means one H1, one band-alternation rule and one FAQ schema for all of them |
| URLs | Exactly as listed in the deck, without trailing slashes. Next.js already treats `/about-us/` and `/about-us` as the same page | Clean URLs as specified; no `trailingSlash` flag that would also touch `/admin` and `/api` |
| Old URLs | 301 redirects in `next.config.ts`: `/about → /about-us`, `/quote → /request-a-quote`, `/locations → /contact`, `/services#<old> → /services/<new>` (hash cannot be redirected, so the old anchors are mapped to the nearest new page) | Deck 11.2 asks for 301s from all current URLs |
| Brand palette | Navy `#0B2545`, teal `#13807E`, gold `#C9A227`, light teal `#EAF4F4`, charcoal `#2B2F36`, mapped onto the existing token names (`ink-*` = navy/neutral scale, `accent-*` = teal scale, new `gold-*`). Amber `signal-*` stays reserved for shipment exceptions | The admin panel and tracking portal use the same tokens, so a token remap restyles everything consistently without touching 60 files. Gold and amber are kept distinct: gold means "call to action", amber means "something is wrong with a shipment" |
| Gold buttons | Navy text on gold | White on `#C9A227` fails WCAG AA (≈2.2:1); navy on gold passes (≈6.4:1) |
| Fonts | Montserrat (headings) and Inter (body) via Google Fonts, both with Cyrillic subsets | Deck 11.3; Cyrillic is needed for the RU/KZ versions to follow |
| `[CONFIRM]` items | Three treatments. **(a)** Claims the deck itself approved as wording (e.g. "owned-partner and contracted fleet network") are published as written. **(b)** Sections that need facts not yet supplied (key-figure counters, accreditation logos, testimonials, leadership bios, photo gallery) are **hidden** until the content module is filled in. **(c)** Contact details the deck marks `[CONFIRM]` are published with the value the deck gives, and listed in the launch checklist | The deck is explicit: "hide this section rather than publish placeholder text" and "do not publish unverified claims" |
| Reviewer visibility of `[CONFIRM]` | A `ConfirmNote` component renders the deck's gold boxes only when `NODE_ENV !== "production"` or `NEXT_PUBLIC_SHOW_CONFIRM_NOTES=true` | Management reviews on a preview build and sees exactly what needs confirming, where it sits on the page; the public build never shows it |
| Quote reference format | Keep `QR-YYYY-NNNN` | The deck's confirmation message says `NSL-[auto number]`, but `NSL-YYYY-NNNN` is already the Tracking ID format. Two references with the same prefix would be confused on the phone |
| Quote form | Multi-step (7 steps as in deck 10.1) with attachments up to 20 MB total, stored through the existing storage driver in a new `QuoteAttachment` table | Deck asks for it; the storage layer already exists for checkpoint attachments |
| Language switcher | Rendered with EN active; RU and KZ shown as "in preparation" and not linked | Translations "to follow"; a switcher that navigates nowhere is worse than one that says so |
| Company Profile PDF | Header button links to the Downloads section; each download is either a file link or "request by email" until the file exists | No PDFs were supplied |
| Corridor sub-pages | Written from the deck's corridor table plus the operational detail already on the site; transit-time ranges **not** published, a note explains they follow validation, and each page shows a "last reviewed" date | Deck 7 requires transit times be validated internally first |
| Case studies | The three cards whose copy the deck supplies are published anonymised as written; the six "recommended launch case studies" are not built as pages | Deck 8: publish only if executed and with permission |
| Blog | Insights page lists the ten launch topics as "in preparation"; no article bodies are invented | Deck 9.2 lists topics only |
| Tools | CBM & chargeable weight calculator, OOG pre-check, Incoterms® 2020 guide and container/equipment specs are implemented as working client-side tools | Deck 9.1; all four are deterministic and need no backend |
| Mumbai office | Removed from the website. The `MUMBAI` staff-office constant stays so existing user records are untouched | The deck lists only Almaty and Atyrau |
| Schema.org | `Organization` + one `LocalBusiness` per office in the site layout; `Service` on service pages; `FAQPage` wherever a FAQ renders; `BreadcrumbList` with visible breadcrumbs on every interior page | Deck 11.2 |
| Mobile | Sticky bottom bar (Quote · Call · WhatsApp) and a WhatsApp float on desktop | Deck 11.3 and 2.3 |
| Imagery | No photography was supplied. Heroes use the navy/teal corridor-line graphic; every `[IMG]` instruction is recorded in the launch checklist with the deck's alt-text guidance | Deck 11.3 forbids generic stock; real operations photos are a client deliverable |

## Site map (as built)

```
/                                   Home
/about-us                           Who We Are · Vision, Mission & Values · Network & Offices ·
                                    Accreditations (hidden until confirmed) · Why Navigator · HSSE
/services                           Landing, 10 cards
/services/project-logistics-heavy-lift
/services/heavy-haul-over-dimensional-trucking
/services/bulk-liquid-transportation
/services/multimodal-solutions
/services/rail-freight
/services/road-freight
/services/ocean-caspian-freight
/services/air-freight
/services/customs-trade-compliance
/services/warehousing-distribution
/industries                         Landing, 7 tiles
/industries/{oil-gas, petrochemicals-chemicals, mining-metals, renewable-energy-bess,
             power-utilities, epc-infrastructure, agro-commodities}
/corridors                          Landing with interactive SVG map and comparison table
/corridors/{china-land-bridge, middle-corridor, instc, caspian-sea, south-asia-khunjerab,
            europe-turkiye}
/projects                           Case study cards; gallery hidden until photos exist
/insights                           News (topics in preparation) · Tools · Downloads
/insights/tools                     CBM calculator · OOG pre-check · Incoterms · Equipment specs
/contact                            Offices · department emails · 24/7 desk · general FAQ
/request-a-quote                    7-step form
/careers
/faq                                General FAQ + tracking-portal FAQ
/track                              Unchanged (tracking portal)
/privacy  /terms  /cookies          Legal
```

## Data model changes

`QuoteRequest` gains: `serviceType`, `hsCode`, `weightPerPieceKg`, `isDangerousGoods`,
`unNumber`, `isTemperatureControlled`, `isBulkLiquid`, `insuranceRequired`,
`cargoReadyDate`, `contactPosition`, `preferredLanguage`. All nullable or defaulted,
so existing rows and the seed are untouched.

New `QuoteAttachment` (`quoteRequestId`, `fileName`, `storagePath`, `mimeType`,
`sizeBytes`). Stored under key `quote-<id>/<uuid>.<ext>` by the existing storage
driver; served through `/api/files` to signed-in staff only (never public: a quote
attachment is always commercial). Row-level security and grant revocation are applied
in the same migration, so `npm run db:check-rls` keeps passing.

## Component architecture

```
components/site/
  site-header.tsx        Utility bar, logo, mega-menu nav, CTA buttons, mobile drawer
  site-footer.tsx        About blurb, five columns, legal line
  mobile-action-bar.tsx  Sticky Quote · Call · WhatsApp on < lg
  whatsapp-float.tsx     Desktop float
  hero-banner.tsx        Navy full-bleed banner: breadcrumbs, H1, sub-headline, CTAs
  closing-cta.tsx        "Have a cargo others call impossible?" strip
  section-renderer.tsx   Renders typed content blocks with alternating bands
  faq.tsx                <details> accordion + FAQPage JSON-LD
  confirm-note.tsx       Gold review box, preview builds only
  breadcrumbs.tsx        Visible trail + BreadcrumbList JSON-LD
  json-ld.tsx            Organization / LocalBusiness / Service helpers
  corridor-map.tsx       Interactive SVG Eurasia network
  counter.tsx            Animated key figure (used only when figures are verified)
  process-steps.tsx      5-step "How we deliver"
components/quote/
  quote-wizard.tsx       Multi-step form
components/tools/
  cbm-calculator.tsx  oog-precheck.tsx  incoterms-guide.tsx  equipment-specs.tsx
```

Content blocks (`lib/content/types.ts`): `prose`, `cards`, `table`, `list`,
`steps`, `faq`, `quote-cta`, `related`, `confirm`. Every page is a hero plus an
ordered list of blocks, so the deck's section order is the array order.

## Verification (2026-09-24)

- `npm run typecheck`, `npm run build` (44 routes) and `npm test` (76 tests) pass.
- Legacy URLs redirect with HTTP 308 (Next.js's permanent redirect; treated like 301 by search engines).
- Every route in the site map returns 200; every legacy URL returns 301 to the
  mapped page.
- Production HTML contains no `[CONFIRM]`, `[VERIFY]` or `XX` placeholders.
- axe-core 4 (WCAG 2.1 A/AA tags) across 30 public routes at 390px and 1440px: 0 violations, no horizontal overflow.
- Meta title and description on each page match the deck verbatim.
