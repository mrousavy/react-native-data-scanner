import type { TargetBarcodeFormat } from './BarcodeFormat'

/**
 * Represents normalized native options for {@linkcode DataScannerFactory.scanBarcode}.
 *
 * @internal
 */
export interface ResolvedScanBarcodeOptions {
  /**
   * Concrete list of barcode formats to scan for.
   */
  targetFormats: TargetBarcodeFormat[]

  /**
   * Whether native auto-zoom should be enabled when supported.
   */
  enableAutoZoom: boolean
}
