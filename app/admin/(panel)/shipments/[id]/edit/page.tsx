import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ShipmentForm } from "@/components/admin/shipment-form";
import { updateShipment } from "../../actions";
import { canWrite, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Edit shipment" };
export const dynamic = "force-dynamic";

export default async function EditShipmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getSessionUser();
  if (!canWrite(user)) redirect(`/admin/shipments/${id}`);

  const [shipment, owners, clients] = await Promise.all([
    prisma.shipment.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.client.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
  ]);

  if (!shipment) notFound();

  // The action needs the id; binding it here keeps it out of the form markup
  // where a client could tamper with it.
  const action = updateShipment.bind(null, shipment.id);

  return (
    <>
      <AdminPageHeader title={`Edit ${shipment.trackingId}`} description="Changes are recorded in the audit log." />
      <div className="p-5 sm:p-8">
        <div className="max-w-4xl">
          <ShipmentForm
            action={action}
            shipment={shipment}
            owners={owners}
            clients={clients}
            submitLabel="Save changes"
            cancelHref={`/admin/shipments/${shipment.id}`}
          />
        </div>
      </div>
    </>
  );
}
