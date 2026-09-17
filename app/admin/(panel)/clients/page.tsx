import type { Metadata } from "next";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { Card, EmptyState } from "@/components/ui";
import { ClientForm } from "@/components/admin/client-form";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { deleteClient } from "../pipeline-actions";
import { prisma } from "@/lib/db";
import { canAdminister, canWrite, getSessionUser } from "@/lib/auth";

export const metadata: Metadata = { title: "Clients" };
export const dynamic = "force-dynamic";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = params.q?.trim();

  const [user, clients] = await Promise.all([
    getSessionUser(),
    prisma.client.findMany({
      where: query
        ? {
            OR: [
              { companyName: { contains: query, mode: "insensitive" } },
              { contactPerson: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { country: { contains: query, mode: "insensitive" } },
            ],
          }
        : {},
      orderBy: { companyName: "asc" },
      include: { _count: { select: { shipmentsAsClient: true } } },
      take: 200,
    }),
  ]);

  const writable = canWrite(user);

  return (
    <>
      <AdminPageHeader
        title="Clients"
        description="A shared address book. Shipments keep their own copy of party details, so editing a client here does not rewrite historic shipments."
      />

      <div className="grid gap-6 p-5 sm:p-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Card className="p-4">
            <form method="get" className="flex gap-2">
              <label htmlFor="q" className="sr-only">
                Search clients
              </label>
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={query ?? ""}
                placeholder="Company, contact, email or country"
                className="h-10 flex-1 rounded-md border border-ink-300 bg-white px-3 text-sm"
              />
              <button
                type="submit"
                className="inline-flex h-10 cursor-pointer items-center rounded-md bg-accent-600 px-4 text-sm font-medium text-white hover:bg-accent-700"
              >
                Search
              </button>
            </form>
          </Card>

          {clients.length === 0 ? (
            <EmptyState
              title="No clients"
              description={query ? "No client matches that search." : "Add your first client using the form."}
            />
          ) : (
            <div className="space-y-4">
              {clients.map((client) => {
                const removeAction = deleteClient.bind(null, client.id);
                return (
                  <Card key={client.id} className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-[family-name:var(--font-display)] font-semibold text-ink-900">
                          {client.companyName}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-600">
                          {[client.contactPerson, client.email, client.phone].filter(Boolean).join(" · ") || "—"}
                        </p>
                        <p className="mt-0.5 text-sm text-ink-500">
                          {[client.addressLine, client.city, client.country].filter(Boolean).join(", ") || "—"}
                        </p>
                        {client.notes ? <p className="mt-2 text-sm text-ink-600">{client.notes}</p> : null}
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <Link
                          href={`/admin/shipments?q=${encodeURIComponent(client.companyName)}`}
                          className="text-sm text-accent-600 hover:underline"
                        >
                          {client._count.shipmentsAsClient} shipment
                          {client._count.shipmentsAsClient === 1 ? "" : "s"}
                        </Link>
                        {canAdminister(user) ? (
                          <form action={removeAction}>
                            <ConfirmButton
                              message={`Remove ${client.companyName} from the address book? Shipments already linked to it keep their own party details.`}
                              className="inline-flex h-8 cursor-pointer items-center rounded px-2 text-xs font-medium text-danger-600 hover:bg-danger-50"
                            >
                              Delete
                            </ConfirmButton>
                          </form>
                        ) : null}
                      </div>
                    </div>

                    {writable ? (
                      <details className="mt-4 border-t border-ink-200 pt-4">
                        <summary className="cursor-pointer text-sm font-medium text-accent-600">Edit</summary>
                        <div className="mt-4">
                          <ClientForm client={client} />
                        </div>
                      </details>
                    ) : null}
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {writable ? (
          <Card className="h-fit p-5">
            <h2 className="font-[family-name:var(--font-display)] text-base font-semibold">Add a client</h2>
            <div className="mt-5">
              <ClientForm />
            </div>
          </Card>
        ) : null}
      </div>
    </>
  );
}
