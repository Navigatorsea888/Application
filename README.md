# Navigator Sea Land Limited — website, tracking portal & admin panel

Corporate website, client shipment-tracking portal, and operations admin panel for a
project freight forwarder working the Central Asian, Caspian, China Land Bridge,
Middle Corridor (TITR) and INSTC routes.

---

## Quick start

```bash
npm install
cp .env.example .env          # then set SUPABASE_URL, the keys and SESSION_SECRET
npm run db:connect            # asks for the database password, writes both URLs
npm run setup                 # generate client, run migrations, seed demo data
npm run supabase:setup        # create the Storage bucket, verify configuration
npm run dev                   # http://localhost:3000
```

`db:connect` finds the project's region, URL-encodes the password, and writes
`DATABASE_URL` and `DIRECT_URL` with the right host and port for each. The password
is read with echo off, never passed in argv, and never logged. It checks the
connection before writing, so a wrong password changes nothing.

Generate a session secret:

```bash
openssl rand -base64 48
```

Paste it into `SESSION_SECRET`. The app refuses to start a session without one of
at least 32 characters — that is deliberate, not a bug.

### The database target is enforced

`lib/db.ts` refuses to start when `DATABASE_URL` still holds a placeholder, and
refuses to start against a local Postgres when `NODE_ENV=production`. Outside
production a local database is allowed but prints a loud warning on every boot,
because shipment records quietly accumulating on a laptop is worse than an outage —
nobody notices until the laptop is gone.

### Supabase connection strings

Two are required and they are **not** interchangeable. Both are in the Supabase
dashboard under **Connect → ORMs → Prisma**.

| | Port | Used by | Why |
|---|---|---|---|
| `DATABASE_URL` | 6543 | the application | Transaction pooler. Serverless opens a connection per invocation and would exhaust Postgres' direct limit within minutes. Needs `?pgbouncer=true&connection_limit=1` |
| `DIRECT_URL` | 5432 | Prisma Migrate | Migrations need advisory locks and prepared statements a transaction pooler does not support |

Replace `[YOUR-PASSWORD]` with the database password from **Settings → Database**,
URL-encoded if it contains `@ : / ? # [ ] %`.

### Seeded logins

| Email | Password | Role |
|---|---|---|
| `admin@navigatorsealand.com` | `ChangeMe!2026` | Administrator |
| `operations.almaty@navigatorsealand.com` | `Operations!2026` | Operations |
| `operations.atyrau@navigatorsealand.com` | `Operations!2026` | Operations |

**Change these before the site is reachable from the internet.** They are in the
repository.

### Try it

- Sign in at <http://localhost:3000/admin/login>
- Track `NSL-2026-0001` with `TSP-2026-114` (or the consignee email)
- Track `NSL-2026-0007` — public access is on, so the Tracking ID alone works
- `NSL-2026-0002` is delayed; `NSL-2026-0006` is on hold — both show the reason

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs `prisma generate` first) |
| `npm start` | Serve the production build |
| `npm test` | Test suite — 51 tests over access control, timeline, uploads and validation |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run setup` | Generate client, run migrations, seed |
| `npm run db:migrate` | Apply pending migrations (`prisma migrate deploy`) |
| `npm run db:seed` | Seed demo data (safe to re-run; it will not duplicate) |
| `npm run db:reset` | **Destroys the database**, recreates and reseeds |
| `npm run db:studio` | Prisma Studio, a GUI over the data |
| `npm run db:check-rls` | **Fails if any table lacks row-level security.** Run in CI |
| `npm run supabase:setup` | Create the Storage bucket and verify configuration |
| `npm run db:connect` | Point `.env` at Supabase — prompts for the database password |

---

## Architecture

```
app/
  (site)/          Public marketing site and /track
  admin/
    login/         Unguarded
    (panel)/       Everything behind the session guard
  api/admin/export Excel endpoints
components/        Shared UI; components/admin/ for panel-only
lib/
  constants.ts     Status vocabulary, roles, modes, corridors
  shipments.ts     Service layer — the only module that queries shipments
  auth.ts          Session cookie, password hashing, role checks
  validation.ts    Zod schemas for every form
  notifications/   Channel interface + email / WhatsApp / SMS adapters
  content.ts       All site copy
prisma/            Schema and seed
tests/             Test suite
```

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Prisma ·
**Supabase** (Postgres + Storage) · Zod · ExcelJS · Nodemailer. No UI component
library — the design system is about 200 lines of tokens in `app/globals.css` plus
the primitives in `components/ui.tsx`.

### Supabase: what is and is not used

| | |
|---|---|
| **Postgres** | Yes — through Prisma, over the transaction pooler |
| **Storage** | Yes — a private bucket, when `STORAGE_DRIVER=supabase` |
| **Auth** | **No.** Staff sign-in is the app's own session layer |
| **PostgREST / anon key** | **No, and deliberately locked off** — see below |
| **Realtime, Edge Functions** | No |

Supabase Auth is not used because the existing login already works, is tested, and
every `Checkpoint` and `AuditLog` row hangs off a `User` record. Replacing it for
three staff accounts would mean rebuilding sessions, roles and the audit trail for
no gain. The anon key is present in `.env` but nothing reads it.

### Decisions worth knowing

**The PostgREST API is locked off at the database.** This is the single most
important thing to understand about running Prisma on Supabase. Supabase exposes
every table in the `public` schema over PostgREST, reachable with the anon key —
which is public by design and meant for browsers. Tables created through the
Supabase dashboard get row-level security by default; **tables created by a Prisma
migration do not.** Left alone, anyone with the anon key could read the shipment
register, every client contact and the staff password hashes.

`prisma/migrations/*_lock_down_public_api/` enables RLS on every table with no
policies and revokes all grants from `anon` and `authenticated`. Prisma connects as
the table owner, and owners bypass RLS, so the application is unaffected.

**A new table needs the same treatment.** `npm run db:check-rls` fails if any table
in `public` is unprotected — run it in CI and before deploying.

**Statuses are strings, not database enums.** Native enums make every label change
a migration. The vocabulary lives in `lib/constants.ts` instead.

**Free-text search specifies `mode: "insensitive"`.** Postgres `LIKE` is
case-sensitive where SQLite's was not; without this, searching "tien shan" would
silently miss "Tien Shan". The corridor filter is exact-case on purpose — it
matches a stored key from a fixed select, not free text.

**Checkpoints are the source of truth for the timeline; `Shipment.status` is the
position of record.** Where they disagree — which happens on corridor movements that
cross a border, continue by road, and cross another — the timeline marks the
shipment's own status as current and shows stages with checkpoints against them as
done. `buildTimeline()` in `lib/shipments.ts`.

**Notifications never fail an operation.** Every send is wrapped, and every attempt
writes a `NotificationLog` row, including sends suppressed because a channel is off.
A mail server outage cannot roll back a checkpoint that has already happened.

**Routes do not query shipments directly.** They go through `lib/shipments.ts`. That
is what makes a later ERP integration one file rather than a rewrite.

**Attachments are stored outside `public/` and served through `/api/files/...`.**
Two reasons: Next resolves `public/` when the server starts, so a file written at
runtime is not served until a restart; and anything under `public/` is readable by
anyone holding the URL, which would make the internal-only flag on an attachment
cosmetic. The route handler checks the attachment record instead.

---

## Configuration

All settings live in `.env` — see `.env.example` for the annotated list.

| Variable | Notes |
|---|---|
| `DATABASE_URL` | `file:./dev.db` locally; a PostgreSQL URL in production |
| `SESSION_SECRET` | **Required.** At least 32 characters |
| `SESSION_MAX_AGE_HOURS` | Default 12 |
| `NEXT_PUBLIC_SITE_URL` | Used in emails and the sitemap. Must be the real domain in production |
| `NOTIFY_EMAIL_ENABLED` | `false` logs notifications without sending them |
| `SMTP_*` | Mail server credentials |
| `NOTIFY_INTERNAL_INBOX` | Receives quote requests and enquiries |
| `NOTIFY_WHATSAPP_ENABLED` | Leave `false` — the adapter is a stub, see below |
| `UPLOAD_DIR` | Where checkpoint attachments are stored. Defaults to `./storage/uploads` |

### Turning on email

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` and
`NOTIFY_EMAIL_ENABLED=true`. Until then the app runs in log-only mode: it records
what it *would* have sent in the notification log, visible at
`/admin/notifications`, and clients receive nothing.

Notifications fire on milestones only — Booking Confirmed, In Transit, Delivered,
Delayed, On Hold — not on every checkpoint. Change `isMilestone` in
`lib/constants.ts` to adjust.

### Checkpoint attachments

Operations can attach loading photographs, permits and PODs to any checkpoint —
JPEG, PNG, WebP, HEIC or PDF, up to 10 MB each. Files default to **internal only**
and are released to the client explicitly, because documents on a project movement
usually carry commercial detail.

A checkpoint's own visibility takes precedence: an attachment on an internal
checkpoint never reaches the client however it is flagged.

Where the bytes live is decided by `STORAGE_DRIVER`:

- **`local`** — files on disk at `UPLOAD_DIR` (default `storage/uploads`). Correct
  for a VPS or a container with a persistent volume, and the default in
  development and tests.
- **`supabase`** — a **private** Supabase Storage bucket. Required on a serverless
  host, whose filesystem is ephemeral and per-instance. Needs
  `SUPABASE_SERVICE_ROLE_KEY`; `npm run supabase:setup` creates the bucket, and
  refuses to leave it public.

Both implement one interface in `lib/storage/`, so swapping is an env change.

Objects are streamed back through `/api/files/...` rather than handed out as signed
storage URLs, so the internal-only check runs on every fetch. A signed URL is
checked once and is then forwardable by anyone holding it — the wrong shape for a
document marked internal.

### PDF reports

Each shipment has a **Print / PDF** report at
`/admin/shipments/<id>/print`, laid out for A4 with a letterhead, consignment
summary and full movement record. Choosing "Save as PDF" in the browser's print
dialog produces the PDF — generating one server-side would mean shipping a headless
browser to render a page the browser already renders correctly.

Two variants: the **client copy** excludes transport document numbers, internal
notes and internal-only checkpoints; the **internal copy** (`?internal=1`) includes
them and is watermarked as such. Both are recorded in the audit log.

### Turning on WhatsApp

`lib/notifications/channels/whatsapp.ts` is a working stub with the Cloud API call
written out in a comment. Before it can send you need a Meta Business account, a
registered sender number, and **approved message templates** — WhatsApp does not
allow free-form business-initiated messages outside a 24-hour service window, so
each milestone needs its own template. Expect days of external lead time. SMS is the
same shape in `channels/sms.ts`.

---

## Security model

- **Tracking** requires the Tracking ID *and* the consignee email or contract
  reference, unless a shipment is explicitly opened for public viewing. Lookups are
  rate limited to 20 per 10 minutes per IP to stop reference numbers being
  enumerated.
- **Sessions** are signed JWTs in an httpOnly cookie, re-checked against the
  database on every request — so deactivating an account signs the person out
  immediately rather than at token expiry.
- **Passwords** are bcrypt at cost 12. Sign-in is rate limited per IP *and* per
  account, and failures return one message regardless of cause, so the form cannot
  be used to discover which addresses have accounts.
- **Roles**: `ADMIN` (everything, including deleting shipments and managing
  accounts) › `OPERATOR` (create and edit shipments, checkpoints, quotes) ›
  `VIEWER` (read and export only).
- **Public forms** carry honeypot fields and per-IP rate limits.
- **The Supabase PostgREST API is closed.** RLS on every table with no policies,
  and no grants for `anon` or `authenticated`. Guarded by `npm run db:check-rls`.
- **`/admin` and `/api` are excluded from `robots.txt`** and carry
  `noindex, nofollow`.
- Every write is recorded in `AuditLog`, visible to administrators at
  `/admin/users`.

Deactivate accounts rather than deleting them — deletion would orphan the audit
trail and the authorship of every checkpoint the person recorded.

---

## Accessibility

Audited with axe-core against WCAG 2.1 A and AA across all 16 pages: **0
violations**. Contrast, visible focus rings, label association, keyboard operation
and `prefers-reduced-motion` are all covered. Re-check after design changes — the
form primitives in `components/form-fields.tsx` are what keep labels wired to their
controls, so use them rather than raw `<input>` elements.

---

## Before going live

See **[docs/GO-LIVE-CHECKLIST.md](docs/GO-LIVE-CHECKLIST.md)**. It is not optional:
the site currently contains placeholder copy marked `[VERIFY]`, draft legal pages
that need a lawyer, and seeded passwords that are published in this README.

For day-to-day use of the admin panel, see
**[docs/OPERATIONS-GUIDE.md](docs/OPERATIONS-GUIDE.md)**.
