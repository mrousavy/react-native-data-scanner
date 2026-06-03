import NitroModules
import VisionKit

extension ScannedCode {
  @available(iOS 16.0, *)
  init(barcode: RecognizedItem.Barcode) throws {
    guard let rawValue = barcode.payloadStringValue else {
      throw RuntimeError("Scanned code does not contain a text payload.")
    }

    self.init(
      rawValue: rawValue,
      displayValue: nil,
      format: BarcodeFormat(symbology: barcode.observation.symbology),
      valueType: nil
    )
  }
}
