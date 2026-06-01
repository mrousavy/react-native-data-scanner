import type { Rect } from './Geometry'
import type { RecognizedDataType } from './RecognizedDataType'

/**
 * Represents the quality preference used when recognizing scanner items.
 *
 * @see {@linkcode DataScannerOptions.quality}
 */
export type RecognitionQuality = 'balanced' | 'fast' | 'accurate'

/**
 * Represents whether a scanner should track one item or many simultaneous
 * items.
 *
 * @see {@linkcode DataScannerOptions.itemRecognitionMode}
 */
export type ItemRecognitionMode = 'single' | 'multiple'

/**
 * Represents whether an optional scanner feature is preferred on or off.
 *
 * @see {@linkcode DataScannerFeaturePreferences.guidance}
 */
export type DataScannerFeaturePreference = 'enabled' | 'disabled'

/**
 * Represents best-effort scanner UI and tracking feature preferences.
 *
 * Unsupported preferences are ignored when the core requested data types can
 * still be scanned. Use {@linkcode DataScanner.capabilities} and
 * {@linkcode DataScanner.configuration} to inspect what was applied.
 *
 * @see {@linkcode DataScannerOptions.features}
 */
export interface DataScannerFeaturePreferences {
  /**
   * Whether native guidance UI should be shown while scanning.
   *
   * @default 'enabled'
   */
  guidance?: DataScannerFeaturePreference
  /**
   * Whether native highlights should be drawn around recognized items.
   *
   * @default 'disabled'
   */
  highlighting?: DataScannerFeaturePreference
  /**
   * Whether users should be able to pinch to zoom.
   *
   * @default 'enabled'
   */
  pinchToZoom?: DataScannerFeaturePreference
  /**
   * Whether tracked item geometry should update at a higher frame rate.
   *
   * @default 'enabled'
   */
  highFrameRateTracking?: DataScannerFeaturePreference
  /**
   * Whether users may manually type a barcode value when native UI supports it.
   *
   * @default 'disabled'
   */
  manualInput?: DataScannerFeaturePreference
  /**
   * Whether native UI may automatically zoom toward distant barcodes.
   *
   * @default 'disabled'
   */
  autoZoom?: DataScannerFeaturePreference
}

/**
 * Represents the resolved state of best-effort scanner features.
 *
 * @see {@linkcode DataScannerResolvedConfiguration.features}
 */
export interface ResolvedDataScannerFeatures {
  /**
   * Whether native guidance UI is enabled.
   */
  isGuidanceEnabled: boolean
  /**
   * Whether native item highlighting is enabled.
   */
  isHighlightingEnabled: boolean
  /**
   * Whether pinch-to-zoom is enabled.
   */
  isPinchToZoomEnabled: boolean
  /**
   * Whether high-frame-rate tracking is enabled.
   */
  isHighFrameRateTrackingEnabled: boolean
  /**
   * Whether manual barcode input is enabled.
   */
  isManualInputEnabled: boolean
  /**
   * Whether automatic barcode zoom is enabled.
   */
  isAutoZoomEnabled: boolean
}

/**
 * Represents creation options for {@linkcode DataScannerFactory.createDataScanner}.
 *
 * @see {@linkcode DataScannerFactory.createDataScanner}
 */
export interface DataScannerOptions {
  /**
   * Required data types the scanner should recognize.
   *
   * Omit this field to scan all data types supported by the current backend.
   * Creating a scanner throws when a required data type or required format is
   * unsupported.
   */
  recognizedDataTypes?: RecognizedDataType[]
  /**
   * Recognition speed and accuracy preference.
   *
   * @default 'balanced'
   */
  quality?: RecognitionQuality
  /**
   * Whether the scanner should recognize one item or multiple simultaneous
   * items.
   *
   * @default 'single'
   */
  itemRecognitionMode?: ItemRecognitionMode
  /**
   * Best-effort native UI and tracking feature preferences.
   */
  features?: DataScannerFeaturePreferences
  /**
   * Initial area of the camera view to search for items.
   *
   * Omit this field to search the full camera view.
   */
  regionOfInterest?: Rect
}
