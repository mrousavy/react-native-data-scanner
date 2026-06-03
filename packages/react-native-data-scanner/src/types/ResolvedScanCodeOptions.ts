import type { DataScannerApi } from './DataScannerApi'
import type { DataScannerQualityLevel } from './DataScannerQualityLevel'
import type { ScanCodeOptions } from './ScanCodeOptions'
import type { TargetBarcodeFormat } from './TargetBarcodeFormat'

/**
 * Fully resolved native options for `scanCode`.
 *
 * Public callers use {@linkcode ScanCodeOptions}; the JavaScript facade fills in
 * these defaults before crossing the Nitro boundary.
 *
 * @see {@linkcode DataScannerApi.scanCode}
 */
export interface ResolvedScanCodeOptions {
  /**
   * Target formats for the scan.
   */
  barcodeFormats: TargetBarcodeFormat[]

  /**
   * Preference for scanner speed and recognition quality.
   */
  qualityLevel: DataScannerQualityLevel

  /**
   * Whether native automatic zoom should be enabled when supported.
   */
  enableAutoZoom: boolean

  /**
   * Whether native manual entry should be enabled when supported.
   */
  allowManualInput: boolean
}
