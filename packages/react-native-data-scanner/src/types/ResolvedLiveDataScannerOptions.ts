import type { DataScannerApi } from './DataScannerApi'
import type { LiveDataScannerOptions } from './LiveDataScannerOptions'
import type { ResolvedScanCodeOptions } from './ResolvedScanCodeOptions'

/**
 * Fully resolved native options for `createLiveScanner`.
 *
 * Public callers use {@linkcode LiveDataScannerOptions}; the JavaScript facade
 * fills in these defaults before crossing the Nitro boundary.
 *
 * @see {@linkcode DataScannerApi.createLiveScanner}
 */
export interface ResolvedLiveDataScannerOptions extends ResolvedScanCodeOptions {
  /**
   * Whether the live scanner should recognize more than one visible item.
   */
  recognizesMultipleItems: boolean
}
