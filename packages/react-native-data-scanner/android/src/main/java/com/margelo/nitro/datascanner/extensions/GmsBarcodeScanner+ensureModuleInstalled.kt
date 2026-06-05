package com.margelo.nitro.datascanner.extensions

import android.content.Context
import com.google.android.gms.common.moduleinstall.InstallStatusListener
import com.google.android.gms.common.moduleinstall.ModuleInstall
import com.google.android.gms.common.moduleinstall.ModuleInstallRequest
import com.google.android.gms.common.moduleinstall.ModuleInstallStatusCodes
import com.google.android.gms.common.moduleinstall.ModuleInstallStatusUpdate
import com.google.mlkit.vision.codescanner.GmsBarcodeScanner
import kotlinx.coroutines.CompletableDeferred

private const val MODULE_INSTALL_CANCELED_MESSAGE = "Android barcode scanner module installation was canceled."

internal suspend fun GmsBarcodeScanner.ensureModuleInstalled(context: Context) {
  val moduleInstallClient = ModuleInstall.getClient(context)
  val installCompletion = CompletableDeferred<Unit>()

  fun createInstallFailure(errorCode: Int): RuntimeException {
    val status = ModuleInstallStatusCodes.getStatusCodeString(errorCode)
    val message = "Failed to install the Android barcode scanner module. " +
      "Google Play services status: $status ($errorCode)."
    return RuntimeException(message)
  }

  val installStatusListener = InstallStatusListener { update ->
    when (update.installState) {
      ModuleInstallStatusUpdate.InstallState.STATE_COMPLETED -> {
        installCompletion.complete(Unit)
      }

      ModuleInstallStatusUpdate.InstallState.STATE_CANCELED -> {
        installCompletion.completeExceptionally(RuntimeException(MODULE_INSTALL_CANCELED_MESSAGE))
      }

      ModuleInstallStatusUpdate.InstallState.STATE_FAILED -> {
        installCompletion.completeExceptionally(createInstallFailure(update.errorCode))
      }
    }
  }

  val request = ModuleInstallRequest
    .newBuilder()
    .addApi(this)
    .setListener(installStatusListener)
    .build()

  try {
    // This only waits until Google Play Services accepts the install request.
    val installRequestResponse = moduleInstallClient
      .installModules(request)
      .await(MODULE_INSTALL_CANCELED_MESSAGE)

    if (installRequestResponse.areModulesAlreadyInstalled()) {
      return
    }

    // If the module was not already installed, wait for the listener's terminal install state.
    installCompletion.await()
  } finally {
    moduleInstallClient.unregisterListener(installStatusListener)
  }
}
