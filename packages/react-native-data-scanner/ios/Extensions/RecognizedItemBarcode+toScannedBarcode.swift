import NitroModules
import VisionKit

@available(iOS 16.0, visionOS 1.0, *)
extension RecognizedItem.Barcode {
  func toScannedBarcode() throws -> ScannedBarcode {
    guard let value = payloadStringValue else {
      throw RuntimeError("Scanned barcode does not contain a decoded string value.")
    }

    let format = observation.symbology.toBarcodeFormat()
    return ScannedBarcode(value: value, format: format)
  }
}
