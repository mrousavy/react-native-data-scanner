import NitroModules
import UIKit
import VisionKit

@available(iOS 16.0, *)
final class HybridLiveDataScanner: HybridLiveDataScannerSpec {
  private let options: ResolvedLiveDataScannerOptions
  private var scannerViewController: DataScannerViewController?
  private var onCodeScanned: ((_ code: ScannedCode) -> Void)?
  private var onError: ((_ error: Error) -> Void)?

  init(options: ResolvedLiveDataScannerOptions) {
    self.options = options
  }

  func start() throws -> Promise<Void> {
    let promise = Promise<Void>()

    Task { @MainActor in
      do {
        guard self.scannerViewController == nil else {
          throw RuntimeError("Live data scanner is already running.")
        }

        try DataScannerCapabilityProvider.validateCanScan()
        try CameraPermission.ensureCameraUsageDescription()

        CameraPermission.requestIfNeeded { result in
          Task { @MainActor in
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
        }
      } catch {
        promise.reject(withError: error)
      }
    }

    return promise
  }

  func stop() throws -> Promise<Void> {
    let promise = Promise<Void>()

    Task { @MainActor in
      self.stopScanning()
      promise.resolve()
    }

    return promise
  }

  func setOnCodeScanned(callback: ((_ code: ScannedCode) -> Void)?) throws {
    onCodeScanned = callback
  }

  func setOnError(callback: ((_ error: Error) -> Void)?) throws {
    onError = callback
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
  private func stopFromButton() {
    Task { @MainActor in
      self.stopScanning()
    }
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
      onCodeScanned?(try ScannedCode(barcode: barcode))
    } catch {
      emitError(error)
    }
  }

  private func emitError(_ error: Error) {
    onError?(error)
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
