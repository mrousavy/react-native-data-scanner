package com.margelo.nitro.datascanner

import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.core.resolved
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.CancellationException

class HybridDataScanner(
  override val configuration: DataScannerConfiguration,
  override val capabilities: DataScannerCapabilities,
) : HybridDataScannerSpec() {
  private val itemsAddedListeners = mutableMapOf<UUID, (event: ItemsChangedEvent) -> Unit>()
  private val itemsUpdatedListeners = mutableMapOf<UUID, (event: ItemsChangedEvent) -> Unit>()
  private val itemsRemovedListeners = mutableMapOf<UUID, (event: ItemsChangedEvent) -> Unit>()
  private val itemTappedListeners = mutableMapOf<UUID, (event: ItemTappedEvent) -> Unit>()
  private val zoomChangedListeners = mutableMapOf<UUID, (event: ZoomChangedEvent) -> Unit>()
  private val errorListeners = mutableMapOf<UUID, (error: Throwable) -> Unit>()

  private var lastItem: HybridScannedItemSpec? = null

  override val isAvailable: Boolean
    get() = NitroModules.applicationContext?.currentActivity != null

  override val isScanning: Boolean
    get() = false

  override val recognizedItems: Array<HybridScannedItemSpec>
    get() = lastItem?.let { arrayOf(it) } ?: emptyArray()

  override val minZoomFactor: Double
    get() = 1.0

  override val maxZoomFactor: Double
    get() = 1.0

  override val zoomFactor: Double
    get() = 1.0

  override fun scan(): Promise<HybridScannedItemSpec> {
    val activity =
      NitroModules.applicationContext?.currentActivity
        ?: return Promise.rejected(IllegalStateException("Cannot start Android code scanner without a current Activity."))

    val promise = Promise<HybridScannedItemSpec>()
    val isSettled = AtomicBoolean(false)
    val scanner = GmsBarcodeScanning.getClient(activity, createScannerOptions())

    scanner
      .startScan()
      .addOnSuccessListener { barcode ->
        if (!isSettled.compareAndSet(false, true)) return@addOnSuccessListener
        val item = HybridScannedBarcode(barcode)
        lastItem = item
        emitItemsAdded(item)
        promise.resolve(item)
      }
      .addOnCanceledListener {
        if (!isSettled.compareAndSet(false, true)) return@addOnCanceledListener
        val error = CancellationException("Android code scanning was cancelled.")
        emitError(error)
        promise.reject(error)
      }
      .addOnFailureListener { error ->
        if (!isSettled.compareAndSet(false, true)) return@addOnFailureListener
        emitError(error)
        promise.reject(error)
      }

    return promise
  }

  override fun present(): Promise<Unit> =
    Promise.rejected(UnsupportedOperationException("Android Google Code Scanner only supports one-shot scan()."))

  override fun dismiss(): Promise<Unit> = Promise.resolved()

  override fun startScanning(): Promise<Unit> =
    Promise.rejected(UnsupportedOperationException("Continuous scanning is not supported by Android Google Code Scanner."))

  override fun stopScanning() {
    throw UnsupportedOperationException("Continuous scanning is not supported by Android Google Code Scanner.")
  }

  override fun setRegionOfInterest(region: Rect?): Promise<Unit> =
    Promise.rejected(UnsupportedOperationException("Regions of interest are not supported by Android Google Code Scanner."))

  override fun setZoomFactor(zoomFactor: Double): Promise<Unit> =
    Promise.rejected(UnsupportedOperationException("Zoom factor control is not supported by Android Google Code Scanner."))

  override fun capturePhoto(): Promise<HybridCapturedPhotoSpec> =
    Promise.rejected(UnsupportedOperationException("Photo capture is not supported by Android Google Code Scanner."))

  override fun addItemsAddedListener(listener: (event: ItemsChangedEvent) -> Unit): HybridListenerSubscriptionSpec =
    addListener(itemsAddedListeners, listener)

  override fun addItemsUpdatedListener(listener: (event: ItemsChangedEvent) -> Unit): HybridListenerSubscriptionSpec =
    addListener(itemsUpdatedListeners, listener)

  override fun addItemsRemovedListener(listener: (event: ItemsChangedEvent) -> Unit): HybridListenerSubscriptionSpec =
    addListener(itemsRemovedListeners, listener)

  override fun addItemTappedListener(listener: (event: ItemTappedEvent) -> Unit): HybridListenerSubscriptionSpec =
    addListener(itemTappedListeners, listener)

  override fun addZoomChangedListener(listener: (event: ZoomChangedEvent) -> Unit): HybridListenerSubscriptionSpec =
    addListener(zoomChangedListeners, listener)

  override fun addErrorListener(listener: (error: Throwable) -> Unit): HybridListenerSubscriptionSpec =
    addListener(errorListeners, listener)

  private fun createScannerOptions(): GmsBarcodeScannerOptions {
    val builder = GmsBarcodeScannerOptions.Builder()
    val formats = configuration.recognizes?.barcode?.formats

    if (!formats.isNullOrEmpty()) {
      val mlKitFormats = formats.map { it.toMlKitFormat() }
      builder.setBarcodeFormats(
        mlKitFormats.first(),
        *mlKitFormats.drop(1).toIntArray(),
      )
    }
    if (configuration.isAutoZoomEnabled == true) {
      builder.enableAutoZoom()
    }
    if (configuration.isManualInputEnabled == true) {
      builder.allowManualInput()
    }

    return builder.build()
  }

  private fun <T> addListener(
    listeners: MutableMap<UUID, T>,
    listener: T,
  ): HybridListenerSubscriptionSpec {
    val id = UUID.randomUUID()
    listeners[id] = listener
    return HybridListenerSubscription {
      listeners.remove(id)
    }
  }

  private fun emitItemsAdded(item: HybridScannedItemSpec) {
    val allItems = recognizedItems
    val event = ItemsChangedEvent(items = arrayOf(item), allItems = allItems)
    itemsAddedListeners.values.forEach { listener -> listener(event) }
  }

  private fun emitError(error: Throwable) {
    errorListeners.values.forEach { listener -> listener(error) }
  }
}
