# Go-live checklist

Work through this before the site is reachable from the internet. Items marked
**blocking** would cause real harm if skipped — a wrong factual claim, a legal
exposure, or an account anyone can sign into.

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

## 2. Content — blocking

Every placeholder is tagged `[VERIFY]` in `lib/content.ts`. Find them with:

```bash
grep -n "VERIFY" lib/content.ts
```

- [ ] **Company details** — registration number, year established, main phone.
- [ ] **Office addresses and phone numbers** for Almaty, Atyrau and Mumbai.
- [ ] **Corridor transit times** — five placeholders. Give real indicative figures
      or delete the line; an invented transit time is a commercial claim.
- [ ] **Case studies** (`projects`) — three placeholder projects, every field a
      placeholder. Replace with real movements, **and obtain written client consent
      before naming any project, site or company.** If you have no consent yet,
      describe the movements without naming the client.
- [ ] **FAQ** — two answers need your input: standard quote turnaround time, and
      your insurance and liability position.
- [ ] Replace the drawn wordmark in `components/logo.tsx` with the official brand
      artwork, and `app/icon.svg` / `app/apple-icon.svg` with the real favicon.
- [ ] Add real photography. The site currently uses none — which looks deliberate
      and clean, but project cargo photographs are your strongest sales asset.

## 3. Legal — blocking

- [ ] **Have a lawyer review `/privacy` and `/terms`.** Both are drafts and say so
      on the page. They have not been checked against the Kazakh Personal Data Law,
      India's DPDP Act, or the GDPR.
- [ ] **Terms section 5 is empty and must be completed**: identify the trading
      conditions you contract under (a national forwarders' association standard,
      FIATA model rules, or your own) and attach or link them. This is the document
      that limits your liability — the website terms do not.
- [ ] Complete the bracketed items in the privacy policy: hosting and email
      providers, international transfer mechanism, and retention periods.
- [ ] Remove the yellow "Review required before publication" banners from both
      pages once counsel has signed off (`app/(site)/privacy/page.tsx` and
      `terms/page.tsx`).

## 4. Supabase — blocking

- [ ] **Set both connection strings** — easiest with `npm run db:connect`, which
      asks for the database password and writes both correctly. Doing it by hand:
      `DATABASE_URL` must be the transaction pooler (port 6543,
      `?pgbouncer=true&connection_limit=1`) and `DIRECT_URL` the direct connection
      (port 5432). Using the direct URL for the application will exhaust Postgres'
      connection limit under load; using the pooler for migrations fails outright.
      Both are under **Connect → ORMs → Prisma**.
- [ ] **Run the migrations**: `npm run db:migrate`. This includes the API lockdown.
- [ ] **Verify the API is closed**: `npm run db:check-rls` must pass. Without it,
      anyone holding your anon key — which is public by design — can read the
      shipment register, client contacts and staff password hashes over PostgREST.
      This is the single most dangerous default in a Prisma-on-Supabase setup.
- [ ] **Add `npm run db:check-rls` to CI.** Prisma does not enable RLS on tables it
      creates, so the next migration that adds a table will expose it unless
      someone remembers. The check is there so nobody has to.
- [ ] Rotate the **database password** if it has ever been pasted into a chat,
      an issue, or a shared document.
- [ ] If attachments are going to Supabase Storage, set `STORAGE_DRIVER=supabase`
      and `SUPABASE_SERVICE_ROLE_KEY`, then run `npm run supabase:setup`. Confirm
      the bucket reports as **private**.
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is set only in server-side environment
      configuration and has no `NEXT_PUBLIC_` prefix anywhere. It bypasses RLS
      completely.
- [ ] Enable **Point-in-Time Recovery** on the Supabase project, or schedule
      dumps. The shipment register and its audit trail are business records.

## 5. Infrastructure

- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain. It is used in notification
      emails and the sitemap; leaving it as `localhost` sends clients broken links.
- [ ] Configure **SMTP** and set `NOTIFY_EMAIL_ENABLED=true`. Until you do, clients
      receive no notifications at all — the system only logs what it would have
      sent. Check `/admin/notifications`, which shows the live status of each
      channel.
- [ ] Set `NOTIFY_INTERNAL_INBOX` to a monitored address. Quote requests and
      enquiries are stored in the admin panel regardless, but nobody is alerted
      without this.
- [ ] **Decide where checkpoint attachments live.** `STORAGE_DRIVER=local` writes
      to disk, which is correct on a VPS or container with a persistent volume and
      **wrong on a serverless host** — on Vercel or Netlify the filesystem is
      ephemeral and uploaded photos disappear on the next deploy. Use
      `STORAGE_DRIVER=supabase` there. If you stay on local disk, back that
      directory up alongside the database.
- [ ] Point a domain at the deployment and verify the TLS certificate.

## 6. Optional but worth doing

- [ ] **WhatsApp notifications.** Start the Meta Business verification early — it
      takes days, and each milestone message needs its own approved template. The
      adapter is written and stubbed at
      `lib/notifications/channels/whatsapp.ts`.
- [ ] Submit the sitemap (`/sitemap.xml`) to Google Search Console.
- [ ] Decide your retention policy for tracking-form logs. The system deletes them
      after 24 hours automatically.
- [ ] Brief both operations staff using `docs/OPERATIONS-GUIDE.md`.

---

## Verify before you announce it

```bash
npm run typecheck     # no type errors
npm test              # 51 tests pass
npm run db:check-rls  # every table protected, no anon grants
npm run supabase:setup  # connection strings, RLS and Storage all report ✓
npm run build         # production build succeeds
```

Then, on the live site:

1. Track a real shipment with the Tracking ID alone — it must ask for the second
   field.
2. Track it with the wrong reference — it must refuse.
3. Track it correctly — the timeline must show.
4. Visit `/admin` signed out — it must redirect to the login page.
5. Submit a quote request and confirm the alert reaches your inbox.
6. Export the shipment register to Excel and open it.
7. Search the admin shipment list in lower case for something stored in title case
   — it must still match.
8. With your anon key, confirm the API is closed:

   ```bash
   curl -s -H "apikey: $SUPABASE_ANON_KEY" \
        "$SUPABASE_URL/rest/v1/Shipment?select=*" | head -c 200
   ```

   It must return a permission error, not data.
