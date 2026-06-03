/**
 * Represents a preference for the scanner's speed and recognition quality.
 *
 * Pass this through {@linkcode ScanCodeOptions.qualityLevel}. Platforms that do
 * not expose scanner quality tuning treat it as a best-effort preference.
 *
 * @see {@linkcode ScanCodeOptions.qualityLevel}
 */
export type DataScannerQualityLevel = 'fast' | 'balanced' | 'accurate'
