package com.margelo.nitro.datascanner.extensions

import com.google.mlkit.vision.barcode.common.Barcode
import com.margelo.nitro.datascanner.TargetBarcodeFormat

@Barcode.BarcodeFormat
internal fun TargetBarcodeFormat.toMLKitBarcodeFormat(): Int {
  return when (this) {
    TargetBarcodeFormat.AZTEC -> Barcode.FORMAT_AZTEC
    TargetBarcodeFormat.CODABAR -> Barcode.FORMAT_CODABAR
    TargetBarcodeFormat.CODE_128 -> Barcode.FORMAT_CODE_128
    TargetBarcodeFormat.CODE_39 -> Barcode.FORMAT_CODE_39
    TargetBarcodeFormat.CODE_93 -> Barcode.FORMAT_CODE_93
    TargetBarcodeFormat.DATA_MATRIX -> Barcode.FORMAT_DATA_MATRIX
    TargetBarcodeFormat.EAN_13 -> Barcode.FORMAT_EAN_13
    TargetBarcodeFormat.EAN_8 -> Barcode.FORMAT_EAN_8
    TargetBarcodeFormat.ITF -> Barcode.FORMAT_ITF
    TargetBarcodeFormat.PDF_417 -> Barcode.FORMAT_PDF417
    TargetBarcodeFormat.QR -> Barcode.FORMAT_QR_CODE
    TargetBarcodeFormat.UPC_A -> Barcode.FORMAT_UPC_A
    TargetBarcodeFormat.UPC_E -> Barcode.FORMAT_UPC_E
  }
}
