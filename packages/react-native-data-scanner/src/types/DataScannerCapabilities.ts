import type { BarcodeFormat } from './BarcodeFormat'
import type { DataScannerApi } from './DataScannerApi'
import type { ScanCodeOptions } from './ScanCodeOptions'

/**
 * Represents camera scanner features currently available to
 * {@linkcode DataScannerApi}.
 *
 * @see {@linkcode DataScannerApi.getCapabilities}
 */
export interface DataScannerCapabilities {
  /**
   * Whether {@linkcode DataScannerApi.scanCode} can currently open a camera
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
