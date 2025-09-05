import assert from "node:assert";
import test from "node:test";
import fs from "fs/promises";
import {
  Transaction,
  Loop,
  FieldMap,
  LoopMap,
  RepeatingSegmentMap,
} from "./index.js";
import { Transaction944 } from "./maps/944.js";

const FILE_944 = await fs.readFile("./maps/examples/944.edi", "utf8");
const FILE_990 = await fs.readFile("./maps/examples/990.edi", "utf8");

test("Load Modules", async function () {
  Transaction.default = Transaction;
  Loop.default = Loop;
  FieldMap.default = FieldMap;
  LoopMap.default = LoopMap;
  RepeatingSegmentMap.default = RepeatingSegmentMap;

  assert(Transaction.default);
  assert(Loop.default);
  assert(FieldMap.default);
  assert(LoopMap.default);
  assert(RepeatingSegmentMap.default);
});

test("generate segments", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

  assert.strictEqual(transaction.getSegments().length, 25);
});

test("generate segments with custom delimiter", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944, "\n", "*");

  assert.strictEqual(transaction.getSegments().length, 25);
});

test("get segments", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

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
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

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
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

  const { content: type } = transaction.getType();

  assert.strictEqual(type, "944");
});

test("invalid ST segment", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

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
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

  const itemLoop = new Loop();

  itemLoop.setPosition(0);

  itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);

  transaction.addLoop(itemLoop);

  transaction.runLoops();

  assert.strictEqual(transaction.getLoops().length, 1);
});

test("to JSON", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

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
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

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

test("944 map to JSON", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

  transaction.inferLoops();

  const mapped = transaction.mapSegments(Transaction944);

  assert.strictEqual(mapped.header.functionalGroupHeader.Date, "20230929");
  assert.strictEqual(
    mapped.header.warehouseReceiptInformation.ReceiptNumber,
    "4280"
  );
  assert.strictEqual(mapped.header.warehouse.Name, "Distribution Center");
  assert.strictEqual(mapped.header.warehouse.IdentificationCode, "PC1234");
});

test("944 map to X12", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_944);

  transaction.inferLoops();

  const customMapLogic = {
    envelope: {
      ISA: {
        authInfoQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 1,
        }),
        authInfo: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 2 }),
        securityInfoQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 3,
        }),
        securityInfo: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 4,
        }),
        senderQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 5,
        }),
        senderId: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 6 }),
        receiverQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 7,
        }),
        receiverId: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 8,
        }),
        date: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 9 }),
        time: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 10 }),
        version: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 12 }),
        controlNumber: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 13,
        }),
      },
      GS: {
        functionalIdCode: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 1,
        }),
        senderCode: new FieldMap({ segmentIdentifier: "GS", valuePosition: 2 }),
        receiverCode: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 3,
        }),
        date: new FieldMap({ segmentIdentifier: "GS", valuePosition: 4 }),
        time: new FieldMap({ segmentIdentifier: "GS", valuePosition: 5 }),
        groupControlNumber: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 6,
        }),
        version: new FieldMap({ segmentIdentifier: "GS", valuePosition: 8 }),
      },
      ST: {
        transactionSetId: new FieldMap({
          segmentIdentifier: "ST",
          valuePosition: 0,
        }),
        controlNumber: new FieldMap({
          segmentIdentifier: "ST",
          valuePosition: 1,
        }),
      },
    },
    header: {
      W17: {
        purposeCode: new FieldMap({
          segmentIdentifier: "W17",
          valuePosition: 0,
        }),
        date: new FieldMap({ segmentIdentifier: "W17", valuePosition: 1 }),
        receiptNumber: new FieldMap({
          segmentIdentifier: "W17",
          valuePosition: 2,
        }),
        shipmentId: new FieldMap({
          segmentIdentifier: "W17",
          valuePosition: 3,
        }),
      },
      warehouse: {
        name: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 1,
        }),
        codeQualifier: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 2,
        }),
        code: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 3,
        }),
      },
      W08: {
        actionCode: new FieldMap({
          segmentIdentifier: "W08",
          valuePosition: 0,
        }),
        referenceId: new FieldMap({
          segmentIdentifier: "W08",
          valuePosition: 1,
        }),
        shipmentMethodOfPayment: new FieldMap({
          segmentIdentifier: "W08",
          valuePosition: 4,
        }),
        scac: new FieldMap({ segmentIdentifier: "W08", valuePosition: 5 }),
      },
    },
    detail: {
      items: new LoopMap({
        position: 0,
        values: {
          quantity: new FieldMap({
            segmentIdentifier: "W07",
            valuePosition: 0,
          }),
          uom: new FieldMap({ segmentIdentifier: "W07", valuePosition: 1 }),
          vendorPart: new FieldMap({
            segmentIdentifier: "W07",
            valuePosition: 4,
          }),
          lotCode: new FieldMap({ segmentIdentifier: "W07", valuePosition: 7 }),
          productionDate: new FieldMap({
            segmentIdentifier: "N9",
            identifierValue: "PC",
            identifierPosition: 0,
            valuePosition: 1,
          }),
          netWeight: new FieldMap({
            segmentIdentifier: "W20",
            valuePosition: 3,
          }),
          weightQualifier: new FieldMap({
            segmentIdentifier: "W20",
            valuePosition: 4,
          }),
          unitOrBasis: new FieldMap({
            segmentIdentifier: "W20",
            valuePosition: 5,
          }),
        },
      }),
    },
    summary: {
      W14: {
        totalQuantity: new FieldMap({
          segmentIdentifier: "W14",
          valuePosition: 0,
        }),
      },
      SE: {
        segmentCount: new FieldMap({
          segmentIdentifier: "SE",
          valuePosition: 0,
        }),
        controlNumber: new FieldMap({
          segmentIdentifier: "SE",
          valuePosition: 1,
        }),
      },
      GE: {
        numberOfTransactions: new FieldMap({
          segmentIdentifier: "GE",
          valuePosition: 0,
        }),
        groupControlNumber: new FieldMap({
          segmentIdentifier: "GE",
          valuePosition: 1,
        }),
      },
      IEA: {
        numberOfGroups: new FieldMap({
          segmentIdentifier: "IEA",
          valuePosition: 0,
        }),
        interchangeControlNumber: new FieldMap({
          segmentIdentifier: "IEA",
          valuePosition: 1,
        }),
      },
    },
  };

  const json = transaction.mapSegments(customMapLogic);

  assert.strictEqual(json.envelope.ISA.authInfo, "00");

  const x12Transaction = new Transaction(); // To satisfy linter

  const x12 = x12Transaction.toX12(json, customMapLogic);

  assert.strictEqual(x12.charAt(0), "I");
});

test("990 map to X12", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_990);

  transaction.inferLoops();

  const customMapLogic = {
    envelope: {
      ISA: {
        authInfoQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 0,
        }),
        authInfo: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 1 }),
        securityInfoQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 2,
        }),
        securityInfo: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 3,
        }),
        senderQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 4,
        }),
        senderId: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 5 }),
        receiverQualifier: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 6,
        }),
        receiverId: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 7,
        }),
        date: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 8 }),
        time: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 9 }),
        standardsId: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 10,
        }),
        version: new FieldMap({ segmentIdentifier: "ISA", valuePosition: 11 }),
        controlNumber: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 12,
        }),
        ackRequested: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 13,
        }),
        usageIndicator: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 14,
        }),
        componentSeparator: new FieldMap({
          segmentIdentifier: "ISA",
          valuePosition: 15,
        }),
      },
      GS: {
        functionalIdCode: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 0,
        }),
        senderCode: new FieldMap({ segmentIdentifier: "GS", valuePosition: 1 }),
        receiverCode: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 2,
        }),
        date: new FieldMap({ segmentIdentifier: "GS", valuePosition: 3 }),
        time: new FieldMap({ segmentIdentifier: "GS", valuePosition: 4 }),
        groupControlNumber: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 5,
        }),
        responsibleAgency: new FieldMap({
          segmentIdentifier: "GS",
          valuePosition: 6,
        }),
        version: new FieldMap({ segmentIdentifier: "GS", valuePosition: 7 }),
      },
    },
    transactions: new LoopMap({
      position: 0,
      values: {
        ST: {
          transactionSetId: new FieldMap({
            segmentIdentifier: "ST",
            valuePosition: 0,
          }),
          controlNumber: new FieldMap({
            segmentIdentifier: "ST",
            valuePosition: 1,
          }),
        },
        B1: {
          scac: new FieldMap({
            segmentIdentifier: "B1",
            valuePosition: 0,
          }),
          shipmentId: new FieldMap({
            segmentIdentifier: "B1",
            valuePosition: 1,
          }),
          date: new FieldMap({
            segmentIdentifier: "B1",
            valuePosition: 2,
          }),
          statusCode: new FieldMap({
            segmentIdentifier: "B1",
            valuePosition: 3,
          }),
        },
        references: new RepeatingSegmentMap({
          segmentIdentifier: "N9",
          values: {
            qualifier: new FieldMap({
              segmentIdentifier: "N9",
              valuePosition: 0,
            }),
            reference: new FieldMap({
              segmentIdentifier: "N9",
              valuePosition: 1,
            }),
          },
        }),
        V9: {
          eventCode: new FieldMap({
            segmentIdentifier: "V9",
            valuePosition: 0,
          }),
        },
        SE: {
          segmentCount: new FieldMap({
            segmentIdentifier: "SE",
            valuePosition: 0,
          }),
          controlNumber: new FieldMap({
            segmentIdentifier: "SE",
            valuePosition: 1,
          }),
        },
      },
    }),
    trailer: {
      GE: {
        numberOfTransactions: new FieldMap({
          segmentIdentifier: "GE",
          valuePosition: 0,
        }),
        groupControlNumber: new FieldMap({
          segmentIdentifier: "GE",
          valuePosition: 1,
        }),
      },
      IEA: {
        numberOfGroups: new FieldMap({
          segmentIdentifier: "IEA",
          valuePosition: 0,
        }),
        interchangeControlNumber: new FieldMap({
          segmentIdentifier: "IEA",
          valuePosition: 1,
        }),
      },
    },
  };

  const json = transaction.mapSegments(customMapLogic);

  assert.strictEqual(json.envelope.ISA.authInfoQualifier, "00");
  assert.strictEqual(json.envelope.ISA.authInfo, "");
  assert.strictEqual(json.envelope.GS.functionalIdCode, "GF");
  assert.strictEqual(json.transactions.length, 3);
  assert.strictEqual(json.transactions[0].ST.transactionSetId, "990");
  assert.strictEqual(json.transactions[0].B1.scac, "SCAC");
  assert.strictEqual(json.transactions[0].B1.statusCode, "A");

  // Test that references are now included with RepeatingSegmentMap
  assert(json.transactions[0].references);
  assert(Array.isArray(json.transactions[0].references));
  assert(json.transactions[0].references.length > 0);
  assert.strictEqual(json.transactions[0].references[0].qualifier, "CN");
  assert.strictEqual(json.transactions[0].references[0].reference, "3216547");

  // Test that multiple references work
  assert(json.transactions[0].references.length >= 3); // First transaction has 3 N9 segments
  assert.strictEqual(json.transactions[0].references[1].qualifier, "CI");
  assert.strictEqual(json.transactions[0].references[1].reference, "AUGBIX2");

  // Note: V9 segment mapping has issues with multiple transactions
  // This is a known limitation when segments appear in different positions across transactions

  const x12 = transaction.toX12(json, customMapLogic);

  assert.strictEqual(x12.charAt(0), "I");
  assert(x12.includes("ST*990*"));
  assert(x12.includes("B1*SCAC*"));
});

test("JSON reviver functionality with _type keys", async function () {
  const transaction = new Transaction();
  transaction.generateSegments(FILE_990);
  transaction.inferLoops();

  // Define map logic as plain JSON with _type keys using correct structure
  const jsonMapLogic = {
    envelope: {
      transactions: {
        _type: "LoopMap",
        position: 0,
        values: {
          B1: {
            standardCarrierAlphaCode: {
              _type: "FieldMap",
              segmentIdentifier: "B1",
              valuePosition: 0,
            },
            shipmentId: {
              _type: "FieldMap",
              segmentIdentifier: "B1",
              valuePosition: 1,
            },
          },
          references: {
            _type: "RepeatingSegmentMap",
            segmentIdentifier: "N9",
            values: {
              qualifier: {
                _type: "FieldMap",
                segmentIdentifier: "N9",
                valuePosition: 0,
              },
              reference: {
                _type: "FieldMap",
                segmentIdentifier: "N9",
                valuePosition: 1,
              },
            },
          },
        },
      },
    },
  };

  const jsonResult = transaction.mapSegments(jsonMapLogic);

  // Verify the structure is the same as when using class instances
  assert.ok(jsonResult.envelope, "JSON reviver: envelope should exist");
  assert.ok(
    jsonResult.envelope.transactions,
    "JSON reviver: transactions should exist"
  );
  assert.ok(
    Array.isArray(jsonResult.envelope.transactions),
    "JSON reviver: transactions should be an array"
  );
  assert.ok(
    jsonResult.envelope.transactions.length > 0,
    "JSON reviver: transactions should have items"
  );
  assert.ok(
    jsonResult.envelope.transactions[0].B1,
    "JSON reviver: first transaction should have B1"
  );
  assert.ok(
    Array.isArray(jsonResult.envelope.transactions[0].references),
    "JSON reviver: references should be an array"
  );
  assert.ok(
    jsonResult.envelope.transactions[0].references.length > 0,
    "JSON reviver: should have reference items"
  );

  console.log(
    "JSON reviver test passed - mapped 990 structure with _type keys"
  );
});

test("Static values in mapLogic", async function () {
  const transaction = new Transaction();
  transaction.generateSegments(FILE_990);
  transaction.inferLoops();

  // Define mapLogic with mix of field mappings and static values
  const mapLogicWithStatics = {
    meta: {
      transactionSet: "990",
      version: "004010",
      partner: "StripMiner / Intelek Technologies (Rev 2)",
      processed: true,
      count: 42,
    },
    envelope: {
      transactions: {
        _type: "LoopMap",
        position: 0,
        values: {
          B1: {
            standardCarrierAlphaCode: {
              _type: "FieldMap",
              segmentIdentifier: "B1",
              valuePosition: 0,
            },
          },
          metadata: {
            source: "EDI_SYSTEM",
            processed: true,
          },
        },
      },
    },
  };

  const result = transaction.mapSegments(mapLogicWithStatics);

  // Verify static values are passed through
  assert.ok(result.meta, "Meta section should exist");
  assert.strictEqual(
    result.meta.transactionSet,
    "990",
    "Static string should be preserved"
  );
  assert.strictEqual(
    result.meta.version,
    "004010",
    "Static string should be preserved"
  );
  assert.strictEqual(
    result.meta.partner,
    "StripMiner / Intelek Technologies (Rev 2)",
    "Static string should be preserved"
  );
  assert.strictEqual(
    result.meta.processed,
    true,
    "Static boolean should be preserved"
  );
  assert.strictEqual(
    result.meta.count,
    42,
    "Static number should be preserved"
  );

  // Verify nested static values work
  assert.ok(
    result.envelope.transactions[0].metadata,
    "Nested metadata should exist"
  );
  assert.strictEqual(
    result.envelope.transactions[0].metadata.source,
    "EDI_SYSTEM",
    "Nested static string should be preserved"
  );
  assert.strictEqual(
    result.envelope.transactions[0].metadata.processed,
    true,
    "Nested static boolean should be preserved"
  );

  // Verify field mappings still work alongside static values
  assert.ok(
    result.envelope.transactions[0].B1,
    "Field mappings should still work"
  );
  assert.ok(
    result.envelope.transactions[0].B1.standardCarrierAlphaCode,
    "Field mapping should have value"
  );

  // Test that toX12 works with mapLogic containing static values (ignores them appropriately)
  const x12Output = transaction.toX12(
    result.envelope,
    mapLogicWithStatics.envelope
  );
  // toX12 should work without errors even when mapLogic contains static values
  assert.ok(typeof x12Output === "string", "Should return string output");

  console.log(
    "Static values test passed - mixed static and mapped values working correctly"
  );
});

test("RepeatingSegmentMap functionality", async function () {
  const transaction = new Transaction();

  transaction.generateSegments(FILE_990);
  transaction.inferLoops();

  // Test RepeatingSegmentMap for N9 segments
  const simpleMapLogic = {
    transactions: new LoopMap({
      position: 0,
      values: {
        references: new RepeatingSegmentMap({
          segmentIdentifier: "N9",
          values: {
            qualifier: new FieldMap({
              segmentIdentifier: "N9",
              valuePosition: 0,
            }),
            reference: new FieldMap({
              segmentIdentifier: "N9",
              valuePosition: 1,
            }),
          },
        }),
      },
    }),
  };

  const json = transaction.mapSegments(simpleMapLogic);

  // Verify that repeating segments are captured as arrays
  assert(json.transactions.length === 3);
  assert(Array.isArray(json.transactions[0].references));
  assert(json.transactions[0].references.length === 3); // First transaction has 3 N9 segments
  assert.strictEqual(json.transactions[0].references[0].qualifier, "CN");
  assert.strictEqual(json.transactions[0].references[0].reference, "3216547");
  assert.strictEqual(json.transactions[0].references[1].qualifier, "CI");
  assert.strictEqual(json.transactions[0].references[1].reference, "AUGBIX2");
  assert.strictEqual(json.transactions[0].references[2].qualifier, "CA");
  assert.strictEqual(
    json.transactions[0].references[2].reference,
    "ABC Hauling STAR USA"
  );

  // Test X12 generation with RepeatingSegmentMap
  const x12 = transaction.toX12(json, simpleMapLogic);
  assert(x12.includes("N9*CN*3216547"));
  assert(x12.includes("N9*CI*AUGBIX2"));
  assert(x12.includes("N9*CA*ABC Hauling STAR USA"));
});

// test("990 map", async function () {
//   const transaction = new Transaction();

//   transaction.generateSegments(FILE_990);

//   transaction.inferLoops();

//   const mapLogic = {
//     envelope: {
//       ISA: {
//         authInfoQualifier: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 1,
//         },
//         authInfo: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 2,
//         },
//         securityInfoQualifier: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 3,
//         },
//         securityInfo: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 4,
//         },
//         senderIdQualifier: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 5,
//         },
//         senderId: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 6,
//         },
//         receiverIdQualifier: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 7,
//         },
//         receiverId: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 8,
//         },
//         date: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 9,
//         },
//         time: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 10,
//         },
//         controlVersion: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 11,
//         },
//         controlNumber: {
//           _type: "FieldMap",
//           segmentIdentifier: "ISA",
//           valuePosition: 12,
//         },
//       },
//       GS: {
//         functionalIdCode: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 1,
//         },
//         applicationSenderCode: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 2,
//         },
//         applicationReceiverCode: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 3,
//         },
//         date: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 4,
//         },
//         time: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 5,
//         },
//         groupControlNumber: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 6,
//         },
//         version: {
//           _type: "FieldMap",
//           segmentIdentifier: "GS",
//           valuePosition: 8,
//         },
//       },
//     },
//     transactions: {
//       _type: "LoopMap",
//       position: 0,
//       values: {
//         ST: {
//           transactionSetId: {
//             _type: "FieldMap",
//             segmentIdentifier: "ST",
//             valuePosition: 0,
//           },
//           controlNumber: {
//             _type: "FieldMap",
//             segmentIdentifier: "ST",
//             valuePosition: 1,
//           },
//         },
//         B1: {
//           carrierQualifier: {
//             _type: "FieldMap",
//             segmentIdentifier: "B1",
//             valuePosition: 0,
//           },
//           loadNumber: {
//             _type: "FieldMap",
//             segmentIdentifier: "B1",
//             valuePosition: 1,
//           },
//           shipmentDate: {
//             _type: "FieldMap",
//             segmentIdentifier: "B1",
//             valuePosition: 2,
//           },
//           statusCode: {
//             _type: "FieldMap",
//             segmentIdentifier: "B1",
//             valuePosition: 3,
//           },
//         },
//         confirmation: {
//           _type: "FieldMap",
//           segmentIdentifier: "N9",
//           identifierValue: "CN",
//           identifierPosition: 0,
//           valuePosition: 1,
//         },
//         internalReference: {
//           _type: "FieldMap",
//           segmentIdentifier: "N9",
//           identifierValue: "CI",
//           identifierPosition: 0,
//         },
//       },
//     },
//   };

//   const mapped = transaction.mapSegments(mapLogic);

//   console.log(JSON.stringify(mapped, null, 2));

//   assert.strictEqual(mapped.envelope.ISA.authInfo, "00");
//   assert.strictEqual(mapped.envelope.GS.functionalIdCode, "ITC-WEBSITENAME");
//   assert.strictEqual(mapped.transactions.length, 3);
// });

// test("856 map", async function () {
//   const test856 = await fs.readFile("856.edi", "utf8");

//   const transaction = new Transaction();

//   transaction.generateSegments(test856);

//   const loop = new Loop();

//   loop.setPosition(0);

//   loop.addSegmentIdentifiers([
//     {
//       segmentIdentifier: "HL",
//       identifierValue: "P",
//       identifierPosition: 2,
//     },
//     "LIN",
//     "SN1",
//     "DTM",
//     "DTM",
//   ]);

//   transaction.addLoop(loop);

//   transaction.runLoops();

//   const mapLogic = {
//     header: {
//       transmissionControl: new FieldMap({
//         segmentIdentifier: "ISA",
//         valuePosition: 13,
//       }),
//       shipmentOrderNumber: new FieldMap({
//         segmentIdentifier: "BSN",
//         valuePosition: 1,
//       }),
//       shipmentDate: new FieldMap({
//         segmentIdentifier: "BSN",
//         valuePosition: 2,
//       }),
//       shipFromName: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "SF",
//         valuePosition: 1,
//       }),
//       shipFromID: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "SF",
//         valuePosition: 3,
//       }),
//       shipToName: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "ST",
//         valuePosition: 1,
//       }),
//       shipToID: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "ST",
//         valuePosition: 3,
//       }),
//       deliveryName: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "DE",
//         valuePosition: 1,
//       }),
//       deliveryID: new FieldMap({
//         segmentIdentifier: "N1",
//         identifierPosition: 0,
//         identifierValue: "DE",
//         valuePosition: 3,
//       }),
//     },
//     detail: {
//       items: new LoopMap({
//         position: 0,
//         values: {
//           productID: new FieldMap({
//             segmentIdentifier: "LIN",
//             valuePosition: 2,
//           }),
//           lotID: new FieldMap({
//             segmentIdentifier: "LIN",
//             valuePosition: 4,
//           }),
//           quantity: new FieldMap({
//             segmentIdentifier: "SN1",
//             valuePosition: 1,
//           }),
//           unitOfMeasurement: new FieldMap({
//             segmentIdentifier: "SN1",
//             valuePosition: 2,
//           }),
//           expirationDate: new FieldMap({
//             segmentIdentifier: "DTM",
//             identifierPosition: 0,
//             identifierValue: "036",
//             valuePosition: 1,
//           }),
//           productionDate: new FieldMap({
//             segmentIdentifier: "DTM",
//             identifierPosition: 0,
//             identifierValue: "405",
//             valuePosition: 1,
//           }),
//         },
//       }),
//     },
//   };

//   const mapped = transaction.mapSegments(mapLogic);

//   assert.strictEqual(mapped.header.transmissionControl, "0");
//   assert.strictEqual(mapped.header.shipmentOrderNumber, "0007123669");
//   assert.strictEqual(mapped.detail.items.length, 27);
// });
