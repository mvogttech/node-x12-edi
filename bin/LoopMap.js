/**
 * @class LoopMap
 * @description A LoopMap is used to map a Loop to the specified object key value in an array.
 * @param {Object} options
 * @param {Number} options.position The position of the Loop in the transaction.
 * @param {Object} options.values An object containing FieldMaps.
 * @example
 * const objectToMapKeyValuesTo = {
 * header: {
 *  // header field maps
 * },
 * detail: {
 *  itemArray: new LoopMap({
 *    position: 0,
 *    values: {
 *    itemCode: new FieldMap({
 *    segmentIdentifier: "W07",
 *    identifierValue: null,
 *    identifierPosition: null,
 *    valuePosition: 4,
 *    }),
 *    lotCode: new FieldMap({
 *    segmentIdentifier: "W07",
 *    identifierValue: null,
 *    identifierPosition: null,
 *    valuePosition: 7,
 *    }),
 *    },
 *  })
 * }
 *};
 */
export default class LoopMap {
  constructor({ position, values }) {
    this.position = position;
    this.values = values;
  }
}
