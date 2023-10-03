/**
 * @class Segment
 * @description A Segment is a collection of Fields.
 * @param {String} name The name of the Segment, or the segment identifier.
 * @example
 * const segment = new Segment("ST");
 */
export default class Segment {
  constructor(name) {
    this.name = name;
    this.fields = [];
  }

  /**
   * @method toJSON
   * @description Returns a JSON representation of the Segment.
   * @returns {Object}
   * @memberof Segment
   * @example
   * const json = segment.toJSON();
   * console.log(json);
   * // {
   * //   name: "ST",
   * //   fields: [
   * //     {
   * //       content: "ST",
   * //     },
   * //     {
   * //       content: "997",
   * //     },
   * //     {
   * //       content: "0001",
   * //     },
   * //   ],
   * // }
   */
  toJSON() {
    return {
      name: this.name,
      fields: this.fields.map((field) => field.toJSON()),
    };
  }

  /**
   * @method trimFields
   * @description Removes whitespace from each Field in the Segment.
   * @returns {Segment}
   * @memberof Segment
   * @example
   * segment.trimFields();
   * console.log(segment.fields[0].content);
   * // "ST"
   * console.log(segment.fields[1].content);
   * // "997"
   */
  trimFields() {
    this.fields.forEach((field) => field.trim());
  }

  /**
   * @method getFields
   * @description Returns the Fields in the Segment.
   * @returns {Array<Field>}
   * @memberof Segment
   * @example
   * const fields = segment.getFields();
   * console.log(fields);
   * // [
   * //   {
   * //     content: "ST",
   * //   },
   * //   {
   * //     content: "997",
   * //   },
   * //   {
   * //     content: "0001",
   * //   },
   * // ]
   */
  getFields() {
    return this.fields;
  }

  /**
   * @method addField
   * @description Adds a Field to the Segment.
   * @param {Field} field The Field to add.
   * @returns {Segment}
   * @memberof Segment
   * @example
   * segment.addField(new Field("ST"));
   * console.log(segment.fields);
   * // [
   * //   {
   * //     content: "ST",
   * //   },
   * // ]
   */
  addField(field) {
    this.fields.push(field);

    return this;
  }

  /**
   * @method removeField
   * @description Removes a Field from the Segment.
   * @param {Field} field The Field to remove.
   * @returns {Segment}
   * @memberof Segment
   * @example
   * segment.removeField(segment.fields[0]);
   * console.log(segment.fields);
   * // []
   */
  removeField(field) {
    this.fields = this.fields.filter((f) => f !== field);

    return this;
  }
}
