import type { HybridObject } from 'react-native-nitro-modules'
import type { CapturedPhoto } from './CapturedPhoto'
import type {
  DataScannerCapabilities,
  DataScannerResolvedConfiguration,
  ZoomRange,
} from './DataScannerCapabilities'
import type {
  ScannedItemsChangedEvent,
  ZoomChangedEvent,
} from './DataScannerEvents'
import type { Rect } from './Geometry'
import type { ListenerSubscription } from './ListenerSubscription'
import type { ScannedItem } from './ScannedItem'

/**
 * Represents a native scanner that can present camera scanning UI and return
 * recognized text or barcode values.
 *
 * Use {@linkcode DataScannerFactory.createDataScanner} to create an instance.
 *
 * @example
 * Scan one barcode or text value:
 * ```ts
 * const scanner = DataScanner.createDataScanner({
 *   recognizedDataTypes: [{ kind: 'barcode', formats: ['qr'] }],
 * })
 * const item = await scanner.scan()
 * if (item?.kind === 'barcode') {
 *   console.log(item.barcode?.rawValue)
 * }
 * ```
 *
 * @example
 * Track live iOS scanner updates when supported:
 * ```ts
 * const scanner = DataScanner.createDataScanner()
 * const subscription = scanner.addOnItemsChangedListener(({ allItems }) => {
 *   console.log(allItems)
 * })
 * try {
 *   await scanner.startScanning()
 * } finally {
 *   subscription.remove()
 *   await scanner.stopScanning()
 * }
 * ```
 *
 * @see {@linkcode DataScannerFactory.createDataScanner}
 */
export interface DataScanner
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * The native features this scanner instance can use.
   */
  readonly capabilities: DataScannerCapabilities

  /**
   * The resolved configuration this scanner instance uses.
   */
  readonly configuration: DataScannerResolvedConfiguration

  /**
   * Whether this scanner is currently running a scanning session.
   */
  readonly isScanning: boolean

  /**
   * The latest items recognized by a live scanning session.
   */
  readonly recognizedItems: ScannedItem[]

  /**
   * The current zoom range, or `undefined` when manual zoom is unsupported.
   */
  readonly zoomRange?: ZoomRange

  /**
   * The current zoom factor, or `undefined` when manual zoom is unsupported.
   */
  readonly zoomFactor?: number

  /**
   * The area currently searched for items, or `undefined` when the full camera
   * view is searched.
   */
  readonly regionOfInterest?: Rect

  /**
   * Presents a one-shot scanner UI and resolves with the selected item.
   *
   * On Android this uses Google Play services code scanner and can only return
   * a single barcode. On iOS this presents the configured scanner and resolves
   * with the item the user selects, or the first accepted item when the native
   * UI returns an automatic selection.
   *
   * @returns The scanned item, or `undefined` when the user cancels scanning.
   * @throws If the configured required data types are unsupported.
   * @throws If the scanner cannot access a usable camera or scanner module.
   */
  scan(): Promise<ScannedItem | undefined>

  /**
   * Starts a live scanning session.
   *
   * Live item tracking is available only when
   * {@linkcode DataScannerCapabilities.canTrackItems} is `true`. Callers that
   * only need a single result should use {@linkcode scan}.
   *
   * @throws If live tracking is unsupported for this scanner configuration.
   * @throws If the scanner cannot access a usable camera.
   */
  startScanning(): Promise<void>

  /**
   * Stops the active live scanning session.
   *
   * Calling this while the scanner is already stopped is a no-op.
   */
  stopScanning(): Promise<void>

  /**
   * Sets the manual camera zoom factor.
   *
   * Check {@linkcode zoomRange} before calling this method.
   *
   * @throws If manual zoom is unsupported.
   * @throws If the value is outside {@linkcode zoomRange}.
   */
  setZoomFactor(zoomFactor: number): Promise<void>

  /**
   * Sets the area of the camera view that should be searched for items.
   *
   * Passing `undefined` resets scanning to the full camera view.
   *
   * @throws If regions of interest are unsupported.
   */
  setRegionOfInterest(region?: Rect): Promise<void>

  /**
   * Captures a photo from the scanner camera and stores it in a temporary file.
   *
   * @throws If photo capture is unsupported.
   * @throws If no scanner camera session is active.
   */
  capturePhoto(): Promise<CapturedPhoto>

  /**
   * Adds a listener for live item changes.
   *
   * The returned {@linkcode ListenerSubscription} owns the native callback and
   * must be removed when the listener is no longer needed.
   */
  addOnItemsChangedListener(
    listener: (event: ScannedItemsChangedEvent) => void
  ): ListenerSubscription

  /**
   * Adds a listener for user-selected items.
   *
   * On iOS this maps to tapping an item in the live scanner UI. On Android this
   * fires when a one-shot scan succeeds.
   */
  addOnItemSelectedListener(
    listener: (item: ScannedItem) => void
  ): ListenerSubscription

  /**
   * Adds a listener for scanner errors that happen after creation.
   *
   * Synchronous creation and method-call failures still throw or reject through
   * the method that failed.
   */
  addOnErrorListener(listener: (error: Error) => void): ListenerSubscription

  /**
   * Adds a listener for native zoom changes.
   *
   * On iOS this maps to the VisionKit zoom delegate. Android returns an inert
   * subscription because Google Code Scanner does not expose zoom updates.
   */
  addOnZoomChangedListener(
    listener: (event: ZoomChangedEvent) => void
  ): ListenerSubscription
}
