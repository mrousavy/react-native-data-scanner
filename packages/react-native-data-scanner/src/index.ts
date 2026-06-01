import { NitroModules } from 'react-native-nitro-modules'
import type { DataScannerFactory } from './specs/DataScannerFactory.nitro'

export const DataScanner =
  NitroModules.createHybridObject<DataScannerFactory>('DataScannerFactory')

export type { BarcodeFormat } from './specs/BarcodeFormat'
export type {
  BarcodeAddressLabel,
  BarcodeAddressValue,
  BarcodeCalendarDateTime,
  BarcodeCalendarEventValue,
  BarcodeContactInfoValue,
  BarcodeContactLabel,
  BarcodeDriverLicenseValue,
  BarcodeEmailValue,
  BarcodeGeoValue,
  BarcodeParsedValue,
  BarcodePersonNameValue,
  BarcodePhoneValue,
  BarcodeSmsValue,
  BarcodeTextValue,
  BarcodeUrlValue,
  BarcodeValueType,
  BarcodeWifiEncryptionType,
  BarcodeWifiValue,
} from './specs/BarcodeValue'
export type { CapturedPhoto } from './specs/CapturedPhoto'
export type { DataScanner as DataScannerInstance } from './specs/DataScanner.nitro'
export type {
  DataScannerCapabilities,
  DataScannerResolvedConfiguration,
  DataScannerUnavailableReason,
  ZoomRange,
} from './specs/DataScannerCapabilities'
export type {
  ScannedItemsChangedEvent,
  ScannedItemsChangeType,
  ZoomChangedEvent,
} from './specs/DataScannerEvents'
export type {
  DataScannerFeaturePreference,
  DataScannerFeaturePreferences,
  DataScannerOptions,
  ItemRecognitionMode,
  RecognitionQuality,
  ResolvedDataScannerFeatures,
} from './specs/DataScannerOptions'
export type { DataScannerFactory } from './specs/DataScannerFactory.nitro'
export type { Point, Quadrilateral, Rect } from './specs/Geometry'
export type { ListenerSubscription } from './specs/ListenerSubscription'
export type {
  RecognizedBarcodeDataType,
  RecognizedDataType,
  RecognizedDataTypeKind,
  RecognizedTextDataType,
} from './specs/RecognizedDataType'
export type {
  ScannedBarcode,
  ScannedItem,
  ScannedItemBase,
  ScannedItemKind,
  ScannedText,
} from './specs/ScannedItem'
export type { TextContentType } from './specs/TextContentType'
