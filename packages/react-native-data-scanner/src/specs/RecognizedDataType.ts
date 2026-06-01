import type { BarcodeFormat } from './BarcodeFormat'
import type { TextContentType } from './TextContentType'

/**
 * Represents the high-level kind of data a {@linkcode DataScanner} should
 * recognize.
 *
 * @see {@linkcode RecognizedDataType.kind}
 */
export type RecognizedDataTypeKind = 'text' | 'barcode'

/**
 * Represents a required data type that a {@linkcode DataScanner} should
 * recognize.
 *
 * @see {@linkcode DataScannerOptions.recognizedDataTypes}
 */
export interface RecognizedDataType {
  /**
   * The scanner data type to recognize.
   */
  kind: RecognizedDataTypeKind
  /**
   * BCP-47 language identifiers to prioritize for text recognition.
   *
   * Omit this field to use the user's preferred languages. This is used only
   * when {@linkcode kind} is `text`.
   */
  languages?: string[]
  /**
   * Text content types to recognize.
   *
   * Omit this field to recognize general text. This is used only when
   * {@linkcode kind} is `text`.
   */
  contentTypes?: TextContentType[]
  /**
   * Barcode formats to recognize.
   *
   * Omit this field to recognize all supported barcode formats. This is used
   * only when {@linkcode kind} is `barcode`.
   */
  formats?: BarcodeFormat[]
}

/**
 * Represents text recognition requirements for
 * {@linkcode DataScannerFactory.createDataScanner}.
 *
 * @see {@linkcode RecognizedDataType}
 */
export interface RecognizedTextDataType {
  /**
   * BCP-47 language identifiers to prioritize.
   *
   * Omit this field to use the user's preferred languages.
   */
  languages?: string[]
  /**
   * Text content types to recognize.
   *
   * Omit this field to recognize general text.
   */
  contentTypes?: TextContentType[]
}

/**
 * Represents barcode recognition requirements for
 * {@linkcode DataScannerFactory.createDataScanner}.
 *
 * @see {@linkcode RecognizedDataType}
 */
export interface RecognizedBarcodeDataType {
  /**
   * Barcode formats to recognize.
   *
   * Omit this field to recognize all supported barcode formats.
   */
  formats?: BarcodeFormat[]
}
