import type { HybridObject } from 'react-native-nitro-modules'
import type { ScanBarcodeOptions } from '../ScanBarcodeOptions'
import type { ScannedBarcode } from '../ScannedBarcode'

/**
 * Native entry point for one-shot data scanning.
 *
 * @see {@linkcode DataScanner.scanBarcode}
 */
export interface DataScannerFactory extends HybridObject<{
  ios: 'swift'
  android: 'kotlin'
}> {
  /**
   * Presents the scanner UI and resolves with the first scanned barcode.
   *
   * @throws When scanning is unavailable, the scanner is canceled, or the scanned
   * barcode does not contain a decoded string value.
   */
  scanBarcode(options?: ScanBarcodeOptions): Promise<ScannedBarcode>
}
