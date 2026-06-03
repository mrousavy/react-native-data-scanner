import NitroModules
import Vision

extension TargetBarcodeFormat {
  @available(iOS 16.0, *)
  static func visionKitSymbologies(from formats: [TargetBarcodeFormat]) throws -> [VNBarcodeSymbology] {
    guard !formats.isEmpty else {
      throw RuntimeError("barcodeFormats must contain at least one format.")
    }

    if formats.contains(.all) {
      guard formats.count == 1 else {
        throw RuntimeError("all cannot be combined with specific barcode formats.")
      }
      return []
    }

    return try formats.map { format in
      try format.visionKitSymbology
    }
  }

  @available(iOS 16.0, *)
  var visionKitSymbology: VNBarcodeSymbology {
    get throws {
      switch self {
      case .all:
        throw RuntimeError("all cannot be combined with specific barcode formats.")
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
}
