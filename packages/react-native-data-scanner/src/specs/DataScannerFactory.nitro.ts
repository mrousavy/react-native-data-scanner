import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Entry point for creating native data scanner instances.
 */
export interface DataScannerFactory
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Creates a native data scanner.
   *
   * @throws This is intentionally not implemented yet.
   */
  createDataScanner(): void
}
