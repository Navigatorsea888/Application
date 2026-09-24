import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthorizationError, requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { buildWorkbook, xlsxFilename } from "@/lib/export";
import { LANGUAGES, MODES, QUOTE_SERVICE_TYPES, QUOTE_STATUSES, parseList } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  let user;
  try {
    user = await requireUser();
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    throw error;
  }

  const quotes = await prisma.quoteRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { attachments: true } } },
  });

  const buffer = await buildWorkbook({
    sheetName: "Quote requests",
    title: "Navigator Sea Land Limited — Quote requests",
    columns: [
      { header: "Reference", key: "reference", width: 15 },
      { header: "Received", key: "createdAt", width: 15, numFmt: "dd mmm yyyy hh:mm" },
      { header: "Status", key: "status", width: 13 },
      { header: "Service", key: "serviceType", width: 30 },
      { header: "Company", key: "companyName", width: 26 },
      { header: "Contact", key: "contactPerson", width: 20 },
      { header: "Position", key: "contactPosition", width: 18 },
      { header: "Email", key: "email", width: 26 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Language", key: "preferredLanguage", width: 10 },
      { header: "Country", key: "country", width: 16 },
      { header: "Origin", key: "origin", width: 22 },
      { header: "Destination", key: "destination", width: 22 },
      { header: "Cargo", key: "cargoDescription", width: 34 },
      { header: "Commodity", key: "commodity", width: 18 },
      { header: "HS code", key: "hsCode", width: 12 },
      { header: "OOG", key: "isOOG", width: 7 },
      { header: "DG / UN", key: "dangerousGoods", width: 12 },
      { header: "Temp-controlled", key: "isTemperatureControlled", width: 10 },
      { header: "Bulk liquid", key: "isBulkLiquid", width: 10 },
      { header: "Insurance", key: "insuranceRequired", width: 10 },
      { header: "Pieces", key: "packageCount", width: 8, numFmt: "#,##0" },
      { header: "Weight (kg)", key: "weightKg", width: 13, numFmt: "#,##0.00" },
      { header: "Weight per piece (kg)", key: "weightPerPieceKg", width: 16, numFmt: "#,##0.00" },
      { header: "L × W × H (cm)", key: "dimensions", width: 20 },
      { header: "Modes", key: "modes", width: 18 },
      { header: "Cargo ready", key: "cargoReadyDate", width: 13, numFmt: "dd mmm yyyy" },
      { header: "Required by", key: "requiredByDate", width: 13, numFmt: "dd mmm yyyy" },
      { header: "Incoterms", key: "incoterms", width: 11 },
      { header: "Attachments", key: "attachments", width: 11, numFmt: "0" },
      { header: "Notes from client", key: "additionalInfo", width: 34 },
      { header: "Internal notes", key: "internalNotes", width: 34 },
    ],
    rows: quotes.map((quote) => ({
      reference: quote.reference,
      createdAt: quote.createdAt,
      status: QUOTE_STATUSES[quote.status as keyof typeof QUOTE_STATUSES] ?? quote.status,
      serviceType: quote.serviceType
        ? (QUOTE_SERVICE_TYPES[quote.serviceType as keyof typeof QUOTE_SERVICE_TYPES] ?? quote.serviceType)
        : "",
      companyName: quote.companyName,
      contactPerson: quote.contactPerson,
      contactPosition: quote.contactPosition ?? "",
      email: quote.email,
      phone: quote.phone ?? "",
      preferredLanguage: quote.preferredLanguage
        ? (LANGUAGES[quote.preferredLanguage as keyof typeof LANGUAGES] ?? quote.preferredLanguage)
        : "",
      country: quote.country ?? "",
      origin: `${quote.originCity}, ${quote.originCountry}`,
      destination: `${quote.destinationCity}, ${quote.destinationCountry}`,
      cargoDescription: quote.cargoDescription,
      commodity: quote.commodity ?? "",
      hsCode: quote.hsCode ?? "",
      isOOG: quote.isOOG ? "Yes" : "No",
      dangerousGoods: quote.isDangerousGoods ? (quote.unNumber ?? "Yes") : "No",
      isTemperatureControlled: quote.isTemperatureControlled ? "Yes" : "No",
      isBulkLiquid: quote.isBulkLiquid ? "Yes" : "No",
      insuranceRequired: quote.insuranceRequired ? "Yes" : "No",
      packageCount: quote.packageCount ?? null,
      weightKg: quote.weightKg ?? null,
      weightPerPieceKg: quote.weightPerPieceKg ?? null,
      dimensions: [quote.lengthCm, quote.widthCm, quote.heightCm].some((v) => v != null)
        ? `${quote.lengthCm ?? "?"} × ${quote.widthCm ?? "?"} × ${quote.heightCm ?? "?"}`
        : "",
      modes: parseList(quote.preferredModes)
        .map((m) => MODES[m as keyof typeof MODES] ?? m)
        .join(", "),
      cargoReadyDate: quote.cargoReadyDate ?? null,
      requiredByDate: quote.requiredByDate ?? null,
      incoterms: quote.incoterms ?? "",
      attachments: quote._count.attachments,
      additionalInfo: quote.additionalInfo ?? "",
      internalNotes: quote.internalNotes ?? "",
    })),
  });

  await recordAudit({
    user,
    action: "EXPORT",
    entityType: "QuoteRequest",
    summary: `Exported ${quotes.length} quote request(s) to Excel`,
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${xlsxFilename("nsl-quote-requests")}"`,
      "Cache-Control": "no-store",
    },
  });
}
