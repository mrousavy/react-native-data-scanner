import NitroModules
import Foundation

#if os(iOS) && !targetEnvironment(macCatalyst)
import VisionKit

@available(iOS 16.0, *)
final class HybridScannedText: HybridScannedTextSpec {
  let id: String
  let itemType: ScannedItemType = .text
  let bounds: Bounds?
  let text: String
  let contentType: TextContentType?

  init(text: RecognizedItem.Text, contentType: TextContentType?) {
    self.id = text.id.uuidString
    self.bounds = Bounds(recognizedBounds: text.bounds)
    self.text = text.transcript
    self.contentType = contentType
    super.init()
  }
}

#endif
