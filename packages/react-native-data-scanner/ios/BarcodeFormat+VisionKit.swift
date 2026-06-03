import Vision

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
