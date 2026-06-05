package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.codescanner.GmsBarcodeScanning
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.datascanner.extensions.await
import com.margelo.nitro.datascanner.extensions.ensureModuleInstalled
import com.margelo.nitro.datascanner.extensions.toGmsBarcodeScannerOptions
import com.margelo.nitro.datascanner.extensions.toScannedBarcode
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  private val mainScope = CoroutineScope(Dispatchers.Main.immediate)
  private var isScanning = false

  override fun scanBarcode(options: ScanBarcodeOptions?): Promise<ScannedBarcode> {
    return Promise.async(mainScope) {
      if (isScanning) {
        throw IllegalStateException("A barcode scan is already in progress.")
      }

      isScanning = true
      try {
        val activity = NitroModules.applicationContext?.currentActivity
          ?: throw IllegalStateException("Cannot scan barcodes because no current Activity is available.")
        val scannerOptions = options.toGmsBarcodeScannerOptions()
        val scanner = GmsBarcodeScanning.getClient(activity, scannerOptions)

        // Wait until the Google Play Services binary has been downloaded
        scanner.ensureModuleInstalled(activity)
        // Perform actual scan
        val barcode = scanner.startScan().await("Barcode scan was canceled.")
        barcode.toScannedBarcode()
      } finally {
        isScanning = false
      }
    }
  }
}
