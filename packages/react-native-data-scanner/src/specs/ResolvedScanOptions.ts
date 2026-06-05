import type { TargetBarcodeFormat } from './BarcodeFormat'

/**
 * Represents normalized options passed to the native scanner.
 */
export interface ResolvedScanOptions {
  /**
   * The barcode formats to scan for.
   *
   * Use `['all']` to request every format the current platform supports. Passing
   * a narrower list can improve scan speed on supported platforms.
   */
  readonly targetFormats: TargetBarcodeFormat[]
  /**
   * Whether the scanner should try to zoom automatically when a barcode is too
   * far away.
   *
   * This is a best-effort preference. Platforms that do not expose automatic
   * zoom still perform the scan.
   *
   * @default false
   */
  readonly enableAutoZoom: boolean
}
