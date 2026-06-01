import NitroModules
import Foundation

#if os(iOS) && !targetEnvironment(macCatalyst)
import CoreGraphics
import UIKit
import Vision
import VisionKit

@available(iOS 16.0, *)
extension DataScannerConfiguration {
  func toVisionRecognizedDataTypes() throws -> Set<DataScannerViewController.RecognizedDataType> {
    var recognizedDataTypes = Set<DataScannerViewController.RecognizedDataType>()
    let recognizes = self.recognizes

    if recognizes == nil || recognizes?.barcode != nil {
      let formats = recognizes?.barcode?.formats ?? []
      let symbologies = try formats.map { try $0.toVisionSymbology() }
      recognizedDataTypes.insert(.barcode(symbologies: symbologies))
    }

    if let textOptions = recognizes?.text {
      let languages = textOptions.languages ?? []
      let contentType = try textOptions.contentType?.toVisionTextContentType()
      recognizedDataTypes.insert(.text(languages: languages, textContentType: contentType))
    }

    guard !recognizedDataTypes.isEmpty else {
      throw RuntimeError("The iOS data scanner requires at least one recognized data type.")
    }
    return recognizedDataTypes
  }
}

@available(iOS 16.0, *)
extension QualityLevel {
  func toVisionQualityLevel() -> DataScannerViewController.QualityLevel {
    switch self {
    case .balanced:
      return .balanced
    case .fast:
      return .fast
    case .accurate:
      return .accurate
    }
  }
}

@available(iOS 16.0, *)
extension TextContentType {
  func toVisionTextContentType() throws -> DataScannerViewController.TextContentType {
    switch self {
    case .url:
      return .URL
    case .dateTimeDuration:
      return .dateTimeDuration
    case .emailAddress:
      return .emailAddress
    case .flightNumber:
      return .flightNumber
    case .fullStreetAddress:
      return .fullStreetAddress
    case .shipmentTrackingNumber:
      return .shipmentTrackingNumber
    case .telephoneNumber:
      return .telephoneNumber
    case .currency:
      if #available(iOS 17.0, *) {
        return .currency
      }
      throw RuntimeError("The currency text content type requires iOS 17 or newer.")
    }
  }
}

@available(iOS 16.0, *)
extension BarcodeFormat {
  func toVisionSymbology() throws -> VNBarcodeSymbology {
    switch self {
    case .aztec:
      return .aztec
    case .codabar:
      return .codabar
    case .code128:
      return .code128
    case .code39:
      return .code39
    case .code39Checksum:
      return .code39Checksum
    case .code39FullAscii:
      return .code39FullASCII
    case .code39FullAsciiChecksum:
      return .code39FullASCIIChecksum
    case .code93:
      return .code93
    case .code93i:
      return .code93i
    case .dataMatrix:
      return .dataMatrix
    case .ean13:
      return .ean13
    case .ean8:
      return .ean8
    case .gs1DataBar:
      return .gs1DataBar
    case .gs1DataBarExpanded:
      return .gs1DataBarExpanded
    case .gs1DataBarLimited:
      return .gs1DataBarLimited
    case .i2of5:
      return .i2of5
    case .i2of5Checksum:
      return .i2of5Checksum
    case .itf14:
      return .itf14
    case .microPdf417:
      return .microPDF417
    case .microQr:
      return .microQR
    case .msiPlessey:
      if #available(iOS 17.0, *) {
        return .msiPlessey
      }
      throw RuntimeError("The MSI Plessey barcode format requires iOS 17 or newer.")
    case .pdf417:
      return .pdf417
    case .qr:
      return .qr
    case .upcE:
      return .upce
    default:
      throw RuntimeError("The \(self.stringValue) barcode format is not supported by VisionKit on iOS.")
    }
  }
}

extension Rect {
  var cgRect: CGRect {
    return CGRect(x: x, y: y, width: width, height: height)
  }
}

@available(iOS 16.0, *)
extension Bounds {
  init(recognizedBounds: RecognizedItem.Bounds) {
    self.init(
      topLeft: Point(cgPoint: recognizedBounds.topLeft),
      topRight: Point(cgPoint: recognizedBounds.topRight),
      bottomRight: Point(cgPoint: recognizedBounds.bottomRight),
      bottomLeft: Point(cgPoint: recognizedBounds.bottomLeft))
  }
}

extension Point {
  init(cgPoint: CGPoint) {
    self.init(x: cgPoint.x, y: cgPoint.y)
  }
}

extension NSLock {
  func withLock<T>(_ body: () throws -> T) rethrows -> T {
    lock()
    defer { unlock() }
    return try body()
  }
}

extension UIViewController {
  @MainActor
  static func dataScannerTopMostPresenter() -> UIViewController? {
    let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
    let root = scenes
      .flatMap(\.windows)
      .first(where: \.isKeyWindow)?
      .rootViewController
    return root?.dataScannerTopMostPresentedViewController()
  }

  @MainActor
  private func dataScannerTopMostPresentedViewController() -> UIViewController {
    if let presentedViewController {
      return presentedViewController.dataScannerTopMostPresentedViewController()
    }
    if let navigationController = self as? UINavigationController,
       let visibleViewController = navigationController.visibleViewController {
      return visibleViewController.dataScannerTopMostPresentedViewController()
    }
    if let tabBarController = self as? UITabBarController,
       let selectedViewController = tabBarController.selectedViewController {
      return selectedViewController.dataScannerTopMostPresentedViewController()
    }
    return self
  }
}

#endif
