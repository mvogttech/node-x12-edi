import Field from "./Field.js";
import FieldMap from "./FieldMap.js";
import Loop from "./Loop.js";
import LoopMap from "./LoopMap.js";
import RepeatingSegmentMap from "./RepeatingSegmentMap.js";
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
    this._x12Blueprints = null;
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
   * @private
   * @memberof Transaction
   * @method #containsTypeKeys
   * @description Helper method to check if an object contains _type keys anywhere in its structure
   * @param {*} obj - The object to check
   * @returns {boolean} True if _type keys are found
   */
  #containsTypeKeys(obj) {
    if (obj === null || typeof obj !== "object") {
      return false;
    }

    if (Array.isArray(obj)) {
      return obj.some((item) => this.#containsTypeKeys(item));
    }

    if (obj.hasOwnProperty("_type")) {
      return true;
    }

    return Object.values(obj).some((value) => this.#containsTypeKeys(value));
  }

  /**
   * @private
   * @memberof Transaction
   * @method #reviveMapLogic
   * @description Convert plain JSON objects with _type keys back to class instances
   * @param {Object} obj - The object to revive
   * @returns {Object} The object with class instances restored
   */
  #reviveMapLogic(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.#reviveMapLogic(item));
    }

    // Check if this object has a _type key indicating it should be revived
    if (obj._type) {
      const { _type, ...props } = obj;

      switch (_type) {
        case "FieldMap":
          return new FieldMap(props);
        case "LoopMap":
          // Recursively revive the values object for LoopMap
          const revivedValues = this.#reviveMapLogic(props.values);
          return new LoopMap({ ...props, values: revivedValues });
        case "RepeatingSegmentMap":
          // Recursively revive the values object for RepeatingSegmentMap
          const revivedRSMValues = this.#reviveMapLogic(props.values);
          return new RepeatingSegmentMap({
            ...props,
            values: revivedRSMValues,
          });
        default:
          console.warn(`Unknown _type: ${_type}. Returning as plain object.`);
          return props;
      }
    }

    // Recursively process nested objects
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = this.#reviveMapLogic(value);
    }

    return result;
  }

  /**
   * @memberof Transaction
   * @method mapSegments
   * @description Map segments to a JSON object. The mapLogic parameter can be defined using class instances
   * (FieldMap, LoopMap, RepeatingSegmentMap), plain JSON objects with "_type" keys that will be automatically
   * revived to class instances, or static values (strings, numbers, booleans) that will be passed through as-is.
   * @param {Object} mapLogic - The map logic to use to map segments and fields to a JSON object. Can use class instances, plain JSON objects with "_type" keys, or static values.
   * @param {Array.<Segment>} [mapSegments] - The segments to map to a JSON object (defaults to the segments in the transaction instance)
   * @returns {Object}
   * @example
   * const mapLogic = {
   *  header: {
   *   sender: new FieldMap({
   *    segmentIdentifier: "N1",
   *    identifierValue: "SF",
   *    identifierPosition: 0,
   *    valuePosition: 1,
   *   }),
   *  receiver: new FieldMap({
   *    segmentIdentifier: "N1",
   *    identifierValue: "ST",
   *    identifierPosition: 0,
   *    valuePosition: 1,
   *  }),
   *  transmissionDate: new FieldMap({
   *    segmentIdentifier: "GS",
   *    identifierValue: null,
   *    identifierPosition: null,
   *    valuePosition: 3,
   *  }),
   *  warehouseReceiptNumber: new FieldMap({
   *    segmentIdentifier: "W17",
   *    identifierValue: null,
   *    identifierPosition: null,
   *    valuePosition: 2,
   *  }),
   *  warehouse: {
   *    name: new FieldMap({
   *    segmentIdentifier: "N1",
   *    identifierValue: "WH",
   *    identifierPosition: 0,
   *    valuePosition: 1,
   *  }),
   *  code: new FieldMap({
   *    segmentIdentifier: "N1",
   *    identifierValue: "WH",
   *    identifierPosition: 0,
   *    valuePosition: 3,
   *  }),
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
   * @example
   * // Using plain JSON objects with _type keys (automatically revived to class instances)
   * const jsonMapLogic = {
   *   envelope: {
   *     transactions: {
   *       _type: 'LoopMap',
   *       position: 0,
   *       values: {
   *         B1: {
   *           standardCarrierAlphaCode: {
   *             _type: 'FieldMap',
   *             segmentIdentifier: 'B1',
   *             valuePosition: 0
   *           },
   *           shipmentId: {
   *             _type: 'FieldMap',
   *             segmentIdentifier: 'B1',
   *             valuePosition: 1
   *           }
   *         },
   *         references: {
   *           _type: 'RepeatingSegmentMap',
   *           segmentIdentifier: 'N9',
   *           values: {
   *             qualifier: {
   *               _type: 'FieldMap',
   *               segmentIdentifier: 'N9',
   *               valuePosition: 0
   *             },
   *             reference: {
   *               _type: 'FieldMap',
   *               segmentIdentifier: 'N9',
   *               valuePosition: 1
   *             }
   *           }
   *         }
   *       }
   *     }
   *   }
   * };
   * const mapped = transaction.mapSegments(jsonMapLogic);
   * console.log(mapped);
   * // {
   * //   envelope: {
   * //     transactions: [
   * //       {
   * //         B1: {
   * //           standardCarrierAlphaCode: "SCAC",
   * //           shipmentId: "1055337"
   * //         },
   * //         references: [
   * //           { qualifier: "CN", reference: "3216547" },
   * //           { qualifier: "CI", reference: "AUGBIX2" }
   * //         ]
   * //       }
   * //     ]
   * //   }
   * // }
   * @example
   * // Using static values mixed with field mappings
   * const mapLogicWithStatics = {
   *   meta: {
   *     transactionSet: "990",
   *     version: "004010",
   *     partner: "StripMiner / Intelek Technologies",
   *     processed: true,
   *     count: 42
   *   },
   *   envelope: {
   *     transactions: {
   *       _type: 'LoopMap',
   *       position: 0,
   *       values: {
   *         vessel: {
   *           standardCarrierAlphaCode: {
   *             _type: 'FieldMap',
   *             segmentIdentifier: 'B1',
   *             valuePosition: 0
   *           }
   *         },
   *         metadata: {
   *           source: "EDI_SYSTEM",
   *           processed: true
   *         }
   *       }
   *     }
   *   }
   * };
   * const result = transaction.mapSegments(mapLogicWithStatics);
   * console.log(result);
   * // {
   * //   meta: {
   * //     transactionSet: "990",
   * //     version: "004010",
   * //     partner: "StripMiner / Intelek Technologies",
   * //     processed: true,
   * //     count: 42
   * //   },
   * //   envelope: {
   * //     transactions: [
   * //       {
   * //         vessel: {
   * //           standardCarrierAlphaCode: "SCAC"
   * //         },
   * //         metadata: {
   * //           source: "EDI_SYSTEM",
   * //           processed: true
   * //         }
   * //       }
   * //     ]
   * //   }
   * // }
   */
  mapSegments(mapLogic, mapSegments = null) {
    let result = {};

    // Check if mapLogic contains plain JSON objects with _type keys and revive them
    const hasTypeKeys = this.#containsTypeKeys(mapLogic);
    if (hasTypeKeys) {
      mapLogic = this.#reviveMapLogic(mapLogic);
    }

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

      // RepeatingSegmentMap is used to map multiple segments of the same type to an array
      if (value instanceof RepeatingSegmentMap) {
        let segments = mapSegments.filter(
          (segment) => segment.name === value.segmentIdentifier
        );

        // If identifierValue is specified, filter by that value
        if (
          value.identifierValue !== null &&
          value.identifierPosition !== null
        ) {
          segments = segments.filter((segment) => {
            const field = segment.getFields()[value.identifierPosition];
            return field && field.content === value.identifierValue;
          });
        }

        // Map each matching segment to an object using the values configuration
        result[key] = segments.map((segment) => {
          const segmentResult = {};
          Object.entries(value.values).forEach(([valueKey, fieldMap]) => {
            if (fieldMap instanceof FieldMap) {
              const field = segment.getFields()[fieldMap.valuePosition];
              if (field) {
                segmentResult[valueKey] = field.content;
              }
            }
          });
          return segmentResult;
        });

        return;
      }

      // Object is used to map an object to a key in the result object
      if (value instanceof Object) {
        result[key] = this.mapSegments(value, mapSegments);
        return;
      }

      // Static values (strings, numbers, booleans) are passed through as-is
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        result[key] = value;
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
   * @param {string} [lineTerminator] - The line terminator to use (defaults to "\n")
   * @param {string} [segmentTerminator] - The segment terminator to use (defaults to "*")
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

  static #compileMapLogic(mapLogic) {
    const segmentBlueprints = [];
    const loopBlueprints = [];

    function walk(logic) {
      // 1) collect FieldMaps by segmentIdentifier
      const bySeg = new Map();
      for (const [key, fm] of Object.entries(logic)) {
        if (fm instanceof FieldMap) {
          let arr = bySeg.get(fm.segmentIdentifier);
          if (!arr) {
            arr = [];
            bySeg.set(fm.segmentIdentifier, arr);
            segmentBlueprints.push({
              segmentIdentifier: fm.segmentIdentifier,
              fields: arr,
              maxPos: 0,
              fieldArray: null,
            });
          }
          // find the blueprint we just pushed
          const bp = segmentBlueprints.find(
            (b) => b.segmentIdentifier === fm.segmentIdentifier
          );
          bp.fields.push({ key, fm });
        }
      }

      // allocate each blueprint’s fieldArray & compute maxPos
      for (const bp of segmentBlueprints) {
        const max = bp.fields.reduce(
          (m, { fm }) =>
            Math.max(
              m,
              fm.identifierPosition != null ? fm.identifierPosition : -1,
              fm.valuePosition
            ),
          -1
        );
        bp.maxPos = max;
        bp.fieldArray = new Array(max + 1);
      }

      // 2) collect LoopMaps & nested objects
      for (const [key, lm] of Object.entries(logic)) {
        if (lm instanceof LoopMap) {
          // recurse into its `values`
          const sub = Transaction.#compileMapLogic(lm.values);
          loopBlueprints.push({
            key,
            segmentBlueprints: sub.segmentBlueprints,
            loopBlueprints: sub.loopBlueprints,
          });
        } else if (typeof lm === "object" && !(lm instanceof FieldMap)) {
          walk(lm);
        }
      }

      return { segmentBlueprints, loopBlueprints };
    }

    return walk(mapLogic);
  }

  /**
   * @memberof Transaction
   * @method toX12
   * @description Generate EDI X12 string from structured JSON based on map logic.
   * Supports mapLogic defined either with class instances (FieldMap, LoopMap, RepeatingSegmentMap)
   * or plain JSON objects using `_type` keys (e.g., `{ _type: "FieldMap", segmentIdentifier: "N9", valuePosition: 1 }`).
   * Plain JSON mapLogic will be auto-revived to the appropriate class instances internally (parity with mapSegments).
   * Static primitive values (string/number/boolean) present in mapLogic are ignored in generation (treated as metadata).
   * @param {Object} jsonData - Structured JSON data to convert (matching keys used in mapLogic)
   * @param {Object} mapLogic - The mapping definitions (class instances or plain JSON with `_type` keys)
   * @param {string} [fieldTerminator] - Field delimiter (defaults to "*")
   * @param {string} [lineTerminator] - Segment delimiter (defaults to "\n")
   * @returns {string} The generated EDI X12 string
   */
  toX12(jsonData, mapLogic, fieldTerminator = "*", lineTerminator = "\n") {
    // Auto-revive plain JSON mapLogic that uses _type keys (parity with mapSegments)
    if (this.#containsTypeKeys && this.#containsTypeKeys(mapLogic)) {
      mapLogic = this.#reviveMapLogic(mapLogic);
    }
    const segments = [];
    // Recursive logic processor to build segments in order
    const processLogic = (data, logic) => {
      // 1. Handle FieldMap entries: group by segmentIdentifier
      const entries = Object.entries(logic);
      const fieldMapEntries = entries.filter(([, v]) => v instanceof FieldMap);
      const processedSegs = new Set();
      for (const [key, fm] of fieldMapEntries) {
        const segId = fm.segmentIdentifier;
        if (processedSegs.has(segId)) continue;
        // collect all maps for this segment
        const group = fieldMapEntries.filter(
          ([, v]) => v.segmentIdentifier === segId
        );
        // determine array size
        const maxPos = group.reduce((max, [, v]) => {
          const idPos =
            v.identifierPosition != null ? v.identifierPosition : -1;
          return Math.max(max, idPos, v.valuePosition);
        }, -1);
        const fieldArray = Array(maxPos + 1).fill("");
        for (const [gKey, gFm] of group) {
          const val = data[gKey];
          if (val === undefined || val === null) continue;
          if (gFm.identifierPosition != null && gFm.identifierValue != null) {
            fieldArray[gFm.identifierPosition] = gFm.identifierValue;
          }
          fieldArray[gFm.valuePosition] = val;
        }
        // push segment string
        segments.push([segId, ...fieldArray].join(fieldTerminator));
        processedSegs.add(segId);
      }
      // 2. Handle loops, repeating segments, and nested objects in order
      for (const [key, value] of entries) {
        if (value instanceof LoopMap) {
          const lm = value;
          const arr = data[key];
          if (Array.isArray(arr)) {
            for (const item of arr) {
              processLogic(item, lm.values);
            }
          }
        } else if (value instanceof RepeatingSegmentMap) {
          const rsm = value;
          const arr = data[key];
          if (Array.isArray(arr)) {
            for (const item of arr) {
              // For each repeating segment, collect all fields for this segment identifier
              const fieldMapEntries = Object.entries(rsm.values).filter(
                ([, v]) => v instanceof FieldMap
              );
              if (fieldMapEntries.length > 0) {
                const segId = rsm.segmentIdentifier;
                // Find max position for this segment
                const maxPos = fieldMapEntries.reduce((max, [, v]) => {
                  const idPos =
                    v.identifierPosition != null ? v.identifierPosition : -1;
                  return Math.max(max, idPos, v.valuePosition);
                }, -1);
                const fieldArray = Array(maxPos + 1).fill("");

                // Set identifier value if specified
                if (
                  rsm.identifierPosition != null &&
                  rsm.identifierValue != null
                ) {
                  fieldArray[rsm.identifierPosition] = rsm.identifierValue;
                }

                // Map each field
                for (const [fieldKey, fieldMap] of fieldMapEntries) {
                  const val = item[fieldKey];
                  if (val !== undefined && val !== null) {
                    if (
                      fieldMap.identifierPosition != null &&
                      fieldMap.identifierValue != null
                    ) {
                      fieldArray[fieldMap.identifierPosition] =
                        fieldMap.identifierValue;
                    }
                    fieldArray[fieldMap.valuePosition] = val;
                  }
                }

                // Push segment string
                segments.push([segId, ...fieldArray].join(fieldTerminator));
              }
            }
          }
        } else if (value instanceof FieldMap) {
          // already handled in initial pass
        } else if (value instanceof Object) {
          // Skip primitives (handled as metadata in mapSegments, but ignored here for output)
          // Recurse only for plain objects not recognized as mapping classes
          const nested = data[key] || {};
          processLogic(nested, value);
        } // primitives (string/number/boolean) are ignored in toX12 generation
      }
    };
    processLogic(jsonData, mapLogic);
    return segments.join(lineTerminator) + lineTerminator;
  }
}
