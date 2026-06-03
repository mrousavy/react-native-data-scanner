import NitroModules

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  private var activeSession: DataScannerSession?

  func getCapabilities() throws -> Promise<DataScannerCapabilities> {
    let promise = Promise<DataScannerCapabilities>()

    Task { @MainActor in
      promise.resolve(withResult: DataScannerCapabilityProvider.currentCapabilities())
    }

    return promise
  }

  func scanCode(options: ScanCodeOptions?) throws -> Promise<ScannedCode> {
    let promise = Promise<ScannedCode>()

    Task { @MainActor in
      do {
        guard self.activeSession == nil else {
          throw RuntimeError("A code scan is already in progress.")
        }

        try DataScannerCapabilityProvider.validateCanScan()
        try CameraPermission.ensureCameraUsageDescription()

        CameraPermission.requestIfNeeded { result in
          Task { @MainActor in
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
        }
      } catch {
        promise.reject(withError: error)
      }
    }

    return promise
  }
}
