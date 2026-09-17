import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/admin-shell";
import { ShipmentForm } from "@/components/admin/shipment-form";
import { createShipment } from "../actions";
import { canWrite, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "New shipment" };
export const dynamic = "force-dynamic";

export default async function NewShipmentPage() {
  const user = await getSessionUser();
  if (!canWrite(user)) redirect("/admin/shipments");

  const [owners, clients] = await Promise.all([
    prisma.user.findMany({ where: { isActive: true }, select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.client.findMany({ select: { id: true, companyName: true }, orderBy: { companyName: "asc" } }),
  ]);

  return (
    <>
      <AdminPageHeader
        title="New shipment"
        description="A Tracking ID in the format NSL-YYYY-NNNN is allocated on save, along with an opening checkpoint."
      />
      <div className="p-5 sm:p-8">
        <div className="max-w-4xl">
          <ShipmentForm
            action={createShipment}
            owners={owners}
            clients={clients}
            submitLabel="Create shipment"
            cancelHref="/admin/shipments"
          />
        </div>
      </div>
    </>
  );
}
