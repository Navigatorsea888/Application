import type { Metadata } from "next";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ButtonLink, Card, EmptyState, Pill } from "@/components/ui";
import { IconDownload } from "@/components/icons";
import { prisma } from "@/lib/db";
import { canWrite, getSessionUser } from "@/lib/auth";
import { setQuoteStatus, saveQuoteNotes } from "../pipeline-actions";
import { MODES, QUOTE_STATUSES, parseList } from "@/lib/constants";
import { formatDate, formatDateTime, formatDimensions, formatWeight } from "@/lib/format";

export const metadata: Metadata = { title: "Quote requests" };
export const dynamic = "force-dynamic";

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = params.status && params.status !== "ALL" ? params.status : undefined;

  const [user, quotes] = await Promise.all([
    getSessionUser(),
    prisma.quoteRequest.findMany({
      where: filter ? { status: filter } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
  ]);

  const writable = canWrite(user);

  return (
    <>
      <AdminPageHeader
        title="Quote requests"
        description={`${quotes.length} request${quotes.length === 1 ? "" : "s"}${filter ? ` with status ${QUOTE_STATUSES[filter as keyof typeof QUOTE_STATUSES] ?? filter}` : ""}`}
        actions={
          <ButtonLink href="/api/admin/export/quotes" variant="secondary" size="sm">
            <IconDownload className="size-4" />
            Export Excel
          </ButtonLink>
        }
      />

      <div className="space-y-5 p-5 sm:p-8">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <FilterChip href="/admin/quotes" label="All" active={!filter} />
          {Object.entries(QUOTE_STATUSES).map(([key, label]) => (
            <FilterChip key={key} href={`/admin/quotes?status=${key}`} label={label} active={filter === key} />
          ))}
        </nav>

        {quotes.length === 0 ? (
          <EmptyState
            title="No quote requests"
            description="Submissions from the public Request a Quote form appear here."
          />
        ) : (
          <div className="space-y-4">
            {quotes.map((quote) => {
              const statusAction = setQuoteStatus.bind(null, quote.id);
              const notesAction = saveQuoteNotes.bind(null, quote.id);
              const modes = parseList(quote.preferredModes);

              return (
                <Card key={quote.id} className="overflow-hidden">
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-200 bg-ink-50 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-[family-name:var(--font-mono)] font-medium text-ink-900">
                          {quote.reference}
                        </span>
                        {quote.isOOG ? <Pill tone="signal">OOG</Pill> : null}
                        <span className="text-xs text-ink-500">{formatDateTime(quote.createdAt)}</span>
                      </div>
                      <p className="mt-1 font-[family-name:var(--font-display)] font-semibold text-ink-900">
                        {quote.companyName}
                      </p>
                      <p className="text-sm text-ink-600">
                        {quote.contactPerson} ·{" "}
                        <a href={`mailto:${quote.email}`} className="text-accent-600 underline underline-offset-2">
                          {quote.email}
                        </a>
                        {quote.phone ? ` · ${quote.phone}` : ""}
                      </p>
                    </div>

                    {writable ? (
                      <form action={statusAction} className="flex items-center gap-2">
                        <label htmlFor={`status-${quote.id}`} className="sr-only">
                          Status
                        </label>
                        <select
                          id={`status-${quote.id}`}
                          name="status"
                          defaultValue={quote.status}
                          className="h-9 cursor-pointer rounded-md border border-ink-300 bg-white px-2.5 text-sm"
                        >
                          {Object.entries(QUOTE_STATUSES).map(([key, label]) => (
                            <option key={key} value={key}>
                              {label}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="inline-flex h-9 cursor-pointer items-center rounded-md border border-ink-300 px-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                        >
                          Save
                        </button>
                      </form>
                    ) : (
                      <Pill tone="accent">{QUOTE_STATUSES[quote.status as keyof typeof QUOTE_STATUSES] ?? quote.status}</Pill>
                    )}
                  </div>

                  <div className="grid gap-5 px-5 py-4 lg:grid-cols-2">
                    <dl className="space-y-2.5 text-sm">
                      <Row label="Route">
                        {quote.originCity}, {quote.originCountry} → {quote.destinationCity}, {quote.destinationCountry}
                      </Row>
                      <Row label="Cargo">{quote.cargoDescription}</Row>
                      {quote.commodity ? <Row label="Commodity">{quote.commodity}</Row> : null}
                      <Row label="Pieces / weight">
                        {quote.packageCount ?? "—"} · {formatWeight(quote.weightKg)}
                      </Row>
                      <Row label="Dimensions">
                        {formatDimensions(quote.lengthCm, quote.widthCm, quote.heightCm)}
                      </Row>
                      {modes.length ? (
                        <Row label="Modes">
                          {modes.map((m) => MODES[m as keyof typeof MODES] ?? m).join(", ")}
                        </Row>
                      ) : null}
                      {quote.requiredByDate ? <Row label="Required by">{formatDate(quote.requiredByDate)}</Row> : null}
                      {quote.incoterms ? <Row label="Incoterms">{quote.incoterms}</Row> : null}
                      {quote.additionalInfo ? <Row label="Notes">{quote.additionalInfo}</Row> : null}
                    </dl>

                    {writable ? (
                      <form action={notesAction} className="space-y-2">
                        <label
                          htmlFor={`notes-${quote.id}`}
                          className="block text-sm font-medium text-ink-800"
                        >
                          Internal notes
                        </label>
                        <textarea
                          id={`notes-${quote.id}`}
                          name="internalNotes"
                          rows={5}
                          defaultValue={quote.internalNotes ?? ""}
                          placeholder="Rate assumptions, who is handling it, what is outstanding…"
                          className="w-full rounded-md border border-ink-300 bg-white px-3 py-2 text-sm"
                        />
                        <button
                          type="submit"
                          className="inline-flex h-9 cursor-pointer items-center rounded-md border border-ink-300 px-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-100"
                        >
                          Save notes
                        </button>
                      </form>
                    ) : quote.internalNotes ? (
                      <div>
                        <p className="text-sm font-medium text-ink-800">Internal notes</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-ink-600">{quote.internalNotes}</p>
                      </div>
                    ) : null}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-0.5 sm:grid-cols-[minmax(0,8rem)_1fr] sm:gap-3">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-ink-800">{children}</dd>
    </div>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
        active ? "border-accent-600 bg-accent-600 text-white" : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100"
      }`}
    >
      {label}
    </a>
  );
}
