package com.margelo.nitro.datascanner

import android.graphics.Point as AndroidPoint
import android.graphics.Rect as AndroidRect
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.ArrayBuffer
import com.margelo.nitro.core.Promise
import java.util.UUID

class HybridDataScanner(options: DataScannerOptions?) : HybridDataScannerSpec() {
  override val capabilities: DataScannerCapabilities = createCapabilities()
  override val configuration: DataScannerResolvedConfiguration = createConfiguration(options)
  override val zoomRange: ZoomRange? = null
  override val zoomFactor: Double? = null
  override val regionOfInterest: Rect? = options?.regionOfInterest
  override val recognizedItems: Array<ScannedItem> = emptyArray()
  override var isScanning: Boolean = false
    private set

  private val selectedListeners = mutableMapOf<Int, (ScannedItem) -> Unit>()
  private val errorListeners = mutableMapOf<Int, (Throwable) -> Unit>()
  private var nextListenerId = 0

  override fun scan(): Promise<ScannedItem?> {
    val activity = NitroModules.applicationContext?.currentActivity
      ?: return Promise.rejected(Error("Cannot start barcode scanner because no Android Activity is available."))
    val promise = Promise<ScannedItem?>()
    val options = createGoogleCodeScannerOptions()
    val scanner = GmsBarcodeScanning.getClient(activity, options)

    isScanning = true
    scanner.startScan()
      .addOnSuccessListener { barcode ->
        isScanning = false
        val item = barcode.toScannedItem()
        selectedListeners.values.forEach { listener -> listener(item) }
        promise.resolve(item)
      }
      .addOnCanceledListener {
        isScanning = false
        promise.resolve(null)
      }
      .addOnFailureListener { error ->
        isScanning = false
        errorListeners.values.forEach { listener -> listener(error) }
        promise.reject(error)
      }

    return promise
  }

  override fun startScanning(): Promise<Unit> {
    return Promise.rejected(Error("Live item tracking is not supported by Google Code Scanner. Use scan() for one-shot barcode scanning."))
  }

  override fun stopScanning(): Promise<Unit> {
    isScanning = false
    return Promise.resolved(Unit)
  }

  override fun setZoomFactor(zoomFactor: Double): Promise<Unit> {
    return Promise.rejected(Error("Manual zoom is not supported by Google Code Scanner."))
  }

  override fun setRegionOfInterest(region: Rect?): Promise<Unit> {
    return Promise.rejected(Error("Region of interest is not supported by Google Code Scanner."))
  }

  override fun capturePhoto(): Promise<CapturedPhoto> {
    return Promise.rejected(Error("Photo capture is not supported by Google Code Scanner."))
  }

  override fun addOnItemsChangedListener(listener: (event: ScannedItemsChangedEvent) -> Unit): ListenerSubscription {
    return ListenerSubscription {}
  }

  override fun addOnItemSelectedListener(listener: (item: ScannedItem) -> Unit): ListenerSubscription {
    val id = nextListenerId++
    selectedListeners[id] = listener
    return ListenerSubscription { selectedListeners.remove(id) }
  }

  override fun addOnErrorListener(listener: (error: Throwable) -> Unit): ListenerSubscription {
    val id = nextListenerId++
    errorListeners[id] = listener
    return ListenerSubscription { errorListeners.remove(id) }
  }

  override fun addOnZoomChangedListener(listener: (event: ZoomChangedEvent) -> Unit): ListenerSubscription {
    return ListenerSubscription {}
  }

  private fun createGoogleCodeScannerOptions(): GmsBarcodeScannerOptions {
    val builder = GmsBarcodeScannerOptions.Builder()
    val formats = barcodeFormats
      .mapNotNull { format -> format.toAndroidBarcodeFormatOrNull() }
      .distinct()

    if (formats.isNotEmpty()) {
      val first = formats.first()
      val rest = formats.drop(1).toIntArray()
      builder.setBarcodeFormats(first, *rest)
    }
    if (configuration.features.isManualInputEnabled) {
      builder.allowManualInput()
    }
    if (configuration.features.isAutoZoomEnabled) {
      builder.enableAutoZoom()
    }
    return builder.build()
  }

  private val barcodeFormats: Array<BarcodeFormat>
    get() = configuration.recognizedDataTypes
      .filter { type -> type.kind == RecognizedDataTypeKind.BARCODE }
      .flatMap { type -> type.formats?.toList() ?: supportedAndroidBarcodeFormats.toList() }
      .ifEmpty { supportedAndroidBarcodeFormats.toList() }
      .toTypedArray()

  private fun Barcode.toScannedItem(): ScannedItem {
    val scannedBarcode = ScannedBarcode(
      format = format.toBarcodeFormat(),
      valueType = valueType.toBarcodeValueType(),
      rawValue = rawValue,
      displayValue = displayValue,
      rawBytes = rawBytes?.let { bytes -> ArrayBuffer.copy(bytes) }
    )
    return ScannedItem(
      kind = ScannedItemKind.BARCODE,
      id = UUID.randomUUID().toString(),
      bounds = cornerPoints?.toQuadrilateralOrNull(),
      boundingBox = boundingBox?.toScannerRect(),
      text = null,
      barcode = scannedBarcode
    )
  }

  private fun Int.toBarcodeFormat(): BarcodeFormat {
    return when (this) {
      Barcode.FORMAT_AZTEC -> BarcodeFormat.AZTEC
      Barcode.FORMAT_CODABAR -> BarcodeFormat.CODABAR
      Barcode.FORMAT_CODE_128 -> BarcodeFormat.CODE_128
      Barcode.FORMAT_CODE_39 -> BarcodeFormat.CODE_39
      Barcode.FORMAT_CODE_93 -> BarcodeFormat.CODE_93
      Barcode.FORMAT_DATA_MATRIX -> BarcodeFormat.DATA_MATRIX
      Barcode.FORMAT_EAN_13 -> BarcodeFormat.EAN_13
      Barcode.FORMAT_EAN_8 -> BarcodeFormat.EAN_8
      Barcode.FORMAT_ITF -> BarcodeFormat.ITF
      Barcode.FORMAT_PDF417 -> BarcodeFormat.PDF_417
      Barcode.FORMAT_QR_CODE -> BarcodeFormat.QR
      Barcode.FORMAT_UPC_A -> BarcodeFormat.UPC_A
      Barcode.FORMAT_UPC_E -> BarcodeFormat.UPC_E
      else -> BarcodeFormat.UNKNOWN
    }
  }

  private fun BarcodeFormat.toAndroidBarcodeFormatOrNull(): Int? {
    return when (this) {
      BarcodeFormat.AZTEC -> Barcode.FORMAT_AZTEC
      BarcodeFormat.CODABAR -> Barcode.FORMAT_CODABAR
      BarcodeFormat.CODE_128 -> Barcode.FORMAT_CODE_128
      BarcodeFormat.CODE_39 -> Barcode.FORMAT_CODE_39
      BarcodeFormat.CODE_93 -> Barcode.FORMAT_CODE_93
      BarcodeFormat.DATA_MATRIX -> Barcode.FORMAT_DATA_MATRIX
      BarcodeFormat.EAN_13 -> Barcode.FORMAT_EAN_13
      BarcodeFormat.EAN_8 -> Barcode.FORMAT_EAN_8
      BarcodeFormat.ITF -> Barcode.FORMAT_ITF
      BarcodeFormat.PDF_417 -> Barcode.FORMAT_PDF417
      BarcodeFormat.QR -> Barcode.FORMAT_QR_CODE
      BarcodeFormat.UPC_A -> Barcode.FORMAT_UPC_A
      BarcodeFormat.UPC_E -> Barcode.FORMAT_UPC_E
      else -> null
    }
  }

  private fun Int.toBarcodeValueType(): BarcodeValueType {
    return when (this) {
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
  }

  private fun AndroidRect.toScannerRect(): Rect {
    return Rect(left.toDouble(), top.toDouble(), width().toDouble(), height().toDouble())
  }

  private fun Array<AndroidPoint>.toQuadrilateralOrNull(): Quadrilateral? {
    if (size < 4) return null
    return Quadrilateral(
      topLeft = this[0].toScannerPoint(),
      topRight = this[1].toScannerPoint(),
      bottomRight = this[2].toScannerPoint(),
      bottomLeft = this[3].toScannerPoint()
    )
  }

  private fun AndroidPoint.toScannerPoint(): Point {
    return Point(x.toDouble(), y.toDouble())
  }

  companion object {
    val supportedAndroidBarcodeFormats = arrayOf(
      BarcodeFormat.AZTEC,
      BarcodeFormat.CODABAR,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.CODE_93,
      BarcodeFormat.DATA_MATRIX,
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.ITF,
      BarcodeFormat.PDF_417,
      BarcodeFormat.QR,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E
    )

    fun createCapabilities(): DataScannerCapabilities {
      return DataScannerCapabilities(
        isSupported = true,
        isAvailable = true,
        unavailableReason = null,
        canScanText = false,
        canScanBarcodes = true,
        canTrackItems = false,
        canScanMultipleItems = false,
        canCapturePhoto = false,
        canSetRegionOfInterest = false,
        canSetZoomFactor = false,
        canUsePinchToZoom = false,
        canUseGuidance = false,
        canUseHighlighting = false,
        canUseHighFrameRateTracking = false,
        canUseManualInput = true,
        canUseAutoZoom = true,
        supportedBarcodeFormats = supportedAndroidBarcodeFormats,
        supportedTextContentTypes = emptyArray(),
        supportedTextRecognitionLanguages = emptyArray()
      )
    }

    fun createConfiguration(options: DataScannerOptions?): DataScannerResolvedConfiguration {
      val recognizedDataTypes = options?.recognizedDataTypes?.takeUnless { types -> types.isEmpty() }
        ?: arrayOf(RecognizedDataType(RecognizedDataTypeKind.BARCODE, null, null, null))
      validateRecognizedDataTypes(recognizedDataTypes)
      val itemRecognitionMode = options?.itemRecognitionMode ?: ItemRecognitionMode.SINGLE
      if (itemRecognitionMode == ItemRecognitionMode.MULTIPLE) {
        throw Error("Google Code Scanner only supports single-item scans.")
      }
      val features = options?.features
      return DataScannerResolvedConfiguration(
        recognizedDataTypes = recognizedDataTypes,
        quality = options?.quality ?: RecognitionQuality.BALANCED,
        itemRecognitionMode = itemRecognitionMode,
        features = ResolvedDataScannerFeatures(
          isGuidanceEnabled = false,
          isHighlightingEnabled = false,
          isPinchToZoomEnabled = false,
          isHighFrameRateTrackingEnabled = false,
          isManualInputEnabled = features?.manualInput == DataScannerFeaturePreference.ENABLED,
          isAutoZoomEnabled = features?.autoZoom == DataScannerFeaturePreference.ENABLED
        )
      )
    }

    private fun validateRecognizedDataTypes(types: Array<RecognizedDataType>) {
      types.forEach { type ->
        when (type.kind) {
          RecognizedDataTypeKind.TEXT ->
            throw Error("Text scanning is not supported by Google Code Scanner on Android.")
          RecognizedDataTypeKind.BARCODE -> {
            val unsupportedFormats = type.formats
              ?.filter { format -> format !in supportedAndroidBarcodeFormats }
              .orEmpty()
            if (unsupportedFormats.isNotEmpty()) {
              throw Error("Unsupported Android barcode formats: ${unsupportedFormats.joinToString()}")
            }
          }
        }
      }
    }
  }
}
