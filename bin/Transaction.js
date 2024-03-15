import Field from "./Field.js";
import FieldMap from "./FieldMap.js";
import Loop from "./Loop.js";
import LoopMap from "./LoopMap.js";
import Segment from "./Segment.js";

/**
 * @version 1.0.0
 * @since 1.0.0
 * @license MIT
 * @see {@link https://github.com/mvogttech/node-x12-edi | Github}
 * @see {@link https://www.npmjs.com/package/node-x12-edi | NPM}
 * @class Transaction
 * @description A class representing an EDI transaction
 * @param {boolean} debug - Whether or not to enable debug mode
 * @returns {Transaction}
 * @example
 * const transaction = new Transaction();
 * transaction.generateSegments(file);
 * const itemLoop = new Loop();
 * itemLoop.setPosition(0);
 * itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);
 * transaction.addLoop(itemLoop);
 * transaction.runLoops();
 * const mapLogic = {
 *  header: {
 *  transmissionDate: new FieldMap({
 * segmentIdentifier: "GS",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 3,
 * }),
 * warehouseReceiptNumber: new FieldMap({
 * segmentIdentifier: "W17",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 2,
 * }),
 * warehouse: {
 * name: new FieldMap({
 * segmentIdentifier: "N1",
 * identifierValue: "WH",
 * identifierPosition: 0,
 * valuePosition: 1,
 * }),
 * code: new FieldMap({
 * segmentIdentifier: "N1",
 * identifierValue: "WH",
 * identifierPosition: 0,
 * valuePosition: 3,
 * }),
 * },
 * },
 * detail: {
 * items: new LoopMap({
 * position: 0,
 * values: {
 * itemCode: new FieldMap({
 * segmentIdentifier: "W07",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 4,
 * }),
 * lotCode: new FieldMap({
 * segmentIdentifier: "W07",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 7,
 * }),
 * productionDate: new FieldMap({
 * segmentIdentifier: "N9",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 1,
 * }),
 * netWeight: new FieldMap({
 * segmentIdentifier: "W20",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 3,
 * }),
 * },
 * }),
 * },
 * };
 * const mapped = transaction.mapSegments(mapLogic);
 * console.log(mapped);
 * // {
 * //   header: {
 * //     transmissionDate: "20210101",
 * //     warehouseReceiptNumber: "1234567890",
 * //     warehouse: {
 * //       name: "WAREHOUSE NAME",
 * //       code: "WAREHOUSE CODE",
 * //     },
 * //   },
 * //   detail: {
 * //     items: [
 * //       {
 * //         itemCode: "ITEM CODE",
 * //         lotCode: "LOT CODE",
 * //         productionDate: "20210101",
 * //         netWeight: "1000",
 * //       },
 * //     ],
 * //   },
 * // }
 */
export default class Transaction {
  constructor(debug = false) {
    this.segments = [];
    this.loops = [];
    this.debug = debug;
  }

  /**
   * @memberof Transaction
   * @method toJSON
   * @description Convert the transaction instance to a JSON object
   * @returns {Object}
   * @example
   * const json = transaction.toJSON();
   * console.log(json);
   * // {
   * //   segments: [
   * //     {
   * //       name: 'ST',
   * //       fields: [
   * //         { content: '945', position: 0 },
   * //         { content: '0001', position: 1 },
   * //       ]
   * //     },
   * //     {
   * //       name: 'B4',
   * //       fields: [
   * //         { content: 'N', position: 0 },
   * //         { content: '1234567890', position: 1 },
   * //         { content: '20210101', position: 2 },
   * //       ]
   * //     },
   * //   ],
   * //   loops: [
   * //     {
   * //       position: 0,
   * //       segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
   * //       contents: []
   * //     }
   * //   ]
   * // }
   */
  toJSON() {
    return {
      segments: this.segments.map((segment) => segment.toJSON()),
      loops: this.loops.map((loop) => loop.toJSON()),
    };
  }

  /**
   * @memberof Transaction
   * @method getType
   * @description Get the transaction type
   * @returns {string}
   * @example
   * const type = transaction.getType();
   * console.log(type);
   * // 945
   * @throws {Error} No ST segment found
   * @throws {Error} No ST02 segment found
   */
  getType() {
    this.debug && console.log("[Getting Transaction Type]");
    const ST = this.segments.find((segment) => segment.name === "ST");
    this.debug && console.log("ST", ST);
    if (!ST) throw new Error("No ST segment found");
    this.debug && console.log("[ST.getFields() result]", ST.getFields());
    ST.trimFields();
    const ST02 = ST.getFields()[0];
    if (!ST02) throw new Error("No ST02 segment found");
    this.debug && console.log("[ST02]", ST02);
    return ST02;
  }

  /**
   * @memberof Transaction
   * @method getSegments
   * @description Get all segments in the transaction instance
   * @returns {Array.<Segment>}
   * @example
   * const segments = transaction.getSegments();
   * console.log(segments);
   * // [
   * //   {
   * //     name: 'ST',
   * //     fields: [
   * //       { content: '945', position: 0 },
   * //       { content: '0001', position: 1 },
   * //     ]
   * //   },
   * //   {
   * //     name: 'B4',
   * //     fields: [
   * //       { content: 'N', position: 0 },
   * //       { content: '1234567890', position: 1 },
   * //       { content: '20210101', position: 2 },
   * //     ]
   * //   },
   * // ]
   */
  getSegments() {
    return this.segments.map((segment) => segment);
  }

  /**
   * @memberof Transaction
   * @method listSegmentIdentifiers
   * @description Get all segment identifiers in the transaction instance
   * @returns {Array.<string>}
   * @example
   * const segmentIdentifiers = transaction.listSegmentIdentifiers();
   * console.log(segmentIdentifiers);
   * // [
   * //   'ST', 'B4', 'N1', 'N3', 'N4', 'G61', 'N1', 'N3', 'N4', 'G61',
   * // ]
   */
  listSegmentIdentifiers() {
    return this.segments.map((segment) => segment.name);
  }

  /**
   * @memberof Transaction
   * @method getLoops
   * @description Get all loops in the transaction instance
   * @returns {Array.<Loop>}
   * @example
   * const loops = transaction.getLoops();
   * console.log(loops);
   * // [
   * //   {
   * //     position: 0,
   * //     segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
   * //     contents: [
   * //       [
   * //         {
   * //           name: 'W07',
   * //           fields: [
   * //             { content: '100', position: 0 },
   * //             { content: 'EA', position: 1 },
   * //             { content: 'ITEM CODE', position: 4 },
   * //             { content: '100', position: 5 },
   * //             { content: 'LB', position: 6 },
   * //             { content: 'LOT CODE', position: 7 },
   * //           ]
   * //         },
   * //         {
   * //           name: 'N9',
   * //           fields: [
   * //             { content: 'PD', position: 0 },
   * //             { content: '20210101', position: 1 },
   * //           ]
   * //         },
   * //         {
   * //           name: 'W20',
   * //           fields: [
   * //             { content: '1000', position: 0 },
   * //             { content: 'LB', position: 1 },
   * //             { content: '1000', position: 3 },
   * //             { content: 'LB', position: 4 },
   * //           ]
   * //         }
   * //       ]
   * //     ]
   * //   }
   * // ]
   */
  getLoops() {
    return this.loops.map((loop) => loop);
  }

  /**
   * @memberof Transaction
   * @method addLoop
   * @description Add a loop to the transaction instance
   * @param {Loop} loop - The loop to add to the transaction instance
   * @returns {void}
   * @example
   * const loop = new Loop();
   * loop.addSegmentIdentifiers(["W07", "N9", "W20"]);
   * transaction.addLoop(loop);
   * console.log(transaction.getLoops());
   * // [
   * //   {
   * //     position: 0,
   * //     segmentIdentifiers: [ 'W07', 'N9', 'W20' ],
   * //     contents: []
   * //   }
   * // ]
   */
  addLoop(loop) {
    this.loops.push(loop);
  }

  /**
   * @memberof Transaction
   * @method runLoops
   * @description Run all loops in the transaction instance
   * @returns {void}
   */
  runLoops() {
    this.loops.forEach((loop) => {
      this.#runLoop(loop);
    });
  }

  /**
   * @access private
   * @memberof Transaction
   * @method #runLoop
   * @description Run a loop
   * @param {Loop} loop - The loop to run
   * @returns {void}
   */
  #runLoop(loop) {
    let segments = this.getSegments();
    const identifierStartsLoop = loop.segmentIdentifiers[0];

    if (typeof identifierStartsLoop === "string") {
      segments = segments.splice(
        segments.findIndex((segment) => {
          return segment.name === identifierStartsLoop;
        }),
        segments.length - 1
      );
    } else if (typeof identifierStartsLoop === "object") {
      const loopStartIndex = segments.findIndex((segment) => {
        return (
          segment.name === identifierStartsLoop.segmentIdentifier &&
          segment.getFields()[identifierStartsLoop.identifierPosition]
            .content === identifierStartsLoop.identifierValue
        );
      });
      segments = segments.splice(loopStartIndex, segments.length - 1);
    }

    this.debug && console.log("[Segments in Loop]", segments);
    let loopSegments = [];
    for (let segment of segments) {
      this.debug && console.log("[Segment]", segment);
      if (loop.getSegmentIdentifiers().includes(segment.name)) {
        this.debug && console.log("[Segment Name]", segment.name);
        if (typeof identifierStartsLoop === "object") {
          if (loopSegments.length === 0) {
            if (
              segment.getFields()[identifierStartsLoop.identifierPosition]
                .content !== identifierStartsLoop.identifierValue
            ) {
              continue;
            }
          }
        }
        if (loopSegments.length === loop.getSegmentIdentifiers().length - 1) {
          this.debug && console.log("[Last segment identifier for loop]");
          loop.contents.push([...loopSegments, segment]);
          loopSegments = [];
        } else {
          loopSegments.push(segment);
        }
      }
    }
    this.debug && console.log("[Loop]", loop);
    this.debug && console.log("[Loop Contents]", loop.contents);
  }

  /**
   * @memberof Transaction
   * @method mapSegments
   * @description Map segments to a JSON object
   * @param {Object} mapLogic - The map logic to use to map segments and fields to a JSON object
   * @param {Array.<Segment>} mapSegments - The segments to map to a JSON object (defaults to the segments in the transaction instance)
   * @returns {Object}
   * @example
   * const mapLogic = {
   *  header: {
   *   sender: new FieldMap({
   *   segmentIdentifier: "N1",
   *  identifierValue: "SF",
   * identifierPosition: 0,
   * valuePosition: 1,
   * }),
   * receiver: new FieldMap({
   * segmentIdentifier: "N1",
   * identifierValue: "ST",
   * identifierPosition: 0,
   * valuePosition: 1,
   * }),
   * transmissionDate: new FieldMap({
   * segmentIdentifier: "GS",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 3,
   * }),
   * warehouseReceiptNumber: new FieldMap({
   * segmentIdentifier: "W17",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 2,
   * }),
   * warehouse: {
   * name: new FieldMap({
   * segmentIdentifier: "N1",
   * identifierValue: "WH",
   * identifierPosition: 0,
   * valuePosition: 1,
   * }),
   * code: new FieldMap({
   * segmentIdentifier: "N1",
   * identifierValue: "WH",
   * identifierPosition: 0,
   * valuePosition: 3,
   * }),
   * },
   * },
   * detail: {
   * items: new LoopMap({
   * position: 0,
   * values: {
   * itemCode: new FieldMap({
   * segmentIdentifier: "W07",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 4,
   * }),
   * lotCode: new FieldMap({
   * segmentIdentifier: "W07",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 7,
   * }),
   * productionDate: new FieldMap({
   * segmentIdentifier: "N9",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 1,
   * }),
   * netWeight: new FieldMap({
   * segmentIdentifier: "W20",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 3,
   * }),
   * quantity: new FieldMap({
   * segmentIdentifier: "W07",
   * identifierValue: null,
   * identifierPosition: null,
   * valuePosition: 0,
   * }),
   * },
   * }),
   * },
   * };
   * const mapSegments = transaction.getSegments();
   * const mapped = transaction.mapSegments(mapLogic, mapSegments);
   * console.log(mapped);
   * // {
   * //   header: {
   * //     sender: "SENDER",
   * //     receiver: "RECEIVER",
   * //     transmissionDate: "20210101",
   * //     warehouseReceiptNumber: "1234567890",
   * //     warehouse: {
   * //       name: "WAREHOUSE NAME",
   * //       code: "WAREHOUSE CODE",
   * //     },
   * //   },
   * //   detail: {
   * //     items: [
   * //       {
   * //         itemCode: "ITEM CODE",
   * //         lotCode: "LOT CODE",
   * //         productionDate: "20210101",
   * //         netWeight: "1000",
   * //         quantity: "100",
   * //       },
   * //     ],
   * //   },
   * // }
   */
  mapSegments(mapLogic, mapSegments = null) {
    let result = {};

    if (!mapSegments) {
      mapSegments = this.getSegments();
    }

    Object.entries(mapLogic).forEach(([key, value]) => {
      // FieldMap is where the magic happens
      // The FieldMap object is used to map a field from a segment to a key in the result object
      if (value instanceof FieldMap) {
        let segment = mapSegments.filter(
          (segment) => segment.name === value.segmentIdentifier
        );

        if (segment.length === 1) {
          segment = segment[0];
        } else {
          segment = segment.filter((segment) => {
            return (
              segment.getFields()[value.identifierPosition].content ===
              value.identifierValue
            );
          });
          segment = segment[0];
        }

        if (!segment) {
          this.debug &&
            console.error("Segment not found", value.segmentIdentifier);
          return;
        }

        if (value.identifierValue === null) {
          if (segment.getFields()[value.valuePosition] === undefined) return;
          return (result[key] =
            segment.getFields()[value.valuePosition].content);
        }

        const isValid =
          segment.getFields()[value.identifierPosition].content ===
          value.identifierValue;

        if (!isValid) {
          this.debug &&
            console.error(
              "[Invalid identifier value]",
              "Expected: ",
              segment.getFields()[value.identifierPosition].content,
              "Received: ",
              value.identifierValue
            );
          return;
        }

        const field = segment.getFields()[value.valuePosition];

        if (!field) {
          this.debug && console.error("Field not found", value.valuePosition);
          return;
        }

        return (result[key] = field.content);
      }

      // LoopMap is used to map a loop to a key in the result object
      if (value instanceof LoopMap) {
        const loop = this.loops[value.position];
        if (!loop) {
          return;
        }

        result[key] = loop.contents.map((content) => {
          return this.mapSegments(value.values, content);
        });

        return;
      }

      // Object is used to map an object to a key in the result object
      if (value instanceof Object) {
        result[key] = this.mapSegments(value, mapSegments);
        return;
      }
    });

    return result;
  }

  /**
   * @private
   * @memberof Transaction
   * @method #addSegment
   * @description Add a segment to the transaction instance
   * @param {Segment} segment
   * @returns {Transaction}
   */
  #addSegment(segment) {
    this.segments.push(segment);

    return this;
  }

  /**
   * @memberof Transaction
   * @method removeSegment
   * @description Remove a segment from the transaction instance
   * @param {Segment} segment
   * @returns {Transaction}
   */
  removeSegment(segment) {
    this.segments = this.segments.filter((s) => s !== segment);

    return this;
  }

  /**
   * @memberof Transaction
   * @method inferLoops
   * @description Infer loops from the transaction instance
   * @returns {void}
   */
  inferLoops() {
    const segments = this.getSegments();

    // Count the number of times a segment appears in the transaction

    const segmentCounts = {};

    segments.forEach((segment) => {
      if (!segmentCounts[segment.name]) {
        segmentCounts[segment.name] = 0;
      }

      segmentCounts[segment.name]++;
    });

    // Find the groups of segments that loop

    const loopGroups = [];

    Object.entries(segmentCounts).forEach(([segmentName, count]) => {
      if (count > 1) {
        const group = segments.filter(
          (segment) => segment.name === segmentName
        );

        loopGroups.push(group);
      }
    });

    const loopIdentifiers = loopGroups.map((group) => group[0].name);

    const loop = new Loop();

    loop.setPosition(0);

    loop.addSegmentIdentifiers(loopIdentifiers);

    this.addLoop(loop);

    // Run the loops

    this.runLoops();
  }

  /**
   * @memberof Transaction
   * @method generateSegments
   * @description Generate segments for instance from a string
   * @param {string} content
   * @returns {void}
   */
  generateSegments(content, lineTerminator = "\n", segmentTerminator = "*") {
    const segments = content.split(lineTerminator);
    segments.forEach((segment) => {
      const fields = segment.split(segmentTerminator);
      const segmentName = fields[0];
      const segmentInstance = new Segment(segmentName);
      fields.shift();
      fields.forEach((field) => {
        const fieldInstance = new Field(field);
        fieldInstance.trim();
        segmentInstance.addField(fieldInstance);
      });
      this.#addSegment(segmentInstance);
    });
  }
}
