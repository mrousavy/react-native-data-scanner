import type { BarcodeFormat } from './BarcodeFormat'

/**
 * Represents a barcode returned by the native scanner.
 */
export interface Barcode {
  /**
   * The barcode's machine-readable format.
   *
   * Use `'unknown'` when the native scanner cannot classify the barcode format.
   */
  readonly format: BarcodeFormat
  /**
   * The barcode value exactly as the native scanner decoded it.
   *
   * This is `undefined` when the barcode cannot be represented as a string.
   */
  readonly rawValue: string | undefined
  /**
   * A user-friendly display value for the barcode.
   *
   * This can omit encoding details from {@linkcode rawValue}. On platforms that
   * do not provide a distinct display value, this matches {@linkcode rawValue}.
   */
  readonly displayValue: string | undefined
}
