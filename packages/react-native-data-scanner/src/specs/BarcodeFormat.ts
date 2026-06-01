/**
 * Represents a machine-readable barcode symbology returned by
 * {@linkcode ScannedBarcode.format}.
 *
 * @see {@linkcode RecognizedBarcodeDataType.formats}
 */
export type BarcodeFormat =
  | 'unknown'
  | 'aztec'
  | 'codabar'
  | 'code-128'
  | 'code-39'
  | 'code-39-checksum'
  | 'code-39-full-ascii'
  | 'code-39-full-ascii-checksum'
  | 'code-93'
  | 'code-93i'
  | 'data-matrix'
  | 'ean-13'
  | 'ean-8'
  | 'gs1-data-bar'
  | 'gs1-data-bar-expanded'
  | 'gs1-data-bar-limited'
  | 'i2of5'
  | 'i2of5-checksum'
  | 'itf'
  | 'itf-14'
  | 'msi-plessey'
  | 'micro-pdf-417'
  | 'micro-qr'
  | 'pdf-417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'
