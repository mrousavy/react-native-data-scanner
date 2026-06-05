# react-native-data-scanner

One-shot barcode scanning for React Native, implemented with Nitro Modules.

- iOS uses VisionKit's `DataScannerViewController`.
- Android uses ML Kit's Google code scanner UI.

## Usage

```ts
import { DataScanner } from 'react-native-data-scanner'

const barcode = await DataScanner.scan({
  targetFormats: ['qr-code', 'aztec'],
  enableAutoZoom: true,
})

console.log(barcode.format, barcode.rawValue)
```

`targetFormats` defaults to `'all'`. `enableAutoZoom` is a best-effort preference and currently applies to Android's Google code scanner.

Supported `targetFormats` values are:

```ts
type TargetBarcodeFormat =
  | 'code-128'
  | 'code-39'
  | 'code-93'
  | 'codabar'
  | 'data-matrix'
  | 'ean-13'
  | 'ean-8'
  | 'itf'
  | 'qr-code'
  | 'upc-a'
  | 'upc-e'
  | 'pdf-417'
  | 'aztec'
```

iOS does not expose UPC-A as a distinct target symbology. Passing `['upc-a']` rejects on iOS; use `'all'` or `['ean-13']` there.

## Result

```ts
interface Barcode {
  format: BarcodeFormat
  rawValue: string | undefined
  displayValue: string | undefined
}
```

`rawValue` is `undefined` when the native scanner cannot represent the barcode payload as a string.

## iOS

Add a camera usage description to your app's `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Allow this app to scan barcodes with the camera.</string>
```

Scanning requires iOS 16 or newer and a device that supports VisionKit data scanning.

## Android

The Google code scanner requires Android API level 23 or newer. The library includes:

```gradle
implementation "com.google.android.gms:play-services-code-scanner:16.1.0"
```

The library manifest also requests the Play services `barcode_ui` module for install-time download when the app is installed from the Play Store.
