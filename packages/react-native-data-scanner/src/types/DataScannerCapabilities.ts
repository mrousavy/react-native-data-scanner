import type { BarcodeFormat } from './BarcodeFormat'

/**
 * Represents camera scanner features currently available to
 * {@linkcode DataScannerFactory}.
 *
 * @see {@linkcode DataScannerFactory.getCapabilities}
 */
export interface DataScannerCapabilities {
  /**
   * Whether {@linkcode DataScannerFactory.scanCode} can currently open a camera
   * scanner.
   */
  isCodeScannerAvailable: boolean

  /**
   * Barcode formats that can be used as required values in
   * {@linkcode ScanCodeOptions.barcodeFormats}.
   */
  supportedBarcodeFormats: BarcodeFormat[]

  /**
   * Whether {@linkcode ScanCodeOptions.allowManualInput} can show a manual
   * fallback entry UI.
   */
  supportsManualInput: boolean

  /**
   * Whether {@linkcode ScanCodeOptions.enableAutoZoom} can actively zoom toward a
   * detected code.
   */
  supportsAutoZoom: boolean
}
