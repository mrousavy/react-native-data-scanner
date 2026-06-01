/**
 * Represents text categories that a scanner can detect inside recognized text.
 *
 * @see {@linkcode RecognizedTextDataType.contentTypes}
 */
export type TextContentType =
  | 'url'
  | 'date-time-duration'
  | 'email-address'
  | 'flight-number'
  | 'full-street-address'
  | 'shipment-tracking-number'
  | 'telephone-number'
  | 'currency'
