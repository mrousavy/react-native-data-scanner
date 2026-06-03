import NitroModules
import UIKit
import VisionKit

@available(iOS 16.0, *)
@MainActor
final class DataScannerSession: NSObject, DataScannerViewControllerDelegate {
  private let scannerViewController: DataScannerViewController
  private let promise: Promise<ScannedCode>
  private let onFinish: () -> Void
  private var didFinish = false

  init(
    options: ScanCodeOptions?,
    promise: Promise<ScannedCode>,
    onFinish: @escaping () -> Void
  ) throws {
    let symbologies = try BarcodeFormat.visionKitSymbologies(from: options?.barcodeFormats)
    let qualityLevel = options?.qualityLevel?.visionKitQualityLevel ?? .balanced

    scannerViewController = DataScannerViewController(
      recognizedDataTypes: [.barcode(symbologies: symbologies)],
      qualityLevel: qualityLevel,
      recognizesMultipleItems: false,
      isHighFrameRateTrackingEnabled: true,
      isPinchToZoomEnabled: true,
      isGuidanceEnabled: true,
      isHighlightingEnabled: true
    )
    self.promise = promise
    self.onFinish = onFinish

    super.init()

    scannerViewController.delegate = self
    scannerViewController.navigationItem.leftBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .cancel,
      target: self,
      action: #selector(cancel)
    )
  }

  func present() throws {
    guard DataScannerViewController.isAvailable else {
      throw RuntimeError("Data scanner is not available. Check camera permission and device restrictions.")
    }

    guard let presenter = UIApplication.shared.dataScannerTopViewController else {
      throw RuntimeError("Could not find a view controller to present the data scanner.")
    }

    let navigationController = UINavigationController(rootViewController: scannerViewController)
    navigationController.modalPresentationStyle = .fullScreen

    presenter.present(navigationController, animated: true) { [weak self] in
      guard let self else {
        return
      }

      do {
        try self.scannerViewController.startScanning()
      } catch {
        self.reject(error)
      }
    }
  }

  @objc
  func cancel() {
    reject(RuntimeError("Code scan was canceled."))
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didAdd addedItems: [RecognizedItem],
    allItems: [RecognizedItem]
  ) {
    resolveFirstScannedCode(from: addedItems)
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didTapOn item: RecognizedItem
  ) {
    resolveFirstScannedCode(from: [item])
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable
  ) {
    reject(RuntimeError("Data scanner became unavailable: \(error)."))
  }

  private func resolveFirstScannedCode(from items: [RecognizedItem]) {
    for item in items {
      guard case .barcode(let barcode) = item else {
        continue
      }

      do {
        let code = try ScannedCode(barcode: barcode)
        resolve(code)
      } catch {
        reject(error)
      }
      return
    }
  }

  private func resolve(_ code: ScannedCode) {
    guard !didFinish else {
      return
    }

    didFinish = true
    scannerViewController.stopScanning()
    scannerViewController.dismiss(animated: true)
    promise.resolve(withResult: code)
    onFinish()
  }

  private func reject(_ error: Error) {
    guard !didFinish else {
      return
    }

    didFinish = true
    scannerViewController.stopScanning()
    scannerViewController.dismiss(animated: true)
    promise.reject(withError: error)
    onFinish()
  }
}
