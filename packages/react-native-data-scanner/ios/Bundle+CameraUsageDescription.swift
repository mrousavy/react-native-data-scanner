import Foundation
import NitroModules

extension Bundle {
  func checkCameraUsageDescription() throws {
    let value = object(forInfoDictionaryKey: "NSCameraUsageDescription") as? String
    guard let value, !value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      throw RuntimeError("Missing NSCameraUsageDescription in the app's Info.plist.")
    }
  }
}
