import UIKit

extension UIApplication {
  var dataScannerTopViewController: UIViewController? {
    let keyWindow = connectedScenes
      .compactMap { $0 as? UIWindowScene }
      .flatMap(\.windows)
      .first { $0.isKeyWindow }

    return keyWindow?.rootViewController?.dataScannerTopViewController
  }
}

private extension UIViewController {
  var dataScannerTopViewController: UIViewController {
    if let presentedViewController {
      return presentedViewController.dataScannerTopViewController
    }

    if let navigationController = self as? UINavigationController,
       let visibleViewController = navigationController.visibleViewController {
      return visibleViewController.dataScannerTopViewController
    }

    if let tabBarController = self as? UITabBarController,
       let selectedViewController = tabBarController.selectedViewController {
      return selectedViewController.dataScannerTopViewController
    }

    return self
  }
}
