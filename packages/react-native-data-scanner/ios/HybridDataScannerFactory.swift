import NitroModules

final class HybridDataScannerFactory: HybridDataScannerFactorySpec {
  private var isScanInProgress = false
  private var activeSession: AnyObject?

  func scan(options: ResolvedScanOptions) throws -> Promise<ScannedCode> {
    #if os(iOS)
      guard #available(iOS 16.0, *) else {
        return Promise.rejected(
          withError: RuntimeError.error(
            withMessage: "DataScanner.scan(...) requires iOS 16.0 or newer."
          )
        )
      }

      guard !isScanInProgress else {
        return Promise.rejected(
          withError: RuntimeError.error(
            withMessage: "A code scan is already in progress."
          )
        )
      }

      isScanInProgress = true

      let promise = Promise<ScannedCode>()
      DispatchQueue.main.async { [weak self] in
        guard let self else {
          promise.reject(
            withError: RuntimeError.error(
              withMessage: "The data scanner was released before scanning could start."
            )
          )
          return
        }

        do {
          let session = try DataScannerSession(options: options, promise: promise) {
            [weak self] session in
            guard let self else { return }
            if self.activeSession === session {
              self.activeSession = nil
            }
            self.isScanInProgress = false
          }

          self.activeSession = session
          try session.start()
        } catch {
          self.activeSession = nil
          self.isScanInProgress = false
          promise.reject(withError: error)
        }
      }
      return promise
    #else
      return Promise.rejected(
        withError: RuntimeError.error(
          withMessage: "DataScanner.scan(...) is only available on iOS and Android."
        )
      )
    #endif
  }
}
