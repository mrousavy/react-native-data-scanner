import AVFoundation
import Dispatch
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
      complete(.success(()), completion)
    case .notDetermined:
      AVCaptureDevice.requestAccess(for: .video) { granted in
        if granted {
          complete(.success(()), completion)
        } else {
          complete(.failure(RuntimeError("Camera permission was denied.")), completion)
        }
      }
    case .denied:
      complete(.failure(RuntimeError("Camera permission was denied.")), completion)
    case .restricted:
      complete(.failure(RuntimeError("Camera access is restricted on this device.")), completion)
    @unknown default:
      complete(.failure(RuntimeError("Camera permission status is unknown.")), completion)
    }
  }

  private static func complete(
    _ result: Result<Void, Error>,
    _ completion: @escaping (Result<Void, Error>) -> Void
  ) {
    if Thread.isMainThread {
      completion(result)
    } else {
      DispatchQueue.main.async {
        completion(result)
      }
    }
  }
}
