import NitroModules
#if os(iOS) && !targetEnvironment(macCatalyst)
import VisionKit
#endif

extension DataScannerConfiguration {
  static var `default`: DataScannerConfiguration {
    return DataScannerConfiguration(
      recognizes: nil,
      qualityLevel: nil,
      recognizesMultipleItems: nil,
      isHighFrameRateTrackingEnabled: nil,
      isPinchToZoomEnabled: nil,
      isGuidanceEnabled: nil,
      isHighlightingEnabled: nil,
      isAutoZoomEnabled: nil,
      isManualInputEnabled: nil,
      regionOfInterest: nil)
  }
}

extension DataScannerCapabilities {
  static var current: DataScannerCapabilities {
    #if os(iOS) && !targetEnvironment(macCatalyst)
    if #available(iOS 16.0, *) {
      return DataScannerCapabilities(
        isSupported: DataScannerViewController.isSupported,
        isAvailable: DataScannerViewController.isAvailable,
        supportsOneShotScanning: true,
        supportsContinuousScanning: true,
        supportsBarcodeRecognition: true,
        supportsTextRecognition: true,
        supportsMultipleItems: true,
        supportsHighFrameRateTracking: true,
        supportsPinchToZoom: true,
        supportsAutoZoom: false,
        supportsManualInput: false,
        supportsGuidance: true,
        supportsHighlighting: true,
        supportsRegionOfInterest: true,
        supportsZoomFactor: true,
        supportsPhotoCapture: true,
        supportedBarcodeFormats: [
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
          .msiPlessey,
          .pdf417,
          .qr,
          .upcE,
        ],
        supportedTextContentTypes: [
          .url,
          .dateTimeDuration,
          .emailAddress,
          .flightNumber,
          .fullStreetAddress,
          .shipmentTrackingNumber,
          .telephoneNumber,
          .currency,
        ],
        supportedTextRecognitionLanguages: DataScannerViewController.supportedTextRecognitionLanguages)
    }
    #endif

    return DataScannerCapabilities(
      isSupported: false,
      isAvailable: false,
      supportsOneShotScanning: false,
      supportsContinuousScanning: false,
      supportsBarcodeRecognition: false,
      supportsTextRecognition: false,
      supportsMultipleItems: false,
      supportsHighFrameRateTracking: false,
      supportsPinchToZoom: false,
      supportsAutoZoom: false,
      supportsManualInput: false,
      supportsGuidance: false,
      supportsHighlighting: false,
      supportsRegionOfInterest: false,
      supportsZoomFactor: false,
      supportsPhotoCapture: false,
      supportedBarcodeFormats: [],
      supportedTextContentTypes: [],
      supportedTextRecognitionLanguages: [])
  }

  static func validate(configuration: DataScannerConfiguration) throws {
    if configuration.isAutoZoomEnabled == true {
      throw RuntimeError("Automatic zoom is not supported by the iOS data scanner.")
    }
    if configuration.isManualInputEnabled == true {
      throw RuntimeError("Manual barcode input is not supported by the iOS data scanner.")
    }
  }
}
