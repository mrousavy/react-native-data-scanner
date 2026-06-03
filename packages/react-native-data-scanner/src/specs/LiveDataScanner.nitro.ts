import type { HybridObject } from 'react-native-nitro-modules'
import type { DataScannerApi } from '../types/DataScannerApi'
import type { ListenerSubscription } from '../types/ListenerSubscription'
import type { ScannedCode } from '../types/ScannedCode'

/**
 * Represents a live camera scanner created by
 * {@linkcode DataScannerApi.createLiveScanner}.
 *
 * The scanner owns native camera UI while it is started. Call
 * {@linkcode LiveDataScanner.stop} before dropping the object when scanning is no
 * longer needed.
 *
 * @see {@linkcode DataScannerApi.createLiveScanner}
 */
export interface LiveDataScanner
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Presents the scanner UI and starts streaming scanned codes.
   *
   * @throws If scanning is unavailable, camera permission is denied, or this
   * scanner is already running.
   * @see {@linkcode LiveDataScanner.stop}
   */
  start(): Promise<void>

  /**
   * Stops scanning and dismisses the native scanner UI if it is visible.
   *
   * @see {@linkcode LiveDataScanner.start}
   */
  stop(): Promise<void>

  /**
   * Adds a listener that receives recognized codes.
   *
   * Remove the listener by calling {@linkcode ListenerSubscription.remove}.
   *
   * @see {@linkcode ListenerSubscription}
   * @see {@linkcode ScannedCode}
   */
  addOnCodeScannedListener(
    callback: (code: ScannedCode) => void
  ): ListenerSubscription

  /**
   * Adds a listener that receives live scanner errors after
   * {@linkcode LiveDataScanner.start} has resolved.
   *
   * Remove the listener by calling {@linkcode ListenerSubscription.remove}.
   *
   * @see {@linkcode ListenerSubscription}
   */
  addOnErrorListener(callback: (error: Error) => void): ListenerSubscription
}
