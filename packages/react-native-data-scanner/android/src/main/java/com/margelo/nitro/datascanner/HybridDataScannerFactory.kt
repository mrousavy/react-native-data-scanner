package com.margelo.nitro.datascanner

import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import java.util.concurrent.CancellationException

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  private val context
    get() = NitroModules.applicationContext ?: throw Error("No React application context is available.")

  override fun scan(options: ResolvedScanOptions): Promise<ScannedCode> {
    val promise = Promise<ScannedCode>()
    Handler(Looper.getMainLooper()).post {
      try {
        val activity = context.currentActivity ?: throw Error("Cannot scan codes because there is no current Activity.")
        val scannerOptions = createScannerOptions(options)
        val scanner = GmsBarcodeScanning.getClient(activity, scannerOptions)
        var didFinish = false

        fun finish(block: () -> Unit) {
          if (didFinish) return
          didFinish = true
          block()
        }

        scanner.startScan()
          .addOnSuccessListener { barcode ->
            finish {
              try {
                promise.resolve(barcode.toScannedCode())
              } catch (error: Throwable) {
                promise.reject(error)
              }
            }
          }
          .addOnCanceledListener {
            finish {
              promise.reject(CancellationException("The code scanner was cancelled."))
            }
          }
          .addOnFailureListener { error ->
            finish {
              promise.reject(error)
            }
          }
      } catch (error: Throwable) {
        promise.reject(error)
      }
    }

    return promise
  }

  private fun createScannerOptions(options: ResolvedScanOptions): GmsBarcodeScannerOptions {
    val builder = GmsBarcodeScannerOptions.Builder()
    val formats = options.formats.toMlKitFormats()

    if (formats != null) {
      val firstFormat = formats.firstOrNull()
        ?: throw Error("Scan formats must contain at least one barcode format.")
      val moreFormats = formats.drop(1).toIntArray()
      builder.setBarcodeFormats(firstFormat, *moreFormats)
    }

    if (options.enableAutoZoom) {
      builder.enableAutoZoom()
    }

    return builder.build()
  }
}
