import type { ScannedCode } from './ScannedCode'

/**
 * Represents the semantic content type of a scanned barcode.
 *
 * This metadata is returned through {@linkcode ScannedCode.valueType} when the
 * native scanner provides a parsed type.
 *
 * @see {@linkcode ScannedCode.valueType}
 */
export type BarcodeValueType =
  | 'unknown'
  | 'calendar-event'
  | 'contact-info'
  | 'driver-license'
  | 'email'
  | 'geo'
  | 'isbn'
  | 'phone'
  | 'product'
  | 'sms'
  | 'text'
  | 'url'
  | 'wifi'
