"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { prisma } from "@/lib/db";
import { contactSchema, fieldErrors, formDataToObject, quoteRequestSchema } from "@/lib/validation";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { notifyInternal } from "@/lib/notifications";
import { internalAlertBody } from "@/lib/notifications/templates";
import { serializeList, LANGUAGES, MODES, QUOTE_SERVICE_TYPES } from "@/lib/constants";
import { formatBytes, formatDate, formatDimensions, formatWeight } from "@/lib/format";
import {
  MAX_QUOTE_ATTACHMENTS_TOTAL_BYTES,
  MAX_QUOTE_ATTACHMENT_BYTES,
  QUOTE_ALLOWED_MIME_TYPES,
  UploadError,
  removeUpload,
  storeUpload,
  validateUpload,
} from "@/lib/uploads";

export interface FormState {
  status: "idle" | "success" | "error";
  message?: string;
  reference?: string;
  /** A non-blocking note shown alongside a success, e.g. a file that did not store. */
  warning?: string;
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

/** At most this many files on one quote request. */
const MAX_QUOTE_ATTACHMENTS = 10;

const QUOTE_UPLOAD_OPTIONS = { allowed: QUOTE_ALLOWED_MIME_TYPES, maxBytes: MAX_QUOTE_ATTACHMENT_BYTES };

/**
 * Pulls the `attachments` files out of the submission and checks every one
 * before anything is written, so a bad batch is rejected as a field error
 * rather than leaving a half-recorded request behind.
 */
function collectAttachments(formData: FormData): { files: File[] } | { error: string } {
  const files = formData.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_QUOTE_ATTACHMENTS) {
    return { error: `Attach at most ${MAX_QUOTE_ATTACHMENTS} files.` };
  }

  const total = files.reduce((sum, f) => sum + f.size, 0);
  if (total > MAX_QUOTE_ATTACHMENTS_TOTAL_BYTES) {
    return {
      error: `Your files total ${formatBytes(total)}. The limit for one request is ${formatBytes(MAX_QUOTE_ATTACHMENTS_TOTAL_BYTES)}.`,
    };
  }

  for (const file of files) {
    try {
      validateUpload(file, QUOTE_UPLOAD_OPTIONS);
    } catch (error) {
      if (error instanceof UploadError) return { error: `${file.name}: ${error.message}` };
      throw error;
    }
  }

  return { files };
}

/** Metres from the form → centimetres in the database, or the legacy cm field. */
function toCm(metres: number | undefined, legacyCm: number | undefined): number | null {
  if (metres !== undefined) return Math.round(metres * 100 * 10) / 10;
  return legacyCm ?? null;
}

export async function submitQuoteRequest(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = quoteRequestSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { status: "error", message: "Please check the fields marked below.", errors: fieldErrors(parsed.error) };
  }

  // Attachments are checked before the row exists: a rejected file must not
  // leave a request behind that operations then chase for missing drawings.
  const attachments = collectAttachments(formData);
  if ("error" in attachments) {
    return {
      status: "error",
      message: "Please check the fields marked below.",
      errors: { attachments: attachments.error },
    };
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
          serviceType: data.serviceType ?? null,
          companyName: data.companyName,
          contactPerson: data.contactPerson,
          contactPosition: data.contactPosition ?? null,
          email: data.email,
          phone: data.phone ?? null,
          country: data.country ?? null,
          preferredLanguage: data.preferredLanguage ?? null,
          originCity: data.originCity,
          originCountry: data.originCountry,
          destinationCity: data.destinationCity,
          destinationCountry: data.destinationCountry,
          cargoDescription: data.cargoDescription,
          commodity: data.commodity ?? null,
          hsCode: data.hsCode ?? null,
          packageCount: data.packageCount ?? null,
          weightKg: data.weightKg ?? null,
          weightPerPieceKg: data.weightPerPieceKg ?? null,
          lengthCm: toCm(data.lengthM, data.lengthCm),
          widthCm: toCm(data.widthM, data.widthCm),
          heightCm: toCm(data.heightM, data.heightCm),
          isOOG: data.isOOG,
          isDangerousGoods: data.isDangerousGoods,
          unNumber: data.isDangerousGoods ? (data.unNumber ?? null) : null,
          isTemperatureControlled: data.isTemperatureControlled,
          isBulkLiquid: data.isBulkLiquid,
          insuranceRequired: data.insuranceRequired,
          preferredModes: serializeList(data.preferredModes),
          cargoReadyDate: data.cargoReadyDate ?? null,
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

  // Store the files under the request's own scope. A storage failure here is
  // reported to the visitor but does not discard the request: operations can
  // ask for the drawings by email, and the reference already exists.
  const storedPaths: string[] = [];
  let attachmentCount = 0;
  let attachmentWarning: string | undefined;
  try {
    for (const file of attachments.files) {
      const result = await storeUpload(file, `quote-${created.id}`, QUOTE_UPLOAD_OPTIONS);
      storedPaths.push(result.storagePath);
      await prisma.quoteAttachment.create({
        data: {
          quoteRequestId: created.id,
          fileName: result.fileName,
          storagePath: result.storagePath,
          mimeType: result.mimeType,
          sizeBytes: result.sizeBytes,
        },
      });
      attachmentCount++;
    }
  } catch (error) {
    console.error("[quote] attachment store failed", error);
    // Do not leave orphaned objects with no row pointing at them.
    await Promise.all(
      storedPaths.slice(attachmentCount).map((path) => removeUpload(path)),
    );
    attachmentWarning =
      attachments.files.length === attachmentCount
        ? undefined
        : `We saved your request but ${attachments.files.length - attachmentCount} of your ${attachments.files.length} files could not be stored. Please email them to us quoting your reference.`;
  }

  const flags = [
    created.isOOG ? "Out of gauge" : null,
    created.isDangerousGoods ? `Dangerous goods${created.unNumber ? ` (${created.unNumber})` : ""}` : null,
    created.isTemperatureControlled ? "Temperature-controlled" : null,
    created.isBulkLiquid ? "Liquid in bulk" : null,
    created.insuranceRequired ? "Insurance required" : null,
  ].filter((f): f is string => f !== null);

  // Sent after the response — the submitter must not wait on SMTP.
  after(() =>
    notifyInternal({
      subject: `Quote request ${created.reference} — ${created.companyName}`,
      body: internalAlertBody(`New quote request ${created.reference}`, [
        [
          "Service",
          created.serviceType
            ? (QUOTE_SERVICE_TYPES[created.serviceType as keyof typeof QUOTE_SERVICE_TYPES] ?? created.serviceType)
            : "—",
        ],
        ["Company", created.companyName],
        [
          "Contact",
          `${created.contactPerson}${created.contactPosition ? ` (${created.contactPosition})` : ""} <${created.email}>`,
        ],
        ["Phone", created.phone ?? "—"],
        [
          "Language",
          created.preferredLanguage
            ? (LANGUAGES[created.preferredLanguage as keyof typeof LANGUAGES] ?? created.preferredLanguage)
            : "—",
        ],
        ["Route", `${created.originCity}, ${created.originCountry} → ${created.destinationCity}, ${created.destinationCountry}`],
        ["Incoterms", created.incoterms ?? "—"],
        ["Cargo", created.cargoDescription],
        ["Commodity", created.commodity ?? "—"],
        ["HS code", created.hsCode ?? "—"],
        ["Pieces", created.packageCount?.toString() ?? "—"],
        ["Weight", formatWeight(created.weightKg)],
        ["Per piece", formatWeight(created.weightPerPieceKg)],
        ["Dimensions", formatDimensions(created.lengthCm, created.widthCm, created.heightCm)],
        ["Special", flags.length ? flags.join(", ") : "None"],
        [
          "Modes",
          (created.preferredModes ?? "")
            .split(",")
            .filter(Boolean)
            .map((m: string) => MODES[m as keyof typeof MODES] ?? m)
            .join(", ") || "—",
        ],
        ["Cargo ready", created.cargoReadyDate ? formatDate(created.cargoReadyDate) : "—"],
        ["Required by", created.requiredByDate ? formatDate(created.requiredByDate) : "—"],
        ["Attachments", `${attachmentCount} file(s)`],
        ["Notes", created.additionalInfo ?? "—"],
      ]),
      trigger: "QUOTE_REQUEST",
    }),
  );

  return {
    status: "success",
    reference: created.reference,
    message: `Thank you. Your enquiry reference is ${created.reference}. A Navigator specialist will contact you within one business day. For urgent cargo, call our 24/7 desk at +7 775 662 4455.`,
    warning: attachmentWarning,
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
