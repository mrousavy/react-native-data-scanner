import type { ScanOptions } from './ScanOptions'

/**
 * Represents a barcode format request accepted by {@linkcode ScanOptions.formats}.
 *
 * @see {@linkcode ScanOptions.formats}
 */
export type TargetBarcodeFormat =
  | 'all'
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
