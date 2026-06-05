import Vision

extension VNBarcodeSymbology {
  func toBarcodeFormat() -> BarcodeFormat {
    switch self {
    case .aztec:
      return .aztec
    case .codabar:
      return .codabar
    case .code128:
      return .code128
    case .code39, .code39Checksum, .code39FullASCII, .code39FullASCIIChecksum:
      return .code39
    case .code93, .code93i:
      return .code93
    case .dataMatrix:
      return .dataMatrix
    case .ean13:
      return .ean13
    case .ean8:
      return .ean8
    case .i2of5, .i2of5Checksum, .itf14:
      return .itf
    case .pdf417, .microPDF417:
      return .pdf417
    case .qr, .microQR:
      return .qr
    case .upce:
      return .upcE
    default:
      return .unknown
    }
  }
}
