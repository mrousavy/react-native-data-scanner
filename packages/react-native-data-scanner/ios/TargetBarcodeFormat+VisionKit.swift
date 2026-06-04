#if os(iOS)
  import NitroModules
  import Vision
  import VisionKit

  @available(iOS 16.0, *)
  extension Array where Element == TargetBarcodeFormat {
    func visionSymbologies() throws -> [VNBarcodeSymbology] {
      if contains(.all) {
        return []
      }

      return try map { try $0.visionSymbology() }
    }
  }

  @available(iOS 16.0, *)
  extension TargetBarcodeFormat {
    func visionSymbology() throws -> VNBarcodeSymbology {
      switch self {
      case .all:
        throw RuntimeError.error(
          withMessage: "TargetBarcodeFormat.all must be handled before mapping to VisionKit."
        )
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
        throw RuntimeError.error(
          withMessage:
            "The 'upc-a' barcode format is not supported by the iOS VisionKit scanner."
        )
      case .upcE:
        return .upce
      }
    }
  }

  @available(iOS 16.0, *)
  extension DataScannerQualityLevel {
    var visionQualityLevel: DataScannerViewController.QualityLevel {
      switch self {
      case .fast:
        return .fast
      case .balanced:
        return .balanced
      case .accurate:
        return .accurate
      }
    }
  }
#endif
