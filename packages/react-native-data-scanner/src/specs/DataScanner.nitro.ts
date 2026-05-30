import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Kinds of values the scanner can emit.
 *
 * Availability is runtime-driven. Call getCapabilities() and branch on the
 * returned arrays instead of making assumptions from the current OS.
 */
export type DataScannerValueType = 'barcode' | 'text'

/**
 * Barcode formats normalized for JavaScript.
 */
export type DataScannerBarcodeFormat =
  | 'unknown'
  | 'aztec'
  | 'codabar'
  | 'code-39'
  | 'code-39-checksum'
  | 'code-39-full-ascii'
  | 'code-39-full-ascii-checksum'
  | 'code-93'
  | 'code-93i'
  | 'code-128'
  | 'data-matrix'
  | 'ean-8'
  | 'ean-13'
  | 'gs1-data-bar'
  | 'gs1-data-bar-expanded'
  | 'gs1-data-bar-limited'
  | 'itf'
  | 'itf-checksum'
  | 'itf-14'
  | 'micro-pdf-417'
  | 'micro-qr'
  | 'msi-plessey'
  | 'pdf-417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'

/**
 * Text content filters normalized for JavaScript.
 */
export type DataScannerTextContentType =
  | 'url'
  | 'date-time-duration'
  | 'email-address'
  | 'flight-number'
  | 'full-street-address'
  | 'shipment-tracking-number'
  | 'telephone-number'
  | 'currency'

/**
 * Parsed barcode value categories normalized for JavaScript.
 */
export type DataScannerBarcodeValueType =
  | 'unknown'
  | 'contact-info'
  | 'email'
  | 'isbn'
  | 'phone'
  | 'product'
  | 'sms'
  | 'text'
  | 'url'
  | 'wifi'
  | 'geo'
  | 'calendar-event'
  | 'driver-license'

/**
 * Scanner speed/accuracy tradeoff.
 */
export type DataScannerQualityLevel = 'fast' | 'balanced' | 'accurate'

/**
 * Camera authorization status for the host app.
 */
export type DataScannerCameraPermissionStatus =
  | 'not-determined'
  | 'denied'
  | 'restricted'
  | 'authorized'
  | 'not-required'

/**
 * Source that produced a scanned value.
 */
export type DataScannerResultSource = 'camera' | 'manual-input'

/**
 * Scanner availability reasons normalized for JavaScript.
 */
export type DataScannerUnavailableReason =
  | 'unsupported'
  | 'camera-restricted'
  | 'camera-permission-denied'
  | 'camera-unavailable'
  | 'scanner-unavailable'
  | 'scanner-installation-required'
  | 'unknown'

export type DataScannerEmailAddressType = 'unknown' | 'home' | 'work'

export type DataScannerPhoneNumberType =
  | 'unknown'
  | 'home'
  | 'work'
  | 'fax'
  | 'mobile'

export type DataScannerAddressType = 'unknown' | 'home' | 'work'

export type DataScannerWifiEncryptionType =
  | 'unknown'
  | 'open'
  | 'wep'
  | 'wpa'

export type DataScannerPhotoMimeType =
  | 'image/jpeg'
  | 'image/heic'
  | 'image/png'

/**
 * Point in scanner view coordinates.
 */
export interface DataScannerPoint {
  x: number
  y: number
}

/**
 * Rectangle in scanner view coordinates.
 */
export interface DataScannerRect {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Four-corner bounds for a scanned value.
 */
export interface DataScannerBounds {
  topLeft: DataScannerPoint
  topRight: DataScannerPoint
  bottomRight: DataScannerPoint
  bottomLeft: DataScannerPoint
  boundingBox?: DataScannerRect
}

/**
 * Scanner configuration.
 *
 * Fields that are unavailable on the current device are ignored or rejected
 * according to the method being called. Use getCapabilities() to
 * decide which controls to show and which options to pass.
 */
export interface DataScannerConfiguration {
  valueTypes?: DataScannerValueType[]
  barcodeFormats?: DataScannerBarcodeFormat[]
  barcodeValueTypes?: DataScannerBarcodeValueType[]
  textRecognitionLanguages?: string[]
  textContentTypes?: DataScannerTextContentType[]
  qualityLevel?: DataScannerQualityLevel
  recognizesMultipleValues?: boolean
  highFrameRateTrackingEnabled?: boolean
  pinchToZoomEnabled?: boolean
  guidanceEnabled?: boolean
  highlightingEnabled?: boolean
  regionOfInterest?: DataScannerRect
  autoZoomEnabled?: boolean
  manualInputEnabled?: boolean
  prepareScannerIfNeeded?: boolean
}

/**
 * Runtime scanner capabilities for the current device.
 */
export interface DataScannerCapabilities {
  isSupported: boolean
  isAvailable: boolean
  unavailableReason?: DataScannerUnavailableReason
  availableValueTypes: DataScannerValueType[]
  availableBarcodeFormats: DataScannerBarcodeFormat[]
  availableBarcodeValueTypes: DataScannerBarcodeValueType[]
  availableTextContentTypes: DataScannerTextContentType[]
  availableTextRecognitionLanguages: string[]
  supportsOneShotScanning: boolean
  supportsLiveScanning: boolean
  supportsMultipleValues: boolean
  supportsHighFrameRateTracking: boolean
  supportsPinchToZoom: boolean
  supportsGuidance: boolean
  supportsHighlighting: boolean
  supportsRegionOfInterest: boolean
  supportsCustomOverlays: boolean
  supportsPhotoCapture: boolean
  supportsZoomFactor: boolean
  supportsAutoZoom: boolean
  supportsManualInput: boolean
  canPrepareScanner: boolean
  requiresCameraPermission: boolean
}

/**
 * Lightweight person-name payload exposed lazily from a scanned value.
 */
export interface DataScannerPersonNameValue
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly formattedName?: string
  readonly pronunciation?: string
  readonly prefix?: string
  readonly first?: string
  readonly middle?: string
  readonly last?: string
  readonly suffix?: string
}

/**
 * Lightweight address payload exposed lazily from a scanned value.
 */
export interface DataScannerAddressValue
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly type?: DataScannerAddressType
  readonly addressLines: string[]
}

/**
 * Lightweight calendar date/time payload exposed lazily from a scanned value.
 */
export interface DataScannerCalendarDateTimeValue
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly year?: number
  readonly month?: number
  readonly day?: number
  readonly hours?: number
  readonly minutes?: number
  readonly seconds?: number
  readonly isUtc?: boolean
  readonly rawValue?: string
}

/**
 * Base lazy value returned by the scanner.
 */
export interface DataScannedValue
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly id?: string
  readonly type: DataScannerValueType
  readonly rawValue?: string
  readonly displayValue?: string
  readonly source?: DataScannerResultSource
  readonly bounds?: DataScannerBounds
}

/**
 * Scanned text value.
 */
export interface DataScannedTextValue extends DataScannedValue {
  readonly transcript: string
  readonly contentType?: DataScannerTextContentType
}

/**
 * Base scanned barcode value.
 */
export interface DataScannedBarcodeValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains plain text.
 */
export interface DataScannedBarcodeTextValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly text?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains an email payload.
 */
export interface DataScannedEmailValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly address?: string
  readonly subject?: string
  readonly body?: string
  readonly emailType?: DataScannerEmailAddressType
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains a phone payload.
 */
export interface DataScannedPhoneValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly number?: string
  readonly phoneType?: DataScannerPhoneNumberType
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains an SMS payload.
 */
export interface DataScannedSmsValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly phoneNumber?: string
  readonly message?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains a URL payload.
 */
export interface DataScannedUrlValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly title?: string
  readonly url?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains a Wi-Fi network payload.
 */
export interface DataScannedWifiValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly ssid?: string
  readonly password?: string
  readonly encryptionType?: DataScannerWifiEncryptionType
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains geographic coordinates.
 */
export interface DataScannedGeoValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly latitude: number
  readonly longitude: number
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains a calendar event.
 */
export interface DataScannedCalendarEventValue
  extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly summary?: string
  readonly description?: string
  readonly location?: string
  readonly organizer?: string
  readonly status?: string
  readonly start?: DataScannerCalendarDateTimeValue
  readonly end?: DataScannerCalendarDateTimeValue
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains contact information.
 */
export interface DataScannedContactInfoValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly personName?: DataScannerPersonNameValue
  readonly organization?: string
  readonly title?: string
  readonly phones: DataScannedPhoneValue[]
  readonly emails: DataScannedEmailValue[]
  readonly urls: string[]
  readonly addresses: DataScannerAddressValue[]
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains driver-license information.
 */
export interface DataScannedDriverLicenseValue
  extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly documentType?: string
  readonly firstName?: string
  readonly middleName?: string
  readonly lastName?: string
  readonly gender?: string
  readonly addressStreet?: string
  readonly addressCity?: string
  readonly addressState?: string
  readonly addressZip?: string
  readonly licenseNumber?: string
  readonly issueDate?: string
  readonly expiryDate?: string
  readonly birthDate?: string
  readonly issuingCountry?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains an ISBN.
 */
export interface DataScannedIsbnValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly isbn?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Barcode value that contains a product identifier.
 */
export interface DataScannedProductValue extends DataScannedValue {
  readonly format: DataScannerBarcodeFormat
  readonly valueType: DataScannerBarcodeValueType
  readonly product?: string
  toRawBytes(): ArrayBuffer | undefined
}

/**
 * Zoom state change event.
 */
export interface DataScannerZoomChangedEvent {
  zoomFactor: number
  minZoomFactor: number
  maxZoomFactor: number
}

/**
 * Availability change event.
 */
export interface DataScannerUnavailableEvent {
  reason: DataScannerUnavailableReason
  message: string
}

/**
 * Photo capture result. Binary data is converted only when requested.
 */
export interface DataScannerPhoto
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly width: number
  readonly height: number
  readonly mimeType: DataScannerPhotoMimeType
  toArrayBuffer(): Promise<ArrayBuffer>
  toBase64(): Promise<string>
  saveToTemporaryFile(): Promise<string>
}

/**
 * Listener subscription returned by scanner listener APIs.
 *
 * Calling remove() detaches exactly the listener represented by this object.
 */
export interface DataScannerListenerSubscription
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  remove(): void
}

/**
 * Stateful scanner instance.
 */
export interface DataScanner
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Whether the native scanner is actively scanning camera frames.
   */
  readonly isScanning: boolean

  /**
   * Whether the scanner is currently available on this device.
   */
  readonly isAvailable: boolean

  /**
   * Minimum supported camera zoom factor for the current scanner session.
   */
  readonly minZoomFactor: number

  /**
   * Maximum supported camera zoom factor for the current scanner session.
   */
  readonly maxZoomFactor: number

  /**
   * Current camera zoom factor.
   */
  zoomFactor: number

  /**
   * Returns scanner features available on the current device.
   */
  getCapabilities(): Promise<DataScannerCapabilities>

  /**
   * Returns the current camera permission status.
   */
  getCameraPermissionStatus(): Promise<DataScannerCameraPermissionStatus>

  /**
   * Requests camera access where required by the scanner.
   */
  requestCameraPermission(): Promise<DataScannerCameraPermissionStatus>

  /**
   * Checks whether the scanner is ready to present or start scanning.
   */
  isScannerAvailable(): Promise<boolean>

  /**
   * Performs any native setup needed before scanning.
   */
  prepareScanner(): Promise<void>

  /**
   * Applies scanner configuration. The implementation may recreate the
   * underlying scanner if init-only settings change.
   */
  configure(configuration: DataScannerConfiguration): Promise<void>

  /**
   * Opens a one-shot scanner and resolves with the scanned value.
   */
  scan(configuration?: DataScannerConfiguration): Promise<DataScannedValue>

  /**
   * Starts live camera scanning.
   */
  startScanning(configuration?: DataScannerConfiguration): Promise<void>

  /**
   * Stops live camera scanning.
   */
  stopScanning(): Promise<void>

  /**
   * Captures a high-resolution photo of the scanner camera feed.
   */
  capturePhoto(): Promise<DataScannerPhoto>

  /**
   * Returns the latest scanned values known to the scanner.
   */
  getScannedValues(): DataScannedValue[]

  /**
   * Updates the live scan region of interest in scanner view coordinates.
   *
   * Pass undefined to clear the region.
   */
  setRegionOfInterest(regionOfInterest?: DataScannerRect): void

  /**
   * Adds a listener that receives the current scanned values whenever they
   * change. Diffing, state tracking, and batching are intentionally left to JS.
   */
  addScannedValuesChangedListener(
    listener: (values: DataScannedValue[]) => void
  ): DataScannerListenerSubscription

  /**
   * Adds a listener for user taps on scanned values.
   */
  addValueTappedListener(
    listener: (value: DataScannedValue) => void
  ): DataScannerListenerSubscription

  /**
   * Adds a listener for zoom factor changes.
   */
  addZoomChangedListener(
    listener: (event: DataScannerZoomChangedEvent) => void
  ): DataScannerListenerSubscription

  /**
   * Adds a listener for scanner availability changes.
   */
  addUnavailableListener(
    listener: (event: DataScannerUnavailableEvent) => void
  ): DataScannerListenerSubscription

  /**
   * Adds a listener for scanner errors.
   */
  addErrorListener(
    listener: (error: Error) => void
  ): DataScannerListenerSubscription
}
