import Dispatch
import NitroModules
import UIKit
import VisionKit

@available(iOS 16.0, *)
final class HybridLiveDataScanner: HybridLiveDataScannerSpec {
  private final class ListenerToken {}

  private struct Listener<Callback> {
    let token: ListenerToken
    let callback: Callback
  }

  private let options: ResolvedLiveDataScannerOptions
  private var scannerViewController: DataScannerViewController?
  private var codeScannedListeners: [ObjectIdentifier: Listener<(ScannedCode) -> Void>] = [:]
  private var errorListeners: [ObjectIdentifier: Listener<(Error) -> Void>] = [:]

  init(options: ResolvedLiveDataScannerOptions) {
    self.options = options
  }

  func start() throws -> Promise<Void> {
    let promise = Promise<Void>()

    DispatchQueue.main.async {
      do {
        guard self.scannerViewController == nil else {
          throw RuntimeError("Live data scanner is already running.")
        }

        try DataScannerCapabilityProvider.validateCanScan()
        try CameraPermission.ensureCameraUsageDescription()

        CameraPermission.requestIfNeeded { result in
          switch result {
          case .success:
            do {
              try self.presentScanner()
              promise.resolve()
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

  func stop() throws -> Promise<Void> {
    return Promise.parallel(.main) {
      self.stopScanning()
    }
  }

  func addOnCodeScannedListener(
    callback: @escaping (_ code: ScannedCode) -> Void
  ) throws -> ListenerSubscription {
    let token = ListenerToken()
    codeScannedListeners[ObjectIdentifier(token)] = Listener(token: token, callback: callback)

    return ListenerSubscription { [weak self, token] in
      self?.removeCodeScannedListener(token)
    }
  }

  func addOnErrorListener(
    callback: @escaping (_ error: Error) -> Void
  ) throws -> ListenerSubscription {
    let token = ListenerToken()
    errorListeners[ObjectIdentifier(token)] = Listener(token: token, callback: callback)

    return ListenerSubscription { [weak self, token] in
      self?.removeErrorListener(token)
    }
  }

  @MainActor
  private func presentScanner() throws {
    guard DataScannerViewController.isAvailable else {
      throw RuntimeError("Data scanner is not available. Check camera permission and device restrictions.")
    }

    guard let presenter = UIApplication.shared.dataScannerTopViewController else {
      throw RuntimeError("Could not find a view controller to present the live data scanner.")
    }

    let scannerViewController = DataScannerViewController(
      recognizedDataTypes: [
        .barcode(
          symbologies: TargetBarcodeFormat.visionKitSymbologies(
            from: options.barcodeFormats
          )
        )
      ],
      qualityLevel: options.qualityLevel.visionKitQualityLevel,
      recognizesMultipleItems: options.recognizesMultipleItems,
      isHighFrameRateTrackingEnabled: true,
      isPinchToZoomEnabled: true,
      isGuidanceEnabled: true,
      isHighlightingEnabled: true
    )
    scannerViewController.delegate = self
    scannerViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .done,
      target: self,
      action: #selector(stopFromButton)
    )

    let navigationController = UINavigationController(rootViewController: scannerViewController)
    navigationController.modalPresentationStyle = .fullScreen

    self.scannerViewController = scannerViewController
    presenter.present(navigationController, animated: true) { [weak self] in
      guard let self else {
        return
      }

      do {
        try scannerViewController.startScanning()
      } catch {
        self.emitError(error)
        self.stopScanning()
      }
    }
  }

  @objc
  @MainActor
  private func stopFromButton() {
    stopScanning()
  }

  @MainActor
  private func stopScanning() {
    scannerViewController?.stopScanning()
    scannerViewController?.dismiss(animated: true)
    scannerViewController = nil
  }

  @MainActor
  private func emitCodeIfPossible(_ item: RecognizedItem) {
    guard case .barcode(let barcode) = item else {
      return
    }

    do {
      emitCode(try ScannedCode(barcode: barcode))
    } catch {
      emitError(error)
    }
  }

  private func emitCode(_ code: ScannedCode) {
    let callbacks = codeScannedListeners.values.map(\.callback)

    callbacks.forEach { callback in
      callback(code)
    }
  }

  private func emitError(_ error: Error) {
    let callbacks = errorListeners.values.map(\.callback)

    callbacks.forEach { callback in
      callback(error)
    }
  }

  private func removeCodeScannedListener(_ token: ListenerToken) {
    codeScannedListeners.removeValue(forKey: ObjectIdentifier(token))
  }

  private func removeErrorListener(_ token: ListenerToken) {
    errorListeners.removeValue(forKey: ObjectIdentifier(token))
  }
}

@available(iOS 16.0, *)
@MainActor
extension HybridLiveDataScanner: DataScannerViewControllerDelegate {
  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didAdd addedItems: [RecognizedItem],
    allItems: [RecognizedItem]
  ) {
    addedItems.forEach(emitCodeIfPossible)
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didUpdate updatedItems: [RecognizedItem],
    allItems: [RecognizedItem]
  ) {
    updatedItems.forEach(emitCodeIfPossible)
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didTapOn item: RecognizedItem
  ) {
    emitCodeIfPossible(item)
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable
  ) {
    emitError(RuntimeError("Data scanner became unavailable: \(error)."))
    stopScanning()
  }
}
