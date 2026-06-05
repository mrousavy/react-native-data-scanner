import type { BarcodeFormat } from './BarcodeFormat'

/**
 * Represents a barcode scanned by {@linkcode DataScanner.scanBarcode}.
 */
export interface ScannedBarcode {
  /**
   * Decoded string payload of the scanned barcode.
   */
  value: string

  /**
   * Format detected for {@linkcode ScannedBarcode.value}.
   */
  format: BarcodeFormat
}
