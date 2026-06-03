import NitroModules
import VisionKit

enum DataScannerCapabilityProvider {
  @MainActor
  static func currentCapabilities() -> DataScannerCapabilities {
    guard #available(iOS 16.0, *) else {
      return DataScannerCapabilities(
        isCodeScannerAvailable: false,
        supportedBarcodeFormats: [],
        supportsManualInput: false,
        supportsAutoZoom: false
      )
    }

    return DataScannerCapabilities(
      isCodeScannerAvailable: DataScannerViewController.isSupported
        && DataScannerViewController.isAvailable,
      supportedBarcodeFormats: BarcodeFormat.supportedVisionKitFormats,
      supportsManualInput: false,
      supportsAutoZoom: false
    )
  }

  @MainActor
  static func validateCanScan() throws {
    guard #available(iOS 16.0, *) else {
      throw RuntimeError("Data scanning requires iOS 16 or newer.")
    }

    guard DataScannerViewController.isSupported else {
      throw RuntimeError("Data scanning is not supported on this iOS device.")
    }
  }
}
