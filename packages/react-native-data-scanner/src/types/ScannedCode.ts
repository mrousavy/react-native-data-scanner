import type { DataScannerApi } from './DataScannerApi'
import type { BarcodeFormat } from './BarcodeFormat'
import type { BarcodeValueType } from './BarcodeValueType'

/**
 * Represents a code scanned by {@linkcode DataScannerApi.scan}.
 *
 * @see {@linkcode DataScannerApi.scan}
 */
export interface ScannedCode {
  /**
   * Raw text payload encoded in the scanned code.
   */
  readonly rawValue: string
  /**
   * Display-ready text when the native scanner provides one.
   */
  readonly displayValue?: string
  /**
   * Barcode format detected by the native scanner.
   */
  readonly format: BarcodeFormat
  /**
   * Semantic content type when the native scanner provides parsed metadata.
   */
  readonly valueType?: BarcodeValueType
}
