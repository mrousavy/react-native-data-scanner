import type { HybridObject } from 'react-native-nitro-modules'
import type {
  DataScanner,
  DataScannerCapabilities,
  DataScannerConfiguration,
} from './DataScanner.nitro'

/**
 * Entry point for creating native data scanner instances.
 *
 * @see {@linkcode DataScanner}
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * The runtime scanner capabilities for the current platform and device.
   */
  readonly capabilities: DataScannerCapabilities

  /**
   * Creates a native data scanner.
   *
   * The returned scanner is ready to use. If the requested configuration uses
   * a capability that is unavailable on the current platform, this method throws
   * a JavaScript `Error` that names the unsupported option.
   *
   * @throws If the current platform cannot create a scanner for the requested configuration.
   */
  createDataScanner(configuration?: DataScannerConfiguration): DataScanner
}
