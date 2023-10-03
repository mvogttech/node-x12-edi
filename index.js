import Loop from "./bin/Loop.js";
import util from "util";
import fs from "fs/promises";
import FieldMap from "./bin/FieldMap.js";
import LoopMap from "./bin/LoopMap.js";
import Transaction from "./bin/Transaction.js";

async function main() {
  const transaction = new Transaction();

  const file = await fs.readFile("test.edi", "utf8");

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

  console.log(mapped);

  console.log(transaction.getType().content);

  //   console.log(
  //     util.inspect(transaction.loops[0].toJSON(), {
  //       showHidden: false,
  //       depth: null,
  //     })
  //   );
}

export { Loop, FieldMap, LoopMap, Transaction };
