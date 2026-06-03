import type { DataScannerApi } from './DataScannerApi'
import type { ScanCodeOptions } from './ScanCodeOptions'

/**
 * Options for {@linkcode DataScannerApi.createLiveScanner}.
 *
 * @see {@linkcode DataScannerApi.createLiveScanner}
 */
export interface LiveDataScannerOptions extends ScanCodeOptions {
  /**
   * Whether the live scanner should recognize more than one visible item.
   *
   * @default true
   */
  recognizesMultipleItems?: boolean
}
