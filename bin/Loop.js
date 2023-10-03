/**
 * @class Loop
 * @description A Loop is a collection of segments that are related to one another. In the example below, we create a loop starting from the W07 segment, and ending at the W20 segment. When you run a loop, it will find all segments between the W07 and W20 segments, and group them together.
 * @example
 * const itemLoop = new Loop();
 * itemLoop.setPosition(0);
 * itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);
 * transaction.addLoop(itemLoop);
 * transaction.runLoops();
 */
export default class Loop {
  constructor() {
    this.position = null;
    this.segmentIdentifiers = [];
    this.contents = [];
  }

  /**
   * @method toJSON
   * @description Returns a JSON representation of the Loop.
   * @returns {Object}
   * @memberof Loop
   * @instance
   * @example
   * const json = loop.toJSON();
   * console.log(json);
   * // {
   * //   position: 0,
   * //   segmentIdentifiers: ["W07", "N9", "W20"],
   * //   contents: [
   * //     [
   * //       {
   * //         name: "W07",
   * //         fields: [
   * //           {
   * //             content: "W07",
   * //           },
   * //           {
   * //             content: "A",
   * //           },
   * //           {
   * //             content: "1",
   * //           }
   * //         ],
   * //       },
   * //       {
   * //         name: "N9",
   * //         fields: [
   * //           {
   * //             content: "N9",
   * //           },
   * //           {
   * //             content: "1",
   * //           },
   * //           {
   * //             content: "A",
   * //           }
   * //         ],
   * //       },
   * //     ],
   * //     [...],
   * //   ],
   * // }
   */
  toJSON() {
    return {
      position: this.position,
      segmentIdentifiers: this.segmentIdentifiers,
      contents: this.contents.map((content) => {
        return content.map((segment) => segment.toJSON());
      }),
    };
  }

  /**
   * @method getLastSegmentIdentifier
   * @description Returns the last segment identifier in the Loop.
   * @returns {String}
   * @memberof Loop
   * @example
   * const lastSegmentIdentifier = loop.getLastSegmentIdentifier();
   * console.log(lastSegmentIdentifier);
   * // "W20"
   */
  getLastSegmentIdentifier() {
    return this.segmentIdentifiers[this.segmentIdentifiers.length - 1];
  }

  /**
   * @method getSegmentIdentifiers
   * @description Returns the segment identifiers in the Loop.
   * @returns {Array.<String>}
   * @memberof Loop
   * @example
   * const segmentIdentifiers = loop.getSegmentIdentifiers();
   * console.log(segmentIdentifiers);
   * // ["W07", "N9", "W20"]
   * @example
   * const [firstSegmentIdentifier, secondSegmentIdentifier, thirdSegmentIdentifier] = loop.getSegmentIdentifiers();
   * console.log(firstSegmentIdentifier);
   * // "W07"
   * console.log(secondSegmentIdentifier);
   * // "N9"
   * console.log(thirdSegmentIdentifier);
   * // "W20"
   */
  getSegmentIdentifiers() {
    let identifiers = [];
    for (let identifier of this.segmentIdentifiers) {
      switch (typeof identifier) {
        case "string":
          identifiers.push(identifier);
          break;
        case "object":
          identifiers.push(identifier.segmentIdentifier);
          break;
        default:
          throw new Error(`Invalid segment identifier: ${identifier}`);
      }
    }
    return identifiers;
  }

  /**
   * @method addSegmentIdentifier
   * @description Adds a segment identifier to the Loop.
   * @param {String | Object} segmentIdentifier
   * @returns {Loop}
   * @memberof Loop
   * @example
   * loop.addSegmentIdentifier("W07");
   * @example
   * loop.addSegmentIdentifier("N9");
   * @example
   * loop.addSegmentIdentifier("W20");
   */
  addSegmentIdentifier(segmentIdentifier) {
    this.segmentIdentifiers.push(segmentIdentifier);

    return this;
  }

  /**
   * @method addSegmentIdentifiers
   * @description Adds segment identifiers to the Loop.
   * @param {Array.<String | Object>} segmentIdentifiers
   * @returns {Loop}
   * @memberof Loop
   * @example
   * loop.addSegmentIdentifiers(["W07", "N9", "W20"]);
   * @example
   * loop.addSegmentIdentifiers([
   *    {
   *       segmentIdentifier: "HL",
   *       identifierValue: "P",
   *       identifierPosition: 2,
   *     },
   *     "W07",
   *     "N9"
   *   ]);
   */
  addSegmentIdentifiers(segmentIdentifiers) {
    segmentIdentifiers.forEach((segmentIdentifier) => {
      this.addSegmentIdentifier(segmentIdentifier);
    });

    return this;
  }

  /**
   * @method removeSegmentIdentifier
   * @description Removes a segment identifier from the Loop.
   * @param {String} segmentIdentifier
   * @returns {Loop}
   * @memberof Loop
   * @example
   * loop.removeSegmentIdentifier("W07");
   * @example
   * loop.removeSegmentIdentifier("N9");
   * @example
   * loop.removeSegmentIdentifier("W20");
   */
  removeSegmentIdentifier(segmentIdentifier) {
    this.segmentIdentifiers = this.segmentIdentifiers.filter(
      (s) => s !== segmentIdentifier
    );

    return this;
  }

  /**
   * @method getPosition
   * @description Returns the position of the Loop.
   * @returns {Number}
   * @memberof Loop
   * @example
   * const position = loop.getPosition();
   * console.log(position);
   * // 0
   */
  getPosition() {
    return this.position;
  }

  /**
   * @method setPosition
   * @description Sets the position of the Loop.
   * @param {Number} position
   * @returns {Loop}
   * @memberof Loop
   * @example
   * loop.setPosition(0);
   */
  setPosition(position) {
    this.position = position;

    return this;
  }
}
