import type { BarcodeFormat } from './BarcodeFormat'

/**
 * Represents a scanned barcode.
 */
export interface ScannedBarcode {
  /**
   * Decoded string payload of the scanned barcode.
   */
  value: string

  /**
   * Format detected for the scanned barcode value.
   *
   * @see {@linkcode BarcodeFormat}
   */
  format: BarcodeFormat
}
