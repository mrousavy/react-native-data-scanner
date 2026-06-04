#if os(iOS)
  import UIKit

  extension UIViewController {
    static var dataScannerTopMostViewController: UIViewController? {
      let activeScenes = UIApplication.shared.connectedScenes.compactMap { scene in
        scene as? UIWindowScene
      }.filter { scene in
        scene.activationState == .foregroundActive
      }

      let keyWindow = activeScenes
        .flatMap(\.windows)
        .first { window in window.isKeyWindow }

      return keyWindow?.rootViewController?.dataScannerTopMostPresentedViewController()
    }

    private func dataScannerTopMostPresentedViewController() -> UIViewController {
      if let presentedViewController {
        return presentedViewController.dataScannerTopMostPresentedViewController()
      }

      if let navigationController = self as? UINavigationController,
        let visibleViewController = navigationController.visibleViewController
      {
        return visibleViewController.dataScannerTopMostPresentedViewController()
      }

      if let tabBarController = self as? UITabBarController,
        let selectedViewController = tabBarController.selectedViewController
      {
        return selectedViewController.dataScannerTopMostPresentedViewController()
      }

      return self
    }
  }
#endif
