import type { HybridObject } from 'react-native-nitro-modules'
import type { BarcodeFormat } from '../types/BarcodeFormat'
import type { BarcodeValueType } from '../types/BarcodeValueType'
import type { DataScannerCapabilities } from '../types/DataScannerCapabilities'
import type { DataScannerQualityLevel } from '../types/DataScannerQualityLevel'
import type { ScanCodeOptions } from '../types/ScanCodeOptions'
import type { ScannedCode } from '../types/ScannedCode'

/**
 * Entry point for camera-based data scanning.
 *
 * Use the exported {@linkcode DataScanner} object to call this HybridObject.
 *
 * @see {@linkcode DataScannerCapabilities}
 * @see {@linkcode ScanCodeOptions}
 * @see {@linkcode ScannedCode}
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Returns the scanner capabilities that are currently available on this device.
   *
   * Availability can change at runtime when camera permission, app foreground state,
   * or device restrictions change.
   *
   * @see {@linkcode DataScannerCapabilities.isCodeScannerAvailable}
   */
  getCapabilities(): Promise<DataScannerCapabilities>

  /**
   * Opens the native camera scanner and resolves with the first scanned code.
   *
   * The returned promise rejects when scanning is unavailable, camera permission is
   * denied, the user cancels scanning, or the scanned code does not contain a text
   * payload.
   *
   * @throws If {@linkcode ScanCodeOptions.barcodeFormats} is empty, contains
   * `unknown`, or contains a required format unsupported by the current platform.
   * @see {@linkcode ScanCodeOptions}
   * @see {@linkcode ScannedCode}
   */
  scanCode(options?: ScanCodeOptions): Promise<ScannedCode>
}

export type {
  BarcodeFormat,
  BarcodeValueType,
  DataScannerCapabilities,
  DataScannerQualityLevel,
  ScanCodeOptions,
  ScannedCode,
}
