import { NitroModules } from 'react-native-nitro-modules'
import {
  targetBarcodeFormats,
  type TargetBarcodeFormat,
} from './BarcodeFormat'
import type { ResolvedScanBarcodeOptions } from './ResolvedScanBarcodeOptions'
import type { ScanBarcodeOptions } from './ScanBarcodeOptions'
import type { ScannedBarcode } from './ScannedBarcode'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'

const nativeDataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

/**
 * Starts native one-shot data scanning workflows.
 *
 * @see {@linkcode DataScanner.scanBarcode}
 */
export interface DataScanner {
  /**
   * Presents the native scanner UI and resolves with the first scanned barcode.
   *
   * @throws When scanning is unavailable, the scanner is canceled, an invalid
   * option is provided, or the scanned barcode does not contain a decoded string
   * value.
   */
  scanBarcode(options?: ScanBarcodeOptions): Promise<ScannedBarcode>
}

/**
 * Native one-shot data scanner.
 */
export const DataScanner: DataScanner = {
  scanBarcode(options) {
    return nativeDataScanner.scanBarcode(resolveScanBarcodeOptions(options))
  },
}

function resolveScanBarcodeOptions(
  options: ScanBarcodeOptions | undefined
): ResolvedScanBarcodeOptions {
  return {
    targetFormats: resolveTargetFormats(options?.targetFormats),
    enableAutoZoom: options?.enableAutoZoom ?? false,
  }
}

function resolveTargetFormats(
  targetFormats: ScanBarcodeOptions['targetFormats']
): TargetBarcodeFormat[] {
  if (targetFormats == null || targetFormats === 'all') {
    return [...targetBarcodeFormats]
  }

  if (!Array.isArray(targetFormats)) {
    throw new Error(
      "targetFormats must be 'all' or an array of barcode formats."
    )
  }
  if (targetFormats.length === 0) {
    throw new Error("targetFormats must not be empty. Use 'all' instead.")
  }

  const validFormats = new Set<string>(targetBarcodeFormats)
  const uniqueFormats = new Set<TargetBarcodeFormat>()
  for (const format of targetFormats) {
    if (!validFormats.has(format)) {
      throw new Error(`Unsupported barcode format: ${String(format)}`)
    }
    uniqueFormats.add(format)
  }

  return [...uniqueFormats]
}

export { targetBarcodeFormats } from './BarcodeFormat'
export type { BarcodeFormat, TargetBarcodeFormat } from './BarcodeFormat'
export type {
  ScanBarcodeOptions,
  TargetBarcodeFormats,
} from './ScanBarcodeOptions'
export type { ScannedBarcode } from './ScannedBarcode'
export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
