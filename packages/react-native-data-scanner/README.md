# react-native-data-scanner

A Nitro Module for one-shot QR code and barcode scanning on iOS and Android.

## Usage

```ts
import { DataScanner } from 'react-native-data-scanner'

const code = await DataScanner.scan({
  formats: ['qr', 'ean-13'],
  qualityLevel: 'balanced',
  enableAutoZoom: true,
})

console.log(code.rawValue, code.format)
```

Use `formats: 'all'` or omit `formats` to scan every format supported by the native scanner.

## API

### `DataScanner.scan(options?)`

Opens the native camera scanner and resolves with one scanned code.

Options:

- `formats`: `'all'` or an array of requested formats. Defaults to `'all'`.
- `qualityLevel`: `'fast'`, `'balanced'`, or `'accurate'`. Defaults to `'balanced'`.
- `enableAutoZoom`: enables native automatic zoom when supported. Defaults to `false`.

Result:

- `rawValue`: raw text payload.
- `displayValue`: display-ready value when available.
- `format`: detected barcode format.
- `valueType`: parsed semantic value type when available.

## Platform Setup

iOS uses VisionKit and requires iOS 16 or newer. Add `NSCameraUsageDescription` to the app Info.plist.

Android uses the Google Code Scanner API through Google Play services. The library requires Android API level 23 or newer.
