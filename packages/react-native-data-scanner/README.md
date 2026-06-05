# react-native-data-scanner

One-shot barcode scanning for React Native, implemented as a Nitro Module.

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

Presents the native scanner UI and resolves with the first barcode the user selects.

- `targetFormats`: `'all'` or a non-empty array of barcode formats. Defaults to `'all'`.
- `enableAutoZoom`: best-effort native auto-zoom preference. Defaults to `false`.

The promise rejects when scanning is unavailable, the user cancels, another scan is already active, or the scanned barcode does not contain a decoded string value.

## iOS

Uses VisionKit `DataScannerViewController`. Apps must include `NSCameraUsageDescription` in `Info.plist`.

## Android

Uses Google ML Kit's Google code scanner through Google Play services. The library requests install-time download of the `barcode_ui` optional module through its Android manifest.
