import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'

export const DataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

export type * from './specs/DataScanner.nitro'
export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
