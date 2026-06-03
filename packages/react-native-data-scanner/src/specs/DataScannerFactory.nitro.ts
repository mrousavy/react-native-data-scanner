import type { HybridObject } from 'react-native-nitro-modules'
import type { DataScannerApi } from '../types/DataScannerApi'
import type { DataScannerCapabilities } from '../types/DataScannerCapabilities'
import type { ResolvedLiveDataScannerOptions } from '../types/ResolvedLiveDataScannerOptions'
import type { ResolvedScanCodeOptions } from '../types/ResolvedScanCodeOptions'
import type { ScannedCode } from '../types/ScannedCode'
import type { LiveDataScanner } from './LiveDataScanner.nitro'

/**
 * Native Nitro entry point for camera-based data scanning.
 *
 * Public callers should use {@linkcode DataScannerApi}; it applies JavaScript
 * defaults before crossing the native boundary.
 *
 * @see {@linkcode DataScannerApi}
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
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
   * @see {@linkcode ResolvedScanCodeOptions}
   * @see {@linkcode ScannedCode}
   */
  scanCode(options: ResolvedScanCodeOptions): Promise<ScannedCode>

  /**
   * Creates a live scanner that streams recognized codes through callbacks.
   *
   * Creation rejects on platforms that do not provide a live scanner backend.
   *
   * @see {@linkcode ResolvedLiveDataScannerOptions}
   * @see {@linkcode LiveDataScanner}
   */
  createLiveScanner(
    options: ResolvedLiveDataScannerOptions
  ): Promise<LiveDataScanner>
}
