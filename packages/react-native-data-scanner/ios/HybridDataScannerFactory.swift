import NitroModules

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  private var activeScanSession: AnyObject?

  func scanBarcode(options: ResolvedScanBarcodeOptions) throws -> Promise<ScannedBarcode> {
    let promise = Promise<ScannedBarcode>()

    DispatchQueue.main.async { [weak self] in
      guard let self else {
        promise.reject(withError: RuntimeError("Data scanner was released before scanning could start."))
        return
      }

      do {
        guard self.activeScanSession == nil else {
          throw RuntimeError("A barcode scan is already in progress.")
        }

        if #available(iOS 16.0, visionOS 1.0, *) {
          try Bundle.main.checkCameraUsageDescription()
          try DataScannerAvailability.checkBarcodeScanningAvailability()

          let presenter = try DataScannerPresenter.topPresentedViewController()
          let session = try DataScannerScanSession(
            options: options,
            promise: promise,
            onFinish: { [weak self] in
              self?.activeScanSession = nil
            }
          )
          self.activeScanSession = session
          try session.start(from: presenter)
        } else {
          throw RuntimeError("Barcode scanning requires iOS 16.0 or later.")
        }
      } catch {
        self.activeScanSession = nil
        promise.reject(withError: error)
      }
    }

    return promise
  }
}
