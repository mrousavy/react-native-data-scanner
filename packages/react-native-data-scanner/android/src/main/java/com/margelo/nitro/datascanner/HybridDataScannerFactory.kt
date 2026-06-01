package com.margelo.nitro.datascanner

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip

@Keep
@DoNotStrip
class HybridDataScannerFactory : HybridDataScannerFactorySpec() {
  override val capabilities: DataScannerCapabilities
    get() = DataScannerDefaults.capabilities

  override fun createDataScanner(configuration: DataScannerConfiguration?): HybridDataScannerSpec {
    val resolvedConfiguration = configuration ?: DataScannerDefaults.defaultConfiguration
    DataScannerDefaults.validate(resolvedConfiguration)
    return HybridDataScanner(resolvedConfiguration, capabilities)
  }
}
