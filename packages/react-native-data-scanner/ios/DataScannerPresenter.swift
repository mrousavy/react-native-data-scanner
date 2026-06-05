import NitroModules
import UIKit

enum DataScannerPresenter {
  @MainActor
  static func topPresentedViewController() throws -> UIViewController {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let window =
      scenes
      .flatMap(\.windows)
      .first { $0.isKeyWindow }

    guard let rootViewController = window?.rootViewController else {
      throw RuntimeError("Cannot present the barcode scanner because no root view controller is available.")
    }

    var topViewController = rootViewController
    while let presentedViewController = topViewController.presentedViewController {
      topViewController = presentedViewController
    }
    return topViewController
  }
}
