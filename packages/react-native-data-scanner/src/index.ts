import { NitroModules } from 'react-native-nitro-modules'
import type {
  BarcodeFormat,
  BarcodeValueType,
  DataScannerCapabilities,
  DataScannerFactory,
  DataScannerQualityLevel,
  ScanCodeOptions,
  ScannedCode,
} from './specs/DataScannerFactory.nitro'

export const DataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

export type {
  BarcodeFormat,
  BarcodeValueType,
  DataScannerCapabilities,
  DataScannerFactory,
  DataScannerQualityLevel,
  ScanCodeOptions,
  ScannedCode,
}
