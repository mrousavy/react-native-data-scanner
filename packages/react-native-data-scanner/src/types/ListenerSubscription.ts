import type { LiveDataScanner } from '../specs/LiveDataScanner.nitro'

/**
 * Represents ownership of a listener registered with a scanner object.
 *
 * @see {@linkcode LiveDataScanner.addOnCodeScannedListener}
 */
export interface ListenerSubscription {
  /**
   * Removes the listener.
   *
   * Calling this more than once is safe.
   */
  remove: () => void
}
