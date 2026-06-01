/**
 * Represents a 2D point in scanner view coordinates.
 *
 * @see {@linkcode Quadrilateral.topLeft}
 */
export interface Point {
  /**
   * The horizontal coordinate.
   */
  x: number
  /**
   * The vertical coordinate.
   */
  y: number
}

/**
 * Represents a rectangle in scanner view coordinates.
 *
 * @see {@linkcode DataScanner.regionOfInterest}
 */
export interface Rect {
  /**
   * The horizontal origin.
   */
  x: number
  /**
   * The vertical origin.
   */
  y: number
  /**
   * The width.
   */
  width: number
  /**
   * The height.
   */
  height: number
}

/**
 * Represents the four corners of a recognized scanner item.
 *
 * @see {@linkcode ScannedItemBase.bounds}
 */
export interface Quadrilateral {
  /**
   * The upper-left corner.
   */
  topLeft: Point
  /**
   * The upper-right corner.
   */
  topRight: Point
  /**
   * The lower-right corner.
   */
  bottomRight: Point
  /**
   * The lower-left corner.
   */
  bottomLeft: Point
}
