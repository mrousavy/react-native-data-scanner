package com.margelo.nitro.datascanner

import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions

internal fun ResolvedScanCodeOptions.toGmsBarcodeScannerOptions(): GmsBarcodeScannerOptions {
  val builder = GmsBarcodeScannerOptions.Builder()

  if (barcodeFormats.isEmpty()) {
    throw Error("barcodeFormats must contain at least one format.")
  }

  if (barcodeFormats.contains(TargetBarcodeFormat.ALL)) {
    if (barcodeFormats.size > 1) {
      throw Error("all cannot be combined with specific barcode formats.")
    }
  } else {
    val formats = barcodeFormats.map { it.toMlKitFormat() }
    builder.setBarcodeFormats(formats.first(), *formats.drop(1).toIntArray())
  }

  if (enableAutoZoom) {
    builder.enableAutoZoom()
  }

  if (allowManualInput) {
    builder.allowManualInput()
  }

  return builder.build()
}
