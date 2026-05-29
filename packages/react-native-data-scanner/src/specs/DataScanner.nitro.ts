import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Native scanner backend that produced a scanner value or capability.
 *
 * The Android value deliberately avoids the literal "android" because Android
 * NDK builds define an ANDROID macro that conflicts with generated C++ enum
 * cases.
 */
export type DataScannerPlatform = 'ios' | 'androidMlKit'

/**
 * Data families that the scanner can recognize.
 *
 * iOS supports both text and barcode scanning through VisionKit's
 * DataScannerViewController. Android's Google code scanner supports barcode
 * scanning only.
 */
export type DataScannerDataType = 'barcode' | 'text'

/**
 * Barcode symbologies exposed by Apple Vision/VisionKit and Google ML Kit's
 * code scanner, normalized for JavaScript.
 *
 * Some values are platform-specific. Use getCapabilities() before requesting
 * strict format filters if your app needs to adapt at runtime.
 */
export type DataScannerBarcodeFormat =
  | 'unknown'
  | 'aztec'
  | 'codabar'
  | 'code39'
  | 'code39Checksum'
  | 'code39FullASCII'
  | 'code39FullASCIIChecksum'
  | 'code93'
  | 'code93i'
  | 'code128'
  | 'dataMatrix'
  | 'ean8'
  | 'ean13'
  | 'gs1DataBar'
  | 'gs1DataBarExpanded'
  | 'gs1DataBarLimited'
  | 'itf'
  | 'itfChecksum'
  | 'itf14'
  | 'microPdf417'
  | 'microQr'
  | 'msiPlessey'
  | 'pdf417'
  | 'qr'
  | 'upcA'
  | 'upcE'

/**
 * Text content filters supported by VisionKit's DataScannerViewController.
 */
export type DataScannerTextContentType =
  | 'url'
  | 'dateTimeDuration'
  | 'emailAddress'
  | 'flightNumber'
  | 'fullStreetAddress'
  | 'shipmentTrackingNumber'
  | 'telephoneNumber'
  | 'currency'

/**
 * Parsed barcode value types returned by Google ML Kit Barcode.
 *
 * iOS generally exposes the barcode payload and symbology through
 * VNBarcodeObservation instead of this parsed payload model.
 */
export type DataScannerBarcodeValueType =
  | 'unknown'
  | 'contactInfo'
  | 'email'
  | 'isbn'
  | 'phone'
  | 'product'
  | 'sms'
  | 'text'
  | 'url'
  | 'wifi'
  | 'geo'
  | 'calendarEvent'
  | 'driverLicense'

/**
 * Quality level used by VisionKit when recognizing text and barcodes.
 */
export type DataScannerQualityLevel = 'fast' | 'balanced' | 'accurate'

/**
 * Camera authorization status for the host app.
 */
export type DataScannerCameraPermissionStatus =
  | 'notDetermined'
  | 'denied'
  | 'restricted'
  | 'authorized'
  | 'notRequired'

/**
 * Source that produced a recognized item.
 */
export type DataScannerResultSource = 'camera' | 'manualInput'

/**
 * Live item collection mutation type from VisionKit delegate callbacks.
 */
export type DataScannerItemsChangeType = 'added' | 'updated' | 'removed'

/**
 * Scanner availability reasons normalized across platforms.
 */
export type DataScannerUnavailableReason =
  | 'unsupported'
  | 'cameraRestricted'
  | 'cameraPermissionDenied'
  | 'cameraUnavailable'
  | 'googlePlayServicesUnavailable'
  | 'scannerModuleUnavailable'
  | 'unknown'

/**
 * Error codes thrown by scanner methods or emitted through listeners.
 */
export type DataScannerErrorCode =
  | 'unsupported'
  | 'unavailable'
  | 'permissionDenied'
  | 'cancelled'
  | 'invalidConfiguration'
  | 'alreadyScanning'
  | 'notScanning'
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
 * Four-corner bounds for recognized text or barcode items.
 */
export interface DataScannerBounds {
  topLeft: DataScannerPoint
  topRight: DataScannerPoint
  bottomRight: DataScannerPoint
  bottomLeft: DataScannerPoint
  boundingBox?: DataScannerRect
}

/**
 * Text and barcode data requested from the scanner.
 *
 * For type "barcode", use barcodeFormats and barcodeValueTypes to narrow
 * recognition. For type "text", use textRecognitionLanguages and
 * textContentTypes. Unsupported fields are ignored by native implementations
 * after validation.
 */
export interface DataScannerTarget {
  type: DataScannerDataType
  barcodeFormats?: DataScannerBarcodeFormat[]
  barcodeValueTypes?: DataScannerBarcodeValueType[]
  textRecognitionLanguages?: string[]
  textContentTypes?: DataScannerTextContentType[]
}

/**
 * iOS-only VisionKit scanner configuration.
 */
export interface DataScannerIOSConfiguration {
  /**
   * Recognition speed/accuracy tradeoff. Defaults to "balanced".
   */
  qualityLevel?: DataScannerQualityLevel
  /**
   * If true, VisionKit tracks all recognized items. If false, it tracks the
   * item nearest the point of interest. Defaults to false.
   */
  recognizesMultipleItems?: boolean
  /**
   * If true, VisionKit updates item geometry more frequently for custom
   * overlays. Defaults to false.
   */
  highFrameRateTrackingEnabled?: boolean
  /**
   * Enables the system pinch gesture for camera zoom. Defaults to true.
   */
  pinchToZoomEnabled?: boolean
  /**
   * Enables VisionKit's system guidance text while scanning. Defaults to true.
   */
  guidanceEnabled?: boolean
  /**
   * Enables VisionKit's system item highlighting. Defaults to true.
   */
  highlightingEnabled?: boolean
  /**
   * Limits recognition to this scanner-view rectangle.
   */
  regionOfInterest?: DataScannerRect
}

/**
 * Android-only Google code scanner configuration.
 */
export interface DataScannerAndroidConfiguration {
  /**
   * Enables ML Kit code scanner auto-zoom. Defaults to false.
   */
  autoZoomEnabled?: boolean
  /**
   * Enables Google code scanner manual input UI. Defaults to false.
   */
  manualInputEnabled?: boolean
  /**
   * Requests explicit installation of the optional scanner module before
   * scanning if it is not available yet.
   */
  installScannerModuleIfNeeded?: boolean
}

/**
 * Cross-platform scanner configuration.
 */
export interface DataScannerConfiguration {
  /**
   * Data types to recognize. Defaults to barcode scanning on Android and both
   * barcode and text scanning on iOS.
   */
  targets?: DataScannerTarget[]
  ios?: DataScannerIOSConfiguration
  android?: DataScannerAndroidConfiguration
}

/**
 * Runtime scanner capabilities for the current device and platform.
 */
export interface DataScannerCapabilities {
  platform: DataScannerPlatform
  isSupported: boolean
  isAvailable: boolean
  unavailableReason?: DataScannerUnavailableReason
  supportedTargets: DataScannerDataType[]
  supportedBarcodeFormats: DataScannerBarcodeFormat[]
  supportedBarcodeValueTypes: DataScannerBarcodeValueType[]
  supportedTextContentTypes: DataScannerTextContentType[]
  supportedTextRecognitionLanguages: string[]
  supportsOneShotScanning: boolean
  supportsLiveScanning: boolean
  supportsTextRecognition: boolean
  supportsBarcodeRecognition: boolean
  supportsMultipleItems: boolean
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
  requiresCameraPermission: boolean
  requiresGooglePlayServices: boolean
}

export interface DataScannerEmailValue {
  address?: string
  subject?: string
  body?: string
  type?: DataScannerEmailAddressType
}

export interface DataScannerPhoneValue {
  number?: string
  type?: DataScannerPhoneNumberType
}

export interface DataScannerSmsValue {
  phoneNumber?: string
  message?: string
}

export interface DataScannerUrlValue {
  title?: string
  url?: string
}

export interface DataScannerWifiValue {
  ssid?: string
  password?: string
  encryptionType?: DataScannerWifiEncryptionType
}

export interface DataScannerGeoValue {
  latitude: number
  longitude: number
}

export interface DataScannerCalendarDateTimeValue {
  year?: number
  month?: number
  day?: number
  hours?: number
  minutes?: number
  seconds?: number
  isUtc?: boolean
  rawValue?: string
}

export interface DataScannerCalendarEventValue {
  summary?: string
  description?: string
  location?: string
  organizer?: string
  status?: string
  start?: DataScannerCalendarDateTimeValue
  end?: DataScannerCalendarDateTimeValue
}

export interface DataScannerPersonNameValue {
  formattedName?: string
  pronunciation?: string
  prefix?: string
  first?: string
  middle?: string
  last?: string
  suffix?: string
}

export interface DataScannerAddressValue {
  type?: DataScannerAddressType
  addressLines?: string[]
}

export interface DataScannerContactInfoValue {
  name?: DataScannerPersonNameValue
  organization?: string
  title?: string
  phones?: DataScannerPhoneValue[]
  emails?: DataScannerEmailValue[]
  urls?: string[]
  addresses?: DataScannerAddressValue[]
}

export interface DataScannerDriverLicenseValue {
  documentType?: string
  firstName?: string
  middleName?: string
  lastName?: string
  gender?: string
  addressStreet?: string
  addressCity?: string
  addressState?: string
  addressZip?: string
  licenseNumber?: string
  issueDate?: string
  expiryDate?: string
  birthDate?: string
  issuingCountry?: string
}

/**
 * Parsed barcode data returned by Google ML Kit when a barcode encodes one of
 * its known content types.
 */
export interface DataScannerBarcodeParsedValue {
  valueType: DataScannerBarcodeValueType
  contactInfo?: DataScannerContactInfoValue
  email?: DataScannerEmailValue
  phone?: DataScannerPhoneValue
  sms?: DataScannerSmsValue
  url?: DataScannerUrlValue
  wifi?: DataScannerWifiValue
  geo?: DataScannerGeoValue
  calendarEvent?: DataScannerCalendarEventValue
  driverLicense?: DataScannerDriverLicenseValue
  isbn?: string
  product?: string
  text?: string
}

/**
 * Recognized item from either platform.
 *
 * Barcode-specific fields are set when type is "barcode". Text-specific fields
 * are set when type is "text".
 */
export interface DataScannerItem {
  type: DataScannerDataType
  id?: string
  bounds?: DataScannerBounds
  source?: DataScannerResultSource
  barcodeFormat?: DataScannerBarcodeFormat
  barcodeValueType?: DataScannerBarcodeValueType
  payloadStringValue?: string
  rawValue?: string
  displayValue?: string
  rawBytes?: ArrayBuffer
  parsedValue?: DataScannerBarcodeParsedValue
  transcript?: string
  textContentType?: DataScannerTextContentType
}

/**
 * Item collection change event from VisionKit live scanning.
 */
export interface DataScannerItemsChangedEvent {
  changeType: DataScannerItemsChangeType
  items: DataScannerItem[]
  allItems: DataScannerItem[]
}

/**
 * User interaction event for a recognized item.
 */
export interface DataScannerItemTappedEvent {
  item: DataScannerItem
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
 * Scanner error event.
 */
export interface DataScannerErrorEvent {
  code: DataScannerErrorCode
  message: string
}

/**
 * Native photo capture result.
 */
export interface DataScannerPhoto {
  data: ArrayBuffer
  width: number
  height: number
  mimeType: DataScannerPhotoMimeType
}

/**
 * Stateful scanner instance that unifies VisionKit DataScannerViewController on
 * iOS and Google ML Kit code scanner on Android.
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
   * Current camera zoom factor. On platforms without live zoom support this
   * stays at 1.
   */
  zoomFactor: number

  /**
   * Returns scanner features available on the current device.
   */
  getCapabilities(): Promise<DataScannerCapabilities>

  /**
   * Returns the current camera permission status.
   *
   * Android's Google code scanner does not require app camera permission and
   * returns "notRequired".
   */
  getCameraPermissionStatus(): Promise<DataScannerCameraPermissionStatus>

  /**
   * Requests camera access where required by the platform.
   *
   * Android's Google code scanner resolves with "notRequired".
   */
  requestCameraPermission(): Promise<DataScannerCameraPermissionStatus>

  /**
   * Checks whether the optional Google code scanner module is available.
   *
   * iOS always resolves true.
   */
  isAndroidScannerModuleAvailable(): Promise<boolean>

  /**
   * Requests installation of the optional Google code scanner module.
   *
   * iOS resolves without doing work.
   */
  installAndroidScannerModule(): Promise<void>

  /**
   * Applies scanner configuration. Native implementations may recreate the
   * underlying platform scanner if init-only settings change.
   */
  configure(configuration: DataScannerConfiguration): Promise<void>

  /**
   * Opens a one-shot scanner and resolves with the selected or scanned item.
   *
   * Android maps this to Google code scanner startScan(). iOS may present a
   * DataScannerViewController and resolve after an item is tapped or selected.
   */
  scan(configuration?: DataScannerConfiguration): Promise<DataScannerItem>

  /**
   * Starts live camera scanning.
   *
   * Supported on iOS. Android throws "unsupported" because Google code scanner
   * owns its one-shot UI and does not expose continuous callbacks.
   */
  startScanning(configuration?: DataScannerConfiguration): Promise<void>

  /**
   * Stops live camera scanning.
   */
  stopScanning(): Promise<void>

  /**
   * Captures a high-resolution photo of the scanner camera feed.
   *
   * Supported on iOS. Android throws "unsupported".
   */
  capturePhoto(): Promise<DataScannerPhoto>

  /**
   * Returns the latest recognized live-scanner items known to native code.
   *
   * Supported on iOS. Android returns an empty array unless a native
   * implementation keeps the most recent one-shot result.
   */
  getRecognizedItems(): DataScannerItem[]

  /**
   * Updates the live scan region of interest in scanner view coordinates.
   *
   * Pass undefined to clear the region.
   */
  setRegionOfInterest(regionOfInterest?: DataScannerRect): void

  /**
   * Adds a listener for live item collection changes.
   *
   * VisionKit sends added, updated, and removed callbacks separately; this API
   * reports those through event.changeType.
   */
  addItemsChangedListener(
    listener: (event: DataScannerItemsChangedEvent) => void
  ): number

  /**
   * Adds a listener for user taps on recognized items.
   */
  addItemTappedListener(
    listener: (event: DataScannerItemTappedEvent) => void
  ): number

  /**
   * Adds a listener for zoom factor changes.
   */
  addZoomChangedListener(
    listener: (event: DataScannerZoomChangedEvent) => void
  ): number

  /**
   * Adds a listener for scanner availability changes.
   */
  addUnavailableListener(
    listener: (event: DataScannerUnavailableEvent) => void
  ): number

  /**
   * Adds a listener for scanner errors.
   */
  addErrorListener(
    listener: (event: DataScannerErrorEvent) => void
  ): number

  /**
   * Removes a listener previously registered through an add...Listener method.
   */
  removeListener(listenerId: number): void
}
