import Dispatch
import NitroModules

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  private var activeSession: DataScannerSession?

  func getCapabilities() throws -> Promise<DataScannerCapabilities> {
    return Promise.parallel(.main) {
      DataScannerCapabilityProvider.currentCapabilities()
    }
  }

  func scanCode(options: ResolvedScanCodeOptions) throws -> Promise<ScannedCode> {
    let promise = Promise<ScannedCode>()

    DispatchQueue.main.async {
      do {
        guard self.activeSession == nil else {
          throw RuntimeError("A code scan is already in progress.")
        }

        try DataScannerCapabilityProvider.validateCanScan()
        try CameraPermission.ensureCameraUsageDescription()

        CameraPermission.requestIfNeeded { result in
          switch result {
          case .success:
            do {
              let session = try DataScannerSession(options: options, promise: promise) {
                self.activeSession = nil
              }
              self.activeSession = session
              try session.present()
            } catch {
              promise.reject(withError: error)
            }
          case .failure(let error):
            promise.reject(withError: error)
          }
        }
      } catch {
        promise.reject(withError: error)
      }
    }

    return promise
  }

  func createLiveScanner(
    options: ResolvedLiveDataScannerOptions
  ) throws -> Promise<any HybridLiveDataScannerSpec> {
    return Promise<any HybridLiveDataScannerSpec>.parallel(.main) {
      guard #available(iOS 16.0, *) else {
        throw RuntimeError("Live data scanning requires iOS 16 or newer.")
      }

      try DataScannerCapabilityProvider.validateCanScan()
      try CameraPermission.ensureCameraUsageDescription()
      return HybridLiveDataScanner(options: options)
    }
  }
}
