import type { DataScannerApi } from './DataScannerApi'
import type { DataScannerQualityLevel } from './DataScannerQualityLevel'
import type { TargetBarcodeFormat } from './TargetBarcodeFormat'

/**
 * Options for {@linkcode DataScannerApi.scanCode}.
 *
 * @see {@linkcode DataScannerApi.scanCode}
 */
export interface ScanCodeOptions {
  /**
   * Barcode formats that the scan must accept.
   *
   * Omit this field or pass `['all']` to scan every format supported by the
   * native scanner. Passing an empty array is invalid because no code could
   * satisfy the request.
   */
  barcodeFormats?: TargetBarcodeFormat[]

  /**
   * Preference for scanner speed and recognition quality.
   *
   * @default 'balanced'
   */
  qualityLevel?: DataScannerQualityLevel

  /**
   * Enables native automatic zoom when the platform supports it.
   *
   * @default false
   */
  enableAutoZoom?: boolean

  /**
   * Allows the native scanner to offer manual code entry when the platform
   * supports it.
   *
   * @default false
   */
  allowManualInput?: boolean
}
