# Go-live checklist

Work through this before the site is reachable from the internet. Items marked
**blocking** would cause real harm if skipped — a wrong factual claim, a legal
exposure, or an account anyone can sign into.

The site was rebuilt to the **Website Content — Final Copy Deck v2.0**
(September 2026). Section 12 of that deck is the management confirmation list;
this checklist repeats it in the order it appears on the site, and records where
each item lives in code.

---

## 1. Security — blocking

- [ ] **Change every seeded password.** `admin@navigatorsealand.com / ChangeMe!2026`
      and the two operations accounts are printed in the README and in the seed
      file. Sign in, go to **Staff accounts**, and reset all three.
- [ ] **Set a fresh `SESSION_SECRET`** in the production environment —
      `openssl rand -base64 48`. Do not reuse the development one.
- [ ] **Delete or rename the demo accounts** you do not need. Deactivate rather
      than delete if they have recorded anything.
- [ ] Confirm the site is served over **HTTPS**. Session cookies are marked
      `secure` in production and will not be sent over plain HTTP.
- [ ] Remove the seeded demo shipments and clients once real data is in
      (`npm run db:reset` wipes everything, so only use it before real data exists).

## 2. Content confirmations from the copy deck — blocking

Every `[CONFIRM]` item in the deck is either a value in `lib/content/` carrying
the `CONFIRM` marker, or a section that stays **hidden** until its content is
filled in. Preview builds (`npm run dev`, or production with
`NEXT_PUBLIC_SHOW_CONFIRM_NOTES=true`) show a gold "Confirm before launch" box at
the exact spot on each page. Production never renders the marker or the boxes.

Find every marker with:

```bash
grep -rn "CONFIRM" lib/content/
```

**Contact details** (`lib/content/company.ts`)

- [ ] Almaty office full street address. Atyrau office full street address.
      Until confirmed the footer and Contact page show city and country only.
- [ ] Atyrau office telephone. Until confirmed "via main line +7 775 662 4455" is shown.
- [ ] Main email address (deck: `[email — CONFIRM]`). `operations@navigatorsealand.com`
      is published; change it if wrong.
- [ ] Department mailboxes `quotes@`, `projects@`, `operations@`, `careers@` — confirm
      they exist and are monitored. All four are published on the Contact page.
- [ ] Dedicated 24/7 desk number (deck: `[24/7 number — CONFIRM]`). The main
      line is published as the 24/7 number until then (`company.emergencyPhone`).
- [ ] LinkedIn company page and YouTube channel URLs (`company.social`). The
      "Follow" card appears once set.
- [ ] Google Maps embed URL per office (`offices[].mapEmbedUrl`) and Google
      Business Profiles for Almaty and Atyrau with the same name, address and phone.
- [ ] Company registration number and registered address (`company.registration`),
      used on the legal pages.

**Home page** (`lib/content/company.ts`)

- [ ] **Key figures counters** — years, countries served, tonnes moved, projects
      delivered, partner agents. Enter verified numbers in `keyFigures.items` and set
      `keyFigures.verified = true`. Hidden until then.
- [ ] **Testimonials** — collect 2–3 with name, title, company and permission
      (`testimonials`). Hidden until then.
- [ ] **Selected experience / case studies** — confirm which of the three published
      examples Navigator Sea Land Limited executed directly versus the team's
      previous-employer experience, and obtain written permission before naming
      any client. Cards are published anonymised as the deck words them
      (`lib/content/projects.ts`).

**About Us** (`lib/content/company.ts → about`)

- [ ] **Accreditations & memberships** — FIATA (via national association),
      National Freight Forwarders Association of Kazakhstan, ISO 9001, ISO 45001 &
      14001, heavy-lift networks (PCN / WCA Projects), Kazakhstan registration and
      forwarding licences. Set `held: true` and add a logo **only for those actually
      held**. The section and menu entry are hidden until at least one is held.
- [ ] **Agent & partner locations** list — remove any location without an active
      agent agreement (`about.network.rows`).
- [ ] **Leadership** — the deck's menu lists it but supplies no biographies. Add
      approved names, titles, bios and photos to `about.leadership`; the section and
      menu entry appear automatically.

**Services** (`lib/content/services.ts`)

- [ ] Heavy Haul — fleet wording. "Owned-partner and contracted fleet network" is
      published; add axle-line counts or SPMT capacities only when verified.
- [ ] Bulk Liquid — tank capacities are industry-typical ranges; adjust if partner
      equipment differs.
- [ ] Customs — if Navigator holds a customs representative licence, state the
      licence number; otherwise keep the published "coordinates… working with
      licensed customs representatives" wording.
- [ ] Warehousing — confirm facility locations, sizes, crane capacities and bonded
      status before publishing any figures. None are published.

**Corridors** (`lib/content/corridors.ts`)

- [ ] Transit-time ranges are **not** published. Validate them internally, then
      add them to the corridor blocks. Each page shows a "last reviewed" date
      (`reviewedOn`) — update it when you review the operational detail.

**Projects, Insights, Downloads**

- [ ] Case study pages — six recommended launch case studies are listed in
      `lib/content/projects.ts` with the deck's status. Publish a full
      Challenge → Solution → Result narrative only once executed and permitted.
- [ ] Project gallery — add operations photographs with descriptive alt text
      (`projectsLanding.gallery`). Hidden until then.
- [ ] Downloads — Company Profile (EN/RU), Heavy Haul Capability Statement, Bulk
      Liquid Solutions Sheet, Standard Trading Conditions, HSSE Policy. Set `href`
      in `lib/content/insights.ts → downloads` when each PDF exists; until then each
      is offered by email. The header "Company Profile" button links here.
- [ ] Insights articles — ten launch topics are listed as "in preparation". Add
      `href` and `publishedOn` when an article goes live.

**Imagery** — the deck asks for real operations photography and forbids generic
stock. None was supplied. Every `[IMG]` instruction is recorded in the content
modules as `hero.image.instruction` with suggested alt text; heroes use the
corridor-line graphic until photographs are added (`hero.image.src`). Industry
tiles and the project gallery are the next priorities.

**Languages** — RU and KZ are shown in the switcher as "in preparation" and are
not linked. When the translations exist, add the routes, set `available: true`
in `lib/content/navigation.ts` and add `hreflang` entries in `app/layout.tsx`.

## 3. Legal — blocking

- [ ] **Have a lawyer review `/privacy`, `/terms` and `/cookies`.** All three are
      drafts and say so on the page.
- [ ] **Terms section 5 is empty and must be completed**: identify the trading
      conditions you contract under and attach or link them. This is the document
      that limits your liability — the website terms do not.
- [ ] Complete the bracketed items in the privacy policy: hosting and email
      providers, international transfer mechanism, and retention periods.
- [ ] Update the cookie policy **before** adding GA4 or any other analytics or
      marketing tag, and add a consent mechanism first.
- [ ] Remove the yellow "Review required before publication" banners once counsel
      has signed off.

## 4. Supabase — blocking

- [ ] **Set both connection strings** — easiest with `npm run db:connect`.
      `DATABASE_URL` must be the transaction pooler (port 6543,
      `?pgbouncer=true&connection_limit=1`) and `DIRECT_URL` the direct connection
      (port 5432).
- [ ] **Run the migrations**: `npm run db:migrate`. This includes the API lockdown
      and the quote-form v2 migration (`QuoteAttachment` table, new quote fields).
- [ ] **Verify the API is closed**: `npm run db:check-rls` must pass.
- [ ] **Add `npm run db:check-rls` to CI.**
- [ ] Rotate the **database password** if it has ever been pasted into a chat,
      an issue, or a shared document.
- [ ] If attachments go to Supabase Storage, set `STORAGE_DRIVER=supabase` and
      `SUPABASE_SERVICE_ROLE_KEY`, then run `npm run supabase:setup`. Confirm the
      bucket is **private**. A bucket created before the quote form existed keeps
      its old 10 MB / five-type limits — raise them to 20 MB and add the XLSX, XLS
      and DOCX types in the Supabase dashboard, or quote attachments will fail.
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` has no `NEXT_PUBLIC_` prefix anywhere.
- [ ] Enable **Point-in-Time Recovery** on the Supabase project, or schedule dumps.

## 5. Infrastructure and SEO

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain. It is used in notification
      emails, the sitemap, canonical URLs and structured data.
- [ ] Configure **SMTP** and set `NOTIFY_EMAIL_ENABLED=true`. Until you do, clients
      receive no notifications and quote alerts are only logged.
- [ ] Set `NOTIFY_INTERNAL_INBOX` to a monitored address — quote requests
      (with attachments) and contact messages are alerted there.
- [ ] **Decide where attachments live.** `STORAGE_DRIVER=local` is wrong on a
      serverless host; use `supabase` there.
- [ ] Point a domain at the deployment and verify the TLS certificate.
- [ ] Submit `/sitemap.xml` to Google Search Console. Old URLs (`/about`,
      `/quote`, `/locations`) redirect permanently to the new ones.
- [ ] Add GA4 with conversion events on the quote form submission, WhatsApp and
      phone clicks (deck 11.2) — after the cookie policy and consent step above.
- [ ] Replace the drawn wordmark in `components/logo.tsx` with the official brand
      artwork, and `app/icon.svg` / `app/apple-icon.svg` with the real favicon.

## 6. Optional but worth doing

- [ ] **WhatsApp notifications.** Start the Meta Business verification early. The
      adapter is written and stubbed at `lib/notifications/channels/whatsapp.ts`.
- [ ] Decide your retention policy for tracking-form logs (deleted after 24 hours).
- [ ] Brief both operations staff using `docs/OPERATIONS-GUIDE.md`, including the
      new quote fields and attachments.

---

## Verify before you announce it

```bash
npm run typecheck     # no type errors
npm test              # 76 tests pass
npm run db:check-rls  # every table protected, no anon grants
npm run build         # production build succeeds, 44 routes
```

Then, on the live site:

1. Open every top-level page and check the gold "Confirm before launch" boxes are
   **absent** (they only appear on preview builds).
2. Search the rendered HTML of the home, contact and footer for `CONFIRM` — it must
   not appear.
3. Submit a quote request with an attachment and confirm the alert reaches your
   inbox and the file opens from the admin quotes page.
4. Track a real shipment with the Tracking ID alone — it must ask for the second
   field; with the wrong reference it must refuse; correctly it must show.
5. Visit `/admin` signed out — it must redirect to the login page.
6. Check `/about`, `/quote` and `/locations` redirect to the new pages.
7. With your anon key, confirm the API is closed:

   ```bash
   curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/Shipment?select=*" | head -c 200
   ```

   It must return a permission error, not data.
