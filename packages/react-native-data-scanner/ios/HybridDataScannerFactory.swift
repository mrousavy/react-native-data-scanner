import NitroModules

#if os(iOS)
import AVFoundation
import UIKit
import Vision
import VisionKit
#endif

final class HybridDataScannerFactory: HybridDataScannerFactorySpec, @unchecked Sendable {
#if os(iOS)
  private var currentSession: AnyObject?
  private var isScanInProgress = false
#endif

  func scan(options: ResolvedScanOptions) throws -> Promise<Barcode> {
#if os(iOS)
    let promise = Promise<Barcode>()
    let scanOptions = NativeScanOptions(options)

    Task { @MainActor [weak self] in
      self?.scanOnMain(options: scanOptions, promise: promise)
    }

    return promise
#else
    return Promise.rejected(
      withError: RuntimeError("Data scanning is only supported on iOS and Android."))
#endif
  }

#if os(iOS)
  @MainActor
  private func scanOnMain(options: NativeScanOptions, promise: Promise<Barcode>) {
    guard !isScanInProgress else {
      promise.reject(withError: RuntimeError("A barcode scan is already in progress."))
      return
    }

    isScanInProgress = true

    guard #available(iOS 16.0, *) else {
      rejectScan(promise, RuntimeError("Data scanning requires iOS 16.0 or newer."))
      return
    }

    guard Bundle.main.object(forInfoDictionaryKey: "NSCameraUsageDescription") != nil else {
      rejectScan(
        promise,
        RuntimeError(
          "Missing NSCameraUsageDescription in Info.plist. Add a camera usage description before calling DataScanner.scan()."
        ))
      return
    }

    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      presentScanner(options: options, promise: promise)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { [weak self] granted in
        Task { @MainActor [weak self] in
          guard let self else { return }
          if granted {
            self.presentScanner(options: options, promise: promise)
          } else {
            self.rejectScan(
              promise,
              RuntimeError("Camera permission was denied, so barcode scanning cannot start."))
          }
        }
      }
    case .denied:
      rejectScan(
        promise,
        RuntimeError("Camera permission is denied. Enable camera access to scan barcodes."))
    case .restricted:
      rejectScan(
        promise,
        RuntimeError("Camera access is restricted, so barcode scanning cannot start."))
    @unknown default:
      rejectScan(
        promise,
        RuntimeError("Camera permission is in an unknown state, so barcode scanning cannot start."))
    }
  }

  @available(iOS 16.0, *)
  @MainActor
  private func presentScanner(options: NativeScanOptions, promise: Promise<Barcode>) {
    guard DataScannerViewController.isSupported else {
      rejectScan(promise, RuntimeError("Data scanning is not supported on this device."))
      return
    }

    guard DataScannerViewController.isAvailable else {
      rejectScan(
        promise,
        RuntimeError(
          "Data scanning is currently unavailable. Check camera permission, Screen Time restrictions, and camera availability."
        ))
      return
    }

    guard let presenter = UIApplication.shared.dataScannerTopViewController else {
      rejectScan(promise, RuntimeError("Cannot find a visible view controller to present the scanner."))
      return
    }

    do {
      let session = try BarcodeScanSession(options: options, promise: promise) { [weak self] in
        self?.currentSession = nil
        self?.isScanInProgress = false
      }
      currentSession = session
      session.start(from: presenter)
    } catch {
      rejectScan(promise, error)
    }
  }

  @MainActor
  private func rejectScan(_ promise: Promise<Barcode>, _ error: Error) {
    isScanInProgress = false
    currentSession = nil
    promise.reject(withError: error)
  }
#endif
}

#if os(iOS)
private struct NativeScanOptions: @unchecked Sendable {
  let targetFormats: [TargetBarcodeFormat]

  init(_ options: ResolvedScanOptions) {
    targetFormats = options.targetFormats
  }
}

@available(iOS 16.0, *)
@MainActor
private final class BarcodeScanSession: NSObject, DataScannerViewControllerDelegate,
  UIAdaptivePresentationControllerDelegate
{
  private let scanner: DataScannerViewController
  private let promise: Promise<Barcode>
  private let onFinish: () -> Void

  private var isFinished = false
  private var recognizedItemsTask: Task<Void, Never>?
  private weak var presentedController: UIViewController?

  init(options: NativeScanOptions, promise: Promise<Barcode>, onFinish: @escaping () -> Void)
    throws
  {
    let symbologies = try Self.makeSymbologies(from: options.targetFormats)
    scanner = DataScannerViewController(
      recognizedDataTypes: [.barcode(symbologies: symbologies)],
      qualityLevel: .balanced,
      recognizesMultipleItems: false,
      isHighFrameRateTrackingEnabled: false,
      isPinchToZoomEnabled: true,
      isGuidanceEnabled: true,
      isHighlightingEnabled: true)
    self.promise = promise
    self.onFinish = onFinish
    super.init()
  }

  func start(from presenter: UIViewController) {
    scanner.delegate = self
    scanner.navigationItem.leftBarButtonItem = UIBarButtonItem(
      barButtonSystemItem: .cancel,
      target: self,
      action: #selector(cancel))

    let navigationController = UINavigationController(rootViewController: scanner)
    navigationController.modalPresentationStyle = .fullScreen
    navigationController.presentationController?.delegate = self
    presentedController = navigationController

    presenter.present(navigationController, animated: true) { [weak self] in
      guard let self else { return }
      do {
        try self.scanner.startScanning()
        self.observeRecognizedItems()
      } catch {
        self.finish(.failure(error))
      }
    }
  }

  @objc
  private func cancel() {
    finish(.failure(RuntimeError("The barcode scan was cancelled.")))
  }

  private func observeRecognizedItems() {
    recognizedItemsTask = Task { [weak self] in
      guard let self else { return }

      for await items in self.scanner.recognizedItems {
        guard let barcode = Self.firstBarcode(in: items) else {
          continue
        }
        self.finish(.success(barcode))
        return
      }
    }
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
    guard let barcode = Self.barcode(from: item) else {
      return
    }
    finish(.success(barcode))
  }

  func dataScanner(
    _ dataScanner: DataScannerViewController,
    becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable
  ) {
    finish(.failure(RuntimeError("Data scanning became unavailable: \(error).")))
  }

  func presentationControllerDidDismiss(_ presentationController: UIPresentationController) {
    finish(.failure(RuntimeError("The barcode scan was cancelled.")))
  }

  private func finish(_ result: Result<Barcode, Error>) {
    guard !isFinished else {
      return
    }

    isFinished = true
    recognizedItemsTask?.cancel()
    recognizedItemsTask = nil
    scanner.stopScanning()

    let complete = { [promise, onFinish] in
      switch result {
      case .success(let barcode):
        promise.resolve(withResult: barcode)
      case .failure(let error):
        promise.reject(withError: error)
      }
      onFinish()
    }

    if let presentedController, presentedController.presentingViewController != nil {
      presentedController.dismiss(animated: true, completion: complete)
    } else {
      complete()
    }
  }

  private static func makeSymbologies(from targetFormats: [TargetBarcodeFormat]) throws
    -> [VNBarcodeSymbology]
  {
    guard !targetFormats.isEmpty else {
      throw RuntimeError("targetFormats cannot be empty. Use 'all' instead.")
    }

    if targetFormats.contains(.all) {
      guard targetFormats.count == 1 else {
        throw RuntimeError("targetFormats cannot combine 'all' with specific barcode formats.")
      }
      return []
    }

    return try targetFormats.map { try $0.toVNBarcodeSymbology() }
  }

  private static func firstBarcode(in items: [RecognizedItem]) -> Barcode? {
    for item in items {
      if let barcode = barcode(from: item) {
        return barcode
      }
    }
    return nil
  }

  private static func barcode(from item: RecognizedItem) -> Barcode? {
    guard case .barcode(let barcode) = item else {
      return nil
    }

    let rawValue = barcode.payloadStringValue
    return Barcode(
      format: BarcodeFormat.fromVNBarcodeSymbology(barcode.observation.symbology),
      rawValue: rawValue,
      displayValue: rawValue)
  }
}

@available(iOS 16.0, *)
private extension TargetBarcodeFormat {
  func toVNBarcodeSymbology() throws -> VNBarcodeSymbology {
    switch self {
    case .code128:
      return .code128
    case .code39:
      return .code39
    case .code93:
      return .code93
    case .codabar:
      return .codabar
    case .dataMatrix:
      return .dataMatrix
    case .ean13:
      return .ean13
    case .ean8:
      return .ean8
    case .itf:
      return .i2of5
    case .qrCode:
      return .qr
    case .upcA:
      throw RuntimeError(
        "The 'upc-a' target format is not supported by the iOS scanner. Use 'ean-13' or 'all' instead."
      )
    case .upcE:
      return .upce
    case .pdf417:
      return .pdf417
    case .aztec:
      return .aztec
    case .all:
      throw RuntimeError("'all' must be handled before converting target barcode formats.")
    }
  }
}

@available(iOS 16.0, *)
private extension BarcodeFormat {
  static func fromVNBarcodeSymbology(_ symbology: VNBarcodeSymbology) -> BarcodeFormat {
    if symbology == .aztec { return .aztec }
    if symbology == .codabar { return .codabar }
    if symbology == .code128 { return .code128 }
    if symbology == .code39 || symbology == .code39Checksum
      || symbology == .code39FullASCII || symbology == .code39FullASCIIChecksum
    {
      return .code39
    }
    if symbology == .code93 || symbology == .code93i { return .code93 }
    if symbology == .dataMatrix { return .dataMatrix }
    if symbology == .ean13 { return .ean13 }
    if symbology == .ean8 { return .ean8 }
    if symbology == .i2of5 || symbology == .i2of5Checksum || symbology == .itf14 {
      return .itf
    }
    if symbology == .pdf417 { return .pdf417 }
    if symbology == .qr { return .qrCode }
    if symbology == .upce { return .upcE }
    return .unknown
  }
}

private extension UIApplication {
  var dataScannerTopViewController: UIViewController? {
    let foregroundScene = connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .first { $0.activationState == .foregroundActive }
    let fallbackScene = connectedScenes.compactMap { $0 as? UIWindowScene }.first
    let scene = foregroundScene ?? fallbackScene
    let rootViewController = scene?.windows.first { $0.isKeyWindow }?.rootViewController
      ?? scene?.windows.first?.rootViewController
    return rootViewController?.dataScannerTopMostViewController
  }
}

private extension UIViewController {
  var dataScannerTopMostViewController: UIViewController {
    if let presentedViewController {
      return presentedViewController.dataScannerTopMostViewController
    }

    if let navigationController = self as? UINavigationController,
      let visibleViewController = navigationController.visibleViewController
    {
      return visibleViewController.dataScannerTopMostViewController
    }

    if let tabBarController = self as? UITabBarController,
      let selectedViewController = tabBarController.selectedViewController
    {
      return selectedViewController.dataScannerTopMostViewController
    }

    return self
  }
}
#endif
