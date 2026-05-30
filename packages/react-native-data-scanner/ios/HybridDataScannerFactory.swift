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
    return HybridDataScanner(configuration: resolvedConfiguration, capabilities: capabilities)
  }
}
