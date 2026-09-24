/**
 * Unit tests for the Insights → Tools pure modules. No database required.
 *
 * Run with: npx tsx --test tests/tools.test.ts
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { calculateCbm, toCentimetres } from "../lib/tools/cbm";
import { precheckOog, TRAILER_ENVELOPE } from "../lib/tools/oog";
import { INCOTERMS, SEA_ONLY_CODES, filterIncoterms, getIncoterm } from "../lib/tools/incoterms";
import { EQUIPMENT_TABLES } from "../lib/tools/equipment";

describe("calculateCbm", () => {
  test("one cubic metre piece: 1 cbm, 166.67 kg air, 1,000 kg sea, 333 kg road", () => {
    const r = calculateCbm({ lengthCm: 100, widthCm: 100, heightCm: 100, pieces: 1, grossWeightKgPerPiece: 50 });
    assert.equal(r.cbmPerPiece, 1);
    assert.equal(r.totalCbm, 1);
    assert.equal(r.totalGrossKg, 50);
    assert.equal(r.airVolumetricKg, 167);
    assert.equal(r.seaVolumetricKg, 1000);
    assert.equal(r.roadVolumetricKg, 333);
    assert.equal(r.airChargeableKg, 167);
    assert.equal(r.seaChargeableKg, 1000);
    assert.equal(r.roadChargeableKg, 333);
    assert.equal(r.airBasis, "volumetric");
  });

  test("gross weight governs when heavier than volumetric", () => {
    const r = calculateCbm({ lengthCm: 120, widthCm: 80, heightCm: 100, pieces: 2, grossWeightKgPerPiece: 400 });
    assert.equal(r.cbmPerPiece, 0.96);
    assert.equal(r.totalCbm, 1.92);
    assert.equal(r.totalGrossKg, 800);
    assert.equal(r.airVolumetricKg, 320);
    assert.equal(r.airChargeableKg, 800);
    assert.equal(r.airBasis, "gross");
    assert.equal(r.seaChargeableKg, 1920);
    assert.equal(r.seaBasis, "volumetric");
    assert.equal(r.roadChargeableKg, 800);
  });

  test("rounds cbm to 3 dp and weights to whole kg", () => {
    const r = calculateCbm({ lengthCm: 33, widthCm: 33, heightCm: 33, pieces: 1, grossWeightKgPerPiece: 1.4 });
    assert.equal(r.cbmPerPiece, 0.036);
    assert.equal(r.airVolumetricKg, 6);
    assert.equal(r.totalGrossKg, 1);
  });

  test("invalid input yields zeros rather than NaN", () => {
    const r = calculateCbm({ lengthCm: NaN, widthCm: -5, heightCm: 100, pieces: 0, grossWeightKgPerPiece: 10 });
    assert.equal(r.totalCbm, 0);
    assert.equal(r.totalGrossKg, 0);
    assert.equal(r.airChargeableKg, 0);
  });

  test("unit conversion to centimetres", () => {
    assert.equal(toCentimetres(1, "m"), 100);
    assert.equal(toCentimetres(250, "mm"), 25);
    assert.equal(toCentimetres(10, "in"), 25.4);
    assert.equal(toCentimetres(-1, "cm"), 0);
  });
});

describe("precheckOog", () => {
  test("cargo inside the trailer envelope is standard", () => {
    const r = precheckOog({ lengthM: 6, widthM: 2.4, heightM: 2.5, weightT: 18 });
    assert.equal(r.verdict, "standard");
    assert.deepEqual(r.exceeded, []);
    assert.equal(r.fits.find((f) => f.equipment.startsWith("40'"))?.fits, false); // 2.4 m wide > 2.35 m internal
  });

  test("over-height cargo is oog and lists the exceeded dimension", () => {
    const r = precheckOog({ lengthM: 6, widthM: 2.4, heightM: 3.2, weightT: 18 });
    assert.equal(r.verdict, "oog");
    assert.deepEqual(r.exceeded, [{ limit: "Height", value: 3.2, max: TRAILER_ENVELOPE.heightM, unit: "m" }]);
  });

  test("over-payload cargo within dimensions is heavy", () => {
    const r = precheckOog({ lengthM: 4, widthM: 2, heightM: 2, weightT: 30 });
    assert.equal(r.verdict, "heavy");
    assert.equal(r.exceeded.length, 1);
    assert.equal(r.exceeded[0]?.limit, "Weight");
    assert.equal(r.fits.every((f) => f.fits === false), true); // 30 t exceeds both container payloads
  });

  test("over both is oog-heavy", () => {
    const r = precheckOog({ lengthM: 14, widthM: 3, heightM: 3, weightT: 60 });
    assert.equal(r.verdict, "oog-heavy");
    assert.equal(r.exceeded.length, 4);
  });

  test("exactly at the limit is still standard", () => {
    const r = precheckOog({ lengthM: 13.6, widthM: 2.55, heightM: 2.7, weightT: 24 });
    assert.equal(r.verdict, "standard");
  });

  test("small cargo fits a 20' GP and a 40' HC", () => {
    const r = precheckOog({ lengthM: 5, widthM: 2.2, heightM: 2.2, weightT: 10 });
    assert.equal(r.fits.every((f) => f.fits), true);
  });

  test("notes always say permits and a route survey decide", () => {
    for (const input of [
      { lengthM: 1, widthM: 1, heightM: 1, weightT: 1 },
      { lengthM: 20, widthM: 4, heightM: 4, weightT: 80 },
    ]) {
      const r = precheckOog(input);
      assert.ok(r.notes.some((n) => /permits and a route survey/i.test(n)));
    }
  });
});

describe("Incoterms 2020 data", () => {
  test("exactly 11 rules with unique codes", () => {
    assert.equal(INCOTERMS.length, 11);
    assert.equal(new Set(INCOTERMS.map((t) => t.code)).size, 11);
  });

  test("sea-only rules are exactly FAS, FOB, CFR, CIF", () => {
    const sea = INCOTERMS.filter((t) => t.mode === "sea").map((t) => t.code).sort();
    assert.deepEqual(sea, [...SEA_ONLY_CODES].sort());
    assert.equal(filterIncoterms("sea").length, 4);
    assert.equal(filterIncoterms("any").length, 7);
    assert.equal(filterIncoterms("all").length, 11);
  });

  test("only CIP and CIF oblige the seller to insure, at (A) and (C) respectively", () => {
    const insured = INCOTERMS.filter((t) => t.insurance !== "none").map((t) => [t.code, t.insurance]);
    assert.deepEqual(insured.sort(), [
      ["CIF", "seller-icc-c"],
      ["CIP", "seller-icc-a"],
    ]);
  });

  test("EXW is the only rule where the buyer clears export; DDP the only one where the seller clears import", () => {
    assert.deepEqual(INCOTERMS.filter((t) => t.exportClearance === "buyer").map((t) => t.code), ["EXW"]);
    assert.deepEqual(INCOTERMS.filter((t) => t.importClearance === "seller").map((t) => t.code), ["DDP"]);
  });

  test("E and F groups leave main carriage to the buyer; C and D to the seller", () => {
    for (const t of INCOTERMS) {
      const expected = t.group === "E" || t.group === "F" ? "buyer" : "seller";
      assert.equal(t.mainCarriage, expected, t.code);
    }
  });

  test("every rule has a watch-out and lookup is case-insensitive", () => {
    for (const t of INCOTERMS) assert.ok(t.watchOut.length > 20, t.code);
    assert.equal(getIncoterm("fca")?.name, "Free Carrier");
    assert.equal(getIncoterm("XYZ"), undefined);
  });
});

describe("Equipment tables", () => {
  test("three categories, every row populates every column", () => {
    assert.deepEqual(
      EQUIPMENT_TABLES.map((t) => t.id),
      ["containers", "trailers", "wagons"],
    );
    for (const table of EQUIPMENT_TABLES) {
      assert.ok(table.rows.length > 0, table.id);
      for (const row of table.rows) {
        for (const column of table.columns) {
          assert.ok(typeof row[column.key] === "string" && row[column.key].length > 0, `${row.name}: ${column.key}`);
        }
      }
    }
  });
});
