import AVFoundation
import NitroModules
import UIKit
import Vision
import VisionKit

final class HybridDataScanner: HybridDataScannerSpec {
  let capabilities: DataScannerCapabilities
  let configuration: DataScannerResolvedConfiguration

  private var activeScanner: DataScannerViewController?
  private var activeNavigationController: UINavigationController?
  private var pendingScanPromise: Promise<ScannedItem?>?
  private var currentRegionOfInterest: Rect?
  private var currentItems: [ScannedItem] = []
  private var isCurrentlyScanning = false
  private var resolvesOneShotScanOnTap = false

  private var itemsChangedListeners: [Int: (ScannedItemsChangedEvent) -> Void] = [:]
  private var selectedListeners: [Int: (ScannedItem) -> Void] = [:]
  private var errorListeners: [Int: (Error) -> Void] = [:]
  private var zoomChangedListeners: [Int: (ZoomChangedEvent) -> Void] = [:]
  private var nextListenerId = 0

  var isScanning: Bool {
    return Self.mainSync { activeScanner?.isScanning ?? isCurrentlyScanning }
  }

  var recognizedItems: [ScannedItem] {
    return Self.mainSync { currentItems }
  }

  var zoomRange: ZoomRange? {
    return Self.mainSync {
      guard let scanner = activeScanner else {
        return nil
      }
      return ZoomRange(min: scanner.minZoomFactor, max: scanner.maxZoomFactor)
    }
  }

  var zoomFactor: Double? {
    return Self.mainSync { activeScanner?.zoomFactor }
  }

  var regionOfInterest: Rect? {
    return Self.mainSync { currentRegionOfInterest }
  }

  init(options: DataScannerOptions?) throws {
    capabilities = Self.createCapabilities()
    configuration = try Self.createConfiguration(options: options)
    currentRegionOfInterest = options?.regionOfInterest
    super.init()
  }

  func scan() throws -> Promise<ScannedItem?> {
    let promise = Promise<ScannedItem?>()
    Task { @MainActor in
      do {
        try presentScanner(resolvesOnTap: true, scanPromise: promise, startPromise: nil)
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func startScanning() throws -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor in
      do {
        if let scanner = activeScanner {
          if !scanner.isScanning {
            try scanner.startScanning()
          }
          isCurrentlyScanning = true
          promise.resolve()
          return
        }
        try presentScanner(resolvesOnTap: false, scanPromise: nil, startPromise: promise)
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func stopScanning() throws -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor in
      stopAndDismissScanner()
      promise.resolve()
    }
    return promise
  }

  func setZoomFactor(zoomFactor: Double) throws -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor in
      do {
        guard let scanner = activeScanner else {
          throw Self.error("Cannot set zoom factor because no scanner session is active.")
        }
        guard zoomFactor >= scanner.minZoomFactor && zoomFactor <= scanner.maxZoomFactor else {
          throw Self.error("Zoom factor \(zoomFactor) is outside the supported range \(scanner.minZoomFactor)-\(scanner.maxZoomFactor).")
        }
        scanner.zoomFactor = zoomFactor
        notifyZoomChanged(scanner)
        promise.resolve()
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func setRegionOfInterest(region: Rect?) throws -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor in
      currentRegionOfInterest = region
      activeScanner?.regionOfInterest = region?.cgRect
      promise.resolve()
    }
    return promise
  }

  func capturePhoto() throws -> Promise<CapturedPhoto> {
    let promise = Promise<CapturedPhoto>()
    Task { @MainActor in
      do {
        guard let scanner = activeScanner, scanner.isScanning else {
          throw Self.error("Cannot capture a photo because no scanner session is active.")
        }
        let image = try await scanner.capturePhoto()
        let photo = try Self.writeTemporaryPhoto(image)
        promise.resolve(withResult: photo)
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func addOnItemsChangedListener(listener: @escaping (_ event: ScannedItemsChangedEvent) -> Void) throws -> ListenerSubscription {
    let id = nextListenerId
    nextListenerId += 1
    itemsChangedListeners[id] = listener
    return ListenerSubscription(remove: { [weak self] in
      self?.itemsChangedListeners.removeValue(forKey: id)
    })
  }

  func addOnItemSelectedListener(listener: @escaping (_ item: ScannedItem) -> Void) throws -> ListenerSubscription {
    let id = nextListenerId
    nextListenerId += 1
    selectedListeners[id] = listener
    return ListenerSubscription(remove: { [weak self] in
      self?.selectedListeners.removeValue(forKey: id)
    })
  }

  func addOnErrorListener(listener: @escaping (_ error: Error) -> Void) throws -> ListenerSubscription {
    let id = nextListenerId
    nextListenerId += 1
    errorListeners[id] = listener
    return ListenerSubscription(remove: { [weak self] in
      self?.errorListeners.removeValue(forKey: id)
    })
  }

  func addOnZoomChangedListener(listener: @escaping (_ event: ZoomChangedEvent) -> Void) throws -> ListenerSubscription {
    let id = nextListenerId
    nextListenerId += 1
    zoomChangedListeners[id] = listener
    return ListenerSubscription(remove: { [weak self] in
      self?.zoomChangedListeners.removeValue(forKey: id)
    })
  }

  @MainActor
  private func presentScanner(
    resolvesOnTap: Bool,
    scanPromise: Promise<ScannedItem?>?,
    startPromise: Promise<Void>?
  ) throws {
    guard activeScanner == nil else {
      throw Self.error("A scanner session is already active.")
    }
    guard DataScannerViewController.isSupported else {
      throw Self.error("Data scanning is not supported on this device.")
    }
    guard DataScannerViewController.isAvailable else {
      throw Self.error("Data scanning is not currently available.")
    }
    guard let presenter = Self.topViewController() else {
      throw Self.error("Cannot present scanner because no active view controller was found.")
    }

    let scanner = try makeScannerViewController()
    let navigationController = UINavigationController(rootViewController: scanner)
    navigationController.modalPresentationStyle = .fullScreen
    scanner.navigationItem.rightBarButtonItem = UIBarButtonItem(
      systemItem: .cancel,
      primaryAction: UIAction { [weak self] _ in
        self?.cancelPresentedScanner()
      },
      menu: nil
    )

    pendingScanPromise = scanPromise
    resolvesOneShotScanOnTap = resolvesOnTap
    activeScanner = scanner
    activeNavigationController = navigationController

    presenter.present(navigationController, animated: true) { [weak self, weak scanner] in
      guard let self, let scanner else {
        return
      }
      do {
        try scanner.startScanning()
        self.isCurrentlyScanning = true
        startPromise?.resolve()
      } catch {
        self.notifyError(error)
        self.pendingScanPromise?.reject(withError: error)
        self.pendingScanPromise = nil
        startPromise?.reject(withError: error)
        self.stopAndDismissScanner()
      }
    }
  }

  @MainActor
  private func makeScannerViewController() throws -> DataScannerViewController {
    let scanner = DataScannerViewController(
      recognizedDataTypes: try Self.toVisionRecognizedDataTypes(configuration.recognizedDataTypes),
      qualityLevel: configuration.quality.visionQualityLevel,
      recognizesMultipleItems: configuration.itemRecognitionMode == .multiple,
      isHighFrameRateTrackingEnabled: configuration.features.isHighFrameRateTrackingEnabled,
      isPinchToZoomEnabled: configuration.features.isPinchToZoomEnabled,
      isGuidanceEnabled: configuration.features.isGuidanceEnabled,
      isHighlightingEnabled: configuration.features.isHighlightingEnabled
    )
    scanner.delegate = self
    scanner.regionOfInterest = currentRegionOfInterest?.cgRect
    return scanner
  }

  @MainActor
  private func cancelPresentedScanner() {
    pendingScanPromise?.resolve(withResult: nil)
    pendingScanPromise = nil
    stopAndDismissScanner()
  }

  @MainActor
  private func stopAndDismissScanner() {
    activeScanner?.stopScanning()
    isCurrentlyScanning = false
    currentItems = []

    let presentedController = activeNavigationController ?? activeScanner
    activeScanner = nil
    activeNavigationController = nil
    resolvesOneShotScanOnTap = false

    guard let presentedController, presentedController.presentingViewController != nil else {
      return
    }
    presentedController.dismiss(animated: true)
  }

  private func notifyError(_ error: Error) {
    errorListeners.values.forEach { listener in listener(error) }
  }

  @MainActor
  private func notifyZoomChanged(_ scanner: DataScannerViewController) {
    let event = ZoomChangedEvent(
      zoomFactor: scanner.zoomFactor,
      zoomRange: ZoomRange(min: scanner.minZoomFactor, max: scanner.maxZoomFactor)
    )
    zoomChangedListeners.values.forEach { listener in listener(event) }
  }

  static func createCapabilities() -> DataScannerCapabilities {
    let state = mainSync {
      let authorizationStatus = AVCaptureDevice.authorizationStatus(for: .video)
      let isSupported = DataScannerViewController.isSupported
      let isAvailable = DataScannerViewController.isAvailable && authorizationStatus != .denied && authorizationStatus != .restricted
      let unavailableReason: DataScannerUnavailableReason?

      if !isSupported {
        unavailableReason = .unsupportedDevice
      } else if authorizationStatus == .denied {
        unavailableReason = .cameraPermissionDenied
      } else if authorizationStatus == .restricted {
        unavailableReason = .cameraRestricted
      } else if !DataScannerViewController.isAvailable {
        unavailableReason = .cameraUnavailable
      } else {
        unavailableReason = nil
      }

      return (
        isSupported,
        isAvailable,
        unavailableReason,
        DataScannerViewController.supportedTextRecognitionLanguages
      )
    }

    return DataScannerCapabilities(
      isSupported: state.0,
      isAvailable: state.1,
      unavailableReason: state.2,
      canScanText: state.0,
      canScanBarcodes: state.0,
      canTrackItems: state.0,
      canScanMultipleItems: state.0,
      canCapturePhoto: state.0,
      canSetRegionOfInterest: state.0,
      canSetZoomFactor: state.0,
      canUsePinchToZoom: state.0,
      canUseGuidance: state.0,
      canUseHighlighting: state.0,
      canUseHighFrameRateTracking: state.0,
      canUseManualInput: false,
      canUseAutoZoom: false,
      supportedBarcodeFormats: appleBarcodeFormats,
      supportedTextContentTypes: appleTextContentTypes,
      supportedTextRecognitionLanguages: state.3
    )
  }

  private static func createConfiguration(options: DataScannerOptions?) throws -> DataScannerResolvedConfiguration {
    let recognizedDataTypes: [RecognizedDataType]
    if let requestedDataTypes = options?.recognizedDataTypes, !requestedDataTypes.isEmpty {
      recognizedDataTypes = requestedDataTypes
    } else {
      recognizedDataTypes = [
        RecognizedDataType(kind: .text, languages: nil, contentTypes: nil, formats: nil),
        RecognizedDataType(kind: .barcode, languages: nil, contentTypes: nil, formats: nil),
      ]
    }
    try validate(recognizedDataTypes: recognizedDataTypes)

    let features = options?.features
    return DataScannerResolvedConfiguration(
      recognizedDataTypes: recognizedDataTypes,
      quality: options?.quality ?? .balanced,
      itemRecognitionMode: options?.itemRecognitionMode ?? .single,
      features: ResolvedDataScannerFeatures(
        isGuidanceEnabled: isEnabled(features?.guidance, defaultValue: true),
        isHighlightingEnabled: isEnabled(features?.highlighting, defaultValue: false),
        isPinchToZoomEnabled: isEnabled(features?.pinchToZoom, defaultValue: true),
        isHighFrameRateTrackingEnabled: isEnabled(features?.highFrameRateTracking, defaultValue: true),
        isManualInputEnabled: false,
        isAutoZoomEnabled: false
      )
    )
  }

  private static func validate(recognizedDataTypes: [RecognizedDataType]) throws {
    for dataType in recognizedDataTypes {
      switch dataType.kind {
      case .text:
        for contentType in dataType.contentTypes ?? [] {
          _ = try contentType.visionTextContentType
        }
      case .barcode:
        let unsupportedFormats = (dataType.formats ?? []).filter { format in
          !appleBarcodeFormats.contains(format)
        }
        if !unsupportedFormats.isEmpty {
          throw error("Unsupported iOS barcode formats: \(unsupportedFormats.map(\.stringValue).joined(separator: ", ")).")
        }
      }
    }
  }

  private static func toVisionRecognizedDataTypes(_ dataTypes: [RecognizedDataType]) throws -> Set<DataScannerViewController.RecognizedDataType> {
    var recognizedDataTypes = Set<DataScannerViewController.RecognizedDataType>()

    for dataType in dataTypes {
      switch dataType.kind {
      case .text:
        let languages = dataType.languages ?? []
        let contentTypes = dataType.contentTypes ?? []
        if contentTypes.isEmpty {
          recognizedDataTypes.insert(.text(languages: languages))
        } else {
          for contentType in contentTypes {
            recognizedDataTypes.insert(.text(languages: languages, textContentType: try contentType.visionTextContentType))
          }
        }
      case .barcode:
        let symbologies = try (dataType.formats ?? []).map { format -> VNBarcodeSymbology in
          guard let symbology = format.visionSymbology else {
            throw error("Unsupported iOS barcode format: \(format.stringValue).")
          }
          return symbology
        }
        recognizedDataTypes.insert(.barcode(symbologies: symbologies))
      }
    }

    guard !recognizedDataTypes.isEmpty else {
      throw error("At least one recognized data type is required.")
    }
    return recognizedDataTypes
  }

  private static func isEnabled(_ preference: DataScannerFeaturePreference?, defaultValue: Bool) -> Bool {
    guard let preference else {
      return defaultValue
    }
    return preference == .enabled
  }

  private static func writeTemporaryPhoto(_ image: UIImage) throws -> CapturedPhoto {
    guard let data = image.jpegData(compressionQuality: 0.95) else {
      throw error("Failed to encode scanner photo.")
    }

    let fileName = "data-scanner-\(UUID().uuidString).jpg"
    let fileURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(fileName)
    try data.write(to: fileURL, options: .atomic)

    return CapturedPhoto(
      uri: fileURL.absoluteString,
      width: Double(image.size.width * image.scale),
      height: Double(image.size.height * image.scale)
    )
  }

  private static func topViewController() -> UIViewController? {
    let windowScene = UIApplication.shared.connectedScenes
      .compactMap { scene in scene as? UIWindowScene }
      .first { scene in scene.activationState == .foregroundActive }
    let rootViewController = windowScene?.windows.first { window in window.isKeyWindow }?.rootViewController
    return rootViewController?.topPresentedViewController
  }

  private static func mainSync<Result>(_ operation: @MainActor () throws -> Result) rethrows -> Result {
    if Thread.isMainThread {
      return try MainActor.assumeIsolated(operation)
    }
    return try DispatchQueue.main.sync {
      try MainActor.assumeIsolated(operation)
    }
  }

  private static func error(_ message: String) -> Error {
    return RuntimeError.error(withMessage: message)
  }

  private static var appleTextContentTypes: [TextContentType] {
    var contentTypes: [TextContentType] = [
      .url,
      .dateTimeDuration,
      .emailAddress,
      .flightNumber,
      .fullStreetAddress,
      .shipmentTrackingNumber,
      .telephoneNumber,
    ]
    if #available(iOS 17.0, *) {
      contentTypes.append(.currency)
    }
    return contentTypes
  }

  private static var appleBarcodeFormats: [BarcodeFormat] {
    var formats: [BarcodeFormat] = [
      .aztec,
      .codabar,
      .code128,
      .code39,
      .code39Checksum,
      .code39FullAscii,
      .code39FullAsciiChecksum,
      .code93,
      .code93i,
      .dataMatrix,
      .ean13,
      .ean8,
      .gs1DataBar,
      .gs1DataBarExpanded,
      .gs1DataBarLimited,
      .i2of5,
      .i2of5Checksum,
      .itf14,
      .microPdf417,
      .microQr,
      .pdf417,
      .qr,
      .upcE,
    ]
    if #available(iOS 17.0, *) {
      formats.append(.msiPlessey)
    }
    return formats
  }
}

@MainActor
extension HybridDataScanner: DataScannerViewControllerDelegate {
  func dataScannerDidZoom(_ dataScanner: DataScannerViewController) {
    notifyZoomChanged(dataScanner)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
    let scannedItem = item.scannedItem
    selectedListeners.values.forEach { listener in listener(scannedItem) }

    guard resolvesOneShotScanOnTap, let promise = pendingScanPromise else {
      return
    }
    pendingScanPromise = nil
    promise.resolve(withResult: scannedItem)
    stopAndDismissScanner()
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    emitItemsChanged(changeType: .added, changedItems: addedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didUpdate updatedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    emitItemsChanged(changeType: .updated, changedItems: updatedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didRemove removedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    emitItemsChanged(changeType: .removed, changedItems: removedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable) {
    let mappedError = Self.error("Data scanner became unavailable: \(error).")
    notifyError(mappedError)
    pendingScanPromise?.reject(withError: mappedError)
    pendingScanPromise = nil
    stopAndDismissScanner()
  }

  private func emitItemsChanged(changeType: ScannedItemsChangeType, changedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    let changedScannedItems = changedItems.map(\.scannedItem)
    currentItems = allItems.map(\.scannedItem)
    let event = ScannedItemsChangedEvent(
      changeType: changeType,
      changedItems: changedScannedItems,
      allItems: currentItems
    )
    itemsChangedListeners.values.forEach { listener in listener(event) }
  }
}

private extension RecognitionQuality {
  var visionQualityLevel: DataScannerViewController.QualityLevel {
    switch self {
    case .balanced:
      return .balanced
    case .fast:
      return .fast
    case .accurate:
      return .accurate
    }
  }
}

private extension TextContentType {
  var visionTextContentType: DataScannerViewController.TextContentType {
    get throws {
      switch self {
      case .url:
        return .URL
      case .dateTimeDuration:
        return .dateTimeDuration
      case .emailAddress:
        return .emailAddress
      case .flightNumber:
        return .flightNumber
      case .fullStreetAddress:
        return .fullStreetAddress
      case .shipmentTrackingNumber:
        return .shipmentTrackingNumber
      case .telephoneNumber:
        return .telephoneNumber
      case .currency:
        guard #available(iOS 17.0, *) else {
          throw RuntimeError.error(withMessage: "Text content type currency requires iOS 17.0 or newer.")
        }
        return .currency
      }
    }
  }
}

private extension BarcodeFormat {
  var visionSymbology: VNBarcodeSymbology? {
    switch self {
    case .aztec:
      return .aztec
    case .codabar:
      return .codabar
    case .code128:
      return .code128
    case .code39:
      return .code39
    case .code39Checksum:
      return .code39Checksum
    case .code39FullAscii:
      return .code39FullASCII
    case .code39FullAsciiChecksum:
      return .code39FullASCIIChecksum
    case .code93:
      return .code93
    case .code93i:
      return .code93i
    case .dataMatrix:
      return .dataMatrix
    case .ean13:
      return .ean13
    case .ean8:
      return .ean8
    case .gs1DataBar:
      return .gs1DataBar
    case .gs1DataBarExpanded:
      return .gs1DataBarExpanded
    case .gs1DataBarLimited:
      return .gs1DataBarLimited
    case .i2of5:
      return .i2of5
    case .i2of5Checksum:
      return .i2of5Checksum
    case .itf14:
      return .itf14
    case .microPdf417:
      return .microPDF417
    case .microQr:
      return .microQR
    case .pdf417:
      return .pdf417
    case .qr:
      return .qr
    case .upcE:
      return .upce
    case .msiPlessey:
      if #available(iOS 17.0, *) {
        return .msiPlessey
      }
      return nil
    case .unknown, .itf, .upcA:
      return nil
    }
  }
}

private extension VNBarcodeSymbology {
  var barcodeFormat: BarcodeFormat {
    if #available(iOS 17.0, *), self == .msiPlessey {
      return .msiPlessey
    }
    switch self {
    case .aztec:
      return .aztec
    case .codabar:
      return .codabar
    case .code128:
      return .code128
    case .code39:
      return .code39
    case .code39Checksum:
      return .code39Checksum
    case .code39FullASCII:
      return .code39FullAscii
    case .code39FullASCIIChecksum:
      return .code39FullAsciiChecksum
    case .code93:
      return .code93
    case .code93i:
      return .code93i
    case .dataMatrix:
      return .dataMatrix
    case .ean13:
      return .ean13
    case .ean8:
      return .ean8
    case .gs1DataBar:
      return .gs1DataBar
    case .gs1DataBarExpanded:
      return .gs1DataBarExpanded
    case .gs1DataBarLimited:
      return .gs1DataBarLimited
    case .i2of5:
      return .i2of5
    case .i2of5Checksum:
      return .i2of5Checksum
    case .itf14:
      return .itf14
    case .microPDF417:
      return .microPdf417
    case .microQR:
      return .microQr
    case .pdf417:
      return .pdf417
    case .qr:
      return .qr
    case .upce:
      return .upcE
    default:
      return .unknown
    }
  }
}

private extension RecognizedItem {
  var scannedItem: ScannedItem {
    switch self {
    case .text(let text):
      return ScannedItem(
        kind: .text,
        id: text.id.uuidString,
        bounds: bounds.quadrilateral,
        boundingBox: bounds.boundingRect,
        text: ScannedText(value: text.transcript, contentType: nil),
        barcode: nil
      )
    case .barcode(let barcode):
      return ScannedItem(
        kind: .barcode,
        id: barcode.id.uuidString,
        bounds: bounds.quadrilateral,
        boundingBox: bounds.boundingRect,
        text: nil,
        barcode: barcode.scannedBarcode
      )
    @unknown default:
      return ScannedItem(
        kind: .barcode,
        id: UUID().uuidString,
        bounds: nil,
        boundingBox: nil,
        text: nil,
        barcode: ScannedBarcode(
          format: .unknown,
          valueType: .unknown,
          rawValue: nil,
          displayValue: nil,
          rawBytes: nil
        )
      )
    }
  }
}

private extension RecognizedItem.Barcode {
  var scannedBarcode: ScannedBarcode {
    let rawBytes: ArrayBuffer?
    if #available(iOS 17.0, *), let payloadData = observation.payloadData {
      rawBytes = try? ArrayBuffer.copy(data: payloadData)
    } else {
      rawBytes = nil
    }

    return ScannedBarcode(
      format: observation.symbology.barcodeFormat,
      valueType: payloadStringValue == nil ? .unknown : .text,
      rawValue: payloadStringValue,
      displayValue: payloadStringValue,
      rawBytes: rawBytes
    )
  }
}

private extension RecognizedItem.Bounds {
  var quadrilateral: Quadrilateral {
    return Quadrilateral(
      topLeft: topLeft.point,
      topRight: topRight.point,
      bottomRight: bottomRight.point,
      bottomLeft: bottomLeft.point
    )
  }

  var boundingRect: Rect {
    let minX = min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
    let maxX = max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x)
    let minY = min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
    let maxY = max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y)
    return Rect(x: minX, y: minY, width: maxX - minX, height: maxY - minY)
  }
}

private extension CGPoint {
  var point: Point {
    return Point(x: x, y: y)
  }
}

private extension Rect {
  var cgRect: CGRect {
    return CGRect(x: x, y: y, width: width, height: height)
  }
}

private extension UIViewController {
  var topPresentedViewController: UIViewController {
    if let presentedViewController {
      return presentedViewController.topPresentedViewController
    }
    if let navigationController = self as? UINavigationController, let visibleViewController = navigationController.visibleViewController {
      return visibleViewController.topPresentedViewController
    }
    if let tabBarController = self as? UITabBarController, let selectedViewController = tabBarController.selectedViewController {
      return selectedViewController.topPresentedViewController
    }
    return self
  }
}
