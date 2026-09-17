# Navigator Sea Land — website, tracking portal and admin panel

**Date:** 2026-09-17 · **Status:** Built and verified

## Purpose

Two jobs, one application:

1. Present Navigator Sea Land's services, corridor expertise and track record to
   EPC contractors, energy and industrial project owners, and other forwarders.
2. Let existing clients check where their cargo is, without emailing operations.

A second trading site is planned separately and is out of scope.

## Decisions taken

| Question | Decision | Why |
|---|---|---|
| Stack | Next.js 15 + Prisma on Supabase Postgres | One deployable unit; a service layer that a CargoWise/GoFreight sync can sit behind later |
| Supabase scope | Postgres + Storage. Not Auth, not PostgREST | The existing session layer works and the audit trail hangs off it; PostgREST is closed at the database |
| Tracking access | Tracking ID **plus** consignee email or contract reference | Sequential IDs are guessable and project cargo carries commercial detail; no client accounts to administer |
| Notifications | Email live; WhatsApp and SMS as stubbed adapters | WhatsApp needs Meta verification and per-message template approval — days of external lead time that should not block launch |
| Site copy | Realistic draft, every unconfirmed fact tagged `[VERIFY]` | The site can be demonstrated immediately; nothing unverified can reach production unnoticed |

## Data model

`Shipment` (Tracking ID `NSL-YYYY-NNNN`, parties, route, cargo with OOG dimensions,
modes, corridors, contract and transport-document references, ETD/ETA, owner,
access flag, notification recipients, external-ref columns for a future ERP)
→ many `Checkpoint` (status, location, leg, timestamp, remarks, client-visible flag)
→ many `Attachment`.

Plus `Client`, `QuoteRequest`, `ShipmentEnquiry`, `User`, `NotificationLog`,
`AuditLog`, `RateLimit`.

Statuses are strings constrained in `lib/constants.ts` rather than native Postgres
enums, so rewording a label is a code change rather than a migration.

## Supabase

**The PostgREST API is locked off at the database.** Supabase exposes every
`public` table over PostgREST with the anon key, which is public by design. Tables
created through the dashboard get RLS by default; tables created by a Prisma
migration do not. A dedicated migration enables RLS on every table with no policies
and revokes all grants from `anon` and `authenticated`. Prisma connects as the table
owner and owners bypass RLS, so the application is untouched. `npm run db:check-rls`
fails the build if a later migration adds an unprotected table.

Demonstrated rather than assumed: a Prisma-created table with Supabase's default
grant returns its contents to the anon role; with RLS it returns zero rows; with
grants revoked it returns a permission error.

**Two connection strings.** The pooler (6543) for the app, a direct connection
(5432) for migrations. They are not interchangeable in either direction.

**Storage is a driver interface.** `local` (disk) and `supabase` (a private bucket)
behind one interface, selected by env, so development needs no Supabase project and
serverless needs no writable disk. Objects stream back through `/api/files` rather
than via signed URLs, keeping the internal-only check in the request path.

**Search needed an explicit `mode: "insensitive"`.** Postgres `LIKE` is
case-sensitive where SQLite's was not — a silent regression the provider switch
would otherwise have introduced.

## Status vocabulary

The ten operational stages were adopted as specified. Nine form an ordered happy
path; `Delayed` and `On Hold` are exceptions carrying no position of their own.

**The client timeline shows all nine stages**, marked done, current or upcoming, so
a client six weeks into a corridor movement can see how far through it is rather
than only where it is. Exceptions surface as a flag on the current stage with the
reason, not as a stage of their own — so a delayed shipment still reads as a line
from booking to delivery.

Corridor movements are not monotonic: road, border, road, border. `buildTimeline()`
therefore takes *current* from the shipment's own status — what operations assert —
and marks any stage with checkpoints against it as done, even where that stage sits
later in the sequence. The connector line runs to the furthest stage reached.

## Notifications

Five milestones notify: Booking Confirmed, In Transit, Delivered, Delayed, On Hold.
The other five update the timeline silently — a project movement generates dozens of
checkpoints and a client emailed about each stops reading them.

Every attempt writes a `NotificationLog` row, including sends suppressed because a
channel is off, so "was the client told, and when?" always has an answer. Dispatch
never throws: a mail server outage must not roll back a checkpoint that has already
happened.

## Security

- Tracking lookups rate limited 20 per 10 minutes per IP, database-backed so the
  limit survives a deploy and spans instances.
- Sessions are signed JWTs in an httpOnly cookie, re-checked against the database
  every request — deactivating an account signs the person out at once.
- Sign-in rate limited per IP *and* per account; one failure message regardless of
  cause, so the form cannot enumerate accounts.
- Three roles: ADMIN › OPERATOR › VIEWER. Export is available to all three;
  reporting is what a view-only account is for.
- Public forms carry honeypots and per-IP limits. `/admin` and `/api` are excluded
  from indexing.
- Every write is audited.

## Attachments

Loading photographs, permits and PODs attach to any checkpoint. Stored outside
`public/` and served through a route handler that checks the attachment record,
because `public/` would make the internal-only flag cosmetic — and because Next
resolves `public/` at server start, so a runtime upload is not served until a
restart.

Files default to internal-only. A checkpoint's own visibility takes precedence: an
attachment on an internal checkpoint never reaches the client however it is
flagged. Both directions are tested.

Local disk is the right storage for a VPS and wrong for serverless; the three
filesystem functions in `lib/uploads.ts` are the whole swap surface.

## PDF reports

A per-shipment A4 report at `/admin/shipments/<id>/print`, in client and internal
variants. The browser's "Save as PDF" produces the file — generating one
server-side would mean shipping a headless browser to render a page the browser
already renders correctly.

## Deliberate non-goals

- **No client login accounts.** Two staff should not be administering client
  credentials. The two-factor lookup gives most of the protection at none of the
  cost.
- **No CMS.** Copy lives in `lib/content.ts`. A CMS for a ten-page site with three
  staff is overhead, not leverage.
- **No server-side PDF rendering.** See above.

## Verification

- 51 tests over access control, timeline construction, status vocabulary,
  attachment visibility precedence, upload guards and validation — all passing
  against Postgres.
- RLS lockdown proven against a simulated `anon` role: readable before, zero rows
  with RLS, permission denied with grants revoked.
- Type check and production build clean.
- HTTP checks: all 15 public routes 200; every admin route redirects when signed
  out; export endpoints 401; all six tracking access-control paths behave correctly;
  rate limit engages at the 21st lookup; session revocation immediate; attachment
  route serves client-visible files anonymously, refuses internal ones without a
  session, and returns 404 for every traversal attempt.
- axe-core WCAG 2.1 AA across 16 pages: **0 violations**.
- No horizontal overflow and no console errors at 390px, 1024px and 1440px.

## Outstanding — see `docs/GO-LIVE-CHECKLIST.md`

Blocking: seeded passwords, `[VERIFY]` content, legal review of the privacy policy
and terms (including identifying the trading conditions), SMTP configuration,
PostgreSQL, backups.
