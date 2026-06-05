import { describe, expect, it } from 'react-native-harness'
import {
  DataScanner,
  type ScanBarcodeOptions,
  type ScannedBarcode,
} from 'react-native-data-scanner'

const expectedQRCodeValue = 'https://margelo.com'

describe('DataScanner.scanBarcode', () => {
  it('scans a QR code with an explicit target format', async () => {
    const barcode = await scanBarcode({
      targetFormats: ['qr'],
      enableAutoZoom: false,
    })

    expect(barcode).toStrictEqual({
      format: 'qr',
      value: expectedQRCodeValue,
    })
  })

  it('scans a QR code with Android auto zoom enabled', async () => {
    const barcode = await scanBarcode({
      targetFormats: ['qr'],
      enableAutoZoom: true,
    })

    expect(barcode.format).toBe('qr')
    expect(barcode.value).toBe(expectedQRCodeValue)
  })
})

async function scanBarcode(
  options: ScanBarcodeOptions
): Promise<ScannedBarcode> {
  return await withTimeout(
    DataScanner.scanBarcode(options),
    90_000,
    `scan barcode with options ${JSON.stringify(options)}`
  )
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  label: string
): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(
            new Error(`Timed out after ${timeoutMs}ms while waiting to ${label}.`)
          )
        }, timeoutMs)
      }),
    ])
  } finally {
    if (timeout != null) {
      clearTimeout(timeout)
    }
  }
}
