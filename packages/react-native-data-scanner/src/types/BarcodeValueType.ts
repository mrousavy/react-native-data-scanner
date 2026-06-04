import type { ScannedCode } from './ScannedCode'

/**
 * Represents parsed semantic content for a scanned code.
 *
 * This is returned through {@linkcode ScannedCode.valueType} when the native
 * scanner exposes a parsed type for the payload.
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
