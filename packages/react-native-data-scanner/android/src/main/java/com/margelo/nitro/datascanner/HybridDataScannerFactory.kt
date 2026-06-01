package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  override fun getCapabilities(): Promise<DataScannerCapabilities> {
    return Promise.resolved(HybridDataScanner.createCapabilities())
  }

  override fun createDataScanner(options: DataScannerOptions?): HybridDataScannerSpec {
    return HybridDataScanner(options)
  }
}
