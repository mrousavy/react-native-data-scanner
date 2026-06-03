package com.margelo.nitro.datascanner

import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.google.mlkit.vision.barcode.common.Barcode as MlKitBarcode
import com.google.mlkit.vision.codescanner.GmsBarcodeScannerOptions
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

  override fun scanCode(options: ScanCodeOptions?): Promise<ScannedCode> {
    val promise = Promise<ScannedCode>()

    mainHandler.post {
      try {
        val context = NitroModules.applicationContext
          ?: throw Error("React application context is not available.")
        val activity = context.currentActivity
          ?: throw Error("A foreground Activity is required to scan codes.")

        val scannerOptions = buildScannerOptions(options)
        val scanner = GmsBarcodeScanning.getClient(activity, scannerOptions)
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

  private fun buildScannerOptions(options: ScanCodeOptions?): GmsBarcodeScannerOptions {
    val builder = GmsBarcodeScannerOptions.Builder()
    val barcodeFormats = options?.barcodeFormats

    if (barcodeFormats != null) {
      if (barcodeFormats.isEmpty()) {
        throw Error("barcodeFormats must contain at least one format or be omitted.")
      }

      val formats = barcodeFormats.map { it.toMlKitFormat() }
      builder.setBarcodeFormats(formats.first(), *formats.drop(1).toIntArray())
    }

    if (options?.enableAutoZoom == true) {
      builder.enableAutoZoom()
    }

    if (options?.allowManualInput == true) {
      builder.allowManualInput()
    }

    return builder.build()
  }
}

private val BarcodeFormat.Companion.supportedMlKitFormats: Array<BarcodeFormat>
  get() = arrayOf(
    BarcodeFormat.AZTEC,
    BarcodeFormat.CODABAR,
    BarcodeFormat.CODE_39,
    BarcodeFormat.CODE_93,
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_8,
    BarcodeFormat.EAN_13,
    BarcodeFormat.ITF,
    BarcodeFormat.PDF_417,
    BarcodeFormat.QR,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E
  )

private fun BarcodeFormat.toMlKitFormat(): Int {
  return when (this) {
    BarcodeFormat.UNKNOWN -> throw Error("unknown cannot be used as a required barcode format.")
    BarcodeFormat.AZTEC -> MlKitBarcode.FORMAT_AZTEC
    BarcodeFormat.CODABAR -> MlKitBarcode.FORMAT_CODABAR
    BarcodeFormat.CODE_39 -> MlKitBarcode.FORMAT_CODE_39
    BarcodeFormat.CODE_93 -> MlKitBarcode.FORMAT_CODE_93
    BarcodeFormat.CODE_128 -> MlKitBarcode.FORMAT_CODE_128
    BarcodeFormat.DATA_MATRIX -> MlKitBarcode.FORMAT_DATA_MATRIX
    BarcodeFormat.EAN_8 -> MlKitBarcode.FORMAT_EAN_8
    BarcodeFormat.EAN_13 -> MlKitBarcode.FORMAT_EAN_13
    BarcodeFormat.ITF -> MlKitBarcode.FORMAT_ITF
    BarcodeFormat.PDF_417 -> MlKitBarcode.FORMAT_PDF417
    BarcodeFormat.QR -> MlKitBarcode.FORMAT_QR_CODE
    BarcodeFormat.UPC_A -> MlKitBarcode.FORMAT_UPC_A
    BarcodeFormat.UPC_E -> MlKitBarcode.FORMAT_UPC_E
  }
}

private fun MlKitBarcode.toScannedCode(): ScannedCode {
  val value = rawValue ?: displayValue
    ?: throw Error("Scanned code does not contain a text payload.")

  return ScannedCode(
    rawValue = value,
    displayValue = displayValue,
    format = format.toBarcodeFormat(),
    valueType = valueType.toBarcodeValueType()
  )
}

private fun Int.toBarcodeFormat(): BarcodeFormat {
  return when (this) {
    MlKitBarcode.FORMAT_AZTEC -> BarcodeFormat.AZTEC
    MlKitBarcode.FORMAT_CODABAR -> BarcodeFormat.CODABAR
    MlKitBarcode.FORMAT_CODE_39 -> BarcodeFormat.CODE_39
    MlKitBarcode.FORMAT_CODE_93 -> BarcodeFormat.CODE_93
    MlKitBarcode.FORMAT_CODE_128 -> BarcodeFormat.CODE_128
    MlKitBarcode.FORMAT_DATA_MATRIX -> BarcodeFormat.DATA_MATRIX
    MlKitBarcode.FORMAT_EAN_8 -> BarcodeFormat.EAN_8
    MlKitBarcode.FORMAT_EAN_13 -> BarcodeFormat.EAN_13
    MlKitBarcode.FORMAT_ITF -> BarcodeFormat.ITF
    MlKitBarcode.FORMAT_PDF417 -> BarcodeFormat.PDF_417
    MlKitBarcode.FORMAT_QR_CODE -> BarcodeFormat.QR
    MlKitBarcode.FORMAT_UPC_A -> BarcodeFormat.UPC_A
    MlKitBarcode.FORMAT_UPC_E -> BarcodeFormat.UPC_E
    else -> BarcodeFormat.UNKNOWN
  }
}

private fun Int.toBarcodeValueType(): BarcodeValueType {
  return when (this) {
    MlKitBarcode.TYPE_CALENDAR_EVENT -> BarcodeValueType.CALENDAR_EVENT
    MlKitBarcode.TYPE_CONTACT_INFO -> BarcodeValueType.CONTACT_INFO
    MlKitBarcode.TYPE_DRIVER_LICENSE -> BarcodeValueType.DRIVER_LICENSE
    MlKitBarcode.TYPE_EMAIL -> BarcodeValueType.EMAIL
    MlKitBarcode.TYPE_GEO -> BarcodeValueType.GEO
    MlKitBarcode.TYPE_ISBN -> BarcodeValueType.ISBN
    MlKitBarcode.TYPE_PHONE -> BarcodeValueType.PHONE
    MlKitBarcode.TYPE_PRODUCT -> BarcodeValueType.PRODUCT
    MlKitBarcode.TYPE_SMS -> BarcodeValueType.SMS
    MlKitBarcode.TYPE_TEXT -> BarcodeValueType.TEXT
    MlKitBarcode.TYPE_URL -> BarcodeValueType.URL
    MlKitBarcode.TYPE_WIFI -> BarcodeValueType.WIFI
    else -> BarcodeValueType.UNKNOWN
  }
}
