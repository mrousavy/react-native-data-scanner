# react-native-data-scanner

Camera-based code scanning for React Native, implemented with Nitro Modules.

## Installation

```sh
bun add react-native-data-scanner react-native-nitro-modules
```

Run the native install step for your app after installing.

```sh
cd ios && pod install
```

## Usage

```tsx
import { DataScanner } from 'react-native-data-scanner'

const capabilities = await DataScanner.getCapabilities()

if (capabilities.isCodeScannerAvailable) {
  const code = await DataScanner.scanCode({
    barcodeFormats: ['qr', 'ean-13'], // omit or pass ['all'] to scan every supported format
    enableAutoZoom: true,
    allowManualInput: true,
  })

  console.log(code.format, code.rawValue, code.valueType)
}
```

```tsx
const scanner = await DataScanner.createLiveScanner({
  barcodeFormats: ['all'],
})

const codeSubscription = scanner.addOnCodeScannedListener((code) => {
  console.log(code.format, code.rawValue)
})
const errorSubscription = scanner.addOnErrorListener((error) => {
  console.error(error)
})

await scanner.start()

codeSubscription.remove()
errorSubscription.remove()
await scanner.stop()
```

## Platform Notes

iOS uses VisionKit `DataScannerViewController`. Add `NSCameraUsageDescription` to your app's `Info.plist`; scanning rejects before requesting camera access when the key is missing. VisionKit data scanning requires iOS 16 or newer and a supported device. The live scanner workflow is available on iOS.

Android uses Google Play services Code Scanner (`play-services-code-scanner`). It does not require your app to request camera permission. The library manifest includes the `barcode_ui` ML Kit module metadata so Play services can download the scanner module during app install when supported. Google Code Scanner is a one-shot scanner UI, so `createLiveScanner()` rejects on Android.

## API

`DataScanner.getCapabilities()` returns current availability, supported barcode formats, and whether manual input or auto-zoom are supported.

`DataScanner.scanCode(options?)` opens the native scanner and resolves with the first scanned code. It rejects when scanning is unavailable, the user cancels, camera permission is denied on iOS, or the scanned code has no text payload.

`DataScanner.createLiveScanner(options?)` creates a native live scanner object. Use `addOnCodeScannedListener()` and `addOnErrorListener()` before `start()`, and call `stop()` to dismiss the native scanner UI.
