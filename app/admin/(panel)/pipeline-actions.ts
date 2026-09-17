"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { ENQUIRY_STATUSES, QUOTE_STATUSES } from "@/lib/constants";

/** Status changes for quote requests and enquiries — the two inboxes. */

export async function setQuoteStatus(quoteId: string, formData: FormData): Promise<void> {
  const user = await requireRole("OPERATOR");
  const status = String(formData.get("status") ?? "");
  if (!Object.prototype.hasOwnProperty.call(QUOTE_STATUSES, status)) return;

  const quote = await prisma.quoteRequest.update({
    where: { id: quoteId },
    data: { status },
    select: { reference: true },
  });

  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "QuoteRequest",
    entityId: quoteId,
    summary: `Quote ${quote.reference} set to ${status}`,
  });

  revalidatePath("/admin/quotes");
  revalidatePath("/admin");
}

export async function saveQuoteNotes(quoteId: string, formData: FormData): Promise<void> {
  const user = await requireRole("OPERATOR");
  const notes = String(formData.get("internalNotes") ?? "").slice(0, 4000);

  await prisma.quoteRequest.update({ where: { id: quoteId }, data: { internalNotes: notes || null } });
  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "QuoteRequest",
    entityId: quoteId,
    summary: "Updated internal notes on a quote request",
  });

  revalidatePath("/admin/quotes");
}

export async function setEnquiryStatus(enquiryId: string, formData: FormData): Promise<void> {
  const user = await requireRole("OPERATOR");
  const status = String(formData.get("status") ?? "");
  if (!Object.prototype.hasOwnProperty.call(ENQUIRY_STATUSES, status)) return;

  await prisma.shipmentEnquiry.update({ where: { id: enquiryId }, data: { status } });
  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "ShipmentEnquiry",
    entityId: enquiryId,
    summary: `Enquiry set to ${status}`,
  });

  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

// --- Clients -----------------------------------------------------------------

export interface ClientState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function saveClient(_prev: ClientState, formData: FormData): Promise<ClientState> {
  const user = await requireRole("OPERATOR");

  const id = String(formData.get("id") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  if (!companyName) return { status: "error", message: "Company name is required." };

  const data = {
    companyName,
    contactPerson: str(formData.get("contactPerson")),
    email: str(formData.get("email")),
    phone: str(formData.get("phone")),
    addressLine: str(formData.get("addressLine")),
    city: str(formData.get("city")),
    country: str(formData.get("country")),
    notes: str(formData.get("notes")),
  };

  if (id) {
    await prisma.client.update({ where: { id }, data });
    await recordAudit({ user, action: "UPDATE", entityType: "Client", entityId: id, summary: `Updated client ${companyName}` });
  } else {
    const created = await prisma.client.create({ data });
    await recordAudit({ user, action: "CREATE", entityType: "Client", entityId: created.id, summary: `Created client ${companyName}` });
  }

  revalidatePath("/admin/clients");
  return { status: "success", message: id ? "Client updated." : "Client added." };
}

export async function deleteClient(clientId: string): Promise<void> {
  const user = await requireRole("ADMIN");
  const client = await prisma.client.findUnique({ where: { id: clientId }, select: { companyName: true } });
  if (!client) return;

  // Shipments keep their own copies of party details, so removing a client
  // record detaches it (schema uses SetNull) rather than losing shipment data.
  await prisma.client.delete({ where: { id: clientId } });
  await recordAudit({ user, action: "DELETE", entityType: "Client", entityId: clientId, summary: `Deleted client ${client.companyName}` });

  revalidatePath("/admin/clients");
}

function str(value: FormDataEntryValue | null): string | null {
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}
