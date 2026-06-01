package com.margelo.nitro.datascanner

import com.google.mlkit.vision.barcode.common.Barcode as MlKitBarcode

internal object DataScannerDefaults {
  val supportedBarcodeFormats: Array<BarcodeFormat> =
    arrayOf(
      BarcodeFormat.AZTEC,
      BarcodeFormat.CODABAR,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.ITF,
      BarcodeFormat.PDF417,
      BarcodeFormat.QR,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    )

  val capabilities: DataScannerCapabilities
    get() =
      DataScannerCapabilities(
        isSupported = true,
        isAvailable = true,
        supportsOneShotScanning = true,
        supportsContinuousScanning = false,
        supportsBarcodeRecognition = true,
        supportsTextRecognition = false,
        supportsMultipleItems = false,
        supportsHighFrameRateTracking = false,
        supportsPinchToZoom = false,
        supportsAutoZoom = true,
        supportsManualInput = true,
        supportsGuidance = false,
        supportsHighlighting = false,
        supportsRegionOfInterest = false,
        supportsZoomFactor = false,
        supportsPhotoCapture = false,
        supportedBarcodeFormats = supportedBarcodeFormats,
        supportedTextContentTypes = emptyArray(),
        supportedTextRecognitionLanguages = emptyArray(),
      )

  val defaultConfiguration: DataScannerConfiguration
    get() =
      DataScannerConfiguration(
        recognizes = RecognizedDataTypes(
          barcode = BarcodeRecognitionOptions(formats = null),
          text = null,
        ),
        qualityLevel = null,
        recognizesMultipleItems = null,
        isHighFrameRateTrackingEnabled = null,
        isPinchToZoomEnabled = null,
        isGuidanceEnabled = null,
        isHighlightingEnabled = null,
        isAutoZoomEnabled = null,
        isManualInputEnabled = null,
        regionOfInterest = null,
      )

  fun validate(configuration: DataScannerConfiguration) {
    val recognizes = configuration.recognizes
    val barcodeOptions = recognizes?.barcode ?: if (recognizes == null) BarcodeRecognitionOptions(null) else null

    if (recognizes?.text != null) {
      throw IllegalArgumentException("Text recognition is not supported by the Android Google Code Scanner.")
    }
    if (barcodeOptions == null) {
      throw IllegalArgumentException("Android Google Code Scanner requires barcode recognition to be enabled.")
    }
    if (configuration.recognizesMultipleItems == true) {
      throw IllegalArgumentException("Multiple item tracking is not supported by the Android Google Code Scanner.")
    }
    if (configuration.isHighFrameRateTrackingEnabled == true) {
      throw IllegalArgumentException("High-frame-rate tracking is not supported by the Android Google Code Scanner.")
    }
    if (configuration.isPinchToZoomEnabled == true) {
      throw IllegalArgumentException("Pinch-to-zoom is not supported by the Android Google Code Scanner.")
    }
    if (configuration.isGuidanceEnabled == true) {
      throw IllegalArgumentException("Guidance UI configuration is not supported by the Android Google Code Scanner.")
    }
    if (configuration.isHighlightingEnabled == true) {
      throw IllegalArgumentException("Highlighting UI configuration is not supported by the Android Google Code Scanner.")
    }
    if (configuration.regionOfInterest != null) {
      throw IllegalArgumentException("Regions of interest are not supported by the Android Google Code Scanner.")
    }

    barcodeOptions.formats
      ?.filterNot { supportedBarcodeFormats.contains(it) }
      ?.takeIf { it.isNotEmpty() }
      ?.let { unsupportedFormats ->
        throw IllegalArgumentException(
          "Unsupported Android barcode format(s): ${
            unsupportedFormats.joinToString(", ") { it.name }
          }",
        )
      }
  }
}

internal fun BarcodeFormat.toMlKitFormat(): Int =
  when (this) {
    BarcodeFormat.AZTEC -> MlKitBarcode.FORMAT_AZTEC
    BarcodeFormat.CODABAR -> MlKitBarcode.FORMAT_CODABAR
    BarcodeFormat.CODE_128 -> MlKitBarcode.FORMAT_CODE_128
    BarcodeFormat.CODE_39 -> MlKitBarcode.FORMAT_CODE_39
    BarcodeFormat.CODE_93 -> MlKitBarcode.FORMAT_CODE_93
    BarcodeFormat.DATA_MATRIX -> MlKitBarcode.FORMAT_DATA_MATRIX
    BarcodeFormat.EAN_13 -> MlKitBarcode.FORMAT_EAN_13
    BarcodeFormat.EAN_8 -> MlKitBarcode.FORMAT_EAN_8
    BarcodeFormat.ITF -> MlKitBarcode.FORMAT_ITF
    BarcodeFormat.PDF417 -> MlKitBarcode.FORMAT_PDF417
    BarcodeFormat.QR -> MlKitBarcode.FORMAT_QR_CODE
    BarcodeFormat.UPC_A -> MlKitBarcode.FORMAT_UPC_A
    BarcodeFormat.UPC_E -> MlKitBarcode.FORMAT_UPC_E
    else -> throw IllegalArgumentException(
      "Barcode format ${name} is not supported by the Android Google Code Scanner.",
    )
  }
