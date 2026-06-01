import NitroModules
import Foundation

#if os(iOS) && !targetEnvironment(macCatalyst)
import Vision
import VisionKit

@available(iOS 16.0, *)
final class HybridScannedBarcode: HybridScannedBarcodeSpec {
  let id: String
  let itemType: ScannedItemType = .barcode
  let bounds: Bounds?
  let format: BarcodeFormat
  let rawValue: String?
  let displayValue: String?
  let rawBytes: ArrayBuffer?
  let payload: BarcodePayload?

  init(barcode: RecognizedItem.Barcode) {
    self.id = barcode.id.uuidString
    self.bounds = Bounds(recognizedBounds: barcode.bounds)
    self.format = barcode.observation.symbology.toBarcodeFormat()
    self.rawValue = barcode.payloadStringValue
    self.displayValue = barcode.payloadStringValue
    self.rawBytes = barcode.observation.payloadArrayBuffer
    self.payload = nil
    super.init()
  }
}

private extension VNBarcodeSymbology {
  func toBarcodeFormat() -> BarcodeFormat {
    if self == .aztec {
      return .aztec
    } else if self == .codabar {
      return .codabar
    } else if self == .code128 {
      return .code128
    } else if self == .code39 {
      return .code39
    } else if self == .code39Checksum {
      return .code39Checksum
    } else if self == .code39FullASCII {
      return .code39FullAscii
    } else if self == .code39FullASCIIChecksum {
      return .code39FullAsciiChecksum
    } else if self == .code93 {
      return .code93
    } else if self == .code93i {
      return .code93i
    } else if self == .dataMatrix {
      return .dataMatrix
    } else if self == .ean13 {
      return .ean13
    } else if self == .ean8 {
      return .ean8
    } else if self == .gs1DataBar {
      return .gs1DataBar
    } else if self == .gs1DataBarExpanded {
      return .gs1DataBarExpanded
    } else if self == .gs1DataBarLimited {
      return .gs1DataBarLimited
    } else if self == .i2of5 {
      return .i2of5
    } else if self == .i2of5Checksum {
      return .i2of5Checksum
    } else if self == .itf14 {
      return .itf14
    } else if self == .microPDF417 {
      return .microPdf417
    } else if self == .microQR {
      return .microQr
    } else if self == .pdf417 {
      return .pdf417
    } else if self == .qr {
      return .qr
    } else if self == .upce {
      return .upcE
    }

    if #available(iOS 17.0, *), self == .msiPlessey {
      return .msiPlessey
    }

    return .unknown
  }
}

private extension VNBarcodeObservation {
  var payloadArrayBuffer: ArrayBuffer? {
    if #available(iOS 17.0, *), let payloadData {
      return try? ArrayBuffer.copy(data: payloadData)
    }
    return nil
  }
}

#endif
