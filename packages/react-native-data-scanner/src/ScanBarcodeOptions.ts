import type { TargetBarcodeFormat } from './BarcodeFormat'
import type { ScanQualityLevel } from './ScanQualityLevel'

/**
 * Configures one barcode scan.
 */
export interface ScanBarcodeOptions {
  /**
   * Barcode formats to scan for.
   *
   * Omit this to scan for every supported format, or pass a non-empty array to
   * limit scanning to specific formats.
   *
   * @see {@linkcode TargetBarcodeFormat}
   * @default undefined
   */
  targetFormats?: TargetBarcodeFormat[]

  /**
   * Quality/performance tradeoff for barcode recognition.
   *
   * @see {@linkcode ScanQualityLevel}
   * @default 'balanced'
   * @platform iOS
   */
  qualityLevel?: ScanQualityLevel

  /**
   * Enables higher-frame-rate updates for recognized-item geometry.
   *
   * @default false
   * @platform iOS
   */
  enableHighFrameRateTracking?: boolean

  /**
   * Enables automatic zoom while scanning distant barcodes.
   *
   * @default false
   * @platform Android
   */
  enableAutoZoom?: boolean
}
