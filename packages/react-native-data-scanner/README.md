# react-native-data-scanner

Super fast one-shot QR/Barcode/Data scanning for React Native built with [Nitro Modules](https://nitro.margelo.com) using platform-native UIs.
On Android, this does not even require Camera permission.

## Usage

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

## See more

See https://github.com/mrousavy/react-native-data-scanner
