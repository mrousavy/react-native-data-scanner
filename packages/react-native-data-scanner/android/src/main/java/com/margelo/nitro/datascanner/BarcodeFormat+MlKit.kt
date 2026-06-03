package com.margelo.nitro.datascanner

import com.google.mlkit.vision.barcode.common.Barcode

internal val BarcodeFormat.Companion.supportedMlKitFormats: Array<BarcodeFormat>
  get() = arrayOf(
    BarcodeFormat.AZTEC,
    BarcodeFormat.CODABAR,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.ITF,
    BarcodeFormat.PDF_417,
    BarcodeFormat.QR,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E
  )

internal fun TargetBarcodeFormat.toMlKitFormat(): Int {
  return when (this) {
    TargetBarcodeFormat.ALL -> throw Error("all cannot be combined with specific barcode formats.")
    TargetBarcodeFormat.UNKNOWN -> throw Error("unknown cannot be used as a required barcode format.")
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
}

internal fun Int.toBarcodeFormat(): BarcodeFormat {
  return when (this) {
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
}
