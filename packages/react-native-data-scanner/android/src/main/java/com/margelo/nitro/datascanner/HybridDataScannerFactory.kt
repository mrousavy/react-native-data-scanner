package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  override fun createDataScanner(): Unit {
    throw Error("TODO: Not yet implemented")
  }
}
