#if os(iOS)
  import NitroModules
  import UIKit
  import VisionKit

  @available(iOS 16.0, *)
  final class DataScannerSession: NSObject, DataScannerViewControllerDelegate,
    UIAdaptivePresentationControllerDelegate
  {
    private let dataScanner: DataScannerViewController
    private let promise: Promise<ScannedCode>
    private let onFinish: (DataScannerSession) -> Void
    private var didFinish = false

    init(
      options: ResolvedScanOptions,
      promise: Promise<ScannedCode>,
      onFinish: @escaping (DataScannerSession) -> Void
    ) throws {
      let symbologies = try options.formats.visionSymbologies()
      dataScanner = DataScannerViewController(
        recognizedDataTypes: [.barcode(symbologies: symbologies)],
        qualityLevel: options.qualityLevel.visionQualityLevel,
        recognizesMultipleItems: false,
        isHighFrameRateTrackingEnabled: false,
        isPinchToZoomEnabled: true,
        isGuidanceEnabled: true,
        isHighlightingEnabled: true
      )
      self.promise = promise
      self.onFinish = onFinish
      super.init()
      dataScanner.delegate = self
      dataScanner.navigationItem.leftBarButtonItem = UIBarButtonItem(
        barButtonSystemItem: .cancel,
        target: self,
        action: #selector(cancel)
      )
    }

    func start() throws {
      guard Bundle.main.object(forInfoDictionaryKey: "NSCameraUsageDescription") != nil else {
        throw RuntimeError.error(
          withMessage:
            "Cannot scan codes because the app Info.plist does not contain NSCameraUsageDescription."
        )
      }
      guard DataScannerViewController.isSupported else {
        throw RuntimeError.error(
          withMessage: "Data scanning is not supported on this device."
        )
      }
      guard DataScannerViewController.isAvailable else {
        throw RuntimeError.error(
          withMessage:
            "Data scanning is not available. Check camera permission, Screen Time restrictions, and app foreground state."
        )
      }
      guard let presenter = UIViewController.dataScannerTopMostViewController else {
        throw RuntimeError.error(
          withMessage: "Cannot present the data scanner because no active view controller was found."
        )
      }

      let navigationController = UINavigationController(rootViewController: dataScanner)
      navigationController.presentationController?.delegate = self
      presenter.present(navigationController, animated: true) { [weak self] in
        guard let self else { return }
        do {
          try self.dataScanner.startScanning()
        } catch {
          self.finish(.failure(error))
        }
      }
    }

    func dataScanner(
      _ dataScanner: DataScannerViewController,
      didAdd addedItems: [RecognizedItem],
      allItems: [RecognizedItem]
    ) {
      resolveFirstCode(in: addedItems)
    }

    func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
      resolveFirstCode(in: [item])
    }

    func dataScanner(
      _ dataScanner: DataScannerViewController,
      becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable
    ) {
      finish(.failure(error))
    }

    func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
      finish(
        .failure(RuntimeError.error(withMessage: "The code scanner was cancelled.")),
        shouldDismiss: false
      )
    }

    @objc
    private func cancel() {
      finish(.failure(RuntimeError.error(withMessage: "The code scanner was cancelled.")))
    }

    private func resolveFirstCode(in items: [RecognizedItem]) {
      for item in items {
        guard case .barcode(let barcode) = item else { continue }
        guard let scannedCode = ScannedCode(barcode: barcode) else {
          finish(
            .failure(
              RuntimeError.error(
                withMessage: "The scanned code does not contain a text payload."
              )
            )
          )
          return
        }

        finish(.success(scannedCode))
        return
      }
    }

    private func finish(_ result: Result<ScannedCode, Error>, shouldDismiss: Bool = true) {
      guard !didFinish else { return }
      didFinish = true
      if dataScanner.isScanning {
        dataScanner.stopScanning()
      }

      if shouldDismiss {
        dataScanner.navigationController?.dismiss(animated: true)
      }

      switch result {
      case .success(let code):
        promise.resolve(withResult: code)
      case .failure(let error):
        promise.reject(withError: error)
      }

      onFinish(self)
    }
  }
#endif
