import type { DataScannerApi } from './DataScannerApi'
import type { DataScannerQualityLevel } from './DataScannerQualityLevel'
import type { ScannedCode } from './ScannedCode'
import type { TargetBarcodeFormat } from './TargetBarcodeFormat'

/**
 * Options for {@linkcode DataScannerApi.scan}.
 *
 * @see {@linkcode DataScannerApi.scan}
 */
export interface ScanOptions {
  /**
   * Barcode formats that the scan must accept.
   *
   * Omit this field or pass `'all'` to scan every format supported by the
   * native scanner. Passing an empty array is invalid because no code could
   * satisfy the request.
   *
   * @default 'all'
   * @see {@linkcode ScannedCode.format}
   */
  readonly formats?: 'all' | readonly TargetBarcodeFormat[]
  /**
   * Preference for scanner speed and recognition quality.
   *
   * @default 'balanced'
   */
  readonly qualityLevel?: DataScannerQualityLevel
  /**
   * Enables native automatic zoom when the platform supports it.
   *
   * Platforms without automatic zoom ignore this preference.
   *
   * @default false
   */
  readonly enableAutoZoom?: boolean
}
