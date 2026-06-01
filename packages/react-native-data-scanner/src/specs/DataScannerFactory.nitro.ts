import type { HybridObject } from 'react-native-nitro-modules'
import type { DataScanner } from './DataScanner.nitro'
import type { DataScannerCapabilities } from './DataScannerCapabilities'
import type { DataScannerOptions } from './DataScannerOptions'

/**
 * Entry point for creating native data scanner instances.
 *
 * Use {@linkcode createDataScanner} to create a configured scanner.
 *
 * @see {@linkcode DataScanner}
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Returns the current scanner capabilities for this device.
   *
   * @discussion Availability can change while the app is running when camera
   * permission or device restrictions change. Query this before presenting
   * scanner UI and subscribe to scanner errors for runtime changes.
   */
  getCapabilities(): Promise<DataScannerCapabilities>

  /**
   * Creates a configured native data scanner.
   *
   * The returned {@linkcode DataScanner} is ready to use. Required data types
   * and formats are validated during creation; unsupported best-effort feature
   * preferences are reflected in the resolved configuration.
   *
   * @throws If a required data type, format, or item recognition mode is
   * unsupported by the native backend.
   */
  createDataScanner(options?: DataScannerOptions): DataScanner
}
