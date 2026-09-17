import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ButtonLink, Card, EmptyState, Pill, StatusBadge } from "@/components/ui";
import { IconDownload, IconPlus, IconSearch } from "@/components/icons";
import { searchShipments } from "@/lib/shipments";
import { canWrite, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { CORRIDORS, SHIPMENT_STATUSES, STATUS_KEYS } from "@/lib/constants";
import { formatDate, daysUntil } from "@/lib/format";

export const metadata: Metadata = { title: "Shipments" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    corridor?: string;
    owner?: string;
    page?: string;
    deleted?: string;
  }>;
}

export default async function ShipmentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [user, owners] = await Promise.all([
    getSessionUser(),
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  const result = await searchShipments({
    query: params.q,
    status: params.status,
    corridor: params.corridor,
    ownerId: params.owner,
    page: Number.parseInt(params.page ?? "1", 10),
  });

  // Carry the current filters into the export link so what is downloaded is
  // what is on screen.
  const exportParams = new URLSearchParams();
  for (const [key, value] of Object.entries({
    q: params.q,
    status: params.status,
    corridor: params.corridor,
    owner: params.owner,
  })) {
    if (value) exportParams.set(key, value);
  }

  return (
    <>
      <AdminPageHeader
        title="Shipments"
        description={`${result.total.toLocaleString("en-GB")} shipment${result.total === 1 ? "" : "s"}`}
        actions={
          <>
            <ButtonLink href={`/api/admin/export/shipments?${exportParams}`} variant="secondary" size="sm">
              <IconDownload className="size-4" />
              Export Excel
            </ButtonLink>
            {canWrite(user) ? (
              <ButtonLink href="/admin/shipments/new" size="sm">
                <IconPlus className="size-4" />
                New shipment
              </ButtonLink>
            ) : null}
          </>
        }
      />

      <div className="space-y-5 p-5 sm:p-8">
        {params.deleted ? (
          <div className="rounded-md border border-success-600/30 bg-success-50 px-4 py-3 text-sm text-success-700">
            Shipment deleted.
          </div>
        ) : null}

        {/* Filters. A GET form, so every filtered view is a shareable URL. */}
        <Card className="p-4">
          <form method="get" className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
            <div className="relative">
              <label htmlFor="q" className="sr-only">
                Search shipments
              </label>
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={params.q ?? ""}
                placeholder="Tracking ID, consignee, contract, B/L, phone…"
                className="h-10 w-full rounded-md border border-ink-300 bg-white pl-9 pr-3 text-sm text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600"
              />
            </div>

            <div>
              <label htmlFor="status" className="sr-only">
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={params.status ?? "ALL"}
                className="h-10 w-full cursor-pointer rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600"
              >
                <option value="ALL">All statuses</option>
                <option value="GROUP_ACTIVE">— In transit (any leg)</option>
                <option value="GROUP_PENDING">— Pending departure</option>
                {STATUS_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {SHIPMENT_STATUSES[key].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="corridor" className="sr-only">
                Corridor
              </label>
              <select
                id="corridor"
                name="corridor"
                defaultValue={params.corridor ?? "ALL"}
                className="h-10 w-full cursor-pointer rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600"
              >
                <option value="ALL">All corridors</option>
                {Object.entries(CORRIDORS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="owner" className="sr-only">
                Handled by
              </label>
              <select
                id="owner"
                name="owner"
                defaultValue={params.owner ?? "ALL"}
                className="h-10 w-full cursor-pointer rounded-md border border-ink-300 bg-white px-3 text-sm text-ink-900 transition-colors duration-150 hover:border-ink-400 focus:border-accent-600"
              >
                <option value="ALL">Anyone</option>
                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="inline-flex h-10 cursor-pointer items-center rounded-md bg-accent-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-accent-700"
              >
                Filter
              </button>
              <Link
                href="/admin/shipments"
                className="inline-flex h-10 items-center rounded-md border border-ink-300 px-4 text-sm text-ink-700 transition-colors duration-150 hover:bg-ink-100"
              >
                Reset
              </Link>
            </div>
          </form>
        </Card>

        {result.rows.length === 0 ? (
          <EmptyState
            title="No shipments match"
            description={
              params.q || params.status || params.corridor
                ? "Try a different search term, or reset the filters."
                : "Create the first shipment to start tracking."
            }
            action={
              canWrite(user) ? (
                <ButtonLink href="/admin/shipments/new">
                  <IconPlus className="size-4" />
                  New shipment
                </ButtonLink>
              ) : null
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              {/* Five columns rather than seven: contract and owner ride along
                  with the reference and consignee they belong to. That keeps the
                  status column on screen at laptop width, which is the one column
                  operations scan for. */}
              <table className="w-full min-w-[46rem] text-left text-sm">
                <thead className="border-b border-ink-200 bg-ink-50">
                  <tr>
                    <Th>Tracking ID / contract</Th>
                    <Th>Consignee</Th>
                    <Th>Route</Th>
                    <Th>ETA</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {result.rows.map((shipment) => {
                    const eta = daysUntil(shipment.eta);
                    const overdue = eta !== null && eta < 0 && shipment.status !== "DELIVERED";
                    return (
                      <tr key={shipment.id} className="transition-colors duration-150 hover:bg-ink-50">
                        <td className="whitespace-nowrap px-4 py-3 align-top">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/shipments/${shipment.id}`}
                              className="font-[family-name:var(--font-mono)] font-medium text-accent-600 hover:text-accent-700 hover:underline"
                            >
                              {shipment.trackingId}
                            </Link>
                            {shipment.isOOG ? <Pill tone="signal">OOG</Pill> : null}
                          </div>
                          {shipment.contractRef ? (
                            <p className="mt-0.5 text-xs text-ink-500">{shipment.contractRef}</p>
                          ) : null}
                        </td>

                        <td className="max-w-[13rem] px-4 py-3 align-top">
                          <p className="truncate text-ink-800">{shipment.consigneeName}</p>
                          <p className="mt-0.5 truncate text-xs text-ink-500">
                            {shipment.owner?.name ?? "Unassigned"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 align-top text-ink-600">
                          {shipment.originCity} → {shipment.destinationCity}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 align-top">
                          <span className={overdue ? "font-medium text-danger-600" : "text-ink-600"}>
                            {formatDate(shipment.eta)}
                          </span>
                          {overdue ? (
                            <p className="mt-0.5 text-xs font-medium text-danger-600">
                              {Math.abs(eta!)}d late
                            </p>
                          ) : null}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 align-top">
                          <StatusBadge status={shipment.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {result.pageCount > 1 ? (
              <Pagination
                page={result.page}
                pageCount={result.pageCount}
                total={result.total}
                perPage={result.perPage}
                params={params}
              />
            ) : null}
          </Card>
        )}
      </div>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 font-[family-name:var(--font-display)] text-xs font-semibold uppercase tracking-wide text-ink-600">
      {children}
    </th>
  );
}

function Pagination({
  page,
  pageCount,
  total,
  perPage,
  params,
}: {
  page: number;
  pageCount: number;
  total: number;
  perPage: number;
  params: Record<string, string | undefined>;
}) {
  const buildHref = (target: number) => {
    const next = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value && key !== "page") next.set(key, value);
    }
    next.set("page", String(target));
    return `/admin/shipments?${next}`;
  };

  const first = (page - 1) * perPage + 1;
  const last = Math.min(page * perPage, total);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-between gap-3 border-t border-ink-200 px-4 py-3"
    >
      <p className="text-sm text-ink-500">
        Showing {first.toLocaleString("en-GB")}–{last.toLocaleString("en-GB")} of {total.toLocaleString("en-GB")}
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={buildHref(page - 1)}
            className="inline-flex h-9 items-center rounded-md border border-ink-300 px-3 text-sm text-ink-700 transition-colors duration-150 hover:bg-ink-100"
          >
            Previous
          </Link>
        ) : null}
        <span className="text-sm text-ink-500">
          Page {page} of {pageCount}
        </span>
        {page < pageCount ? (
          <Link
            href={buildHref(page + 1)}
            className="inline-flex h-9 items-center rounded-md border border-ink-300 px-3 text-sm text-ink-700 transition-colors duration-150 hover:bg-ink-100"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
