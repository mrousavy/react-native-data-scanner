package com.margelo.nitro.datascanner

import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions

internal fun ScanBarcodeOptions?.toGmsBarcodeScannerOptions(): GmsBarcodeScannerOptions {
  val targetFormats = this?.targetFormats ?: TargetBarcodeFormat.entries.toTypedArray()
  if (targetFormats.isEmpty()) {
    throw IllegalArgumentException("targetFormats must not be empty.")
  }

  val mlKitFormats = targetFormats.map { format ->
    format.toMLKitBarcodeFormat()
  }
  val firstFormat = mlKitFormats.first()
  val remainingFormats = mlKitFormats.drop(1).toIntArray()

  val builder = GmsBarcodeScannerOptions.Builder()
    .setBarcodeFormats(firstFormat, *remainingFormats)

  if (this?.enableAutoZoom == true) {
    builder.enableAutoZoom()
  }

  return builder.build()
}
