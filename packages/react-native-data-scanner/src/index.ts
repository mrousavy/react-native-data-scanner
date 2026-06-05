import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'

/**
 * Native one-shot data scanner.
 */
export const DataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

export { targetBarcodeFormats } from './BarcodeFormat'
export type { BarcodeFormat, TargetBarcodeFormat } from './BarcodeFormat'
export type { ScanBarcodeOptions } from './ScanBarcodeOptions'
export type { ScannedBarcode } from './ScannedBarcode'
export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
