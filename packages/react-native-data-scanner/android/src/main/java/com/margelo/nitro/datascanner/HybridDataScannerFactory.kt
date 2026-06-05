package com.margelo.nitro.datascanner

import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isScanning = false

  override fun scanBarcode(options: ResolvedScanBarcodeOptions): Promise<ScannedBarcode> {
    val promise = Promise<ScannedBarcode>()

    mainHandler.post {
      try {
        if (isScanning) {
          throw IllegalStateException("A barcode scan is already in progress.")
        }
        isScanning = true

        val activity = NitroModules.applicationContext?.currentActivity
          ?: throw IllegalStateException("Cannot scan barcodes because no current Activity is available.")
        val scannerOptions = options.toGmsBarcodeScannerOptions()
        val scanner = GmsBarcodeScanning.getClient(activity, scannerOptions)

        scanner
          .startScan()
          .addOnSuccessListener { barcode ->
            isScanning = false
            try {
              promise.resolve(barcode.toScannedBarcode())
            } catch (error: Throwable) {
              promise.reject(error)
            }
          }
          .addOnCanceledListener {
            isScanning = false
            promise.reject(RuntimeException("Barcode scan was canceled."))
          }
          .addOnFailureListener { error ->
            isScanning = false
            promise.reject(error)
          }
      } catch (error: Throwable) {
        isScanning = false
        promise.reject(error)
      }
    }

    return promise
  }
}
