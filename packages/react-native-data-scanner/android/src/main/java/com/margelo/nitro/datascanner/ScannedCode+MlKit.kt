package com.margelo.nitro.datascanner

import com.google.mlkit.vision.barcode.common.Barcode

internal fun Barcode.toScannedCode(): ScannedCode {
  val value = rawValue ?: displayValue
    ?: throw Error("Scanned code does not contain a text payload.")

  return ScannedCode(
    rawValue = value,
    displayValue = displayValue,
    format = format.toBarcodeFormat(),
    valueType = valueType.toBarcodeValueType()
  )
}
