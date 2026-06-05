import type { TargetBarcodeFormat } from './BarcodeFormat'
import type { ScanQualityLevel } from './ScanQualityLevel'

/**
 * Configures one barcode scan started by {@linkcode DataScanner.scanBarcode}.
 */
export interface ScanBarcodeOptions {
  /**
   * Barcode formats to scan for.
   *
   * Omit this to scan for every cross-platform format, or pass a non-empty
   * array to limit scanning to specific formats.
   *
   * @default undefined
   */
  targetFormats?: TargetBarcodeFormat[]

  /**
   * Quality/performance tradeoff for barcode recognition.
   *
   * On iOS, this maps to VisionKit's scanner quality level. Android currently
   * ignores this preference.
   *
   * @default 'balanced'
   */
  qualityLevel?: ScanQualityLevel

  /**
   * Whether iOS should update recognized-item geometry at a higher frame rate.
   *
   * This is mostly useful when tracking live recognized items. Android currently
   * ignores this preference.
   *
   * @default false
   */
  isHighFrameRateTrackingEnabled?: boolean

  /**
   * Enables native auto-zoom when the current platform scanner supports it.
   *
   * Unsupported platforms ignore this preference and still scan normally.
   *
   * @default false
   */
  enableAutoZoom?: boolean
}
