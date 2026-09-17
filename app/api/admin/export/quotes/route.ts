import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { AuthorizationError, requireUser } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { buildWorkbook, xlsxFilename } from "@/lib/export";
import { MODES, QUOTE_STATUSES, parseList } from "@/lib/constants";

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

  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });

  const buffer = await buildWorkbook({
    sheetName: "Quote requests",
    title: "Navigator Sea Land Limited — Quote requests",
    columns: [
      { header: "Reference", key: "reference", width: 15 },
      { header: "Received", key: "createdAt", width: 15, numFmt: "dd mmm yyyy hh:mm" },
      { header: "Status", key: "status", width: 13 },
      { header: "Company", key: "companyName", width: 26 },
      { header: "Contact", key: "contactPerson", width: 20 },
      { header: "Email", key: "email", width: 26 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Country", key: "country", width: 16 },
      { header: "Origin", key: "origin", width: 22 },
      { header: "Destination", key: "destination", width: 22 },
      { header: "Cargo", key: "cargoDescription", width: 34 },
      { header: "Commodity", key: "commodity", width: 18 },
      { header: "OOG", key: "isOOG", width: 7 },
      { header: "Pieces", key: "packageCount", width: 8, numFmt: "#,##0" },
      { header: "Weight (kg)", key: "weightKg", width: 13, numFmt: "#,##0.00" },
      { header: "L × W × H (cm)", key: "dimensions", width: 20 },
      { header: "Modes", key: "modes", width: 18 },
      { header: "Required by", key: "requiredByDate", width: 13, numFmt: "dd mmm yyyy" },
      { header: "Incoterms", key: "incoterms", width: 11 },
      { header: "Notes from client", key: "additionalInfo", width: 34 },
      { header: "Internal notes", key: "internalNotes", width: 34 },
    ],
    rows: quotes.map((quote) => ({
      reference: quote.reference,
      createdAt: quote.createdAt,
      status: QUOTE_STATUSES[quote.status as keyof typeof QUOTE_STATUSES] ?? quote.status,
      companyName: quote.companyName,
      contactPerson: quote.contactPerson,
      email: quote.email,
      phone: quote.phone ?? "",
      country: quote.country ?? "",
      origin: `${quote.originCity}, ${quote.originCountry}`,
      destination: `${quote.destinationCity}, ${quote.destinationCountry}`,
      cargoDescription: quote.cargoDescription,
      commodity: quote.commodity ?? "",
      isOOG: quote.isOOG ? "Yes" : "No",
      packageCount: quote.packageCount ?? null,
      weightKg: quote.weightKg ?? null,
      dimensions: [quote.lengthCm, quote.widthCm, quote.heightCm].some((v) => v != null)
        ? `${quote.lengthCm ?? "?"} × ${quote.widthCm ?? "?"} × ${quote.heightCm ?? "?"}`
        : "",
      modes: parseList(quote.preferredModes)
        .map((m) => MODES[m as keyof typeof MODES] ?? m)
        .join(", "),
      requiredByDate: quote.requiredByDate ?? null,
      incoterms: quote.incoterms ?? "",
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
