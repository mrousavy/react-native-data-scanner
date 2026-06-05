/**
 * Represents a barcode format accepted by {@linkcode ScanBarcodeOptions.targetFormats}.
 *
 * @see {@linkcode targetBarcodeFormats}
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
 * Represents the detected format of a {@linkcode ScannedBarcode}.
 *
 * @see {@linkcode ScannedBarcode.format}
 */
export type BarcodeFormat = TargetBarcodeFormat | 'unknown'

/**
 * All barcode formats that can be requested by {@linkcode ScanBarcodeOptions.targetFormats}.
 */
export const targetBarcodeFormats = [
  'aztec',
  'codabar',
  'code-128',
  'code-39',
  'code-93',
  'data-matrix',
  'ean-13',
  'ean-8',
  'itf',
  'pdf-417',
  'qr',
  'upc-a',
  'upc-e',
] as const satisfies readonly TargetBarcodeFormat[]
