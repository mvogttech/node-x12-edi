/**
 * @class FieldMap
 * @description Used to declare the position of a field in a segment to a json object key value.
 * @param {Object} options
 * @param {String} options.segmentIdentifier The segment identifier.
 * @param {String} options.identifierValue The value of the field identifier.
 * @param {Number} options.identifierPosition The position of the field identifier.
 * @param {Number} options.valuePosition The position of the field value.
 * @example
 * const fieldMap = new FieldMap({
 *  segmentIdentifier: "W07",
 * identifierValue: null,
 * identifierPosition: null,
 * valuePosition: 4,
 * });
 * @example
 * const newObjectToMapFieldsTo = {
 *  itemCode: new FieldMap({
 *    segmentIdentifier: "W07",
 *    identifierValue: null,
 *    identifierPosition: null,
 *   valuePosition: 4,
 *  }),
 *  lotCode: new FieldMap({
 *    segmentIdentifier: "W07",
 *    identifierValue: null,
 *    identifierPosition: null,
 *    valuePosition: 7,
 *  }),
 * };
 */
export default class FieldMap {
  constructor({
    segmentIdentifier,
    identifierValue = null,
    identifierPosition = null,
    valuePosition,
  }) {
    this.segmentIdentifier = segmentIdentifier;
    this.identifierValue = identifierValue;
    this.identifierPosition = identifierPosition;
    this.valuePosition = valuePosition;
  }

  /**
   * @method toJSON
   * @description Returns a JSON representation of the FieldMap.
   * @returns {Object}
   * @memberof FieldMap
   * @example
   * const json = fieldMap.toJSON();
   * console.log(json);
   * // {
   * //   segmentIdentifier: "W07",
   * //   identifierValue: null,
   * //   identifierPosition: null,
   * //   valuePosition: 4,
   * // }
   */
  toJSON() {
    return {
      segmentIdentifier: this.segmentIdentifier,
      identifierValue: this.identifierValue,
      identifierPosition: this.identifierPosition,
      valuePosition: this.valuePosition,
    };
  }
}
