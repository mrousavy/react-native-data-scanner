import NitroModules
import UIKit
import VisionKit

@available(iOS 16.0, visionOS 1.0, *)
final class DataScannerScanSession: NSObject, DataScannerViewControllerDelegate, UIAdaptivePresentationControllerDelegate {
  private let promise: Promise<ScannedBarcode>
  private let onFinish: () -> Void
  private let scannerViewController: DataScannerViewController
  private let navigationController: UINavigationController
  private var didFinish = false

  @MainActor
  init(
    options: ScanBarcodeOptions?,
    promise: Promise<ScannedBarcode>,
    onFinish: @escaping () -> Void
  ) throws {
    let targetFormats = options?.targetFormats ?? TargetBarcodeFormat.allDataScannerFormats

    guard !targetFormats.isEmpty else {
      throw RuntimeError("targetFormats must not be empty.")
    }

    let symbologies = Set(targetFormats.flatMap { $0.toVNBarcodeSymbologies() })

    scannerViewController = DataScannerViewController(
      recognizedDataTypes: [.barcode(symbologies: Array(symbologies))],
      qualityLevel: options?.qualityLevel?.toDataScannerQualityLevel() ?? .balanced,
      recognizesMultipleItems: false,
      isHighFrameRateTrackingEnabled: options?.enableHighFrameRateTracking ?? false,
      isPinchToZoomEnabled: true,
      isGuidanceEnabled: true,
      isHighlightingEnabled: true
    )
    scannerViewController.title = "Scan Barcode"
    navigationController = UINavigationController(rootViewController: scannerViewController)
    self.promise = promise
    self.onFinish = onFinish

    super.init()

    scannerViewController.delegate = self
    scannerViewController.navigationItem.rightBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .cancel,
      target: self,
      action: #selector(cancel)
    )
    navigationController.presentationController?.delegate = self
  }

  @MainActor
  func start(from presenter: UIViewController) throws {
    navigationController.presentationController?.delegate = self

    presenter.present(navigationController, animated: true) { [weak self] in
      guard let self else { return }

      do {
        try self.scannerViewController.startScanning()
      } catch {
        self.finish(with: error)
      }
    }
  }

  @MainActor
  func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
    finish(with: item)
  }

  @MainActor
  func dataScanner(
    _ dataScanner: DataScannerViewController,
    didAdd addedItems: [RecognizedItem],
    allItems: [RecognizedItem]
  ) {
    guard let item = addedItems.first else {
      return
    }

    finish(with: item)
  }

  @MainActor
  private func finish(with item: RecognizedItem) {
    switch item {
    case .barcode(let barcode):
      do {
        let scannedBarcode = try barcode.toScannedBarcode()
        finish(with: scannedBarcode)
      } catch {
        finish(with: error)
      }
    case .text:
      break
    @unknown default:
      break
    }
  }

  @MainActor
  func dataScanner(
    _ dataScanner: DataScannerViewController,
    becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable
  ) {
    finish(with: RuntimeError("Barcode scanning became unavailable: \(error)"))
  }

  @MainActor
  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    finish(with: RuntimeError("Barcode scan was canceled."))
  }

  @objc
  @MainActor
  private func cancel() {
    finish(with: RuntimeError("Barcode scan was canceled."))
  }

  @MainActor
  private func finish(with result: ScannedBarcode) {
    guard !didFinish else { return }

    didFinish = true
    scannerViewController.stopScanning()
    navigationController.dismiss(animated: true) { [promise, onFinish] in
      promise.resolve(withResult: result)
      onFinish()
    }
  }

  @MainActor
  private func finish(with error: Error) {
    guard !didFinish else { return }

    didFinish = true
    scannerViewController.stopScanning()
    navigationController.dismiss(animated: true) { [promise, onFinish] in
      promise.reject(withError: error)
      onFinish()
    }
  }
}
