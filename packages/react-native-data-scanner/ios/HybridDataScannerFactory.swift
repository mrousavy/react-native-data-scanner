import NitroModules
#if os(iOS) && !targetEnvironment(macCatalyst)
import VisionKit
#endif

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  var capabilities: DataScannerCapabilities {
    return DataScannerCapabilities.current
  }

  func createDataScanner(configuration: DataScannerConfiguration?) throws -> any HybridDataScannerSpec {
    let resolvedConfiguration = configuration ?? DataScannerConfiguration.default
    try DataScannerCapabilities.validate(configuration: resolvedConfiguration)
    #if os(iOS) && !targetEnvironment(macCatalyst)
    if #available(iOS 16.0, *) {
      return HybridDataScanner(configuration: resolvedConfiguration, capabilities: capabilities)
    }
    throw RuntimeError("The iOS data scanner requires iOS 16 or newer.")
    #else
    return HybridDataScanner(configuration: resolvedConfiguration, capabilities: capabilities)
    #endif
  }
}
