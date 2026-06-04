import type { ScanOptions } from './ScanOptions'
import type { ScannedCode } from './ScannedCode'

/**
 * Represents a barcode format returned by {@linkcode ScannedCode.format}.
 *
 * Requestable formats are accepted through {@linkcode ScanOptions.formats}.
 *
 * @see {@linkcode ScannedCode.format}
 * @see {@linkcode ScanOptions.formats}
 */
export type BarcodeFormat =
  | 'unknown'
  | 'aztec'
  | 'codabar'
  | 'code-39'
  | 'code-93'
  | 'code-128'
  | 'data-matrix'
  | 'ean-8'
  | 'ean-13'
  | 'itf'
  | 'pdf-417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'
