import type { ScanOptions } from './ScanOptions'
import type { ScannedCode } from './ScannedCode'

/**
 * Represents the public code-scanning API.
 *
 * @see {@linkcode DataScannerApi.scan}
 */
export interface DataScannerApi {
  /**
   * Opens the native camera scanner and resolves with the first scanned code.
   *
   * @throws When the scanner is unavailable, the user cancels scanning, or the
   * requested options cannot be satisfied by the current platform.
   * @see {@linkcode ScanOptions}
   * @see {@linkcode ScannedCode}
   */
  scan(options?: ScanOptions): Promise<ScannedCode>
}
