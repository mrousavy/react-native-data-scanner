import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'

/**
 * One-shot data scanner.
 *
 * @see {@linkcode DataScannerFactory.scanBarcode}
 */
export const DataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

export type { BarcodeFormat, TargetBarcodeFormat } from './BarcodeFormat'
export type { ScanBarcodeOptions } from './ScanBarcodeOptions'
export type { ScanQualityLevel } from './ScanQualityLevel'
export type { ScannedBarcode } from './ScannedBarcode'
export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
