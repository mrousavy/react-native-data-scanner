import NitroModules
import Foundation

#if os(iOS) && !targetEnvironment(macCatalyst)
import UIKit
import VisionKit

@available(iOS 16.0, *)
final class HybridDataScanner: HybridDataScannerSpec {
  let configuration: DataScannerConfiguration
  let capabilities: DataScannerCapabilities

  private let listenerLock = NSLock()
  private var delegateProxy: DataScannerDelegateProxy?
  private var scannerViewController: DataScannerViewController?
  private var pendingScan: Promise<any HybridScannedItemSpec>?
  private var latestItems: [any HybridScannedItemSpec] = []

  private var itemsAddedListeners: [UUID: (ItemsChangedEvent) -> Void] = [:]
  private var itemsUpdatedListeners: [UUID: (ItemsChangedEvent) -> Void] = [:]
  private var itemsRemovedListeners: [UUID: (ItemsChangedEvent) -> Void] = [:]
  private var itemTappedListeners: [UUID: (ItemTappedEvent) -> Void] = [:]
  private var zoomChangedListeners: [UUID: (ZoomChangedEvent) -> Void] = [:]
  private var errorListeners: [UUID: (Error) -> Void] = [:]

  var isAvailable: Bool {
    return DataScannerCapabilities.current.isAvailable
  }

  var isScanning: Bool {
    return readOnMainActor { self.scannerViewController?.isScanning ?? false }
  }

  var recognizedItems: [any HybridScannedItemSpec] {
    return listenerLock.withLock { latestItems }
  }

  var minZoomFactor: Double {
    return readOnMainActor { self.scannerViewController?.minZoomFactor ?? 1.0 }
  }

  var maxZoomFactor: Double {
    return readOnMainActor { self.scannerViewController?.maxZoomFactor ?? 1.0 }
  }

  var zoomFactor: Double {
    return readOnMainActor { self.scannerViewController?.zoomFactor ?? 1.0 }
  }

  init(configuration: DataScannerConfiguration, capabilities: DataScannerCapabilities) {
    self.configuration = configuration
    self.capabilities = capabilities
    super.init()
  }

  func scan() throws -> Promise<any HybridScannedItemSpec> {
    let promise = Promise<any HybridScannedItemSpec>()
    Task { @MainActor [weak self] in
      guard let self else {
        promise.reject(withError: RuntimeError("The iOS data scanner was released before scanning could start."))
        return
      }
      do {
        let scanner = try scannerController()
        pendingScan?.reject(withError: RuntimeError("A newer iOS scan request replaced this scan."))
        pendingScan = promise
        try await presentScanner(scanner)
        if !scanner.isScanning {
          try scanner.startScanning()
        }
      } catch {
        pendingScan = nil
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func present() throws -> Promise<Void> {
    return runOnMain { scanner in
      try await self.presentScanner(scanner)
    }
  }

  func dismiss() throws -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor [weak self] in
      guard let self else {
        promise.resolve()
        return
      }
      pendingScan?.reject(withError: CancellationError())
      pendingScan = nil
      await dismissScanner()
      promise.resolve()
    }
    return promise
  }

  func startScanning() throws -> Promise<Void> {
    return runOnMain { scanner in
      try await self.presentScanner(scanner)
      if !scanner.isScanning {
        try scanner.startScanning()
      }
    }
  }

  func stopScanning() throws {
    Task { @MainActor [weak self] in
      self?.scannerViewController?.stopScanning()
    }
  }

  func setRegionOfInterest(region: Rect?) throws -> Promise<Void> {
    return runOnMain { scanner in
      scanner.regionOfInterest = region?.cgRect
    }
  }

  func setZoomFactor(zoomFactor: Double) throws -> Promise<Void> {
    return runOnMain { scanner in
      guard zoomFactor >= scanner.minZoomFactor && zoomFactor <= scanner.maxZoomFactor else {
        throw RuntimeError(
          "Zoom factor \(zoomFactor) is outside the supported range \(scanner.minZoomFactor)...\(scanner.maxZoomFactor).")
      }
      scanner.zoomFactor = zoomFactor
    }
  }

  func capturePhoto() throws -> Promise<any HybridCapturedPhotoSpec> {
    let promise = Promise<any HybridCapturedPhotoSpec>()
    Task { @MainActor [weak self] in
      guard let self else {
        promise.reject(withError: RuntimeError("The iOS data scanner was released before photo capture could start."))
        return
      }
      do {
        let scanner = try scannerController()
        let image = try await scanner.capturePhoto()
        promise.resolve(withResult: try HybridCapturedPhoto(image: image))
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  func addItemsAddedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.itemsAddedListeners, listener: listener)
  }

  func addItemsUpdatedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.itemsUpdatedListeners, listener: listener)
  }

  func addItemsRemovedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.itemsRemovedListeners, listener: listener)
  }

  func addItemTappedListener(listener: @escaping (_ event: ItemTappedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.itemTappedListeners, listener: listener)
  }

  func addZoomChangedListener(listener: @escaping (_ event: ZoomChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.zoomChangedListeners, listener: listener)
  }

  func addErrorListener(listener: @escaping (_ error: Error) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return addListener(to: \.errorListeners, listener: listener)
  }

  @MainActor
  func handleZoom(_ scanner: DataScannerViewController) {
    let event = ZoomChangedEvent(zoomFactor: scanner.zoomFactor)
    snapshot(\.zoomChangedListeners).forEach { listener in listener(event) }
  }

  @MainActor
  func handleTap(on item: RecognizedItem) {
    guard let item = makeHybridItem(from: item) else {
      return
    }
    let event = ItemTappedEvent(item: item)
    snapshot(\.itemTappedListeners).forEach { listener in listener(event) }
  }

  @MainActor
  func handleAdded(_ addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    let added = addedItems.compactMap(makeHybridItem)
    let all = allItems.compactMap(makeHybridItem)
    updateLatestItems(all)
    emitItemsChanged(added, allItems: all, listeners: \.itemsAddedListeners)
    resolvePendingScan(with: added.first)
  }

  @MainActor
  func handleUpdated(_ updatedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    let updated = updatedItems.compactMap(makeHybridItem)
    let all = allItems.compactMap(makeHybridItem)
    updateLatestItems(all)
    emitItemsChanged(updated, allItems: all, listeners: \.itemsUpdatedListeners)
  }

  @MainActor
  func handleRemoved(_ removedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    let removed = removedItems.compactMap(makeHybridItem)
    let all = allItems.compactMap(makeHybridItem)
    updateLatestItems(all)
    emitItemsChanged(removed, allItems: all, listeners: \.itemsRemovedListeners)
  }

  @MainActor
  func handleUnavailable(_ error: DataScannerViewController.ScanningUnavailable) {
    pendingScan?.reject(withError: error)
    pendingScan = nil
    emitError(error)
  }

  private func readOnMainActor<T>(_ body: @MainActor @escaping () -> T) -> T {
    if Thread.isMainThread {
      return MainActor.assumeIsolated(body)
    }
    return DispatchQueue.main.sync {
      MainActor.assumeIsolated(body)
    }
  }

  @MainActor
  private func scannerController() throws -> DataScannerViewController {
    if let scannerViewController {
      return scannerViewController
    }

    let scanner = DataScannerViewController(
      recognizedDataTypes: try configuration.toVisionRecognizedDataTypes(),
      qualityLevel: configuration.qualityLevel?.toVisionQualityLevel() ?? .balanced,
      recognizesMultipleItems: configuration.recognizesMultipleItems ?? false,
      isHighFrameRateTrackingEnabled: configuration.isHighFrameRateTrackingEnabled ?? true,
      isPinchToZoomEnabled: configuration.isPinchToZoomEnabled ?? true,
      isGuidanceEnabled: configuration.isGuidanceEnabled ?? true,
      isHighlightingEnabled: configuration.isHighlightingEnabled ?? false)
    let proxy = delegateProxy ?? DataScannerDelegateProxy()
    proxy.owner = self
    delegateProxy = proxy
    scanner.delegate = proxy
    scanner.regionOfInterest = configuration.regionOfInterest?.cgRect
    scannerViewController = scanner
    return scanner
  }

  @MainActor
  private func presentScanner(_ scanner: DataScannerViewController) async throws {
    if scanner.presentingViewController != nil || scanner.view.window != nil {
      return
    }
    guard let presenter = UIViewController.dataScannerTopMostPresenter() else {
      throw RuntimeError("Cannot present the iOS data scanner without an active key window.")
    }
    await withCheckedContinuation { continuation in
      presenter.present(scanner, animated: true) {
        continuation.resume()
      }
    }
  }

  @MainActor
  private func dismissScanner() async {
    guard let scanner = scannerViewController,
          scanner.presentingViewController != nil || scanner.view.window != nil else {
      return
    }
    await withCheckedContinuation { continuation in
      scanner.dismiss(animated: true) {
        continuation.resume()
      }
    }
  }

  private func runOnMain(
    _ body: @escaping @MainActor (_ scanner: DataScannerViewController) async throws -> Void
  ) -> Promise<Void> {
    let promise = Promise<Void>()
    Task { @MainActor [weak self] in
      guard let self else {
        promise.reject(withError: RuntimeError("The iOS data scanner was released before the operation could run."))
        return
      }
      do {
        let scanner = try scannerController()
        try await body(scanner)
        promise.resolve()
      } catch {
        promise.reject(withError: error)
      }
    }
    return promise
  }

  @MainActor
  private func makeHybridItem(from item: RecognizedItem) -> (any HybridScannedItemSpec)? {
    switch item {
    case .text(let text):
      return HybridScannedText(text: text, contentType: configuration.recognizes?.text?.contentType)
    case .barcode(let barcode):
      return HybridScannedBarcode(barcode: barcode)
    @unknown default:
      return nil
    }
  }

  @MainActor
  private func resolvePendingScan(with item: (any HybridScannedItemSpec)?) {
    guard let item, let promise = pendingScan else {
      return
    }
    pendingScan = nil
    promise.resolve(withResult: item)
    scannerViewController?.stopScanning()
    Task { @MainActor [weak self] in
      await self?.dismissScanner()
    }
  }

  private func updateLatestItems(_ items: [any HybridScannedItemSpec]) {
    listenerLock.withLock {
      latestItems = items
    }
  }

  private func emitItemsChanged(
    _ items: [any HybridScannedItemSpec],
    allItems: [any HybridScannedItemSpec],
    listeners keyPath: KeyPath<HybridDataScanner, [UUID: (ItemsChangedEvent) -> Void]>
  ) {
    let event = ItemsChangedEvent(items: items, allItems: allItems)
    snapshot(keyPath).forEach { listener in listener(event) }
  }

  private func emitError(_ error: Error) {
    snapshot(\.errorListeners).forEach { listener in listener(error) }
  }

  private func snapshot<T>(_ keyPath: KeyPath<HybridDataScanner, [UUID: T]>) -> [T] {
    return listenerLock.withLock {
      Array(self[keyPath: keyPath].values)
    }
  }

  private func addListener<T>(
    to keyPath: ReferenceWritableKeyPath<HybridDataScanner, [UUID: T]>,
    listener: T
  ) -> any HybridListenerSubscriptionSpec {
    let id = UUID()
    listenerLock.withLock {
      self[keyPath: keyPath][id] = listener
    }
    return HybridListenerSubscription { [weak self] in
      guard let self else {
        return
      }
      _ = listenerLock.withLock {
        self[keyPath: keyPath].removeValue(forKey: id)
      }
    }
  }
}

@available(iOS 16.0, *)
private final class DataScannerDelegateProxy: DataScannerViewControllerDelegate {
  weak var owner: HybridDataScanner?

  func dataScannerDidZoom(_ dataScanner: DataScannerViewController) {
    owner?.handleZoom(dataScanner)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didTapOn item: RecognizedItem) {
    owner?.handleTap(on: item)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didAdd addedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    owner?.handleAdded(addedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didUpdate updatedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    owner?.handleUpdated(updatedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, didRemove removedItems: [RecognizedItem], allItems: [RecognizedItem]) {
    owner?.handleRemoved(removedItems, allItems: allItems)
  }

  func dataScanner(_ dataScanner: DataScannerViewController, becameUnavailableWithError error: DataScannerViewController.ScanningUnavailable) {
    owner?.handleUnavailable(error)
  }
}

#else

final class HybridDataScanner: HybridDataScannerSpec {
  let configuration: DataScannerConfiguration
  let capabilities: DataScannerCapabilities

  var isAvailable: Bool { false }
  var isScanning: Bool { false }
  var recognizedItems: [any HybridScannedItemSpec] { [] }
  var minZoomFactor: Double { 1.0 }
  var maxZoomFactor: Double { 1.0 }
  var zoomFactor: Double { 1.0 }

  init(configuration: DataScannerConfiguration, capabilities: DataScannerCapabilities) {
    self.configuration = configuration
    self.capabilities = capabilities
    super.init()
  }

  func scan() throws -> Promise<any HybridScannedItemSpec> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func present() throws -> Promise<Void> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func dismiss() throws -> Promise<Void> {
    return Promise.resolved()
  }

  func startScanning() throws -> Promise<Void> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func stopScanning() throws {}

  func setRegionOfInterest(region: Rect?) throws -> Promise<Void> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func setZoomFactor(zoomFactor: Double) throws -> Promise<Void> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func capturePhoto() throws -> Promise<any HybridCapturedPhotoSpec> {
    return Promise.rejected(withError: RuntimeError("Data scanning is unavailable on this Apple platform."))
  }

  func addItemsAddedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }

  func addItemsUpdatedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }

  func addItemsRemovedListener(listener: @escaping (_ event: ItemsChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }

  func addItemTappedListener(listener: @escaping (_ event: ItemTappedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }

  func addZoomChangedListener(listener: @escaping (_ event: ZoomChangedEvent) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }

  func addErrorListener(listener: @escaping (_ error: Error) -> Void) throws -> any HybridListenerSubscriptionSpec {
    return HybridListenerSubscription {}
  }
}

#endif
