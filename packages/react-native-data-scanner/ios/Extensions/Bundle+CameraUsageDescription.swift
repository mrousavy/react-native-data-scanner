import Foundation
import NitroModules

extension Bundle {
  func checkCameraUsageDescription() throws {
    guard let value = object(forInfoDictionaryKey: "NSCameraUsageDescription") else {
      throw RuntimeError("Missing NSCameraUsageDescription in the app's Info.plist!")
    }
    guard let cameraUsageDescription = value as? String, !cameraUsageDescription.isEmpty else {
      throw RuntimeError("The NSCameraUsageDescription in the app's Info.plist is not a valid string!")
    }
  }
}
