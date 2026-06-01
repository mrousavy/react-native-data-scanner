/**
 * Represents a photo captured from the scanner camera by
 * {@linkcode DataScanner.capturePhoto}.
 *
 * @see {@linkcode DataScanner.capturePhoto}
 */
export interface CapturedPhoto {
  /**
   * A React Native image URI for the temporary photo file.
   */
  uri: string
  /**
   * The photo width in pixels.
   */
  width: number
  /**
   * The photo height in pixels.
   */
  height: number
}
