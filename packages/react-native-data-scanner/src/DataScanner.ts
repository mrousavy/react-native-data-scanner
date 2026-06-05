import { NitroModules } from 'react-native-nitro-modules'
import type { Barcode } from './specs/Barcode'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
import type { ResolvedScanOptions } from './specs/ResolvedScanOptions'
import type { ScanOptions } from './ScanOptions'
import { resolveTargetBarcodeFormats } from './ScanOptions'

const NativeDataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

function resolveScanOptions(
  options: ScanOptions | undefined
): ResolvedScanOptions {
  return {
    targetFormats: resolveTargetBarcodeFormats(options?.targetFormats),
    enableAutoZoom: options?.enableAutoZoom ?? false,
  }
}

/**
 * Provides one-shot barcode scanning through the platform scanner UI.
 *
 * @see {@linkcode DataScannerModule.scan}
 */
export interface DataScannerModule {
  /**
   * Opens the native scanner UI and resolves with one scanned {@linkcode Barcode}.
   *
   * Rejects if scanning is unavailable, the app is missing required platform
   * configuration, the user cancels, or a requested barcode format is not
   * supported by the current platform.
   *
   * @example
   * ```ts
   * import { DataScanner } from 'react-native-data-scanner'
   *
   * const barcode = await DataScanner.scan({
   *   targetFormats: ['qr-code', 'aztec'],
   *   enableAutoZoom: true,
   * })
   *
   * console.log(barcode.rawValue)
   * ```
   */
  scan(options?: ScanOptions): Promise<Barcode>
}

/**
 * One-shot barcode scanner entry point.
 *
 * @see {@linkcode DataScannerModule.scan}
 */
export const DataScanner: DataScannerModule = {
  scan(options) {
    return NativeDataScanner.scan(resolveScanOptions(options))
  },
}

/**
 * Opens the native scanner UI and resolves with one scanned {@linkcode Barcode}.
 *
 * @see {@linkcode DataScannerModule.scan}
 */
export function scan(options?: ScanOptions): Promise<Barcode> {
  return DataScanner.scan(options)
}
