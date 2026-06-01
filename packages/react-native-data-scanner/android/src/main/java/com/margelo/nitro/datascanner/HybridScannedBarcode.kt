package com.margelo.nitro.datascanner

import android.graphics.Point as AndroidPoint
import android.graphics.Rect as AndroidRect
import com.google.mlkit.vision.barcode.common.Barcode as MlKitBarcode
import com.margelo.nitro.core.ArrayBuffer
import java.util.UUID

class HybridScannedBarcode(
  barcode: MlKitBarcode,
) : HybridScannedBarcodeSpec() {
  override val id: String = UUID.randomUUID().toString()
  override val itemType: ScannedItemType = ScannedItemType.BARCODE
  override val bounds: Bounds? = barcode.toBounds()
  override val format: BarcodeFormat = barcode.format.toBarcodeFormat()
  override val rawValue: String? = barcode.rawValue
  override val displayValue: String? = barcode.displayValue
  override val rawBytes: ArrayBuffer? = barcode.rawBytes?.let { ArrayBuffer.copy(it) }
  override val payload: BarcodePayload? = barcode.toBarcodePayload()
}

private fun MlKitBarcode.toBounds(): Bounds? {
  val corners = cornerPoints
  if (corners != null && corners.size >= 4) {
    return Bounds(
      topLeft = corners[0].toPoint(),
      topRight = corners[1].toPoint(),
      bottomRight = corners[2].toPoint(),
      bottomLeft = corners[3].toPoint(),
    )
  }

  return boundingBox?.toBounds()
}

private fun AndroidRect.toBounds(): Bounds =
  Bounds(
    topLeft = Point(left.toDouble(), top.toDouble()),
    topRight = Point(right.toDouble(), top.toDouble()),
    bottomRight = Point(right.toDouble(), bottom.toDouble()),
    bottomLeft = Point(left.toDouble(), bottom.toDouble()),
  )

private fun AndroidPoint.toPoint(): Point = Point(x.toDouble(), y.toDouble())

private fun Int.toBarcodeFormat(): BarcodeFormat =
  when (this) {
    MlKitBarcode.FORMAT_AZTEC -> BarcodeFormat.AZTEC
    MlKitBarcode.FORMAT_CODABAR -> BarcodeFormat.CODABAR
    MlKitBarcode.FORMAT_CODE_128 -> BarcodeFormat.CODE_128
    MlKitBarcode.FORMAT_CODE_39 -> BarcodeFormat.CODE_39
    MlKitBarcode.FORMAT_CODE_93 -> BarcodeFormat.CODE_93
    MlKitBarcode.FORMAT_DATA_MATRIX -> BarcodeFormat.DATA_MATRIX
    MlKitBarcode.FORMAT_EAN_13 -> BarcodeFormat.EAN_13
    MlKitBarcode.FORMAT_EAN_8 -> BarcodeFormat.EAN_8
    MlKitBarcode.FORMAT_ITF -> BarcodeFormat.ITF
    MlKitBarcode.FORMAT_PDF417 -> BarcodeFormat.PDF417
    MlKitBarcode.FORMAT_QR_CODE -> BarcodeFormat.QR
    MlKitBarcode.FORMAT_UPC_A -> BarcodeFormat.UPC_A
    MlKitBarcode.FORMAT_UPC_E -> BarcodeFormat.UPC_E
    else -> BarcodeFormat.UNKNOWN
  }

private fun MlKitBarcode.toBarcodePayload(): BarcodePayload =
  BarcodePayload(
    valueType = valueType.toBarcodeValueType(),
    calendarEvent = calendarEvent?.toPayload(),
    contactInfo = contactInfo?.toPayload(),
    driverLicense = driverLicense?.toPayload(),
    email = email?.toPayload(),
    geo = geoPoint?.toPayload(),
    phone = phone?.toPayload(),
    sms = sms?.toPayload(),
    url = url?.toPayload(),
    wifi = wifi?.toPayload(),
  )

private fun Int.toBarcodeValueType(): BarcodeValueType =
  when (this) {
    MlKitBarcode.TYPE_CALENDAR_EVENT -> BarcodeValueType.CALENDAR_EVENT
    MlKitBarcode.TYPE_CONTACT_INFO -> BarcodeValueType.CONTACT_INFO
    MlKitBarcode.TYPE_DRIVER_LICENSE -> BarcodeValueType.DRIVER_LICENSE
    MlKitBarcode.TYPE_EMAIL -> BarcodeValueType.EMAIL
    MlKitBarcode.TYPE_GEO -> BarcodeValueType.GEO
    MlKitBarcode.TYPE_ISBN -> BarcodeValueType.ISBN
    MlKitBarcode.TYPE_PHONE -> BarcodeValueType.PHONE
    MlKitBarcode.TYPE_PRODUCT -> BarcodeValueType.PRODUCT
    MlKitBarcode.TYPE_SMS -> BarcodeValueType.SMS
    MlKitBarcode.TYPE_TEXT -> BarcodeValueType.TEXT
    MlKitBarcode.TYPE_URL -> BarcodeValueType.URL
    MlKitBarcode.TYPE_WIFI -> BarcodeValueType.WIFI
    else -> BarcodeValueType.UNKNOWN
  }

private fun MlKitBarcode.CalendarEvent.toPayload(): BarcodeCalendarEvent =
  BarcodeCalendarEvent(
    summary = summary,
    description = description,
    location = location,
    organizer = organizer,
    status = status,
    start = start?.toPayload(),
    end = end?.toPayload(),
  )

private fun MlKitBarcode.CalendarDateTime.toPayload(): BarcodeCalendarDateTime =
  BarcodeCalendarDateTime(
    rawValue = rawValue,
    year = year.toDouble(),
    month = month.toDouble(),
    day = day.toDouble(),
    hours = hours.toDouble(),
    minutes = minutes.toDouble(),
    seconds = seconds.toDouble(),
    isUtc = isUtc,
  )

private fun MlKitBarcode.ContactInfo.toPayload(): BarcodeContactInfo =
  BarcodeContactInfo(
    name = name?.toPayload(),
    organization = organization,
    title = title,
    phones = phones.map { it.toPayload() }.toTypedArray(),
    emails = emails.map { it.toPayload() }.toTypedArray(),
    urls = urls.toTypedArray(),
    addresses = addresses.map { it.toPayload() }.toTypedArray(),
  )

private fun MlKitBarcode.PersonName.toPayload(): BarcodePersonName =
  BarcodePersonName(
    formattedName = formattedName,
    prefix = prefix,
    first = first,
    middle = middle,
    last = last,
    suffix = suffix,
    pronunciation = pronunciation,
  )

private fun MlKitBarcode.DriverLicense.toPayload(): BarcodeDriverLicense =
  BarcodeDriverLicense(
    documentType = documentType,
    licenseNumber = licenseNumber,
    firstName = firstName,
    middleName = middleName,
    lastName = lastName,
    gender = gender,
    birthDate = birthDate,
    issueDate = issueDate,
    expiryDate = expiryDate,
    issuingCountry = issuingCountry,
    addressStreet = addressStreet,
    addressCity = addressCity,
    addressState = addressState,
    addressZip = addressZip,
  )

private fun MlKitBarcode.Email.toPayload(): BarcodeEmail =
  BarcodeEmail(
    address = address,
    subject = subject,
    body = body,
    type = type.toBarcodeEmailType(),
  )

private fun Int.toBarcodeEmailType(): BarcodeEmailType =
  when (this) {
    MlKitBarcode.Email.TYPE_HOME -> BarcodeEmailType.HOME
    MlKitBarcode.Email.TYPE_WORK -> BarcodeEmailType.WORK
    else -> BarcodeEmailType.UNKNOWN
  }

private fun MlKitBarcode.GeoPoint.toPayload(): BarcodeGeoPoint =
  BarcodeGeoPoint(
    latitude = lat,
    longitude = lng,
  )

private fun MlKitBarcode.Phone.toPayload(): BarcodePhone =
  BarcodePhone(
    number = number,
    type = type.toBarcodePhoneType(),
  )

private fun Int.toBarcodePhoneType(): BarcodePhoneType =
  when (this) {
    MlKitBarcode.Phone.TYPE_FAX -> BarcodePhoneType.FAX
    MlKitBarcode.Phone.TYPE_HOME -> BarcodePhoneType.HOME
    MlKitBarcode.Phone.TYPE_MOBILE -> BarcodePhoneType.MOBILE
    MlKitBarcode.Phone.TYPE_WORK -> BarcodePhoneType.WORK
    else -> BarcodePhoneType.UNKNOWN
  }

private fun MlKitBarcode.Address.toPayload(): BarcodeAddress =
  BarcodeAddress(
    type = type.toBarcodeAddressType(),
    addressLines = addressLines,
  )

private fun Int.toBarcodeAddressType(): BarcodeAddressType =
  when (this) {
    MlKitBarcode.Address.TYPE_HOME -> BarcodeAddressType.HOME
    MlKitBarcode.Address.TYPE_WORK -> BarcodeAddressType.WORK
    else -> BarcodeAddressType.UNKNOWN
  }

private fun MlKitBarcode.Sms.toPayload(): BarcodeSms =
  BarcodeSms(
    phoneNumber = phoneNumber,
    message = message,
  )

private fun MlKitBarcode.UrlBookmark.toPayload(): BarcodeUrl =
  BarcodeUrl(
    title = title,
    url = url,
  )

private fun MlKitBarcode.WiFi.toPayload(): BarcodeWifi =
  BarcodeWifi(
    ssid = ssid,
    password = password,
    encryptionType = encryptionType.toBarcodeWifiEncryptionType(),
  )

private fun Int.toBarcodeWifiEncryptionType(): BarcodeWifiEncryptionType =
  when (this) {
    MlKitBarcode.WiFi.TYPE_OPEN -> BarcodeWifiEncryptionType.OPEN
    MlKitBarcode.WiFi.TYPE_WEP -> BarcodeWifiEncryptionType.WEP
    MlKitBarcode.WiFi.TYPE_WPA -> BarcodeWifiEncryptionType.WPA
    else -> BarcodeWifiEncryptionType.UNKNOWN
  }
