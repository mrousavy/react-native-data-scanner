package com.margelo.nitro.datascanner

import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import java.util.concurrent.CancellationException

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  private val mainHandler = Handler(Looper.getMainLooper())

  override fun getCapabilities(): Promise<DataScannerCapabilities> {
    val context = NitroModules.applicationContext
    val hasActivity = context?.currentActivity != null
    val isSupportedApiLevel = Build.VERSION.SDK_INT >= Build.VERSION_CODES.M

    return Promise.resolved(
      DataScannerCapabilities(
        isCodeScannerAvailable = hasActivity && isSupportedApiLevel,
        supportedBarcodeFormats = BarcodeFormat.supportedMlKitFormats,
        supportsManualInput = isSupportedApiLevel,
        supportsAutoZoom = isSupportedApiLevel
      )
    )
  }

  override fun scanCode(options: ResolvedScanCodeOptions): Promise<ScannedCode> {
    val promise = Promise<ScannedCode>()

    mainHandler.post {
      try {
        val context = NitroModules.applicationContext
          ?: throw Error("React application context is not available.")
        val activity = context.currentActivity
          ?: throw Error("A foreground Activity is required to scan codes.")

        val scanner = GmsBarcodeScanning.getClient(
          activity,
          options.toGmsBarcodeScannerOptions()
        )
        scanner
          .startScan()
          .addOnSuccessListener { barcode ->
            try {
              promise.resolve(barcode.toScannedCode())
            } catch (error: Throwable) {
              promise.reject(error)
            }
          }
          .addOnCanceledListener {
            promise.reject(CancellationException("Code scan was canceled."))
          }
          .addOnFailureListener { error ->
            promise.reject(error)
          }
      } catch (error: Throwable) {
        promise.reject(error)
      }
    }

    return promise
  }

  override fun createLiveScanner(
    options: ResolvedLiveDataScannerOptions
  ): Promise<HybridLiveDataScannerSpec> {
    return Promise.rejected(
      Error("Live data scanning is not supported on Android with Google Code Scanner. Use scanCode() instead.")
    )
  }
}
