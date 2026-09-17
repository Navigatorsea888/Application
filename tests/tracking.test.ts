/**
 * Tests for the parts of the system where a mistake is expensive: who can see
 * a shipment, and whether the timeline tells the client the truth.
 *
 * Run with: npm test   (requires a seeded database — npm run setup)
 */
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

import { buildTimeline, lookupShipment, type PublicShipment } from "../lib/shipments";
import { isValidTrackingId, normalizeTrackingId, nextTrackingId } from "../lib/tracking-id";
import {
  MILESTONE_STATUSES,
  PROGRESS_STATUSES,
  SHIPMENT_STATUSES,
  parseList,
  serializeList,
  statusLabel,
} from "../lib/constants";
import { shipmentSchema, quoteRequestSchema, checkpointSchema } from "../lib/validation";

const prisma = new PrismaClient();

/** A shipment fixture created and torn down by the access-control tests. */
let fixtureId: string | null = null;
const FIXTURE_TRACKING_ID = "NSL-9999-0001";

before(async () => {
  await prisma.shipment.deleteMany({ where: { trackingId: FIXTURE_TRACKING_ID } });
  const shipment = await prisma.shipment.create({
    data: {
      trackingId: FIXTURE_TRACKING_ID,
      contractRef: "TEST-CONTRACT-1",
      shipperName: "Test Shipper",
      consigneeName: "Test Consignee",
      consigneeEmail: "consignee@test.example",
      originCity: "Almaty",
      originCountry: "Kazakhstan",
      destinationCity: "Tashkent",
      destinationCountry: "Uzbekistan",
      cargoDescription: "Test cargo",
      modes: "ROAD",
      status: "IN_TRANSIT",
      isPublicAccess: false,
    },
  });
  fixtureId = shipment.id;

  await prisma.checkpoint.createMany({
    data: [
      {
        shipmentId: shipment.id,
        status: "BOOKING_CONFIRMED",
        location: "Almaty",
        occurredAt: new Date("2026-01-01T09:00:00Z"),
        isClientVisible: true,
      },
      {
        shipmentId: shipment.id,
        status: "IN_TRANSIT",
        location: "En route",
        occurredAt: new Date("2026-01-05T09:00:00Z"),
        isClientVisible: true,
      },
      {
        shipmentId: shipment.id,
        status: "IN_TRANSIT",
        location: "Internal margin note",
        remarks: "Commercially sensitive — must never reach the client.",
        occurredAt: new Date("2026-01-06T09:00:00Z"),
        isClientVisible: false,
      },
    ],
  });
});

after(async () => {
  if (fixtureId) await prisma.shipment.delete({ where: { id: fixtureId } }).catch(() => {});
  await prisma.$disconnect();
});

describe("Tracking ID", () => {
  test("accepts the documented format", () => {
    assert.ok(isValidTrackingId("NSL-2026-0001"));
    assert.ok(isValidTrackingId("nsl-2026-0001"), "case-insensitive");
    assert.ok(isValidTrackingId("  NSL-2026-00012  "), "tolerates padding and 5-digit sequences");
  });

  test("rejects anything else", () => {
    for (const bad of ["NSL-26-0001", "ABC-2026-0001", "NSL-2026-001", "", "NSL20260001"]) {
      assert.equal(isValidTrackingId(bad), false, `should reject: ${bad}`);
    }
  });

  test("normalizes user input", () => {
    assert.equal(normalizeTrackingId("  nsl-2026-0001 "), "NSL-2026-0001");
    assert.equal(normalizeTrackingId("NSL 2026 0001"), "NSL20260001");
  });

  test("allocates the next sequence for the year", async () => {
    const id = await nextTrackingId(2031);
    assert.equal(id, "NSL-2031-0001", "first of an unused year");
  });
});

describe("Tracking access control", () => {
  test("an unknown Tracking ID is NOT_FOUND", async () => {
    const result = await lookupShipment("NSL-9999-8888");
    assert.equal(result.outcome, "NOT_FOUND");
  });

  test("a protected shipment requires verification", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID);
    assert.equal(result.outcome, "VERIFICATION_REQUIRED");
  });

  test("a wrong verification value is rejected", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID, "attacker@evil.example");
    assert.equal(result.outcome, "VERIFICATION_FAILED");
  });

  test("the consignee email opens it", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID, "consignee@test.example");
    assert.equal(result.outcome, "FOUND");
  });

  test("verification is case-insensitive and trims whitespace", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID, "  CONSIGNEE@Test.Example  ");
    assert.equal(result.outcome, "FOUND", "clients paste these out of emails");
  });

  test("the contract reference also opens it", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID, "TEST-CONTRACT-1");
    assert.equal(result.outcome, "FOUND");
  });

  test("an empty verification string does not bypass the check", async () => {
    for (const value of ["", "   ", null, undefined]) {
      const result = await lookupShipment(FIXTURE_TRACKING_ID, value as string | null);
      assert.equal(result.outcome, "VERIFICATION_REQUIRED", `bypassed with: ${JSON.stringify(value)}`);
    }
  });

  test("internal-only checkpoints never reach the client", async () => {
    const result = await lookupShipment(FIXTURE_TRACKING_ID, "consignee@test.example");
    assert.equal(result.outcome, "FOUND");
    if (result.outcome !== "FOUND") return;

    const serialized = JSON.stringify(result.shipment);
    assert.ok(
      !serialized.includes("Commercially sensitive"),
      "an internal checkpoint leaked into the public payload",
    );
    assert.equal(result.shipment.checkpoints.length, 2, "only the two visible checkpoints");
  });

  test("an internal checkpoint hides its attachments, however they are flagged", async () => {
    // Precedence matters: marking an attachment client-visible must not leak it
    // out from under a checkpoint operations kept internal.
    const internalCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { shipmentId: fixtureId!, isClientVisible: false },
    });
    const attachment = await prisma.attachment.create({
      data: {
        checkpointId: internalCheckpoint.id,
        fileName: "commercial.pdf",
        storagePath: "/api/files/test/never-served.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1,
        caption: "SHOULD-NOT-APPEAR",
        isClientVisible: true,
      },
    });

    try {
      const result = await lookupShipment(FIXTURE_TRACKING_ID, "consignee@test.example");
      assert.equal(result.outcome, "FOUND");
      if (result.outcome !== "FOUND") return;

      assert.ok(
        !JSON.stringify(result.shipment).includes("SHOULD-NOT-APPEAR"),
        "an attachment on an internal checkpoint leaked to the client",
      );
    } finally {
      await prisma.attachment.delete({ where: { id: attachment.id } });
    }
  });

  test("an internal attachment on a visible checkpoint is still hidden", async () => {
    const visibleCheckpoint = await prisma.checkpoint.findFirstOrThrow({
      where: { shipmentId: fixtureId!, isClientVisible: true },
    });
    const attachment = await prisma.attachment.create({
      data: {
        checkpointId: visibleCheckpoint.id,
        fileName: "internal.pdf",
        storagePath: "/api/files/test/internal.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1,
        caption: "INTERNAL-ONLY-MARKER",
        isClientVisible: false,
      },
    });

    try {
      const result = await lookupShipment(FIXTURE_TRACKING_ID, "consignee@test.example");
      assert.equal(result.outcome, "FOUND");
      if (result.outcome !== "FOUND") return;

      assert.ok(!JSON.stringify(result.shipment).includes("INTERNAL-ONLY-MARKER"));
    } finally {
      await prisma.attachment.delete({ where: { id: attachment.id } });
    }
  });

  test("a public-access shipment opens with the Tracking ID alone", async () => {
    await prisma.shipment.update({ where: { id: fixtureId! }, data: { isPublicAccess: true } });
    try {
      const result = await lookupShipment(FIXTURE_TRACKING_ID);
      assert.equal(result.outcome, "FOUND");
    } finally {
      await prisma.shipment.update({ where: { id: fixtureId! }, data: { isPublicAccess: false } });
    }
  });
});

describe("Timeline", () => {
  function fixture(overrides: Partial<PublicShipment> = {}): PublicShipment {
    return {
      trackingId: "NSL-2026-0001",
      status: "IN_TRANSIT",
      exceptionFlag: null,
      exceptionNote: null,
      consigneeName: "Test",
      contractRef: null,
      projectName: null,
      originCity: "A",
      originCountry: "X",
      destinationCity: "B",
      destinationCountry: "Y",
      portOfLoading: null,
      portOfDischarge: null,
      corridors: null,
      modes: "ROAD",
      cargoDescription: "Cargo",
      commodity: null,
      packageCount: null,
      packageType: null,
      weightKg: null,
      isOOG: false,
      etd: null,
      eta: null,
      actualDelivery: null,
      checkpoints: [],
      ...overrides,
    };
  }

  test("shows every stage of the movement, not only those reached", () => {
    const { stages } = buildTimeline(fixture());
    assert.equal(stages.length, PROGRESS_STATUSES.length);
  });

  test("marks earlier stages done, the current one current, later ones upcoming", () => {
    const { stages } = buildTimeline(fixture({ status: "IN_TRANSIT" }));
    const state = (status: string) => stages.find((s) => s.status === status)!.state;

    assert.equal(state("BOOKING_CONFIRMED"), "DONE");
    assert.equal(state("CUSTOMS_EXPORT"), "DONE");
    assert.equal(state("IN_TRANSIT"), "CURRENT");
    assert.equal(state("ARRIVED_HUB"), "UPCOMING");
    assert.equal(state("DELIVERED"), "UPCOMING");
  });

  test("an exception state does not become a stage of its own", () => {
    const { stages, isException, exceptionLabel } = buildTimeline(fixture({ status: "DELAYED" }));

    assert.equal(isException, true);
    assert.equal(exceptionLabel, "Delayed");
    assert.ok(
      !stages.some((stage) => SHIPMENT_STATUSES[stage.status].isException),
      "exception statuses must not appear as timeline stages",
    );
  });

  test("progress survives an exception: the furthest checkpoint reached still counts", () => {
    const { stages } = buildTimeline(
      fixture({
        status: "DELAYED",
        checkpoints: [
          {
            id: "1",
            status: "BORDER_CROSSING",
            location: "Khorgos",
            country: null,
            leg: null,
            occurredAt: new Date("2026-01-02"),
            remarks: null,
            attachments: [],
          },
        ],
      }),
    );

    const border = stages.find((s) => s.status === "BORDER_CROSSING")!;
    assert.equal(border.state, "CURRENT", "a delayed shipment should not appear to have lost its progress");
    assert.equal(stages.find((s) => s.status === "CUSTOMS_EXPORT")!.state, "DONE");
  });

  test("an exception checkpoint is attached to the current stage", () => {
    const { stages } = buildTimeline(
      fixture({
        status: "DELAYED",
        checkpoints: [
          {
            id: "1",
            status: "IN_TRANSIT",
            location: "En route",
            country: null,
            leg: null,
            occurredAt: new Date("2026-01-02"),
            remarks: null,
            attachments: [],
          },
          {
            id: "2",
            status: "DELAYED",
            location: "Aktau",
            country: null,
            leg: null,
            occurredAt: new Date("2026-01-04"),
            remarks: "Weather",
            attachments: [],
          },
        ],
      }),
    );

    const withException = stages.filter((s) => s.events.some((e) => e.status === "DELAYED"));
    assert.equal(withException.length, 1, "the delay must appear exactly once");
    assert.equal(withException[0]!.state, "CURRENT");
  });

  test("the current stage follows the shipment status, not the furthest checkpoint", () => {
    // A corridor movement is not monotonic: road, border, road, border. A
    // checkpoint against a later stage must not overrule what operations say
    // the position is.
    const { stages } = buildTimeline(
      fixture({
        status: "IN_TRANSIT",
        checkpoints: [
          {
            id: "1",
            status: "BORDER_CROSSING",
            location: "Khorgos",
            country: null,
            leg: null,
            occurredAt: new Date("2026-01-08"),
            remarks: null,
            attachments: [],
          },
          {
            id: "2",
            status: "IN_TRANSIT",
            location: "Khorgos → Almaty",
            country: null,
            leg: "RAIL",
            occurredAt: new Date("2026-01-10"),
            remarks: null,
            attachments: [],
          },
        ],
      }),
    );

    const inTransit = stages.find((s) => s.status === "IN_TRANSIT")!;
    const border = stages.find((s) => s.status === "BORDER_CROSSING")!;

    assert.equal(inTransit.state, "CURRENT", "the shipment status is the position of record");
    assert.equal(border.state, "DONE", "a stage with checkpoints against it has demonstrably happened");
    assert.equal(
      stages.filter((s) => s.state === "CURRENT").length,
      1,
      "exactly one stage may be current",
    );
  });

  test("the connector runs to the furthest stage reached", () => {
    const { stages } = buildTimeline(
      fixture({
        status: "IN_TRANSIT",
        checkpoints: [
          {
            id: "1",
            status: "BORDER_CROSSING",
            location: "Khorgos",
            country: null,
            leg: null,
            occurredAt: new Date("2026-01-08"),
            remarks: null,
            attachments: [],
          },
        ],
      }),
    );

    assert.equal(stages.find((s) => s.status === "IN_TRANSIT")!.passed, true);
    assert.equal(stages.find((s) => s.status === "BORDER_CROSSING")!.passed, false, "the frontier itself");
    assert.equal(stages.find((s) => s.status === "ARRIVED_HUB")!.passed, false);
  });

  test("a delivered shipment shows every stage done or current", () => {
    const { stages } = buildTimeline(fixture({ status: "DELIVERED" }));
    assert.ok(!stages.some((s) => s.state === "UPCOMING"), "nothing is still upcoming after delivery");
    assert.equal(stages.at(-1)!.state, "CURRENT");
  });
});

describe("Status vocabulary", () => {
  test("every milestone is a real status", () => {
    for (const status of MILESTONE_STATUSES) {
      assert.ok(SHIPMENT_STATUSES[status], `${status} is not defined`);
    }
  });

  test("notifications fire on milestones only, not on every checkpoint", () => {
    assert.ok(MILESTONE_STATUSES.length < Object.keys(SHIPMENT_STATUSES).length);
    assert.ok(MILESTONE_STATUSES.includes("DELIVERED"));
    assert.ok(MILESTONE_STATUSES.includes("DELAYED"));
    assert.ok(!MILESTONE_STATUSES.includes("CUSTOMS_EXPORT"), "too noisy to notify on");
  });

  test("the happy path is strictly ordered with no gaps or ties", () => {
    const orders = PROGRESS_STATUSES.map((s) => SHIPMENT_STATUSES[s].order);
    assert.deepEqual(orders, [...orders].sort((a, b) => a - b));
    assert.equal(new Set(orders).size, orders.length, "two stages share an order");
  });

  test("an unknown status falls back to its raw key rather than throwing", () => {
    assert.equal(statusLabel("NOT_A_STATUS"), "NOT_A_STATUS");
  });
});

describe("List columns", () => {
  test("round-trip", () => {
    assert.deepEqual(parseList(serializeList(["ROAD", "RAIL"])), ["ROAD", "RAIL"]);
  });

  test("empty input becomes null, not an empty string", () => {
    assert.equal(serializeList([]), null);
    assert.equal(serializeList(undefined), null);
  });

  test("blank and duplicate entries are dropped", () => {
    assert.equal(serializeList(["ROAD", "", "  ", "ROAD", "SEA"]), "ROAD,SEA");
    assert.deepEqual(parseList("ROAD, ,SEA,"), ["ROAD", "SEA"]);
  });

  test("parsing a null column yields an empty array", () => {
    assert.deepEqual(parseList(null), []);
    assert.deepEqual(parseList(undefined), []);
  });
});

describe("Validation", () => {
  const validShipment = {
    shipperName: "S",
    consigneeName: "C",
    originCity: "A",
    originCountry: "X",
    destinationCity: "B",
    destinationCountry: "Y",
    cargoDescription: "Cargo",
    modes: "ROAD",
    status: "BOOKING_CONFIRMED",
  };

  test("accepts a minimal valid shipment", () => {
    assert.equal(shipmentSchema.safeParse(validShipment).success, true);
  });

  test("requires at least one mode of transport", () => {
    const result = shipmentSchema.safeParse({ ...validShipment, modes: "" });
    assert.equal(result.success, false);
  });

  test("rejects an ETA before the ETD", () => {
    const result = shipmentSchema.safeParse({
      ...validShipment,
      etd: "2026-06-10",
      eta: "2026-06-01",
    });
    assert.equal(result.success, false);
    assert.ok(result.error!.issues.some((i) => i.path.includes("eta")));
  });

  test("OOG cargo must carry at least one dimension", () => {
    const withoutDimensions = shipmentSchema.safeParse({ ...validShipment, isOOG: "on" });
    assert.equal(withoutDimensions.success, false, "a permit cannot be applied for without dimensions");

    const withDimensions = shipmentSchema.safeParse({ ...validShipment, isOOG: "on", lengthCm: "1200" });
    assert.equal(withDimensions.success, true);
  });

  test("rejects an unknown status", () => {
    assert.equal(shipmentSchema.safeParse({ ...validShipment, status: "TELEPORTED" }).success, false);
  });

  test("empty optional numbers stay undefined rather than becoming zero", () => {
    const result = shipmentSchema.safeParse({ ...validShipment, weightKg: "" });
    assert.equal(result.success, true);
    assert.equal(result.data!.weightKg, undefined, "blank must not be recorded as a weight of 0 kg");
  });

  test("a checkpoint needs a status, a location and a time", () => {
    assert.equal(checkpointSchema.safeParse({ status: "IN_TRANSIT", location: "X" }).success, false);
    assert.equal(
      checkpointSchema.safeParse({
        status: "IN_TRANSIT",
        location: "Khorgos",
        occurredAt: "2026-06-01T10:00",
      }).success,
      true,
    );
  });

  test("a quote request needs a valid email", () => {
    const base = {
      companyName: "Co",
      contactPerson: "P",
      originCity: "A",
      originCountry: "X",
      destinationCity: "B",
      destinationCountry: "Y",
      cargoDescription: "Cargo",
    };
    assert.equal(quoteRequestSchema.safeParse({ ...base, email: "not-an-email" }).success, false);
    assert.equal(quoteRequestSchema.safeParse({ ...base, email: "a@b.com" }).success, true);
  });

  test("notification emails must be a valid comma-separated list", () => {
    assert.equal(
      shipmentSchema.safeParse({ ...validShipment, notifyEmails: "a@b.com, c@d.com" }).success,
      true,
    );
    assert.equal(
      shipmentSchema.safeParse({ ...validShipment, notifyEmails: "a@b.com, broken" }).success,
      false,
    );
  });
});
