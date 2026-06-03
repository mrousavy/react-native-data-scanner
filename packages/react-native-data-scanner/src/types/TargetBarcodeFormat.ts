import type { BarcodeFormat } from './BarcodeFormat'
import type { ScanCodeOptions } from './ScanCodeOptions'

/**
 * Represents a barcode format request passed through
 * {@linkcode ScanCodeOptions.barcodeFormats}.
 *
 * Use `all` to ask the native scanner to accept every format it supports.
 *
 * @see {@linkcode ScanCodeOptions.barcodeFormats}
 */
export type TargetBarcodeFormat = 'all' | BarcodeFormat
