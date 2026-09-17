"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import { enquirySchema, fieldErrors, formDataToObject } from "@/lib/validation";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { notifyInternal } from "@/lib/notifications";
import { internalAlertBody } from "@/lib/notifications/templates";
import { normalizeTrackingId } from "@/lib/tracking-id";

export interface EnquiryState {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
}

/**
 * "Contact us about this shipment" — raised from the tracking result page and
 * linked to the shipment where the Tracking ID resolves.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const parsed = enquirySchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the fields below.", errors: fieldErrors(parsed.error) };
  }

  // Honeypot: a hidden field that only automated submissions fill in. Report
  // success so the bot does not learn it was rejected.
  if (parsed.data.website) return { status: "success", message: "Thank you — we will be in touch." };

  const ip = clientIp(await headers());
  const limit = await checkRateLimit(`enquiry:${ip}`, 5, 3600);
  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many messages sent. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or email us directly.`,
    };
  }

  const trackingRef = parsed.data.trackingRef ? normalizeTrackingId(parsed.data.trackingRef) : null;
  const shipment = trackingRef
    ? await prisma.shipment.findUnique({ where: { trackingId: trackingRef }, select: { id: true } })
    : null;

  const enquiry = await prisma.shipmentEnquiry.create({
    data: {
      shipmentId: shipment?.id ?? null,
      trackingRef,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message,
    },
  });

  // Sent after the response — the submitter must not wait on SMTP.
  after(() =>
    notifyInternal({
      subject: `Shipment enquiry${trackingRef ? ` — ${trackingRef}` : ""}`,
      body: internalAlertBody("A new shipment enquiry was submitted.", [
        ["Tracking ID", trackingRef ?? "not supplied"],
        ["Name", enquiry.name],
        ["Email", enquiry.email],
        ["Phone", enquiry.phone ?? "—"],
        ["Message", enquiry.message],
      ]),
      trigger: "SHIPMENT_ENQUIRY",
      shipmentId: shipment?.id ?? null,
    }),
  );

  return {
    status: "success",
    message: "Thank you — your message has reached our operations team. We aim to reply within one business day.",
  };
}
