package com.margelo.nitro.datascanner

import com.google.mlkit.vision.barcode.common.Barcode

internal fun Barcode.toScannedCode(): ScannedCode {
  val rawValue = rawValue ?: throw Error("The scanned code does not contain a text payload.")

  return ScannedCode(
    rawValue = rawValue,
    displayValue = displayValue,
    format = format.toBarcodeFormat(),
    valueType = valueType.toBarcodeValueType()
  )
}

internal fun Array<TargetBarcodeFormat>.toMlKitFormats(): IntArray? {
  if (any { format -> format == TargetBarcodeFormat.ALL }) {
    return null
  }

  return map { format -> format.toMlKitFormat() }.toIntArray()
}

private fun TargetBarcodeFormat.toMlKitFormat(): Int =
  when (this) {
    TargetBarcodeFormat.ALL -> Barcode.FORMAT_ALL_FORMATS
    TargetBarcodeFormat.AZTEC -> Barcode.FORMAT_AZTEC
    TargetBarcodeFormat.CODABAR -> Barcode.FORMAT_CODABAR
    TargetBarcodeFormat.CODE_39 -> Barcode.FORMAT_CODE_39
    TargetBarcodeFormat.CODE_93 -> Barcode.FORMAT_CODE_93
    TargetBarcodeFormat.CODE_128 -> Barcode.FORMAT_CODE_128
    TargetBarcodeFormat.DATA_MATRIX -> Barcode.FORMAT_DATA_MATRIX
    TargetBarcodeFormat.EAN_8 -> Barcode.FORMAT_EAN_8
    TargetBarcodeFormat.EAN_13 -> Barcode.FORMAT_EAN_13
    TargetBarcodeFormat.ITF -> Barcode.FORMAT_ITF
    TargetBarcodeFormat.PDF_417 -> Barcode.FORMAT_PDF417
    TargetBarcodeFormat.QR -> Barcode.FORMAT_QR_CODE
    TargetBarcodeFormat.UPC_A -> Barcode.FORMAT_UPC_A
    TargetBarcodeFormat.UPC_E -> Barcode.FORMAT_UPC_E
  }

private fun Int.toBarcodeFormat(): BarcodeFormat =
  when (this) {
    Barcode.FORMAT_AZTEC -> BarcodeFormat.AZTEC
    Barcode.FORMAT_CODABAR -> BarcodeFormat.CODABAR
    Barcode.FORMAT_CODE_39 -> BarcodeFormat.CODE_39
    Barcode.FORMAT_CODE_93 -> BarcodeFormat.CODE_93
    Barcode.FORMAT_CODE_128 -> BarcodeFormat.CODE_128
    Barcode.FORMAT_DATA_MATRIX -> BarcodeFormat.DATA_MATRIX
    Barcode.FORMAT_EAN_8 -> BarcodeFormat.EAN_8
    Barcode.FORMAT_EAN_13 -> BarcodeFormat.EAN_13
    Barcode.FORMAT_ITF -> BarcodeFormat.ITF
    Barcode.FORMAT_PDF417 -> BarcodeFormat.PDF_417
    Barcode.FORMAT_QR_CODE -> BarcodeFormat.QR
    Barcode.FORMAT_UPC_A -> BarcodeFormat.UPC_A
    Barcode.FORMAT_UPC_E -> BarcodeFormat.UPC_E
    else -> BarcodeFormat.UNKNOWN
  }

private fun Int.toBarcodeValueType(): BarcodeValueType =
  when (this) {
    Barcode.TYPE_CALENDAR_EVENT -> BarcodeValueType.CALENDAR_EVENT
    Barcode.TYPE_CONTACT_INFO -> BarcodeValueType.CONTACT_INFO
    Barcode.TYPE_DRIVER_LICENSE -> BarcodeValueType.DRIVER_LICENSE
    Barcode.TYPE_EMAIL -> BarcodeValueType.EMAIL
    Barcode.TYPE_GEO -> BarcodeValueType.GEO
    Barcode.TYPE_ISBN -> BarcodeValueType.ISBN
    Barcode.TYPE_PHONE -> BarcodeValueType.PHONE
    Barcode.TYPE_PRODUCT -> BarcodeValueType.PRODUCT
    Barcode.TYPE_SMS -> BarcodeValueType.SMS
    Barcode.TYPE_TEXT -> BarcodeValueType.TEXT
    Barcode.TYPE_URL -> BarcodeValueType.URL
    Barcode.TYPE_WIFI -> BarcodeValueType.WIFI
    else -> BarcodeValueType.UNKNOWN
  }
