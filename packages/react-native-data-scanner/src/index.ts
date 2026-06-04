import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
import type { DataScannerApi } from './types/DataScannerApi'
import type { DataScannerQualityLevel } from './types/DataScannerQualityLevel'
import type { ResolvedScanOptions } from './types/ResolvedScanOptions'
import type { ScanOptions } from './types/ScanOptions'
import type { TargetBarcodeFormat } from './types/TargetBarcodeFormat'

const nativeDataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

const TARGET_BARCODE_FORMATS = new Set<string>([
  'all',
  'aztec',
  'codabar',
  'code-39',
  'code-93',
  'code-128',
  'data-matrix',
  'ean-8',
  'ean-13',
  'itf',
  'pdf-417',
  'qr',
  'upc-a',
  'upc-e',
])

const QUALITY_LEVELS = new Set<string>(['fast', 'balanced', 'accurate'])

function assertTargetBarcodeFormat(format: string): asserts format is TargetBarcodeFormat {
  if (!TARGET_BARCODE_FORMATS.has(format)) {
    throw new Error(
      `Invalid barcode format "${format}". Expected one of: ${[
        ...TARGET_BARCODE_FORMATS,
      ].join(', ')}.`
    )
  }
}

function assertQualityLevel(
  qualityLevel: string
): asserts qualityLevel is DataScannerQualityLevel {
  if (!QUALITY_LEVELS.has(qualityLevel)) {
    throw new Error(
      `Invalid quality level "${qualityLevel}". Expected one of: ${[
        ...QUALITY_LEVELS,
      ].join(', ')}.`
    )
  }
}

function resolveScanOptions(options: ScanOptions = {}): ResolvedScanOptions {
  const requestedFormats = options.formats ?? 'all'
  const qualityLevel = options.qualityLevel ?? 'balanced'

  assertQualityLevel(qualityLevel)

  if (requestedFormats === 'all') {
    return {
      formats: ['all'],
      qualityLevel,
      enableAutoZoom: options.enableAutoZoom ?? false,
    }
  }

  if (requestedFormats.length === 0) {
    throw new Error('ScanOptions.formats must contain at least one barcode format.')
  }

  const formats = [...new Set(requestedFormats)]
  for (const format of formats) {
    assertTargetBarcodeFormat(format)
  }

  if (formats.includes('all') && formats.length > 1) {
    throw new Error(
      "ScanOptions.formats cannot mix 'all' with specific barcode formats."
    )
  }

  return {
    formats,
    qualityLevel,
    enableAutoZoom: options.enableAutoZoom ?? false,
  }
}

/**
 * Opens the native data scanner.
 *
 * @see {@linkcode DataScannerApi.scan}
 */
export const DataScanner: DataScannerApi = {
  scan: (options) => nativeDataScanner.scan(resolveScanOptions(options)),
}

export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
export type { BarcodeFormat } from './types/BarcodeFormat'
export type { BarcodeValueType } from './types/BarcodeValueType'
export type { DataScannerApi } from './types/DataScannerApi'
export type { DataScannerQualityLevel } from './types/DataScannerQualityLevel'
export type { ScanOptions } from './types/ScanOptions'
export type { ScannedCode } from './types/ScannedCode'
export type { TargetBarcodeFormat } from './types/TargetBarcodeFormat'
