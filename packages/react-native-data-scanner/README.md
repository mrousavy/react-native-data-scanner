# react-native-data-scanner

Fast one-shot QR/Barcode scanning for React Native powered by [Nitro Modules](https://nitro.margelo.com) and platform-native scanner UIs.

- On Android, [Google's Code Scanner](https://developers.google.com/ml-kit/vision/barcode-scanning/code-scanner) scans QR/Barcodes via a Google Play Services Activity, which does not require Camera permission.
- On iOS, VisionKit scans QR/Barcodes via a platform-native [`DataScannerViewController`](https://developer.apple.com/documentation/visionkit/datascannerviewcontroller).

## Usage

### 1. Install the package

```sh
npm install react-native-data-scanner react-native-nitro-modules
```

### 2. Configure Camera Usage (iOS only)

Choose the setup that matches your app:

<details>
<summary><strong>Expo</strong></summary>

Add [`NSCameraUsageDescription`](https://developer.apple.com/documentation/BundleResources/Information-Property-List/NSCameraUsageDescription) to your Expo app config, for example in `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to scan barcodes with the camera."
      }
    }
  }
}
```

This library contains native code, so Expo apps need a development build or production build. It does not run inside Expo Go. Rebuild the native app after changing native config, for example with `npx expo run:ios` or EAS Build.

</details>

<details>
<summary><strong>Bare React Native</strong></summary>

Add [`NSCameraUsageDescription`](https://developer.apple.com/documentation/BundleResources/Information-Property-List/NSCameraUsageDescription) to your app's `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Scan barcodes.</string>
```

</details>

Android does not require additional setup.

### 3. Scan a barcode

```tsx
import { DataScanner } from 'react-native-data-scanner'

async function scanBarcode() {
  const barcode = await DataScanner.scanBarcode({
    targetFormats: ['qr', 'ean-13'],
    enableAutoZoom: true,
  })

  console.log(barcode.format, barcode.value)
}
```

Calling `scanBarcode(...)` presents the native scanner UI and resolves with the scanned barcode.

## API

### `DataScanner.scanBarcode(options?)`

Presents the scanner UI and resolves with the first barcode the user scans.

| Option | Platform | Default | Description |
| --- | --- | --- | --- |
| `targetFormats` | iOS, Android | all supported formats | Optional non-empty array of barcode formats to scan for. |
| `qualityLevel` | iOS | `'balanced'` | Quality/performance preference. |
| `enableHighFrameRateTracking` | iOS | `false` | Enables higher-frame-rate updates for recognized-item geometry. |
| `enableAutoZoom` | Android | `false` | Enables automatic zoom while scanning distant barcodes. |

Supported target formats:

```ts
type TargetBarcodeFormat =
  | 'aztec'
  | 'codabar'
  | 'code-128'
  | 'code-39'
  | 'code-93'
  | 'data-matrix'
  | 'ean-13'
  | 'ean-8'
  | 'itf'
  | 'pdf-417'
  | 'qr'
  | 'upc-a'
  | 'upc-e'
```

The promise rejects when scanning is unavailable, the user cancels, another scan is already active, `targetFormats` is empty, or the scanned barcode does not contain a decoded string value.

## Android

Uses Google ML Kit's Google code scanner through Google Play services. The package requests install-time download of the `barcode_ui` optional module through its Android manifest.

## iOS

Uses VisionKit's `DataScannerViewController`, which requires iOS 16.0 or later and a valid `NSCameraUsageDescription`.

## Advanced Use Cases

For advanced use cases or an in-app `<Camera>` view, consider using [VisionCamera](https://visioncamera.margelo.com), a fully featured Camera library.
