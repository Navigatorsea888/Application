import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card, EmptyState, Pill } from "@/components/ui";
import { prisma } from "@/lib/db";
import { canWrite, getSessionUser } from "@/lib/auth";
import { setEnquiryStatus } from "../pipeline-actions";
import { ENQUIRY_STATUSES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "Enquiries" };
export const dynamic = "force-dynamic";

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = params.status && params.status !== "ALL" ? params.status : undefined;

  const [user, enquiries] = await Promise.all([
    getSessionUser(),
    prisma.shipmentEnquiry.findMany({
      where: filter ? { status: filter } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { shipment: { select: { id: true, trackingId: true } } },
    }),
  ]);

  const writable = canWrite(user);

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        description="Messages from the tracking page and the contact form."
      />

      <div className="space-y-5 p-5 sm:p-8">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          <a
            href="/admin/enquiries"
            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${!filter ? "border-accent-600 bg-accent-600 text-white" : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100"}`}
          >
            All
          </a>
          {Object.entries(ENQUIRY_STATUSES).map(([key, label]) => (
            <a
              key={key}
              href={`/admin/enquiries?status=${key}`}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium ${filter === key ? "border-accent-600 bg-accent-600 text-white" : "border-ink-300 bg-white text-ink-700 hover:bg-ink-100"}`}
            >
              {label}
            </a>
          ))}
        </nav>

        {enquiries.length === 0 ? (
          <EmptyState title="No enquiries" description="Messages from clients will appear here." />
        ) : (
          <div className="space-y-4">
            {enquiries.map((enquiry) => {
              const statusAction = setEnquiryStatus.bind(null, enquiry.id);
              return (
                <Card key={enquiry.id} className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <p className="font-[family-name:var(--font-display)] font-semibold text-ink-900">
                          {enquiry.name}
                        </p>
                        {enquiry.shipment ? (
                          <Link
                            href={`/admin/shipments/${enquiry.shipment.id}`}
                            className="font-[family-name:var(--font-mono)] text-sm text-accent-600 hover:underline"
                          >
                            {enquiry.shipment.trackingId}
                          </Link>
                        ) : enquiry.trackingRef ? (
                          <Pill tone="signal">{enquiry.trackingRef} — not found</Pill>
                        ) : (
                          <Pill>General enquiry</Pill>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-ink-600">
                        <a href={`mailto:${enquiry.email}`} className="text-accent-600 underline underline-offset-2">
                          {enquiry.email}
                        </a>
                        {enquiry.phone ? ` · ${enquiry.phone}` : ""} · {formatDateTime(enquiry.createdAt)}
                      </p>
                    </div>

                    {writable ? (
                      <form action={statusAction} className="flex items-center gap-2">
                        <label htmlFor={`enq-${enquiry.id}`} className="sr-only">
                          Status
                        </label>
                        <select
                          id={`enq-${enquiry.id}`}
                          name="status"
                          defaultValue={enquiry.status}
                          className="h-9 cursor-pointer rounded-md border border-ink-300 bg-white px-2.5 text-sm"
                        >
                          {Object.entries(ENQUIRY_STATUSES).map(([key, label]) => (
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
                      <Pill tone="accent">
                        {ENQUIRY_STATUSES[enquiry.status as keyof typeof ENQUIRY_STATUSES] ?? enquiry.status}
                      </Pill>
                    )}
                  </div>

                  <p className="mt-4 whitespace-pre-wrap rounded-md border border-ink-200 bg-ink-50 px-4 py-3 text-sm leading-relaxed text-ink-700">
                    {enquiry.message}
                  </p>

                  <a
                    href={`mailto:${enquiry.email}?subject=${encodeURIComponent(
                      enquiry.trackingRef ? `Re: shipment ${enquiry.trackingRef}` : "Re: your enquiry",
                    )}`}
                    className="mt-3 inline-block text-sm font-medium text-accent-600 hover:text-accent-700"
                  >
                    Reply by email →
                  </a>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
