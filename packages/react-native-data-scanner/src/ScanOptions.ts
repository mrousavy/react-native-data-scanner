import type { BarcodeFormat, TargetBarcodeFormat } from './specs/BarcodeFormat'

/**
 * Represents the barcode formats requested by {@linkcode ScanOptions.targetFormats}.
 *
 * @see {@linkcode ScanOptions.targetFormats}
 */
export type TargetBarcodeFormats = 'all' | Exclude<BarcodeFormat, 'unknown'>[]

/**
 * Configures a one-shot barcode scan through DataScanner.scan.
 */
export interface ScanOptions {
  /**
   * The barcode formats to scan for.
   *
   * Use `'all'` to request every format the current platform supports. Passing a
   * narrower list can improve scan speed on supported platforms.
   *
   * @default 'all'
   */
  readonly targetFormats?: TargetBarcodeFormats
  /**
   * Whether the scanner should try to zoom automatically when a barcode is too
   * far away.
   *
   * This is a best-effort preference. Platforms that do not expose automatic
   * zoom still perform the scan.
   *
   * @default false
   */
  readonly enableAutoZoom?: boolean
}

/**
 * Converts public {@linkcode TargetBarcodeFormats} into the resolved native
 * representation used by the scanner bridge.
 *
 * @see {@linkcode ScanOptions.targetFormats}
 */
export function resolveTargetBarcodeFormats(
  targetFormats: TargetBarcodeFormats | undefined
): TargetBarcodeFormat[] {
  if (targetFormats == null || targetFormats === 'all') {
    return ['all']
  }

  if (targetFormats.length === 0) {
    throw new Error("targetFormats cannot be empty. Use 'all' instead.")
  }

  return targetFormats
}
