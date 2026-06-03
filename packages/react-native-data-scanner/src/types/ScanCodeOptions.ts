import type { BarcodeFormat } from './BarcodeFormat'
import type { DataScannerQualityLevel } from './DataScannerQualityLevel'

/**
 * Options for {@linkcode DataScannerFactory.scanCode}.
 *
 * @see {@linkcode DataScannerFactory.scanCode}
 */
export interface ScanCodeOptions {
  /**
   * Barcode formats that the scan must accept.
   *
   * Omit this field to scan every format supported by the native scanner. Passing
   * an empty array is invalid because no code could satisfy the request.
   */
  barcodeFormats?: BarcodeFormat[]

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
