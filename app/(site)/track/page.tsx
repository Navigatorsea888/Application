import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Alert, Card, DataRow, Pill, StatusBadge } from "@/components/ui";
import { PageHero } from "@/components/page-hero";
import { TrackingTimeline } from "@/components/tracking-timeline";
import { EnquiryForm } from "@/components/enquiry-form";
import { IconAlert, IconPackage, IconSearch, MODE_ICONS } from "@/components/icons";
import { buildTimeline, lookupShipment } from "@/lib/shipments";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { CORRIDORS, MODES, parseList } from "@/lib/constants";
import { formatDate, formatRoute, formatWeight } from "@/lib/format";

export const metadata: Metadata = {
  title: "Track Shipment",
  description:
    "Track a Navigator Sea Land shipment. Enter your Tracking ID with the consignee email or contract reference to see the full checkpoint timeline.",
  robots: { index: true, follow: true },
};

// Results depend on request data, so this page is never statically cached.
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ id?: string; v?: string }>;
}

export default async function TrackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const trackingId = params.id?.trim() ?? "";
  const verification = params.v?.trim() ?? "";

  let result: Awaited<ReturnType<typeof lookupShipment>> | null = null;
  let rateLimited: { retryAfterSeconds: number } | null = null;

  if (trackingId) {
    // The tracking form is the only public surface that exposes shipment data,
    // so lookups are throttled per IP to stop Tracking IDs being enumerated.
    const ip = clientIp(await headers());
    const limit = await checkRateLimit(`track:${ip}`, 20, 600);
    if (limit.allowed) result = await lookupShipment(trackingId, verification || null);
    else rateLimited = { retryAfterSeconds: limit.retryAfterSeconds };
  }

  return (
    <>
      <PageHero
        eyebrow="Track shipment"
        title="Where is my cargo?"
        lead="Enter your Tracking ID and the consignee email address or contract reference for the shipment."
      />

      <div className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <TrackForm trackingId={trackingId} verification={verification} />

          {rateLimited ? (
            <div className="mt-8">
              <Alert tone="warning" title="Too many lookups">
                You have made a lot of tracking requests in a short time. Please wait about{" "}
                {Math.ceil(rateLimited.retryAfterSeconds / 60)} minutes and try again, or contact your Navigator
                Sea Land representative.
              </Alert>
            </div>
          ) : null}

          {result ? (
            <div className="mt-8">
              <TrackResult result={result} trackingId={trackingId} />
            </div>
          ) : null}

          {!trackingId && !rateLimited ? <TrackHelp /> : null}
        </div>
      </div>
    </>
  );
}

function TrackForm({ trackingId, verification }: { trackingId: string; verification: string }) {
  return (
    <Card className="p-6 sm:p-7">
      {/* GET keeps results linkable and shareable, and works without JS. */}
      <form method="get" action="/track" className="space-y-4">
        <div>
          <label htmlFor="id" className="block font-[family-name:var(--font-display)] text-sm font-medium text-ink-800">
            Tracking ID <span className="text-danger-600">*</span>
          </label>
          <p className="mt-0.5 text-xs text-ink-500">Shown on your booking confirmation, e.g. NSL-2026-0001.</p>
          <div className="relative mt-1.5">
            <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
            <input
              id="id"
              name="id"
              type="text"
              required
              defaultValue={trackingId}
              autoComplete="off"
              spellCheck={false}
              placeholder="NSL-2026-0001"
              className="h-12 w-full rounded-md border border-ink-300 bg-white pl-10 pr-3 font-[family-name:var(--font-mono)] text-[0.9375rem] uppercase tracking-wide text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600 placeholder:font-[family-name:var(--font-sans)] placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="v" className="block font-[family-name:var(--font-display)] text-sm font-medium text-ink-800">
            Consignee email or contract reference
          </label>
          <p className="mt-0.5 text-xs text-ink-500">
            Required unless the shipment has been opened for public viewing at the client&rsquo;s request.
          </p>
          <input
            id="v"
            name="v"
            type="text"
            defaultValue={verification}
            autoComplete="off"
            placeholder="name@company.com  or  CONTRACT-REF"
            className="mt-1.5 h-12 w-full rounded-md border border-ink-300 bg-white px-3 text-[0.9375rem] text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600 placeholder:text-ink-400"
          />
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-accent-600 px-6 font-[family-name:var(--font-display)] font-medium text-white transition-colors duration-150 hover:bg-accent-700 sm:w-auto"
        >
          <IconSearch className="size-4" />
          Track shipment
        </button>
      </form>
    </Card>
  );
}

function TrackHelp() {
  return (
    <div className="mt-10 grid gap-5 sm:grid-cols-2">
      <Card className="p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">
          Do not have your Tracking ID?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          It is issued when a booking is confirmed and appears on your booking confirmation in the format
          NSL-YYYY-NNNN. Your Navigator Sea Land contact can reissue it.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
        >
          Contact us
        </Link>
      </Card>
      <Card className="p-6">
        <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">
          Why the second field?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Project cargo records carry commercial information. Requiring the consignee email or contract reference
          keeps a shipment from being opened by anyone who guesses a reference number.
        </p>
        <Link
          href="/faq"
          className="mt-4 inline-block text-sm font-medium text-accent-600 underline underline-offset-2 hover:text-accent-700"
        >
          Read the FAQ
        </Link>
      </Card>
    </div>
  );
}

function TrackResult({
  result,
  trackingId,
}: {
  result: Awaited<ReturnType<typeof lookupShipment>>;
  trackingId: string;
}) {
  if (result.outcome === "NOT_FOUND") {
    return (
      <Alert tone="error" title="No shipment found">
        We could not find a shipment with Tracking ID <strong>{trackingId.toUpperCase()}</strong>. Check the
        reference against your booking confirmation — it should look like NSL-2026-0001. If it is correct, please{" "}
        <Link href="/contact" className="underline underline-offset-2">
          contact us
        </Link>
        .
      </Alert>
    );
  }

  if (result.outcome === "VERIFICATION_REQUIRED") {
    return (
      <Alert tone="info" title="One more detail needed">
        This shipment is protected. Enter the consignee email address or the contract reference in the second
        field above to view it.
      </Alert>
    );
  }

  if (result.outcome === "VERIFICATION_FAILED") {
    return (
      <Alert tone="warning" title="That reference does not match">
        The Tracking ID is valid, but the email address or contract reference you entered does not match our
        record for this shipment. Check the spelling, or ask your Navigator Sea Land contact which reference to
        use.
      </Alert>
    );
  }

  const shipment = result.shipment;
  const timeline = buildTimeline(shipment);
  const modes = parseList(shipment.modes);
  const corridors = parseList(shipment.corridors);

  return (
    <div className="space-y-8">
      {/* Summary */}
      <Card className="overflow-hidden">
        <div className="border-b border-ink-200 bg-ink-900 px-6 py-5 sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-[family-name:var(--font-mono)] text-xl tracking-wide text-white">
                {shipment.trackingId}
              </p>
              <p className="mt-1 text-sm text-ink-400">
                {formatRoute(
                  shipment.originCity,
                  shipment.originCountry,
                  shipment.destinationCity,
                  shipment.destinationCountry,
                )}
              </p>
            </div>
            <StatusBadge status={shipment.status} />
          </div>
        </div>

        {timeline.isException && shipment.exceptionNote ? (
          <div className="flex gap-3 border-b border-signal-500/30 bg-signal-50 px-6 py-4 sm:px-7">
            <IconAlert className="mt-0.5 size-5 shrink-0 text-signal-600" />
            <div>
              <p className="font-medium text-signal-700">{timeline.exceptionLabel}</p>
              <p className="mt-0.5 text-sm text-signal-700">{shipment.exceptionNote}</p>
            </div>
          </div>
        ) : null}

        <div className="px-6 py-2 sm:px-7">
          <dl>
            <DataRow label="Consignee">{shipment.consigneeName}</DataRow>
            {shipment.contractRef ? <DataRow label="Contract reference">{shipment.contractRef}</DataRow> : null}
            {shipment.projectName ? <DataRow label="Project">{shipment.projectName}</DataRow> : null}
            <DataRow label="Cargo">
              <div className="flex flex-wrap items-center gap-2">
                <span>{shipment.cargoDescription}</span>
                {shipment.isOOG ? <Pill tone="signal">Out of gauge</Pill> : null}
              </div>
              {shipment.packageCount ? (
                <p className="mt-1 text-sm text-ink-500">
                  {shipment.packageCount} {shipment.packageType ?? "package(s)"}
                  {shipment.weightKg ? ` · ${formatWeight(shipment.weightKg)}` : ""}
                </p>
              ) : null}
            </DataRow>
            <DataRow label="Transport">
              <div className="flex flex-wrap gap-1.5">
                {modes.map((mode) => {
                  const Icon = MODE_ICONS[mode as keyof typeof MODE_ICONS];
                  return (
                    <Pill key={mode}>
                      {Icon ? <Icon className="size-3.5" /> : null}
                      {MODES[mode as keyof typeof MODES] ?? mode}
                    </Pill>
                  );
                })}
              </div>
            </DataRow>
            {corridors.length ? (
              <DataRow label="Corridor">
                <div className="flex flex-wrap gap-1.5">
                  {corridors.map((corridor) => (
                    <Pill key={corridor} tone="accent">
                      {CORRIDORS[corridor as keyof typeof CORRIDORS] ?? corridor}
                    </Pill>
                  ))}
                </div>
              </DataRow>
            ) : null}
            {shipment.portOfLoading || shipment.portOfDischarge ? (
              <DataRow label="Ports">
                {shipment.portOfLoading ?? "—"} → {shipment.portOfDischarge ?? "—"}
              </DataRow>
            ) : null}
            <DataRow label="Estimated departure">{formatDate(shipment.etd)}</DataRow>
            <DataRow label={shipment.actualDelivery ? "Delivered" : "Estimated delivery"}>
              <span className={shipment.actualDelivery ? "font-medium text-success-700" : ""}>
                {formatDate(shipment.actualDelivery ?? shipment.eta)}
              </span>
              {!shipment.actualDelivery && shipment.eta ? (
                <p className="mt-1 text-xs leading-relaxed text-ink-500">
                  An estimate. Multimodal cross-border movements are subject to ferry and vessel schedules, wagon
                  allocation, border processing and customs clearance.
                </p>
              ) : null}
            </DataRow>
          </dl>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6 sm:p-7">
        <h2 className="flex items-center gap-2 font-[family-name:var(--font-display)] text-lg font-semibold">
          <IconPackage className="size-5 text-accent-600" />
          Shipment timeline
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Every stage of the movement. Checkpoints are recorded by our operations team as information is confirmed.
        </p>
        <div className="mt-7">
          <TrackingTimeline
            stages={timeline.stages}
            isException={timeline.isException}
            exceptionLabel={timeline.exceptionLabel}
            exceptionNote={shipment.exceptionNote}
          />
        </div>
      </Card>

      {/* Enquiry */}
      <Card className="p-6 sm:p-7">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold">
          Contact us about this shipment
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Your message reaches the operations team handling {shipment.trackingId} directly.
        </p>
        <div className="mt-6">
          <EnquiryForm trackingRef={shipment.trackingId} />
        </div>
      </Card>
    </div>
  );
}
