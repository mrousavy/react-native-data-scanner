import type { TargetBarcodeFormat } from './BarcodeFormat'

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
   * Enables native auto-zoom when the current platform scanner supports it.
   *
   * Unsupported platforms ignore this preference and still scan normally.
   *
   * @default false
   */
  enableAutoZoom?: boolean
}
