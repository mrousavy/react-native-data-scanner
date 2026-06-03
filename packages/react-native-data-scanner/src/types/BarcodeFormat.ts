/**
 * Represents a barcode format that can be requested through
 * {@linkcode ScanCodeOptions.barcodeFormats} or returned by
 * {@linkcode ScannedCode.format}.
 *
 * Use {@linkcode DataScannerCapabilities.supportedBarcodeFormats} before passing
 * a required format on a platform whose support may vary.
 *
 * @see {@linkcode DataScannerFactory.scanCode}
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
