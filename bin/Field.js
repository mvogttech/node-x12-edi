/**
 * @class Field
 * @description Represents a Field in a Segment.
 * @param {String} content The content of the Field.
 * @example
 * const field = new Field("ST");
 * @example
 * const field = new Field("997");
 * @example
 * const field = new Field("0001");
 */

export default class Field {
  constructor(content) {
    this.content = content;
  }

  /**
   * @method toJSON
   * @description Returns a JSON representation of the Field.
   * @returns {Object}
   * @memberof Field
   * @example
   * const json = field.toJSON();
   * console.log(json);
   * // {
   * //   content: "ST",
   * // }
   * @example
   * const json = field.toJSON();
   * console.log(json);
   * // {
   * //   content: "997",
   * // }
   */
  toJSON() {
    return this.content;
  }

  /**
   * @method trim
   * @description Removes whitespace from the Field and replaces newlines, tabs, and carriage returns with an empty string.
   * @returns {Field}
   * @memberof Field
   * @example
   * console.log(field.content);
   * // "  ST\n"
   * field.trim();
   * console.log(field.content);
   * // "ST"
   */
  trim() {
    this.content = this.content.trim().replace(/[\n\t\r]/g, "");

    return this;
  }

  /**
   * @method getLength
   * @description Returns the length of the Field.
   * @returns {Number}
   * @memberof Field
   * @example
   * console.log(field.content);
   * // "ST"
   * const length = field.getLength();
   * console.log(length);
   * // 2
   */
  getLength() {
    return this.content.length;
  }

  /**
   * @method toString
   * @description Returns the Field as a string.
   * @returns {String}
   * @memberof Field
   * @example
   * console.log(field.toString());
   * // "ST"
   */
  toString() {
    return this.content;
  }
}
