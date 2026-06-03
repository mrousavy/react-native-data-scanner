import AVFoundation
import Foundation
import NitroModules

enum CameraPermission {
  static func ensureCameraUsageDescription() throws {
    let value = Bundle.main.object(forInfoDictionaryKey: "NSCameraUsageDescription")
    guard value is String else {
      throw RuntimeError("Missing NSCameraUsageDescription in the app Info.plist.")
    }
  }

  static func requestIfNeeded(_ completion: @escaping (Result<Void, Error>) -> Void) {
    switch AVCaptureDevice.authorizationStatus(for: .video) {
    case .authorized:
      completion(.success(()))
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted {
          completion(.success(()))
        } else {
          completion(.failure(RuntimeError("Camera permission was denied.")))
        }
      }
    case .denied:
      completion(.failure(RuntimeError("Camera permission was denied.")))
    case .restricted:
      completion(.failure(RuntimeError("Camera access is restricted on this device.")))
    @unknown default:
      completion(.failure(RuntimeError("Camera permission status is unknown.")))
    }
  }
}
