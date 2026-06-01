import NitroModules
import Foundation

final class HybridListenerSubscription: HybridListenerSubscriptionSpec {
  private let lock = NSLock()
  private var onRemove: (() -> Void)?

  init(onRemove: @escaping () -> Void) {
    self.onRemove = onRemove
    super.init()
  }

  func remove() throws {
    lock.lock()
    let callback = onRemove
    onRemove = nil
    lock.unlock()
    callback?()
  }
}
