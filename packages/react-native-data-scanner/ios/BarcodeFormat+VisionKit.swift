import NitroModules
import Vision
import VisionKit

extension BarcodeFormat {
  static var supportedVisionKitFormats: [BarcodeFormat] {
    [
      .aztec,
      .codabar,
      .code39,
      .code93,
      .code128,
      .dataMatrix,
      .ean8,
      .ean13,
      .itf,
      .pdf417,
      .qr,
      .upcE,
    ]
  }

  @available(iOS 16.0, *)
  static func visionKitSymbologies(from formats: [BarcodeFormat]?) throws -> [VNBarcodeSymbology] {
    guard let formats else {
      return []
    }

    guard !formats.isEmpty else {
      throw RuntimeError("barcodeFormats must contain at least one format or be omitted.")
    }

    return try formats.map { format in
      try format.visionKitSymbology
    }
  }

  @available(iOS 16.0, *)
  var visionKitSymbology: VNBarcodeSymbology {
    get throws {
      switch self {
      case .unknown:
        throw RuntimeError("unknown cannot be used as a required barcode format.")
      case .aztec:
        return .aztec
      case .codabar:
        return .codabar
      case .code39:
        return .code39
      case .code93:
        return .code93
      case .code128:
        return .code128
      case .dataMatrix:
        return .dataMatrix
      case .ean8:
        return .ean8
      case .ean13:
        return .ean13
      case .itf:
        return .i2of5
      case .pdf417:
        return .pdf417
      case .qr:
        return .qr
      case .upcA:
        throw RuntimeError("Barcode format upc-a is not supported by VisionKit on iOS.")
      case .upcE:
        return .upce
      }
    }
  }

  @available(iOS 16.0, *)
  init(symbology: VNBarcodeSymbology) {
    switch symbology {
    case .aztec:
      self = .aztec
    case .codabar:
      self = .codabar
    case .code39, .code39Checksum, .code39FullASCII, .code39FullASCIIChecksum:
      self = .code39
    case .code93, .code93i:
      self = .code93
    case .code128:
      self = .code128
    case .dataMatrix:
      self = .dataMatrix
    case .ean8:
      self = .ean8
    case .ean13:
      self = .ean13
    case .i2of5, .i2of5Checksum, .itf14:
      self = .itf
    case .pdf417:
      self = .pdf417
    case .qr:
      self = .qr
    case .upce:
      self = .upcE
    default:
      self = .unknown
    }
  }
}
