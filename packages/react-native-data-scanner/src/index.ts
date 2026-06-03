import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
import type { DataScannerApi } from './types/DataScannerApi'
import type { LiveDataScannerOptions } from './types/LiveDataScannerOptions'
import type { ResolvedLiveDataScannerOptions } from './types/ResolvedLiveDataScannerOptions'
import type { ResolvedScanCodeOptions } from './types/ResolvedScanCodeOptions'
import type { ScanCodeOptions } from './types/ScanCodeOptions'

const NativeDataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

function resolveScanCodeOptions(
  options: ScanCodeOptions | undefined
): ResolvedScanCodeOptions {
  return {
    barcodeFormats: options?.barcodeFormats ?? ['all'],
    qualityLevel: options?.qualityLevel ?? 'balanced',
    enableAutoZoom: options?.enableAutoZoom ?? false,
    allowManualInput: options?.allowManualInput ?? false,
  }
}

function resolveLiveDataScannerOptions(
  options: LiveDataScannerOptions | undefined
): ResolvedLiveDataScannerOptions {
  return {
    ...resolveScanCodeOptions(options),
    recognizesMultipleItems: options?.recognizesMultipleItems ?? true,
  }
}

/**
 * Camera-based data scanner API.
 */
export const DataScanner: DataScannerApi = {
  getCapabilities() {
    return NativeDataScanner.getCapabilities()
  },
  scanCode(options) {
    return NativeDataScanner.scanCode(resolveScanCodeOptions(options))
  },
  createLiveScanner(options) {
    return NativeDataScanner.createLiveScanner(
      resolveLiveDataScannerOptions(options)
    )
  },
}

export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
export type { LiveDataScanner } from './specs/LiveDataScanner.nitro'
export type { BarcodeFormat } from './types/BarcodeFormat'
export type { BarcodeValueType } from './types/BarcodeValueType'
export type { DataScannerApi } from './types/DataScannerApi'
export type { DataScannerCapabilities } from './types/DataScannerCapabilities'
export type { DataScannerQualityLevel } from './types/DataScannerQualityLevel'
export type { LiveDataScannerOptions } from './types/LiveDataScannerOptions'
export type { ScanCodeOptions } from './types/ScanCodeOptions'
export type { ScannedCode } from './types/ScannedCode'
export type { TargetBarcodeFormat } from './types/TargetBarcodeFormat'
