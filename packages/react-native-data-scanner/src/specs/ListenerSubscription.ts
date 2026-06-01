/**
 * Represents ownership of a native listener registered on a
 * {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner.addOnItemsChangedListener}
 */
export interface ListenerSubscription {
  /**
   * Removes the listener.
   *
   * This method is idempotent and should be called from React effect cleanup
   * paths when the listener is no longer needed.
   */
  remove: () => void
}
