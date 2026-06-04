import type { DataScannerFactory } from '../specs/DataScannerFactory.nitro'
import type { DataScannerQualityLevel } from './DataScannerQualityLevel'
import type { ScanOptions } from './ScanOptions'
import type { TargetBarcodeFormat } from './TargetBarcodeFormat'

/**
 * Represents fully resolved options passed to native scanning.
 *
 * Public callers provide {@linkcode ScanOptions}; the JavaScript facade fills
 * defaults before calling {@linkcode DataScannerFactory.scan}.
 *
 * @see {@linkcode DataScannerFactory.scan}
 */
export interface ResolvedScanOptions {
  /**
   * Required barcode formats for this scan.
   *
   * `['all']` asks the native scanner to accept every supported format.
   */
  readonly formats: TargetBarcodeFormat[]
  /**
   * Best-effort quality preference for recognition.
   */
  readonly qualityLevel: DataScannerQualityLevel
  /**
   * Enables native automatic zoom when the platform supports it.
   */
  readonly enableAutoZoom: boolean
}
