import type { DataScannerCapabilities } from './DataScannerCapabilities'
import type { LiveDataScannerOptions } from './LiveDataScannerOptions'
import type { ScanCodeOptions } from './ScanCodeOptions'
import type { ScannedCode } from './ScannedCode'
import type { LiveDataScanner } from '../specs/LiveDataScanner.nitro'

/**
 * Represents the public scanner API exposed by {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner}
 */
export interface DataScannerApi {
  /**
   * Returns scanner capabilities that are currently available on this device.
   *
   * Availability can change at runtime when camera permission, app foreground
   * state, or device restrictions change.
   *
   * @see {@linkcode DataScannerCapabilities}
   */
  getCapabilities(): Promise<DataScannerCapabilities>

  /**
   * Opens the native camera scanner and resolves with the first scanned code.
   *
   * @see {@linkcode ScanCodeOptions}
   * @see {@linkcode ScannedCode}
   */
  scanCode(options?: ScanCodeOptions): Promise<ScannedCode>

  /**
   * Creates a live scanner that streams recognized codes through callbacks.
   *
   * Android currently rejects this method because the Google Code Scanner backend
   * is a one-shot scanner UI.
   *
   * @see {@linkcode LiveDataScannerOptions}
   * @see {@linkcode LiveDataScanner}
   */
  createLiveScanner(
    options?: LiveDataScannerOptions
  ): Promise<LiveDataScanner>
}
