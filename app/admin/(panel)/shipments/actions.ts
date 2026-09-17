"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole, AuthorizationError } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  checkpointSchema,
  fieldErrors,
  formDataToObject,
  shipmentSchema,
  type ShipmentInput,
} from "@/lib/validation";
import { withGeneratedTrackingId } from "@/lib/tracking-id";
import { notifyShipmentMilestone, trackUrlFor } from "@/lib/notifications";
import { MILESTONE_STATUSES, SHIPMENT_STATUSES, isShipmentStatus, serializeList } from "@/lib/constants";
import { UploadError, removeUpload, storeUpload } from "@/lib/uploads";

export interface ActionState {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: Record<string, string>;
}

/** Shapes validated form data into the columns Prisma expects. */
function toShipmentData(d: ShipmentInput) {
  const isException = isShipmentStatus(d.status) && SHIPMENT_STATUSES[d.status].isException;

  return {
    contractRef: d.contractRef ?? null,
    projectName: d.projectName ?? null,
    blNumber: d.blNumber ?? null,
    cmrNumber: d.cmrNumber ?? null,
    awbNumber: d.awbNumber ?? null,
    clientId: d.clientId || null,

    shipperName: d.shipperName,
    shipperContact: d.shipperContact ?? null,
    shipperEmail: d.shipperEmail ?? null,
    shipperPhone: d.shipperPhone ?? null,
    shipperAddress: d.shipperAddress ?? null,

    consigneeName: d.consigneeName,
    consigneeContact: d.consigneeContact ?? null,
    consigneeEmail: d.consigneeEmail ?? null,
    consigneePhone: d.consigneePhone ?? null,
    consigneeAddress: d.consigneeAddress ?? null,

    billingPartyName: d.billingPartyName ?? null,
    billingPartyContact: d.billingPartyContact ?? null,
    billingPartyEmail: d.billingPartyEmail ?? null,
    billingPartyAddress: d.billingPartyAddress ?? null,

    originCity: d.originCity,
    originCountry: d.originCountry,
    destinationCity: d.destinationCity,
    destinationCountry: d.destinationCountry,
    portOfLoading: d.portOfLoading ?? null,
    portOfDischarge: d.portOfDischarge ?? null,
    borderCrossings: d.borderCrossings ?? null,
    corridors: serializeList(d.corridors),
    modes: serializeList(d.modes) ?? "ROAD",

    cargoDescription: d.cargoDescription,
    commodity: d.commodity ?? null,
    packageCount: d.packageCount ?? null,
    packageType: d.packageType ?? null,
    weightKg: d.weightKg ?? null,
    lengthCm: d.lengthCm ?? null,
    widthCm: d.widthCm ?? null,
    heightCm: d.heightCm ?? null,
    volumeCbm: d.volumeCbm ?? null,
    isOOG: d.isOOG,
    oogNotes: d.oogNotes ?? null,

    status: d.status,
    // The exception flag mirrors the status so delayed and on-hold shipments
    // can be filtered without parsing the status string everywhere.
    exceptionFlag: isException ? d.status : null,
    exceptionNote: d.exceptionNote ?? null,
    etd: d.etd ?? null,
    eta: d.eta ?? null,
    actualDeparture: d.actualDeparture ?? null,
    actualDelivery: d.actualDelivery ?? null,

    ownerId: d.ownerId || null,
    isPublicAccess: d.isPublicAccess,
    notifyEmails: d.notifyEmails ?? null,
    notifyPhones: d.notifyPhones ?? null,
    internalNotes: d.internalNotes ?? null,
  };
}

export async function createShipment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let user;
  try {
    user = await requireRole("OPERATOR");
  } catch (error) {
    if (error instanceof AuthorizationError) return { status: "error", message: error.message };
    throw error;
  }

  const parsed = shipmentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const data = toShipmentData(parsed.data);

  const shipment = await withGeneratedTrackingId((trackingId) =>
    prisma.shipment.create({ data: { ...data, trackingId } }),
  );

  // The opening status is also the first checkpoint, so the timeline is never
  // empty and the client sees something the moment the booking is confirmed.
  await prisma.checkpoint.create({
    data: {
      shipmentId: shipment.id,
      status: shipment.status,
      location: `${shipment.originCity}, ${shipment.originCountry}`,
      country: shipment.originCountry,
      occurredAt: new Date(),
      remarks: "Shipment created.",
      createdById: user.id,
    },
  });

  await recordAudit({
    user,
    action: "CREATE",
    entityType: "Shipment",
    entityId: shipment.id,
    summary: `Created shipment ${shipment.trackingId} (${shipment.originCity} → ${shipment.destinationCity})`,
  });

  revalidatePath("/admin/shipments");
  revalidatePath("/admin");
  redirect(`/admin/shipments/${shipment.id}?created=1`);
}

export async function updateShipment(
  shipmentId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let user;
  try {
    user = await requireRole("OPERATOR");
  } catch (error) {
    if (error instanceof AuthorizationError) return { status: "error", message: error.message };
    throw error;
  }

  const parsed = shipmentSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const existing = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!existing) return { status: "error", message: "That shipment no longer exists." };

  const data = toShipmentData(parsed.data);
  const updated = await prisma.shipment.update({ where: { id: shipmentId }, data });

  const statusChanged = existing.status !== updated.status;

  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "Shipment",
    entityId: shipmentId,
    summary: statusChanged
      ? `Updated ${updated.trackingId}; status ${existing.status} → ${updated.status}`
      : `Updated ${updated.trackingId}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
  revalidatePath("/admin/shipments");
  redirect(`/admin/shipments/${shipmentId}?saved=1`);
}

export async function deleteShipment(shipmentId: string): Promise<void> {
  const user = await requireRole("ADMIN");

  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    select: {
      trackingId: true,
      checkpoints: { select: { attachments: { select: { storagePath: true } } } },
    },
  });
  if (!shipment) redirect("/admin/shipments");

  // The database cascade removes checkpoint and attachment ROWS, but not the
  // stored objects. Without this they would sit in the bucket forever — costing
  // money, and keeping client documents well past the point they were deleted.
  // Collect the paths before the rows disappear.
  const storagePaths = shipment.checkpoints.flatMap((checkpoint) =>
    checkpoint.attachments.map((attachment) => attachment.storagePath),
  );

  // Notification logs are retained with a null shipment link, so the record of
  // what was sent to the client survives.
  await prisma.shipment.delete({ where: { id: shipmentId } });

  // Best effort, and only after the rows are gone: an orphaned object is a
  // smaller problem than a row pointing at a file that no longer exists.
  await Promise.all(storagePaths.map((storagePath) => removeUpload(storagePath)));

  await recordAudit({
    user,
    action: "DELETE",
    entityType: "Shipment",
    entityId: shipmentId,
    summary: `Deleted shipment ${shipment.trackingId}`,
  });

  revalidatePath("/admin/shipments");
  redirect("/admin/shipments?deleted=1");
}

/**
 * Adds a checkpoint. Optionally advances the shipment's current status and
 * notifies the client. Notification is attempted after the database write and
 * never rolls it back — a checkpoint that happened has happened.
 */
export async function addCheckpoint(
  shipmentId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let user;
  try {
    user = await requireRole("OPERATOR");
  } catch (error) {
    if (error instanceof AuthorizationError) return { status: "error", message: error.message };
    throw error;
  }

  const parsed = checkpointSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please correct the highlighted fields.", errors: fieldErrors(parsed.error) };
  }

  const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!shipment) return { status: "error", message: "That shipment no longer exists." };

  const input = parsed.data;

  const checkpoint = await prisma.checkpoint.create({
    data: {
      shipmentId,
      status: input.status,
      location: input.location,
      country: input.country ?? null,
      leg: input.leg ?? null,
      occurredAt: input.occurredAt,
      remarks: input.remarks ?? null,
      isClientVisible: input.isClientVisible,
      createdById: user.id,
    },
  });

  if (input.updateShipmentStatus) {
    const isException = isShipmentStatus(input.status) && SHIPMENT_STATUSES[input.status].isException;
    await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        status: input.status,
        exceptionFlag: isException ? input.status : null,
        exceptionNote: isException ? (input.remarks ?? null) : null,
        // Recording delivery stamps the actual date, which is what reporting
        // and the client-facing "Delivered" line both read.
        actualDelivery: input.status === "DELIVERED" ? input.occurredAt : shipment.actualDelivery,
        actualDeparture:
          input.status === "IN_TRANSIT" && !shipment.actualDeparture ? input.occurredAt : shipment.actualDeparture,
      },
    });
  }

  const isMilestone = (MILESTONE_STATUSES as readonly string[]).includes(input.status);
  if (input.notifyClient && isMilestone) {
    await notifyShipmentMilestone({
      shipmentId,
      trigger: input.status,
      emails: shipment.notifyEmails ?? shipment.consigneeEmail,
      phones: shipment.notifyPhones ?? shipment.consigneePhone,
      context: {
        trackingId: shipment.trackingId,
        status: input.status,
        consigneeName: shipment.consigneeName,
        originCity: shipment.originCity,
        originCountry: shipment.originCountry,
        destinationCity: shipment.destinationCity,
        destinationCountry: shipment.destinationCountry,
        contractRef: shipment.contractRef,
        eta: shipment.eta,
        location: input.location,
        remarks: input.remarks ?? null,
        trackUrl: trackUrlFor(shipment.trackingId),
      },
    });
  }

  await recordAudit({
    user,
    action: "CREATE",
    entityType: "Checkpoint",
    entityId: checkpoint.id,
    summary: `Checkpoint ${input.status} at ${input.location} on ${shipment.trackingId}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
  revalidatePath("/admin");

  return {
    status: "success",
    message: input.notifyClient && !isMilestone
      ? "Checkpoint added. No notification was sent: this status is not a client milestone."
      : "Checkpoint added.",
  };
}

export async function deleteCheckpoint(checkpointId: string, shipmentId: string): Promise<void> {
  const user = await requireRole("OPERATOR");
  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id: checkpointId },
    include: { attachments: { select: { storagePath: true } } },
  });
  if (!checkpoint) redirect(`/admin/shipments/${shipmentId}`);

  // As with deleting a shipment, the row cascade does not touch the bucket.
  const storagePaths = checkpoint.attachments.map((attachment) => attachment.storagePath);

  await prisma.checkpoint.delete({ where: { id: checkpointId } });
  await Promise.all(storagePaths.map((storagePath) => removeUpload(storagePath)));
  await recordAudit({
    user,
    action: "DELETE",
    entityType: "Checkpoint",
    entityId: checkpointId,
    summary: `Deleted checkpoint ${checkpoint.status} at ${checkpoint.location}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
}

/** Sends the current status to the client on demand, outside a checkpoint. */
export async function resendNotification(shipmentId: string): Promise<void> {
  const user = await requireRole("OPERATOR");
  const shipment = await prisma.shipment.findUnique({ where: { id: shipmentId } });
  if (!shipment) redirect("/admin/shipments");

  await notifyShipmentMilestone({
    shipmentId,
    trigger: "MANUAL",
    emails: shipment.notifyEmails ?? shipment.consigneeEmail,
    phones: shipment.notifyPhones ?? shipment.consigneePhone,
    context: {
      trackingId: shipment.trackingId,
      status: shipment.status,
      consigneeName: shipment.consigneeName,
      originCity: shipment.originCity,
      originCountry: shipment.originCountry,
      destinationCity: shipment.destinationCity,
      destinationCountry: shipment.destinationCountry,
      contractRef: shipment.contractRef,
      eta: shipment.eta,
      remarks: shipment.exceptionNote,
      trackUrl: trackUrlFor(shipment.trackingId),
    },
  });

  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "Shipment",
    entityId: shipmentId,
    summary: `Manually re-sent status notification for ${shipment.trackingId}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
}

// --- Checkpoint attachments --------------------------------------------------

/**
 * Attaches photos or documents to a checkpoint. Loading photographs and PODs are
 * the evidence an OOG movement is judged on, so files default to internal-only
 * and are released to the client explicitly.
 */
export async function addAttachments(
  checkpointId: string,
  shipmentId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let user;
  try {
    user = await requireRole("OPERATOR");
  } catch (error) {
    if (error instanceof AuthorizationError) return { status: "error", message: error.message };
    throw error;
  }

  const checkpoint = await prisma.checkpoint.findUnique({
    where: { id: checkpointId },
    select: { id: true, shipmentId: true },
  });
  if (!checkpoint || checkpoint.shipmentId !== shipmentId) {
    return { status: "error", message: "That checkpoint no longer exists." };
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { status: "error", message: "Choose at least one file." };
  if (files.length > 10) return { status: "error", message: "Attach at most 10 files at a time." };

  const caption = String(formData.get("caption") ?? "").trim().slice(0, 300) || null;
  const isClientVisible = formData.get("isClientVisible") === "on";

  const stored: string[] = [];
  try {
    for (const file of files) {
      const result = await storeUpload(file, shipmentId);
      stored.push(result.storagePath);
      await prisma.attachment.create({
        data: {
          checkpointId,
          fileName: result.fileName,
          storagePath: result.storagePath,
          mimeType: result.mimeType,
          sizeBytes: result.sizeBytes,
          caption,
          isClientVisible,
        },
      });
    }
  } catch (error) {
    // Do not leave orphaned files behind when one of a batch is rejected.
    await Promise.all(stored.map((path) => removeUpload(path)));
    if (error instanceof UploadError) return { status: "error", message: error.message };
    console.error("[attachments] upload failed", error);
    return { status: "error", message: "The upload failed. Please try again." };
  }

  await recordAudit({
    user,
    action: "CREATE",
    entityType: "Attachment",
    entityId: checkpointId,
    summary: `Attached ${files.length} file(s) to a checkpoint${isClientVisible ? " (visible to client)" : ""}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
  return {
    status: "success",
    message: `${files.length} file(s) attached${isClientVisible ? " and visible to the client" : " as internal-only"}.`,
  };
}

export async function deleteAttachment(attachmentId: string, shipmentId: string): Promise<void> {
  const user = await requireRole("OPERATOR");
  const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } });
  if (!attachment) return;

  await prisma.attachment.delete({ where: { id: attachmentId } });
  await removeUpload(attachment.storagePath);

  await recordAudit({
    user,
    action: "DELETE",
    entityType: "Attachment",
    entityId: attachmentId,
    summary: `Removed attachment ${attachment.fileName}`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
}

/** Releases an internal attachment to the client, or withdraws it. */
export async function toggleAttachmentVisibility(
  attachmentId: string,
  shipmentId: string,
): Promise<void> {
  const user = await requireRole("OPERATOR");
  const attachment = await prisma.attachment.findUnique({ where: { id: attachmentId } });
  if (!attachment) return;

  const next = !attachment.isClientVisible;
  await prisma.attachment.update({ where: { id: attachmentId }, data: { isClientVisible: next } });

  await recordAudit({
    user,
    action: "UPDATE",
    entityType: "Attachment",
    entityId: attachmentId,
    summary: `${next ? "Released" : "Withdrew"} attachment ${attachment.fileName} ${next ? "to" : "from"} the client`,
  });

  revalidatePath(`/admin/shipments/${shipmentId}`);
}
