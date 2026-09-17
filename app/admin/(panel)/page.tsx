import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ButtonLink, Card, Pill, StatusBadge } from "@/components/ui";
import { IconAlert, IconArrowRight, IconPlus } from "@/components/icons";
import { dashboardStats, statusBreakdown } from "@/lib/shipments";
import { getSessionUser, canWrite } from "@/lib/auth";
import { formatDate, daysUntil } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [user, stats, breakdown] = await Promise.all([getSessionUser(), dashboardStats(), statusBreakdown()]);
  const maxCount = Math.max(1, ...breakdown.map((b) => b.count));

  return (
    <>
      <AdminPageHeader
        title={`Good day, ${user?.name.split(" ")[0] ?? "there"}`}
        description="Operations overview across all offices."
        actions={
          canWrite(user) ? (
            <ButtonLink href="/admin/shipments/new" size="sm">
              <IconPlus className="size-4" />
              New shipment
            </ButtonLink>
          ) : null
        }
      />

      <div className="space-y-6 p-5 sm:p-8">
        {/* Attention strip — only rendered when there is something to act on. */}
        {stats.exceptions > 0 || stats.overdue > 0 || stats.newQuotes > 0 || stats.newEnquiries > 0 ? (
          <div className="flex flex-wrap gap-3">
            {stats.exceptions > 0 ? (
              <AttentionCard
                href="/admin/shipments?status=DELAYED"
                count={stats.exceptions}
                label={stats.exceptions === 1 ? "shipment delayed or on hold" : "shipments delayed or on hold"}
                tone="signal"
              />
            ) : null}
            {stats.overdue > 0 ? (
              <AttentionCard
                href="/admin/shipments?status=GROUP_ACTIVE"
                count={stats.overdue}
                label={stats.overdue === 1 ? "shipment past its ETA" : "shipments past their ETA"}
                tone="signal"
              />
            ) : null}
            {stats.newQuotes > 0 ? (
              <AttentionCard
                href="/admin/quotes"
                count={stats.newQuotes}
                label={stats.newQuotes === 1 ? "new quote request" : "new quote requests"}
                tone="accent"
              />
            ) : null}
            {stats.newEnquiries > 0 ? (
              <AttentionCard
                href="/admin/enquiries"
                count={stats.newEnquiries}
                label={stats.newEnquiries === 1 ? "unanswered enquiry" : "unanswered enquiries"}
                tone="accent"
              />
            ) : null}
          </div>
        ) : null}

        {/* Headline counts */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile label="Total shipments" value={stats.total} href="/admin/shipments" />
          <StatTile label="In transit" value={stats.inTransit} href="/admin/shipments?status=GROUP_ACTIVE" />
          <StatTile label="Pending departure" value={stats.pending} href="/admin/shipments?status=GROUP_PENDING" />
          <StatTile label="Delivered" value={stats.delivered} href="/admin/shipments?status=DELIVERED" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          {/* Recently updated */}
          <Card>
            <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">Recently updated</h2>
              <Link
                href="/admin/shipments"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                All shipments
                <IconArrowRight className="size-3.5" />
              </Link>
            </div>

            {stats.recent.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-ink-500">
                No shipments yet.{" "}
                <Link href="/admin/shipments/new" className="text-accent-600 underline underline-offset-2">
                  Create the first one
                </Link>
                .
              </p>
            ) : (
              <ul className="divide-y divide-ink-200">
                {stats.recent.map((shipment) => {
                  const eta = daysUntil(shipment.eta);
                  return (
                    <li key={shipment.id}>
                      <Link
                        href={`/admin/shipments/${shipment.id}`}
                        className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 transition-colors duration-150 hover:bg-ink-50"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-sm text-ink-900">
                          {shipment.trackingId}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-ink-600">
                          {shipment.consigneeName} · {shipment.originCity} → {shipment.destinationCity}
                        </span>
                        {shipment.isOOG ? <Pill tone="signal">OOG</Pill> : null}
                        {eta !== null && shipment.status !== "DELIVERED" ? (
                          <span
                            className={`text-xs ${eta < 0 ? "font-medium text-danger-600" : "text-ink-500"}`}
                          >
                            {eta < 0 ? `${Math.abs(eta)}d overdue` : eta === 0 ? "ETA today" : `ETA ${eta}d`}
                          </span>
                        ) : null}
                        <StatusBadge status={shipment.status} size="sm" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>

          {/* Status breakdown */}
          <Card>
            <div className="border-b border-ink-200 px-5 py-4">
              <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">By status</h2>
            </div>
            <div className="space-y-2.5 p-5">
              {breakdown.map((item) => (
                <Link
                  key={item.status}
                  href={`/admin/shipments?status=${item.status}`}
                  className="block rounded transition-colors duration-150 hover:bg-ink-50"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm text-ink-700">{item.label}</span>
                    <span className="font-[family-name:var(--font-mono)] text-sm text-ink-900">{item.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${
                        item.status === "DELAYED" || item.status === "ON_HOLD"
                          ? "bg-signal-500"
                          : item.status === "DELIVERED"
                            ? "bg-success-600"
                            : "bg-accent-600"
                      }`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function StatTile({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-ink-200 bg-white p-5 transition-colors duration-150 hover:border-accent-600"
    >
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-3xl font-semibold tabular-nums text-ink-900">
        {value.toLocaleString("en-GB")}
      </p>
    </Link>
  );
}

function AttentionCard({
  href,
  count,
  label,
  tone,
}: {
  href: string;
  count: number;
  label: string;
  tone: "signal" | "accent";
}) {
  const tones =
    tone === "signal"
      ? "border-signal-500/40 bg-signal-50 text-signal-700 hover:border-signal-500"
      : "border-accent-200 bg-accent-50 text-accent-700 hover:border-accent-600";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${tones}`}
    >
      {tone === "signal" ? <IconAlert className="size-4" /> : null}
      <span className="font-[family-name:var(--font-mono)] font-semibold">{count}</span>
      {label}
      <IconArrowRight className="size-3.5" />
    </Link>
  );
}
