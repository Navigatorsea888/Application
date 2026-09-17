/**
 * Seeds a working demo dataset: staff accounts, clients, shipments across every
 * corridor with realistic checkpoint histories, and a couple of quote requests.
 *
 * Safe to re-run — it upserts by natural key and skips shipments whose Tracking
 * ID already exists, so `npm run db:seed` will not duplicate anything.
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Days relative to today, as a Date. Keeps the demo data always current. */
function day(offset: number, hour = 9, minute = 0): Date {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + offset);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
}

async function main() {
  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@navigatorsealand.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe!2026";

  // --- Staff -----------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Administrator",
      role: "ADMIN",
      office: "ALMATY",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const almaty = await prisma.user.upsert({
    where: { email: "operations.almaty@navigatorsealand.com" },
    update: {},
    create: {
      email: "operations.almaty@navigatorsealand.com",
      name: "Almaty Operations",
      role: "OPERATOR",
      office: "ALMATY",
      passwordHash: await bcrypt.hash("Operations!2026", 12),
    },
  });

  const atyrau = await prisma.user.upsert({
    where: { email: "operations.atyrau@navigatorsealand.com" },
    update: {},
    create: {
      email: "operations.atyrau@navigatorsealand.com",
      name: "Atyrau Operations",
      role: "OPERATOR",
      office: "ATYRAU",
      passwordHash: await bcrypt.hash("Operations!2026", 12),
    },
  });

  console.log(`  staff: ${admin.email}, ${almaty.email}, ${atyrau.email}`);

  // --- Clients ---------------------------------------------------------------
  const clientSeeds = [
    {
      companyName: "Caspian Energy Projects LLP",
      contactPerson: "Logistics Manager",
      email: "logistics@example-caspian.kz",
      phone: "+7 712 000 0000",
      city: "Atyrau",
      country: "Kazakhstan",
      notes: "Demo record. Replace with a real client before go-live.",
    },
    {
      companyName: "Tien Shan Power Construction",
      contactPerson: "Project Coordinator",
      email: "projects@example-tienshan.kz",
      phone: "+7 727 000 0000",
      city: "Almaty",
      country: "Kazakhstan",
      notes: "Demo record.",
    },
    {
      companyName: "Bharat Heavy Equipment Exports",
      contactPerson: "Export Desk",
      email: "exports@example-bhee.in",
      phone: "+91 22 0000 0000",
      city: "Mumbai",
      country: "India",
      notes: "Demo record.",
    },
  ];

  const clients: Record<string, string> = {};
  for (const seed of clientSeeds) {
    const existing = await prisma.client.findFirst({ where: { companyName: seed.companyName } });
    const client = existing ?? (await prisma.client.create({ data: seed }));
    clients[seed.companyName] = client.id;
  }

  // --- Shipments -------------------------------------------------------------
  const year = new Date().getFullYear();

  interface CheckpointSeed {
    status: string;
    location: string;
    country?: string;
    leg?: string;
    occurredAt: Date;
    remarks?: string;
    isClientVisible?: boolean;
  }

  const shipmentSeeds: Array<{
    trackingId: string;
    ownerId: string;
    clientKey?: string;
    data: Omit<Prisma.ShipmentUncheckedCreateInput, "trackingId" | "ownerId" | "clientId">;
    checkpoints: CheckpointSeed[];
  }> = [
    {
      trackingId: `NSL-${year}-0001`,
      ownerId: almaty.id,
      clientKey: "Tien Shan Power Construction",
      data: {
        contractRef: "TSP-2026-114",
        projectName: "Tien Shan 220kV Substation",
        blNumber: "COSU6221884730",
        consigneeName: "Tien Shan Power Construction",
        consigneeContact: "Project Coordinator",
        consigneeEmail: "projects@example-tienshan.kz",
        consigneePhone: "+7 727 000 0000",
        consigneeAddress: "Almaty, Kazakhstan",
        shipperName: "Shandong Transformer Works",
        shipperEmail: "export@example-stw.cn",
        shipperAddress: "Jinan, Shandong, China",
        originCity: "Jinan",
        originCountry: "China",
        destinationCity: "Almaty",
        destinationCountry: "Kazakhstan",
        portOfLoading: "—",
        portOfDischarge: "—",
        borderCrossings: "Khorgos",
        corridors: "CHINA_LAND_BRIDGE,CENTRAL_ASIA",
        modes: "RAIL,ROAD",
        cargoDescription: "1 × 220kV power transformer with accessories, 3 × ancillary crates",
        commodity: "Power transformer",
        packageCount: 4,
        packageType: "Crate",
        weightKg: 96_000,
        lengthCm: 780,
        widthCm: 340,
        heightCm: 410,
        isOOG: true,
        oogNotes: "Transformer exceeds loading gauge. Impact recorder fitted; max 3g longitudinal.",
        status: "IN_TRANSIT",
        etd: day(-18),
        eta: day(6),
        actualDeparture: day(-18),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Almaty", country: "Kazakhstan", occurredAt: day(-26), remarks: "Booking confirmed against contract TSP-2026-114." },
        { status: "CARGO_RECEIVED", location: "Jinan works", country: "China", occurredAt: day(-21), remarks: "Transformer received at loading point. Pre-shipment inspection completed." },
        { status: "CUSTOMS_EXPORT", location: "Jinan", country: "China", occurredAt: day(-19), remarks: "Export declaration cleared." },
        { status: "IN_TRANSIT", location: "Jinan → Khorgos", country: "China", leg: "RAIL", occurredAt: day(-18), remarks: "Loaded on depressed-centre wagon; departed for Khorgos." },
        { status: "BORDER_CROSSING", location: "Khorgos", country: "Kazakhstan", leg: "RAIL", occurredAt: day(-9), remarks: "Gauge change completed. Re-secured and re-measured against the 1,520mm profile." },
        { status: "IN_TRANSIT", location: "Khorgos → Almaty", country: "Kazakhstan", leg: "RAIL", occurredAt: day(-7), remarks: "On rail to Almaty. Road permit for the final leg issued." },
        { status: "IN_TRANSIT", location: "Margin note", country: "Kazakhstan", occurredAt: day(-6), remarks: "Client advised of 2-day slip due to wagon allocation.", isClientVisible: false },
      ],
    },
    {
      trackingId: `NSL-${year}-0002`,
      ownerId: atyrau.id,
      clientKey: "Caspian Energy Projects LLP",
      data: {
        contractRef: "CEP-2026-007",
        projectName: "North Caspian Process Module",
        consigneeName: "Caspian Energy Projects LLP",
        consigneeContact: "Logistics Manager",
        consigneeEmail: "logistics@example-caspian.kz",
        consigneePhone: "+7 712 000 0000",
        shipperName: "Baku Fabrication Yard",
        shipperEmail: "yard@example-bfy.az",
        originCity: "Baku",
        originCountry: "Azerbaijan",
        destinationCity: "Atyrau",
        destinationCountry: "Kazakhstan",
        portOfLoading: "Alat",
        portOfDischarge: "Kuryk",
        borderCrossings: "Kuryk",
        corridors: "CASPIAN,MIDDLE_CORRIDOR",
        modes: "BARGE,ROAD",
        cargoDescription: "1 × process module, skid mounted",
        commodity: "Process module",
        packageCount: 1,
        packageType: "Skid",
        weightKg: 212_000,
        lengthCm: 2_400,
        widthCm: 1_150,
        heightCm: 980,
        isOOG: true,
        oogNotes: "Barge movement; ro-ro at both shores. Ramp capacity confirmed at Kuryk.",
        status: "DELAYED",
        exceptionFlag: "DELAYED",
        exceptionNote: "Caspian crossing postponed 4 days — sustained force 6 winds at Alat. Revised sailing confirmed.",
        etd: day(-11),
        eta: day(9),
        actualDeparture: day(-11),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Atyrau", country: "Kazakhstan", occurredAt: day(-24), remarks: "Barge nominated and ramp survey booked." },
        { status: "CARGO_RECEIVED", location: "Baku fabrication yard", country: "Azerbaijan", occurredAt: day(-14), remarks: "Module received and sea-fastening plan approved." },
        { status: "CUSTOMS_EXPORT", location: "Alat", country: "Azerbaijan", occurredAt: day(-12), remarks: "Export formalities completed." },
        { status: "IN_TRANSIT", location: "Alat", country: "Azerbaijan", leg: "BARGE", occurredAt: day(-11), remarks: "Rolled on and secured. Awaiting weather window." },
        { status: "DELAYED", location: "Alat", country: "Azerbaijan", occurredAt: day(-4), remarks: "Sailing postponed 4 days — sustained force 6 winds. Revised departure confirmed with the barge operator." },
      ],
    },
    {
      trackingId: `NSL-${year}-0003`,
      ownerId: almaty.id,
      clientKey: "Bharat Heavy Equipment Exports",
      data: {
        contractRef: "BHEE-INSTC-2026-33",
        projectName: "Uzbek Substation Upgrade",
        blNumber: "MAEU254118990",
        consigneeName: "Uzbekenergo Regional Grid",
        consigneeContact: "Import Desk",
        consigneeEmail: "import@example-uzgrid.uz",
        shipperName: "Bharat Heavy Equipment Exports",
        shipperEmail: "exports@example-bhee.in",
        originCity: "Mumbai",
        originCountry: "India",
        destinationCity: "Tashkent",
        destinationCountry: "Uzbekistan",
        portOfLoading: "Nhava Sheva",
        portOfDischarge: "Bandar Abbas",
        borderCrossings: "Bandar Abbas, Sarakhs",
        corridors: "INSTC,CENTRAL_ASIA",
        modes: "SEA,RAIL,ROAD",
        cargoDescription: "2 × 132kV transformers, 6 × accessory crates",
        commodity: "Power transformer",
        packageCount: 8,
        packageType: "Case",
        weightKg: 64_000,
        lengthCm: 620,
        widthCm: 290,
        heightCm: 330,
        isOOG: true,
        status: "CUSTOMS_IMPORT",
        etd: day(-38),
        eta: day(3),
        actualDeparture: day(-38),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Mumbai", country: "India", occurredAt: day(-45), remarks: "INSTC routing agreed; compliance screening completed on all parties." },
        { status: "CARGO_RECEIVED", location: "Nhava Sheva", country: "India", occurredAt: day(-40) },
        { status: "CUSTOMS_EXPORT", location: "Nhava Sheva", country: "India", occurredAt: day(-39) },
        { status: "IN_TRANSIT", location: "Nhava Sheva → Bandar Abbas", country: "India", leg: "SEA", occurredAt: day(-38), remarks: "Loaded on flat racks." },
        { status: "ARRIVED_HUB", location: "Bandar Abbas", country: "Iran", occurredAt: day(-24), remarks: "Discharged. Transit documentation lodged." },
        { status: "IN_TRANSIT", location: "Bandar Abbas → Sarakhs", country: "Iran", leg: "RAIL", occurredAt: day(-20) },
        { status: "BORDER_CROSSING", location: "Sarakhs", country: "Turkmenistan", leg: "RAIL", occurredAt: day(-9), remarks: "Transshipped and re-secured." },
        { status: "CUSTOMS_IMPORT", location: "Tashkent", country: "Uzbekistan", occurredAt: day(-2), remarks: "Import declaration lodged; clearance expected within 48 hours." },
      ],
    },
    {
      trackingId: `NSL-${year}-0004`,
      ownerId: atyrau.id,
      data: {
        contractRef: "NSL-JOB-2026-0091",
        consigneeName: "Aktobe Mining Services",
        consigneeEmail: "site@example-aktobe.kz",
        shipperName: "Rotterdam Plant Exports BV",
        shipperEmail: "export@example-rpe.nl",
        originCity: "Rotterdam",
        originCountry: "Netherlands",
        destinationCity: "Aktobe",
        destinationCountry: "Kazakhstan",
        portOfLoading: "Rotterdam",
        portOfDischarge: "Poti",
        borderCrossings: "Poti, Alat, Kuryk",
        corridors: "MIDDLE_CORRIDOR,CASPIAN,CENTRAL_ASIA",
        modes: "SEA,RAIL,ROAD",
        cargoDescription: "Crushing plant components, 14 pieces",
        commodity: "Mining plant",
        packageCount: 14,
        packageType: "Flat rack",
        weightKg: 138_000,
        lengthCm: 1_240,
        widthCm: 420,
        heightCm: 380,
        isOOG: true,
        status: "DELIVERED",
        etd: day(-72),
        eta: day(-9),
        actualDeparture: day(-70),
        actualDelivery: day(-7),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Almaty", country: "Kazakhstan", occurredAt: day(-84) },
        { status: "CARGO_RECEIVED", location: "Rotterdam", country: "Netherlands", occurredAt: day(-73) },
        { status: "CUSTOMS_EXPORT", location: "Rotterdam", country: "Netherlands", occurredAt: day(-71) },
        { status: "IN_TRANSIT", location: "Rotterdam → Poti", country: "Netherlands", leg: "SEA", occurredAt: day(-70) },
        { status: "ARRIVED_HUB", location: "Poti", country: "Georgia", occurredAt: day(-49) },
        { status: "IN_TRANSIT", location: "Poti → Alat", country: "Georgia", leg: "RAIL", occurredAt: day(-46) },
        { status: "BORDER_CROSSING", location: "Alat ferry terminal", country: "Azerbaijan", leg: "SEA", occurredAt: day(-38), remarks: "Loaded to rail ferry for Kuryk." },
        { status: "BORDER_CROSSING", location: "Kuryk", country: "Kazakhstan", leg: "RAIL", occurredAt: day(-33) },
        { status: "CUSTOMS_IMPORT", location: "Aktau", country: "Kazakhstan", occurredAt: day(-28) },
        { status: "OUT_FOR_DELIVERY", location: "Aktau → Aktobe", country: "Kazakhstan", leg: "ROAD", occurredAt: day(-14), remarks: "Modular trailers; escorted convoy." },
        { status: "DELIVERED", location: "Aktobe site", country: "Kazakhstan", occurredAt: day(-7), remarks: "Delivered and offloaded. POD signed by site supervisor." },
      ],
    },
    {
      trackingId: `NSL-${year}-0005`,
      ownerId: almaty.id,
      data: {
        contractRef: "NSL-JOB-2026-0102",
        consigneeName: "Bishkek Infrastructure Group",
        consigneeEmail: "logistics@example-big.kg",
        shipperName: "Xi'an Heavy Machinery",
        shipperEmail: "sales@example-xhm.cn",
        originCity: "Xi'an",
        originCountry: "China",
        destinationCity: "Bishkek",
        destinationCountry: "Kyrgyzstan",
        borderCrossings: "Dostyk",
        corridors: "CHINA_LAND_BRIDGE,CENTRAL_ASIA",
        modes: "RAIL,ROAD",
        cargoDescription: "2 × tower crane sections, 1 × counterweight set",
        commodity: "Construction plant",
        packageCount: 3,
        packageType: "Bundle",
        weightKg: 44_500,
        lengthCm: 1_180,
        widthCm: 260,
        heightCm: 250,
        isOOG: true,
        status: "BOOKING_CONFIRMED",
        etd: day(8),
        eta: day(34),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Almaty", country: "Kazakhstan", occurredAt: day(-3), remarks: "Booking confirmed. Wagon allocation requested for the Dostyk routing." },
      ],
    },
    {
      trackingId: `NSL-${year}-0006`,
      ownerId: atyrau.id,
      clientKey: "Caspian Energy Projects LLP",
      data: {
        contractRef: "CEP-2026-012",
        consigneeName: "Caspian Energy Projects LLP",
        consigneeEmail: "logistics@example-caspian.kz",
        shipperName: "Tengiz Field Services",
        originCity: "Atyrau",
        originCountry: "Kazakhstan",
        destinationCity: "Turkmenbashi",
        destinationCountry: "Turkmenistan",
        portOfLoading: "Kuryk",
        portOfDischarge: "Turkmenbashi",
        corridors: "CASPIAN,CENTRAL_ASIA",
        modes: "ROAD,SEA",
        cargoDescription: "Wellhead equipment and spares, 22 pieces",
        commodity: "Oilfield equipment",
        packageCount: 22,
        packageType: "Case",
        weightKg: 18_400,
        isOOG: false,
        status: "ON_HOLD",
        exceptionFlag: "ON_HOLD",
        exceptionNote: "Held at client instruction pending confirmation of the destination permit. No storage charges accruing.",
        etd: day(-5),
        eta: day(12),
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Atyrau", country: "Kazakhstan", occurredAt: day(-12) },
        { status: "CARGO_RECEIVED", location: "Atyrau warehouse", country: "Kazakhstan", occurredAt: day(-7), remarks: "Consolidated and packed for the Caspian crossing." },
        { status: "ON_HOLD", location: "Atyrau warehouse", country: "Kazakhstan", occurredAt: day(-5), remarks: "Held at client instruction pending the destination permit. No storage charges accruing." },
      ],
    },
    {
      trackingId: `NSL-${year}-0007`,
      ownerId: almaty.id,
      data: {
        contractRef: "NSL-JOB-2026-0118",
        consigneeName: "Dushanbe Hydro Works",
        consigneeEmail: "procurement@example-dhw.tj",
        shipperName: "Istanbul Steel Structures",
        originCity: "Istanbul",
        originCountry: "Türkiye",
        destinationCity: "Dushanbe",
        destinationCountry: "Tajikistan",
        corridors: "MIDDLE_CORRIDOR,CENTRAL_ASIA",
        modes: "ROAD",
        cargoDescription: "Penstock sections, 9 pieces",
        commodity: "Steel fabrication",
        packageCount: 9,
        packageType: "Loose / Uncrated",
        weightKg: 72_000,
        lengthCm: 1_400,
        widthCm: 320,
        heightCm: 320,
        isOOG: true,
        status: "OUT_FOR_DELIVERY",
        etd: day(-22),
        eta: day(1),
        actualDeparture: day(-22),
        isPublicAccess: true,
      },
      checkpoints: [
        { status: "BOOKING_CONFIRMED", location: "Almaty", country: "Kazakhstan", occurredAt: day(-30) },
        { status: "CARGO_RECEIVED", location: "Istanbul", country: "Türkiye", occurredAt: day(-24) },
        { status: "CUSTOMS_EXPORT", location: "Istanbul", country: "Türkiye", occurredAt: day(-23) },
        { status: "IN_TRANSIT", location: "Istanbul → Tashkent", country: "Türkiye", leg: "ROAD", occurredAt: day(-22), remarks: "TIR carnet issued. Convoy of 9 extendable trailers." },
        { status: "CUSTOMS_IMPORT", location: "Oybek border", country: "Tajikistan", occurredAt: day(-4) },
        { status: "OUT_FOR_DELIVERY", location: "Oybek → Dushanbe site", country: "Tajikistan", leg: "ROAD", occurredAt: day(-1), remarks: "Final leg with police escort; arrival expected tomorrow." },
      ],
    },
  ];

  let createdShipments = 0;
  for (const seed of shipmentSeeds) {
    const existing = await prisma.shipment.findUnique({ where: { trackingId: seed.trackingId } });
    if (existing) continue;

    const shipment = await prisma.shipment.create({
      data: {
        ...seed.data,
        trackingId: seed.trackingId,
        ownerId: seed.ownerId,
        clientId: seed.clientKey ? clients[seed.clientKey] : null,
        notifyEmails: seed.data.consigneeEmail ?? null,
      },
    });

    for (const checkpoint of seed.checkpoints) {
      await prisma.checkpoint.create({
        data: {
          shipmentId: shipment.id,
          status: checkpoint.status,
          location: checkpoint.location,
          country: checkpoint.country ?? null,
          leg: checkpoint.leg ?? null,
          occurredAt: checkpoint.occurredAt,
          remarks: checkpoint.remarks ?? null,
          isClientVisible: checkpoint.isClientVisible ?? true,
          createdById: seed.ownerId,
        },
      });
    }
    createdShipments++;
  }

  // --- Quote requests --------------------------------------------------------
  const quoteSeeds = [
    {
      reference: `QR-${year}-0001`,
      companyName: "Anatolia EPC Contractors",
      contactPerson: "Tender Manager",
      email: "tenders@example-anatolia.tr",
      phone: "+90 212 000 0000",
      country: "Türkiye",
      originCity: "Izmir",
      originCountry: "Türkiye",
      destinationCity: "Nur-Sultan",
      destinationCountry: "Kazakhstan",
      cargoDescription: "Gas turbine and auxiliary skids, 11 pieces",
      commodity: "Gas turbine",
      packageCount: 11,
      weightKg: 124_000,
      lengthCm: 1_120,
      widthCm: 460,
      heightCm: 440,
      isOOG: true,
      preferredModes: "SEA,RAIL,ROAD",
      incoterms: "DAP",
      additionalInfo: "Tender submission due in three weeks. Need an indicative rate and a realistic transit.",
      status: "NEW",
    },
    {
      reference: `QR-${year}-0002`,
      companyName: "Nordic Wind Partners",
      contactPerson: "Supply Chain Lead",
      email: "supplychain@example-nordicwind.dk",
      country: "Denmark",
      originCity: "Esbjerg",
      originCountry: "Denmark",
      destinationCity: "Zhanatas",
      destinationCountry: "Kazakhstan",
      cargoDescription: "6 × turbine blades, 2 × nacelles",
      commodity: "Wind turbine components",
      packageCount: 8,
      weightKg: 68_000,
      lengthCm: 6_700,
      widthCm: 420,
      heightCm: 380,
      isOOG: true,
      preferredModes: "SEA,RAIL,ROAD",
      incoterms: "DPU",
      additionalInfo: "Blade length is the binding constraint. Route survey needed for the final 60 km.",
      status: "IN_REVIEW",
      internalNotes: "Blades at 67m — confirm swept path on the Zhanatas approach before quoting.",
    },
  ];

  let createdQuotes = 0;
  for (const seed of quoteSeeds) {
    const existing = await prisma.quoteRequest.findUnique({ where: { reference: seed.reference } });
    if (!existing) {
      await prisma.quoteRequest.create({ data: seed });
      createdQuotes++;
    }
  }

  console.log(`  clients: ${Object.keys(clients).length}`);
  console.log(`  shipments created: ${createdShipments}`);
  console.log(`  quote requests created: ${createdQuotes}`);
  console.log("");
  console.log("  Sign in at /admin/login");
  console.log(`    ${adminEmail} / ${adminPassword}`);
  console.log("    operations.almaty@navigatorsealand.com / Operations!2026");
  console.log("");
  console.log(`  Try tracking ${`NSL-${year}-0001`} with projects@example-tienshan.kz`);
  console.log(`  Or ${`NSL-${year}-0007`} — public access is on, so the Tracking ID alone works.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
