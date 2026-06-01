import type { BarcodeFormat } from './BarcodeFormat'
import type { BarcodeValueType } from './BarcodeValue'
import type { Quadrilateral, Rect } from './Geometry'
import type { TextContentType } from './TextContentType'

/**
 * Represents the high-level kind of item returned by a {@linkcode DataScanner}.
 *
 * @see {@linkcode ScannedItemBase.kind}
 */
export type ScannedItemKind = 'text' | 'barcode'

/**
 * Represents common fields shared by scanner results.
 *
 * Concrete values include {@linkcode ScannedText} and
 * {@linkcode ScannedBarcode}.
 *
 * @see {@linkcode ScannedItem}
 */
export interface ScannedItemBase {
  /**
   * The recognized item kind.
   */
  kind: ScannedItemKind
  /**
   * A stable item identifier while the native scanner tracks the item.
   */
  id: string
  /**
   * The item corners in scanner view coordinates, when available.
   */
  bounds?: Quadrilateral
  /**
   * The item bounding rectangle in scanner view coordinates, when available.
   */
  boundingBox?: Rect
}

/**
 * Represents text details recognized by a {@linkcode DataScanner}.
 *
 * @see {@linkcode ScannedItem.text}
 */
export interface ScannedText {
  /**
   * The recognized text value.
   */
  value: string
  /**
   * The matched text content type when the scanner reports one.
   */
  contentType?: TextContentType
}

/**
 * Represents barcode details recognized by a {@linkcode DataScanner}.
 *
 * @see {@linkcode ScannedItem.barcode}
 */
export interface ScannedBarcode {
  /**
   * The recognized barcode format.
   */
  format: BarcodeFormat
  /**
   * The parsed value category.
   */
  valueType: BarcodeValueType
  /**
   * The raw string encoded in the barcode when available.
   */
  rawValue?: string
  /**
   * A user-displayable barcode value when the native backend provides one.
   */
  displayValue?: string
  /**
   * The raw bytes encoded in the barcode when available.
   */
  rawBytes?: ArrayBuffer
}

/**
 * Represents a value recognized by a {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner.scan}
 */
export interface ScannedItem {
  /**
   * The recognized item kind.
   */
  kind: ScannedItemKind
  /**
   * A stable item identifier while the native scanner tracks the item.
   */
  id: string
  /**
   * The item corners in scanner view coordinates, when available.
   */
  bounds?: Quadrilateral
  /**
   * The item bounding rectangle in scanner view coordinates, when available.
   */
  boundingBox?: Rect
  /**
   * Text details when {@linkcode kind} is `text`.
   */
  text?: ScannedText
  /**
   * Barcode details when {@linkcode kind} is `barcode`.
   */
  barcode?: ScannedBarcode
}
