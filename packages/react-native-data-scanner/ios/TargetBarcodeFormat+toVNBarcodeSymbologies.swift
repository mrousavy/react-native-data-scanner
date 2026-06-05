import Vision

extension TargetBarcodeFormat {
  func toVNBarcodeSymbologies() -> [VNBarcodeSymbology] {
    switch self {
    case .aztec:
      return [.aztec]
    case .codabar:
      return [.codabar]
    case .code128:
      return [.code128]
    case .code39:
      return [.code39]
    case .code93:
      return [.code93]
    case .dataMatrix:
      return [.dataMatrix]
    case .ean13:
      return [.ean13]
    case .ean8:
      return [.ean8]
    case .itf:
      return [.i2of5, .itf14]
    case .pdf417:
      return [.pdf417]
    case .qr:
      return [.qr]
    case .upcA:
      return [.ean13]
    case .upcE:
      return [.upce]
    }
  }
}
