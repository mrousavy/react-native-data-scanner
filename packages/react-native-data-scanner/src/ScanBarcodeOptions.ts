import type { TargetBarcodeFormat } from './BarcodeFormat'

/**
 * Represents the barcode formats requested by {@linkcode ScanBarcodeOptions.targetFormats}.
 *
 * @see {@linkcode ScanBarcodeOptions.targetFormats}
 */
export type TargetBarcodeFormats = 'all' | readonly TargetBarcodeFormat[]

/**
 * Configures one barcode scan started by {@linkcode DataScanner.scanBarcode}.
 */
export interface ScanBarcodeOptions {
  /**
   * Barcode formats to scan for.
   *
   * Pass `'all'` to scan for every cross-platform format, or pass a non-empty
   * array to limit scanning to specific formats.
   *
   * @default 'all'
   */
  readonly targetFormats?: TargetBarcodeFormats

  /**
   * Enables native auto-zoom when the current platform scanner supports it.
   *
   * Unsupported platforms ignore this preference and still scan normally.
   *
   * @default false
   */
  readonly enableAutoZoom?: boolean
}
