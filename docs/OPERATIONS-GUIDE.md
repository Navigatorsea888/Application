# Operations guide

How to run shipments through the Navigator Sea Land admin panel. Written for the
operations teams in Almaty, Atyrau and Mumbai. No technical knowledge assumed.

---

## Signing in

Go to **/admin** and sign in with the email and password an administrator gave you.
Sessions last 12 hours; after that you sign in again.

You have one of three levels of access:

| | What you can do |
|---|---|
| **Operations** | Create and edit shipments, add checkpoints, handle quotes and enquiries, export to Excel. This is what most staff have. |
| **Administrator** | All of the above, plus deleting shipments, managing staff accounts, and seeing the notification log and audit trail. |
| **View only** | Look at everything and export it. Change nothing. |

---

## Creating a shipment

**Shipments → New shipment.**

The Tracking ID is generated for you when you save — `NSL-2026-0001`, and so on,
counting up within the year. You cannot choose it and it never changes. It is what
the client uses to track.

Fill in what you know. Only these are required:

- Shipper company
- Consignee company
- Origin and destination city and country
- Cargo description
- At least one mode of transport
- Current status

Everything else can be added later. Two fields deserve attention:

**Contract / job reference.** Clients use this to open their shipment on the
tracking page, as an alternative to the consignee email. Put the reference the
client actually knows — the one on their purchase order — not an internal job
number they have never seen.

**Consignee email.** Same thing: it is the other key that opens the shipment, and
it is where milestone notifications go unless you set different recipients.

When you save, the system creates the first checkpoint automatically, so the client
sees something on the timeline immediately.

### Out-of-gauge cargo

Tick **Out of gauge / heavy lift** and the shipment is flagged throughout the admin
panel and on the client's timeline. The form will insist on at least one dimension —
that is deliberate. A permit application without dimensions goes nowhere, and an OOG
shipment recorded without them is a problem waiting for the day someone needs to
apply.

Use **OOG handling notes** for lifting points, centre of gravity, escort
requirements — anything the next person to touch the file needs.

---

## Updating a shipment — the daily work

Open the shipment and use **Add a checkpoint** on the right.

This is how the client's timeline moves. Nothing arrives automatically from a
carrier; every update is one you enter.

For each checkpoint:

- **Status reached** — the stage the cargo has got to.
- **Date and time** — when it actually happened, local time at that place. Not when
  you are typing it.
- **Location** — where. "Khorgos border crossing", not "border".
- **Leg** — which mode is in use. It puts the right icon on the client's timeline.
- **Remarks** — shown to the client. This is the most valuable field on the form.

Three switches sit at the bottom:

- **Visible to the client** — leave on. Turn it off to record something internal:
  a commercial note, a supplier problem, anything you want on file but not on the
  client's screen. Internal checkpoints never appear on the tracking page.
- **Set as the shipment's current status** — leave on, unless you are backfilling
  an old checkpoint you forgot to enter. Backfilling with this on would drag the
  status backwards.
- **Notify the client** — leave on. It only actually sends for the five milestone
  statuses, so ordinary checkpoints will not spam anyone.

### Writing remarks the client can use

The remark is what stops the phone ringing. Compare:

> Delayed.

> Sailing postponed 4 days — sustained force 6 winds at Alat. Revised departure
> confirmed with the barge operator for 14 Sept.

The second one answers the three questions the client was about to email you: what
happened, how long, and what you are doing about it.

### Delays and holds

Set the status to **Delayed** or **On Hold** and put the reason in the remarks. The
client sees an amber banner at the top of their tracking page with that reason, and
the shipment appears in the attention strip on the dashboard.

The timeline does not lose the shipment's progress when you do this — it stays at
the stage it had reached, with the delay flagged against it.

Set the status back to a normal stage when the movement resumes.

### Attaching photos and documents

Under each checkpoint there is **Attach photo or document**. Use it for loading
photographs, permits, survey reports and PODs — JPEG, PNG, WebP, HEIC or PDF, up to
10 MB each.

For out-of-gauge cargo this is worth the thirty seconds. A photograph of how a piece
was loaded and secured is the difference between a damage claim you can answer and
one you cannot.

**Files are internal by default.** Tick "Show to the client on the tracking page"
during upload, or click the **Internal** label on a file afterwards to release it.
The label reads **Client ✓** once it is visible to them.

Two things to know:

- A file on an **internal checkpoint** never reaches the client, even if the file
  itself is marked visible. The checkpoint decides.
- Deleting a file removes it permanently. There is no recycle bin.

---

## Printing a shipment report

**Print / PDF** at the top of a shipment produces an A4 report: letterhead,
consignment summary and the full movement record. Choose "Save as PDF" as the
destination in the print dialog to get a file you can email.

There are two versions, and the button on the report switches between them:

- **Client copy** — what you can send out. No B/L, CMR or AWB numbers, no internal
  notes, no internal-only checkpoints.
- **Internal copy** — everything, marked "Internal copy" at the top so nobody
  mistakes one for the other. Do not send this to a client.

Both are recorded in the audit log.

---

## Notifications

Clients are emailed automatically on five statuses only:

**Booking Confirmed · In Transit · Delivered · Delayed · On Hold**

Everything else — customs, border crossings, arrival at a hub — updates the timeline
silently. That is on purpose: a project movement generates dozens of checkpoints,
and a client who gets an email for each one stops reading them.

To tell a client something outside that, use **Notify client** at the top of the
shipment. It sends the current status to the configured recipients.

By default notifications go to the consignee email. To send to several people, put a
comma-separated list in **Notification emails** on the shipment.

> **If your administrator has not yet set up the mail server, no notifications are
> being sent to anyone.** The system records what it would have sent. An
> administrator can check this on the Notification log page, which shows whether
> each channel is live.

---

## Finding things

The search box on the Shipments page covers Tracking ID, consignee, shipper,
contract reference, project name, B/L, CMR, and phone numbers — so whatever the
client quotes at you on the phone will find the file.

The filters combine. "All corridors → Middle Corridor" plus "Anyone → Atyrau
Operations" gives one person's Middle Corridor shipments. The result is a normal
web address, so you can bookmark a view you use daily.

Two shortcuts on the status filter:

- **In transit (any leg)** — everything physically moving.
- **Pending departure** — booked but not yet moving. The chase list.

---

## Exporting to Excel

**Export Excel** on the Shipments page downloads what is currently on screen,
filters and all. Filter first, then export.

The quote requests page has its own export.

---

## Quote requests and enquiries

**Quote requests** are submissions from the public form. Move each one through New →
In review → Quoted → Won or Lost. Use the internal notes box for rate assumptions
and what is outstanding; it is never shown to the client.

**Enquiries** are messages from the tracking page and the contact form. Where a
client raised it from a shipment, the Tracking ID is shown and links straight to the
file. Mark them In progress and Resolved so your colleague does not answer the same
message twice.

Both show a count badge in the sidebar while anything is still New.

---

## What clients see

Open any shipment and click **Client view** to see exactly what the client sees.
Worth doing before you tell someone to go and look.

They see: status, the full stage timeline, route, cargo description, piece count and
weight, modes, corridor, ports, and estimated dates.

They do not see: B/L, CMR or AWB numbers, internal notes, your margin, other
parties' contact details, or any checkpoint you marked internal.

### If a client wants a shareable link

Normally tracking needs the Tracking ID plus the consignee email or contract
reference. If a client wants to forward a link to a site team who have neither, edit
the shipment and tick **Allow tracking with the Tracking ID alone**.

Do this only when asked. It removes the check for that shipment, and anyone who
guesses the reference can then see it.

---

## Things that are easy to get wrong

**Entering the time you typed it rather than the time it happened.** The timeline is
a record. Put the real time.

**Leaving a delay without a reason.** The client sees "Delayed" and immediately
emails you. Thirty seconds writing the reason saves that.

**Turning on public access and forgetting.** It stays on until someone turns it off.

**Backfilling a checkpoint with "set as current status" left on.** It drags the
shipment's status backwards. Untick it when adding something historic.

**Deleting a shipment to "clean up".** Administrators only, and it takes the whole
checkpoint history with it. If a shipment was cancelled, set it to On Hold with a
remark instead.
