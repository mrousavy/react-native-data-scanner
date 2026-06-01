import type { BarcodeFormat } from './BarcodeFormat'
import type {
  ItemRecognitionMode,
  RecognitionQuality,
  ResolvedDataScannerFeatures,
} from './DataScannerOptions'
import type { RecognizedDataType } from './RecognizedDataType'
import type { TextContentType } from './TextContentType'

/**
 * Represents the native reason scanning is currently unavailable.
 *
 * @see {@linkcode DataScannerCapabilities.unavailableReason}
 */
export type DataScannerUnavailableReason =
  | 'unsupported-device'
  | 'camera-permission-denied'
  | 'camera-restricted'
  | 'camera-unavailable'
  | 'scanner-module-unavailable'
  | 'unknown'

/**
 * Represents a manual zoom range for {@linkcode DataScanner.setZoomFactor}.
 *
 * @see {@linkcode DataScanner.zoomRange}
 */
export interface ZoomRange {
  /**
   * The minimum supported zoom factor.
   */
  min: number
  /**
   * The maximum supported zoom factor.
   */
  max: number
}

/**
 * Represents features and data types supported by the current device and
 * native scanner backend.
 *
 * @see {@linkcode DataScannerFactory.getCapabilities}
 */
export interface DataScannerCapabilities {
  /**
   * Whether the current device supports the native scanner backend.
   */
  isSupported: boolean
  /**
   * Whether scanning is currently available to the app.
   */
  isAvailable: boolean
  /**
   * Why scanning is unavailable, when known.
   */
  unavailableReason?: DataScannerUnavailableReason
  /**
   * Whether text scanning is supported.
   */
  canScanText: boolean
  /**
   * Whether barcode scanning is supported.
   */
  canScanBarcodes: boolean
  /**
   * Whether live item add, update, and remove events are supported.
   */
  canTrackItems: boolean
  /**
   * Whether multiple simultaneous recognized items are supported.
   */
  canScanMultipleItems: boolean
  /**
   * Whether scanner photo capture is supported.
   */
  canCapturePhoto: boolean
  /**
   * Whether the scanner can restrict recognition to a region of interest.
   */
  canSetRegionOfInterest: boolean
  /**
   * Whether the scanner can set a manual zoom factor.
   */
  canSetZoomFactor: boolean
  /**
   * Whether the scanner can let the user pinch to zoom.
   */
  canUsePinchToZoom: boolean
  /**
   * Whether the scanner can display guidance text while scanning.
   */
  canUseGuidance: boolean
  /**
   * Whether the scanner can highlight recognized items.
   */
  canUseHighlighting: boolean
  /**
   * Whether the scanner can update tracked item geometry at a higher frame rate.
   */
  canUseHighFrameRateTracking: boolean
  /**
   * Whether the scanner can let users manually type barcode values.
   */
  canUseManualInput: boolean
  /**
   * Whether the scanner can automatically zoom toward distant barcodes.
   */
  canUseAutoZoom: boolean
  /**
   * Barcode formats supported by this backend.
   */
  supportedBarcodeFormats: BarcodeFormat[]
  /**
   * Text content filters supported by this backend.
   */
  supportedTextContentTypes: TextContentType[]
  /**
   * BCP-47 language identifiers supported for text recognition.
   */
  supportedTextRecognitionLanguages: string[]
}

/**
 * Represents the native configuration actually applied to a
 * {@linkcode DataScanner}.
 *
 * @see {@linkcode DataScanner.configuration}
 */
export interface DataScannerResolvedConfiguration {
  /**
   * The required data types this scanner recognizes.
   */
  recognizedDataTypes: RecognizedDataType[]
  /**
   * The resolved recognition quality.
   */
  quality: RecognitionQuality
  /**
   * Whether the scanner recognizes one or multiple simultaneous items.
   */
  itemRecognitionMode: ItemRecognitionMode
  /**
   * The resolved best-effort UI and tracking features.
   */
  features: ResolvedDataScannerFeatures
}
