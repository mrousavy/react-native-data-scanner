import NitroModules
import VisionKit

@available(iOS 16.0, visionOS 1.0, *)
enum DataScannerAvailability {
  @MainActor
  static func checkBarcodeScanningAvailability() throws {
    guard DataScannerViewController.isSupported else {
      throw RuntimeError("Barcode scanning is not supported on this device.")
    }

    guard DataScannerViewController.isAvailable else {
      throw RuntimeError("Barcode scanning is unavailable. Check camera permission and device restrictions.")
    }
  }
}
