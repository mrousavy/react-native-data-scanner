import type { HybridObject } from 'react-native-nitro-modules'

/**
 * Represents a point in scanner view coordinates.
 *
 * @see {@linkcode Bounds}
 */
export interface Point {
  /**
   * The horizontal coordinate in points.
   */
  readonly x: number

  /**
   * The vertical coordinate in points.
   */
  readonly y: number
}

/**
 * Represents a rectangle in scanner view coordinates.
 *
 * @see {@linkcode DataScanner.setRegionOfInterest}
 */
export interface Rect {
  /**
   * The horizontal coordinate of the rectangle origin in points.
   */
  readonly x: number

  /**
   * The vertical coordinate of the rectangle origin in points.
   */
  readonly y: number

  /**
   * The rectangle width in points.
   */
  readonly width: number

  /**
   * The rectangle height in points.
   */
  readonly height: number
}

/**
 * Represents the four corners of a recognized item in scanner view coordinates.
 *
 * @see {@linkcode ScannedItem.bounds}
 */
export interface Bounds {
  /**
   * The top-left corner of the recognized item.
   */
  readonly topLeft: Point

  /**
   * The top-right corner of the recognized item.
   */
  readonly topRight: Point

  /**
   * The bottom-right corner of the recognized item.
   */
  readonly bottomRight: Point

  /**
   * The bottom-left corner of the recognized item.
   */
  readonly bottomLeft: Point
}

/**
 * Represents the scanner quality level.
 *
 * @see {@linkcode DataScannerConfiguration.qualityLevel}
 */
export type QualityLevel = 'balanced' | 'fast' | 'accurate'

/**
 * Represents a barcode symbology that a scanner can recognize.
 *
 * @see {@linkcode BarcodeRecognitionOptions.formats}
 * @see {@linkcode ScannedBarcode.format}
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
  | 'micro-pdf417'
  | 'micro-qr'
  | 'msi-plessey'
  | 'pdf417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'

/**
 * Represents the semantic type of text the scanner should recognize.
 *
 * @see {@linkcode TextRecognitionOptions.contentType}
 * @see {@linkcode ScannedText.contentType}
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

/**
 * Represents the recognized content type of a barcode payload.
 *
 * @see {@linkcode ScannedBarcode.valueType}
 * @see {@linkcode BarcodePayload}
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

/**
 * Represents a postal address usage type.
 *
 * @see {@linkcode BarcodeAddress.type}
 */
export type BarcodeAddressType = 'unknown' | 'home' | 'work'

/**
 * Represents an email address usage type.
 *
 * @see {@linkcode BarcodeEmail.type}
 */
export type BarcodeEmailType = 'unknown' | 'home' | 'work'

/**
 * Represents a phone number usage type.
 *
 * @see {@linkcode BarcodePhone.type}
 */
export type BarcodePhoneType = 'unknown' | 'home' | 'work' | 'fax' | 'mobile'

/**
 * Represents a Wi-Fi encryption type.
 *
 * @see {@linkcode BarcodeWifi.encryptionType}
 */
export type BarcodeWifiEncryptionType = 'unknown' | 'open' | 'wpa' | 'wep'

/**
 * Represents a postal address extracted from a barcode payload.
 *
 * @see {@linkcode BarcodeContactInfo.addresses}
 */
export interface BarcodeAddress {
  /**
   * The address usage type when the scanner can provide one.
   */
  readonly type?: BarcodeAddressType

  /**
   * The address lines in display order.
   */
  readonly addressLines: string[]
}

/**
 * Represents a date and time extracted from a barcode payload.
 *
 * @see {@linkcode BarcodeCalendarEvent.start}
 * @see {@linkcode BarcodeCalendarEvent.end}
 */
export interface BarcodeCalendarDateTime {
  /**
   * The original date-time string when the scanner provides it.
   */
  readonly rawValue?: string

  /**
   * The four-digit year when available.
   */
  readonly year?: number

  /**
   * The one-based month when available.
   */
  readonly month?: number

  /**
   * The one-based day of month when available.
   */
  readonly day?: number

  /**
   * The hour component in 24-hour time when available.
   */
  readonly hours?: number

  /**
   * The minute component when available.
   */
  readonly minutes?: number

  /**
   * The second component when available.
   */
  readonly seconds?: number

  /**
   * Whether the value is explicitly represented in UTC.
   */
  readonly isUtc?: boolean
}

/**
 * Represents a calendar event extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.calendarEvent}
 */
export interface BarcodeCalendarEvent {
  /**
   * The event summary or title.
   */
  readonly summary?: string

  /**
   * The event description.
   */
  readonly description?: string

  /**
   * The event location.
   */
  readonly location?: string

  /**
   * The event organizer.
   */
  readonly organizer?: string

  /**
   * The event status.
   */
  readonly status?: string

  /**
   * The event start date and time.
   */
  readonly start?: BarcodeCalendarDateTime

  /**
   * The event end date and time.
   */
  readonly end?: BarcodeCalendarDateTime
}

/**
 * Represents an email payload extracted from a barcode.
 *
 * @see {@linkcode BarcodePayload.email}
 */
export interface BarcodeEmail {
  /**
   * The email address.
   */
  readonly address?: string

  /**
   * The message subject.
   */
  readonly subject?: string

  /**
   * The message body.
   */
  readonly body?: string

  /**
   * The address usage type when the scanner can provide one.
   */
  readonly type?: BarcodeEmailType
}

/**
 * Represents a phone number extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.phone}
 * @see {@linkcode BarcodeContactInfo.phones}
 */
export interface BarcodePhone {
  /**
   * The phone number.
   */
  readonly number?: string

  /**
   * The phone usage type when the scanner can provide one.
   */
  readonly type?: BarcodePhoneType
}

/**
 * Represents a person's name extracted from a barcode payload.
 *
 * @see {@linkcode BarcodeContactInfo.name}
 */
export interface BarcodePersonName {
  /**
   * The formatted full name.
   */
  readonly formattedName?: string

  /**
   * The name prefix.
   */
  readonly prefix?: string

  /**
   * The first or given name.
   */
  readonly first?: string

  /**
   * The middle name.
   */
  readonly middle?: string

  /**
   * The last or family name.
   */
  readonly last?: string

  /**
   * The name suffix.
   */
  readonly suffix?: string

  /**
   * The pronunciation hint when available.
   */
  readonly pronunciation?: string
}

/**
 * Represents contact information extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.contactInfo}
 */
export interface BarcodeContactInfo {
  /**
   * The person's name.
   */
  readonly name?: BarcodePersonName

  /**
   * The organization name.
   */
  readonly organization?: string

  /**
   * The person's title.
   */
  readonly title?: string

  /**
   * The phone numbers in the contact payload.
   */
  readonly phones: BarcodePhone[]

  /**
   * The email addresses in the contact payload.
   */
  readonly emails: BarcodeEmail[]

  /**
   * The URLs in the contact payload.
   */
  readonly urls: string[]

  /**
   * The postal addresses in the contact payload.
   */
  readonly addresses: BarcodeAddress[]
}

/**
 * Represents driver license or ID-card data extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.driverLicense}
 */
export interface BarcodeDriverLicense {
  /**
   * The document type.
   */
  readonly documentType?: string

  /**
   * The license number.
   */
  readonly licenseNumber?: string

  /**
   * The holder's first name.
   */
  readonly firstName?: string

  /**
   * The holder's middle name.
   */
  readonly middleName?: string

  /**
   * The holder's last name.
   */
  readonly lastName?: string

  /**
   * The holder's gender when present in the payload.
   */
  readonly gender?: string

  /**
   * The holder's birth date as provided by the payload.
   */
  readonly birthDate?: string

  /**
   * The license issue date as provided by the payload.
   */
  readonly issueDate?: string

  /**
   * The license expiry date as provided by the payload.
   */
  readonly expiryDate?: string

  /**
   * The issuing country.
   */
  readonly issuingCountry?: string

  /**
   * The street address.
   */
  readonly addressStreet?: string

  /**
   * The address city.
   */
  readonly addressCity?: string

  /**
   * The address state or region.
   */
  readonly addressState?: string

  /**
   * The address postal code.
   */
  readonly addressZip?: string
}

/**
 * Represents geographic coordinates extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.geo}
 */
export interface BarcodeGeoPoint {
  /**
   * The latitude in decimal degrees.
   */
  readonly latitude: number

  /**
   * The longitude in decimal degrees.
   */
  readonly longitude: number
}

/**
 * Represents an SMS message extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.sms}
 */
export interface BarcodeSms {
  /**
   * The destination phone number.
   */
  readonly phoneNumber?: string

  /**
   * The message body.
   */
  readonly message?: string
}

/**
 * Represents a URL bookmark extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.url}
 */
export interface BarcodeUrl {
  /**
   * The bookmark title.
   */
  readonly title?: string

  /**
   * The URL string.
   */
  readonly url?: string
}

/**
 * Represents Wi-Fi network credentials extracted from a barcode payload.
 *
 * @see {@linkcode BarcodePayload.wifi}
 */
export interface BarcodeWifi {
  /**
   * The Wi-Fi network SSID.
   */
  readonly ssid?: string

  /**
   * The Wi-Fi network password.
   */
  readonly password?: string

  /**
   * The encryption type when the scanner can provide one.
   */
  readonly encryptionType?: BarcodeWifiEncryptionType
}

/**
 * Represents parsed barcode payload details.
 *
 * @see {@linkcode ScannedBarcode.payload}
 */
export interface BarcodePayload {
  /**
   * The semantic payload type reported by the scanner.
   */
  readonly valueType: BarcodeValueType

  /**
   * Calendar-event details when {@linkcode BarcodePayload.valueType} is `calendar-event`.
   */
  readonly calendarEvent?: BarcodeCalendarEvent

  /**
   * Contact details when {@linkcode BarcodePayload.valueType} is `contact-info`.
   */
  readonly contactInfo?: BarcodeContactInfo

  /**
   * Driver-license details when {@linkcode BarcodePayload.valueType} is `driver-license`.
   */
  readonly driverLicense?: BarcodeDriverLicense

  /**
   * Email details when {@linkcode BarcodePayload.valueType} is `email`.
   */
  readonly email?: BarcodeEmail

  /**
   * Geographic coordinates when {@linkcode BarcodePayload.valueType} is `geo`.
   */
  readonly geo?: BarcodeGeoPoint

  /**
   * Phone details when {@linkcode BarcodePayload.valueType} is `phone`.
   */
  readonly phone?: BarcodePhone

  /**
   * SMS details when {@linkcode BarcodePayload.valueType} is `sms`.
   */
  readonly sms?: BarcodeSms

  /**
   * URL details when {@linkcode BarcodePayload.valueType} is `url`.
   */
  readonly url?: BarcodeUrl

  /**
   * Wi-Fi details when {@linkcode BarcodePayload.valueType} is `wifi`.
   */
  readonly wifi?: BarcodeWifi
}

/**
 * Represents barcode recognition settings.
 *
 * @see {@linkcode DataScannerConfiguration.recognizes}
 */
export interface BarcodeRecognitionOptions {
  /**
   * The barcode formats to recognize.
   *
   * An empty or omitted array lets the platform scan all formats it supports.
   */
  readonly formats?: BarcodeFormat[]
}

/**
 * Represents text recognition settings.
 *
 * @see {@linkcode DataScannerConfiguration.recognizes}
 */
export interface TextRecognitionOptions {
  /**
   * Preferred BCP-47 language identifiers for text recognition.
   *
   * Omit this value to let the platform prioritize the user's preferred languages.
   */
  readonly languages?: string[]

  /**
   * The semantic content type to detect inside recognized text.
   *
   * Omit this value to recognize general text.
   */
  readonly contentType?: TextContentType
}

/**
 * Represents the types of data a scanner should recognize.
 *
 * @see {@linkcode DataScannerConfiguration.recognizes}
 */
export interface RecognizedDataTypes {
  /**
   * Barcode recognition settings.
   *
   * Omit this field to disable barcode recognition.
   */
  readonly barcode?: BarcodeRecognitionOptions

  /**
   * Text recognition settings.
   *
   * Omit this field to disable text recognition.
   */
  readonly text?: TextRecognitionOptions
}

/**
 * Represents configuration for a native data scanner.
 *
 * @see {@linkcode DataScannerFactory.createDataScanner}
 */
export interface DataScannerConfiguration {
  /**
   * The data types the scanner should recognize.
   *
   * Omit this value to create a cross-platform barcode scanner.
   */
  readonly recognizes?: RecognizedDataTypes

  /**
   * The quality level for recognition when the platform exposes quality control.
   */
  readonly qualityLevel?: QualityLevel

  /**
   * Whether the scanner should track multiple visible items at once.
   *
   * @default false
   */
  readonly recognizesMultipleItems?: boolean

  /**
   * Whether the scanner should update item geometry at a higher frame rate.
   */
  readonly isHighFrameRateTrackingEnabled?: boolean

  /**
   * Whether the scanner UI should allow pinch-to-zoom gestures.
   */
  readonly isPinchToZoomEnabled?: boolean

  /**
   * Whether the scanner UI should show built-in guidance.
   */
  readonly isGuidanceEnabled?: boolean

  /**
   * Whether the scanner UI should draw built-in highlights around recognized items.
   */
  readonly isHighlightingEnabled?: boolean

  /**
   * Whether the scanner may automatically zoom toward distant barcodes.
   *
   * @default false
   */
  readonly isAutoZoomEnabled?: boolean

  /**
   * Whether the scanner should let users manually type a barcode value.
   *
   * @default false
   */
  readonly isManualInputEnabled?: boolean

  /**
   * The initial area, in scanner view coordinates, that the scanner should search.
   */
  readonly regionOfInterest?: Rect
}

/**
 * Represents the capabilities available to {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner.capabilities}
 * @see {@linkcode DataScannerFactory.capabilities}
 */
export interface DataScannerCapabilities {
  /**
   * Whether the device and OS support data scanning.
   */
  readonly isSupported: boolean

  /**
   * Whether scanning is currently available to the app.
   */
  readonly isAvailable: boolean

  /**
   * Whether one-shot scanning with {@linkcode DataScanner.scan} is supported.
   */
  readonly supportsOneShotScanning: boolean

  /**
   * Whether continuous item tracking with {@linkcode DataScanner.startScanning} is supported.
   */
  readonly supportsContinuousScanning: boolean

  /**
   * Whether barcode recognition is supported.
   */
  readonly supportsBarcodeRecognition: boolean

  /**
   * Whether text recognition is supported.
   */
  readonly supportsTextRecognition: boolean

  /**
   * Whether multiple items can be tracked at the same time.
   */
  readonly supportsMultipleItems: boolean

  /**
   * Whether high-frame-rate geometry updates are supported.
   */
  readonly supportsHighFrameRateTracking: boolean

  /**
   * Whether pinch-to-zoom can be enabled in the scanner UI.
   */
  readonly supportsPinchToZoom: boolean

  /**
   * Whether automatic barcode zoom can be enabled.
   */
  readonly supportsAutoZoom: boolean

  /**
   * Whether manual barcode input can be enabled.
   */
  readonly supportsManualInput: boolean

  /**
   * Whether built-in guidance UI can be configured.
   */
  readonly supportsGuidance: boolean

  /**
   * Whether built-in item highlighting can be configured.
   */
  readonly supportsHighlighting: boolean

  /**
   * Whether a region of interest can be set.
   */
  readonly supportsRegionOfInterest: boolean

  /**
   * Whether the zoom factor can be read and changed.
   */
  readonly supportsZoomFactor: boolean

  /**
   * Whether the scanner can capture a still photo from the camera preview.
   */
  readonly supportsPhotoCapture: boolean

  /**
   * The barcode formats the current platform can recognize.
   */
  readonly supportedBarcodeFormats: BarcodeFormat[]

  /**
   * The text content types the current platform can recognize.
   */
  readonly supportedTextContentTypes: TextContentType[]

  /**
   * The text recognition language identifiers the current platform can recognize.
   */
  readonly supportedTextRecognitionLanguages: string[]
}

/**
 * Represents the kind of scanned item.
 *
 * @see {@linkcode ScannedItem.itemType}
 */
export type ScannedItemType = 'barcode' | 'text'

/**
 * Represents an item scanned by {@linkcode DataScanner}.
 *
 * @see {@linkcode ItemsChangedEvent.items}
 * @see {@linkcode ItemTappedEvent.item}
 */
export interface ScannedItem
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * A stable item identifier while the scanner is tracking the item.
   */
  readonly id: string

  /**
   * The item kind.
   */
  readonly itemType: ScannedItemType

  /**
   * The item bounds in scanner view coordinates when geometry is available.
   */
  readonly bounds?: Bounds
}

/**
 * Represents text scanned by {@linkcode DataScanner}.
 *
 * @see {@linkcode ScannedItem.itemType}
 */
export interface ScannedText extends ScannedItem {
  /**
   * The recognized text string.
   */
  readonly text: string

  /**
   * The configured semantic text content type, when one was requested.
   */
  readonly contentType?: TextContentType
}

/**
 * Represents a barcode scanned by {@linkcode DataScanner}.
 *
 * @see {@linkcode ScannedItem.itemType}
 */
export interface ScannedBarcode extends ScannedItem {
  /**
   * The barcode format.
   */
  readonly format: BarcodeFormat

  /**
   * The barcode value exactly as reported by the platform.
   */
  readonly rawValue?: string

  /**
   * The barcode value formatted for display when the platform provides one.
   */
  readonly displayValue?: string

  /**
   * The raw barcode bytes when the platform provides them.
   */
  readonly rawBytes?: ArrayBuffer

  /**
   * Parsed barcode payload details when the platform provides them.
   */
  readonly payload?: BarcodePayload
}

/**
 * Represents a batch of item tracking changes from {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner.addItemsAddedListener}
 * @see {@linkcode DataScanner.addItemsUpdatedListener}
 * @see {@linkcode DataScanner.addItemsRemovedListener}
 */
export interface ItemsChangedEvent {
  /**
   * The items that were added, updated, or removed.
   */
  readonly items: ScannedItem[]

  /**
   * The full current item list after the change.
   */
  readonly allItems: ScannedItem[]
}

/**
 * Represents a user tap on a recognized scanner item.
 *
 * @see {@linkcode DataScanner.addItemTappedListener}
 */
export interface ItemTappedEvent {
  /**
   * The item the user tapped.
   */
  readonly item: ScannedItem
}

/**
 * Represents a scanner zoom change.
 *
 * @see {@linkcode DataScanner.addZoomChangedListener}
 */
export interface ZoomChangedEvent {
  /**
   * The current zoom factor after the change.
   */
  readonly zoomFactor: number
}

/**
 * Handles scanner item tracking changes.
 *
 * @see {@linkcode DataScanner.addItemsAddedListener}
 */
export type ItemsChangedListener = (event: ItemsChangedEvent) => void

/**
 * Handles a user tap on a recognized scanner item.
 *
 * @see {@linkcode DataScanner.addItemTappedListener}
 */
export type ItemTappedListener = (event: ItemTappedEvent) => void

/**
 * Handles scanner zoom changes.
 *
 * @see {@linkcode DataScanner.addZoomChangedListener}
 */
export type ZoomChangedListener = (event: ZoomChangedEvent) => void

/**
 * Handles scanner errors that occur after a scanner has started.
 *
 * @see {@linkcode DataScanner.addErrorListener}
 */
export type ScannerErrorListener = (error: Error) => void

/**
 * Represents a removable scanner event subscription.
 *
 * @see {@linkcode DataScanner.addItemsAddedListener}
 */
export interface ListenerSubscription
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Removes the listener.
   *
   * Calling this method more than once has no effect.
   */
  remove(): void
}

/**
 * Represents a photo captured from a scanner camera preview.
 *
 * @see {@linkcode DataScanner.capturePhoto}
 */
export interface CapturedPhoto
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * The image width in pixels.
   */
  readonly width: number

  /**
   * The image height in pixels.
   */
  readonly height: number

  /**
   * The approximate in-memory byte size of the photo.
   */
  readonly byteSize: number

  /**
   * Converts the image to encoded bytes.
   *
   * @throws If the platform cannot encode the photo.
   */
  toArrayBuffer(): Promise<ArrayBuffer>

  /**
   * Saves the image to a temporary file and returns the absolute file path.
   *
   * @throws If the platform cannot write the temporary file.
   */
  saveToTemporaryFile(): Promise<string>
}

/**
 * A native scanner that can recognize barcodes and, where supported, text in camera input.
 *
 * @see {@linkcode DataScannerFactory.createDataScanner}
 */
export interface DataScanner
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * The scanner configuration resolved at creation time.
   */
  readonly configuration: DataScannerConfiguration

  /**
   * The runtime capabilities for this scanner.
   */
  readonly capabilities: DataScannerCapabilities

  /**
   * Whether scanning is currently available to the app.
   */
  readonly isAvailable: boolean

  /**
   * Whether the scanner is actively recognizing items.
   */
  readonly isScanning: boolean

  /**
   * The currently tracked items.
   */
  readonly recognizedItems: ScannedItem[]

  /**
   * The minimum supported zoom factor.
   */
  readonly minZoomFactor: number

  /**
   * The maximum supported zoom factor.
   */
  readonly maxZoomFactor: number

  /**
   * The current zoom factor.
   */
  readonly zoomFactor: number

  /**
   * Starts a one-shot scan and resolves with the selected or scanned item.
   *
   * @throws If one-shot scanning is unavailable, if the user cancels scanning, or if scanning fails.
   */
  scan(): Promise<ScannedItem>

  /**
   * Presents the scanner UI without starting a one-shot scan.
   *
   * @throws If continuous scanning UI is unavailable.
   */
  present(): Promise<void>

  /**
   * Dismisses the scanner UI if this scanner owns a presented UI.
   */
  dismiss(): Promise<void>

  /**
   * Starts continuous item recognition.
   *
   * @throws If continuous scanning is unavailable or cannot start.
   */
  startScanning(): Promise<void>

  /**
   * Stops continuous item recognition.
   */
  stopScanning(): void

  /**
   * Sets the scanner region of interest in scanner view coordinates.
   *
   * Pass `undefined` to clear the region of interest.
   *
   * @throws If regions of interest are unavailable or invalid.
   */
  setRegionOfInterest(region?: Rect): Promise<void>

  /**
   * Sets the scanner zoom factor.
   *
   * @throws If zoom control is unavailable or the factor is out of range.
   */
  setZoomFactor(zoomFactor: number): Promise<void>

  /**
   * Captures a photo from the scanner camera preview.
   *
   * @throws If photo capture is unavailable or capture fails.
   */
  capturePhoto(): Promise<CapturedPhoto>

  /**
   * Adds a listener for newly recognized items.
   */
  addItemsAddedListener(listener: ItemsChangedListener): ListenerSubscription

  /**
   * Adds a listener for recognized items whose geometry or payload changed.
   */
  addItemsUpdatedListener(listener: ItemsChangedListener): ListenerSubscription

  /**
   * Adds a listener for items that are no longer recognized.
   */
  addItemsRemovedListener(listener: ItemsChangedListener): ListenerSubscription

  /**
   * Adds a listener for taps on recognized items.
   */
  addItemTappedListener(listener: ItemTappedListener): ListenerSubscription

  /**
   * Adds a listener for scanner zoom changes.
   */
  addZoomChangedListener(listener: ZoomChangedListener): ListenerSubscription

  /**
   * Adds a listener for asynchronous scanner errors.
   */
  addErrorListener(listener: ScannerErrorListener): ListenerSubscription
}
