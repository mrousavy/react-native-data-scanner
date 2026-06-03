import type { BarcodeFormat } from './BarcodeFormat'
import type { BarcodeValueType } from './BarcodeValueType'
import type { DataScannerApi } from './DataScannerApi'

/**
 * Represents a code scanned by {@linkcode DataScannerApi.scanCode}.
 *
 * @see {@linkcode DataScannerApi.scanCode}
 */
export interface ScannedCode {
  /**
   * Raw text payload encoded in the scanned code.
   */
  rawValue: string

  /**
   * Display-ready text when the native scanner provides one.
   */
  displayValue?: string

  /**
   * Barcode format detected by the native scanner.
   */
  format: BarcodeFormat

  /**
   * Semantic content type when the native scanner provides parsed metadata.
   */
  valueType?: BarcodeValueType
}
