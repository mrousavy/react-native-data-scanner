import NitroModules

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  func getCapabilities() throws -> Promise<DataScannerCapabilities> {
    return Promise.resolved(withResult: HybridDataScanner.createCapabilities())
  }

  func createDataScanner(options: DataScannerOptions?) throws -> any HybridDataScannerSpec {
    return try HybridDataScanner(options: options)
  }
}
