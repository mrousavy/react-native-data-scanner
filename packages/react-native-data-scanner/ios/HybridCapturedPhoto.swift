import NitroModules
import Foundation

#if os(iOS) && !targetEnvironment(macCatalyst)
import UIKit

final class HybridCapturedPhoto: HybridCapturedPhotoSpec {
  let width: Double
  let height: Double
  let byteSize: Double

  private let encodedData: Data

  init(image: UIImage) throws {
    guard let data = image.jpegData(compressionQuality: 1.0) ?? image.pngData() else {
      throw RuntimeError("Failed to encode captured iOS scanner photo.")
    }
    self.encodedData = data
    self.width = Double(image.cgImage?.width ?? Int(image.size.width * image.scale))
    self.height = Double(image.cgImage?.height ?? Int(image.size.height * image.scale))
    self.byteSize = Double(data.count)
    super.init()
  }

  func toArrayBuffer() throws -> Promise<ArrayBuffer> {
    return Promise.resolved(withResult: try ArrayBuffer.copy(data: encodedData))
  }

  func saveToTemporaryFile() throws -> Promise<String> {
    let data = encodedData
    return Promise.parallel {
      let url = FileManager.default.temporaryDirectory
        .appendingPathComponent(UUID().uuidString)
        .appendingPathExtension("jpg")
      try data.write(to: url, options: .atomic)
      return url.path
    }
  }
}

#endif
