/**
 * Represents the machine-readable format of a scanned barcode.
 */
export type BarcodeFormat =
  | 'unknown'
  | 'code-128'
  | 'code-39'
  | 'code-93'
  | 'codabar'
  | 'data-matrix'
  | 'ean-13'
  | 'ean-8'
  | 'itf'
  | 'qr-code'
  | 'upc-a'
  | 'upc-e'
  | 'pdf-417'
  | 'aztec'

/**
 * Represents a barcode format that the native scanner can be
 * configured to scan for, or `'all'` to scan for every supported format.
 *
 * @see {@linkcode BarcodeFormat}
 */
export type TargetBarcodeFormat = Exclude<BarcodeFormat, 'unknown'> | 'all'
