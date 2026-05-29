package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  override fun createDataScanner(configuration: DataScannerConfiguration?): HybridDataScannerSpec {
    throw Error("TODO: Not yet implemented")
  }
}
