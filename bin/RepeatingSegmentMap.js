/**
 * @class RepeatingSegmentMap
 * @description Used to map multiple segments of the same type within a loop to an array of objects.
 * This handles cases where multiple segments of the same identifier appear within a single transaction or loop.
 * @param {Object} options
 * @param {String} options.segmentIdentifier The segment identifier.
 * @param {Object} options.values The mapping configuration for each occurrence of the segment.
 * @param {String} options.identifierValue The value of the field identifier (optional, for filtering).
 * @param {Number} options.identifierPosition The position of the field identifier (optional, for filtering).
 * @example
 * const repeatingSegmentMap = new RepeatingSegmentMap({
 *   segmentIdentifier: "N9",
 *   values: {
 *     qualifier: new FieldMap({
 *       segmentIdentifier: "N9",
 *       valuePosition: 0,
 *     }),
 *     reference: new FieldMap({
 *       segmentIdentifier: "N9",
 *       valuePosition: 1,
 *     }),
 *   },
 * });
 */
import FieldMap from "./FieldMap.js";

export default class RepeatingSegmentMap {
  constructor({
    segmentIdentifier,
    values,
    identifierValue = null,
    identifierPosition = null,
  }) {
    this.segmentIdentifier = segmentIdentifier;
    this.values = values;
    this.identifierValue = identifierValue;
    this.identifierPosition = identifierPosition;
  }

  /**
   * @method toJSON
   * @description Returns a JSON representation of the RepeatingSegmentMap.
   * @returns {Object}
   * @memberof RepeatingSegmentMap
   */
  toJSON() {
    return {
      segmentIdentifier: this.segmentIdentifier,
      values: this.values,
      identifierValue: this.identifierValue,
      identifierPosition: this.identifierPosition,
    };
  }
}
