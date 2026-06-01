import type { ScannedItem } from './ScannedItem'
import type { ZoomRange } from './DataScannerCapabilities'

/**
 * Represents the kind of live item change reported by
 * {@linkcode DataScanner.addOnItemsChangedListener}.
 *
 * @see {@linkcode ScannedItemsChangedEvent.changeType}
 */
export type ScannedItemsChangeType = 'added' | 'updated' | 'removed'

/**
 * Represents a live scanner item update event.
 *
 * @see {@linkcode DataScanner.addOnItemsChangedListener}
 */
export interface ScannedItemsChangedEvent {
  /**
   * The kind of change reported for {@linkcode changedItems}.
   */
  changeType: ScannedItemsChangeType
  /**
   * The items affected by this update.
   */
  changedItems: ScannedItem[]
  /**
   * All items currently recognized by the scanner.
   */
  allItems: ScannedItem[]
}

/**
 * Represents a native zoom change event.
 *
 * @see {@linkcode DataScanner.addOnZoomChangedListener}
 */
export interface ZoomChangedEvent {
  /**
   * The scanner's current zoom factor.
   */
  zoomFactor: number
  /**
   * The scanner's current zoom range.
   */
  zoomRange?: ZoomRange
}
