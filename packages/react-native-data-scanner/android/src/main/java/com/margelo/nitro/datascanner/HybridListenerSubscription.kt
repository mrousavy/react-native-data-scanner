package com.margelo.nitro.datascanner

import java.util.concurrent.atomic.AtomicReference

class HybridListenerSubscription(
  onRemove: () -> Unit,
) : HybridListenerSubscriptionSpec() {
  private val onRemoveRef = AtomicReference<(() -> Unit)?>(onRemove)

  override fun remove() {
    onRemoveRef.getAndSet(null)?.invoke()
  }
}
