/**
 * Represents a barcode format that can be requested by scan options.
 */
export type TargetBarcodeFormat =
  | 'aztec'
  | 'codabar'
  | 'code-128'
  | 'code-39'
  | 'code-93'
  | 'data-matrix'
  | 'ean-13'
  | 'ean-8'
  | 'itf'
  | 'pdf-417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'

/**
 * Represents the detected barcode format.
 *
 * @see {@linkcode TargetBarcodeFormat}
 */
export type BarcodeFormat = TargetBarcodeFormat | 'unknown'
