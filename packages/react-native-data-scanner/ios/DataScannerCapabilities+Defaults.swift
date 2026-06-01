import NitroModules
import Foundation
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
  #if os(iOS) && !targetEnvironment(macCatalyst)
  private static func readOnMainActor<T>(_ body: @MainActor @escaping () -> T) -> T {
    if Thread.isMainThread {
      return MainActor.assumeIsolated(body)
    }
    return DispatchQueue.main.sync {
      MainActor.assumeIsolated(body)
    }
  }
  #endif

  static var current: DataScannerCapabilities {
    #if os(iOS) && !targetEnvironment(macCatalyst)
    if #available(iOS 16.0, *) {
      var supportedBarcodeFormats: [BarcodeFormat] = [
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
        supportedBarcodeFormats.append(.msiPlessey)
      }

      var supportedTextContentTypes: [TextContentType] = [
        .url,
        .dateTimeDuration,
        .emailAddress,
        .flightNumber,
        .fullStreetAddress,
        .shipmentTrackingNumber,
        .telephoneNumber,
      ]
      if #available(iOS 17.0, *) {
        supportedTextContentTypes.append(.currency)
      }

      return DataScannerCapabilities(
        isSupported: readOnMainActor { DataScannerViewController.isSupported },
        isAvailable: readOnMainActor { DataScannerViewController.isAvailable },
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
        supportedBarcodeFormats: supportedBarcodeFormats,
        supportedTextContentTypes: supportedTextContentTypes,
        supportedTextRecognitionLanguages: readOnMainActor {
          DataScannerViewController.supportedTextRecognitionLanguages
        })
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
    let capabilities = DataScannerCapabilities.current

    if !capabilities.isSupported {
      throw RuntimeError("The iOS data scanner requires iOS 16 or newer on a supported device.")
    }
    if configuration.isAutoZoomEnabled == true {
      throw RuntimeError("Automatic zoom is not supported by the iOS data scanner.")
    }
    if configuration.isManualInputEnabled == true {
      throw RuntimeError("Manual barcode input is not supported by the iOS data scanner.")
    }

    let recognizes = configuration.recognizes
    if recognizes?.barcode == nil && recognizes?.text == nil && recognizes != nil {
      throw RuntimeError("The iOS data scanner requires at least one recognized data type.")
    }

    if let formats = recognizes?.barcode?.formats {
      let unsupportedFormats = formats.filter { format in
        !capabilities.supportedBarcodeFormats.contains(format)
      }
      if !unsupportedFormats.isEmpty {
        let names = unsupportedFormats.map(\.stringValue).joined(separator: ", ")
        throw RuntimeError("Unsupported iOS barcode format(s): \(names).")
      }
    }

    if let textContentType = recognizes?.text?.contentType,
       !capabilities.supportedTextContentTypes.contains(textContentType) {
      throw RuntimeError("Unsupported iOS text content type: \(textContentType.stringValue).")
    }
  }
}
