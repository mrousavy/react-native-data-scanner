package com.margelo.nitro.datascanner.extensions

import com.google.mlkit.vision.barcode.common.Barcode
import com.margelo.nitro.datascanner.BarcodeFormat
import com.margelo.nitro.datascanner.ScannedBarcode

internal fun Barcode.toScannedBarcode(): ScannedBarcode {
  val value = rawValue
    ?: throw IllegalArgumentException("Scanned barcode does not contain a decoded string value.")

  val format = BarcodeFormat.fromMLKitBarcodeFormat(format)
  return ScannedBarcode(value, format)
}
