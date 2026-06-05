# react-native-data-scanner

Fast one-shot barcode scanning for React Native, implemented as a Nitro Module and backed by platform-native scanner UIs.

On Android, scanning is provided through Google Play services and does not require camera permission from your app.

## Usage

```ts
import { DataScanner } from 'react-native-data-scanner'

const barcode = await DataScanner.scanBarcode({
  targetFormats: ['qr', 'ean-13'],
  enableAutoZoom: true,
})

console.log(barcode.format, barcode.value)
```

## API

### `DataScanner.scanBarcode(options?)`

Presents the scanner UI and resolves with the first barcode the user selects.

- `targetFormats`: optional non-empty array of barcode formats. Omit it to scan all supported formats.
- `qualityLevel`: quality/performance preference. Defaults to `'balanced'`.
- `enableHighFrameRateTracking`: high-frame-rate geometry tracking preference. Defaults to `false`.
- `enableAutoZoom`: automatic zoom preference for distant barcodes. Defaults to `false`.

The promise rejects when scanning is unavailable, the user cancels, another scan is already active, or the scanned barcode does not contain a decoded string value.

## iOS

Uses VisionKit `DataScannerViewController`. Apps must include `NSCameraUsageDescription` in `Info.plist`.

## Android

Uses Google ML Kit's Google code scanner through Google Play services. The library requests install-time download of the `barcode_ui` optional module through its Android manifest.
