import type { HybridObject } from 'react-native-nitro-modules'
import type { Barcode } from './Barcode'
import type { ResolvedScanOptions } from './ResolvedScanOptions'

/**
 * Native root object used by the public data scanner facade.
 *
 * @see {@linkcode DataScannerFactory.scan}
 */
export interface DataScannerFactory extends HybridObject<{
  ios: 'swift'
  android: 'kotlin'
}> {
  /**
   * Opens the native barcode scanner and resolves with the selected barcode.
   *
   * @throws If the scanner is unavailable, the user cancels the scan, or the
   * requested {@linkcode ResolvedScanOptions.targetFormats} cannot be supported.
   */
  scan(options: ResolvedScanOptions): Promise<Barcode>
}
