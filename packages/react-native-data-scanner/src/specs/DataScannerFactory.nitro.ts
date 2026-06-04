import type { HybridObject } from 'react-native-nitro-modules'
import type { DataScannerApi } from '../types/DataScannerApi'
import type { ResolvedScanOptions } from '../types/ResolvedScanOptions'
import type { ScannedCode } from '../types/ScannedCode'

/**
 * Native entry point used by {@linkcode DataScannerApi.scan}.
 *
 * Most callers should use the public package facade instead of constructing
 * this HybridObject directly.
 *
 * @see {@linkcode DataScannerFactory.scan}
 * @see {@linkcode DataScannerApi.scan}
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Opens the native camera scanner and resolves with one scanned code.
   *
   * @throws When the scanner is unavailable, the user cancels scanning, or the
   * requested options cannot be satisfied by the current platform.
   * @see {@linkcode ResolvedScanOptions}
   * @see {@linkcode ScannedCode}
   */
  scan(options: ResolvedScanOptions): Promise<ScannedCode>
}
