import type { HybridObject } from 'react-native-nitro-modules'
import type {
  DataScanner,
  DataScannerConfiguration,
} from './DataScanner.nitro'

/**
 * Entry point for creating native data scanner instances.
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Creates a native data scanner.
   *
   * The returned scanner is stateful and owns native scanner lifecycle,
   * listeners, and configuration.
   *
   * @throws This is intentionally not implemented yet.
   */
  createDataScanner(configuration?: DataScannerConfiguration): DataScanner
}
