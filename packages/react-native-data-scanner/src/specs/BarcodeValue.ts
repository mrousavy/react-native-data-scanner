/**
 * Represents the parsed content category of a barcode returned by
 * {@linkcode ScannedBarcode.valueType}.
 *
 * @see {@linkcode ScannedBarcode.parsedValue}
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
 * Represents the label attached to a parsed phone number or email address.
 *
 * @see {@linkcode BarcodeEmailValue.label}
 */
export type BarcodeContactLabel = 'unknown' | 'home' | 'work'

/**
 * Represents the encryption mode of a parsed Wi-Fi barcode.
 *
 * @see {@linkcode BarcodeWifiValue.encryptionType}
 */
export type BarcodeWifiEncryptionType =
  | 'unknown'
  | 'open'
  | 'wep'
  | 'wpa'

/**
 * Represents the address label of a parsed contact address.
 *
 * @see {@linkcode BarcodeAddressValue.label}
 */
export type BarcodeAddressLabel = 'unknown' | 'home' | 'work'

/**
 * Represents a parsed calendar date-time from a barcode.
 *
 * @see {@linkcode BarcodeCalendarEventValue.start}
 */
export interface BarcodeCalendarDateTime {
  /**
   * The calendar year.
   */
  year: number
  /**
   * The calendar month, from 1 to 12.
   */
  month: number
  /**
   * The calendar day, from 1 to 31.
   */
  day: number
  /**
   * The hour in 24-hour time.
   */
  hours: number
  /**
   * The minute.
   */
  minutes: number
  /**
   * The second.
   */
  seconds: number
  /**
   * Whether the native payload marked the value as UTC.
   */
  isUtc: boolean
  /**
   * A formatted representation when the native backend provides one.
   */
  rawValue?: string
}

/**
 * Represents parsed email barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.email}
 */
export interface BarcodeEmailValue {
  /**
   * The email address.
   */
  address?: string
  /**
   * The email subject.
   */
  subject?: string
  /**
   * The email body.
   */
  body?: string
  /**
   * The native email label.
   */
  label: BarcodeContactLabel
}

/**
 * Represents parsed phone barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.phone}
 */
export interface BarcodePhoneValue {
  /**
   * The phone number.
   */
  number?: string
  /**
   * The native phone label.
   */
  label: BarcodeContactLabel
}

/**
 * Represents parsed SMS barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.sms}
 */
export interface BarcodeSmsValue {
  /**
   * The destination phone number.
   */
  phoneNumber?: string
  /**
   * The SMS message body.
   */
  message?: string
}

/**
 * Represents parsed URL barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.url}
 */
export interface BarcodeUrlValue {
  /**
   * The URL title.
   */
  title?: string
  /**
   * The URL.
   */
  url?: string
}

/**
 * Represents parsed geographic coordinate barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.geo}
 */
export interface BarcodeGeoValue {
  /**
   * Latitude in degrees.
   */
  latitude: number
  /**
   * Longitude in degrees.
   */
  longitude: number
}

/**
 * Represents parsed Wi-Fi barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.wifi}
 */
export interface BarcodeWifiValue {
  /**
   * The network SSID.
   */
  ssid?: string
  /**
   * The network password when encoded in the barcode.
   */
  password?: string
  /**
   * The network encryption type.
   */
  encryptionType: BarcodeWifiEncryptionType
}

/**
 * Represents parsed calendar event barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.calendarEvent}
 */
export interface BarcodeCalendarEventValue {
  /**
   * The event summary.
   */
  summary?: string
  /**
   * The event description.
   */
  description?: string
  /**
   * The event location.
   */
  location?: string
  /**
   * The event organizer.
   */
  organizer?: string
  /**
   * The event status.
   */
  status?: string
  /**
   * The event start date-time.
   */
  start?: BarcodeCalendarDateTime
  /**
   * The event end date-time.
   */
  end?: BarcodeCalendarDateTime
}

/**
 * Represents a parsed contact name from a barcode.
 *
 * @see {@linkcode BarcodeContactInfoValue.name}
 */
export interface BarcodePersonNameValue {
  /**
   * The formatted full name.
   */
  formattedName?: string
  /**
   * The pronunciation hint.
   */
  pronunciation?: string
  /**
   * The name prefix.
   */
  prefix?: string
  /**
   * The first name.
   */
  first?: string
  /**
   * The middle name.
   */
  middle?: string
  /**
   * The last name.
   */
  last?: string
  /**
   * The name suffix.
   */
  suffix?: string
}

/**
 * Represents a parsed contact address from a barcode.
 *
 * @see {@linkcode BarcodeContactInfoValue.addresses}
 */
export interface BarcodeAddressValue {
  /**
   * The native address label.
   */
  label: BarcodeAddressLabel
  /**
   * Address lines in display order.
   */
  addressLines: string[]
}

/**
 * Represents parsed contact barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.contactInfo}
 */
export interface BarcodeContactInfoValue {
  /**
   * The parsed person name.
   */
  name?: BarcodePersonNameValue
  /**
   * The contact organization.
   */
  organization?: string
  /**
   * The contact job title.
   */
  title?: string
  /**
   * Parsed contact phone numbers.
   */
  phones: BarcodePhoneValue[]
  /**
   * Parsed contact email addresses.
   */
  emails: BarcodeEmailValue[]
  /**
   * Parsed contact URLs.
   */
  urls: string[]
  /**
   * Parsed contact addresses.
   */
  addresses: BarcodeAddressValue[]
}

/**
 * Represents parsed driver license barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.driverLicense}
 */
export interface BarcodeDriverLicenseValue {
  /**
   * Document type.
   */
  documentType?: string
  /**
   * First name.
   */
  firstName?: string
  /**
   * Middle name.
   */
  middleName?: string
  /**
   * Last name.
   */
  lastName?: string
  /**
   * Gender marker.
   */
  gender?: string
  /**
   * Street address.
   */
  addressStreet?: string
  /**
   * City.
   */
  addressCity?: string
  /**
   * State or province.
   */
  addressState?: string
  /**
   * Postal code.
   */
  addressZip?: string
  /**
   * License number.
   */
  licenseNumber?: string
  /**
   * Issue date as encoded by the barcode.
   */
  issueDate?: string
  /**
   * Expiry date as encoded by the barcode.
   */
  expiryDate?: string
  /**
   * Birth date as encoded by the barcode.
   */
  birthDate?: string
  /**
   * Issuing country.
   */
  issuingCountry?: string
}

/**
 * Represents plain parsed text barcode details.
 *
 * @see {@linkcode BarcodeParsedValue.text}
 */
export interface BarcodeTextValue {
  /**
   * The text value.
   */
  text?: string
}

/**
 * Represents parsed payload details of a {@linkcode ScannedBarcode}.
 *
 * Only the property matching {@linkcode valueType} is expected to be set. For
 * value types that do not have a native structured payload, use
 * {@linkcode ScannedBarcode.rawValue}.
 *
 * @see {@linkcode ScannedBarcode.parsedValue}
 */
export interface BarcodeParsedValue {
  /**
   * The parsed value category.
   */
  valueType: BarcodeValueType
  /**
   * Calendar event details when {@linkcode valueType} is `calendar-event`.
   */
  calendarEvent?: BarcodeCalendarEventValue
  /**
   * Contact details when {@linkcode valueType} is `contact-info`.
   */
  contactInfo?: BarcodeContactInfoValue
  /**
   * Driver license details when {@linkcode valueType} is `driver-license`.
   */
  driverLicense?: BarcodeDriverLicenseValue
  /**
   * Email details when {@linkcode valueType} is `email`.
   */
  email?: BarcodeEmailValue
  /**
   * Geographic coordinate details when {@linkcode valueType} is `geo`.
   */
  geo?: BarcodeGeoValue
  /**
   * Phone details when {@linkcode valueType} is `phone`.
   */
  phone?: BarcodePhoneValue
  /**
   * SMS details when {@linkcode valueType} is `sms`.
   */
  sms?: BarcodeSmsValue
  /**
   * Plain text details when {@linkcode valueType} is `text`.
   */
  text?: BarcodeTextValue
  /**
   * URL details when {@linkcode valueType} is `url`.
   */
  url?: BarcodeUrlValue
  /**
   * Wi-Fi details when {@linkcode valueType} is `wifi`.
   */
  wifi?: BarcodeWifiValue
}
