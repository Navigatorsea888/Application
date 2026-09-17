"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema, fieldErrors, formDataToObject, quoteRequestSchema } from "@/lib/validation";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { notifyInternal } from "@/lib/notifications";
import { internalAlertBody } from "@/lib/notifications/templates";
import { serializeList, MODES } from "@/lib/constants";
import { formatDate, formatDimensions, formatWeight } from "@/lib/format";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  errors?: Record<string, string>;
}

/** Quote references are QR-YYYY-NNNN, sequential within the year. */
async function nextQuoteReference(): Promise<string> {
  const prefix = `QR-${new Date().getFullYear()}-`;
  const latest = await prisma.quoteRequest.findFirst({
    where: { reference: { startsWith: prefix } },
    orderBy: { reference: "desc" },
    select: { reference: true },
  });
  const last = latest ? Number.parseInt(latest.reference.slice(prefix.length), 10) : 0;
  return `${prefix}${String((Number.isFinite(last) ? last : 0) + 1).padStart(4, "0")}`;
}

export async function submitQuoteRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = quoteRequestSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the fields marked below.", errors: fieldErrors(parsed.error) };
  }

  // Honeypot — report success so automated submitters learn nothing.
  if (parsed.data.website) return { status: "success", message: "Thank you." };

  const ip = clientIp(await headers());
  const limit = await checkRateLimit(`quote:${ip}`, 5, 3600);
  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many submissions from this connection. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes, or email us directly.`,
    };
  }

  const data = parsed.data;

  // The unique constraint on `reference` is the real guard; this retry absorbs
  // two submissions landing in the same instant.
  let created;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      created = await prisma.quoteRequest.create({
        data: {
          reference: await nextQuoteReference(),
          companyName: data.companyName,
          contactPerson: data.contactPerson,
          email: data.email,
          phone: data.phone ?? null,
          country: data.country ?? null,
          originCity: data.originCity,
          originCountry: data.originCountry,
          destinationCity: data.destinationCity,
          destinationCountry: data.destinationCountry,
          cargoDescription: data.cargoDescription,
          commodity: data.commodity ?? null,
          packageCount: data.packageCount ?? null,
          weightKg: data.weightKg ?? null,
          lengthCm: data.lengthCm ?? null,
          widthCm: data.widthCm ?? null,
          heightCm: data.heightCm ?? null,
          isOOG: data.isOOG,
          preferredModes: serializeList(data.preferredModes),
          requiredByDate: data.requiredByDate ?? null,
          incoterms: data.incoterms ?? null,
          additionalInfo: data.additionalInfo ?? null,
        },
      });
      break;
    } catch (error) {
      if ((error as { code?: string }).code !== "P2002" || attempt === 4) {
        console.error("[quote] create failed", error);
        return {
          status: "error",
          message: "We could not record your request. Please email us directly and we will pick it up.",
        };
      }
    }
  }

  if (!created) {
    return { status: "error", message: "We could not record your request. Please email us directly." };
  }

  // Sent after the response — the submitter must not wait on SMTP.
  after(() =>
    notifyInternal({
      subject: `Quote request ${created.reference} — ${created.companyName}`,
      body: internalAlertBody(`New quote request ${created.reference}`, [
        ["Company", created.companyName],
        ["Contact", `${created.contactPerson} <${created.email}>`],
        ["Phone", created.phone ?? "—"],
        ["Route", `${created.originCity}, ${created.originCountry} → ${created.destinationCity}, ${created.destinationCountry}`],
        ["Cargo", created.cargoDescription],
        ["Commodity", created.commodity ?? "—"],
        ["Pieces", created.packageCount?.toString() ?? "—"],
        ["Weight", formatWeight(created.weightKg)],
        ["Dimensions", formatDimensions(created.lengthCm, created.widthCm, created.heightCm)],
        ["Out of gauge", created.isOOG ? "YES" : "No"],
        [
          "Modes",
          (created.preferredModes ?? "")
            .split(",")
            .filter(Boolean)
            .map((m: string) => MODES[m as keyof typeof MODES] ?? m)
            .join(", ") || "—",
        ],
        ["Required by", created.requiredByDate ? formatDate(created.requiredByDate) : "—"],
        ["Incoterms", created.incoterms ?? "—"],
        ["Notes", created.additionalInfo ?? "—"],
      ]),
      trigger: "QUOTE_REQUEST",
    }),
  );

  return {
    status: "success",
    reference: created.reference,
    message:
      "Thank you. Your enquiry has reached our operations team and we will acknowledge it within one business day.",
  };
}

export async function submitContact(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the fields marked below.", errors: fieldErrors(parsed.error) };
  }
  if (parsed.data.website) return { status: "success", message: "Thank you." };

  const ip = clientIp(await headers());
  const limit = await checkRateLimit(`contact:${ip}`, 5, 3600);
  if (!limit.allowed) {
    return {
      status: "error",
      message: `Too many messages from this connection. Please try again in about ${Math.ceil(limit.retryAfterSeconds / 60)} minutes.`,
    };
  }

  const data = parsed.data;

  // General contact messages are stored as enquiries with no shipment link, so
  // they land in the same admin inbox as tracking-page enquiries.
  await prisma.shipmentEnquiry.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: [
        data.company ? `Company: ${data.company}` : null,
        data.subject ? `Subject: ${data.subject}` : null,
        "",
        data.message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    },
  });

  // Sent after the response — the submitter must not wait on SMTP.
  after(() =>
    notifyInternal({
      subject: `Website enquiry — ${data.subject ?? data.name}`,
      body: internalAlertBody("New website contact form submission.", [
        ["Name", data.name],
        ["Company", data.company ?? "—"],
        ["Email", data.email],
        ["Phone", data.phone ?? "—"],
        ["Subject", data.subject ?? "—"],
        ["Message", data.message],
      ]),
      trigger: "CONTACT_FORM",
    }),
  );

  return {
    status: "success",
    message: "Thank you — your message has been received. We aim to reply within one business day.",
  };
}
