import type { ScanOptions } from './ScanOptions'

/**
 * Represents the preferred balance between recognition speed and accuracy.
 *
 * The scanner treats this as a best-effort preference when the native platform
 * exposes a matching quality setting.
 *
 * @see {@linkcode ScanOptions.qualityLevel}
 */
export type DataScannerQualityLevel = 'fast' | 'balanced' | 'accurate'
