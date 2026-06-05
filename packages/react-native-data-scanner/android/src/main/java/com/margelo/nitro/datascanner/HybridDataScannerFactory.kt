package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.barcode.common.Barcode as MLKitBarcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  private val context
    get() =
      NitroModules.applicationContext
        ?: throw IllegalStateException(
          "No Android application context is available. Cannot start barcode scanning.",
        )

  override fun scan(options: ResolvedScanOptions): Promise<Barcode> {
    val scannerOptions =
      GmsBarcodeScannerOptions
        .Builder()
        .applyTargetFormats(options.targetFormats)
        .apply {
          if (options.enableAutoZoom) {
            enableAutoZoom()
          }
        }.build()
    val scanner = GmsBarcodeScanning.getClient(context, scannerOptions)
    val promise = Promise<Barcode>()

    scanner
      .startScan()
      .addOnSuccessListener { barcode ->
        promise.resolve(barcode.toScannerBarcode())
      }.addOnCanceledListener {
        promise.reject(RuntimeException("The barcode scan was cancelled."))
      }.addOnFailureListener { error ->
        promise.reject(error)
      }

    return promise
  }
}

private fun GmsBarcodeScannerOptions.Builder.applyTargetFormats(
  targetFormats: Array<TargetBarcodeFormat>,
): GmsBarcodeScannerOptions.Builder {
  if (targetFormats.isEmpty()) {
    throw IllegalArgumentException("targetFormats cannot be empty. Use 'all' instead.")
  }

  val containsAll = targetFormats.any { it == TargetBarcodeFormat.ALL }
  if (containsAll) {
    if (targetFormats.size != 1) {
      throw IllegalArgumentException(
        "targetFormats cannot combine 'all' with specific barcode formats.",
      )
    }
    return this
  }

  val formats = targetFormats.map { it.toMLKitBarcodeFormat() }.toIntArray()
  setBarcodeFormats(formats.first(), *formats.copyOfRange(1, formats.size))
  return this
}

@MLKitBarcode.BarcodeFormat
private fun TargetBarcodeFormat.toMLKitBarcodeFormat(): Int {
  return when (this) {
    TargetBarcodeFormat.CODE_128 -> MLKitBarcode.FORMAT_CODE_128
    TargetBarcodeFormat.CODE_39 -> MLKitBarcode.FORMAT_CODE_39
    TargetBarcodeFormat.CODE_93 -> MLKitBarcode.FORMAT_CODE_93
    TargetBarcodeFormat.CODABAR -> MLKitBarcode.FORMAT_CODABAR
    TargetBarcodeFormat.DATA_MATRIX -> MLKitBarcode.FORMAT_DATA_MATRIX
    TargetBarcodeFormat.EAN_13 -> MLKitBarcode.FORMAT_EAN_13
    TargetBarcodeFormat.EAN_8 -> MLKitBarcode.FORMAT_EAN_8
    TargetBarcodeFormat.ITF -> MLKitBarcode.FORMAT_ITF
    TargetBarcodeFormat.QR_CODE -> MLKitBarcode.FORMAT_QR_CODE
    TargetBarcodeFormat.UPC_A -> MLKitBarcode.FORMAT_UPC_A
    TargetBarcodeFormat.UPC_E -> MLKitBarcode.FORMAT_UPC_E
    TargetBarcodeFormat.PDF_417 -> MLKitBarcode.FORMAT_PDF417
    TargetBarcodeFormat.AZTEC -> MLKitBarcode.FORMAT_AZTEC
    TargetBarcodeFormat.ALL -> MLKitBarcode.FORMAT_ALL_FORMATS
  }
}

private fun MLKitBarcode.toScannerBarcode(): Barcode {
  return Barcode(
    format = BarcodeFormat.fromMLKitBarcodeFormat(format),
    rawValue = rawValue,
    displayValue = displayValue,
  )
}

private fun BarcodeFormat.Companion.fromMLKitBarcodeFormat(
  @MLKitBarcode.BarcodeFormat format: Int,
): BarcodeFormat {
  return when (format) {
    MLKitBarcode.FORMAT_CODE_128 -> BarcodeFormat.CODE_128
    MLKitBarcode.FORMAT_CODE_39 -> BarcodeFormat.CODE_39
    MLKitBarcode.FORMAT_CODE_93 -> BarcodeFormat.CODE_93
    MLKitBarcode.FORMAT_CODABAR -> BarcodeFormat.CODABAR
    MLKitBarcode.FORMAT_DATA_MATRIX -> BarcodeFormat.DATA_MATRIX
    MLKitBarcode.FORMAT_EAN_13 -> BarcodeFormat.EAN_13
    MLKitBarcode.FORMAT_EAN_8 -> BarcodeFormat.EAN_8
    MLKitBarcode.FORMAT_ITF -> BarcodeFormat.ITF
    MLKitBarcode.FORMAT_QR_CODE -> BarcodeFormat.QR_CODE
    MLKitBarcode.FORMAT_UPC_A -> BarcodeFormat.UPC_A
    MLKitBarcode.FORMAT_UPC_E -> BarcodeFormat.UPC_E
    MLKitBarcode.FORMAT_PDF417 -> BarcodeFormat.PDF_417
    MLKitBarcode.FORMAT_AZTEC -> BarcodeFormat.AZTEC
    else -> BarcodeFormat.UNKNOWN
  }
}
