import assert from "node:assert";
import test from "node:test";
import fs from "fs/promises";
import { Transaction, Loop, FieldMap, LoopMap } from "./index.js";

test("Load Modules", async function () {
  Transaction.default = Transaction;
  Loop.default = Loop;
  FieldMap.default = FieldMap;
  LoopMap.default = LoopMap;

  assert(Transaction.default);
  assert(Loop.default);
  assert(FieldMap.default);
  assert(LoopMap.default);
});

test("generate segments", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  assert.strictEqual(transaction.getSegments().length, 25);
});

test("get segments", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const segments = transaction.getSegments();

  assert.strictEqual(segments.length, 25);
  assert.strictEqual(segments[0].name, "ISA");
  assert.strictEqual(segments[1].name, "GS");
  assert.strictEqual(segments[2].name, "ST");
  assert.strictEqual(segments[3].name, "W17");
  assert.strictEqual(segments[4].name, "N1");
  assert.strictEqual(segments[5].name, "W08");
  assert.strictEqual(segments[6].name, "W07");
  assert.strictEqual(segments[7].name, "N9");
  assert.strictEqual(segments[8].name, "W20");
  assert.strictEqual(segments[9].name, "W07");
  assert.strictEqual(segments[10].name, "N9");
  assert.strictEqual(segments[11].name, "W20");
  assert.strictEqual(segments[12].name, "W07");
  assert.strictEqual(segments[13].name, "N9");
  assert.strictEqual(segments[14].name, "W20");
  assert.strictEqual(segments[15].name, "W07");
  assert.strictEqual(segments[16].name, "N9");
  assert.strictEqual(segments[17].name, "W20");
  assert.strictEqual(segments[18].name, "W07");
  assert.strictEqual(segments[19].name, "N9");
  assert.strictEqual(segments[20].name, "W20");
  assert.strictEqual(segments[21].name, "W14");
  assert.strictEqual(segments[22].name, "SE");
  assert.strictEqual(segments[23].name, "GE");
  assert.strictEqual(segments[24].name, "IEA");
});

test("list segment identifiers", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const identifiers = transaction.listSegmentIdentifiers();

  assert.strictEqual(identifiers.length, 25);
  assert.strictEqual(identifiers[0], "ISA");
  assert.strictEqual(identifiers[1], "GS");
  assert.strictEqual(identifiers[2], "ST");
  assert.strictEqual(identifiers[3], "W17");
  assert.strictEqual(identifiers[4], "N1");
  assert.strictEqual(identifiers[5], "W08");
  assert.strictEqual(identifiers[6], "W07");
  assert.strictEqual(identifiers[7], "N9");
  assert.strictEqual(identifiers[8], "W20");
  assert.strictEqual(identifiers[9], "W07");
  assert.strictEqual(identifiers[10], "N9");
  assert.strictEqual(identifiers[11], "W20");
  assert.strictEqual(identifiers[12], "W07");
  assert.strictEqual(identifiers[13], "N9");
  assert.strictEqual(identifiers[14], "W20");
  assert.strictEqual(identifiers[15], "W07");
  assert.strictEqual(identifiers[16], "N9");
  assert.strictEqual(identifiers[17], "W20");
  assert.strictEqual(identifiers[18], "W07");
  assert.strictEqual(identifiers[19], "N9");
  assert.strictEqual(identifiers[20], "W20");
  assert.strictEqual(identifiers[21], "W14");
  assert.strictEqual(identifiers[22], "SE");
  assert.strictEqual(identifiers[23], "GE");
  assert.strictEqual(identifiers[24], "IEA");
});

test("get transaction type", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const { content: type } = transaction.getType();

  assert.strictEqual(type, "944");
});

test("invalid ST segment", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const ST = transaction.getSegments().find((segment) => segment.name === "ST");

  transaction.removeSegment(ST);

  assert.throws(
    () => {
      transaction.getType();
    },
    { message: "No ST segment found" }
  );
});

test("generate loops", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const itemLoop = new Loop();

  itemLoop.setPosition(0);

  itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);

  transaction.addLoop(itemLoop);

  transaction.runLoops();

  assert.strictEqual(transaction.getLoops().length, 1);
});

test("to JSON", async function () {
  const test_file = await fs.readFile("test.edi", "utf-8");

  const transaction = new Transaction();

  transaction.generateSegments(test_file);

  const itemLoop = new Loop();

  itemLoop.setPosition(0);

  itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);

  transaction.addLoop(itemLoop);

  transaction.runLoops();

  const json = transaction.toJSON();

  assert.strictEqual(json.loops.length, 1);
  assert.strictEqual(json.segments.length, 25);
});

test("map segments", async function () {
  const file = await fs.readFile("test.edi", "utf8");

  const transaction = new Transaction();

  transaction.generateSegments(file);

  const itemLoop = new Loop();

  itemLoop.setPosition(0);

  itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);

  transaction.addLoop(itemLoop);
  transaction.runLoops();

  const mapLogic = {
    header: {
      transmissionDate: new FieldMap({
        segmentIdentifier: "GS",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 3,
      }),
      warehouseReceiptNumber: new FieldMap({
        segmentIdentifier: "W17",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 2,
      }),
      warehouse: {
        name: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 1,
        }),
        code: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 3,
        }),
      },
    },
    detail: {
      items: new LoopMap({
        position: 0,
        values: {
          itemCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 4,
          }),
          lotCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 7,
          }),
          productionDate: new FieldMap({
            segmentIdentifier: "N9",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 1,
          }),
          netWeight: new FieldMap({
            segmentIdentifier: "W20",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 3,
          }),
          quantity: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 0,
          }),
        },
      }),
    },
  };

  const mapped = transaction.mapSegments(mapLogic, transaction.getSegments());

  assert.strictEqual(mapped.header.transmissionDate, "20230929");
  assert.strictEqual(mapped.header.warehouseReceiptNumber, "4280");
  assert.strictEqual(mapped.header.warehouse.name, "Distribution Center");
  assert.strictEqual(mapped.header.warehouse.code, "PC1234");
  assert.strictEqual(mapped.detail.items.length, 5);
  assert.strictEqual(mapped.detail.items[0].itemCode, "100000154");
  assert.strictEqual(mapped.detail.items[1].lotCode, "22413963");
});
